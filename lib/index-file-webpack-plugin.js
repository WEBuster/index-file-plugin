var path = require('path')
var Promise = require('promise')
var assign = require("object-assign")

function IndexFilePlugin (fileNameList) {
  this.fileNameList = fileNameList ? getArray(fileNameList) : []
}

IndexFilePlugin.prototype.apply = function (resolver) {
  var fileNameList = this.fileNameList

  resolver.plugin('directory', function (req, done) {
    var isWebpack2 = !!req.descriptionFilePath
    var directory = isWebpack2
                  ? req.path
                  : resolver.join(req.path, req.request)

    resolver.fileSystem.stat(directory, function (err, stat) {
      if (err || !stat) return done()
      if (!stat.isDirectory()) return done()

      var requestList = getRequestList(directory, fileNameList)
      var chain = Promise.resolve()

      requestList.forEach(function (request) {
        chain = chain.then(function () {
          return doResolve(request, resolver, req, isWebpack2)
        })
      })
      chain.then(function () {
        done()
      }).catch(function (result) {
        done(null, result)
      })
    })
  })
}

function getRequestList (directory, fileNameList) {
  var directoryName = path.basename(directory)
  return fileNameList.map(function (fileName) {
    return path.join(directory, fileName.replace(/\[name\]/g, directoryName))
  })
}

function doResolve (request, resolver, req, isWebpack2) {
  return new Promise(function (resolve, reject) {
    var cb = function (err, result) {
      if (result) {
        reject(result)
      } else {
        resolve()
      }
    }
    if (isWebpack2) {
      resolver.doResolve('raw-file', assign({}, req, {
        path: request,
        relativePath: req.relativePath && resolver.join(req.relativePath, path.basename(request))
      }), null, cb)
    } else {
      resolver.doResolve('file', assign({}, req, {
        request: request
      }), cb)
    }
  })
}

function getArray (tar) {
  var isArray = Object.prototype.toString.call(tar) === '[object Array]'
  return isArray ? tar : [tar]
}

module.exports = IndexFilePlugin

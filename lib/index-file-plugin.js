var path = require('path')
var Promise = require('promise')

function IndexFilePlugin (fileNameList) {
  this.fileNameList = fileNameList ? getArray(fileNameList) : []
}

IndexFilePlugin.prototype.apply = function (resolver) {
  var fileNameList = this.fileNameList

  resolver.plugin('directory', function (req, done) {
    var directory = resolver.join(req.path, req.request)

    resolver.fileSystem.stat(directory, function (err, stat) {
      if (err || !stat) return done()
      if (!stat.isDirectory()) return done()

      var requestList = getRequestList(directory, fileNameList)
      var chain = Promise.resolve()

      requestList.forEach(function (request) {
        chain = chain.then(function () {
          return doResolve(request, resolver, req)
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

function doResolve (request, resolver, req) {
  return new Promise(function (resolve, reject) {
    resolver.doResolve('file', {
      path: req.path,
      query: req.query,
      request: request
    }, function (err, result) {
      if (result) {
        reject(result)
      } else {
        resolve()
      }
    })
  })
}

function getArray (tar) {
  var isArray = Object.prototype.toString.call(tar) === '[object Array]'
  return isArray ? tar : [tar]
}

module.exports = IndexFilePlugin

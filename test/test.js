var path = require('path')
var rimraf = require('rimraf')
var webpack = require('webpack')
var expect = require('chai').expect

describe('index-file-webpack-plugin', function () {

  var IndexFilePlugin = require('../')
  var outputDir = path.resolve(__dirname, './output')
  var globalConfig = {
    output: {
      path: outputDir,
      filename: 'test.build.js'
    }
  }

  function test (options, assert) {
    var config = Object.assign({}, globalConfig, options)
    webpack(config, function (err, stats) {
      if (stats.compilation.errors.length) {
        stats.compilation.errors.forEach(function (err) {
          console.error(err.message)
        })
      }
      assert(stats.compilation.errors)
    })
  }

  it('normal', function (done) {
    test({
      entry: './test/fixtures/normal'
    }, function (errors) {
      expect(errors).to.be.empty
      done()
    })
  })

  it('same-as-dirname', function (done) {
    test({
      entry: './test/fixtures/same-as-dirname',
      plugins: [
        new webpack.ResolverPlugin([
          new IndexFilePlugin('[name].js')
        ])
      ]
    }, function (errors) {
      expect(errors).to.be.empty
      done()
    })
  })

  it('specified-name', function (done) {
    test({
      entry: './test/fixtures/specified-name',
      plugins: [
        new webpack.ResolverPlugin([
          new IndexFilePlugin('hello.js')
        ])
      ]
    }, function (errors) {
      expect(errors).to.be.empty
      done()
    })
  })

  it('no extension', function (done) {
    test({
      entry: './test/fixtures/specified-name',
      plugins: [
        new webpack.ResolverPlugin([
          new IndexFilePlugin('hello')
        ])
      ]
    }, function (errors) {
      expect(errors).to.be.empty
      done()
    })
  })

})

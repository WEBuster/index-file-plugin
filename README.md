# index-file-plugin

[![Build Status](https://circleci.com/gh/WEBuster/index-file-plugin/tree/master.svg?style=shield)](https://circleci.com/gh/WEBuster/index-file-plugin/tree/master)
[![Version](https://img.shields.io/npm/v/index-file-plugin.svg?style=flat-square)](https://www.npmjs.com/package/index-file-plugin)
[![License](https://img.shields.io/npm/l/index-file-plugin.svg?style=flat-square)](LICENSE)

> A webpack resolver plugin to specify directory index file.

## Install

```shell
npm i -D index-file-plugin
```

## webpack config

```js
var IndexFilePlugin = require('index-file-plugin')
var webpack = require('webpack')
```

```js
{
  plugins: [
    new webpack.ResolverPlugin([
      new IndexFilePlugin([
        '[name].js',  // '[name]' is directory name.
        'main.js',
        'index.js'
      ])
    ])
  ]
}
```

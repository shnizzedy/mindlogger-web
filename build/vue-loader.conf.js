'use strict'
const utils = require('./utils')
const config = require('../config')
const isProduction = process.env.NODE_ENV === 'production'
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap

const loaders = utils.cssLoaders({
  sourceMap: sourceMapEnabled,
  extract: isProduction
});
loaders['scss'] = 'vue-style-loader!css-loader!sass-loader';
loaders['sass'] = 'vue-style-loader!css-loader!sass-loader?indentedSyntax';

module.exports = {
  loaders: loaders,
  cssSourceMap: sourceMapEnabled,
  cacheBusting: config.dev.cacheBusting,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}

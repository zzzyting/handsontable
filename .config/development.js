var configFactory = require('./base');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var path = require('path');
var webpack = require('webpack');

var env = process.env.NODE_ENV;
var PACKAGE_NAME = configFactory.PACKAGE_NAME;

module.exports.PACKAGE_NAME = PACKAGE_NAME;

module.exports.create = function create() {
  var configBase = configFactory.create();
  var configFull = configFactory.create();

  configBase.forEach(function(c) {
    c.output.filename = PACKAGE_NAME + '.js';
    // Exclude all external dependencies from 'base' bundle (handsontable.js and handsontable.css files)
    c.externals = {
      numbro: {
        root: 'numbro',
        commonjs2: 'numbro',
        commonjs: 'numbro',
        amd: 'numbro',
      },
      moment: {
        root: 'moment',
        commonjs2: 'moment',
        commonjs: 'moment',
        amd: 'moment',
      },
      pikaday: {
        root: 'Pikaday',
        commonjs2: 'pikaday',
        commonjs: 'pikaday',
        amd: 'pikaday',
      },
      zeroclipboard: {
        root: 'ZeroClipboard',
        commonjs2: 'zeroclipboard',
        commonjs: 'zeroclipboard',
        amd: 'zeroclipboard',
      }
    };
    c.module.rules.unshift({
      test: [
         // Disable loading css files from pikaday module
        /pikaday\/css/,
      ],
      loader: path.resolve(__dirname, 'loader/empty-loader.js'),
    });
    c.plugins.push(
      new ExtractTextPlugin(PACKAGE_NAME + '.css')
    );
  });

  configFull.forEach(function(c) {
    c.output.filename = PACKAGE_NAME + '.full.js';
    c.plugins.push(
      new ExtractTextPlugin(PACKAGE_NAME + '.full.css')
    );
  });

  return [].concat(configBase, configFull);
}
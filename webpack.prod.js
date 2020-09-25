const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const optimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
  entry:{
    index:'./src/index.js',
    search:'./src/search.js'
  },
  output:{
    filename:'[name]_[chunkhash:8].js',
    path:path.resolve(__dirname,'dist')
  },
  watch:true,
  watchOptions:{
    ignored:/node_modules/,
    aggregateTimeout:300,
    poll:1000
  },
  mode:'production',
  module:{
    rules:[
      {
        test:/.js$/,
        use:'babel-loader'
      },
      {
        test:/.css$/,
        use:[
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test:/.less$/,
        use:[
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
          {
            loader:'postcss-loader',
          }
        ]
      },
      {
        test:/.(png|svg|jpg|gif)$/,
        use:[
          {
            loader:'file-loader',
            options:{
              name:'[name]_[hash:8].[ext]'
            }
          },
        ]
      }
    ]
  },
  plugins:[
    new MiniCssExtractPlugin({
      filename:'[name]_[contenthash].css'
    }),
    new optimizeCssAssetsWebpackPlugin({
      assetNameRegExp:/\.css$/g,
      cssProcessor:require('cssnano')
    }),
    new HtmlWebpackPlugin({
      template:path.join(__dirname,'src/search.html'),
      filename:'search.html',
      chunks:['search'],
      inject:true,
      minify:{
        html5:true,
        collapseWhitespace:true,
        preserveLineBreaks:false,
        minifyCSS:true,
        minifyJS:true,
        removeComments:false
      }
    }),
    new HtmlWebpackPlugin({
      template:path.join(__dirname,'src/index.html'),
      filename:'index.html',
      chunks:['index'],
      inject:true,
      minify:{
        html5:true,
        collapseWhitespace:true,
        preserveLineBreaks:false,
        minifyCSS:true,
        minifyJS:true,
        removeComments:false
      }
    }),
    new CleanWebpackPlugin(),
  ]
}
const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
  entry:{
    index:'./src/index.js',
    search:'./src/search.js'
  },
  output:{
    filename:'[name].js',
    path:path.resolve(__dirname,'dist')
  },
  watch:true,
  watchOptions:{
    ignored:/node_modules/,
    aggregateTimeout:300,
    poll:1000
  },
  mode:'development',
  module:{
    rules:[
      {
        test:/.js$/,
        use:'babel-loader'
      },
      {
        test:/.css$/,
        use:[
          'style-loader',
          'css-loader'
        ]
      },
      {
        test:/.less$/,
        use:[
          'style-loader',
          'css-loader',
          'less-loader'
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
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
  ],
  devServer:{
    contentBase:'./dist',
    hot:true
  }
}
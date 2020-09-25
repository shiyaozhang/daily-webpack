const path = require('path');
const webpack = require('webpack');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const optimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const setMPA = ()=>{
  const entry = {};
  const htmlWebpackPlugins = [];

  const entryFiles = glob.sync(path.join(__dirname,'./src/*/index.js'));

  //console.log(entryFiles);
  Object.keys(entryFiles)
    .map((index) => {
      const entryFile = entryFiles[index];
      console.log(entryFile);
      const match = entryFile.match(/src\/(.*)\/index.js/);
      console.log(match);
      const pageName = match && match[1];
      console.log(pageName);
      entry[pageName] = entryFile;
      htmlWebpackPlugins.push(new HtmlWebpackPlugin({
        template:path.join(__dirname,`src/${pageName}/index.html`),
        filename:`${pageName}.html`,
        chunks:[pageName],
        inject:true,
        minify:{
          html5:true,
          collapseWhitespace:true,
          preserveLineBreaks:false,
          minifyCSS:true,
          minifyJS:true,
          removeComments:false
        }
      }),);
    })
    //console.log(entry);
    //console.log(htmlWebpackPlugins);
  return {
    entry,
    htmlWebpackPlugins
  }
}


const {entry, htmlWebpackPlugins } = setMPA();

module.exports = {
  entry,
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
          },
          {
            loader:'px2rem-loader',
            options:{
              remUnit:75,
              remPrecision:8
            }
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
    new CleanWebpackPlugin(),
  ].concat(htmlWebpackPlugins)
};
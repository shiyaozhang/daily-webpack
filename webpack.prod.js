const path = require('path');
const webpack = require('webpack');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const optimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
//const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');

const setMPA = ()=>{
  const entry = {};
  const htmlWebpackPlugins = [];
  const entryFiles = glob.sync(path.join(__dirname,'./src/*/index.js'));

  //console.log(entryFiles);
  Object.keys(entryFiles)
    .map((index) => {
      const entryFile = entryFiles[index];
      const match = entryFile.match(/src\/(.*)\/index.js/);
      const pageName = match && match[1];
      entry[pageName] = entryFile;
      htmlWebpackPlugins.push(new HtmlWebpackPlugin({
        template:path.join(__dirname,`src/${pageName}/index.html`),
        filename:`${pageName}.html`,
        chunks:['vendors',pageName],
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
    // new HtmlWebpackExternalsPlugin({
    //   externals: [
    //     {
    //       module: 'react',
    //       entry: 'https://now8.gtimg.com/now/lib/16.8.6/react.min.js',
    //       global: 'React',
    //     },
    //     {
    //       module: 'react-dom',
    //       entry: 'https://now8.gtimg.com/now/lib/16.8.6/react-dom.min.js',
    //       global: 'ReactDOM',
    //     },
    //   ],
    // })
  ].concat(htmlWebpackPlugins),
  optimization:{
    splitChunks:{
      minSize:1000,
      cacheGroups:{
        commons:{
          // test:/(react|react-dom)/,
          // name:'vendors',
          // chunks:'all'
          name:'commons',
          chunks:'all',
          minChunks:2
        }
      }
    }
  },
  //devtool:'source-map',
};
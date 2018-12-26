const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const friendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const nodemonPlugin = require('nodemon-webpack-plugin')

const path = require('path')
module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'bin'),
    filename: 'http2-serve',
    // sourceMapFilename: 'index.map',
    libraryTarget: 'commonjs2',
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  target: 'node',
  //devtool: 'source-map',
  performance: {
    hints: false,
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  watchOptions: {
    ignored: ['node_modules'],
  },
  node: {
    __filename: true,
    __dirname: true,
  },
  externals: nodeExternals({
    modulesFromFile: true,
    whitelist: [
      /\.(eot|woff|woff2|ttf|otf)$/,
      /\.(svg|png|jpg|jpeg|gif|ico|webm)$/,
      /\.(mp4|mp3|ogg|swf|webp)$/,
      /\.(css|scss|sass|less|styl)$/,
    ],
  }),
  plugins: [
    new webpack.WatchIgnorePlugin(['node_modules']),
    new nodemonPlugin(),
    new friendlyErrorsWebpackPlugin({
      clearConsole: process.env.NODE_ENV === 'development',
    }),
  ],
  optimization: {
    noEmitOnErrors: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              experimentalWatchApi: true,
            },
          },
        ],
      },
    ],
  },
}

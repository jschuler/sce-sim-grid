const path = require("path")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const glob = require("glob")
const nodeExternals = require('webpack-node-externals');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  // mode: "development",
  // devtool: "inline-source-map",
  mode: "production",
  // entry: {
  //   "bundle.min.css": glob.sync("dist/**/*.css").map(f => path.resolve(__dirname, f)),
  //   "bundle.min.js": glob.sync("dist/**/*.js").map(f => path.resolve(__dirname, f))
  // },
  entry: './src/index.ts',
  output: {
    // filename: "[name]",
    filename: "sce-sim-grid.js",
    // chunkFilename: '[id].chunk.[chunkhash].js',
    path: path.resolve(__dirname, 'bundle'),
    library: "sceSimGrid",
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  // adding .ts and .tsx to resolve.extensions will help babel look for .ts and .tsx files to transpile
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  // optimization: {
  //   concatenateModules: false,
  //   splitChunks: {
  //     cacheGroups: {
  //       styles: {
  //         name: 'styles',
  //         test: /\.css$/,
  //         chunks: 'all',
  //         enforce: true,
  //       },
  //     },
  //   },
  // },
  // target: 'node', // in order to ignore built-in modules like path, fs, etc.
  externals: [nodeExternals()],
  // expect consumer to have these dependencies
  // externals: {
  //   react: 'react',
  //   reactDOM: 'react-dom',
  //   reactCore: '@patternfly/react-core',
  //   reactIcons: '@patternfly/react-icons',
  //   reactExperimental: '@patternfly/react-core/dist/js/experimental'
  // },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
        // use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(jpg|jpeg|png|gif)$/i,
        include: [
          path.resolve(__dirname, "./node_modules/@patternfly/patternfly/assets"),
          path.resolve(__dirname, "./node_modules/@patternfly/react-core/dist/styles/assets/images"),
          path.resolve(__dirname, "./node_modules/@patternfly/react-styles/css/assets/images"),
          path.resolve(__dirname, "./node_modules/@patternfly/react-core/node_modules/@patternfly/react-styles/css/assets/images")
        ],
        use: ["file-loader"]
      }
    ],
  },
  plugins: [
    // new UglifyJsPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    })
  ],
}
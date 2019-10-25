const path = require("path")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  devtool: "source-map",
  mode: "production",
  entry: {
    'sce-sim-grid': './src/index.ts',
    // 'sce-sim-grid.min': './src/index.ts'
  },
  output: {
    path: path.resolve(__dirname, 'lib-umd'),
    filename: "[name].js",
    library: "sceSimGrid",
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  externals: [nodeExternals()],
  // expect consumer to have these dependencies
  // externals: {
  //   react: 'react',
  //   reactDOM: 'react-dom',
  //   reactCore: '@patternfly/react-core',
  //   reactIcons: '@patternfly/react-icons',
  //   reactExperimental: '@patternfly/react-core/dist/js/experimental'
  // },
  // optimization: {
  //   minimizer: [
  //     new UglifyJsPlugin({
  //       test: /min\.js(\?.*)?$/i,
  //       sourceMap: true
  //     }),
  //   ],
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
    new MiniCssExtractPlugin({
      filename: '[name].css',
    })
  ],
}
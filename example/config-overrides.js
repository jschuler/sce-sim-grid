const { override, removeModuleScopePlugin, addWebpackModuleRule, addWebpackResolve } = require('customize-cra');
const path = require('path');

module.exports = override(
  removeModuleScopePlugin(),
  addWebpackResolve({ symlinks: false }),
  // addWebpackModuleRule({
  //   test: /\.(js|mjs|jsx|ts|tsx)$/,
  //   enforce: 'pre',
  //   loader: require.resolve('eslint-loader'),
  //   exclude: /sym_src/
  // })
);

// module.exports = {
//   paths: function (paths, env) {        
//       paths.appSrc = path.resolve(__dirname, '../src');
//       return paths;
//   },
// }
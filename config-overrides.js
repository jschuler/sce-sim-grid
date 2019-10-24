/**
 * Important! - From now on, any time you add a peer dependency to your component 
 * library (eg. material-ui, redux), you need to add them as an alias in the config overides.
 */
const {
  override,
  addWebpackAlias,
} = require("customize-cra");

const path = require('path'); 

module.exports = override( 
  addWebpackAlias({
      react: path.resolve('./node_modules/react'), 
  }), 
)
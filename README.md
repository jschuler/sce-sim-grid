# sce-sim-grid

## Demo

The library can be tested by navigating to the example folder and running `yarn start`.
We use `yalc` to install this library package named `sce-sim-grid` under the example folder. This simulates as if we were pulling a distribution from npm.
```
yarn add global yalc
yarn build
yalc publish
cd example
yalc update
yarn start
```


## Schemas

The schemas under src/schemas were generated using `jsonix-schema-compiler` from scesim.xsd and DMN12.xsd.
These rules are used by JSONIX to convert from .scesim and .dmn files into JSON in [scesimUtils.ts](./components/utils/jsonixUtils.ts).

See the `compile:schemas` target in [package.json](./package.json).
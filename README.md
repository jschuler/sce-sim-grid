# sce-sim-grid

## Demo

[http://kogito.surge.sh](http://kogito.surge.sh)

The library can be tested by navigating to the example folder and running `yarn start`.
We use `yalc` to install this library package named `sce-sim-grid` under the example folder. This simulates as if we were pulling a distribution from npm.
```
yarn global add yalc
yarn build
yalc publish
cd example
yalc update
yarn install
yarn start
```

## Schemas

The schemas under src/schemas were generated using `jsonix-schema-compiler` from scesim.xsd and DMN12.xsd.
These rules are used by JSONIX to convert from .scesim and .dmn files into JSON in [scesimUtils.ts](./components/utils/jsonixUtils.ts).

See the `compile:schemas` target in [package.json](./package.json).

The `scesim.xsd` schema is from [drools-wb](https://github.com/gitgabrio/drools-wb/blob/DROOLS-3879/drools-wb-screens/drools-wb-scenario-simulation-editor/drools-wb-scenario-simulation-editor-kogito-marshaller/src/main/resources/scesim.xsd)

Running the command requires Java 1.8, running a newer version might net this [error](https://github.com/highsource/jsonix-schema-compiler/issues/81)
TODO: Find a way to load and use a local dependency of Java 1.8

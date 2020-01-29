# sce-sim-grid

## Demo

An example app that uses the sce-sim-grid package is under the `example` sub-directory.
It can be launched with `yarn start`.
It has also been uploaded to [http://kogito.surge.sh](http://kogito.surge.sh).

## Build

`yarn build` produces the library in three formats: lib-cjs, lib-esm, lib-umd

## Publish

After a build, the library can be packages with `npm pack` and then published with `npm publish`.

## Schemas

The schemas under src/schemas were generated using `jsonix-schema-compiler` from scesim.xsd and DMN12.xsd.
These rules are used by JSONIX to convert from .scesim and .dmn files into JSON in [scesimUtils.ts](./components/utils/jsonixUtils.ts).

See the `compile:schemas` target in [package.json](./package.json).

The `scesim.xsd` schema is from [drools-wb](https://github.com/gitgabrio/drools-wb/blob/DROOLS-3879/drools-wb-screens/drools-wb-scenario-simulation-editor/drools-wb-scenario-simulation-editor-kogito-marshaller/src/main/resources/scesim.xsd)

Running the command requires Java 1.8, running a newer version might net this [error](https://github.com/highsource/jsonix-schema-compiler/issues/81)
TODO: Find a way to load and use a local dependency of Java 1.8

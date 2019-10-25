import { Scesim } from '../../types/SceSim';

const Jsonix = require('./jsonix').Jsonix;

// Load the schema rules
const SceSimRules = require('../../schemas/scesim').scesim;
const DmnRules = require('../../schemas/dmn').dmn;

// Construct a Jsonix context - a factory for unmarshaller (parser) and marshaller (serializer)
const sceSimContext = new Jsonix.Context([SceSimRules]);
const dmnContext = new Jsonix.Context([DmnRules]);

// Create an unmarshaller (scesim => json)
const sceSimUnmarshaller = sceSimContext.createUnmarshaller();
const dmnUnmarshaller = dmnContext.createUnmarshaller();

// Create a marshaller (json => scesim)
const sceSimMarshaller = sceSimContext.createMarshaller();
const dmnMarshaller = dmnContext.createMarshaller();

/**
 * Convert a scesim XML string into JSON
 */
export const getJsonFromSceSim = (scesim: string) => {
  const unmarshalled = sceSimUnmarshaller.unmarshalString(scesim);
  // console.log(unmarshalled);
  return unmarshalled;
};

/**
 * Convert JSON to scesim XML string
 */
export const setSceSimFromJson = (json: Scesim) => {
  const marshalled = sceSimMarshaller.marshalString(json);
  // console.log(marshalled);
  return marshalled;
};

/**
 *
 * @param dmn Convert dmn XML string into JSON
 */
export const getJsonFromDmn = (dmn: string) => {
  const unmarshalled = dmnUnmarshaller.unmarshalString(dmn);
  // console.log(unmarshalled);
  return unmarshalled;
};

/**
 * Convert JSON to dmn XML string
 */
export const setDmnFromJson = (json: any) => {
  const marshalled = dmnMarshaller.marshalString(json);
  // console.log(marshalled);
  return marshalled;
};

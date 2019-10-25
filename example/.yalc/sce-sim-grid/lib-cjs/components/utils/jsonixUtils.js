"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Jsonix = require('./jsonix').Jsonix;
// Load the schema rules
var SceSimRules = require('../../schemas/scesim').scesim;
var DmnRules = require('../../schemas/dmn').dmn;
// Construct a Jsonix context - a factory for unmarshaller (parser) and marshaller (serializer)
var sceSimContext = new Jsonix.Context([SceSimRules]);
var dmnContext = new Jsonix.Context([DmnRules]);
// Create an unmarshaller (scesim => json)
var sceSimUnmarshaller = sceSimContext.createUnmarshaller();
var dmnUnmarshaller = dmnContext.createUnmarshaller();
// Create a marshaller (json => scesim)
var sceSimMarshaller = sceSimContext.createMarshaller();
var dmnMarshaller = dmnContext.createMarshaller();
/**
 * Convert a scesim XML string into JSON
 */
exports.getJsonFromSceSim = function (scesim) {
    var unmarshalled = sceSimUnmarshaller.unmarshalString(scesim);
    // console.log(unmarshalled);
    return unmarshalled;
};
/**
 * Convert JSON to scesim XML string
 */
exports.setSceSimFromJson = function (json) {
    var marshalled = sceSimMarshaller.marshalString(json);
    // console.log(marshalled);
    return marshalled;
};
/**
 *
 * @param dmn Convert dmn XML string into JSON
 */
exports.getJsonFromDmn = function (dmn) {
    var unmarshalled = dmnUnmarshaller.unmarshalString(dmn);
    // console.log(unmarshalled);
    return unmarshalled;
};
/**
 * Convert JSON to dmn XML string
 */
exports.setDmnFromJson = function (json) {
    var marshalled = dmnMarshaller.marshalString(json);
    // console.log(marshalled);
    return marshalled;
};
//# sourceMappingURL=jsonixUtils.js.map
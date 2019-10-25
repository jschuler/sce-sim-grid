import { Scesim } from '../../types/SceSim';
/**
 * Convert a scesim XML string into JSON
 */
export declare const getJsonFromSceSim: (scesim: string) => any;
/**
 * Convert JSON to scesim XML string
 */
export declare const setSceSimFromJson: (json: Scesim) => any;
/**
 *
 * @param dmn Convert dmn XML string into JSON
 */
export declare const getJsonFromDmn: (dmn: string) => any;
/**
 * Convert JSON to dmn XML string
 */
export declare const setDmnFromJson: (json: any) => any;

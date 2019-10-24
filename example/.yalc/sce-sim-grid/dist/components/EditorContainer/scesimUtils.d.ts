import { Scesim } from '../../types/SceSim';
export declare const getDmnFilePath: (data: Scesim) => string;
export declare const getColumnNames: (data: Scesim) => any[];
declare type Column = Array<({
    name?: string;
    field?: string;
    group?: string;
    children?: {
        name?: string;
        field?: string;
    }[];
})>;
export declare const getColumns: (data: Scesim, byGroup?: boolean) => {
    fieldIndices: any;
    other: Column;
    given: Column;
    expect: Column;
    numOther: number;
    numGiven: number;
    numExpect: number;
};
export declare const getRows: (data: Scesim, columns?: any) => any[];
export declare const getDefinitions: (data: {
    value: {
        itemDefinition?: any;
        drgElement?: any;
        name?: any;
    };
}) => any;
export {};

export namespace scesim {
    export const name: string;
    export const typeInfos: ({
        localName: string;
        typeName: string;
        propertyInfos: {
            name: string;
            required: boolean;
            elementName: {
                localPart: string;
            };
            typeInfo: string;
        }[];
    } | {
        localName: string;
        typeName: string;
        propertyInfos: {
            name: string;
            minOccurs: number;
            collection: boolean;
            elementName: {
                localPart: string;
            };
            typeInfo: string;
        }[];
    } | {
        localName: string;
        typeName: string;
        propertyInfos: {
            name: string;
            minOccurs: number;
            collection: boolean;
            elementName: {
                localPart: string;
            };
        }[];
    } | {
        localName: string;
        propertyInfos: ({
            name: string;
            required: boolean;
            elementName: {
                localPart: string;
            };
            typeInfo: string;
        } | {
            name: string;
            required: boolean;
            elementName: {
                localPart: string;
            };
            typeInfo?: undefined;
        } | {
            name: string;
            elementName: {
                localPart: string;
            };
            required?: undefined;
            typeInfo?: undefined;
        })[];
        typeName?: undefined;
    } | {
        localName: string;
        propertyInfos: ({
            name: string;
            required: boolean;
            elementName: {
                localPart: string;
            };
            typeInfo: string;
            attributeName?: undefined;
            type?: undefined;
        } | {
            name: string;
            attributeName: {
                localPart: string;
            };
            type: string;
            required?: undefined;
            elementName?: undefined;
            typeInfo?: undefined;
        })[];
        typeName?: undefined;
    } | {
        localName: string;
        typeName: string;
        propertyInfos: ({
            name: string;
            type: string;
            attributeName?: undefined;
        } | {
            name: string;
            attributeName: {
                localPart: string;
            };
            type: string;
        })[];
    } | {
        localName: string;
        typeName: string;
        propertyInfos: ({
            name: string;
            elementName: {
                localPart: string;
            };
            typeInfo: string;
        } | {
            name: string;
            elementName: {
                localPart: string;
            };
            typeInfo?: undefined;
        })[];
    } | {
        localName: string;
        typeName: string;
        propertyInfos: {
            name: string;
            required: boolean;
            collection: boolean;
            elementName: {
                localPart: string;
            };
            typeInfo: string;
        }[];
    } | {
        localName: string;
        propertyInfos: ({
            name: string;
            required: boolean;
            elementName: {
                localPart: string;
            };
            typeInfo: string;
        } | {
            name: string;
            elementName: {
                localPart: string;
            };
            typeInfo: string;
            required?: undefined;
        })[];
        typeName?: undefined;
    })[];
    export const elementInfos: {
        typeInfo: string;
        elementName: {
            localPart: string;
        };
    }[];
}

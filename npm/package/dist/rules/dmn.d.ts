export namespace dmn {
    export const name: string;
    export const defaultElementNamespaceURI: string;
    export const typeInfos: ({
        localName: string;
        typeName: string;
        baseTypeInfo: string;
        propertyInfos: ({
            name: string;
            type: string;
            required?: undefined;
            typeInfo?: undefined;
            minOccurs?: undefined;
            collection?: undefined;
            attributeName?: undefined;
        } | {
            name: string;
            required: boolean;
            type?: undefined;
            typeInfo?: undefined;
            minOccurs?: undefined;
            collection?: undefined;
            attributeName?: undefined;
        } | {
            name: string;
            typeInfo: string;
            type?: undefined;
            required?: undefined;
            minOccurs?: undefined;
            collection?: undefined;
            attributeName?: undefined;
        } | {
            name: string;
            minOccurs: number;
            collection: boolean;
            typeInfo: string;
            type?: undefined;
            required?: undefined;
            attributeName?: undefined;
        } | {
            name: string;
            attributeName: {
                localPart: string;
            };
            type: string;
            required?: undefined;
            typeInfo?: undefined;
            minOccurs?: undefined;
            collection?: undefined;
        } | {
            name: string;
            typeInfo: string;
            attributeName: {
                localPart: string;
            };
            type: string;
            required?: undefined;
            minOccurs?: undefined;
            collection?: undefined;
        })[];
        type?: undefined;
        values?: undefined;
    } | {
        localName: string;
        typeName: {
            namespaceURI: string;
            localPart: string;
        };
        baseTypeInfo: string;
        propertyInfos: ({
            name: string;
            type: string;
            minOccurs?: undefined;
            collection?: undefined;
            elementName?: undefined;
            typeInfo?: undefined;
        } | {
            name: string;
            minOccurs: number;
            collection: boolean;
            elementName: {
                localPart: string;
                namespaceURI: string;
            };
            typeInfo: string;
            type?: undefined;
        })[];
        type?: undefined;
        values?: undefined;
    } | {
        localName: string;
        typeName: string;
        baseTypeInfo: string;
        propertyInfos: ({
            name: string;
            type: string;
            typeInfo?: undefined;
            minOccurs?: undefined;
            collection?: undefined;
            mixed?: undefined;
            allowDom?: undefined;
        } | {
            name: string;
            type?: undefined;
            typeInfo?: undefined;
            minOccurs?: undefined;
            collection?: undefined;
            mixed?: undefined;
            allowDom?: undefined;
        } | {
            name: string;
            typeInfo: string;
            type?: undefined;
            minOccurs?: undefined;
            collection?: undefined;
            mixed?: undefined;
            allowDom?: undefined;
        } | {
            name: string;
            minOccurs: number;
            collection: boolean;
            typeInfo: string;
            type?: undefined;
            mixed?: undefined;
            allowDom?: undefined;
        } | {
            name: string;
            mixed: boolean;
            allowDom: boolean;
            typeInfo: string;
            type: string;
            minOccurs?: undefined;
            collection?: undefined;
        })[];
        type?: undefined;
        values?: undefined;
    } | {
        localName: string;
        typeName: {
            namespaceURI: string;
            localPart: string;
        };
        propertyInfos: {
            name: string;
            required: boolean;
            typeInfo: string;
            attributeName: {
                localPart: string;
            };
            type: string;
        }[];
        baseTypeInfo?: undefined;
        type?: undefined;
        values?: undefined;
    } | {
        localName: string;
        typeName: null;
        propertyInfos: {
            name: string;
            minOccurs: number;
            collection: boolean;
            mixed: boolean;
            type: string;
        }[];
        baseTypeInfo?: undefined;
        type?: undefined;
        values?: undefined;
    } | {
        localName: string;
        typeName: {
            namespaceURI: string;
            localPart: string;
        };
        baseTypeInfo: string;
        propertyInfos: ({
            name: string;
            type: string;
            elementName?: undefined;
            typeInfo?: undefined;
            required?: undefined;
            attributeName?: undefined;
        } | {
            name: string;
            elementName: {
                localPart: string;
                namespaceURI: string;
            };
            typeInfo: string;
            type?: undefined;
            required?: undefined;
            attributeName?: undefined;
        } | {
            name: string;
            required: boolean;
            typeInfo: string;
            attributeName: {
                localPart: string;
            };
            type: string;
            elementName?: undefined;
        } | {
            name: string;
            typeInfo: string;
            attributeName: {
                localPart: string;
            };
            type: string;
            elementName?: undefined;
            required?: undefined;
        })[];
        type?: undefined;
        values?: undefined;
    } | {
        localName: string;
        typeName: {
            namespaceURI: string;
            localPart: string;
        };
        baseTypeInfo: string;
        propertyInfos: ({
            name: string;
            type: string;
            elementName?: undefined;
            typeInfo?: undefined;
            attributeName?: undefined;
        } | {
            name: string;
            elementName: {
                localPart: string;
                namespaceURI: string;
            };
            typeInfo: string;
            type?: undefined;
            attributeName?: undefined;
        } | {
            name: string;
            attributeName: {
                localPart: string;
            };
            type: string;
            elementName?: undefined;
            typeInfo?: undefined;
        } | {
            name: string;
            typeInfo: string;
            attributeName: {
                localPart: string;
            };
            type: string;
            elementName?: undefined;
        })[];
        type?: undefined;
        values?: undefined;
    } | {
        localName: string;
        typeName: string;
        propertyInfos: ({
            name: string;
            required: boolean;
            typeInfo: string;
            mixed?: undefined;
            allowDom?: undefined;
            type?: undefined;
        } | {
            name: string;
            mixed: boolean;
            allowDom: boolean;
            typeInfo: string;
            type: string;
            required?: undefined;
        })[];
        baseTypeInfo?: undefined;
        type?: undefined;
        values?: undefined;
    } | {
        localName: string;
        typeName: string;
        propertyInfos: ({
            name: string;
            type: string;
            typeInfo?: undefined;
            attributeName?: undefined;
        } | {
            name: string;
            type?: undefined;
            typeInfo?: undefined;
            attributeName?: undefined;
        } | {
            name: string;
            typeInfo: string;
            type?: undefined;
            attributeName?: undefined;
        } | {
            name: string;
            typeInfo: string;
            attributeName: {
                localPart: string;
            };
            type: string;
        } | {
            name: string;
            attributeName: {
                localPart: string;
            };
            type: string;
            typeInfo?: undefined;
        })[];
        baseTypeInfo?: undefined;
        type?: undefined;
        values?: undefined;
    } | {
        localName: string;
        typeName: string;
        baseTypeInfo: string;
        propertyInfos: ({
            name: string;
            type: string;
            required?: undefined;
            typeInfo?: undefined;
            attributeName?: undefined;
        } | {
            name: string;
            required: boolean;
            type?: undefined;
            typeInfo?: undefined;
            attributeName?: undefined;
        } | {
            name: string;
            required: boolean;
            typeInfo: string;
            type?: undefined;
            attributeName?: undefined;
        } | {
            name: string;
            attributeName: {
                localPart: string;
            };
            type: string;
            required?: undefined;
            typeInfo?: undefined;
        })[];
        type?: undefined;
        values?: undefined;
    } | {
        localName: string;
        typeName: string;
        baseTypeInfo: string;
        propertyInfos: ({
            name: string;
            type: string;
            typeInfo?: undefined;
            required?: undefined;
            mixed?: undefined;
            allowDom?: undefined;
        } | {
            name: string;
            typeInfo: string;
            type?: undefined;
            required?: undefined;
            mixed?: undefined;
            allowDom?: undefined;
        } | {
            name: string;
            required: boolean;
            mixed: boolean;
            allowDom: boolean;
            typeInfo: string;
            type: string;
        })[];
        type?: undefined;
        values?: undefined;
    } | {
        localName: string;
        typeName: string;
        baseTypeInfo: string;
        propertyInfos: ({
            name: string;
            type: string;
            required?: undefined;
            typeInfo?: undefined;
        } | {
            name: string;
            required: boolean;
            typeInfo: string;
            type?: undefined;
        } | {
            name: string;
            typeInfo: string;
            type?: undefined;
            required?: undefined;
        })[];
        type?: undefined;
        values?: undefined;
    } | {
        localName: string;
        typeName: {
            namespaceURI: string;
            localPart: string;
        };
        baseTypeInfo: string;
        propertyInfos: ({
            name: string;
            type: string;
            elementName?: undefined;
        } | {
            name: string;
            elementName: {
                localPart: string;
                namespaceURI: string;
            };
            type?: undefined;
        })[];
        type?: undefined;
        values?: undefined;
    } | {
        localName: string;
        typeName: string;
        baseTypeInfo: string;
        propertyInfos: ({
            name: string;
            type: string;
            required?: undefined;
            typeInfo?: undefined;
            attributeName?: undefined;
        } | {
            name: string;
            required: boolean;
            typeInfo: string;
            type?: undefined;
            attributeName?: undefined;
        } | {
            name: string;
            typeInfo: string;
            attributeName: {
                localPart: string;
            };
            type: string;
            required?: undefined;
        })[];
        type?: undefined;
        values?: undefined;
    } | {
        localName: string;
        typeName: string;
        baseTypeInfo: string;
        propertyInfos: ({
            name: string;
            type: string;
            minOccurs?: undefined;
            collection?: undefined;
            elementName?: undefined;
            typeInfo?: undefined;
            mixed?: undefined;
            allowDom?: undefined;
            attributeName?: undefined;
            required?: undefined;
        } | {
            name: string;
            minOccurs: number;
            collection: boolean;
            elementName: string;
            typeInfo: string;
            type?: undefined;
            mixed?: undefined;
            allowDom?: undefined;
            attributeName?: undefined;
            required?: undefined;
        } | {
            name: string;
            minOccurs: number;
            collection: boolean;
            typeInfo: string;
            type?: undefined;
            elementName?: undefined;
            mixed?: undefined;
            allowDom?: undefined;
            attributeName?: undefined;
            required?: undefined;
        } | {
            name: string;
            minOccurs: number;
            collection: boolean;
            mixed: boolean;
            allowDom: boolean;
            typeInfo: string;
            type: string;
            elementName?: undefined;
            attributeName?: undefined;
            required?: undefined;
        } | {
            name: string;
            elementName: {
                localPart: string;
                namespaceURI: string;
            };
            typeInfo: string;
            type?: undefined;
            minOccurs?: undefined;
            collection?: undefined;
            mixed?: undefined;
            allowDom?: undefined;
            attributeName?: undefined;
            required?: undefined;
        } | {
            name: string;
            attributeName: {
                localPart: string;
            };
            type: string;
            minOccurs?: undefined;
            collection?: undefined;
            elementName?: undefined;
            typeInfo?: undefined;
            mixed?: undefined;
            allowDom?: undefined;
            required?: undefined;
        } | {
            name: string;
            required: boolean;
            attributeName: {
                localPart: string;
            };
            type: string;
            minOccurs?: undefined;
            collection?: undefined;
            elementName?: undefined;
            typeInfo?: undefined;
            mixed?: undefined;
            allowDom?: undefined;
        })[];
        type?: undefined;
        values?: undefined;
    } | {
        localName: string;
        typeName: string;
        baseTypeInfo: string;
        propertyInfos: ({
            name: string;
            type: string;
            minOccurs?: undefined;
            collection?: undefined;
            typeInfo?: undefined;
            mixed?: undefined;
            allowDom?: undefined;
            attributeName?: undefined;
        } | {
            name: string;
            minOccurs: number;
            collection: boolean;
            typeInfo: string;
            type?: undefined;
            mixed?: undefined;
            allowDom?: undefined;
            attributeName?: undefined;
        } | {
            name: string;
            mixed: boolean;
            allowDom: boolean;
            typeInfo: string;
            type: string;
            minOccurs?: undefined;
            collection?: undefined;
            attributeName?: undefined;
        } | {
            name: string;
            typeInfo: string;
            attributeName: {
                localPart: string;
            };
            type: string;
            minOccurs?: undefined;
            collection?: undefined;
            mixed?: undefined;
            allowDom?: undefined;
        })[];
        type?: undefined;
        values?: undefined;
    } | {
        localName: string;
        typeName: string;
        baseTypeInfo: string;
        propertyInfos: ({
            name: string;
            type: string;
            minOccurs?: undefined;
            collection?: undefined;
            typeInfo?: undefined;
            attributeName?: undefined;
        } | {
            name: string;
            minOccurs: number;
            collection: boolean;
            typeInfo: string;
            type?: undefined;
            attributeName?: undefined;
        } | {
            name: string;
            type?: undefined;
            minOccurs?: undefined;
            collection?: undefined;
            typeInfo?: undefined;
            attributeName?: undefined;
        } | {
            name: string;
            typeInfo: string;
            type?: undefined;
            minOccurs?: undefined;
            collection?: undefined;
            attributeName?: undefined;
        } | {
            name: string;
            attributeName: {
                localPart: string;
            };
            type: string;
            minOccurs?: undefined;
            collection?: undefined;
            typeInfo?: undefined;
        })[];
        type?: undefined;
        values?: undefined;
    } | {
        localName: string;
        typeName: {
            namespaceURI: string;
            localPart: string;
        };
        propertyInfos: ({
            name: string;
            type: string;
            elementName?: undefined;
            typeInfo?: undefined;
            mixed?: undefined;
            allowDom?: undefined;
            attributeName?: undefined;
        } | {
            name: string;
            elementName: {
                localPart: string;
                namespaceURI: string;
            };
            typeInfo: string;
            type?: undefined;
            mixed?: undefined;
            allowDom?: undefined;
            attributeName?: undefined;
        } | {
            name: string;
            mixed: boolean;
            allowDom: boolean;
            elementName: {
                localPart: string;
                namespaceURI: string;
            };
            typeInfo: string;
            type: string;
            attributeName?: undefined;
        } | {
            name: string;
            typeInfo: string;
            attributeName: {
                localPart: string;
            };
            type: string;
            elementName?: undefined;
            mixed?: undefined;
            allowDom?: undefined;
        })[];
        baseTypeInfo?: undefined;
        type?: undefined;
        values?: undefined;
    } | {
        localName: string;
        typeName: string;
        baseTypeInfo: string;
        propertyInfos: ({
            name: string;
            type: string;
            minOccurs?: undefined;
            collection?: undefined;
            typeInfo?: undefined;
            required?: undefined;
            attributeName?: undefined;
        } | {
            name: string;
            minOccurs: number;
            collection: boolean;
            typeInfo: string;
            type?: undefined;
            required?: undefined;
            attributeName?: undefined;
        } | {
            name: string;
            required: boolean;
            collection: boolean;
            typeInfo: string;
            type?: undefined;
            minOccurs?: undefined;
            attributeName?: undefined;
        } | {
            name: string;
            typeInfo: string;
            attributeName: {
                localPart: string;
            };
            type: string;
            minOccurs?: undefined;
            collection?: undefined;
            required?: undefined;
        } | {
            name: string;
            attributeName: {
                localPart: string;
            };
            type: string;
            minOccurs?: undefined;
            collection?: undefined;
            typeInfo?: undefined;
            required?: undefined;
        })[];
        type?: undefined;
        values?: undefined;
    } | {
        localName: string;
        typeName: {
            namespaceURI: string;
            localPart: string;
        };
        baseTypeInfo: string;
        propertyInfos: ({
            name: string;
            type: string;
            elementName?: undefined;
            typeInfo?: undefined;
            minOccurs?: undefined;
            collection?: undefined;
            mixed?: undefined;
            allowDom?: undefined;
        } | {
            name: string;
            elementName: {
                localPart: string;
                namespaceURI: string;
            };
            typeInfo: string;
            type?: undefined;
            minOccurs?: undefined;
            collection?: undefined;
            mixed?: undefined;
            allowDom?: undefined;
        } | {
            name: string;
            minOccurs: number;
            collection: boolean;
            mixed: boolean;
            allowDom: boolean;
            elementName: {
                localPart: string;
                namespaceURI: string;
            };
            typeInfo: string;
            type: string;
        })[];
        type?: undefined;
        values?: undefined;
    } | {
        localName: string;
        typeName: string;
        propertyInfos: {
            name: string;
            required: boolean;
            attributeName: {
                localPart: string;
            };
            type: string;
        }[];
        baseTypeInfo?: undefined;
        type?: undefined;
        values?: undefined;
    } | {
        localName: string;
        typeName: {
            namespaceURI: string;
            localPart: string;
        };
        propertyInfos: {
            name: string;
            minOccurs: number;
            collection: boolean;
            elementName: {
                localPart: string;
                namespaceURI: string;
            };
            typeInfo: string;
        }[];
        baseTypeInfo?: undefined;
        type?: undefined;
        values?: undefined;
    } | {
        type: string;
        localName: string;
        values: string[];
        typeName?: undefined;
        baseTypeInfo?: undefined;
        propertyInfos?: undefined;
    })[];
    export const elementInfos: ({
        typeInfo: string;
        elementName: string;
        substitutionHead: string;
    } | {
        typeInfo: string;
        elementName: string;
        substitutionHead?: undefined;
    } | {
        typeInfo: string;
        elementName: {
            localPart: string;
            namespaceURI: string;
        };
        substitutionHead?: undefined;
    } | {
        typeInfo: string;
        elementName: {
            localPart: string;
            namespaceURI: string;
        };
        substitutionHead: {
            localPart: string;
            namespaceURI: string;
        };
    })[];
}

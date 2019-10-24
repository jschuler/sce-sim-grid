export declare const setCaretPosition: (element: any, caretPos: number) => boolean;
export declare const setCaretPositionAtEnd: (element: HTMLInputElement) => void;
export declare const focusCell: (id: string, focusTimeout?: number, scrollTo?: boolean) => void;
export declare const getRowColumnFromId: (id: string) => {
    row: number;
    column: number;
};

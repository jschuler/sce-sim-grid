export interface Dmn {
    name: Name;
    value: DmnValue;
}
export interface Name {
    namespaceURI: string;
    localPart: string;
    prefix: Prefix;
    key: string;
    string: string;
}
export declare enum Prefix {
    Dmn = "dmn",
    Dmndi = "dmndi",
    Empty = ""
}
export interface DmnValue {
    TYPE_NAME: string;
    id: string;
    name: string;
    expressionLanguage: string;
    typeLanguage: string;
    namespace: string;
    otherAttributes: StickyOtherAttributes;
    extensionElements: ExtensionElements;
    itemDefinition: ItemDefinition[];
    drgElement: DrgElement[];
    dmndi: Dmndi;
}
export interface Dmndi {
    TYPE_NAME: string;
    dmnDiagram: DmnDiagram[];
}
export interface DmnDiagram {
    TYPE_NAME: string;
    extension: Extension;
    dmnDiagramElement: DmnDiagramElement[];
}
export interface DmnDiagramElement {
    name: Name;
    value: DmnDiagramElementValue;
}
export interface DmnDiagramElementValue {
    TYPE_NAME: string;
    id: string;
    dmnElementRef: Name;
    isCollapsed?: boolean;
    otherAttributes: PurpleOtherAttributes;
    style?: Style;
    bounds?: Bounds;
    dmnLabel?: ExtensionElements;
    waypoint?: Waypoint[];
}
export interface Bounds {
    TYPE_NAME: string;
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface ExtensionElements {
    TYPE_NAME: string;
}
export interface PurpleOtherAttributes {
    id: string;
    dmnElementRef: string;
    isCollapsed?: string;
}
export interface Style {
    name: Name;
    value: StyleValue;
}
export interface StyleValue {
    TYPE_NAME: string;
    fillColor: Color;
    strokeColor: Color;
    fontColor: Color;
}
export interface Color {
    TYPE_NAME: FillColorTYPENAME;
    red: number;
    green: number;
    blue: number;
}
export declare enum FillColorTYPENAME {
    DmnColor = "dmn.Color"
}
export interface Waypoint {
    TYPE_NAME: string;
    x: number;
    y: number;
}
export interface Extension {
    TYPE_NAME: string;
    any: Any[];
}
export interface Any {
}
export interface DrgElement {
    name: Name;
    value: DrgElementValue;
}
export interface DrgElementValue {
    TYPE_NAME: string;
    id: string;
    name: string;
    otherAttributes: TentacledOtherAttributes;
    variable: Variable;
    informationRequirement?: InformationRequirement[];
    expression?: ValueExpression;
    question?: string;
    allowedAnswers?: string;
}
export interface ValueExpression {
    name: Name;
    value: ExpressionValue;
}
export interface ExpressionValue {
    TYPE_NAME: string;
    id: string;
    hitPolicy?: string;
    preferredOrientation?: string;
    otherAttributes: FluffyOtherAttributes;
    input?: Input[];
    output?: Variable[];
    rule?: Rule[];
    contextEntry?: ContextEntry[];
}
export interface ContextEntry {
    TYPE_NAME: string;
    variable?: Variable;
    expression: ContextEntryExpression;
}
export interface ContextEntryExpression {
    name: Name;
    value: Input;
}
export interface Input {
    TYPE_NAME: InputTYPENAME;
    id: string;
    otherAttributes: InputOtherAttributes;
    text?: string;
    inputExpression?: InputExpression;
}
export declare enum InputTYPENAME {
    DmnTInputClause = "dmn.TInputClause",
    DmnTLiteralExpression = "dmn.TLiteralExpression",
    DmnTUnaryTests = "dmn.TUnaryTests"
}
export interface InputExpression {
    TYPE_NAME: InputTYPENAME;
    id: string;
    typeRef: TypeRef;
    otherAttributes: InputExpressionOtherAttributes;
    text: string;
}
export interface InputExpressionOtherAttributes {
    id: string;
    typeRef: TypeRef;
}
export declare enum TypeRef {
    Date = "date",
    Number = "number",
    String = "string"
}
export interface InputOtherAttributes {
    id: string;
}
export interface Variable {
    TYPE_NAME: string;
    id: string;
    name: string;
    typeRef: string;
    otherAttributes: VariableOtherAttributes;
}
export interface VariableOtherAttributes {
    id: string;
    name: string;
    typeRef: string;
}
export interface FluffyOtherAttributes {
    id: string;
    hitPolicy?: string;
    preferredOrientation?: string;
}
export interface Rule {
    TYPE_NAME: string;
    id: string;
    otherAttributes: InputOtherAttributes;
    inputEntry: Input[];
    outputEntry: Input[];
}
export interface InformationRequirement {
    TYPE_NAME: string;
    id: string;
    otherAttributes: InputOtherAttributes;
    requiredInput?: Required;
    requiredDecision?: Required;
}
export interface Required {
    TYPE_NAME: string;
    href: string;
}
export interface TentacledOtherAttributes {
    id: string;
    name: string;
}
export interface ItemDefinition {
    TYPE_NAME: ItemDefinitionTYPENAME;
    id: string;
    name: string;
    isCollection: boolean;
    otherAttributes: ItemComponentOtherAttributes;
    itemComponent: ItemComponent[];
}
export declare enum ItemDefinitionTYPENAME {
    DmnTItemDefinition = "dmn.TItemDefinition"
}
export interface ItemComponent {
    TYPE_NAME: ItemDefinitionTYPENAME;
    id: string;
    name: string;
    isCollection: boolean;
    otherAttributes: ItemComponentOtherAttributes;
    typeRef: TypeRef;
    allowedValues?: AllowedValues;
}
export interface AllowedValues {
    TYPE_NAME: InputTYPENAME;
    id: string;
    otherAttributes: AllowedValuesOtherAttributes;
    text: string;
}
export interface AllowedValuesOtherAttributes {
    "{http://www.drools.org/kie/dmn/1.2}constraintType": string;
    id: string;
}
export interface ItemComponentOtherAttributes {
    id: string;
    name: string;
    isCollection: string;
}
export interface StickyOtherAttributes {
    "{http://www.w3.org/2000/xmlns/}dmn": string;
    "{http://www.w3.org/2000/xmlns/}xmlns": string;
    "{http://www.w3.org/2000/xmlns/}di": string;
    "{http://www.w3.org/2000/xmlns/}kie": string;
    "{http://www.w3.org/2000/xmlns/}feel": string;
    "{http://www.w3.org/2000/xmlns/}dmndi": string;
    "{http://www.w3.org/2000/xmlns/}dc": string;
    id: string;
    name: string;
    expressionLanguage: string;
    typeLanguage: string;
    namespace: string;
}

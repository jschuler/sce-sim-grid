/**
 * Types generated from .scesim JSON file using https://quicktype.io/typescript/
 */

export interface Scesim {
  name:  Name;
  value: Value;
}

export interface Name {
  namespaceURI: string;
  localPart:    string;
  prefix:       string;
  key:          string;
  string:       string;
}

export interface Value {
  TYPE_NAME:  string;
  version:    string;
  simulation: Simulation;
  imports:    ValueImports;
}

export interface ValueImports {
  TYPE_NAME: string;
  imports:   ExpressionIdentifierClass;
}

export interface ExpressionIdentifierClass {
  TYPE_NAME: ImportsTYPENAME;
}

export enum ImportsTYPENAME {
  ScesimExpressionIdentifierType = "scesim.ExpressionIdentifierType",
  ScesimFactIdentifierType = "scesim.FactIdentifierType",
  ScesimWrappedImportsType = "scesim.WrappedImportsType",
}

export interface Simulation {
  TYPE_NAME:            string;
  simulationDescriptor: SimulationDescriptor;
  scenarios:            Scenarios;
}

export interface Scenarios {
  TYPE_NAME: string;
  scenario:  Scenario[];
}

export interface Scenario {
  TYPE_NAME:         string;
  factMappingValues: FactMappingValues;
}

export interface FactMappingValues {
  TYPE_NAME:        string;
  factMappingValue: FactMappingValue[];
}

export interface FactMappingValue {
  TYPE_NAME:            FactMappingValueTYPENAME;
  factIdentifier:       ExpressionIdentifierClass;
  expressionIdentifier: ExpressionIdentifierClass;
  rawValue?:            RawValue;
}

export enum FactMappingValueTYPENAME {
  ScesimFactMappingValueType = "scesim.FactMappingValueType",
}

export interface RawValue {
  TYPE_NAME: RawValueTYPENAME;
  clazz:     Clazz;
  value:     string;
}

export enum RawValueTYPENAME {
  ScesimRawValueType = "scesim.RawValueType",
}

export enum Clazz {
  String = "string",
}

export interface SimulationDescriptor {
  TYPE_NAME:     string;
  factMappings:  FactMappings;
  dmnFilePath:   string;
  type:          string;
  fileName:      string;
  dmnNamespace:  string;
  dmnName:       string;
  skipFromBuild: boolean;
}

export interface FactMappings {
  TYPE_NAME:   string;
  factMapping: FactMapping[];
}

export interface FactMapping {
  TYPE_NAME:            string;
  expressionElements:   ExpressionElements;
  expressionIdentifier: ExpressionIdentifier;
  factIdentifier:       FactIdentifier;
  className:            string;
  factAlias:            string;
  expressionAlias?:     string;
}

export interface ExpressionElements {
  TYPE_NAME:          string;
  expressionElement?: ExpressionElement[];
}

export interface ExpressionElement {
  TYPE_NAME: ExpressionElementTYPENAME;
  step:      string;
}

export enum ExpressionElementTYPENAME {
  ScesimExpressionElementType = "scesim.ExpressionElementType",
}

export interface ExpressionIdentifier {
  TYPE_NAME: ImportsTYPENAME;
  name:      string;
  type:      string;
}

export interface FactIdentifier {
  TYPE_NAME:  ImportsTYPENAME;
  name?:      string;
  className?: string;
}

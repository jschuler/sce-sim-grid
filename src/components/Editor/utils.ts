import { Scesim, FactMapping } from '../../types/SceSim';

export const getDmnFilePath = (data: Scesim): string => {
  const {
    dmnFilePath
  } = data.value.simulation.simulationDescriptor;
  return dmnFilePath;
};

export const getColumnNames = (data: Scesim) => {
  let columns: any[] = [];
  const {
    factMapping
  } = data.value.simulation.simulationDescriptor.factMappings;
  factMapping.forEach(
    (col: FactMapping) => {
      let name = col.expressionAlias || '';
      let group = col.factAlias || '';
      columns.push({
        name,
        group
      });
    }
  );
  return columns;
};

type Column = Array<({ name?: string; field?: string; group?: string; children?: { name?: string; field?: string; }[]; })>;

export const getColumns = (data: Scesim, byGroup: boolean = false) => {
  let columnDefsOther: Column = [];
  let columnDefsGiven: Column = [];
  let columnDefsExpect: Column = [];
  let numOther: number = 0;
  let numGiven: number = 0;
  let numExpect: number = 0;
  let fieldIndices: any = {};
  const {
    factMapping
  } = data.value.simulation.simulationDescriptor.factMappings;
  factMapping.forEach(
    (col: FactMapping, index: number) => {
      const type = col.expressionIdentifier.type; // OTHER | GIVEN | EXPECT
      const field = col.expressionIdentifier.name; // this relates the column to the row cell
      fieldIndices[field] = index;
      if (type === "OTHER") {
        numOther = numOther + 1;
        const name = col.factAlias;
        columnDefsOther.push({ name, field });
      } else {
        const name = col.expressionAlias;
        const group = col.factAlias;
        if (!byGroup) {
          if (type === "GIVEN") {
            numGiven = numGiven + 1;
            columnDefsGiven.push({ name, field, group });
          } else {
            // EXPECT
            numExpect = numExpect + 1;
            columnDefsExpect.push({ name, field, group });
          }
        } else {
          if (type === "GIVEN") {
            numGiven = numGiven + 1;
            // check if the group already exists, if so push to it, otherwise create a new group
            if (columnDefsGiven.length === 0 || columnDefsGiven[columnDefsGiven.length - 1].group !== group) {
              // new group
              columnDefsGiven.push({ group, children: [{ name, field }] });
            } else {
              // push to last group
              columnDefsGiven[columnDefsGiven.length - 1].children!.push({ name, field })
            }
          } else {
            // EXPECT
            numExpect = numExpect + 1;
            // check if the group already exists, if so push to it, otherwise create a new group
            if (columnDefsExpect.length === 0 || columnDefsExpect[columnDefsExpect.length - 1].group !== group) {
              // new group
              columnDefsExpect.push({ group, children: [{ name, field }] });
            } else {
              // push to last group
              columnDefsExpect[columnDefsExpect.length - 1].children!.push({ name, field })
            }
          }
        }
      }
    }
  );
  return {
    fieldIndices,
    other: columnDefsOther,
    given: columnDefsGiven,
    expect: columnDefsExpect,
    numOther,
    numGiven,
    numExpect
  };
};

export const getRows = (data: {
  value: { simulation: { scenarios: { scenario: any } } };
}, columns?: any) => {
  // construct the path so we can save back to the same location in the json file
  const dataPathRoot: string = 'value.simulation.scenarios.scenario';
  const rows: any[] = [];
  const { scenario } = data.value.simulation.scenarios;
  scenario.forEach(
    (dataRow: { factMappingValues: { factMappingValue: any } }, index: number) => {
      const dataPath = `${dataPathRoot}[${index}].factMappingValues.factMappingValue`;
      const totalColumnsLength = columns.numOther + columns.numGiven + columns.numExpect;
      let hasExpressionIdentifierName = true;
      // create the row with a predetermined length so we can insert the cell in the correct column order
      let row: any[] = Array.from(Array(totalColumnsLength).keys());
      const entries = dataRow.factMappingValues.factMappingValue;
      entries.forEach((col: { rawValue?: { value: any }, expressionIdentifier: { name: string } }, index: number) => {
        const { name } = col.expressionIdentifier;
        if (!col.rawValue) {
          if (name) {
            row[columns.fieldIndices[name]] = null;
          } else {
            hasExpressionIdentifierName = false;
            row[index] = null;
          }
        } else {
          const path = `${dataPath}[${index}].rawValue.value`;
          const { value } = col.rawValue;
          if (name) {
            row[columns.fieldIndices[name]] = {
              value,
              path
            };
          } else {
            hasExpressionIdentifierName = false;
            row[index] = {
              value,
              path
            };
          }
        }
      });
      if (!hasExpressionIdentifierName && row.length) {
        // this might be a workaround, but one of the scesim datasets did not have expressionIdentifier.name for the simulations
        // and for some reason the last item is the index, it should be at the front
        if (row.length) {
          row.unshift(row.pop()!)
        }
      }
      rows.push(row);
    }
  );
  return rows;
};

export const getDefinitions = (data: { value: { itemDefinition?: any; drgElement?: any; name?: any; }; }) => {
  let definitions: any = {};
  const title = data.value.name;
  const { itemDefinition } = data.value;
  itemDefinition.forEach((def: any) => {
    // let definitionName = def.name.substring(1);
    let definitionTypes = {} as any;
    const { itemComponent } = def;
    itemComponent.forEach((type: { name: any; typeRef: any; allowedValues?: any }) => {
      if (type.allowedValues) {
        // enumeration
        definitionTypes[type.name] = type.allowedValues.text;
      } else {
        definitionTypes[type.name] = type.typeRef;
      }
    });
    definitions[def.name] = definitionTypes;
  });

  const { drgElement } = data.value;
  const typeDefinitions: any = {
    '_title': title,
    simple: [],
    complex: [],
    map: {}
  };
  drgElement.forEach((element: any) => {
    const type = element.name.localPart; // inputData | decision
    const text = element.value.name;
    const question = element.value.question;
    const choices = element.value.allowedAnswers || null;
    const typeRef = element.value.variable.typeRef; // e.g. tViolation, tFine, tDriver, string
    typeDefinitions[typeRef.charAt(0) === 't' ? 'complex' : 'simple'].push(
      {
        typeRef,
        type,
        text,
        choices,
        question,
        elements: definitions[typeRef] || {
          value: choices
        }
      }
    );
    typeDefinitions.map[text] = definitions[typeRef] || {
      value: choices
    };
  });
  return typeDefinitions;
}

export const setCaretPosition = (element: any, caretPos: number) => {
  // (el.selectionStart === 0 added for Firefox bug)
  if (element.selectionStart || element.selectionStart === 0) {
    element.focus();
    element.setSelectionRange(caretPos, caretPos);
    return true;
  }
}

export const setCaretPositionAtEnd = (element: HTMLInputElement) => {
  const end = element.value.length;
  setCaretPosition(element, end);
};
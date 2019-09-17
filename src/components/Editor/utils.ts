export const getColumnNames = (data: {
  value: {
    simulation: {
      simulationDescriptor: { factMappings: { factMapping: any } };
    };
  };
}) => {
  let columns: any[] = [];
  const {
    factMapping
  } = data.value.simulation.simulationDescriptor.factMappings;
  factMapping.forEach(
    (col: {
      expressionIdentifier: { type: any; name: any };
      factAlias: any;
      expressionAlias: any;
    }) => {
      const type = col.expressionIdentifier.type; // OTHER | GIVEN | EXPECT
      // const field = col.expressionIdentifier.name;
      let name;
      if (type === "OTHER") {
        name = col.factAlias;
      } else {
        name = col.expressionAlias;
      }
      columns.push(name);
    }
  );
  return columns;
};

type Column = Array<({ name: any; group: any; type: any; children?: undefined; } | { group: any; children: { name: any; type: any }[]; name?: undefined; type?: undefined; })>;

export const getColumns = (data: {
  value: {
    simulation: {
      simulationDescriptor: { factMappings: { factMapping: any } };
    };
  };
}, byGroup: boolean = false, typeDefinitions?: any) => {
  let columnDefsOther: { name: any }[] = [];
  let columnDefsGiven: Column = [];
  let columnDefsExpect: Column = [];
  let numGiven: number = 0;
  let numExpect: number = 0;
  const {
    factMapping
  } = data.value.simulation.simulationDescriptor.factMappings;
  factMapping.forEach(
    (col: {
      expressionIdentifier: { type: any; name: any };
      factAlias: any;
      expressionAlias: any;
    }) => {
      const type = col.expressionIdentifier.type; // OTHER | GIVEN | EXPECT
      // const field = col.expressionIdentifier.name;
      if (type === "OTHER") {
        const name = col.factAlias;
        columnDefsOther.push({ name });
      } else {
        const name = col.expressionAlias;
        const group = col.factAlias;
        const dataType = typeDefinitions && typeDefinitions[group] && typeDefinitions[group][name] ? typeDefinitions[group][name] : 'any';
        if (!byGroup) {
          if (type === "GIVEN") {
            numGiven = numGiven + 1;
            columnDefsGiven.push({ name, group, type: dataType });
          } else {
            // EXPECT
            numExpect = numExpect + 1;
            columnDefsExpect.push({ name, group, type: dataType });
          }
        } else {
          if (type === "GIVEN") {
            numGiven = numGiven + 1;
            // check if the group already exists, if so push to it, otherwise create a new group
            if (columnDefsGiven.length === 0 || columnDefsGiven[columnDefsGiven.length - 1].group !== group) {
              // new group
              columnDefsGiven.push({ group, children: [{ name, type: dataType }] });
            } else {
              // push to last group
              columnDefsGiven[columnDefsGiven.length - 1].children!.push({ name, type: dataType })
            }
          } else {
            // EXPECT
            numExpect = numExpect + 1;
            // check if the group already exists, if so push to it, otherwise create a new group
            if (columnDefsExpect.length === 0 || columnDefsExpect[columnDefsExpect.length - 1].group !== group) {
              // new group
              columnDefsExpect.push({ group, children: [{ name, type: dataType }] });
            } else {
              // push to last group
              columnDefsExpect[columnDefsExpect.length - 1].children!.push({ name, type: dataType })
            }
          }
        }
      }
    }
  );
  return {
    other: columnDefsOther,
    given: columnDefsGiven,
    expect: columnDefsExpect,
    numGiven,
    numExpect
  };
};

export const getRows = (data: {
  value: { simulation: { scenarios: { scenario: any } } };
}) => {
  // construct the path so we can save back to the same location in the json file
  const dataPathRoot: string = 'value.simulation.scenarios.scenario';
  const rows: any[] = [];
  const { scenario } = data.value.simulation.scenarios;
  scenario.forEach(
    (dataRow: { factMappingValues: { factMappingValue: any } }, index: number) => {
      const dataPath = `${dataPathRoot}[${index}].factMappingValues.factMappingValue`;
      let row: any[] = [];
      const columns = dataRow.factMappingValues.factMappingValue;
      columns.forEach((col: { rawValue?: { value: any } }, index: number) => {
        if (!col.rawValue) {
          row.push(null);
        } else {
          const path = `${dataPath}[${index}].rawValue.value`;
          const { value } = col.rawValue;
          row.push({
            value,
            path
          });
        }
      });
      // for some reason the last item is the index, it should be at the front
      if (row.length) {
        row.unshift(row.pop()!)
      }
      rows.push(row);
    }
  );
  return rows;
};

export const getDefinitions = (data: { value: { itemDefinition: any; }; }) => {
  let definitions: any = {};
  const { itemDefinition } = data.value;
  itemDefinition.forEach((def: any) => {
    let definitionName = def.name.substring(1);
    let definitionTypes = {} as any;
    // let definition = {
    //   name: def.name.substring(1),
    //   types: {} as any
    // };
    const { itemComponent } = def;
    itemComponent.forEach((type: { name: any; typeRef: any; }) => {
      definitionTypes[type.name] = type.typeRef;
      // definition.types.push({
      //   name: type.name,
      //   type: type.typeRef
      // });
    });
    // definitions.push(definition);
    definitions[definitionName] = definitionTypes;
  });
  return definitions;
}
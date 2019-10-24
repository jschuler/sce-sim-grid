export var getDmnFilePath = function (data) {
    var dmnFilePath = data.value.simulation.simulationDescriptor.dmnFilePath;
    return dmnFilePath;
};
export var getColumnNames = function (data) {
    var columns = [];
    var factMapping = data.value.simulation.simulationDescriptor.factMappings.factMapping;
    factMapping.forEach(function (col) {
        var name = col.expressionAlias || '';
        var group = col.factAlias || '';
        columns.push({
            name: name,
            group: group
        });
    });
    return columns;
};
export var getColumns = function (data, byGroup) {
    if (byGroup === void 0) { byGroup = false; }
    var columnDefsOther = [];
    var columnDefsGiven = [];
    var columnDefsExpect = [];
    var numOther = 0;
    var numGiven = 0;
    var numExpect = 0;
    var fieldIndices = {};
    var factMapping = data.value.simulation.simulationDescriptor.factMappings.factMapping;
    factMapping.forEach(function (col, index) {
        var type = col.expressionIdentifier.type; // OTHER | GIVEN | EXPECT
        var field = col.expressionIdentifier.name; // this relates the column to the row cell
        fieldIndices[field] = index;
        if (type === "OTHER") {
            numOther = numOther + 1;
            var name_1 = col.factAlias;
            columnDefsOther.push({ name: name_1, field: field });
        }
        else {
            var name_2 = col.expressionAlias;
            var group = col.factAlias;
            if (!byGroup) {
                if (type === "GIVEN") {
                    numGiven = numGiven + 1;
                    columnDefsGiven.push({ name: name_2, field: field, group: group });
                }
                else {
                    // EXPECT
                    numExpect = numExpect + 1;
                    columnDefsExpect.push({ name: name_2, field: field, group: group });
                }
            }
            else {
                if (type === "GIVEN") {
                    numGiven = numGiven + 1;
                    // check if the group already exists, if so push to it, otherwise create a new group
                    if (columnDefsGiven.length === 0 || columnDefsGiven[columnDefsGiven.length - 1].group !== group) {
                        // new group
                        columnDefsGiven.push({ group: group, children: [{ name: name_2, field: field }] });
                    }
                    else {
                        // push to last group
                        columnDefsGiven[columnDefsGiven.length - 1].children.push({ name: name_2, field: field });
                    }
                }
                else {
                    // EXPECT
                    numExpect = numExpect + 1;
                    // check if the group already exists, if so push to it, otherwise create a new group
                    if (columnDefsExpect.length === 0 || columnDefsExpect[columnDefsExpect.length - 1].group !== group) {
                        // new group
                        columnDefsExpect.push({ group: group, children: [{ name: name_2, field: field }] });
                    }
                    else {
                        // push to last group
                        columnDefsExpect[columnDefsExpect.length - 1].children.push({ name: name_2, field: field });
                    }
                }
            }
        }
    });
    return {
        fieldIndices: fieldIndices,
        other: columnDefsOther,
        given: columnDefsGiven,
        expect: columnDefsExpect,
        numOther: numOther,
        numGiven: numGiven,
        numExpect: numExpect
    };
};
export var getRows = function (data, columns) {
    // construct the path so we can save back to the same location in the json file
    var dataPathRoot = 'value.simulation.scenarios.scenario';
    var rows = [];
    var scenario = data.value.simulation.scenarios.scenario;
    scenario.forEach(function (dataRow, index) {
        var dataPath = dataPathRoot + "[" + index + "].factMappingValues.factMappingValue";
        var totalColumnsLength = columns.numOther + columns.numGiven + columns.numExpect;
        var hasExpressionIdentifierName = true;
        // create the row with a predetermined length so we can insert the cell in the correct column order
        var row = Array.from(Array(totalColumnsLength).keys());
        var entries = dataRow.factMappingValues.factMappingValue;
        entries.forEach(function (col, index) {
            var name = col.expressionIdentifier.name;
            var path = dataPath + "[" + index + "].rawValue.value";
            if (!col.rawValue) {
                if (name) {
                    row[columns.fieldIndices[name]] = {
                        value: null,
                        path: path
                    };
                }
                else {
                    hasExpressionIdentifierName = false;
                    row[index] = {
                        value: null,
                        path: path
                    };
                }
            }
            else {
                var value = col.rawValue.value;
                if (name) {
                    row[columns.fieldIndices[name]] = {
                        value: value,
                        path: path
                    };
                }
                else {
                    hasExpressionIdentifierName = false;
                    row[index] = {
                        value: value,
                        path: path
                    };
                }
            }
        });
        if (!hasExpressionIdentifierName && row.length) {
            // this might be a workaround, but one of the scesim datasets did not have expressionIdentifier.name for the simulations
            // and for some reason the last item is the index, it should be at the front
            if (row.length) {
                row.unshift(row.pop());
            }
        }
        rows.push(row);
    });
    return rows;
};
export var getDefinitions = function (data) {
    var definitions = {};
    var title = data.value.name;
    var itemDefinition = data.value.itemDefinition;
    itemDefinition.forEach(function (def) {
        // let definitionName = def.name.substring(1);
        var definitionTypes = {};
        var itemComponent = def.itemComponent;
        itemComponent.forEach(function (type) {
            if (type.allowedValues) {
                // enumeration
                definitionTypes[type.name] = type.allowedValues.text;
            }
            else {
                definitionTypes[type.name] = type.typeRef;
            }
        });
        definitions[def.name] = definitionTypes;
    });
    var drgElement = data.value.drgElement;
    var typeDefinitions = {
        '_title': title,
        simple: [],
        complex: [],
        map: {}
    };
    drgElement.forEach(function (element) {
        var type = element.name.localPart; // inputData | decision
        var text = element.value.name;
        var question = element.value.question;
        var choices = element.value.allowedAnswers || null;
        var typeRef = element.value.variable.typeRef; // e.g. tViolation, tFine, tDriver, string
        typeDefinitions[typeRef.charAt(0) === 't' ? 'complex' : 'simple'].push({
            typeRef: typeRef,
            type: type,
            text: text,
            choices: choices,
            question: question,
            elements: definitions[typeRef] || {
                value: choices
            }
        });
        typeDefinitions.map[text] = definitions[typeRef] || {
            value: choices
        };
    });
    return typeDefinitions;
};
//# sourceMappingURL=scesimUtils.js.map
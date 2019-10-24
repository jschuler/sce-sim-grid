"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
var utils_1 = require("../utils");
var react_infinite_scroll_component_1 = __importDefault(require("react-infinite-scroll-component"));
var Spinner_1 = require("../Spinner");
var Cell_1 = require("../Cell");
require("./Editor.css");
var Editor = React.memo(function (_a) {
    var columnDefs = _a.columns, filteredRows = _a.filteredRows, definitions = _a.definitions, columnNames = _a.columnNames, onSave = _a.onSave, onUndo = _a.onUndo, onRedo = _a.onRedo, lastForcedUpdate = _a.lastForcedUpdate, readOnly = _a.readOnly;
    console.log('render Editor');
    var rowsToFetch = 50;
    var _b = React.useState(''), editableCell = _b[0], setEditable = _b[1];
    var _c = React.useState(false), expandedSelect = _c[0], setExpandedSelect = _c[1];
    var _d = React.useState(1), currentPage = _d[0], setCurrentPage = _d[1];
    // state from props
    var _e = React.useState(columnDefs), columnDefsState = _e[0], setColumnDefsState = _e[1];
    var _f = React.useState(filteredRows.slice(0, rowsToFetch)), fetchedRows = _f[0], setFetchedRows = _f[1];
    var _g = React.useState(definitions), definitionsState = _g[0], setDefinitionsState = _g[1];
    var _h = React.useState(columnNames), columnNamesState = _h[0], setColumnNamesState = _h[1];
    var _j = React.useState(lastForcedUpdate), lastForcedUpdateState = _j[0], setLastForcedUpdateState = _j[1];
    var editorRef = React.useRef(null);
    React.useEffect(function () {
        setTimeout(function () {
            setNumGivenColumns(columnDefs.numGiven);
            setNumExpectColumns(columnDefs.numExpect);
        }, 1);
    }, [columnDefs]);
    React.useEffect(function () {
        // render depends on updated value of fetchedRows
        if (JSON.stringify(columnDefsState) !== JSON.stringify(columnDefs)) {
            setColumnDefsState(columnDefs);
        }
        if (lastForcedUpdateState !== lastForcedUpdate || JSON.stringify(fetchedRows) !== JSON.stringify(filteredRows.slice(0, rowsToFetch))) {
            setFetchedRows(filteredRows.slice(0, rowsToFetch));
        }
        if (JSON.stringify(definitionsState) !== JSON.stringify(definitions)) {
            setDefinitionsState(definitions);
        }
        if (JSON.stringify(columnNamesState) !== JSON.stringify(columnNames)) {
            setColumnNamesState(columnNames);
        }
    }, [columnDefs, filteredRows, definitions, columnNames, lastForcedUpdate]);
    var setNumGivenColumns = function (num) {
        document
            .getElementById("kie-grid")
            .style.setProperty("--num-given-columns", num.toString());
    };
    var setNumExpectColumns = function (num) {
        document
            .getElementById("kie-grid")
            .style.setProperty("--num-expect-columns", num.toString());
    };
    var activateCell = function (id) {
        if (id) {
            setEditable(id);
        }
    };
    var deactivateCell = function () {
        setEditable('');
    };
    var activateAndFocusCell = function (id) {
        activateCell(id);
        utils_1.focusCell(id);
    };
    var deactivateAndFocusCell = function (id) {
        deactivateCell(); // expensive, causes re-renders?
        utils_1.focusCell(id);
    };
    var onCellClick = function (event) {
        var id = event.target.id;
        if (id === editableCell) {
            // already active
            return null;
        }
        if (editableCell) {
            // get out of a previous cell editing mode
            deactivateCell();
        }
        return id;
    };
    /**
     * Enter editing mode
     */
    var onCellDoubleClick = function (event) {
        if (readOnly) {
            return;
        }
        var id = onCellClick(event);
        if (id) {
            activateAndFocusCell(id);
        }
    };
    /**
     * Enter editing mode
     */
    var onEnter = function (event) {
        // don't want Input's onEnter listener to fire
        event.stopPropagation();
        onCellDoubleClick(event);
    };
    /**
     * Up arrow key
     */
    var onUpKeyPress = function (event) {
        var activeElement = (document && document.activeElement && document.activeElement.getAttribute('id')) || '';
        if (expandedSelect) {
            return;
        }
        if (editableCell) {
            return;
        }
        var currentId = activeElement;
        var minRow = 0;
        var targetId;
        if (currentId) {
            // ['row', '1', 'column', '2']
            var currentIdArr = currentId.split(' ');
            var currentRow = Number.parseInt(currentIdArr[1]);
            // going up means decrementing the row
            var newRow = currentRow - 1;
            if (newRow < minRow) {
                return;
            }
            else {
                targetId = "row " + newRow + " column " + currentIdArr[3];
                utils_1.focusCell(targetId);
            }
        }
    };
    /**
     * Down arrow key
     */
    var onDownKeyPress = function (event) {
        var activeElement = (document && document.activeElement && document.activeElement.getAttribute('id')) || '';
        if (expandedSelect) {
            return;
        }
        if (editableCell) {
            return;
        }
        var currentId = activeElement;
        var maxRow = filteredRows.length - 1;
        var targetId;
        if (currentId) {
            // ['row', '1', 'column', '2']
            var currentIdArr = currentId.split(' ');
            var currentRow = Number.parseInt(currentIdArr[1]);
            // going down means incrementing the row
            var newRow = currentRow + 1;
            if (newRow > maxRow) {
                return;
            }
            else {
                targetId = "row " + newRow + " column " + currentIdArr[3];
                utils_1.focusCell(targetId);
            }
        }
    };
    /**
     * Left arrow key
     */
    var onLeftKeyPress = function (event) {
        var activeElement = (document && document.activeElement && document.activeElement.getAttribute('id')) || '';
        if (expandedSelect) {
            return;
        }
        if (editableCell) {
            return;
        }
        var currentId = activeElement;
        var minCol = 1;
        var targetId;
        if (currentId) {
            // ['row', '1', 'column', '2']
            var currentIdArr = currentId.split(' ');
            var currentCol = Number.parseInt(currentIdArr[3]);
            // going left means decrementing the column
            var newCol = currentCol - 1;
            if (newCol < minCol) {
                return;
            }
            else {
                targetId = "row " + currentIdArr[1] + " column " + newCol;
                utils_1.focusCell(targetId);
            }
        }
    };
    /**
     * Right arrow key
     */
    var onRightKeyPress = function (event) {
        var activeElement = (document && document.activeElement && document.activeElement.getAttribute('id')) || '';
        if (expandedSelect) {
            return;
        }
        if (editableCell) {
            return;
        }
        var currentId = activeElement;
        var maxCol = columnDefs.numGiven + columnDefs.numExpect + 1;
        var targetId;
        if (currentId) {
            // ['row', '1', 'column', '2']
            var currentIdArr = currentId.split(' ');
            var currentCol = Number.parseInt(currentIdArr[3]);
            // going right means incrementing the column
            var newCol = currentCol + 1;
            if (newCol > maxCol) {
                return;
            }
            else {
                targetId = "row " + currentIdArr[1] + " column " + newCol;
                utils_1.focusCell(targetId);
            }
        }
    };
    /**
     * Copy cell listener
     */
    var onCopy = function (event) {
        /* Get the text field */
        var copyText = event.target;
        if (copyText && copyText.select) {
            /* Select the text field */
            copyText.select();
            copyText.setSelectionRange(0, 99999); /*For mobile devices*/
            /* Copy the text inside the text field */
            document.execCommand('copy');
            // do not mark the whole text as selected
            utils_1.setCaretPositionAtEnd(copyText);
        }
    };
    // Command + C / CTRL + C copies the focused cell content
    utils_1.useKeyPress(/c/i, onCopy, { log: 'editor', withModifier: true });
    // Command + Z / CTRL + Z undo the last change
    utils_1.useKeyPress(/z/i, onUndo, { log: 'editor', withModifier: true, isActive: !readOnly });
    // Command + Shift + Z / CTRL + Shift + Z undo the last change
    utils_1.useKeyPress(/z/i, onRedo, { log: 'editor', withModifier: true, withShift: true, isActive: !readOnly });
    utils_1.useKeyPress('Enter', onEnter, { log: 'editor', isActive: (!editableCell && !readOnly) });
    utils_1.useKeyPress(38, onUpKeyPress, { log: 'editor' });
    utils_1.useKeyPress(40, onDownKeyPress, { log: 'editor' });
    utils_1.useKeyPress(37, onLeftKeyPress, { log: 'editor' });
    utils_1.useKeyPress(39, onRightKeyPress, { log: 'editor' });
    var onSelectToggleCallback = function (id, isExpanded) {
        setExpandedSelect(isExpanded);
    };
    // rowData
    var fetchMoreRows = function (page) {
        if (page) {
            setFetchedRows(function (prevState) { return (__spreadArrays(prevState, filteredRows.slice(page * rowsToFetch, page * rowsToFetch + rowsToFetch))); });
        }
        else {
            setFetchedRows(function (prevState) { return (__spreadArrays(prevState, filteredRows.slice(currentPage * rowsToFetch, currentPage * rowsToFetch + rowsToFetch))); });
            setCurrentPage(currentPage + 1);
        }
    };
    // console.log(fetchedRows);
    // console.log(columnNamesState);
    return !fetchedRows ? null : (React.createElement(React.Fragment, null,
        React.createElement("div", { id: "kie-grid", className: "kie-grid", ref: editorRef },
            columnDefsState.other.map(function (other, index) {
                if (index === 0) {
                    return React.createElement("div", { className: "kie-grid__item kie-grid__number", key: "other-number" }, other.name);
                }
                else {
                    return (React.createElement("div", { className: "kie-grid__item kie-grid__description", key: "other-description" }, other.name));
                }
            }),
            React.createElement("div", { className: "kie-grid__header--given" },
                React.createElement("div", { className: "kie-grid__item kie-grid__given" }, "GIVEN")),
            React.createElement("div", { className: "kie-grid__header--expect" },
                React.createElement("div", { className: "kie-grid__item kie-grid__expect" }, "EXPECT")),
            React.createElement("div", { className: "kie-grid__header--given" }, columnDefsState.given.map(function (given, index) { return (React.createElement("div", { key: "given instance " + index, className: "kie-grid__item kie-grid__instance", style: { gridColumn: "span " + given.children.length } }, given.group)); })),
            React.createElement("div", { className: "kie-grid__header--expect" }, columnDefsState.expect.map(function (expect, index) { return (React.createElement("div", { key: "expect instance " + index, className: "kie-grid__item kie-grid__instance", style: { gridColumn: "span " + expect.children.length } }, expect.group)); })),
            React.createElement("div", { className: "kie-grid__header--given" }, columnDefsState.given.map(function (given, index) {
                return given.children.map(function (givenChild, index) { return (React.createElement("div", { key: "given property " + index, className: "kie-grid__item kie-grid__property" }, givenChild.name)); });
            })),
            React.createElement("div", { className: "kie-grid__header--expect" }, columnDefsState.expect.map(function (expect, index) {
                return expect.children.map(function (expectChild, index) { return (React.createElement("div", { key: "expect property " + index, className: "kie-grid__item kie-grid__property" }, expectChild.name)); });
            })),
            React.createElement("div", { className: "kie-grid__body" },
                React.createElement(react_infinite_scroll_component_1.default, { dataLength: fetchedRows.length, next: fetchMoreRows, hasMore: fetchedRows.length < filteredRows.length, loader: React.createElement(Spinner_1.Spinner, { className: "kie-grid__item kie-grid__item--loading pf-u-pt-sm", size: "md" }), scrollableTarget: "sce-sim-grid__main" }, fetchedRows.map(function (row, rowIndex) { return (React.createElement("div", { className: "kie-grid__rule", style: {}, key: "row " + row[0].value }, row.map(function (cell, index) {
                    // get the type of the column to pass on to the input for formatting / validation
                    var type = 'string';
                    var columnGroup = '';
                    var columnName = '';
                    if (index === 0) {
                        // row index
                        type = 'number';
                    }
                    else if (index === 1) {
                        // description
                        type = 'string';
                    }
                    else if (index > 1) {
                        columnGroup = columnNamesState[index].group;
                        columnName = columnNamesState[index].name;
                        type = (definitionsState.map[columnNamesState[index].group] && definitionsState.map[columnGroup][columnName]) || 'string';
                    }
                    var cellIndex = index;
                    var value = cell && cell.value ? cell.value : '';
                    var path = cell && cell.path ? cell.path : '';
                    // const cellId = `cell ${cellIndex}`;
                    var inputId = "row " + rowIndex + " column " + cellIndex;
                    var component;
                    var typeArr = type.split(',');
                    if (typeArr.length > 1) {
                        // Multiple options, render Select
                        component = (React.createElement(Cell_1.Select, { isReadOnly: inputId !== editableCell, id: inputId, originalValue: value, onSelectToggleCallback: onSelectToggleCallback, options: typeArr.map(function (string) { return string.trim(); }), deactivateAndFocusCell: deactivateAndFocusCell, setEditable: setEditable, onSave: onSave }));
                    }
                    else {
                        component = (React.createElement(Cell_1.Input, { isReadOnly: inputId !== editableCell, id: inputId, originalValue: value, path: path, type: type, deactivateAndFocusCell: deactivateAndFocusCell, setEditable: setEditable, onSave: onSave }));
                    }
                    return (React.createElement("div", { className: "kie-grid__item", key: inputId, onClick: onCellClick, onDoubleClick: onCellDoubleClick }, cellIndex === 0 ? value : component));
                }))); }))))));
}, function (prevProps, nextProps) {
    if (prevProps.lastForcedUpdate !== nextProps.lastForcedUpdate) {
        console.log('forced Editor update');
        return false;
    }
    if (prevProps.filteredRows.length !== nextProps.filteredRows.length || JSON.stringify(prevProps.filteredRows) !== JSON.stringify(nextProps.filteredRows)) {
        // filteredRows have changed, re-render
        return false;
    }
    return true;
});
exports.Editor = Editor;
// @ts-ignore
Editor.whyDidYouRender = {
    customName: 'Editor'
};
//# sourceMappingURL=Editor.js.map
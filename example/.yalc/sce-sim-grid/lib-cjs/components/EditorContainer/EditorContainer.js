"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("@patternfly/patternfly/patternfly.css");
require("@patternfly/patternfly/patternfly-addons.css");
var react_core_1 = require("@patternfly/react-core");
var react_icons_1 = require("@patternfly/react-icons");
var classnames_1 = __importDefault(require("classnames"));
var React = __importStar(require("react"));
var Editor_1 = require("../Editor");
var Sidebar_1 = require("../Sidebar");
var Toolbar_1 = require("../Toolbar");
var utils_1 = require("../utils");
var scesimUtils_1 = require("./scesimUtils");
var EditorContainer = React.memo(function (_a) {
    // console.log('render EditorContainer');
    var data = _a.data, model = _a.model, _b = _a.showSidePanel, showSidePanel = _b === void 0 ? true : _b, _c = _a.readOnly, readOnly = _c === void 0 ? false : _c;
    var increaseRows = function (rows) {
        // increase rows for performance testing / infinite sroll testing etc
        var enabled = false;
        var numRowsToAdd = 2000;
        if (enabled) {
            for (var i = 0; i < numRowsToAdd; i++) {
                var clonedRow = JSON.parse(JSON.stringify(rows[0]));
                // update the Index
                clonedRow[0].value = (i + 6).toString();
                rows.push(clonedRow);
            }
        }
        return rows;
    };
    var dataJson = utils_1.getJsonFromSceSim(data);
    var initialColumns = scesimUtils_1.getColumns(dataJson, true);
    var initialRows = scesimUtils_1.getRows(dataJson, initialColumns);
    initialRows = increaseRows(initialRows);
    var _d = React.useState(true), isDrawerExpanded = _d[0], setDrawerExpanded = _d[1];
    var _e = React.useState({
        undoList: [],
        redoList: [],
        skipUpdate: false,
    }), undoRedo = _e[0], setUndoRedo = _e[1];
    var _f = React.useState(initialRows), allRows = _f[0], setAllRows = _f[1];
    var _g = React.useState(initialRows), filteredRows = _g[0], setFilteredRows = _g[1];
    var _h = React.useState(scesimUtils_1.getDmnFilePath(dataJson)), dmnFilePath = _h[0], setDmnFilePath = _h[1];
    var _j = React.useState(scesimUtils_1.getDmnName(dataJson)), dmnName = _j[0], setDmnName = _j[1];
    var _k = React.useState(initialColumns), columns = _k[0], setColumns = _k[1];
    var initialColumnNames = scesimUtils_1.getColumnNames(dataJson);
    var _l = React.useState(initialColumnNames), columnNames = _l[0], setColumnNames = _l[1];
    var initialItemToColumnIndexMap = [];
    initialColumnNames.forEach(function (item, index) {
        var value = item.name ? item.group + " | " + item.name : item.group;
        initialItemToColumnIndexMap[value] = index;
    });
    var _m = React.useState(initialItemToColumnIndexMap), itemToColumnIndexMap = _m[0], setItemToColumnIndexMap = _m[1];
    var _o = React.useState([]), filterSelection = _o[0], setFilterSelection = _o[1];
    var _p = React.useState((Date.now()).toString()), lastForcedUpdateState = _p[0], setLastForcedUpdateState = _p[1];
    // optional model
    var initialDefinitions = model ? scesimUtils_1.getDefinitions(utils_1.getJsonFromDmn(model)) : null;
    var _q = React.useState(initialDefinitions), definitions = _q[0], setDefinitions = _q[1];
    React.useEffect(function () {
        // when data or model changes, recompute rows and columns
        var dataJson = utils_1.getJsonFromSceSim(data);
        var updatedColumns = scesimUtils_1.getColumns(dataJson, true);
        var updatedRows = scesimUtils_1.getRows(dataJson, updatedColumns);
        updatedRows = increaseRows(updatedRows);
        if (JSON.stringify(allRows) !== JSON.stringify(updatedRows)) {
            setDmnFilePath(scesimUtils_1.getDmnFilePath(dataJson));
            setColumns(updatedColumns);
            setColumnNames(scesimUtils_1.getColumnNames(dataJson));
            setAllRows(updatedRows);
            setFilteredRows(updatedRows);
            setUndoRedo({
                undoList: [],
                redoList: [],
                skipUpdate: false,
            });
            var indexMap_1 = [];
            initialColumnNames.forEach(function (item, index) {
                var value = item.name ? item.group + " | " + item.name : item.group;
                indexMap_1[value] = index;
            });
            setItemToColumnIndexMap(initialColumnNames);
        }
        // update the optional model
        var updatedDefinitions = model ? scesimUtils_1.getDefinitions(utils_1.getJsonFromDmn(model)) : null;
        if (JSON.stringify(definitions) !== JSON.stringify(updatedDefinitions)) {
            setDefinitions(updatedDefinitions);
        }
    }, [data, model]);
    React.useEffect(function () {
        var searchValue = document.getElementById('gridSearch').value;
        filterRows(searchValue, filterSelection, allRows);
        if (undoRedo.skipUpdate) {
            return;
        }
        setLastForcedUpdateState((Date.now()).toString());
    }, [undoRedo]);
    /**
     * Toggle the sidebar
     */
    var toggleDrawer = function () {
        setDrawerExpanded(!isDrawerExpanded);
    };
    /**
     * Callback function for Editor inputs. When they're saved we add it to the list of changes for change-tracking.
     */
    var addToChanges = function (id, value, previousValue) {
        var _a = utils_1.getRowColumnFromId(id), row = _a.row, column = _a.column;
        // const clonedAllRows = cloneDeep(allRows);
        console.log("changing " + allRows[row][column].value + " to " + value);
        allRows[row][column].value = value;
        // setAllRows(allRows);
        // new change clears the redoList
        setUndoRedo(function (previousState) { return ({
            undoList: __spreadArrays(previousState.undoList, [{ id: id, value: value, previousValue: previousValue }]),
            redoList: [],
            skipUpdate: true,
        }); });
    };
    /**
     * Reverts the last Input change
     * Pop the undo stack and push it onto redo stack
     */
    var onUndo = function () {
        if (undoRedo.undoList.length > 0) {
            var clonedChanges_1 = __spreadArrays(undoRedo.undoList);
            var lastChange_1 = clonedChanges_1.pop();
            setUndoRedo(function (previousState) { return ({
                undoList: clonedChanges_1,
                redoList: __spreadArrays(previousState.redoList, [lastChange_1]),
                skipUpdate: false,
            }); });
            var id = lastChange_1.id, previousValue = lastChange_1.previousValue;
            var _a = utils_1.getRowColumnFromId(id), row = _a.row, column = _a.column;
            allRows[row][column].value = previousValue;
            // let clonedAllRows = cloneDeep(allRows);
            // clonedAllRows[row][column].value = previousValue;
            // setAllRows(clonedAllRows);
            // filterRows(searchValueState, filterSelection, clonedAllRows);
        }
    };
    /**
     * Pop it from the redo stack and push it onto undo stack
     * a new change clears the redo stack
     */
    var onRedo = function () {
        if (undoRedo.redoList.length > 0) {
            var clonedRedoList_1 = __spreadArrays(undoRedo.redoList);
            var lastRedo_1 = clonedRedoList_1.pop();
            setUndoRedo(function (previousState) { return ({
                undoList: __spreadArrays(previousState.undoList, [lastRedo_1]),
                redoList: clonedRedoList_1,
                skipUpdate: false,
            }); });
            var id = lastRedo_1.id, value = lastRedo_1.value;
            var _a = utils_1.getRowColumnFromId(id), row = _a.row, column = _a.column;
            allRows[row][column].value = value;
            // const clonedAllRows = cloneDeep(allRows);
            // clonedAllRows[row][column].value = value;
            // setAllRows(clonedAllRows);
            // filterRows(searchValueState, filterSelection, clonedAllRows);
        }
    };
    // Command + Z / CTRL + Z undo the last change
    utils_1.useKeyPress(/z/i, onUndo, { log: 'editor-container', withModifier: true, isActive: !readOnly });
    // Command + Shift + Z / CTRL + Shift + Z redo the last change
    utils_1.useKeyPress(/z/i, onRedo, { log: 'editor-container', withModifier: true, withShift: true, isActive: !readOnly });
    /**
     * Filter the rows based on search and filter selection
     * Callback function for EditorToolbar, called on filter/search change
     */
    var filterRows = function (value, selected, rowsToFilter) {
        var rows = rowsToFilter || allRows;
        if (JSON.stringify(filterSelection) !== JSON.stringify(selected)) {
            setFilterSelection(selected);
        }
        if (!value) {
            // no search term, show all rows
            return setFilteredRows(rows);
        }
        var searchRE = new RegExp(value, 'i');
        var rowsAfterFilter = rows.filter(function (row) {
            var found = false;
            if (selected.length === 0) {
                // search all columns
                for (var _i = 0, row_1 = row; _i < row_1.length; _i++) {
                    var col = row_1[_i];
                    if (col && searchRE.test(col.value)) {
                        found = true;
                        break;
                    }
                }
            }
            else {
                // search only the selected columns
                for (var _a = 0, selected_1 = selected; _a < selected_1.length; _a++) {
                    var sel = selected_1[_a];
                    var columnIndex = itemToColumnIndexMap[sel];
                    if (row[columnIndex] && searchRE.test(row[columnIndex].value)) {
                        found = true;
                        break;
                    }
                }
            }
            return found;
        });
        setFilteredRows(rowsAfterFilter);
    };
    return (React.createElement("div", { className: "pf-m-redhat-font" },
        React.createElement("div", { className: "pf-c-page" },
            React.createElement("header", { role: "banner", className: "pf-c-page__header" },
                React.createElement("div", { className: "pf-c-page__header-brand" },
                    showSidePanel && React.createElement("div", { className: "pf-c-page__header-brand-toggle" },
                        React.createElement(react_core_1.Button, { id: "nav-toggle", onClick: toggleDrawer, "aria-label": "Toggle drawer", "aria-controls": "page-sidebar", "aria-expanded": isDrawerExpanded ? 'true' : 'false', variant: "plain" },
                            React.createElement(react_icons_1.BarsIcon, null))),
                    React.createElement("div", { className: "pf-c-page__header-brand-link" }, (definitions && definitions._title) || dmnName)),
                React.createElement("div", { className: "pf-c-page__header-tools" },
                    React.createElement(Toolbar_1.EditorToolbar, { data: data, allRowsLength: allRows.length, filteredRowsLength: filteredRows.length, filterRows: filterRows, columnNames: columnNames, readOnly: readOnly, undoRedo: undoRedo, onUndo: onUndo, onRedo: onRedo }))),
            showSidePanel && definitions && React.createElement("div", { className: classnames_1.default('pf-c-page__sidebar pf-m-dark', isDrawerExpanded && 'pf-m-expanded', !isDrawerExpanded && 'pf-m-collapsed') },
                React.createElement("div", { className: "pf-c-page__sidebar-body" },
                    React.createElement(Sidebar_1.DefinitionsDrawerPanel, { definitions: definitions, dmnFilePath: dmnFilePath }))),
            React.createElement("main", { role: "main", className: "pf-c-page__main", id: "sce-sim-grid__main", tabIndex: -1 },
                React.createElement("section", { className: "pf-c-page__main-section pf-m-light" },
                    React.createElement(Editor_1.Editor, { columns: columns, filteredRows: filteredRows, definitions: definitions, columnNames: columnNames, onSave: addToChanges, lastForcedUpdate: lastForcedUpdateState, readOnly: readOnly }))))));
}, function (prevProps, nextProps) {
    if (JSON.stringify(prevProps.data) !== JSON.stringify(nextProps.data)) {
        // data has changed, re-render
        // console.log('re-render EditorContainer');
        return false;
    }
    if (JSON.stringify(prevProps.model) !== JSON.stringify(nextProps.model)) {
        // model has changed, re-render
        // console.log('re-render EditorContainer');
        return false;
    }
    // console.log('not re-rendering EditorContainer');
    return true;
});
exports.EditorContainer = EditorContainer;
// @ts-ignore
EditorContainer.whyDidYouRender = {
    customName: 'EditorContainer',
};
//# sourceMappingURL=EditorContainer.js.map
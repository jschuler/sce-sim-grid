var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import "@patternfly/patternfly/patternfly.css";
import "@patternfly/patternfly/patternfly-addons.css";
import { Button } from '@patternfly/react-core';
import { BarsIcon } from '@patternfly/react-icons';
import classNames from 'classnames';
import * as React from 'react';
import { Editor } from '../Editor';
import { DefinitionsDrawerPanel } from '../Sidebar';
import { EditorToolbar } from '../Toolbar';
import { getRowColumnFromId, getJsonFromSceSim, getJsonFromDmn, useKeyPress } from '../utils';
import { getColumnNames, getColumns, getDefinitions, getDmnFilePath, getDmnName, getRows } from './scesimUtils';
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
    var dataJson = getJsonFromSceSim(data);
    var initialColumns = getColumns(dataJson, true);
    var initialRows = getRows(dataJson, initialColumns);
    initialRows = increaseRows(initialRows);
    var _d = React.useState(true), isDrawerExpanded = _d[0], setDrawerExpanded = _d[1];
    var _e = React.useState({
        undoList: [],
        redoList: [],
        skipUpdate: false,
    }), undoRedo = _e[0], setUndoRedo = _e[1];
    var _f = React.useState(initialRows), allRows = _f[0], setAllRows = _f[1];
    var _g = React.useState(initialRows), filteredRows = _g[0], setFilteredRows = _g[1];
    var _h = React.useState(getDmnFilePath(dataJson)), dmnFilePath = _h[0], setDmnFilePath = _h[1];
    var _j = React.useState(getDmnName(dataJson)), dmnName = _j[0], setDmnName = _j[1];
    var _k = React.useState(initialColumns), columns = _k[0], setColumns = _k[1];
    var initialColumnNames = getColumnNames(dataJson);
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
    var initialDefinitions = model ? getDefinitions(getJsonFromDmn(model)) : null;
    var _q = React.useState(initialDefinitions), definitions = _q[0], setDefinitions = _q[1];
    React.useEffect(function () {
        // when data or model changes, recompute rows and columns
        var dataJson = getJsonFromSceSim(data);
        var updatedColumns = getColumns(dataJson, true);
        var updatedRows = getRows(dataJson, updatedColumns);
        updatedRows = increaseRows(updatedRows);
        if (JSON.stringify(allRows) !== JSON.stringify(updatedRows)) {
            setDmnFilePath(getDmnFilePath(dataJson));
            setColumns(updatedColumns);
            setColumnNames(getColumnNames(dataJson));
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
        var updatedDefinitions = model ? getDefinitions(getJsonFromDmn(model)) : null;
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
        var _a = getRowColumnFromId(id), row = _a.row, column = _a.column;
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
            var _a = getRowColumnFromId(id), row = _a.row, column = _a.column;
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
            var _a = getRowColumnFromId(id), row = _a.row, column = _a.column;
            allRows[row][column].value = value;
            // const clonedAllRows = cloneDeep(allRows);
            // clonedAllRows[row][column].value = value;
            // setAllRows(clonedAllRows);
            // filterRows(searchValueState, filterSelection, clonedAllRows);
        }
    };
    // Command + Z / CTRL + Z undo the last change
    useKeyPress(/z/i, onUndo, { log: 'editor-container', withModifier: true, isActive: !readOnly });
    // Command + Shift + Z / CTRL + Shift + Z redo the last change
    useKeyPress(/z/i, onRedo, { log: 'editor-container', withModifier: true, withShift: true, isActive: !readOnly });
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
                        React.createElement(Button, { id: "nav-toggle", onClick: toggleDrawer, "aria-label": "Toggle drawer", "aria-controls": "page-sidebar", "aria-expanded": isDrawerExpanded ? 'true' : 'false', variant: "plain" },
                            React.createElement(BarsIcon, null))),
                    React.createElement("div", { className: "pf-c-page__header-brand-link" }, (definitions && definitions._title) || dmnName)),
                React.createElement("div", { className: "pf-c-page__header-tools" },
                    React.createElement(EditorToolbar, { data: data, allRowsLength: allRows.length, filteredRowsLength: filteredRows.length, filterRows: filterRows, columnNames: columnNames, readOnly: readOnly, undoRedo: undoRedo, onUndo: onUndo, onRedo: onRedo }))),
            showSidePanel && definitions && React.createElement("div", { className: classNames('pf-c-page__sidebar pf-m-dark', isDrawerExpanded && 'pf-m-expanded', !isDrawerExpanded && 'pf-m-collapsed') },
                React.createElement("div", { className: "pf-c-page__sidebar-body" },
                    React.createElement(DefinitionsDrawerPanel, { definitions: definitions, dmnFilePath: dmnFilePath }))),
            React.createElement("main", { role: "main", className: "pf-c-page__main", id: "sce-sim-grid__main", tabIndex: -1 },
                React.createElement("section", { className: "pf-c-page__main-section pf-m-light" },
                    React.createElement(Editor, { columns: columns, filteredRows: filteredRows, definitions: definitions, columnNames: columnNames, onSave: addToChanges, lastForcedUpdate: lastForcedUpdateState, readOnly: readOnly }))))));
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
// @ts-ignore
EditorContainer.whyDidYouRender = {
    customName: 'EditorContainer',
};
export { EditorContainer };
//# sourceMappingURL=EditorContainer.js.map
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditorContainer = void 0;

var React = _interopRequireWildcard(require("react"));

var _reactCore = require("@patternfly/react-core");

var _reactIcons = require("@patternfly/react-icons");

var _Editor = require("../Editor");

var _Sidebar = require("../Sidebar");

var _scesimUtils = require("./scesimUtils");

var _utils = require("../utils");

var _Toolbar = require("../Toolbar");

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var EditorContainer = React.memo(function (_ref) {
  var data = _ref.data,
      model = _ref.model,
      _ref$showSidePanel = _ref.showSidePanel,
      showSidePanel = _ref$showSidePanel === void 0 ? true : _ref$showSidePanel,
      _ref$readOnly = _ref.readOnly,
      readOnly = _ref$readOnly === void 0 ? false : _ref$readOnly;
  console.log('render EditorContainer');

  var increaseRows = function increaseRows(rows) {
    // increase rows for performance testing / infinite sroll testing etc
    var enabled = false;
    var numRowsToAdd = 2000;

    if (enabled) {
      for (var i = 0; i < numRowsToAdd; i++) {
        var clonedRow = JSON.parse(JSON.stringify(rows[0])); // update the Index

        clonedRow[0].value = (i + 6).toString();
        rows.push(clonedRow);
      }
    }

    return rows;
  };

  var initialDefinitions = (0, _scesimUtils.getDefinitions)(model);
  var initialColumns = (0, _scesimUtils.getColumns)(data, true);
  var initialRows = (0, _scesimUtils.getRows)(data, initialColumns);
  initialRows = increaseRows(initialRows);
  var initialColumnNames = (0, _scesimUtils.getColumnNames)(data);

  var _React$useState = React.useState(true),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      isDrawerExpanded = _React$useState2[0],
      setDrawerExpanded = _React$useState2[1];

  var _React$useState3 = React.useState({
    undoList: [],
    redoList: [],
    skipUpdate: false
  }),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      undoRedo = _React$useState4[0],
      setUndoRedo = _React$useState4[1];

  var _React$useState5 = React.useState(initialRows),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      allRows = _React$useState6[0],
      setAllRows = _React$useState6[1];

  var _React$useState7 = React.useState(initialRows),
      _React$useState8 = _slicedToArray(_React$useState7, 2),
      filteredRows = _React$useState8[0],
      setFilteredRows = _React$useState8[1];

  var _React$useState9 = React.useState(initialDefinitions),
      _React$useState10 = _slicedToArray(_React$useState9, 2),
      definitions = _React$useState10[0],
      setDefinitions = _React$useState10[1];

  var _React$useState11 = React.useState((0, _scesimUtils.getDmnFilePath)(data)),
      _React$useState12 = _slicedToArray(_React$useState11, 2),
      dmnFilePath = _React$useState12[0],
      setDmnFilePath = _React$useState12[1];

  var _React$useState13 = React.useState(initialColumns),
      _React$useState14 = _slicedToArray(_React$useState13, 2),
      columns = _React$useState14[0],
      setColumns = _React$useState14[1];

  var _React$useState15 = React.useState(initialColumnNames),
      _React$useState16 = _slicedToArray(_React$useState15, 2),
      columnNames = _React$useState16[0],
      setColumnNames = _React$useState16[1];

  var initialItemToColumnIndexMap = [];
  initialColumnNames.forEach(function (item, index) {
    var value = "".concat(item.group, " ").concat(item.name);
    initialItemToColumnIndexMap[value] = index;
  });

  var _React$useState17 = React.useState(initialItemToColumnIndexMap),
      _React$useState18 = _slicedToArray(_React$useState17, 2),
      itemToColumnIndexMap = _React$useState18[0],
      setItemToColumnIndexMap = _React$useState18[1];

  var _React$useState19 = React.useState(''),
      _React$useState20 = _slicedToArray(_React$useState19, 2),
      searchValueState = _React$useState20[0],
      setSearchValueState = _React$useState20[1];

  var _React$useState21 = React.useState([]),
      _React$useState22 = _slicedToArray(_React$useState21, 2),
      filterSelection = _React$useState22[0],
      setFilterSelection = _React$useState22[1];

  var _React$useState23 = React.useState(Date.now().toString()),
      _React$useState24 = _slicedToArray(_React$useState23, 2),
      lastForcedUpdateState = _React$useState24[0],
      setLastForcedUpdateState = _React$useState24[1];

  React.useEffect(function () {
    // when data or model changes, recompute rows and columns
    var updatedDefinitions = (0, _scesimUtils.getDefinitions)(model);
    var updatedColumns = (0, _scesimUtils.getColumns)(data, true);
    var updatedRows = (0, _scesimUtils.getRows)(data, updatedColumns);
    updatedRows = increaseRows(updatedRows);

    if (JSON.stringify(definitions) !== JSON.stringify(updatedDefinitions)) {
      setDefinitions(updatedDefinitions);
    }

    if (JSON.stringify(allRows) !== JSON.stringify(updatedRows)) {
      setDmnFilePath((0, _scesimUtils.getDmnFilePath)(data));
      setColumns(updatedColumns);
      setColumnNames((0, _scesimUtils.getColumnNames)(data));
      setAllRows(updatedRows);
      setFilteredRows(updatedRows);
      setUndoRedo({
        undoList: [],
        redoList: [],
        skipUpdate: false
      });
      var _itemToColumnIndexMap = [];
      initialColumnNames.forEach(function (item, index) {
        var value = "".concat(item.group, " ").concat(item.name);
        _itemToColumnIndexMap[value] = index;
      });
      setItemToColumnIndexMap(initialColumnNames);
    }
  }, [data, model]);
  React.useEffect(function () {
    var searchValue = document.getElementById('gridSearch').value;
    filterRows(searchValue, filterSelection, allRows);

    if (undoRedo.skipUpdate) {
      return;
    }

    setLastForcedUpdateState(Date.now().toString());
  }, [undoRedo]);
  /**
   * Toggle the sidebar
   */

  var toggleDrawer = function toggleDrawer() {
    setDrawerExpanded(!isDrawerExpanded);
  };
  /** 
   * Callback function for Editor inputs. When they're saved we add it to the list of changes for change-tracking.
   */


  var addToChanges = function addToChanges(id, value, previousValue) {
    var _getRowColumnFromId = (0, _utils.getRowColumnFromId)(id),
        row = _getRowColumnFromId.row,
        column = _getRowColumnFromId.column; // const clonedAllRows = cloneDeep(allRows);


    allRows[row][column].value = value; // setAllRows(allRows);
    // new change clears the redoList

    setUndoRedo(function (previousState) {
      return {
        undoList: [].concat(_toConsumableArray(previousState.undoList), [{
          id: id,
          value: value,
          previousValue: previousValue
        }]),
        redoList: [],
        skipUpdate: true
      };
    });
  };
  /**
   * Reverts the last Input change
   * Pop the undo stack and push it onto redo stack
   */


  var onUndo = function onUndo() {
    if (undoRedo.undoList.length > 0) {
      var clonedChanges = _toConsumableArray(undoRedo.undoList);

      var lastChange = clonedChanges.pop();
      setUndoRedo(function (previousState) {
        return {
          undoList: clonedChanges,
          redoList: [].concat(_toConsumableArray(previousState.redoList), [lastChange]),
          skipUpdate: false
        };
      });
      var id = lastChange.id,
          previousValue = lastChange.previousValue;

      var _getRowColumnFromId2 = (0, _utils.getRowColumnFromId)(id),
          row = _getRowColumnFromId2.row,
          column = _getRowColumnFromId2.column;

      allRows[row][column].value = previousValue; // let clonedAllRows = cloneDeep(allRows);
      // clonedAllRows[row][column].value = previousValue;
      // setAllRows(clonedAllRows);
      // filterRows(searchValueState, filterSelection, clonedAllRows);
    }
  };
  /**
   * Pop it from the redo stack and push it onto undo stack
   * a new change clears the redo stack
   */


  var onRedo = function onRedo() {
    if (undoRedo.redoList.length > 0) {
      var clonedRedoList = _toConsumableArray(undoRedo.redoList);

      var lastRedo = clonedRedoList.pop();
      setUndoRedo(function (previousState) {
        return {
          undoList: [].concat(_toConsumableArray(previousState.undoList), [lastRedo]),
          redoList: clonedRedoList,
          skipUpdate: false
        };
      });
      var id = lastRedo.id,
          value = lastRedo.value;

      var _getRowColumnFromId3 = (0, _utils.getRowColumnFromId)(id),
          row = _getRowColumnFromId3.row,
          column = _getRowColumnFromId3.column;

      allRows[row][column].value = value; // const clonedAllRows = cloneDeep(allRows);
      // clonedAllRows[row][column].value = value;
      // setAllRows(clonedAllRows);
      // filterRows(searchValueState, filterSelection, clonedAllRows);
    }
  };
  /**
   * Filter the rows based on search and filter selection
   * Callback function for EditorToolbar, called on filter/search change
   */


  var filterRows = function filterRows(value, selected, rowsToFilter) {
    var rows = rowsToFilter || allRows;

    if (JSON.stringify(filterSelection) !== JSON.stringify(selected)) {
      setFilterSelection(selected);
    }

    if (!value) {
      // no search term, show all rows
      return setFilteredRows(rows);
    }

    var searchRE = new RegExp(value, 'i');
    var filteredRows = rows.filter(function (row) {
      var found = false;

      if (selected.length === 0) {
        // search all columns
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = row[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var col = _step.value;

            if (col && searchRE.test(col.value)) {
              found = true;
              break;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      } else {
        // search only the selected columns
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = selected[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var sel = _step2.value;
            var columnIndex = itemToColumnIndexMap[sel];

            if (row[columnIndex] && searchRE.test(row[columnIndex].value)) {
              found = true;
              break;
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }

      return found;
    });
    setFilteredRows(filteredRows);
  };

  return React.createElement("div", {
    className: "pf-m-redhat-font"
  }, React.createElement("div", {
    className: "pf-c-page"
  }, React.createElement("header", {
    role: "banner",
    className: "pf-c-page__header"
  }, React.createElement("div", {
    className: "pf-c-page__header-brand"
  }, showSidePanel && React.createElement("div", {
    className: "pf-c-page__header-brand-toggle"
  }, React.createElement(_reactCore.Button, {
    id: "nav-toggle",
    onClick: toggleDrawer,
    "aria-label": "Toggle drawer",
    "aria-controls": "page-sidebar",
    "aria-expanded": isDrawerExpanded ? 'true' : 'false',
    variant: "plain"
  }, React.createElement(_reactIcons.BarsIcon, null))), React.createElement("div", {
    className: "pf-c-page__header-brand-link"
  }, definitions._title)), React.createElement("div", {
    className: "pf-c-page__header-tools"
  }, React.createElement(_Toolbar.EditorToolbar, {
    data: data,
    allRowsLength: allRows.length,
    filteredRowsLength: filteredRows.length,
    filterRows: filterRows,
    columnNames: columnNames,
    readOnly: readOnly,
    undoRedo: undoRedo,
    onUndo: onUndo,
    onRedo: onRedo
  }))), showSidePanel && React.createElement("div", {
    className: (0, _classnames.default)("pf-c-page__sidebar pf-m-dark", isDrawerExpanded && 'pf-m-expanded', !isDrawerExpanded && 'pf-m-collapsed')
  }, React.createElement("div", {
    className: "pf-c-page__sidebar-body"
  }, React.createElement(_Sidebar.DefinitionsDrawerPanel, {
    definitions: definitions,
    dmnFilePath: dmnFilePath
  }))), React.createElement("main", {
    role: "main",
    className: "pf-c-page__main",
    id: "sce-sim-grid__main",
    tabIndex: -1
  }, React.createElement("section", {
    className: "pf-c-page__main-section pf-m-light"
  }, React.createElement(_Editor.Editor, {
    columns: columns,
    filteredRows: filteredRows,
    definitions: definitions,
    columnNames: columnNames,
    onSave: addToChanges,
    onUndo: onUndo,
    onRedo: onRedo,
    lastForcedUpdate: lastForcedUpdateState,
    readOnly: readOnly
  })))));
}, function (prevProps, nextProps) {
  if (JSON.stringify(prevProps.data) !== JSON.stringify(nextProps.data)) {
    // data has changed, re-render
    return false;
  }

  if (JSON.stringify(prevProps.model) !== JSON.stringify(nextProps.model)) {
    // model has changed, re-render
    return false;
  }

  return true;
}); // @ts-ignore

exports.EditorContainer = EditorContainer;
EditorContainer.whyDidYouRender = {
  customName: 'EditorContainer'
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvY29tcG9uZW50cy9FZGl0b3JDb250YWluZXIvRWRpdG9yQ29udGFpbmVyLnRzeCJdLCJuYW1lcyI6WyJFZGl0b3JDb250YWluZXIiLCJSZWFjdCIsIm1lbW8iLCJkYXRhIiwibW9kZWwiLCJzaG93U2lkZVBhbmVsIiwicmVhZE9ubHkiLCJjb25zb2xlIiwibG9nIiwiaW5jcmVhc2VSb3dzIiwicm93cyIsImVuYWJsZWQiLCJudW1Sb3dzVG9BZGQiLCJpIiwiY2xvbmVkUm93IiwiSlNPTiIsInBhcnNlIiwic3RyaW5naWZ5IiwidmFsdWUiLCJ0b1N0cmluZyIsInB1c2giLCJpbml0aWFsRGVmaW5pdGlvbnMiLCJpbml0aWFsQ29sdW1ucyIsImluaXRpYWxSb3dzIiwiaW5pdGlhbENvbHVtbk5hbWVzIiwidXNlU3RhdGUiLCJpc0RyYXdlckV4cGFuZGVkIiwic2V0RHJhd2VyRXhwYW5kZWQiLCJ1bmRvTGlzdCIsInJlZG9MaXN0Iiwic2tpcFVwZGF0ZSIsInVuZG9SZWRvIiwic2V0VW5kb1JlZG8iLCJhbGxSb3dzIiwic2V0QWxsUm93cyIsImZpbHRlcmVkUm93cyIsInNldEZpbHRlcmVkUm93cyIsImRlZmluaXRpb25zIiwic2V0RGVmaW5pdGlvbnMiLCJkbW5GaWxlUGF0aCIsInNldERtbkZpbGVQYXRoIiwiY29sdW1ucyIsInNldENvbHVtbnMiLCJjb2x1bW5OYW1lcyIsInNldENvbHVtbk5hbWVzIiwiaW5pdGlhbEl0ZW1Ub0NvbHVtbkluZGV4TWFwIiwiZm9yRWFjaCIsIml0ZW0iLCJpbmRleCIsImdyb3VwIiwibmFtZSIsIml0ZW1Ub0NvbHVtbkluZGV4TWFwIiwic2V0SXRlbVRvQ29sdW1uSW5kZXhNYXAiLCJzZWFyY2hWYWx1ZVN0YXRlIiwic2V0U2VhcmNoVmFsdWVTdGF0ZSIsImZpbHRlclNlbGVjdGlvbiIsInNldEZpbHRlclNlbGVjdGlvbiIsIkRhdGUiLCJub3ciLCJsYXN0Rm9yY2VkVXBkYXRlU3RhdGUiLCJzZXRMYXN0Rm9yY2VkVXBkYXRlU3RhdGUiLCJ1c2VFZmZlY3QiLCJ1cGRhdGVkRGVmaW5pdGlvbnMiLCJ1cGRhdGVkQ29sdW1ucyIsInVwZGF0ZWRSb3dzIiwic2VhcmNoVmFsdWUiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiZmlsdGVyUm93cyIsInRvZ2dsZURyYXdlciIsImFkZFRvQ2hhbmdlcyIsImlkIiwicHJldmlvdXNWYWx1ZSIsInJvdyIsImNvbHVtbiIsInByZXZpb3VzU3RhdGUiLCJvblVuZG8iLCJsZW5ndGgiLCJjbG9uZWRDaGFuZ2VzIiwibGFzdENoYW5nZSIsInBvcCIsIm9uUmVkbyIsImNsb25lZFJlZG9MaXN0IiwibGFzdFJlZG8iLCJzZWxlY3RlZCIsInJvd3NUb0ZpbHRlciIsInNlYXJjaFJFIiwiUmVnRXhwIiwiZmlsdGVyIiwiZm91bmQiLCJjb2wiLCJ0ZXN0Iiwic2VsIiwiY29sdW1uSW5kZXgiLCJfdGl0bGUiLCJwcmV2UHJvcHMiLCJuZXh0UHJvcHMiLCJ3aHlEaWRZb3VSZW5kZXIiLCJjdXN0b21OYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLGVBQWUsR0FBR0MsS0FBSyxDQUFDQyxJQUFOLENBS3JCLGdCQUE2RDtBQUFBLE1BQTFEQyxJQUEwRCxRQUExREEsSUFBMEQ7QUFBQSxNQUFwREMsS0FBb0QsUUFBcERBLEtBQW9EO0FBQUEsZ0NBQTdDQyxhQUE2QztBQUFBLE1BQTdDQSxhQUE2QyxtQ0FBN0IsSUFBNkI7QUFBQSwyQkFBdkJDLFFBQXVCO0FBQUEsTUFBdkJBLFFBQXVCLDhCQUFaLEtBQVk7QUFDOURDLEVBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLHdCQUFaOztBQUVBLE1BQU1DLFlBQVksR0FBRyxTQUFmQSxZQUFlLENBQUNDLElBQUQsRUFBZTtBQUNsQztBQUNBLFFBQU1DLE9BQU8sR0FBRyxL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LElBQUEsT0FBTyxFQUFFRSxPQURYO0FBRUUsSUFBQSxZQUFZLEVBQUVOLFlBRmhCO0FBR0UsSUFBQSxXQUFXLEVBQUVFLFdBSGY7QUFJRSxJQUFBLFdBQVcsRUFBRU0sV0FKZjtBQUtFLElBQUEsTUFBTSxFQUFFMkIsWUFMVjtBQU1FLElBQUEsTUFBTSxFQUFFTSxNQU5WO0FBT0UsSUFBQSxNQUFNLEVBQUVLLE1BUFY7QUFRRSxJQUFBLGdCQUFnQixFQUFFdEIscUJBUnBCO0FBU0UsSUFBQSxRQUFRLEVBQUVyRDtBQVRaLElBREYsQ0FERixDQXpDRixDQURGLENBREY7QUE2REQsQ0FuUXVCLEVBbVFyQixVQUFDeUYsU0FBRCxFQUFZQyxTQUFaLEVBQTBCO0FBQzNCLE1BQUlqRixJQUFJLENBQUNFLFNBQUwsQ0FBZThFLFNBQVMsQ0FBQzVGLElBQXpCLE1BQW1DWSxJQUFJLENBQUNFLFNBQUwsQ0FBZStFLFNBQVMsQ0FBQzdGLElBQXpCLENBQXZDLEVBQXVFO0FBQ3JFO0FBQ0EsV0FBTyxLQUFQO0FBQ0Q7O0FBQ0QsTUFBSVksSUFBSSxDQUFDRSxTQUFMLENBQWU4RSxTQUFTLENBQUMzRixLQUF6QixNQUFvQ1csSUFBSSxDQUFDRSxTQUFMLENBQWUrRSxTQUFTLENBQUM1RixLQUF6QixDQUF4QyxFQUF5RTtBQUN2RTtBQUNBLFdBQU8sS0FBUDtBQUNEOztBQUNELFNBQU8sSUFBUDtBQUNELENBN1F1QixDQUF4QixDLENBK1FBOzs7QUFDQUosZUFBZSxDQUFDaUcsZUFBaEIsR0FBa0M7QUFDaENDLEVBQUFBLFVBQVUsRUFBRTtBQURvQixDQUFsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnQHBhdHRlcm5mbHkvcmVhY3QtY29yZSc7XG5pbXBvcnQgeyBCYXJzSWNvbiB9IGZyb20gJ0BwYXR0ZXJuZmx5L3JlYWN0LWljb25zJztcbmltcG9ydCB7IEVkaXRvciB9IGZyb20gJy4uL0VkaXRvcic7XG5pbXBvcnQgeyBEZWZpbml0aW9uc0RyYXdlclBhbmVsIH0gZnJvbSAnLi4vU2lkZWJhcic7XG5pbXBvcnQgeyBnZXREZWZpbml0aW9ucywgZ2V0Q29sdW1ucywgZ2V0Um93cywgZ2V0Q29sdW1uTmFtZXMsIGdldERtbkZpbGVQYXRoIH0gZnJvbSBcIi4vc2Nlc2ltVXRpbHNcIjtcbmltcG9ydCB7IGdldFJvd0NvbHVtbkZyb21JZCB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB7IEVkaXRvclRvb2xiYXIgfSBmcm9tICcuLi9Ub29sYmFyJztcbmltcG9ydCBjbGFzc05hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuXG5jb25zdCBFZGl0b3JDb250YWluZXIgPSBSZWFjdC5tZW1vPHsgXG4gIGRhdGE6IGFueSwgXG4gIG1vZGVsOiBhbnksIFxuICBzaG93U2lkZVBhbmVsPzogYm9vbGVhbiwgXG4gIHJlYWRPbmx5PzogYm9vbGVhbiBcbn0+KCh7IGRhdGEsIG1vZGVsLCBzaG93U2lkZVBhbmVsID0gdHJ1ZSwgcmVhZE9ubHkgPSBmYWxzZSB9KSA9PiB7XG4gIGNvbnNvbGUubG9nKCdyZW5kZXIgRWRpdG9yQ29udGFpbmVyJyk7XG5cbiAgY29uc3QgaW5jcmVhc2VSb3dzID0gKHJvd3M6IGFueSkgPT4ge1xuICAgIC8vIGluY3JlYXNlIHJvd3MgZm9yIHBlcmZvcm1hbmNlIHRlc3RpbmcgLyBpbmZpbml0ZSBzcm9sbCB0ZXN0aW5nIGV0Y1xuICAgIGNvbnN0IGVuYWJsZWQgPSBmYWxzZTtcbiAgICBjb25zdCBudW1Sb3dzVG9BZGQgPSAyMDAwO1xuICAgIGlmIChlbmFibGVkKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVJvd3NUb0FkZDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGNsb25lZFJvdyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkocm93c1swXSkpO1xuICAgICAgICAvLyB1cGRhdGUgdGhlIEluZGV4XG4gICAgICAgIGNsb25lZFJvd1swXS52YWx1ZSA9IChpICsgNikudG9TdHJpbmcoKTtcbiAgICAgICAgcm93cy5wdXNoKGNsb25lZFJvdyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByb3dzO1xuICB9XG5cbiAgY29uc3QgaW5pdGlhbERlZmluaXRpb25zID0gZ2V0RGVmaW5pdGlvbnMobW9kZWwpO1xuICBjb25zdCBpbml0aWFsQ29sdW1ucyA9IGdldENvbHVtbnMoZGF0YSwgdHJ1ZSk7XG4gIGxldCBpbml0aWFsUm93cyA9IGdldFJvd3MoZGF0YSwgaW5pdGlhbENvbHVtbnMpO1xuICBpbml0aWFsUm93cyA9IGluY3JlYXNlUm93cyhpbml0aWFsUm93cyk7XG4gIGNvbnN0IGluaXRpYWxDb2x1bW5OYW1lcyA9IGdldENvbHVtbk5hbWVzKGRhdGEpO1xuICBjb25zdCBbaXNEcmF3ZXJFeHBhbmRlZCwgc2V0RHJhd2VyRXhwYW5kZWRdID0gUmVhY3QudXNlU3RhdGUodHJ1ZSk7XG4gIGNvbnN0IFt1bmRvUmVkbywgc2V0VW5kb1JlZG9dID0gUmVhY3QudXNlU3RhdGU8YW55Pih7IFxuICAgIHVuZG9MaXN0OiBbXSwgXG4gICAgcmVkb0xpc3Q6IFtdLFxuICAgIHNraXBVcGRhdGU6IGZhbHNlXG4gIH0pO1xuICBjb25zdCBbYWxsUm93cywgc2V0QWxsUm93c10gPSBSZWFjdC51c2VTdGF0ZShpbml0aWFsUm93cyk7XG4gIGNvbnN0IFtmaWx0ZXJlZFJvd3MsIHNldEZpbHRlcmVkUm93c10gPSBSZWFjdC51c2VTdGF0ZShpbml0aWFsUm93cyk7XG4gIGNvbnN0IFtkZWZpbml0aW9ucywgc2V0RGVmaW5pdGlvbnNdID0gUmVhY3QudXNlU3RhdGUoaW5pdGlhbERlZmluaXRpb25zKTtcbiAgY29uc3QgW2RtbkZpbGVQYXRoLCBzZXREbW5GaWxlUGF0aF0gPSBSZWFjdC51c2VTdGF0ZShnZXREbW5GaWxlUGF0aChkYXRhKSk7XG4gIGNvbnN0IFtjb2x1bW5zLCBzZXRDb2x1bW5zXSA9IFJlYWN0LnVzZVN0YXRlKGluaXRpYWxDb2x1bW5zKTtcbiAgY29uc3QgW2NvbHVtbk5hbWVzLCBzZXRDb2x1bW5OYW1lc10gPSBSZWFjdC51c2VTdGF0ZShpbml0aWFsQ29sdW1uTmFtZXMpO1xuICBsZXQgaW5pdGlhbEl0ZW1Ub0NvbHVtbkluZGV4TWFwOiBhbnkgPSBbXTtcbiAgaW5pdGlhbENvbHVtbk5hbWVzLmZvckVhY2goKGl0ZW06IGFueSwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgIGNvbnN0IHZhbHVlID0gYCR7aXRlbS5ncm91cH0gJHtpdGVtLm5hbWV9YDtcbiAgICBpbml0aWFsSXRlbVRvQ29sdW1uSW5kZXhNYXBbdmFsdWVdID0gaW5kZXg7XG4gIH0pO1xuICBjb25zdCBbaXRlbVRvQ29sdW1uSW5kZXhNYXAsIHNldEl0ZW1Ub0NvbHVtbkluZGV4TWFwXSA9IFJlYWN0LnVzZVN0YXRlKGluaXRpYWxJdGVtVG9Db2x1bW5JbmRleE1hcCk7XG4gIGNvbnN0IFtzZWFyY2hWYWx1ZVN0YXRlLCBzZXRTZWFyY2hWYWx1ZVN0YXRlXSA9IFJlYWN0LnVzZVN0YXRlKCcnKTtcbiAgY29uc3QgW2ZpbHRlclNlbGVjdGlvbiwgc2V0RmlsdGVyU2VsZWN0aW9uXSA9IFJlYWN0LnVzZVN0YXRlPGFueVtdPihbXSk7XG4gIGNvbnN0IFtsYXN0Rm9yY2VkVXBkYXRlU3RhdGUsIHNldExhc3RGb3JjZWRVcGRhdGVTdGF0ZV0gPSBSZWFjdC51c2VTdGF0ZSgoRGF0ZS5ub3coKSkudG9TdHJpbmcoKSk7XG5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAvLyB3aGVuIGRhdGEgb3IgbW9kZWwgY2hhbmdlcywgcmVjb21wdXRlIHJvd3MgYW5kIGNvbHVtbnNcbiAgICBjb25zdCB1cGRhdGVkRGVmaW5pdGlvbnMgPSBnZXREZWZpbml0aW9ucyhtb2RlbCk7XG4gICAgY29uc3QgdXBkYXRlZENvbHVtbnMgPSBnZXRDb2x1bW5zKGRhdGEsIHRydWUpO1xuICAgIGxldCB1cGRhdGVkUm93cyA9IGdldFJvd3MoZGF0YSwgdXBkYXRlZENvbHVtbnMpO1xuICAgIHVwZGF0ZWRSb3dzID0gaW5jcmVhc2VSb3dzKHVwZGF0ZWRSb3dzKTtcbiAgICBpZiAoSlNPTi5zdHJpbmdpZnkoZGVmaW5pdGlvbnMpICE9PSBKU09OLnN0cmluZ2lmeSh1cGRhdGVkRGVmaW5pdGlvbnMpKSB7XG4gICAgICBzZXREZWZpbml0aW9ucyh1cGRhdGVkRGVmaW5pdGlvbnMpO1xuICAgIH1cbiAgICBpZiAoSlNPTi5zdHJpbmdpZnkoYWxsUm93cykgIT09IEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRSb3dzKSkge1xuICAgICAgc2V0RG1uRmlsZVBhdGgoZ2V0RG1uRmlsZVBhdGgoZGF0YSkpO1xuICAgICAgc2V0Q29sdW1ucyh1cGRhdGVkQ29sdW1ucyk7XG4gICAgICBzZXRDb2x1bW5OYW1lcyhnZXRDb2x1bW5OYW1lcyhkYXRhKSk7XG4gICAgICBzZXRBbGxSb3dzKHVwZGF0ZWRSb3dzKTtcbiAgICAgIHNldEZpbHRlcmVkUm93cyh1cGRhdGVkUm93cyk7XG4gICAgICBzZXRVbmRvUmVkbyh7XG4gICAgICAgIHVuZG9MaXN0OiBbXSxcbiAgICAgICAgcmVkb0xpc3Q6IFtdLFxuICAgICAgICBza2lwVXBkYXRlOiBmYWxzZVxuICAgICAgfSk7XG4gICAgICBsZXQgaXRlbVRvQ29sdW1uSW5kZXhNYXA6IGFueSA9IFtdO1xuICAgICAgaW5pdGlhbENvbHVtbk5hbWVzLmZvckVhY2goKGl0ZW06IGFueSwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGAke2l0ZW0uZ3JvdXB9ICR7aXRlbS5uYW1lfWA7XG4gICAgICAgIGl0ZW1Ub0NvbHVtbkluZGV4TWFwW3ZhbHVlXSA9IGluZGV4O1xuICAgICAgfSk7XG4gICAgICBzZXRJdGVtVG9Db2x1bW5JbmRleE1hcChpbml0aWFsQ29sdW1uTmFtZXMpO1xuICAgIH1cbiAgfSwgW2RhdGEsIG1vZGVsXSk7XG5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBzZWFyY2hWYWx1ZSA9IChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JpZFNlYXJjaCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xuICAgIGZpbHRlclJvd3Moc2VhcmNoVmFsdWUsIGZpbHRlclNlbGVjdGlvbiwgYWxsUm93cyk7XG4gICAgaWYgKHVuZG9SZWRvLnNraXBVcGRhdGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc2V0TGFzdEZvcmNlZFVwZGF0ZVN0YXRlKChEYXRlLm5vdygpKS50b1N0cmluZygpKTtcbiAgfSwgWyB1bmRvUmVkbyBdKTtcblxuICAvKipcbiAgICogVG9nZ2xlIHRoZSBzaWRlYmFyXG4gICAqL1xuICBjb25zdCB0b2dnbGVEcmF3ZXIgPSAoKSA9PiB7XG4gICAgc2V0RHJhd2VyRXhwYW5kZWQoIWlzRHJhd2VyRXhwYW5kZWQpO1xuICB9XG5cbiAgLyoqIFxuICAgKiBDYWxsYmFjayBmdW5jdGlvbiBmb3IgRWRpdG9yIGlucHV0cy4gV2hlbiB0aGV5J3JlIHNhdmVkIHdlIGFkZCBpdCB0byB0aGUgbGlzdCBvZiBjaGFuZ2VzIGZvciBjaGFuZ2UtdHJhY2tpbmcuXG4gICAqL1xuICBjb25zdCBhZGRUb0NoYW5nZXMgPSAoaWQ6IHN0cmluZywgdmFsdWU6IHN0cmluZywgcHJldmlvdXNWYWx1ZTogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgeyByb3csIGNvbHVtbiB9ID0gZ2V0Um93Q29sdW1uRnJvbUlkKGlkKTtcbiAgICAvLyBjb25zdCBjbG9uZWRBbGxSb3dzID0gY2xvbmVEZWVwKGFsbFJvd3MpO1xuICAgIGFsbFJvd3Nbcm93XVtjb2x1bW5dLnZhbHVlID0gdmFsdWU7XG4gICAgLy8gc2V0QWxsUm93cyhhbGxSb3dzKTtcbiAgICAvLyBuZXcgY2hhbmdlIGNsZWFycyB0aGUgcmVkb0xpc3RcbiAgICBzZXRVbmRvUmVkbygocHJldmlvdXNTdGF0ZTogYW55KSA9PiAoe1xuICAgICAgdW5kb0xpc3Q6IFsuLi5wcmV2aW91c1N0YXRlLnVuZG9MaXN0LCB7IGlkLCB2YWx1ZSwgcHJldmlvdXNWYWx1ZSB9XSxcbiAgICAgIHJlZG9MaXN0OiBbXSxcbiAgICAgIHNraXBVcGRhdGU6IHRydWVcbiAgICB9KSk7XG4gIH1cblxuICAvKipcbiAgICogUmV2ZXJ0cyB0aGUgbGFzdCBJbnB1dCBjaGFuZ2VcbiAgICogUG9wIHRoZSB1bmRvIHN0YWNrIGFuZCBwdXNoIGl0IG9udG8gcmVkbyBzdGFja1xuICAgKi9cbiAgY29uc3Qgb25VbmRvID0gKCkgPT4ge1xuICAgIGlmICh1bmRvUmVkby51bmRvTGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBjbG9uZWRDaGFuZ2VzID0gWy4uLnVuZG9SZWRvLnVuZG9MaXN0XTtcbiAgICAgIGNvbnN0IGxhc3RDaGFuZ2UgPSBjbG9uZWRDaGFuZ2VzLnBvcCgpO1xuICAgICAgc2V0VW5kb1JlZG8oKHByZXZpb3VzU3RhdGU6IGFueSkgPT4gKHtcbiAgICAgICAgdW5kb0xpc3Q6IGNsb25lZENoYW5nZXMsXG4gICAgICAgIHJlZG9MaXN0OiBbLi4ucHJldmlvdXNTdGF0ZS5yZWRvTGlzdCwgbGFzdENoYW5nZV0sXG4gICAgICAgIHNraXBVcGRhdGU6IGZhbHNlXG4gICAgICB9KSk7XG5cbiAgICAgIGNvbnN0IHsgaWQsIHByZXZpb3VzVmFsdWUgfSA9IGxhc3RDaGFuZ2U7XG4gICAgICBjb25zdCB7IHJvdywgY29sdW1uIH0gPSBnZXRSb3dDb2x1bW5Gcm9tSWQoaWQpO1xuICAgICAgYWxsUm93c1tyb3ddW2NvbHVtbl0udmFsdWUgPSBwcmV2aW91c1ZhbHVlO1xuICAgICAgLy8gbGV0IGNsb25lZEFsbFJvd3MgPSBjbG9uZURlZXAoYWxsUm93cyk7XG4gICAgICAvLyBjbG9uZWRBbGxSb3dzW3Jvd11bY29sdW1uXS52YWx1ZSA9IHByZXZpb3VzVmFsdWU7XG4gICAgICAvLyBzZXRBbGxSb3dzKGNsb25lZEFsbFJvd3MpO1xuICAgICAgLy8gZmlsdGVyUm93cyhzZWFyY2hWYWx1ZVN0YXRlLCBmaWx0ZXJTZWxlY3Rpb24sIGNsb25lZEFsbFJvd3MpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQb3AgaXQgZnJvbSB0aGUgcmVkbyBzdGFjayBhbmQgcHVzaCBpdCBvbnRvIHVuZG8gc3RhY2tcbiAgICogYSBuZXcgY2hhbmdlIGNsZWFycyB0aGUgcmVkbyBzdGFja1xuICAgKi9cbiAgY29uc3Qgb25SZWRvID0gKCkgPT4ge1xuICAgIGlmICh1bmRvUmVkby5yZWRvTGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBjbG9uZWRSZWRvTGlzdCA9IFsuLi51bmRvUmVkby5yZWRvTGlzdF07XG4gICAgICBjb25zdCBsYXN0UmVkbyA9IGNsb25lZFJlZG9MaXN0LnBvcCgpO1xuICAgICAgc2V0VW5kb1JlZG8oKHByZXZpb3VzU3RhdGU6IGFueSkgPT4gKHtcbiAgICAgICAgdW5kb0xpc3Q6IFsuLi5wcmV2aW91c1N0YXRlLnVuZG9MaXN0LCBsYXN0UmVkb10sXG4gICAgICAgIHJlZG9MaXN0OiBjbG9uZWRSZWRvTGlzdCxcbiAgICAgICAgc2tpcFVwZGF0ZTogZmFsc2VcbiAgICAgIH0pKTtcbiAgICAgIFxuICAgICAgY29uc3QgeyBpZCwgdmFsdWUgfSA9IGxhc3RSZWRvO1xuICAgICAgY29uc3QgeyByb3csIGNvbHVtbiB9ID0gZ2V0Um93Q29sdW1uRnJvbUlkKGlkKTtcbiAgICAgIGFsbFJvd3Nbcm93XVtjb2x1bW5dLnZhbHVlID0gdmFsdWU7XG4gICAgICAvLyBjb25zdCBjbG9uZWRBbGxSb3dzID0gY2xvbmVEZWVwKGFsbFJvd3MpO1xuICAgICAgLy8gY2xvbmVkQWxsUm93c1tyb3ddW2NvbHVtbl0udmFsdWUgPSB2YWx1ZTtcbiAgICAgIC8vIHNldEFsbFJvd3MoY2xvbmVkQWxsUm93cyk7XG4gICAgICAvLyBmaWx0ZXJSb3dzKHNlYXJjaFZhbHVlU3RhdGUsIGZpbHRlclNlbGVjdGlvbiwgY2xvbmVkQWxsUm93cyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZpbHRlciB0aGUgcm93cyBiYXNlZCBvbiBzZWFyY2ggYW5kIGZpbHRlciBzZWxlY3Rpb25cbiAgICogQ2FsbGJhY2sgZnVuY3Rpb24gZm9yIEVkaXRvclRvb2xiYXIsIGNhbGxlZCBvbiBmaWx0ZXIvc2VhcmNoIGNoYW5nZVxuICAgKi9cbiAgY29uc3QgZmlsdGVyUm93cyA9ICh2YWx1ZTogc3RyaW5nLCBzZWxlY3RlZDogYW55W10sIHJvd3NUb0ZpbHRlcj86IGFueVtdKSA9PiB7XG4gICAgY29uc3Qgcm93cyA9IHJvd3NUb0ZpbHRlciB8fCBhbGxSb3dzO1xuICAgIGlmIChKU09OLnN0cmluZ2lmeShmaWx0ZXJTZWxlY3Rpb24pICE9PSBKU09OLnN0cmluZ2lmeShzZWxlY3RlZCkpIHtcbiAgICAgIHNldEZpbHRlclNlbGVjdGlvbihzZWxlY3RlZCk7XG4gICAgfVxuICAgIGlmICghdmFsdWUpIHtcbiAgICAgIC8vIG5vIHNlYXJjaCB0ZXJtLCBzaG93IGFsbCByb3dzXG4gICAgICByZXR1cm4gc2V0RmlsdGVyZWRSb3dzKHJvd3MpO1xuICAgIH1cbiAgICBjb25zdCBzZWFyY2hSRSA9IG5ldyBSZWdFeHAodmFsdWUsICdpJyk7XG4gICAgY29uc3QgZmlsdGVyZWRSb3dzID0gcm93cy5maWx0ZXIoKHJvdzogYW55KSA9PiB7XG4gICAgICBsZXQgZm91bmQgPSBmYWxzZTtcbiAgICAgIGlmIChzZWxlY3RlZC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgLy8gc2VhcmNoIGFsbCBjb2x1bW5zXG4gICAgICAgIGZvciAobGV0IGNvbCBvZiByb3cpIHtcbiAgICAgICAgICBpZiAoY29sICYmIHNlYXJjaFJFLnRlc3QoY29sLnZhbHVlKSkge1xuICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBzZWFyY2ggb25seSB0aGUgc2VsZWN0ZWQgY29sdW1uc1xuICAgICAgICBmb3IgKGxldCBzZWwgb2Ygc2VsZWN0ZWQpIHtcbiAgICAgICAgICBjb25zdCBjb2x1bW5JbmRleCA9IGl0ZW1Ub0NvbHVtbkluZGV4TWFwW3NlbF07XG4gICAgICAgICAgaWYgKHJvd1tjb2x1bW5JbmRleF0gJiYgc2VhcmNoUkUudGVzdChyb3dbY29sdW1uSW5kZXhdLnZhbHVlKSkge1xuICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZm91bmQ7XG4gICAgfSk7XG4gICAgc2V0RmlsdGVyZWRSb3dzKGZpbHRlcmVkUm93cyk7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwicGYtbS1yZWRoYXQtZm9udFwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJwZi1jLXBhZ2VcIj5cbiAgICAgICAgPGhlYWRlciByb2xlPVwiYmFubmVyXCIgY2xhc3NOYW1lPVwicGYtYy1wYWdlX19oZWFkZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwZi1jLXBhZ2VfX2hlYWRlci1icmFuZFwiPlxuICAgICAgICAgIHtzaG93U2lkZVBhbmVsICYmIDxkaXYgY2xhc3NOYW1lPVwicGYtYy1wYWdlX19oZWFkZXItYnJhbmQtdG9nZ2xlXCI+XG4gICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgIGlkPVwibmF2LXRvZ2dsZVwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RvZ2dsZURyYXdlcn1cbiAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIlRvZ2dsZSBkcmF3ZXJcIlxuICAgICAgICAgICAgICBhcmlhLWNvbnRyb2xzPVwicGFnZS1zaWRlYmFyXCJcbiAgICAgICAgICAgICAgYXJpYS1leHBhbmRlZD17aXNEcmF3ZXJFeHBhbmRlZCA/ICd0cnVlJyA6ICdmYWxzZSd9XG4gICAgICAgICAgICAgIHZhcmlhbnQ9XCJwbGFpblwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxCYXJzSWNvbiAvPlxuICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgPC9kaXY+fVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGYtYy1wYWdlX19oZWFkZXItYnJhbmQtbGlua1wiPlxuICAgICAgICAgICAge2RlZmluaXRpb25zLl90aXRsZX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwZi1jLXBhZ2VfX2hlYWRlci10b29sc1wiPlxuICAgICAgICAgICAgPEVkaXRvclRvb2xiYXIgXG4gICAgICAgICAgICAgIGRhdGE9e2RhdGF9XG4gICAgICAgICAgICAgIGFsbFJvd3NMZW5ndGg9e2FsbFJvd3MubGVuZ3RofSBcbiAgICAgICAgICAgICAgZmlsdGVyZWRSb3dzTGVuZ3RoPXtmaWx0ZXJlZFJvd3MubGVuZ3RofSBcbiAgICAgICAgICAgICAgZmlsdGVyUm93cz17ZmlsdGVyUm93c30gXG4gICAgICAgICAgICAgIGNvbHVtbk5hbWVzPXtjb2x1bW5OYW1lc30gXG4gICAgICAgICAgICAgIHJlYWRPbmx5PXtyZWFkT25seX1cbiAgICAgICAgICAgICAgdW5kb1JlZG89e3VuZG9SZWRvfVxuICAgICAgICAgICAgICBvblVuZG89e29uVW5kb31cbiAgICAgICAgICAgICAgb25SZWRvPXtvblJlZG99XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2hlYWRlcj5cbiAgICAgICAge3Nob3dTaWRlUGFuZWwgJiYgPGRpdiBjbGFzc05hbWU9e2NsYXNzTmFtZXMoXCJwZi1jLXBhZ2VfX3NpZGViYXIgcGYtbS1kYXJrXCIsIGlzRHJhd2VyRXhwYW5kZWQgJiYgJ3BmLW0tZXhwYW5kZWQnLCAhaXNEcmF3ZXJFeHBhbmRlZCAmJiAncGYtbS1jb2xsYXBzZWQnKX0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwZi1jLXBhZ2VfX3NpZGViYXItYm9keVwiPlxuICAgICAgICAgICAgPERlZmluaXRpb25zRHJhd2VyUGFuZWwgXG4gICAgICAgICAgICAgIGRlZmluaXRpb25zPXtkZWZpbml0aW9uc30gXG4gICAgICAgICAgICAgIGRtbkZpbGVQYXRoPXtkbW5GaWxlUGF0aH0gXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj59XG4gICAgICAgIDxtYWluIHJvbGU9XCJtYWluXCIgY2xhc3NOYW1lPVwicGYtYy1wYWdlX19tYWluXCIgaWQ9XCJzY2Utc2ltLWdyaWRfX21haW5cIiB0YWJJbmRleD17LTF9PlxuICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInBmLWMtcGFnZV9fbWFpbi1zZWN0aW9uIHBmLW0tbGlnaHRcIj5cbiAgICAgICAgICAgIDxFZGl0b3IgXG4gICAgICAgICAgICAgIGNvbHVtbnM9e2NvbHVtbnN9IFxuICAgICAgICAgICAgICBmaWx0ZXJlZFJvd3M9e2ZpbHRlcmVkUm93c30gXG4gICAgICAgICAgICAgIGRlZmluaXRpb25zPXtkZWZpbml0aW9uc30gXG4gICAgICAgICAgICAgIGNvbHVtbk5hbWVzPXtjb2x1bW5OYW1lc30gXG4gICAgICAgICAgICAgIG9uU2F2ZT17YWRkVG9DaGFuZ2VzfVxuICAgICAgICAgICAgICBvblVuZG89e29uVW5kb31cbiAgICAgICAgICAgICAgb25SZWRvPXtvblJlZG99XG4gICAgICAgICAgICAgIGxhc3RGb3JjZWRVcGRhdGU9e2xhc3RGb3JjZWRVcGRhdGVTdGF0ZX1cbiAgICAgICAgICAgICAgcmVhZE9ubHk9e3JlYWRPbmx5fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgIDwvbWFpbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApXG59LCAocHJldlByb3BzLCBuZXh0UHJvcHMpID0+IHtcbiAgaWYgKEpTT04uc3RyaW5naWZ5KHByZXZQcm9wcy5kYXRhKSAhPT0gSlNPTi5zdHJpbmdpZnkobmV4dFByb3BzLmRhdGEpKSB7XG4gICAgLy8gZGF0YSBoYXMgY2hhbmdlZCwgcmUtcmVuZGVyXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChKU09OLnN0cmluZ2lmeShwcmV2UHJvcHMubW9kZWwpICE9PSBKU09OLnN0cmluZ2lmeShuZXh0UHJvcHMubW9kZWwpKSB7XG4gICAgLy8gbW9kZWwgaGFzIGNoYW5nZWQsIHJlLXJlbmRlclxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn0pO1xuXG4vLyBAdHMtaWdub3JlXG5FZGl0b3JDb250YWluZXIud2h5RGlkWW91UmVuZGVyID0ge1xuICBjdXN0b21OYW1lOiAnRWRpdG9yQ29udGFpbmVyJ1xufTtcblxuZXhwb3J0IHsgRWRpdG9yQ29udGFpbmVyIH07XG4iXX0=
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0VkaXRvckNvbnRhaW5lci9FZGl0b3JDb250YWluZXIudHN4Il0sIm5hbWVzIjpbIkVkaXRvckNvbnRhaW5lciIsIlJlYWN0IiwibWVtbyIsImRhdGEiLCJtb2RlbCIsInNob3dTaWRlUGFuZWwiLCJyZWFkT25seSIsImNvbnNvbGUiLCJsb2ciLCJpbmNyZWFzZVJvd3MiLCJyb3dzIiwiZW5hYmxlZCIsIm51bVJvd3NUb0FkZCIsImkiLCJjbG9uZWRSb3ciLCJKU09OIiwicGFyc2UiLCJzdHJpbmdpZnkiLCJ2YWx1ZSIsInRvU3RyaW5nIiwicHVzaCIsImluaXRpYWxEZWZpbml0aW9ucyIsImluaXRpYWxDb2x1bW5zIiwiaW5pdGlhbFJvd3MiLCJpbml0aWFsQ29sdW1uTmFtZXMiLCJ1c2VTdGF0ZSIsImlzRHJhd2VyRXhwYW5kZWQiLCJzZXREcmF3ZXJFeHBhbmRlZCIsInVuZG9MaXN0IiwicmVkb0xpc3QiLCJza2lwVXBkYXRlIiwidW5kb1JlZG8iLCJzZXRVbmRvUmVkbyIsImFsbFJvd3MiLCJzZXRBbGxSb3dzIiwiZmlsdGVyZWRSb3dzIiwic2V0RmlsdGVyZWRSb3dzIiwiZGVmaW5pdGlvbnMiLCJzZXREZWZpbml0aW9ucyIsImRtbkZpbGVQYXRoIiwic2V0RG1uRmlsZVBhdGgiLCJjb2x1bW5zIiwic2V0Q29sdW1ucyIsImNvbHVtbk5hbWVzIiwic2V0Q29sdW1uTmFtZXMiLCJpbml0aWFsSXRlbVRvQ29sdW1uSW5kZXhNYXAiLCJmb3JFYWNoIiwiaXRlbSIsImluZGV4IiwiZ3JvdXAiLCJuYW1lIiwiaXRlbVRvQ29sdW1uSW5kZXhNYXAiLCJzZXRJdGVtVG9Db2x1bW5JbmRleE1hcCIsInNlYXJjaFZhbHVlU3RhdGUiLCJzZXRTZWFyY2hWYWx1ZVN0YXRlIiwiZmlsdGVyU2VsZWN0aW9uIiwic2V0RmlsdGVyU2VsZWN0aW9uIiwiRGF0ZSIsIm5vdyIsImxhc3RGb3JjZWRVcGRhdGVTdGF0ZSIsInNldExhc3RGb3JjZWRVcGRhdGVTdGF0ZSIsInVzZUVmZmVjdCIsInVwZGF0ZWREZWZpbml0aW9ucyIsInVwZGF0ZWRDb2x1bW5zIiwidXBkYXRlZFJvd3MiLCJzZWFyY2hWYWx1ZSIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJmaWx0ZXJSb3dzIiwidG9nZ2xlRHJhd2VyIiwiYWRkVG9DaGFuZ2VzIiwiaWQiLCJwcmV2aW91c1ZhbHVlIiwicm93IiwiY29sdW1uIiwicHJldmlvdXNTdGF0ZSIsIm9uVW5kbyIsImxlbmd0aCIsImNsb25lZENoYW5nZXMiLCJsYXN0Q2hhbmdlIiwicG9wIiwib25SZWRvIiwiY2xvbmVkUmVkb0xpc3QiLCJsYXN0UmVkbyIsInNlbGVjdGVkIiwicm93c1RvRmlsdGVyIiwic2VhcmNoUkUiLCJSZWdFeHAiLCJmaWx0ZXIiLCJmb3VuZCIsImNvbCIsInRlc3QiLCJzZWwiLCJjb2x1bW5JbmRleCIsIl90aXRsZSIsInByZXZQcm9wcyIsIm5leHRQcm9wcyIsIndoeURpZFlvdVJlbmRlciIsImN1c3RvbU5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsZUFBZSxHQUFHQyxLQUFLLENBQUNDLElBQU4sQ0FLckIsZ0JBQTZEO0FBQUEsTUFBMURDLElBQTBELFFBQTFEQSxJQUEwRDtBQUFBLE1BQXBEQyxLQUFvRCxRQUFwREEsS0FBb0Q7QUFBQSxnQ0FBN0NDLGFBQTZDO0FBQUEsTUFBN0NBLGFBQTZDLG1DQUE3QixJQUE2QjtBQUFBLDJCQUF2QkMsUUFBdUI7QUFBQSxNQUF2QkEsUUFBdUIsOEJBQVosS0FBWTtBQUM5REMsRUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksd0JBQVo7O0FBRUEsTUFBTUMsWUFBWSxHQUFHLFNBQWZBLFlBQWUsQ0FBQ0MsSUFBRCxFQUFlO0FBQ2xDO0FBQ0EsUUFBTUMsT0FBTyxHQUFHLEtBQWhC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QSxPQUFPLEVBQUVFLE9BRFg7QUFFRSxJQUFBLFlBQVksRUFBRU4sWUFGaEI7QUFHRSxJQUFBLFdBQVcsRUFBRUUsV0FIZjtBQUlFLElBQUEsV0FBVyxFQUFFTSxXQUpmO0FBS0UsSUFBQSxNQUFNLEVBQUUyQixZQUxWO0FBTUUsSUFBQSxNQUFNLEVBQUVNLE1BTlY7QUFPRSxJQUFBLE1BQU0sRUFBRUssTUFQVjtBQVFFLElBQUEsZ0JBQWdCLEVBQUV0QixxQkFScEI7QUFTRSxJQUFBLFFBQVEsRUFBRXJEO0FBVFosSUFERixDQURGLENBekNGLENBREYsQ0FERjtBQTZERCxDQW5RdUIsRUFtUXJCLFVBQUN5RixTQUFELEVBQVlDLFNBQVosRUFBMEI7QUFDM0IsTUFBSWpGLElBQUksQ0FBQ0UsU0FBTCxDQUFlOEUsU0FBUyxDQUFDNUYsSUFBekIsTUFBbUNZLElBQUksQ0FBQ0UsU0FBTCxDQUFlK0UsU0FBUyxDQUFDN0YsSUFBekIsQ0FBdkMsRUFBdUU7QUFDckU7QUFDQSxXQUFPLEtBQVA7QUFDRDs7QUFDRCxNQUFJWSxJQUFJLENBQUNFLFNBQUwsQ0FBZThFLFNBQVMsQ0FBQzNGLEtBQXpCLE1BQW9DVyxJQUFJLENBQUNFLFNBQUwsQ0FBZStFLFNBQVMsQ0FBQzVGLEtBQXpCLENBQXhDLEVBQXlFO0FBQ3ZFO0FBQ0EsV0FBTyxLQUFQO0FBQ0Q7O0FBQ0QsU0FBTyxJQUFQO0FBQ0QsQ0E3UXVCLENBQXhCLEMsQ0ErUUE7OztBQUNBSixlQUFlLENBQUNpRyxlQUFoQixHQUFrQztBQUNoQ0MsRUFBQUEsVUFBVSxFQUFFO0FBRG9CLENBQWxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICdAcGF0dGVybmZseS9yZWFjdC1jb3JlJztcbmltcG9ydCB7IEJhcnNJY29uIH0gZnJvbSAnQHBhdHRlcm5mbHkvcmVhY3QtaWNvbnMnO1xuaW1wb3J0IHsgRWRpdG9yIH0gZnJvbSAnLi4vRWRpdG9yJztcbmltcG9ydCB7IERlZmluaXRpb25zRHJhd2VyUGFuZWwgfSBmcm9tICcuLi9TaWRlYmFyJztcbmltcG9ydCB7IGdldERlZmluaXRpb25zLCBnZXRDb2x1bW5zLCBnZXRSb3dzLCBnZXRDb2x1bW5OYW1lcywgZ2V0RG1uRmlsZVBhdGggfSBmcm9tIFwiLi9zY2VzaW1VdGlsc1wiO1xuaW1wb3J0IHsgZ2V0Um93Q29sdW1uRnJvbUlkIH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHsgRWRpdG9yVG9vbGJhciB9IGZyb20gJy4uL1Rvb2xiYXInO1xuaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5cbmNvbnN0IEVkaXRvckNvbnRhaW5lciA9IFJlYWN0Lm1lbW88eyBcbiAgZGF0YTogYW55LCBcbiAgbW9kZWw6IGFueSwgXG4gIHNob3dTaWRlUGFuZWw/OiBib29sZWFuLCBcbiAgcmVhZE9ubHk/OiBib29sZWFuIFxufT4oKHsgZGF0YSwgbW9kZWwsIHNob3dTaWRlUGFuZWwgPSB0cnVlLCByZWFkT25seSA9IGZhbHNlIH0pID0+IHtcbiAgY29uc29sZS5sb2coJ3JlbmRlciBFZGl0b3JDb250YWluZXInKTtcblxuICBjb25zdCBpbmNyZWFzZVJvd3MgPSAocm93czogYW55KSA9PiB7XG4gICAgLy8gaW5jcmVhc2Ugcm93cyBmb3IgcGVyZm9ybWFuY2UgdGVzdGluZyAvIGluZmluaXRlIHNyb2xsIHRlc3RpbmcgZXRjXG4gICAgY29uc3QgZW5hYmxlZCA9IGZhbHNlO1xuICAgIGNvbnN0IG51bVJvd3NUb0FkZCA9IDIwMDA7XG4gICAgaWYgKGVuYWJsZWQpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtUm93c1RvQWRkOyBpKyspIHtcbiAgICAgICAgY29uc3QgY2xvbmVkUm93ID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShyb3dzWzBdKSk7XG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgSW5kZXhcbiAgICAgICAgY2xvbmVkUm93WzBdLnZhbHVlID0gKGkgKyA2KS50b1N0cmluZygpO1xuICAgICAgICByb3dzLnB1c2goY2xvbmVkUm93KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJvd3M7XG4gIH1cblxuICBjb25zdCBpbml0aWFsRGVmaW5pdGlvbnMgPSBnZXREZWZpbml0aW9ucyhtb2RlbCk7XG4gIGNvbnN0IGluaXRpYWxDb2x1bW5zID0gZ2V0Q29sdW1ucyhkYXRhLCB0cnVlKTtcbiAgbGV0IGluaXRpYWxSb3dzID0gZ2V0Um93cyhkYXRhLCBpbml0aWFsQ29sdW1ucyk7XG4gIGluaXRpYWxSb3dzID0gaW5jcmVhc2VSb3dzKGluaXRpYWxSb3dzKTtcbiAgY29uc3QgaW5pdGlhbENvbHVtbk5hbWVzID0gZ2V0Q29sdW1uTmFtZXMoZGF0YSk7XG4gIGNvbnN0IFtpc0RyYXdlckV4cGFuZGVkLCBzZXREcmF3ZXJFeHBhbmRlZF0gPSBSZWFjdC51c2VTdGF0ZSh0cnVlKTtcbiAgY29uc3QgW3VuZG9SZWRvLCBzZXRVbmRvUmVkb10gPSBSZWFjdC51c2VTdGF0ZTxhbnk+KHsgXG4gICAgdW5kb0xpc3Q6IFtdLCBcbiAgICByZWRvTGlzdDogW10sXG4gICAgc2tpcFVwZGF0ZTogZmFsc2VcbiAgfSk7XG4gIGNvbnN0IFthbGxSb3dzLCBzZXRBbGxSb3dzXSA9IFJlYWN0LnVzZVN0YXRlKGluaXRpYWxSb3dzKTtcbiAgY29uc3QgW2ZpbHRlcmVkUm93cywgc2V0RmlsdGVyZWRSb3dzXSA9IFJlYWN0LnVzZVN0YXRlKGluaXRpYWxSb3dzKTtcbiAgY29uc3QgW2RlZmluaXRpb25zLCBzZXREZWZpbml0aW9uc10gPSBSZWFjdC51c2VTdGF0ZShpbml0aWFsRGVmaW5pdGlvbnMpO1xuICBjb25zdCBbZG1uRmlsZVBhdGgsIHNldERtbkZpbGVQYXRoXSA9IFJlYWN0LnVzZVN0YXRlKGdldERtbkZpbGVQYXRoKGRhdGEpKTtcbiAgY29uc3QgW2NvbHVtbnMsIHNldENvbHVtbnNdID0gUmVhY3QudXNlU3RhdGUoaW5pdGlhbENvbHVtbnMpO1xuICBjb25zdCBbY29sdW1uTmFtZXMsIHNldENvbHVtbk5hbWVzXSA9IFJlYWN0LnVzZVN0YXRlKGluaXRpYWxDb2x1bW5OYW1lcyk7XG4gIGxldCBpbml0aWFsSXRlbVRvQ29sdW1uSW5kZXhNYXA6IGFueSA9IFtdO1xuICBpbml0aWFsQ29sdW1uTmFtZXMuZm9yRWFjaCgoaXRlbTogYW55LCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgY29uc3QgdmFsdWUgPSBgJHtpdGVtLmdyb3VwfSAke2l0ZW0ubmFtZX1gO1xuICAgIGluaXRpYWxJdGVtVG9Db2x1bW5JbmRleE1hcFt2YWx1ZV0gPSBpbmRleDtcbiAgfSk7XG4gIGNvbnN0IFtpdGVtVG9Db2x1bW5JbmRleE1hcCwgc2V0SXRlbVRvQ29sdW1uSW5kZXhNYXBdID0gUmVhY3QudXNlU3RhdGUoaW5pdGlhbEl0ZW1Ub0NvbHVtbkluZGV4TWFwKTtcbiAgY29uc3QgW3NlYXJjaFZhbHVlU3RhdGUsIHNldFNlYXJjaFZhbHVlU3RhdGVdID0gUmVhY3QudXNlU3RhdGUoJycpO1xuICBjb25zdCBbZmlsdGVyU2VsZWN0aW9uLCBzZXRGaWx0ZXJTZWxlY3Rpb25dID0gUmVhY3QudXNlU3RhdGU8YW55W10+KFtdKTtcbiAgY29uc3QgW2xhc3RGb3JjZWRVcGRhdGVTdGF0ZSwgc2V0TGFzdEZvcmNlZFVwZGF0ZVN0YXRlXSA9IFJlYWN0LnVzZVN0YXRlKChEYXRlLm5vdygpKS50b1N0cmluZygpKTtcblxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIC8vIHdoZW4gZGF0YSBvciBtb2RlbCBjaGFuZ2VzLCByZWNvbXB1dGUgcm93cyBhbmQgY29sdW1uc1xuICAgIGNvbnN0IHVwZGF0ZWREZWZpbml0aW9ucyA9IGdldERlZmluaXRpb25zKG1vZGVsKTtcbiAgICBjb25zdCB1cGRhdGVkQ29sdW1ucyA9IGdldENvbHVtbnMoZGF0YSwgdHJ1ZSk7XG4gICAgbGV0IHVwZGF0ZWRSb3dzID0gZ2V0Um93cyhkYXRhLCB1cGRhdGVkQ29sdW1ucyk7XG4gICAgdXBkYXRlZFJvd3MgPSBpbmNyZWFzZVJvd3ModXBkYXRlZFJvd3MpO1xuICAgIGlmIChKU09OLnN0cmluZ2lmeShkZWZpbml0aW9ucykgIT09IEpTT04uc3RyaW5naWZ5KHVwZGF0ZWREZWZpbml0aW9ucykpIHtcbiAgICAgIHNldERlZmluaXRpb25zKHVwZGF0ZWREZWZpbml0aW9ucyk7XG4gICAgfVxuICAgIGlmIChKU09OLnN0cmluZ2lmeShhbGxSb3dzKSAhPT0gSlNPTi5zdHJpbmdpZnkodXBkYXRlZFJvd3MpKSB7XG4gICAgICBzZXREbW5GaWxlUGF0aChnZXREbW5GaWxlUGF0aChkYXRhKSk7XG4gICAgICBzZXRDb2x1bW5zKHVwZGF0ZWRDb2x1bW5zKTtcbiAgICAgIHNldENvbHVtbk5hbWVzKGdldENvbHVtbk5hbWVzKGRhdGEpKTtcbiAgICAgIHNldEFsbFJvd3ModXBkYXRlZFJvd3MpO1xuICAgICAgc2V0RmlsdGVyZWRSb3dzKHVwZGF0ZWRSb3dzKTtcbiAgICAgIHNldFVuZG9SZWRvKHtcbiAgICAgICAgdW5kb0xpc3Q6IFtdLFxuICAgICAgICByZWRvTGlzdDogW10sXG4gICAgICAgIHNraXBVcGRhdGU6IGZhbHNlXG4gICAgICB9KTtcbiAgICAgIGxldCBpdGVtVG9Db2x1bW5JbmRleE1hcDogYW55ID0gW107XG4gICAgICBpbml0aWFsQ29sdW1uTmFtZXMuZm9yRWFjaCgoaXRlbTogYW55LCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gYCR7aXRlbS5ncm91cH0gJHtpdGVtLm5hbWV9YDtcbiAgICAgICAgaXRlbVRvQ29sdW1uSW5kZXhNYXBbdmFsdWVdID0gaW5kZXg7XG4gICAgICB9KTtcbiAgICAgIHNldEl0ZW1Ub0NvbHVtbkluZGV4TWFwKGluaXRpYWxDb2x1bW5OYW1lcyk7XG4gICAgfVxuICB9LCBbZGF0YSwgbW9kZWxdKTtcblxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHNlYXJjaFZhbHVlID0gKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmlkU2VhcmNoJykgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWU7XG4gICAgZmlsdGVyUm93cyhzZWFyY2hWYWx1ZSwgZmlsdGVyU2VsZWN0aW9uLCBhbGxSb3dzKTtcbiAgICBpZiAodW5kb1JlZG8uc2tpcFVwZGF0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzZXRMYXN0Rm9yY2VkVXBkYXRlU3RhdGUoKERhdGUubm93KCkpLnRvU3RyaW5nKCkpO1xuICB9LCBbIHVuZG9SZWRvIF0pO1xuXG4gIC8qKlxuICAgKiBUb2dnbGUgdGhlIHNpZGViYXJcbiAgICovXG4gIGNvbnN0IHRvZ2dsZURyYXdlciA9ICgpID0+IHtcbiAgICBzZXREcmF3ZXJFeHBhbmRlZCghaXNEcmF3ZXJFeHBhbmRlZCk7XG4gIH1cblxuICAvKiogXG4gICAqIENhbGxiYWNrIGZ1bmN0aW9uIGZvciBFZGl0b3IgaW5wdXRzLiBXaGVuIHRoZXkncmUgc2F2ZWQgd2UgYWRkIGl0IHRvIHRoZSBsaXN0IG9mIGNoYW5nZXMgZm9yIGNoYW5nZS10cmFja2luZy5cbiAgICovXG4gIGNvbnN0IGFkZFRvQ2hhbmdlcyA9IChpZDogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCBwcmV2aW91c1ZhbHVlOiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCB7IHJvdywgY29sdW1uIH0gPSBnZXRSb3dDb2x1bW5Gcm9tSWQoaWQpO1xuICAgIC8vIGNvbnN0IGNsb25lZEFsbFJvd3MgPSBjbG9uZURlZXAoYWxsUm93cyk7XG4gICAgYWxsUm93c1tyb3ddW2NvbHVtbl0udmFsdWUgPSB2YWx1ZTtcbiAgICAvLyBzZXRBbGxSb3dzKGFsbFJvd3MpO1xuICAgIC8vIG5ldyBjaGFuZ2UgY2xlYXJzIHRoZSByZWRvTGlzdFxuICAgIHNldFVuZG9SZWRvKChwcmV2aW91c1N0YXRlOiBhbnkpID0+ICh7XG4gICAgICB1bmRvTGlzdDogWy4uLnByZXZpb3VzU3RhdGUudW5kb0xpc3QsIHsgaWQsIHZhbHVlLCBwcmV2aW91c1ZhbHVlIH1dLFxuICAgICAgcmVkb0xpc3Q6IFtdLFxuICAgICAgc2tpcFVwZGF0ZTogdHJ1ZVxuICAgIH0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXZlcnRzIHRoZSBsYXN0IElucHV0IGNoYW5nZVxuICAgKiBQb3AgdGhlIHVuZG8gc3RhY2sgYW5kIHB1c2ggaXQgb250byByZWRvIHN0YWNrXG4gICAqL1xuICBjb25zdCBvblVuZG8gPSAoKSA9PiB7XG4gICAgaWYgKHVuZG9SZWRvLnVuZG9MaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGNsb25lZENoYW5nZXMgPSBbLi4udW5kb1JlZG8udW5kb0xpc3RdO1xuICAgICAgY29uc3QgbGFzdENoYW5nZSA9IGNsb25lZENoYW5nZXMucG9wKCk7XG4gICAgICBzZXRVbmRvUmVkbygocHJldmlvdXNTdGF0ZTogYW55KSA9PiAoe1xuICAgICAgICB1bmRvTGlzdDogY2xvbmVkQ2hhbmdlcyxcbiAgICAgICAgcmVkb0xpc3Q6IFsuLi5wcmV2aW91c1N0YXRlLnJlZG9MaXN0LCBsYXN0Q2hhbmdlXSxcbiAgICAgICAgc2tpcFVwZGF0ZTogZmFsc2VcbiAgICAgIH0pKTtcblxuICAgICAgY29uc3QgeyBpZCwgcHJldmlvdXNWYWx1ZSB9ID0gbGFzdENoYW5nZTtcbiAgICAgIGNvbnN0IHsgcm93LCBjb2x1bW4gfSA9IGdldFJvd0NvbHVtbkZyb21JZChpZCk7XG4gICAgICBhbGxSb3dzW3Jvd11bY29sdW1uXS52YWx1ZSA9IHByZXZpb3VzVmFsdWU7XG4gICAgICAvLyBsZXQgY2xvbmVkQWxsUm93cyA9IGNsb25lRGVlcChhbGxSb3dzKTtcbiAgICAgIC8vIGNsb25lZEFsbFJvd3Nbcm93XVtjb2x1bW5dLnZhbHVlID0gcHJldmlvdXNWYWx1ZTtcbiAgICAgIC8vIHNldEFsbFJvd3MoY2xvbmVkQWxsUm93cyk7XG4gICAgICAvLyBmaWx0ZXJSb3dzKHNlYXJjaFZhbHVlU3RhdGUsIGZpbHRlclNlbGVjdGlvbiwgY2xvbmVkQWxsUm93cyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFBvcCBpdCBmcm9tIHRoZSByZWRvIHN0YWNrIGFuZCBwdXNoIGl0IG9udG8gdW5kbyBzdGFja1xuICAgKiBhIG5ldyBjaGFuZ2UgY2xlYXJzIHRoZSByZWRvIHN0YWNrXG4gICAqL1xuICBjb25zdCBvblJlZG8gPSAoKSA9PiB7XG4gICAgaWYgKHVuZG9SZWRvLnJlZG9MaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGNsb25lZFJlZG9MaXN0ID0gWy4uLnVuZG9SZWRvLnJlZG9MaXN0XTtcbiAgICAgIGNvbnN0IGxhc3RSZWRvID0gY2xvbmVkUmVkb0xpc3QucG9wKCk7XG4gICAgICBzZXRVbmRvUmVkbygocHJldmlvdXNTdGF0ZTogYW55KSA9PiAoe1xuICAgICAgICB1bmRvTGlzdDogWy4uLnByZXZpb3VzU3RhdGUudW5kb0xpc3QsIGxhc3RSZWRvXSxcbiAgICAgICAgcmVkb0xpc3Q6IGNsb25lZFJlZG9MaXN0LFxuICAgICAgICBza2lwVXBkYXRlOiBmYWxzZVxuICAgICAgfSkpO1xuICAgICAgXG4gICAgICBjb25zdCB7IGlkLCB2YWx1ZSB9ID0gbGFzdFJlZG87XG4gICAgICBjb25zdCB7IHJvdywgY29sdW1uIH0gPSBnZXRSb3dDb2x1bW5Gcm9tSWQoaWQpO1xuICAgICAgYWxsUm93c1tyb3ddW2NvbHVtbl0udmFsdWUgPSB2YWx1ZTtcbiAgICAgIC8vIGNvbnN0IGNsb25lZEFsbFJvd3MgPSBjbG9uZURlZXAoYWxsUm93cyk7XG4gICAgICAvLyBjbG9uZWRBbGxSb3dzW3Jvd11bY29sdW1uXS52YWx1ZSA9IHZhbHVlO1xuICAgICAgLy8gc2V0QWxsUm93cyhjbG9uZWRBbGxSb3dzKTtcbiAgICAgIC8vIGZpbHRlclJvd3Moc2VhcmNoVmFsdWVTdGF0ZSwgZmlsdGVyU2VsZWN0aW9uLCBjbG9uZWRBbGxSb3dzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRmlsdGVyIHRoZSByb3dzIGJhc2VkIG9uIHNlYXJjaCBhbmQgZmlsdGVyIHNlbGVjdGlvblxuICAgKiBDYWxsYmFjayBmdW5jdGlvbiBmb3IgRWRpdG9yVG9vbGJhciwgY2FsbGVkIG9uIGZpbHRlci9zZWFyY2ggY2hhbmdlXG4gICAqL1xuICBjb25zdCBmaWx0ZXJSb3dzID0gKHZhbHVlOiBzdHJpbmcsIHNlbGVjdGVkOiBhbnlbXSwgcm93c1RvRmlsdGVyPzogYW55W10pID0+IHtcbiAgICBjb25zdCByb3dzID0gcm93c1RvRmlsdGVyIHx8IGFsbFJvd3M7XG4gICAgaWYgKEpTT04uc3RyaW5naWZ5KGZpbHRlclNlbGVjdGlvbikgIT09IEpTT04uc3RyaW5naWZ5KHNlbGVjdGVkKSkge1xuICAgICAgc2V0RmlsdGVyU2VsZWN0aW9uKHNlbGVjdGVkKTtcbiAgICB9XG4gICAgaWYgKCF2YWx1ZSkge1xuICAgICAgLy8gbm8gc2VhcmNoIHRlcm0sIHNob3cgYWxsIHJvd3NcbiAgICAgIHJldHVybiBzZXRGaWx0ZXJlZFJvd3Mocm93cyk7XG4gICAgfVxuICAgIGNvbnN0IHNlYXJjaFJFID0gbmV3IFJlZ0V4cCh2YWx1ZSwgJ2knKTtcbiAgICBjb25zdCBmaWx0ZXJlZFJvd3MgPSByb3dzLmZpbHRlcigocm93OiBhbnkpID0+IHtcbiAgICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuICAgICAgaWYgKHNlbGVjdGVkLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAvLyBzZWFyY2ggYWxsIGNvbHVtbnNcbiAgICAgICAgZm9yIChsZXQgY29sIG9mIHJvdykge1xuICAgICAgICAgIGlmIChjb2wgJiYgc2VhcmNoUkUudGVzdChjb2wudmFsdWUpKSB7XG4gICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHNlYXJjaCBvbmx5IHRoZSBzZWxlY3RlZCBjb2x1bW5zXG4gICAgICAgIGZvciAobGV0IHNlbCBvZiBzZWxlY3RlZCkge1xuICAgICAgICAgIGNvbnN0IGNvbHVtbkluZGV4ID0gaXRlbVRvQ29sdW1uSW5kZXhNYXBbc2VsXTtcbiAgICAgICAgICBpZiAocm93W2NvbHVtbkluZGV4XSAmJiBzZWFyY2hSRS50ZXN0KHJvd1tjb2x1bW5JbmRleF0udmFsdWUpKSB7XG4gICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmb3VuZDtcbiAgICB9KTtcbiAgICBzZXRGaWx0ZXJlZFJvd3MoZmlsdGVyZWRSb3dzKTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJwZi1tLXJlZGhhdC1mb250XCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInBmLWMtcGFnZVwiPlxuICAgICAgICA8aGVhZGVyIHJvbGU9XCJiYW5uZXJcIiBjbGFzc05hbWU9XCJwZi1jLXBhZ2VfX2hlYWRlclwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBmLWMtcGFnZV9faGVhZGVyLWJyYW5kXCI+XG4gICAgICAgICAge3Nob3dTaWRlUGFuZWwgJiYgPGRpdiBjbGFzc05hbWU9XCJwZi1jLXBhZ2VfX2hlYWRlci1icmFuZC10b2dnbGVcIj5cbiAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgaWQ9XCJuYXYtdG9nZ2xlXCJcbiAgICAgICAgICAgICAgb25DbGljaz17dG9nZ2xlRHJhd2VyfVxuICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwiVG9nZ2xlIGRyYXdlclwiXG4gICAgICAgICAgICAgIGFyaWEtY29udHJvbHM9XCJwYWdlLXNpZGViYXJcIlxuICAgICAgICAgICAgICBhcmlhLWV4cGFuZGVkPXtpc0RyYXdlckV4cGFuZGVkID8gJ3RydWUnIDogJ2ZhbHNlJ31cbiAgICAgICAgICAgICAgdmFyaWFudD1cInBsYWluXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPEJhcnNJY29uIC8+XG4gICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj59XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwZi1jLXBhZ2VfX2hlYWRlci1icmFuZC1saW5rXCI+XG4gICAgICAgICAgICB7ZGVmaW5pdGlvbnMuX3RpdGxlfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBmLWMtcGFnZV9faGVhZGVyLXRvb2xzXCI+XG4gICAgICAgICAgICA8RWRpdG9yVG9vbGJhciBcbiAgICAgICAgICAgICAgZGF0YT17ZGF0YX1cbiAgICAgICAgICAgICAgYWxsUm93c0xlbmd0aD17YWxsUm93cy5sZW5ndGh9IFxuICAgICAgICAgICAgICBmaWx0ZXJlZFJvd3NMZW5ndGg9e2ZpbHRlcmVkUm93cy5sZW5ndGh9IFxuICAgICAgICAgICAgICBmaWx0ZXJSb3dzPXtmaWx0ZXJSb3dzfSBcbiAgICAgICAgICAgICAgY29sdW1uTmFtZXM9e2NvbHVtbk5hbWVzfSBcbiAgICAgICAgICAgICAgcmVhZE9ubHk9e3JlYWRPbmx5fVxuICAgICAgICAgICAgICB1bmRvUmVkbz17dW5kb1JlZG99XG4gICAgICAgICAgICAgIG9uVW5kbz17b25VbmRvfVxuICAgICAgICAgICAgICBvblJlZG89e29uUmVkb31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvaGVhZGVyPlxuICAgICAgICB7c2hvd1NpZGVQYW5lbCAmJiA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhcInBmLWMtcGFnZV9fc2lkZWJhciBwZi1tLWRhcmtcIiwgaXNEcmF3ZXJFeHBhbmRlZCAmJiAncGYtbS1leHBhbmRlZCcsICFpc0RyYXdlckV4cGFuZGVkICYmICdwZi1tLWNvbGxhcHNlZCcpfT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBmLWMtcGFnZV9fc2lkZWJhci1ib2R5XCI+XG4gICAgICAgICAgICA8RGVmaW5pdGlvbnNEcmF3ZXJQYW5lbCBcbiAgICAgICAgICAgICAgZGVmaW5pdGlvbnM9e2RlZmluaXRpb25zfSBcbiAgICAgICAgICAgICAgZG1uRmlsZVBhdGg9e2RtbkZpbGVQYXRofSBcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2Pn1cbiAgICAgICAgPG1haW4gcm9sZT1cIm1haW5cIiBjbGFzc05hbWU9XCJwZi1jLXBhZ2VfX21haW5cIiBpZD1cInNjZS1zaW0tZ3JpZF9fbWFpblwiIHRhYkluZGV4PXstMX0+XG4gICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwicGYtYy1wYWdlX19tYWluLXNlY3Rpb24gcGYtbS1saWdodFwiPlxuICAgICAgICAgICAgPEVkaXRvciBcbiAgICAgICAgICAgICAgY29sdW1ucz17Y29sdW1uc30gXG4gICAgICAgICAgICAgIGZpbHRlcmVkUm93cz17ZmlsdGVyZWRSb3dzfSBcbiAgICAgICAgICAgICAgZGVmaW5pdGlvbnM9e2RlZmluaXRpb25zfSBcbiAgICAgICAgICAgICAgY29sdW1uTmFtZXM9e2NvbHVtbk5hbWVzfSBcbiAgICAgICAgICAgICAgb25TYXZlPXthZGRUb0NoYW5nZXN9XG4gICAgICAgICAgICAgIG9uVW5kbz17b25VbmRvfVxuICAgICAgICAgICAgICBvblJlZG89e29uUmVkb31cbiAgICAgICAgICAgICAgbGFzdEZvcmNlZFVwZGF0ZT17bGFzdEZvcmNlZFVwZGF0ZVN0YXRlfVxuICAgICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgPC9tYWluPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn0sIChwcmV2UHJvcHMsIG5leHRQcm9wcykgPT4ge1xuICBpZiAoSlNPTi5zdHJpbmdpZnkocHJldlByb3BzLmRhdGEpICE9PSBKU09OLnN0cmluZ2lmeShuZXh0UHJvcHMuZGF0YSkpIHtcbiAgICAvLyBkYXRhIGhhcyBjaGFuZ2VkLCByZS1yZW5kZXJcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKEpTT04uc3RyaW5naWZ5KHByZXZQcm9wcy5tb2RlbCkgIT09IEpTT04uc3RyaW5naWZ5KG5leHRQcm9wcy5tb2RlbCkpIHtcbiAgICAvLyBtb2RlbCBoYXMgY2hhbmdlZCwgcmUtcmVuZGVyXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufSk7XG5cbi8vIEB0cy1pZ25vcmVcbkVkaXRvckNvbnRhaW5lci53aHlEaWRZb3VSZW5kZXIgPSB7XG4gIGN1c3RvbU5hbWU6ICdFZGl0b3JDb250YWluZXInXG59O1xuXG5leHBvcnQgeyBFZGl0b3JDb250YWluZXIgfTtcbiJdfQ==
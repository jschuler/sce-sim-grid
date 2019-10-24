"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Editor = void 0;

var React = _interopRequireWildcard(require("react"));

var _utils = require("../utils");

var _reactInfiniteScrollComponent = _interopRequireDefault(require("react-infinite-scroll-component"));

var _Spinner = require("../Spinner");

var _Cell = require("../Cell");

require("./Editor.css");

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

var Editor = React.memo(function (_ref) {
  var columnDefs = _ref.columns,
      filteredRows = _ref.filteredRows,
      definitions = _ref.definitions,
      columnNames = _ref.columnNames,
      onSave = _ref.onSave,
      onUndo = _ref.onUndo,
      onRedo = _ref.onRedo,
      lastForcedUpdate = _ref.lastForcedUpdate,
      readOnly = _ref.readOnly;
  console.log('render Editor');
  var rowsToFetch = 50;

  var _React$useState = React.useState(''),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      editableCell = _React$useState2[0],
      setEditable = _React$useState2[1];

  var _React$useState3 = React.useState(false),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      expandedSelect = _React$useState4[0],
      setExpandedSelect = _React$useState4[1];

  var _React$useState5 = React.useState(1),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      currentPage = _React$useState6[0],
      setCurrentPage = _React$useState6[1]; // state from props


  var _React$useState7 = React.useState(columnDefs),
      _React$useState8 = _slicedToArray(_React$useState7, 2),
      columnDefsState = _React$useState8[0],
      setColumnDefsState = _React$useState8[1];

  var _React$useState9 = React.useState(filteredRows.slice(0, rowsToFetch)),
      _React$useState10 = _slicedToArray(_React$useState9, 2),
      fetchedRows = _React$useState10[0],
      setFetchedRows = _React$useState10[1];

  var _React$useState11 = React.useState(definitions),
      _React$useState12 = _slicedToArray(_React$useState11, 2),
      definitionsState = _React$useState12[0],
      setDefinitionsState = _React$useState12[1];

  var _React$useState13 = React.useState(columnNames),
      _React$useState14 = _slicedToArray(_React$useState13, 2),
      columnNamesState = _React$useState14[0],
      setColumnNamesState = _React$useState14[1];

  var _React$useState15 = React.useState(lastForcedUpdate),
      _React$useState16 = _slicedToArray(_React$useState15, 2),
      lastForcedUpdateState = _React$useState16[0],
      setLastForcedUpdateState = _React$useState16[1];

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

  var setNumGivenColumns = function setNumGivenColumns(num) {
    document.getElementById("kie-grid").style.setProperty("--num-given-columns", num.toString());
  };

  var setNumExpectColumns = function setNumExpectColumns(num) {
    document.getElementById("kie-grid").style.setProperty("--num-expect-columns", num.toString());
  };

  var activateCell = function activateCell(id) {
    if (id) {
      setEditable(id);
    }
  };

  var deactivateCell = function deactivateCell() {
    setEditable('');
  };

  var activateAndFocusCell = function activateAndFocusCell(id) {
    activateCell(id);
    (0, _utils.focusCell)(id);
  };

  var deactivateAndFocusCell = function deactivateAndFocusCell(id) {
    deactivateCell(); // expensive, causes re-renders?

    (0, _utils.focusCell)(id);
  };

  var onCellClick = function onCellClick(event) {
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


  var onCellDoubleClick = function onCellDoubleClick(event) {
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


  var onEnter = function onEnter(event) {
    // don't want Input's onEnter listener to fire
    event.stopPropagation();
    onCellDoubleClick(event);
  };
  /**
   * Up arrow key
   */


  var onUpKeyPress = function onUpKeyPress(event) {
    var activeElement = document && document.activeElement && document.activeElement.getAttribute('id') || '';

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
      var currentRow = Number.parseInt(currentIdArr[1]); // going up means decrementing the row

      var newRow = currentRow - 1;

      if (newRow < minRow) {
        return;
      } else {
        targetId = "row ".concat(newRow, " column ").concat(currentIdArr[3]);
        (0, _utils.focusCell)(targetId);
      }
    }
  };
  /**
   * Down arrow key
   */


  var onDownKeyPress = function onDownKeyPress(event) {
    var activeElement = document && document.activeElement && document.activeElement.getAttribute('id') || '';

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
      var currentRow = Number.parseInt(currentIdArr[1]); // going down means incrementing the row

      var newRow = currentRow + 1;

      if (newRow > maxRow) {
        return;
      } else {
        targetId = "row ".concat(newRow, " column ").concat(currentIdArr[3]);
        (0, _utils.focusCell)(targetId);
      }
    }
  };
  /**
   * Left arrow key
   */


  var onLeftKeyPress = function onLeftKeyPress(event) {
    var activeElement = document && document.activeElement && document.activeElement.getAttribute('id') || '';

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
      var currentCol = Number.parseInt(currentIdArr[3]); // going left means decrementing the column

      var newCol = currentCol - 1;

      if (newCol < minCol) {
        return;
      } else {
        targetId = "row ".concat(currentIdArr[1], " column ").concat(newCol);
        (0, _utils.focusCell)(targetId);
      }
    }
  };
  /**
   * Right arrow key
   */


  var onRightKeyPress = function onRightKeyPress(event) {
    var activeElement = document && document.activeElement && document.activeElement.getAttribute('id') || '';

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
      var currentCol = Number.parseInt(currentIdArr[3]); // going right means incrementing the column

      var newCol = currentCol + 1;

      if (newCol > maxCol) {
        return;
      } else {
        targetId = "row ".concat(currentIdArr[1], " column ").concat(newCol);
        (0, _utils.focusCell)(targetId);
      }
    }
  };
  /**
   * Copy cell listener
   */


  var onCopy = function onCopy(event) {
    /* Get the text field */
    var copyText = event.target;

    if (copyText && copyText.select) {
      /* Select the text field */
      copyText.select();
      copyText.setSelectionRange(0, 99999);
      /*For mobile devices*/

      /* Copy the text inside the text field */

      document.execCommand('copy'); // do not mark the whole text as selected

      (0, _utils.setCaretPositionAtEnd)(copyText);
    }
  }; // Command + C / CTRL + C copies the focused cell content


  (0, _utils.useKeyPress)(/c/i, onCopy, {
    log: 'editor',
    withModifier: true
  }); // Command + Z / CTRL + Z undo the last change

  (0, _utils.useKeyPress)(/z/i, onUndo, {
    log: 'editor',
    withModifier: true,
    isActive: !readOnly
  }); // Command + Shift + Z / CTRL + Shift + Z undo the last change

  (0, _utils.useKeyPress)(/z/i, onRedo, {
    log: 'editor',
    withModifier: true,
    withShift: true,
    isActive: !readOnly
  });
  (0, _utils.useKeyPress)('Enter', onEnter, {
    log: 'editor',
    isActive: !editableCell && !readOnly
  });
  (0, _utils.useKeyPress)(38, onUpKeyPress, {
    log: 'editor'
  });
  (0, _utils.useKeyPress)(40, onDownKeyPress, {
    log: 'editor'
  });
  (0, _utils.useKeyPress)(37, onLeftKeyPress, {
    log: 'editor'
  });
  (0, _utils.useKeyPress)(39, onRightKeyPress, {
    log: 'editor'
  });

  var onSelectToggleCallback = function onSelectToggleCallback(id, isExpanded) {
    setExpandedSelect(isExpanded);
  }; // rowData


  var fetchMoreRows = function fetchMoreRows(page) {
    if (page) {
      setFetchedRows(function (prevState) {
        return [].concat(_toConsumableArray(prevState), _toConsumableArray(filteredRows.slice(page * rowsToFetch, page * rowsToFetch + rowsToFetch)));
      });
    } else {
      setFetchedRows(function (prevState) {
        return [].concat(_toConsumableArray(prevState), _toConsumableArray(filteredRows.slice(currentPage * rowsToFetch, currentPage * rowsToFetch + rowsToFetch)));
      });
      setCurrentPage(currentPage + 1);
    }
  }; // console.log(fetchedRows);
  // console.log(columnNamesState);


  return !fetchedRows ? null : React.createElement(React.Fragment, null, React.createElement("div", {
    id: "kie-grid",
    className: "kie-grid",
    ref: editorRef
  }, columnDefsState.other.map(function (other, index) {
    if (index === 0) {
      return React.createElement("div", {
        className: "kie-grid__item kie-grid__number",
        key: "other-number"
      }, other.name);
    } else {
      return React.createElement("div", {
        className: "kie-grid__item kie-grid__description",
        key: "other-description"
      }, other.name);
    }
  }), React.createElement("div", {
    className: "kie-grid__header--given"
  }, React.createElement("div", {
    className: "kie-grid__item kie-grid__given"
  }, "GIVEN")), React.createElement("div", {
    className: "kie-grid__header--expect"
  }, React.createElement("div", {
    className: "kie-grid__item kie-grid__expect"
  }, "EXPECT")), React.createElement("div", {
    className: "kie-grid__header--given"
  }, columnDefsState.given.map(function (given, index) {
    return React.createElement("div", {
      key: "given instance ".concat(index),
      className: "kie-grid__item kie-grid__instance",
      style: {
        gridColumn: "span ".concat(given.children.length)
      }
    }, given.group);
  })), React.createElement("div", {
    className: "kie-grid__header--expect"
  }, columnDefsState.expect.map(function (expect, index) {
    return React.createElement("div", {
      key: "expect instance ".concat(index),
      className: "kie-grid__item kie-grid__instance",
      style: {
        gridColumn: "span ".concat(expect.children.length)
      }
    }, expect.group);
  })), React.createElement("div", {
    className: "kie-grid__header--given"
  }, columnDefsState.given.map(function (given, index) {
    return given.children.map(function (givenChild, index) {
      return React.createElement("div", {
        key: "given property ".concat(index),
        className: "kie-grid__item kie-grid__property"
      }, givenChild.name);
    });
  })), React.createElement("div", {
    className: "kie-grid__header--expect"
  }, columnDefsState.expect.map(function (expect, index) {
    return expect.children.map(function (expectChild, index) {
      return React.createElement("div", {
        key: "expect property ".concat(index),
        className: "kie-grid__item kie-grid__property"
      }, expectChild.name);
    });
  })), React.createElement("div", {
    className: "kie-grid__body"
  }, React.createElement(_reactInfiniteScrollComponent.default, {
    dataLength: fetchedRows.length,
    next: fetchMoreRows,
    hasMore: fetchedRows.length < filteredRows.length,
    loader: React.createElement(_Spinner.Spinner, {
      className: "kie-grid__item kie-grid__item--loading pf-u-pt-sm",
      size: "md"
    }),
    scrollableTarget: "sce-sim-grid__main"
  }, fetchedRows.map(function (row, rowIndex) {
    return React.createElement("div", {
      className: "kie-grid__rule",
      style: {},
      key: "row ".concat(row[0].value)
    }, row.map(function (cell, index) {
      // get the type of the column to pass on to the input for formatting / validation
      var type = 'string';
      var columnGroup = '';
      var columnName = '';

      if (index === 0) {
        // row index
        type = 'number';
      } else if (index === 1) {
        // description
        type = 'string';
      } else if (index > 1) {
        columnGroup = columnNamesState[index].group;
        columnName = columnNamesState[index].name;
        type = definitionsState.map[columnNamesState[index].group] && definitionsState.map[columnGroup][columnName] || 'string';
      }

      var cellIndex = index;
      var value = cell && cell.value ? cell.value : '';
      var path = cell && cell.path ? cell.path : ''; // const cellId = `cell ${cellIndex}`;

      var inputId = "row ".concat(rowIndex, " column ").concat(cellIndex);
      var component;
      var typeArr = type.split(',');

      if (typeArr.length > 1) {
        // Multiple options, render Select
        component = React.createElement(_Cell.Select, {
          isReadOnly: inputId !== editableCell,
          id: inputId,
          originalValue: value,
          onSelectToggleCallback: onSelectToggleCallback,
          options: typeArr.map(function (string) {
            return string.trim();
          }),
          deactivateAndFocusCell: deactivateAndFocusCell,
          setEditable: setEditable,
          onSave: onSave
        });
      } else {
        component = React.createElement(_Cell.Input, {
          isReadOnly: inputId !== editableCell,
          id: inputId,
          originalValue: value,
          path: path,
          type: type,
          deactivateAndFocusCell: deactivateAndFocusCell,
          setEditable: setEditable,
          onSave: onSave
        });
      }

      return React.createElement("div", {
        className: "kie-grid__item",
        key: inputId,
        onClick: onCellClick,
        onDoubleClick: onCellDoubleClick
      }, cellIndex === 0 ? value : component);
    }));
  })))));
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
}); // @ts-ignore

exports.Editor = Editor;
Editor.whyDidYouRender = {
  customName: 'Editor'
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0VkaXRvci9FZGl0b3IudHN4Il0sIm5hbWVzIjpbIkVkaXRvciIsIlJlYWN0IiwibWVtbyIsImNvbHVtbkRlZnMiLCJjb2x1bW5zIiwiZmlsdGVyZWRSb3dzIiwiZGVmaW5pdGlvbnMiLCJjb2x1bW5OYW1lcyIsIm9uU2F2ZSIsIm9uVW5kbyIsIm9uUmVkbyIsImxhc3RGb3JjZWRVcGRhdGUiLCJyZWFkT25seSIsImNvbnNvbGUiLCJsb2ciLCJyb3dzVG9GZXRjaCIsInVzZVN0YXRlIiwiZWRpdGFibGVDZWxsIiwic2V0RWRpdGFibGUiLCJleHBhbmRlZFNlbGVjdCIsInNldEV4cGFuZGVkU2VsZWN0IiwiY3VycmVudFBhZ2UiLCJzZXRDdXJyZW50UGFnZSIsImNvbHVtbkRlZnNTdGF0ZSIsInNldENvbHVtbkRlZnNTdGF0ZSIsInNsaWNlIiwiZmV0Y2hlZFJvd3MiLCJzZXRGZXRjaGVkUm93cyIsImRlZmluaXRpb25zU3RhdGUiLCJzZXREZWZpbml0aW9uc1N0YXRlIiwiY29sdW1uTmFtZXNTdGF0ZSIsInNldENvbHVtbk5hbWVzU3RhdGUiLCJsYXN0Rm9yY2VkVXBkYXRlU3RhdGUiLCJzZXRMYXN0Rm9yY2VkVXBkYXRlU3RhdGUiLCJlZGl0b3JSZWYiLCJ1c2VSZWYiLCJ1c2VFZmZlY3QiLCJzZXRUaW1lb3V0Iiwic2V0TnVtR2l2ZW5Db2x1bW5zIiwibnVtR2l2ZW4iLCJzZXROdW1FeHBlY3RDb2x1bW5zIiwibnVtRXhwZWN0IiwiSlNPTiIsInN0cmluZ2lmeSIsIm51bSIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJzdHlsZSIsInNldFByb3BlcnR5IiwidG9TdHJpbmciLCJhY3RpdmF0ZUNlbGwiLCJpZCIsImRlYWN0aXZhdGVDZWxsIiwiYWN0aXZhdGVBbmRGb2N1c0NlbGwiLCJkZWFjdGl2YXRlQW5kRm9jdXNDZWxsIiwib25DZWxsQ2xpY2siLCJldmVudCIsInRhcmdldCIsIm9uQ2VsbERvdWJsZUNsaWNrIiwib25FbnRlciIsInN0b3BQcm9wYWdhdGlvbiIsIm9uVXBLZXlQcmVzcyIsImFjdGl2ZUVsZW1lbnQiLCJnZXRBdHRyaWJ1dGUiLCJjdXJyZW50SWQiLCJtaW5Sb3ciLCJ0YXJnZXRJZCIsImN1cnJlbnRJZEFyciIsInNwbGl0IiwiY3VycmVudFJvdyIsIk51bWJlciIsInBhcnNlSW50IiwibmV3Um93Iiwib25Eb3duS2V5UHJlc3MiLCJtYXhSb3ciLCJsZW5ndGgiLCJvbkxlZnRLZXlQcmVzcyIsIm1pbkNvbCIsImN1cnJlbnRDb2wiLCJuZXdDb2wiLCJvblJpZ2h0S2V5UHJlc3MiLCJtYXhDb2wiLCJvbkNvcHkiLCJjb3B5VGV4dCIsInNlbGVjdCIsInNldFNlbGVjdGlvblJhbmdlIiwiZXhlY0NvbW1hbmQiLCJ3aXRoTW9kaWZpZXIiLCJpc0FjdGl2ZSIsIndpdGhTaGlmdCIsIm9uU2VsZWN0VG9nZ2xlQ2FsbGJhY2siLCJpc0V4cGFuZGVkIiwiZmV0Y2hNb3JlUm93cyIsInBhZ2UiLCJwcmV2U3RhdGUiLCJvdGhlciIsIm1hcCIsImluZGV4IiwibmFtZSIsImdpdmVuIiwiZ3JpZENvbHVtbiIsImNoaWxkcmVuIiwiZ3JvdXAiLCJleHBlY3QiLCJnaXZlbkNoaWxkIiwiZXhwZWN0Q2hpbGQiLCJyb3ciLCJyb3dJbmRleCIsInZhbHVlIiwiY2VsbCIsInR5cGUiLCJjb2x1bW5Hcm91cCIsImNvbHVtbk5hbWUiLCJjZWxsSW5kZXgiLCJwYXRoIiwiaW5wdXRJZCIsImNvbXBvbmVudCIsInR5cGVBcnIiLCJzdHJpbmciLCJ0cmltIiwicHJldlByb3BzIiwibmV4dFByb3BzIiwid2h5RGlkWW91UmVuZGVyIiwiY3VzdG9tTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxNQUFNLEdBQUdDLEtBQUssQ0FBQ0MsSUFBTixDQVVaLGdCQVVHO0FBQUEsTUFUS0MsVUFTTCxR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UyxDQUFDcEgsWUFBekIsQ0FBbEgsRUFBMEo7QUFDeEo7QUFDQSxXQUFPLEtBQVA7QUFDRDs7QUFDRCxTQUFPLElBQVA7QUFDRCxDQWpiYyxDQUFmLEMsQ0FtYkE7OztBQUNBTCxNQUFNLENBQUMwSCxlQUFQLEdBQXlCO0FBQ3ZCQyxFQUFBQSxVQUFVLEVBQUU7QUFEVyxDQUF6QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZUtleVByZXNzLCBzZXRDYXJldFBvc2l0aW9uQXRFbmQsIGZvY3VzQ2VsbCB9IGZyb20gXCIuLi91dGlsc1wiO1xuaW1wb3J0IEluZmluaXRlU2Nyb2xsIGZyb20gJ3JlYWN0LWluZmluaXRlLXNjcm9sbC1jb21wb25lbnQnO1xuaW1wb3J0IHsgU3Bpbm5lciB9IGZyb20gJy4uL1NwaW5uZXInO1xuaW1wb3J0IHsgSW5wdXQsIFNlbGVjdCB9IGZyb20gJy4uL0NlbGwnO1xuaW1wb3J0IFwiLi9FZGl0b3IuY3NzXCI7XG5cbmNvbnN0IEVkaXRvciA9IFJlYWN0Lm1lbW88eyBcbiAgY29sdW1uczogYW55LCBcbiAgZmlsdGVyZWRSb3dzIDogYW55LCBcbiAgZGVmaW5pdGlvbnM6IGFueSwgXG4gIGNvbHVtbk5hbWVzOiBhbnksXG4gIG9uU2F2ZTogYW55LFxuICBvblVuZG86IGFueSxcbiAgb25SZWRvOiBhbnksXG4gIGxhc3RGb3JjZWRVcGRhdGU6IHN0cmluZyxcbiAgcmVhZE9ubHk6IGJvb2xlYW5cbn0+KCh7IFxuICBjb2x1bW5zOiBjb2x1bW5EZWZzLCBcbiAgZmlsdGVyZWRSb3dzLCBcbiAgZGVmaW5pdGlvbnMsIFxuICBjb2x1bW5OYW1lcyxcbiAgb25TYXZlLFxuICBvblVuZG8sXG4gIG9uUmVkbyxcbiAgbGFzdEZvcmNlZFVwZGF0ZSxcbiAgcmVhZE9ubHlcbn0pID0+IHtcbiAgY29uc29sZS5sb2coJ3JlbmRlciBFZGl0b3InKTtcblxuICBjb25zdCByb3dzVG9GZXRjaCA9IDUwO1xuXG4gIGNvbnN0IFtlZGl0YWJsZUNlbGwsIHNldEVkaXRhYmxlXSA9IFJlYWN0LnVzZVN0YXRlPHN0cmluZz4oJycpO1xuICBjb25zdCBbZXhwYW5kZWRTZWxlY3QsIHNldEV4cGFuZGVkU2VsZWN0XSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW2N1cnJlbnRQYWdlLCBzZXRDdXJyZW50UGFnZV0gPSBSZWFjdC51c2VTdGF0ZSgxKTtcblxuICAvLyBzdGF0ZSBmcm9tIHByb3BzXG4gIGNvbnN0IFtjb2x1bW5EZWZzU3RhdGUsIHNldENvbHVtbkRlZnNTdGF0ZV0gPSBSZWFjdC51c2VTdGF0ZShjb2x1bW5EZWZzKTtcbiAgY29uc3QgW2ZldGNoZWRSb3dzLCBzZXRGZXRjaGVkUm93c10gPSBSZWFjdC51c2VTdGF0ZShmaWx0ZXJlZFJvd3Muc2xpY2UoMCwgcm93c1RvRmV0Y2gpKTtcbiAgY29uc3QgW2RlZmluaXRpb25zU3RhdGUsIHNldERlZmluaXRpb25zU3RhdGVdID0gUmVhY3QudXNlU3RhdGUoZGVmaW5pdGlvbnMpO1xuICBjb25zdCBbY29sdW1uTmFtZXNTdGF0ZSwgc2V0Q29sdW1uTmFtZXNTdGF0ZV0gPSBSZWFjdC51c2VTdGF0ZShjb2x1bW5OYW1lcyk7XG4gIGNvbnN0IFtsYXN0Rm9yY2VkVXBkYXRlU3RhdGUsIHNldExhc3RGb3JjZWRVcGRhdGVTdGF0ZV0gPSBSZWFjdC51c2VTdGF0ZShsYXN0Rm9yY2VkVXBkYXRlKTtcblxuICBjb25zdCBlZGl0b3JSZWYgPSBSZWFjdC51c2VSZWYobnVsbCk7XG5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHNldE51bUdpdmVuQ29sdW1ucyhjb2x1bW5EZWZzLm51bUdpdmVuKTtcbiAgICAgIHNldE51bUV4cGVjdENvbHVtbnMoY29sdW1uRGVmcy5udW1FeHBlY3QpO1xuICAgIH0sIDEpXG4gIH0sIFtjb2x1bW5EZWZzXSk7XG5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAvLyByZW5kZXIgZGVwZW5kcyBvbiB1cGRhdGVkIHZhbHVlIG9mIGZldGNoZWRSb3dzXG4gICAgaWYgKEpTT04uc3RyaW5naWZ5KGNvbHVtbkRlZnNTdGF0ZSkgIT09IEpTT04uc3RyaW5naWZ5KGNvbHVtbkRlZnMpKSB7XG4gICAgICBzZXRDb2x1bW5EZWZzU3RhdGUoY29sdW1uRGVmcyk7XG4gICAgfVxuICAgIGlmIChsYXN0Rm9yY2VkVXBkYXRlU3RhdGUgIT09IGxhc3RGb3JjZWRVcGRhdGUgfHwgSlNPTi5zdHJpbmdpZnkoZmV0Y2hlZFJvd3MpICE9PSBKU09OLnN0cmluZ2lmeShmaWx0ZXJlZFJvd3Muc2xpY2UoMCwgcm93c1RvRmV0Y2gpKSkge1xuICAgICAgc2V0RmV0Y2hlZFJvd3MoZmlsdGVyZWRSb3dzLnNsaWNlKDAsIHJvd3NUb0ZldGNoKSk7XG4gICAgfVxuICAgIGlmIChKU09OLnN0cmluZ2lmeShkZWZpbml0aW9uc1N0YXRlKSAhPT0gSlNPTi5zdHJpbmdpZnkoZGVmaW5pdGlvbnMpKSB7XG4gICAgICBzZXREZWZpbml0aW9uc1N0YXRlKGRlZmluaXRpb25zKTtcbiAgICB9XG4gICAgaWYgKEpTT04uc3RyaW5naWZ5KGNvbHVtbk5hbWVzU3RhdGUpICE9PSBKU09OLnN0cmluZ2lmeShjb2x1bW5OYW1lcykpIHtcbiAgICAgIHNldENvbHVtbk5hbWVzU3RhdGUoY29sdW1uTmFtZXMpO1xuICAgIH1cbiAgfSwgW2NvbHVtbkRlZnMsIGZpbHRlcmVkUm93cywgZGVmaW5pdGlvbnMsIGNvbHVtbk5hbWVzLCBsYXN0Rm9yY2VkVXBkYXRlXSk7XG5cbiAgY29uc3Qgc2V0TnVtR2l2ZW5Db2x1bW5zID0gKG51bTogbnVtYmVyKSA9PiB7XG4gICAgZG9jdW1lbnRcbiAgICAgIC5nZXRFbGVtZW50QnlJZChcImtpZS1ncmlkXCIpIVxuICAgICAgLnN0eWxlLnNldFByb3BlcnR5KFwiLS1udW0tZ2l2ZW4tY29sdW1uc1wiLCBudW0udG9TdHJpbmcoKSk7XG4gIH07XG5cbiAgY29uc3Qgc2V0TnVtRXhwZWN0Q29sdW1ucyA9IChudW06IG51bWJlcikgPT4ge1xuICAgIGRvY3VtZW50XG4gICAgICAuZ2V0RWxlbWVudEJ5SWQoXCJraWUtZ3JpZFwiKSFcbiAgICAgIC5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tbnVtLWV4cGVjdC1jb2x1bW5zXCIsIG51bS50b1N0cmluZygpKTtcbiAgfTtcblxuICBjb25zdCBhY3RpdmF0ZUNlbGwgPSAoaWQ6IHN0cmluZykgPT4ge1xuICAgIGlmIChpZCkge1xuICAgICAgc2V0RWRpdGFibGUoaWQpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGRlYWN0aXZhdGVDZWxsID0gKCkgPT4ge1xuICAgIHNldEVkaXRhYmxlKCcnKTtcbiAgfVxuXG4gIGNvbnN0IGFjdGl2YXRlQW5kRm9jdXNDZWxsID0gKGlkOiBzdHJpbmcpID0+IHtcbiAgICBhY3RpdmF0ZUNlbGwoaWQpO1xuICAgIGZvY3VzQ2VsbChpZCk7XG4gIH1cblxuICBjb25zdCBkZWFjdGl2YXRlQW5kRm9jdXNDZWxsID0gKGlkOiBzdHJpbmcpID0+IHtcbiAgICBkZWFjdGl2YXRlQ2VsbCgpOyAvLyBleHBlbnNpdmUsIGNhdXNlcyByZS1yZW5kZXJzP1xuICAgIGZvY3VzQ2VsbChpZCk7XG4gIH1cblxuICBjb25zdCBvbkNlbGxDbGljayA9IChldmVudDogYW55KSA9PiB7XG4gICAgY29uc3QgeyBpZCB9ID0gZXZlbnQudGFyZ2V0O1xuICAgIGlmIChpZCA9PT0gZWRpdGFibGVDZWxsKSB7XG4gICAgICAvLyBhbHJlYWR5IGFjdGl2ZVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChlZGl0YWJsZUNlbGwpIHtcbiAgICAgIC8vIGdldCBvdXQgb2YgYSBwcmV2aW91cyBjZWxsIGVkaXRpbmcgbW9kZVxuICAgICAgZGVhY3RpdmF0ZUNlbGwoKTtcbiAgICB9XG4gICAgcmV0dXJuIGlkO1xuICB9O1xuXG4gIC8qKlxuICAgKiBFbnRlciBlZGl0aW5nIG1vZGVcbiAgICovXG4gIGNvbnN0IG9uQ2VsbERvdWJsZUNsaWNrID0gKGV2ZW50OiBhbnkpID0+IHtcbiAgICBpZiAocmVhZE9ubHkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgaWQgPSBvbkNlbGxDbGljayhldmVudCk7XG4gICAgaWYgKGlkKSB7XG4gICAgICBhY3RpdmF0ZUFuZEZvY3VzQ2VsbChpZCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEVudGVyIGVkaXRpbmcgbW9kZVxuICAgKi9cbiAgY29uc3Qgb25FbnRlciA9IChldmVudDogYW55KSA9PiB7XG4gICAgLy8gZG9uJ3Qgd2FudCBJbnB1dCdzIG9uRW50ZXIgbGlzdGVuZXIgdG8gZmlyZVxuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIG9uQ2VsbERvdWJsZUNsaWNrKGV2ZW50KTtcbiAgfTtcblxuICAvKipcbiAgICogVXAgYXJyb3cga2V5XG4gICAqL1xuICBjb25zdCBvblVwS2V5UHJlc3MgPSAoZXZlbnQ6IGFueSkgPT4ge1xuICAgIGNvbnN0IGFjdGl2ZUVsZW1lbnQgPSAoZG9jdW1lbnQgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmdldEF0dHJpYnV0ZSgnaWQnKSkgfHwgJyc7XG4gICAgaWYgKGV4cGFuZGVkU2VsZWN0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChlZGl0YWJsZUNlbGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgY3VycmVudElkID0gYWN0aXZlRWxlbWVudDtcbiAgICBjb25zdCBtaW5Sb3cgPSAwO1xuICAgIGxldCB0YXJnZXRJZDtcbiAgICBpZiAoY3VycmVudElkKSB7XG4gICAgICAvLyBbJ3JvdycsICcxJywgJ2NvbHVtbicsICcyJ11cbiAgICAgIGNvbnN0IGN1cnJlbnRJZEFycjogc3RyaW5nW10gPSBjdXJyZW50SWQuc3BsaXQoJyAnKTtcbiAgICAgIGNvbnN0IGN1cnJlbnRSb3cgPSBOdW1iZXIucGFyc2VJbnQoY3VycmVudElkQXJyWzFdKTtcbiAgICAgIC8vIGdvaW5nIHVwIG1lYW5zIGRlY3JlbWVudGluZyB0aGUgcm93XG4gICAgICBjb25zdCBuZXdSb3cgPSBjdXJyZW50Um93IC0gMTtcbiAgICAgIGlmIChuZXdSb3cgPCBtaW5Sb3cpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFyZ2V0SWQgPSBgcm93ICR7bmV3Um93fSBjb2x1bW4gJHtjdXJyZW50SWRBcnJbM119YDtcbiAgICAgICAgZm9jdXNDZWxsKHRhcmdldElkKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIERvd24gYXJyb3cga2V5XG4gICAqL1xuICBjb25zdCBvbkRvd25LZXlQcmVzcyA9IChldmVudDogYW55KSA9PiB7XG4gICAgY29uc3QgYWN0aXZlRWxlbWVudCA9IChkb2N1bWVudCAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpZCcpKSB8fCAnJztcbiAgICBpZiAoZXhwYW5kZWRTZWxlY3QpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGVkaXRhYmxlQ2VsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBjdXJyZW50SWQgPSBhY3RpdmVFbGVtZW50O1xuICAgIGNvbnN0IG1heFJvdyA9IGZpbHRlcmVkUm93cy5sZW5ndGggLSAxO1xuICAgIGxldCB0YXJnZXRJZDtcbiAgICBpZiAoY3VycmVudElkKSB7XG4gICAgICAvLyBbJ3JvdycsICcxJywgJ2NvbHVtbicsICcyJ11cbiAgICAgIGNvbnN0IGN1cnJlbnRJZEFycjogc3RyaW5nW10gPSBjdXJyZW50SWQuc3BsaXQoJyAnKTtcbiAgICAgIGNvbnN0IGN1cnJlbnRSb3cgPSBOdW1iZXIucGFyc2VJbnQoY3VycmVudElkQXJyWzFdKTtcbiAgICAgIC8vIGdvaW5nIGRvd24gbWVhbnMgaW5jcmVtZW50aW5nIHRoZSByb3dcbiAgICAgIGNvbnN0IG5ld1JvdyA9IGN1cnJlbnRSb3cgKyAxO1xuICAgICAgaWYgKG5ld1JvdyA+IG1heFJvdykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YXJnZXRJZCA9IGByb3cgJHtuZXdSb3d9IGNvbHVtbiAke2N1cnJlbnRJZEFyclszXX1gO1xuICAgICAgICBmb2N1c0NlbGwodGFyZ2V0SWQpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogTGVmdCBhcnJvdyBrZXlcbiAgICovXG4gIGNvbnN0IG9uTGVmdEtleVByZXNzID0gKGV2ZW50OiBhbnkpID0+IHtcbiAgICBjb25zdCBhY3RpdmVFbGVtZW50ID0gKGRvY3VtZW50ICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lkJykpIHx8ICcnO1xuICAgIGlmIChleHBhbmRlZFNlbGVjdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoZWRpdGFibGVDZWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGN1cnJlbnRJZCA9IGFjdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3QgbWluQ29sID0gMTtcbiAgICBsZXQgdGFyZ2V0SWQ7XG4gICAgaWYgKGN1cnJlbnRJZCkge1xuICAgICAgLy8gWydyb3cnLCAnMScsICdjb2x1bW4nLCAnMiddXG4gICAgICBjb25zdCBjdXJyZW50SWRBcnI6IHN0cmluZ1tdID0gY3VycmVudElkLnNwbGl0KCcgJyk7XG4gICAgICBjb25zdCBjdXJyZW50Q29sID0gTnVtYmVyLnBhcnNlSW50KGN1cnJlbnRJZEFyclszXSk7XG4gICAgICAvLyBnb2luZyBsZWZ0IG1lYW5zIGRlY3JlbWVudGluZyB0aGUgY29sdW1uXG4gICAgICBjb25zdCBuZXdDb2wgPSBjdXJyZW50Q29sIC0gMTtcbiAgICAgIGlmIChuZXdDb2wgPCBtaW5Db2wpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFyZ2V0SWQgPSBgcm93ICR7Y3VycmVudElkQXJyWzFdfSBjb2x1bW4gJHtuZXdDb2x9YDtcbiAgICAgICAgZm9jdXNDZWxsKHRhcmdldElkKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFJpZ2h0IGFycm93IGtleVxuICAgKi9cbiAgY29uc3Qgb25SaWdodEtleVByZXNzID0gKGV2ZW50OiBhbnkpID0+IHtcbiAgICBjb25zdCBhY3RpdmVFbGVtZW50ID0gKGRvY3VtZW50ICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lkJykpIHx8ICcnO1xuICAgIGlmIChleHBhbmRlZFNlbGVjdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoZWRpdGFibGVDZWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGN1cnJlbnRJZCA9IGFjdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3QgbWF4Q29sID0gY29sdW1uRGVmcy5udW1HaXZlbiArIGNvbHVtbkRlZnMubnVtRXhwZWN0ICsgMTtcbiAgICBsZXQgdGFyZ2V0SWQ7XG4gICAgaWYgKGN1cnJlbnRJZCkge1xuICAgICAgLy8gWydyb3cnLCAnMScsICdjb2x1bW4nLCAnMiddXG4gICAgICBjb25zdCBjdXJyZW50SWRBcnI6IHN0cmluZ1tdID0gY3VycmVudElkLnNwbGl0KCcgJyk7XG4gICAgICBjb25zdCBjdXJyZW50Q29sID0gTnVtYmVyLnBhcnNlSW50KGN1cnJlbnRJZEFyclszXSk7XG4gICAgICAvLyBnb2luZyByaWdodCBtZWFucyBpbmNyZW1lbnRpbmcgdGhlIGNvbHVtblxuICAgICAgY29uc3QgbmV3Q29sID0gY3VycmVudENvbCArIDE7XG4gICAgICBpZiAobmV3Q29sID4gbWF4Q29sKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldElkID0gYHJvdyAke2N1cnJlbnRJZEFyclsxXX0gY29sdW1uICR7bmV3Q29sfWA7XG4gICAgICAgIGZvY3VzQ2VsbCh0YXJnZXRJZCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBDb3B5IGNlbGwgbGlzdGVuZXJcbiAgICovXG4gIGNvbnN0IG9uQ29weSA9IChldmVudDogYW55KSA9PiB7XG4gICAgLyogR2V0IHRoZSB0ZXh0IGZpZWxkICovXG4gICAgY29uc3QgY29weVRleHQgPSBldmVudC50YXJnZXQ7XG4gICAgaWYgKGNvcHlUZXh0ICYmIGNvcHlUZXh0LnNlbGVjdCkge1xuICAgICAgLyogU2VsZWN0IHRoZSB0ZXh0IGZpZWxkICovXG4gICAgICBjb3B5VGV4dC5zZWxlY3QoKTtcbiAgICAgIGNvcHlUZXh0LnNldFNlbGVjdGlvblJhbmdlKDAsIDk5OTk5KTsgLypGb3IgbW9iaWxlIGRldmljZXMqL1xuICAgICAgLyogQ29weSB0aGUgdGV4dCBpbnNpZGUgdGhlIHRleHQgZmllbGQgKi9cbiAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdjb3B5Jyk7XG4gICAgICAvLyBkbyBub3QgbWFyayB0aGUgd2hvbGUgdGV4dCBhcyBzZWxlY3RlZFxuICAgICAgc2V0Q2FyZXRQb3NpdGlvbkF0RW5kKGNvcHlUZXh0KTtcbiAgICB9XG4gIH07XG5cbiAgLy8gQ29tbWFuZCArIEMgLyBDVFJMICsgQyBjb3BpZXMgdGhlIGZvY3VzZWQgY2VsbCBjb250ZW50XG4gIHVzZUtleVByZXNzKC9jL2ksIG9uQ29weSwgeyBsb2c6ICdlZGl0b3InLCB3aXRoTW9kaWZpZXI6IHRydWUgfSk7XG4gIC8vIENvbW1hbmQgKyBaIC8gQ1RSTCArIFogdW5kbyB0aGUgbGFzdCBjaGFuZ2VcbiAgdXNlS2V5UHJlc3MoL3ovaSwgb25VbmRvLCB7IGxvZzogJ2VkaXRvcicsIHdpdGhNb2RpZmllcjogdHJ1ZSwgaXNBY3RpdmU6ICFyZWFkT25seSB9KTtcbiAgLy8gQ29tbWFuZCArIFNoaWZ0ICsgWiAvIENUUkwgKyBTaGlmdCArIFogdW5kbyB0aGUgbGFzdCBjaGFuZ2VcbiAgdXNlS2V5UHJlc3MoL3ovaSwgb25SZWRvLCB7IGxvZzogJ2VkaXRvcicsIHdpdGhNb2RpZmllcjogdHJ1ZSwgd2l0aFNoaWZ0OiB0cnVlLCBpc0FjdGl2ZTogIXJlYWRPbmx5IH0pO1xuICB1c2VLZXlQcmVzcygnRW50ZXInLCBvbkVudGVyLCB7IGxvZzogJ2VkaXRvcicsIGlzQWN0aXZlOiAoIWVkaXRhYmxlQ2VsbCAmJiAhcmVhZE9ubHkpIH0pO1xuICB1c2VLZXlQcmVzcygzOCwgb25VcEtleVByZXNzLCB7IGxvZzogJ2VkaXRvcicgfSk7XG4gIHVzZUtleVByZXNzKDQwLCBvbkRvd25LZXlQcmVzcywgeyBsb2c6ICdlZGl0b3InIH0pO1xuICB1c2VLZXlQcmVzcygzNywgb25MZWZ0S2V5UHJlc3MsIHsgbG9nOiAnZWRpdG9yJyB9KTtcbiAgdXNlS2V5UHJlc3MoMzksIG9uUmlnaHRLZXlQcmVzcywgeyBsb2c6ICdlZGl0b3InIH0pO1xuXG4gIGNvbnN0IG9uU2VsZWN0VG9nZ2xlQ2FsbGJhY2sgPSAoaWQ6IGFueSwgaXNFeHBhbmRlZDogYm9vbGVhbikgPT4ge1xuICAgIHNldEV4cGFuZGVkU2VsZWN0KGlzRXhwYW5kZWQpO1xuICB9O1xuXG4gIC8vIHJvd0RhdGFcbiAgY29uc3QgZmV0Y2hNb3JlUm93cyA9IChwYWdlPzogbnVtYmVyKSA9PiB7XG4gICAgaWYgKHBhZ2UpIHtcbiAgICAgIHNldEZldGNoZWRSb3dzKChwcmV2U3RhdGU6IGFueSkgPT4gKFsuLi5wcmV2U3RhdGUsIC4uLmZpbHRlcmVkUm93cy5zbGljZShwYWdlICogcm93c1RvRmV0Y2gsIHBhZ2UgKiByb3dzVG9GZXRjaCArIHJvd3NUb0ZldGNoKV0pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0RmV0Y2hlZFJvd3MoKHByZXZTdGF0ZTogYW55KSA9PiAoWy4uLnByZXZTdGF0ZSwgLi4uZmlsdGVyZWRSb3dzLnNsaWNlKGN1cnJlbnRQYWdlICogcm93c1RvRmV0Y2gsIGN1cnJlbnRQYWdlICogcm93c1RvRmV0Y2ggKyByb3dzVG9GZXRjaCldKSk7XG4gICAgICBzZXRDdXJyZW50UGFnZShjdXJyZW50UGFnZSArIDEpO1xuICAgIH1cbiAgfTtcbiAgXG4gIC8vIGNvbnNvbGUubG9nKGZldGNoZWRSb3dzKTtcbiAgLy8gY29uc29sZS5sb2coY29sdW1uTmFtZXNTdGF0ZSk7XG4gIHJldHVybiAhZmV0Y2hlZFJvd3MgPyBudWxsIDogKFxuICAgIDw+XG4gICAgICA8ZGl2IGlkPVwia2llLWdyaWRcIiBjbGFzc05hbWU9XCJraWUtZ3JpZFwiIHJlZj17ZWRpdG9yUmVmfT5cbiAgICAgICAge2NvbHVtbkRlZnNTdGF0ZS5vdGhlci5tYXAoKG90aGVyOiB7IG5hbWU6IHN0cmluZyB9LCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJraWUtZ3JpZF9faXRlbSBraWUtZ3JpZF9fbnVtYmVyXCIga2V5PVwib3RoZXItbnVtYmVyXCI+e290aGVyLm5hbWV9PC9kaXY+XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwia2llLWdyaWRfX2l0ZW0ga2llLWdyaWRfX2Rlc2NyaXB0aW9uXCIga2V5PVwib3RoZXItZGVzY3JpcHRpb25cIj57b3RoZXIubmFtZX08L2Rpdj5cbiAgICAgICAgICAgIClcbiAgICAgICAgICB9XG4gICAgICAgIH0pfVxuICAgICAgICB7LyogVGhlIEdJVkVOIGFuZCBFWFBFQ1QgZ3JvdXBzIGFyZSBhbHdheXMgdGhlcmUgc28gdGhpcyBjYW4gYmUgaGFyZGNvZGVkICovfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImtpZS1ncmlkX19oZWFkZXItLWdpdmVuXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJraWUtZ3JpZF9faXRlbSBraWUtZ3JpZF9fZ2l2ZW5cIj5HSVZFTjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJraWUtZ3JpZF9faGVhZGVyLS1leHBlY3RcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImtpZS1ncmlkX19pdGVtIGtpZS1ncmlkX19leHBlY3RcIj5FWFBFQ1Q8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgey8qIDwhLS0gZ3JpZCBpbnN0YW5jZSBoZWFkZXJzIG5lZWQgdG8gaGF2ZSBhIGdyaWQtY29sdW1uIHNwYW4gc2V0IC0tPiAqL31cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJraWUtZ3JpZF9faGVhZGVyLS1naXZlblwiPlxuICAgICAgICAgIHtjb2x1bW5EZWZzU3RhdGUuZ2l2ZW4ubWFwKChnaXZlbjogYW55LCBpbmRleDogbnVtYmVyKSA9PiAoXG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgIGtleT17YGdpdmVuIGluc3RhbmNlICR7aW5kZXh9YH1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwia2llLWdyaWRfX2l0ZW0ga2llLWdyaWRfX2luc3RhbmNlXCJcbiAgICAgICAgICAgICAgc3R5bGU9e3sgZ3JpZENvbHVtbjogYHNwYW4gJHtnaXZlbi5jaGlsZHJlbi5sZW5ndGh9YCB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7Z2l2ZW4uZ3JvdXB9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJraWUtZ3JpZF9faGVhZGVyLS1leHBlY3RcIj5cbiAgICAgICAgICB7Y29sdW1uRGVmc1N0YXRlLmV4cGVjdC5tYXAoKGV4cGVjdDogYW55LCBpbmRleDogbnVtYmVyKSA9PiAoXG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgIGtleT17YGV4cGVjdCBpbnN0YW5jZSAke2luZGV4fWB9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImtpZS1ncmlkX19pdGVtIGtpZS1ncmlkX19pbnN0YW5jZVwiXG4gICAgICAgICAgICAgIHN0eWxlPXt7IGdyaWRDb2x1bW46IGBzcGFuICR7ZXhwZWN0LmNoaWxkcmVuLmxlbmd0aH1gIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHtleHBlY3QuZ3JvdXB9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJraWUtZ3JpZF9faGVhZGVyLS1naXZlblwiPlxuICAgICAgICAgIHtjb2x1bW5EZWZzU3RhdGUuZ2l2ZW4ubWFwKChnaXZlbjogYW55LCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZ2l2ZW4uY2hpbGRyZW4ubWFwKChnaXZlbkNoaWxkOiBhbnksIGluZGV4OiBudW1iZXIpID0+IChcbiAgICAgICAgICAgICAgPGRpdiBrZXk9e2BnaXZlbiBwcm9wZXJ0eSAke2luZGV4fWB9IGNsYXNzTmFtZT1cImtpZS1ncmlkX19pdGVtIGtpZS1ncmlkX19wcm9wZXJ0eVwiPntnaXZlbkNoaWxkLm5hbWV9PC9kaXY+XG4gICAgICAgICAgICApKTtcbiAgICAgICAgICB9KX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwia2llLWdyaWRfX2hlYWRlci0tZXhwZWN0XCI+XG4gICAgICAgICAge2NvbHVtbkRlZnNTdGF0ZS5leHBlY3QubWFwKChleHBlY3Q6IGFueSwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGV4cGVjdC5jaGlsZHJlbi5tYXAoKGV4cGVjdENoaWxkOiBhbnksIGluZGV4OiBudW1iZXIpID0+IChcbiAgICAgICAgICAgICAgPGRpdiBrZXk9e2BleHBlY3QgcHJvcGVydHkgJHtpbmRleH1gfSBjbGFzc05hbWU9XCJraWUtZ3JpZF9faXRlbSBraWUtZ3JpZF9fcHJvcGVydHlcIj57ZXhwZWN0Q2hpbGQubmFtZX08L2Rpdj5cbiAgICAgICAgICAgICkpO1xuICAgICAgICAgIH0pfVxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImtpZS1ncmlkX19ib2R5XCI+XG4gICAgICAgICAgPEluZmluaXRlU2Nyb2xsXG4gICAgICAgICAgICBkYXRhTGVuZ3RoPXtmZXRjaGVkUm93cy5sZW5ndGh9XG4gICAgICAgICAgICBuZXh0PXtmZXRjaE1vcmVSb3dzfVxuICAgICAgICAgICAgaGFzTW9yZT17ZmV0Y2hlZFJvd3MubGVuZ3RoIDwgZmlsdGVyZWRSb3dzLmxlbmd0aH1cbiAgICAgICAgICAgIGxvYWRlcj17PFNwaW5uZXIgY2xhc3NOYW1lPVwia2llLWdyaWRfX2l0ZW0ga2llLWdyaWRfX2l0ZW0tLWxvYWRpbmcgcGYtdS1wdC1zbVwiIHNpemU9XCJtZFwiIC8+fVxuICAgICAgICAgICAgc2Nyb2xsYWJsZVRhcmdldD1cInNjZS1zaW0tZ3JpZF9fbWFpblwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgICB7ZmV0Y2hlZFJvd3MubWFwKChyb3c6IGFueSwgcm93SW5kZXg6IG51bWJlcikgPT4gKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwia2llLWdyaWRfX3J1bGVcIiBzdHlsZT17e319IGtleT17YHJvdyAke3Jvd1swXS52YWx1ZX1gfT5cbiAgICAgICAgICAgICAgICAgIHtyb3cubWFwKChjZWxsOiBhbnksIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZ2V0IHRoZSB0eXBlIG9mIHRoZSBjb2x1bW4gdG8gcGFzcyBvbiB0byB0aGUgaW5wdXQgZm9yIGZvcm1hdHRpbmcgLyB2YWxpZGF0aW9uXG4gICAgICAgICAgICAgICAgICAgIGxldCB0eXBlID0gJ3N0cmluZyc7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjb2x1bW5Hcm91cCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBsZXQgY29sdW1uTmFtZSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAvLyByb3cgaW5kZXhcbiAgICAgICAgICAgICAgICAgICAgICB0eXBlID0gJ251bWJlcic7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5kZXggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAvLyBkZXNjcmlwdGlvblxuICAgICAgICAgICAgICAgICAgICAgIHR5cGUgPSAnc3RyaW5nJztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbmRleCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5Hcm91cCA9IGNvbHVtbk5hbWVzU3RhdGVbaW5kZXhdLmdyb3VwO1xuICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbk5hbWUgPSBjb2x1bW5OYW1lc1N0YXRlW2luZGV4XS5uYW1lO1xuICAgICAgICAgICAgICAgICAgICAgIHR5cGUgPSAoZGVmaW5pdGlvbnNTdGF0ZS5tYXBbY29sdW1uTmFtZXNTdGF0ZVtpbmRleF0uZ3JvdXBdICYmIGRlZmluaXRpb25zU3RhdGUubWFwW2NvbHVtbkdyb3VwXVtjb2x1bW5OYW1lXSkgfHwgJ3N0cmluZyc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2VsbEluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gY2VsbCAmJiBjZWxsLnZhbHVlID8gY2VsbC52YWx1ZSA6ICcnO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXRoID0gY2VsbCAmJiBjZWxsLnBhdGggPyBjZWxsLnBhdGggOiAnJztcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc3QgY2VsbElkID0gYGNlbGwgJHtjZWxsSW5kZXh9YDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5wdXRJZCA9IGByb3cgJHtyb3dJbmRleH0gY29sdW1uICR7Y2VsbEluZGV4fWA7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjb21wb25lbnQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHR5cGVBcnIgPSB0eXBlLnNwbGl0KCcsJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlQXJyLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAvLyBNdWx0aXBsZSBvcHRpb25zLCByZW5kZXIgU2VsZWN0XG4gICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50ID0gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPFNlbGVjdCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaXNSZWFkT25seT17aW5wdXRJZCAhPT0gZWRpdGFibGVDZWxsfSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9e2lucHV0SWR9IFxuICAgICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbFZhbHVlPXt2YWx1ZX0gICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICBvblNlbGVjdFRvZ2dsZUNhbGxiYWNrPXtvblNlbGVjdFRvZ2dsZUNhbGxiYWNrfSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucz17dHlwZUFyci5tYXAoc3RyaW5nID0+IHN0cmluZy50cmltKCkpfSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGVhY3RpdmF0ZUFuZEZvY3VzQ2VsbD17ZGVhY3RpdmF0ZUFuZEZvY3VzQ2VsbH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0RWRpdGFibGU9e3NldEVkaXRhYmxlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBvblNhdmU9e29uU2F2ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQgPSAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8SW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaXNSZWFkT25seT17aW5wdXRJZCAhPT0gZWRpdGFibGVDZWxsfSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9e2lucHV0SWR9IFxuICAgICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbFZhbHVlPXt2YWx1ZX0gXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg9e3BhdGh9IFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPXt0eXBlfSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGVhY3RpdmF0ZUFuZEZvY3VzQ2VsbD17ZGVhY3RpdmF0ZUFuZEZvY3VzQ2VsbH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0RWRpdGFibGU9e3NldEVkaXRhYmxlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBvblNhdmU9e29uU2F2ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwia2llLWdyaWRfX2l0ZW1cIiBrZXk9e2lucHV0SWR9IG9uQ2xpY2s9e29uQ2VsbENsaWNrfSBvbkRvdWJsZUNsaWNrPXtvbkNlbGxEb3VibGVDbGlja30+XG4gICAgICAgICAgICAgICAgICAgICAgICB7Y2VsbEluZGV4ID09PSAwID8gdmFsdWUgOiBjb21wb25lbnR9XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICA8L0luZmluaXRlU2Nyb2xsPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvPlxuICApO1xufSwgKHByZXZQcm9wcywgbmV4dFByb3BzKSA9PiB7XG4gIGlmIChwcmV2UHJvcHMubGFzdEZvcmNlZFVwZGF0ZSAhPT0gbmV4dFByb3BzLmxhc3RGb3JjZWRVcGRhdGUpIHtcbiAgICBjb25zb2xlLmxvZygnZm9yY2VkIEVkaXRvciB1cGRhdGUnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKHByZXZQcm9wcy5maWx0ZXJlZFJvd3MubGVuZ3RoICE9PSBuZXh0UHJvcHMuZmlsdGVyZWRSb3dzLmxlbmd0aCB8fCBKU09OLnN0cmluZ2lmeShwcmV2UHJvcHMuZmlsdGVyZWRSb3dzKSAhPT0gSlNPTi5zdHJpbmdpZnkobmV4dFByb3BzLmZpbHRlcmVkUm93cykpIHtcbiAgICAvLyBmaWx0ZXJlZFJvd3MgaGF2ZSBjaGFuZ2VkLCByZS1yZW5kZXJcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59KTtcblxuLy8gQHRzLWlnbm9yZVxuRWRpdG9yLndoeURpZFlvdVJlbmRlciA9IHtcbiAgY3VzdG9tTmFtZTogJ0VkaXRvcidcbn07XG5cbmV4cG9ydCB7IEVkaXRvciB9O1xuIl19
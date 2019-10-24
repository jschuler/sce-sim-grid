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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvY29tcG9uZW50cy9FZGl0b3IvRWRpdG9yLnRzeCJdLCJuYW1lcyI6WyJFZGl0b3IiLCJSZWFjdCIsIm1lbW8iLCJjb2x1bW5EZWZzIiwiY29sdW1ucyIsImZpbHRlcmVkUm93cyIsImRlZmluaXRpb25zIiwiY29sdW1uTmFtZXMiLCJvblNhdmUiLCJvblVuZG8iLCJvblJlZG8iLCJsYXN0Rm9yY2VkVXBkYXRlIiwicmVhZE9ubHkiLCJjb25zb2xlIiwibG9nIiwicm93c1RvRmV0Y2giLCJ1c2VTdGF0ZSIsImVkaXRhYmxlQ2VsbCIsInNldEVkaXRhYmxlIiwiZXhwYW5kZWRTZWxlY3QiLCJzZXRFeHBhbmRlZFNlbGVjdCIsImN1cnJlbnRQYWdlIiwic2V0Q3VycmVudFBhZ2UiLCJjb2x1bW5EZWZzU3RhdGUiLCJzZXRDb2x1bW5EZWZzU3RhdGUiLCJzbGljZSIsImZldGNoZWRSb3dzIiwic2V0RmV0Y2hlZFJvd3MiLCJkZWZpbml0aW9uc1N0YXRlIiwic2V0RGVmaW5pdGlvbnNTdGF0ZSIsImNvbHVtbk5hbWVzU3RhdGUiLCJzZXRDb2x1bW5OYW1lc1N0YXRlIiwibGFzdEZvcmNlZFVwZGF0ZVN0YXRlIiwic2V0TGFzdEZvcmNlZFVwZGF0ZVN0YXRlIiwiZWRpdG9yUmVmIiwidXNlUmVmIiwidXNlRWZmZWN0Iiwic2V0VGltZW91dCIsInNldE51bUdpdmVuQ29sdW1ucyIsIm51bUdpdmVuIiwic2V0TnVtRXhwZWN0Q29sdW1ucyIsIm51bUV4cGVjdCIsIkpTT04iLCJzdHJpbmdpZnkiLCJudW0iLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwic3R5bGUiLCJzZXRQcm9wZXJ0eSIsInRvU3RyaW5nIiwiYWN0aXZhdGVDZWxsIiwiaWQiLCJkZWFjdGl2YXRlQ2VsbCIsImFjdGl2YXRlQW5kRm9jdXNDZWxsIiwiZGVhY3RpdmF0ZUFuZEZvY3VzQ2VsbCIsIm9uQ2VsbENsaWNrIiwiZXZlbnQiLCJ0YXJnZXQiLCJvbkNlbGxEb3VibGVDbGljayIsIm9uRW50ZXIiLCJzdG9wUHJvcGFnYXRpb24iLCJvblVwS2V5UHJlc3MiLCJhY3RpdmVFbGVtZW50IiwiZ2V0QXR0cmlidXRlIiwiY3VycmVudElkIiwibWluUm93IiwidGFyZ2V0SWQiLCJjdXJyZW50SWRBcnIiLCJzcGxpdCIsImN1cnJlbnRSb3ciLCJOdW1iZXIiLCJwYXJzZUludCIsIm5ld1JvdyIsIm9uRG93bktleVByZXNzIiwibWF4Um93IiwibGVuZ3RoIiwib25MZWZ0S2V5UHJlc3MiLCJtaW5Db2wiLCJjdXJyZW50Q29sIiwibmV3Q29sIiwib25SaWdodEtleVByZXNzIiwibWF4Q29sIiwib25Db3B5IiwiY29weVRleHQiLCJzZWxlY3QiLCJzZXRTZWxlY3Rpb25SYW5nZSIsImV4ZWNDb21tYW5kIiwid2l0aE1vZGlmaWVyIiwiaXNBY3RpdmUiLCJ3aXRoU2hpZnQiLCJvblNlbGVjdFRvZ2dsZUNhbGxiYWNrIiwiaXNFeHBhbmRlZCIsImZldGNoTW9yZVJvd3MiLCJwYWdlIiwicHJldlN0YXRlIiwib3RoZXIiLCJtYXAiLCJpbmRleCIsIm5hbWUiLCJnaXZlbiIsImdyaWRDb2x1bW4iLCJjaGlsZHJlbiIsImdyb3VwIiwiZXhwZWN0IiwiZ2l2ZW5DaGlsZCIsImV4cGVjdENoaWxkIiwicm93Iiwicm93SW5kZXgiLCJ2YWx1ZSIsImNlbGwiLCJ0eXBlIiwiY29sdW1uR3JvdXAiLCJjb2x1bW5OYW1lIiwiY2VsbEluZGV4IiwicGF0aCIsImlucHV0SWQiLCJjb21wb25lbnQiLCJ0eXBlQXJyIiwic3RyaW5nIiwidHJpbSIsInByZXZQcm9wcyIsIm5leHRQcm9wcyIsIndoeURpZFlvdVJlbmRlciIsImN1c3RvbU5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsTUFBTSxHQUFHQyxLQUFLLENBQUNDLElBQU4sQ0FVWixnQkFVRztBQUFBLE1BVEtDLFVB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LFNBQVMsQ0FBQ3BILFlBQXpCLENBQWxILEVBQTBKO0FBQ3hKO0FBQ0EsV0FBTyxLQUFQO0FBQ0Q7O0FBQ0QsU0FBTyxJQUFQO0FBQ0QsQ0FqYmMsQ0FBZixDLENBbWJBOzs7QUFDQUwsTUFBTSxDQUFDMEgsZUFBUCxHQUF5QjtBQUN2QkMsRUFBQUEsVUFBVSxFQUFFO0FBRFcsQ0FBekIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VLZXlQcmVzcywgc2V0Q2FyZXRQb3NpdGlvbkF0RW5kLCBmb2N1c0NlbGwgfSBmcm9tIFwiLi4vdXRpbHNcIjtcbmltcG9ydCBJbmZpbml0ZVNjcm9sbCBmcm9tICdyZWFjdC1pbmZpbml0ZS1zY3JvbGwtY29tcG9uZW50JztcbmltcG9ydCB7IFNwaW5uZXIgfSBmcm9tICcuLi9TcGlubmVyJztcbmltcG9ydCB7IElucHV0LCBTZWxlY3QgfSBmcm9tICcuLi9DZWxsJztcbmltcG9ydCBcIi4vRWRpdG9yLmNzc1wiO1xuXG5jb25zdCBFZGl0b3IgPSBSZWFjdC5tZW1vPHsgXG4gIGNvbHVtbnM6IGFueSwgXG4gIGZpbHRlcmVkUm93cyA6IGFueSwgXG4gIGRlZmluaXRpb25zOiBhbnksIFxuICBjb2x1bW5OYW1lczogYW55LFxuICBvblNhdmU6IGFueSxcbiAgb25VbmRvOiBhbnksXG4gIG9uUmVkbzogYW55LFxuICBsYXN0Rm9yY2VkVXBkYXRlOiBzdHJpbmcsXG4gIHJlYWRPbmx5OiBib29sZWFuXG59PigoeyBcbiAgY29sdW1uczogY29sdW1uRGVmcywgXG4gIGZpbHRlcmVkUm93cywgXG4gIGRlZmluaXRpb25zLCBcbiAgY29sdW1uTmFtZXMsXG4gIG9uU2F2ZSxcbiAgb25VbmRvLFxuICBvblJlZG8sXG4gIGxhc3RGb3JjZWRVcGRhdGUsXG4gIHJlYWRPbmx5XG59KSA9PiB7XG4gIGNvbnNvbGUubG9nKCdyZW5kZXIgRWRpdG9yJyk7XG5cbiAgY29uc3Qgcm93c1RvRmV0Y2ggPSA1MDtcblxuICBjb25zdCBbZWRpdGFibGVDZWxsLCBzZXRFZGl0YWJsZV0gPSBSZWFjdC51c2VTdGF0ZTxzdHJpbmc+KCcnKTtcbiAgY29uc3QgW2V4cGFuZGVkU2VsZWN0LCBzZXRFeHBhbmRlZFNlbGVjdF0gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtjdXJyZW50UGFnZSwgc2V0Q3VycmVudFBhZ2VdID0gUmVhY3QudXNlU3RhdGUoMSk7XG5cbiAgLy8gc3RhdGUgZnJvbSBwcm9wc1xuICBjb25zdCBbY29sdW1uRGVmc1N0YXRlLCBzZXRDb2x1bW5EZWZzU3RhdGVdID0gUmVhY3QudXNlU3RhdGUoY29sdW1uRGVmcyk7XG4gIGNvbnN0IFtmZXRjaGVkUm93cywgc2V0RmV0Y2hlZFJvd3NdID0gUmVhY3QudXNlU3RhdGUoZmlsdGVyZWRSb3dzLnNsaWNlKDAsIHJvd3NUb0ZldGNoKSk7XG4gIGNvbnN0IFtkZWZpbml0aW9uc1N0YXRlLCBzZXREZWZpbml0aW9uc1N0YXRlXSA9IFJlYWN0LnVzZVN0YXRlKGRlZmluaXRpb25zKTtcbiAgY29uc3QgW2NvbHVtbk5hbWVzU3RhdGUsIHNldENvbHVtbk5hbWVzU3RhdGVdID0gUmVhY3QudXNlU3RhdGUoY29sdW1uTmFtZXMpO1xuICBjb25zdCBbbGFzdEZvcmNlZFVwZGF0ZVN0YXRlLCBzZXRMYXN0Rm9yY2VkVXBkYXRlU3RhdGVdID0gUmVhY3QudXNlU3RhdGUobGFzdEZvcmNlZFVwZGF0ZSk7XG5cbiAgY29uc3QgZWRpdG9yUmVmID0gUmVhY3QudXNlUmVmKG51bGwpO1xuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBzZXROdW1HaXZlbkNvbHVtbnMoY29sdW1uRGVmcy5udW1HaXZlbik7XG4gICAgICBzZXROdW1FeHBlY3RDb2x1bW5zKGNvbHVtbkRlZnMubnVtRXhwZWN0KTtcbiAgICB9LCAxKVxuICB9LCBbY29sdW1uRGVmc10pO1xuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgLy8gcmVuZGVyIGRlcGVuZHMgb24gdXBkYXRlZCB2YWx1ZSBvZiBmZXRjaGVkUm93c1xuICAgIGlmIChKU09OLnN0cmluZ2lmeShjb2x1bW5EZWZzU3RhdGUpICE9PSBKU09OLnN0cmluZ2lmeShjb2x1bW5EZWZzKSkge1xuICAgICAgc2V0Q29sdW1uRGVmc1N0YXRlKGNvbHVtbkRlZnMpO1xuICAgIH1cbiAgICBpZiAobGFzdEZvcmNlZFVwZGF0ZVN0YXRlICE9PSBsYXN0Rm9yY2VkVXBkYXRlIHx8IEpTT04uc3RyaW5naWZ5KGZldGNoZWRSb3dzKSAhPT0gSlNPTi5zdHJpbmdpZnkoZmlsdGVyZWRSb3dzLnNsaWNlKDAsIHJvd3NUb0ZldGNoKSkpIHtcbiAgICAgIHNldEZldGNoZWRSb3dzKGZpbHRlcmVkUm93cy5zbGljZSgwLCByb3dzVG9GZXRjaCkpO1xuICAgIH1cbiAgICBpZiAoSlNPTi5zdHJpbmdpZnkoZGVmaW5pdGlvbnNTdGF0ZSkgIT09IEpTT04uc3RyaW5naWZ5KGRlZmluaXRpb25zKSkge1xuICAgICAgc2V0RGVmaW5pdGlvbnNTdGF0ZShkZWZpbml0aW9ucyk7XG4gICAgfVxuICAgIGlmIChKU09OLnN0cmluZ2lmeShjb2x1bW5OYW1lc1N0YXRlKSAhPT0gSlNPTi5zdHJpbmdpZnkoY29sdW1uTmFtZXMpKSB7XG4gICAgICBzZXRDb2x1bW5OYW1lc1N0YXRlKGNvbHVtbk5hbWVzKTtcbiAgICB9XG4gIH0sIFtjb2x1bW5EZWZzLCBmaWx0ZXJlZFJvd3MsIGRlZmluaXRpb25zLCBjb2x1bW5OYW1lcywgbGFzdEZvcmNlZFVwZGF0ZV0pO1xuXG4gIGNvbnN0IHNldE51bUdpdmVuQ29sdW1ucyA9IChudW06IG51bWJlcikgPT4ge1xuICAgIGRvY3VtZW50XG4gICAgICAuZ2V0RWxlbWVudEJ5SWQoXCJraWUtZ3JpZFwiKSFcbiAgICAgIC5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tbnVtLWdpdmVuLWNvbHVtbnNcIiwgbnVtLnRvU3RyaW5nKCkpO1xuICB9O1xuXG4gIGNvbnN0IHNldE51bUV4cGVjdENvbHVtbnMgPSAobnVtOiBudW1iZXIpID0+IHtcbiAgICBkb2N1bWVudFxuICAgICAgLmdldEVsZW1lbnRCeUlkKFwia2llLWdyaWRcIikhXG4gICAgICAuc3R5bGUuc2V0UHJvcGVydHkoXCItLW51bS1leHBlY3QtY29sdW1uc1wiLCBudW0udG9TdHJpbmcoKSk7XG4gIH07XG5cbiAgY29uc3QgYWN0aXZhdGVDZWxsID0gKGlkOiBzdHJpbmcpID0+IHtcbiAgICBpZiAoaWQpIHtcbiAgICAgIHNldEVkaXRhYmxlKGlkKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBkZWFjdGl2YXRlQ2VsbCA9ICgpID0+IHtcbiAgICBzZXRFZGl0YWJsZSgnJyk7XG4gIH1cblxuICBjb25zdCBhY3RpdmF0ZUFuZEZvY3VzQ2VsbCA9IChpZDogc3RyaW5nKSA9PiB7XG4gICAgYWN0aXZhdGVDZWxsKGlkKTtcbiAgICBmb2N1c0NlbGwoaWQpO1xuICB9XG5cbiAgY29uc3QgZGVhY3RpdmF0ZUFuZEZvY3VzQ2VsbCA9IChpZDogc3RyaW5nKSA9PiB7XG4gICAgZGVhY3RpdmF0ZUNlbGwoKTsgLy8gZXhwZW5zaXZlLCBjYXVzZXMgcmUtcmVuZGVycz9cbiAgICBmb2N1c0NlbGwoaWQpO1xuICB9XG5cbiAgY29uc3Qgb25DZWxsQ2xpY2sgPSAoZXZlbnQ6IGFueSkgPT4ge1xuICAgIGNvbnN0IHsgaWQgfSA9IGV2ZW50LnRhcmdldDtcbiAgICBpZiAoaWQgPT09IGVkaXRhYmxlQ2VsbCkge1xuICAgICAgLy8gYWxyZWFkeSBhY3RpdmVcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoZWRpdGFibGVDZWxsKSB7XG4gICAgICAvLyBnZXQgb3V0IG9mIGEgcHJldmlvdXMgY2VsbCBlZGl0aW5nIG1vZGVcbiAgICAgIGRlYWN0aXZhdGVDZWxsKCk7XG4gICAgfVxuICAgIHJldHVybiBpZDtcbiAgfTtcblxuICAvKipcbiAgICogRW50ZXIgZWRpdGluZyBtb2RlXG4gICAqL1xuICBjb25zdCBvbkNlbGxEb3VibGVDbGljayA9IChldmVudDogYW55KSA9PiB7XG4gICAgaWYgKHJlYWRPbmx5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGlkID0gb25DZWxsQ2xpY2soZXZlbnQpO1xuICAgIGlmIChpZCkge1xuICAgICAgYWN0aXZhdGVBbmRGb2N1c0NlbGwoaWQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFbnRlciBlZGl0aW5nIG1vZGVcbiAgICovXG4gIGNvbnN0IG9uRW50ZXIgPSAoZXZlbnQ6IGFueSkgPT4ge1xuICAgIC8vIGRvbid0IHdhbnQgSW5wdXQncyBvbkVudGVyIGxpc3RlbmVyIHRvIGZpcmVcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBvbkNlbGxEb3VibGVDbGljayhldmVudCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFVwIGFycm93IGtleVxuICAgKi9cbiAgY29uc3Qgb25VcEtleVByZXNzID0gKGV2ZW50OiBhbnkpID0+IHtcbiAgICBjb25zdCBhY3RpdmVFbGVtZW50ID0gKGRvY3VtZW50ICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lkJykpIHx8ICcnO1xuICAgIGlmIChleHBhbmRlZFNlbGVjdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoZWRpdGFibGVDZWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGN1cnJlbnRJZCA9IGFjdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3QgbWluUm93ID0gMDtcbiAgICBsZXQgdGFyZ2V0SWQ7XG4gICAgaWYgKGN1cnJlbnRJZCkge1xuICAgICAgLy8gWydyb3cnLCAnMScsICdjb2x1bW4nLCAnMiddXG4gICAgICBjb25zdCBjdXJyZW50SWRBcnI6IHN0cmluZ1tdID0gY3VycmVudElkLnNwbGl0KCcgJyk7XG4gICAgICBjb25zdCBjdXJyZW50Um93ID0gTnVtYmVyLnBhcnNlSW50KGN1cnJlbnRJZEFyclsxXSk7XG4gICAgICAvLyBnb2luZyB1cCBtZWFucyBkZWNyZW1lbnRpbmcgdGhlIHJvd1xuICAgICAgY29uc3QgbmV3Um93ID0gY3VycmVudFJvdyAtIDE7XG4gICAgICBpZiAobmV3Um93IDwgbWluUm93KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldElkID0gYHJvdyAke25ld1Jvd30gY29sdW1uICR7Y3VycmVudElkQXJyWzNdfWA7XG4gICAgICAgIGZvY3VzQ2VsbCh0YXJnZXRJZCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBEb3duIGFycm93IGtleVxuICAgKi9cbiAgY29uc3Qgb25Eb3duS2V5UHJlc3MgPSAoZXZlbnQ6IGFueSkgPT4ge1xuICAgIGNvbnN0IGFjdGl2ZUVsZW1lbnQgPSAoZG9jdW1lbnQgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmdldEF0dHJpYnV0ZSgnaWQnKSkgfHwgJyc7XG4gICAgaWYgKGV4cGFuZGVkU2VsZWN0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChlZGl0YWJsZUNlbGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgY3VycmVudElkID0gYWN0aXZlRWxlbWVudDtcbiAgICBjb25zdCBtYXhSb3cgPSBmaWx0ZXJlZFJvd3MubGVuZ3RoIC0gMTtcbiAgICBsZXQgdGFyZ2V0SWQ7XG4gICAgaWYgKGN1cnJlbnRJZCkge1xuICAgICAgLy8gWydyb3cnLCAnMScsICdjb2x1bW4nLCAnMiddXG4gICAgICBjb25zdCBjdXJyZW50SWRBcnI6IHN0cmluZ1tdID0gY3VycmVudElkLnNwbGl0KCcgJyk7XG4gICAgICBjb25zdCBjdXJyZW50Um93ID0gTnVtYmVyLnBhcnNlSW50KGN1cnJlbnRJZEFyclsxXSk7XG4gICAgICAvLyBnb2luZyBkb3duIG1lYW5zIGluY3JlbWVudGluZyB0aGUgcm93XG4gICAgICBjb25zdCBuZXdSb3cgPSBjdXJyZW50Um93ICsgMTtcbiAgICAgIGlmIChuZXdSb3cgPiBtYXhSb3cpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFyZ2V0SWQgPSBgcm93ICR7bmV3Um93fSBjb2x1bW4gJHtjdXJyZW50SWRBcnJbM119YDtcbiAgICAgICAgZm9jdXNDZWxsKHRhcmdldElkKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIExlZnQgYXJyb3cga2V5XG4gICAqL1xuICBjb25zdCBvbkxlZnRLZXlQcmVzcyA9IChldmVudDogYW55KSA9PiB7XG4gICAgY29uc3QgYWN0aXZlRWxlbWVudCA9IChkb2N1bWVudCAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpZCcpKSB8fCAnJztcbiAgICBpZiAoZXhwYW5kZWRTZWxlY3QpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGVkaXRhYmxlQ2VsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBjdXJyZW50SWQgPSBhY3RpdmVFbGVtZW50O1xuICAgIGNvbnN0IG1pbkNvbCA9IDE7XG4gICAgbGV0IHRhcmdldElkO1xuICAgIGlmIChjdXJyZW50SWQpIHtcbiAgICAgIC8vIFsncm93JywgJzEnLCAnY29sdW1uJywgJzInXVxuICAgICAgY29uc3QgY3VycmVudElkQXJyOiBzdHJpbmdbXSA9IGN1cnJlbnRJZC5zcGxpdCgnICcpO1xuICAgICAgY29uc3QgY3VycmVudENvbCA9IE51bWJlci5wYXJzZUludChjdXJyZW50SWRBcnJbM10pO1xuICAgICAgLy8gZ29pbmcgbGVmdCBtZWFucyBkZWNyZW1lbnRpbmcgdGhlIGNvbHVtblxuICAgICAgY29uc3QgbmV3Q29sID0gY3VycmVudENvbCAtIDE7XG4gICAgICBpZiAobmV3Q29sIDwgbWluQ29sKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldElkID0gYHJvdyAke2N1cnJlbnRJZEFyclsxXX0gY29sdW1uICR7bmV3Q29sfWA7XG4gICAgICAgIGZvY3VzQ2VsbCh0YXJnZXRJZCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBSaWdodCBhcnJvdyBrZXlcbiAgICovXG4gIGNvbnN0IG9uUmlnaHRLZXlQcmVzcyA9IChldmVudDogYW55KSA9PiB7XG4gICAgY29uc3QgYWN0aXZlRWxlbWVudCA9IChkb2N1bWVudCAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpZCcpKSB8fCAnJztcbiAgICBpZiAoZXhwYW5kZWRTZWxlY3QpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGVkaXRhYmxlQ2VsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBjdXJyZW50SWQgPSBhY3RpdmVFbGVtZW50O1xuICAgIGNvbnN0IG1heENvbCA9IGNvbHVtbkRlZnMubnVtR2l2ZW4gKyBjb2x1bW5EZWZzLm51bUV4cGVjdCArIDE7XG4gICAgbGV0IHRhcmdldElkO1xuICAgIGlmIChjdXJyZW50SWQpIHtcbiAgICAgIC8vIFsncm93JywgJzEnLCAnY29sdW1uJywgJzInXVxuICAgICAgY29uc3QgY3VycmVudElkQXJyOiBzdHJpbmdbXSA9IGN1cnJlbnRJZC5zcGxpdCgnICcpO1xuICAgICAgY29uc3QgY3VycmVudENvbCA9IE51bWJlci5wYXJzZUludChjdXJyZW50SWRBcnJbM10pO1xuICAgICAgLy8gZ29pbmcgcmlnaHQgbWVhbnMgaW5jcmVtZW50aW5nIHRoZSBjb2x1bW5cbiAgICAgIGNvbnN0IG5ld0NvbCA9IGN1cnJlbnRDb2wgKyAxO1xuICAgICAgaWYgKG5ld0NvbCA+IG1heENvbCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YXJnZXRJZCA9IGByb3cgJHtjdXJyZW50SWRBcnJbMV19IGNvbHVtbiAke25ld0NvbH1gO1xuICAgICAgICBmb2N1c0NlbGwodGFyZ2V0SWQpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQ29weSBjZWxsIGxpc3RlbmVyXG4gICAqL1xuICBjb25zdCBvbkNvcHkgPSAoZXZlbnQ6IGFueSkgPT4ge1xuICAgIC8qIEdldCB0aGUgdGV4dCBmaWVsZCAqL1xuICAgIGNvbnN0IGNvcHlUZXh0ID0gZXZlbnQudGFyZ2V0O1xuICAgIGlmIChjb3B5VGV4dCAmJiBjb3B5VGV4dC5zZWxlY3QpIHtcbiAgICAgIC8qIFNlbGVjdCB0aGUgdGV4dCBmaWVsZCAqL1xuICAgICAgY29weVRleHQuc2VsZWN0KCk7XG4gICAgICBjb3B5VGV4dC5zZXRTZWxlY3Rpb25SYW5nZSgwLCA5OTk5OSk7IC8qRm9yIG1vYmlsZSBkZXZpY2VzKi9cbiAgICAgIC8qIENvcHkgdGhlIHRleHQgaW5zaWRlIHRoZSB0ZXh0IGZpZWxkICovXG4gICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnY29weScpO1xuICAgICAgLy8gZG8gbm90IG1hcmsgdGhlIHdob2xlIHRleHQgYXMgc2VsZWN0ZWRcbiAgICAgIHNldENhcmV0UG9zaXRpb25BdEVuZChjb3B5VGV4dCk7XG4gICAgfVxuICB9O1xuXG4gIC8vIENvbW1hbmQgKyBDIC8gQ1RSTCArIEMgY29waWVzIHRoZSBmb2N1c2VkIGNlbGwgY29udGVudFxuICB1c2VLZXlQcmVzcygvYy9pLCBvbkNvcHksIHsgbG9nOiAnZWRpdG9yJywgd2l0aE1vZGlmaWVyOiB0cnVlIH0pO1xuICAvLyBDb21tYW5kICsgWiAvIENUUkwgKyBaIHVuZG8gdGhlIGxhc3QgY2hhbmdlXG4gIHVzZUtleVByZXNzKC96L2ksIG9uVW5kbywgeyBsb2c6ICdlZGl0b3InLCB3aXRoTW9kaWZpZXI6IHRydWUsIGlzQWN0aXZlOiAhcmVhZE9ubHkgfSk7XG4gIC8vIENvbW1hbmQgKyBTaGlmdCArIFogLyBDVFJMICsgU2hpZnQgKyBaIHVuZG8gdGhlIGxhc3QgY2hhbmdlXG4gIHVzZUtleVByZXNzKC96L2ksIG9uUmVkbywgeyBsb2c6ICdlZGl0b3InLCB3aXRoTW9kaWZpZXI6IHRydWUsIHdpdGhTaGlmdDogdHJ1ZSwgaXNBY3RpdmU6ICFyZWFkT25seSB9KTtcbiAgdXNlS2V5UHJlc3MoJ0VudGVyJywgb25FbnRlciwgeyBsb2c6ICdlZGl0b3InLCBpc0FjdGl2ZTogKCFlZGl0YWJsZUNlbGwgJiYgIXJlYWRPbmx5KSB9KTtcbiAgdXNlS2V5UHJlc3MoMzgsIG9uVXBLZXlQcmVzcywgeyBsb2c6ICdlZGl0b3InIH0pO1xuICB1c2VLZXlQcmVzcyg0MCwgb25Eb3duS2V5UHJlc3MsIHsgbG9nOiAnZWRpdG9yJyB9KTtcbiAgdXNlS2V5UHJlc3MoMzcsIG9uTGVmdEtleVByZXNzLCB7IGxvZzogJ2VkaXRvcicgfSk7XG4gIHVzZUtleVByZXNzKDM5LCBvblJpZ2h0S2V5UHJlc3MsIHsgbG9nOiAnZWRpdG9yJyB9KTtcblxuICBjb25zdCBvblNlbGVjdFRvZ2dsZUNhbGxiYWNrID0gKGlkOiBhbnksIGlzRXhwYW5kZWQ6IGJvb2xlYW4pID0+IHtcbiAgICBzZXRFeHBhbmRlZFNlbGVjdChpc0V4cGFuZGVkKTtcbiAgfTtcblxuICAvLyByb3dEYXRhXG4gIGNvbnN0IGZldGNoTW9yZVJvd3MgPSAocGFnZT86IG51bWJlcikgPT4ge1xuICAgIGlmIChwYWdlKSB7XG4gICAgICBzZXRGZXRjaGVkUm93cygocHJldlN0YXRlOiBhbnkpID0+IChbLi4ucHJldlN0YXRlLCAuLi5maWx0ZXJlZFJvd3Muc2xpY2UocGFnZSAqIHJvd3NUb0ZldGNoLCBwYWdlICogcm93c1RvRmV0Y2ggKyByb3dzVG9GZXRjaCldKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldEZldGNoZWRSb3dzKChwcmV2U3RhdGU6IGFueSkgPT4gKFsuLi5wcmV2U3RhdGUsIC4uLmZpbHRlcmVkUm93cy5zbGljZShjdXJyZW50UGFnZSAqIHJvd3NUb0ZldGNoLCBjdXJyZW50UGFnZSAqIHJvd3NUb0ZldGNoICsgcm93c1RvRmV0Y2gpXSkpO1xuICAgICAgc2V0Q3VycmVudFBhZ2UoY3VycmVudFBhZ2UgKyAxKTtcbiAgICB9XG4gIH07XG4gIFxuICAvLyBjb25zb2xlLmxvZyhmZXRjaGVkUm93cyk7XG4gIC8vIGNvbnNvbGUubG9nKGNvbHVtbk5hbWVzU3RhdGUpO1xuICByZXR1cm4gIWZldGNoZWRSb3dzID8gbnVsbCA6IChcbiAgICA8PlxuICAgICAgPGRpdiBpZD1cImtpZS1ncmlkXCIgY2xhc3NOYW1lPVwia2llLWdyaWRcIiByZWY9e2VkaXRvclJlZn0+XG4gICAgICAgIHtjb2x1bW5EZWZzU3RhdGUub3RoZXIubWFwKChvdGhlcjogeyBuYW1lOiBzdHJpbmcgfSwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwia2llLWdyaWRfX2l0ZW0ga2llLWdyaWRfX251bWJlclwiIGtleT1cIm90aGVyLW51bWJlclwiPntvdGhlci5uYW1lfTwvZGl2PlxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImtpZS1ncmlkX19pdGVtIGtpZS1ncmlkX19kZXNjcmlwdGlvblwiIGtleT1cIm90aGVyLWRlc2NyaXB0aW9uXCI+e290aGVyLm5hbWV9PC9kaXY+XG4gICAgICAgICAgICApXG4gICAgICAgICAgfVxuICAgICAgICB9KX1cbiAgICAgICAgey8qIFRoZSBHSVZFTiBhbmQgRVhQRUNUIGdyb3VwcyBhcmUgYWx3YXlzIHRoZXJlIHNvIHRoaXMgY2FuIGJlIGhhcmRjb2RlZCAqL31cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJraWUtZ3JpZF9faGVhZGVyLS1naXZlblwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwia2llLWdyaWRfX2l0ZW0ga2llLWdyaWRfX2dpdmVuXCI+R0lWRU48L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwia2llLWdyaWRfX2hlYWRlci0tZXhwZWN0XCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJraWUtZ3JpZF9faXRlbSBraWUtZ3JpZF9fZXhwZWN0XCI+RVhQRUNUPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIHsvKiA8IS0tIGdyaWQgaW5zdGFuY2UgaGVhZGVycyBuZWVkIHRvIGhhdmUgYSBncmlkLWNvbHVtbiBzcGFuIHNldCAtLT4gKi99XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwia2llLWdyaWRfX2hlYWRlci0tZ2l2ZW5cIj5cbiAgICAgICAgICB7Y29sdW1uRGVmc1N0YXRlLmdpdmVuLm1hcCgoZ2l2ZW46IGFueSwgaW5kZXg6IG51bWJlcikgPT4gKFxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICBrZXk9e2BnaXZlbiBpbnN0YW5jZSAke2luZGV4fWB9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImtpZS1ncmlkX19pdGVtIGtpZS1ncmlkX19pbnN0YW5jZVwiXG4gICAgICAgICAgICAgIHN0eWxlPXt7IGdyaWRDb2x1bW46IGBzcGFuICR7Z2l2ZW4uY2hpbGRyZW4ubGVuZ3RofWAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge2dpdmVuLmdyb3VwfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwia2llLWdyaWRfX2hlYWRlci0tZXhwZWN0XCI+XG4gICAgICAgICAge2NvbHVtbkRlZnNTdGF0ZS5leHBlY3QubWFwKChleHBlY3Q6IGFueSwgaW5kZXg6IG51bWJlcikgPT4gKFxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICBrZXk9e2BleHBlY3QgaW5zdGFuY2UgJHtpbmRleH1gfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJraWUtZ3JpZF9faXRlbSBraWUtZ3JpZF9faW5zdGFuY2VcIlxuICAgICAgICAgICAgICBzdHlsZT17eyBncmlkQ29sdW1uOiBgc3BhbiAke2V4cGVjdC5jaGlsZHJlbi5sZW5ndGh9YCB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7ZXhwZWN0Lmdyb3VwfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwia2llLWdyaWRfX2hlYWRlci0tZ2l2ZW5cIj5cbiAgICAgICAgICB7Y29sdW1uRGVmc1N0YXRlLmdpdmVuLm1hcCgoZ2l2ZW46IGFueSwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGdpdmVuLmNoaWxkcmVuLm1hcCgoZ2l2ZW5DaGlsZDogYW55LCBpbmRleDogbnVtYmVyKSA9PiAoXG4gICAgICAgICAgICAgIDxkaXYga2V5PXtgZ2l2ZW4gcHJvcGVydHkgJHtpbmRleH1gfSBjbGFzc05hbWU9XCJraWUtZ3JpZF9faXRlbSBraWUtZ3JpZF9fcHJvcGVydHlcIj57Z2l2ZW5DaGlsZC5uYW1lfTwvZGl2PlxuICAgICAgICAgICAgKSk7XG4gICAgICAgICAgfSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImtpZS1ncmlkX19oZWFkZXItLWV4cGVjdFwiPlxuICAgICAgICAgIHtjb2x1bW5EZWZzU3RhdGUuZXhwZWN0Lm1hcCgoZXhwZWN0OiBhbnksIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBleHBlY3QuY2hpbGRyZW4ubWFwKChleHBlY3RDaGlsZDogYW55LCBpbmRleDogbnVtYmVyKSA9PiAoXG4gICAgICAgICAgICAgIDxkaXYga2V5PXtgZXhwZWN0IHByb3BlcnR5ICR7aW5kZXh9YH0gY2xhc3NOYW1lPVwia2llLWdyaWRfX2l0ZW0ga2llLWdyaWRfX3Byb3BlcnR5XCI+e2V4cGVjdENoaWxkLm5hbWV9PC9kaXY+XG4gICAgICAgICAgICApKTtcbiAgICAgICAgICB9KX1cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJraWUtZ3JpZF9fYm9keVwiPlxuICAgICAgICAgIDxJbmZpbml0ZVNjcm9sbFxuICAgICAgICAgICAgZGF0YUxlbmd0aD17ZmV0Y2hlZFJvd3MubGVuZ3RofVxuICAgICAgICAgICAgbmV4dD17ZmV0Y2hNb3JlUm93c31cbiAgICAgICAgICAgIGhhc01vcmU9e2ZldGNoZWRSb3dzLmxlbmd0aCA8IGZpbHRlcmVkUm93cy5sZW5ndGh9XG4gICAgICAgICAgICBsb2FkZXI9ezxTcGlubmVyIGNsYXNzTmFtZT1cImtpZS1ncmlkX19pdGVtIGtpZS1ncmlkX19pdGVtLS1sb2FkaW5nIHBmLXUtcHQtc21cIiBzaXplPVwibWRcIiAvPn1cbiAgICAgICAgICAgIHNjcm9sbGFibGVUYXJnZXQ9XCJzY2Utc2ltLWdyaWRfX21haW5cIlxuICAgICAgICAgID5cbiAgICAgICAgICAgICAge2ZldGNoZWRSb3dzLm1hcCgocm93OiBhbnksIHJvd0luZGV4OiBudW1iZXIpID0+IChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImtpZS1ncmlkX19ydWxlXCIgc3R5bGU9e3t9fSBrZXk9e2Byb3cgJHtyb3dbMF0udmFsdWV9YH0+XG4gICAgICAgICAgICAgICAgICB7cm93Lm1hcCgoY2VsbDogYW55LCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGdldCB0aGUgdHlwZSBvZiB0aGUgY29sdW1uIHRvIHBhc3Mgb24gdG8gdGhlIGlucHV0IGZvciBmb3JtYXR0aW5nIC8gdmFsaWRhdGlvblxuICAgICAgICAgICAgICAgICAgICBsZXQgdHlwZSA9ICdzdHJpbmcnO1xuICAgICAgICAgICAgICAgICAgICBsZXQgY29sdW1uR3JvdXAgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbHVtbk5hbWUgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgLy8gcm93IGluZGV4XG4gICAgICAgICAgICAgICAgICAgICAgdHlwZSA9ICdudW1iZXInO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGluZGV4ID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgLy8gZGVzY3JpcHRpb25cbiAgICAgICAgICAgICAgICAgICAgICB0eXBlID0gJ3N0cmluZyc7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5kZXggPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgY29sdW1uR3JvdXAgPSBjb2x1bW5OYW1lc1N0YXRlW2luZGV4XS5ncm91cDtcbiAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5OYW1lID0gY29sdW1uTmFtZXNTdGF0ZVtpbmRleF0ubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICB0eXBlID0gKGRlZmluaXRpb25zU3RhdGUubWFwW2NvbHVtbk5hbWVzU3RhdGVbaW5kZXhdLmdyb3VwXSAmJiBkZWZpbml0aW9uc1N0YXRlLm1hcFtjb2x1bW5Hcm91cF1bY29sdW1uTmFtZV0pIHx8ICdzdHJpbmcnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNlbGxJbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGNlbGwgJiYgY2VsbC52YWx1ZSA/IGNlbGwudmFsdWUgOiAnJztcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGF0aCA9IGNlbGwgJiYgY2VsbC5wYXRoID8gY2VsbC5wYXRoIDogJyc7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnN0IGNlbGxJZCA9IGBjZWxsICR7Y2VsbEluZGV4fWA7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlucHV0SWQgPSBgcm93ICR7cm93SW5kZXh9IGNvbHVtbiAke2NlbGxJbmRleH1gO1xuICAgICAgICAgICAgICAgICAgICBsZXQgY29tcG9uZW50O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0eXBlQXJyID0gdHlwZS5zcGxpdCgnLCcpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZUFyci5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgLy8gTXVsdGlwbGUgb3B0aW9ucywgcmVuZGVyIFNlbGVjdFxuICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudCA9IChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxTZWxlY3QgXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlzUmVhZE9ubHk9e2lucHV0SWQgIT09IGVkaXRhYmxlQ2VsbH0gXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlkPXtpbnB1dElkfSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxWYWx1ZT17dmFsdWV9ICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25TZWxlY3RUb2dnbGVDYWxsYmFjaz17b25TZWxlY3RUb2dnbGVDYWxsYmFja30gXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM9e3R5cGVBcnIubWFwKHN0cmluZyA9PiBzdHJpbmcudHJpbSgpKX0gXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRlYWN0aXZhdGVBbmRGb2N1c0NlbGw9e2RlYWN0aXZhdGVBbmRGb2N1c0NlbGx9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNldEVkaXRhYmxlPXtzZXRFZGl0YWJsZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25TYXZlPXtvblNhdmV9XG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50ID0gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPElucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlzUmVhZE9ubHk9e2lucHV0SWQgIT09IGVkaXRhYmxlQ2VsbH0gXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlkPXtpbnB1dElkfSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxWYWx1ZT17dmFsdWV9IFxuICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoPXtwYXRofSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT17dHlwZX0gXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRlYWN0aXZhdGVBbmRGb2N1c0NlbGw9e2RlYWN0aXZhdGVBbmRGb2N1c0NlbGx9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNldEVkaXRhYmxlPXtzZXRFZGl0YWJsZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25TYXZlPXtvblNhdmV9XG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImtpZS1ncmlkX19pdGVtXCIga2V5PXtpbnB1dElkfSBvbkNsaWNrPXtvbkNlbGxDbGlja30gb25Eb3VibGVDbGljaz17b25DZWxsRG91YmxlQ2xpY2t9PlxuICAgICAgICAgICAgICAgICAgICAgICAge2NlbGxJbmRleCA9PT0gMCA/IHZhbHVlIDogY29tcG9uZW50fVxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgPC9JbmZpbml0ZVNjcm9sbD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8Lz5cbiAgKTtcbn0sIChwcmV2UHJvcHMsIG5leHRQcm9wcykgPT4ge1xuICBpZiAocHJldlByb3BzLmxhc3RGb3JjZWRVcGRhdGUgIT09IG5leHRQcm9wcy5sYXN0Rm9yY2VkVXBkYXRlKSB7XG4gICAgY29uc29sZS5sb2coJ2ZvcmNlZCBFZGl0b3IgdXBkYXRlJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChwcmV2UHJvcHMuZmlsdGVyZWRSb3dzLmxlbmd0aCAhPT0gbmV4dFByb3BzLmZpbHRlcmVkUm93cy5sZW5ndGggfHwgSlNPTi5zdHJpbmdpZnkocHJldlByb3BzLmZpbHRlcmVkUm93cykgIT09IEpTT04uc3RyaW5naWZ5KG5leHRQcm9wcy5maWx0ZXJlZFJvd3MpKSB7XG4gICAgLy8gZmlsdGVyZWRSb3dzIGhhdmUgY2hhbmdlZCwgcmUtcmVuZGVyXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufSk7XG5cbi8vIEB0cy1pZ25vcmVcbkVkaXRvci53aHlEaWRZb3VSZW5kZXIgPSB7XG4gIGN1c3RvbU5hbWU6ICdFZGl0b3InXG59O1xuXG5leHBvcnQgeyBFZGl0b3IgfTtcbiJdfQ==
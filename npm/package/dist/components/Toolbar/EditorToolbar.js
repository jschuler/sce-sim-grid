"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditorToolbar = void 0;

var React = _interopRequireWildcard(require("react"));

var _reactCore = require("@patternfly/react-core");

var _reactIcons = require("@patternfly/react-icons");

var _HelpModal = require("./HelpModal");

var _Search = require("./Search");

var _ChangeTracker = require("./ChangeTracker");

require("./EditorToolbar.css");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var EditorToolbar = React.memo(function (_ref) {
  var data = _ref.data,
      allRowsLength = _ref.allRowsLength,
      filteredRowsLength = _ref.filteredRowsLength,
      filterRows = _ref.filterRows,
      columnNames = _ref.columnNames,
      undoRedo = _ref.undoRedo,
      onUndo = _ref.onUndo,
      onRedo = _ref.onRedo,
      readOnly = _ref.readOnly;
  console.log('render EditorToolbar');

  var _React$useState = React.useState(false),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      isModelOpen = _React$useState2[0],
      setModalOpen = _React$useState2[1];

  var _React$useState3 = React.useState({
    data: data,
    allRowsLength: allRowsLength,
    filteredRowsLength: filteredRowsLength,
    columnNames: columnNames,
    undoRedo: undoRedo
  }),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      toolbarStateFromProps = _React$useState4[0],
      setToolbarStateFromProps = _React$useState4[1];

  React.useEffect(function () {
    // update state from props
    setToolbarStateFromProps({
      data: data,
      allRowsLength: allRowsLength,
      filteredRowsLength: filteredRowsLength,
      columnNames: columnNames,
      undoRedo: undoRedo
    });
  }, [data, allRowsLength, filteredRowsLength, columnNames, undoRedo]);

  var onSearchChange = function onSearchChange(value, selected) {
    filterRows(value, selected);
  };
  /**
   * Opens the Help modal
   */


  var openModal = function openModal() {
    setModalOpen(true);
  };
  /**
   * Closes the Help modal
   */


  var closeModal = function closeModal() {
    setModalOpen(false);
  };

  return React.createElement(React.Fragment, null, React.createElement(_reactCore.Toolbar, {
    className: "pf-l-toolbar pf-u-justify-content-space-between pf-u-mx-xl pf-u-my-md"
  }, !readOnly && React.createElement(_reactCore.ToolbarGroup, null, React.createElement(_ChangeTracker.ChangeTracker, {
    undoRedo: toolbarStateFromProps.undoRedo,
    onUndo: onUndo,
    onRedo: onRedo
  })), React.createElement(_reactCore.ToolbarGroup, null, toolbarStateFromProps.allRowsLength === filteredRowsLength ? React.createElement(_reactCore.ToolbarItem, {
    className: "pf-u-mr-md"
  }, toolbarStateFromProps.allRowsLength, " items") : React.createElement(_reactCore.ToolbarItem, {
    className: "pf-u-mr-md"
  }, filteredRowsLength, " of ", toolbarStateFromProps.allRowsLength, " items"), React.createElement(_Search.Search, {
    data: data,
    columnNames: toolbarStateFromProps.columnNames,
    onChange: onSearchChange
  }), React.createElement(_reactCore.ToolbarItem, null, React.createElement(_reactCore.Button, {
    variant: "plain",
    onClick: openModal
  }, React.createElement(_reactIcons.OutlinedQuestionCircleIcon, {
    size: "md"
  }))))), React.createElement(_HelpModal.HelpModal, {
    isOpen: isModelOpen,
    onClose: closeModal,
    readOnly: readOnly
  }));
}, function (prevProps, nextProps) {
  if (prevProps.allRowsLength !== nextProps.allRowsLength) {
    // filteredRows have changed, re-render
    return false;
  }

  if (prevProps.filteredRowsLength !== nextProps.filteredRowsLength) {
    // filteredRows have changed, re-render
    return false;
  }

  if (prevProps.undoRedo.undoList.length !== nextProps.undoRedo.undoList.length || JSON.stringify(prevProps.undoRedo.undoList) !== JSON.stringify(nextProps.undoRedo.undoList)) {
    // last changed cell has changed, re-render
    return false;
  }

  if (prevProps.undoRedo.redoList.length !== nextProps.undoRedo.redoList.length || JSON.stringify(prevProps.undoRedo.redoList) !== JSON.stringify(nextProps.undoRedo.redoList)) {
    // last changed cell has changed, re-render
    return false;
  }

  return true;
}); // @ts-ignore

exports.EditorToolbar = EditorToolbar;
EditorToolbar.whyDidYouRender = {
  customName: 'EditorToolbar'
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvY29tcG9uZW50cy9Ub29sYmFyL0VkaXRvclRvb2xiYXIudHN4Il0sIm5hbWVzIjpbIkVkaXRvclRvb2xiYXIiLCJSZWFjdCIsIm1lbW8iLCJkYXRhIiwiYWxsUm93c0xlbmd0aCIsImZpbHRlcmVkUm93c0xlbmd0aCIsImZpbHRlclJvd3MiLCJjb2x1bW5OYW1lcyIsInVuZG9SZWRvIiwib25VbmRvIiwib25SZWRvIiwicmVhZE9ubHkiLCJjb25zb2xlIiwibG9nIiwidXNlU3RhdGUiLCJpc01vZGVsT3BlbiIsInNldE1vZGFsT3BlbiIsInRvb2xiYXJTdGF0ZUZyb21Qcm9wcyIsInNldFRvb2xiYXJTdGF0ZUZyb21Qcm9wcyIsInVzZUVmZmVjdCIsIm9uU2VhcmNoQ2hhbmdlIiwidmFsdWUiLCJzZWxlY3RlZCIsIm9wZW5Nb2RhbCIsImNsb3NlTW9kYWwiLCJwcmV2UHJvcHMiLCJuZXh0UHJvcHMiLCJ1bmRvTGlzdCIsImxlbmd0aCIsIkpTT04iLCJzdHJpbmdpZnkiLCJyZWRvTGlzdCIsIndoeURpZFlvdVJlbmRlciIsImN1c3RvbU5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFNQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxhQUFhLEdBQUdDLEtBQUssQ0FBQ0MsSUFBTixDQVVuQixnQkFBOEc7QUFBQSxNQUEzR0MsSUFBMkcsUUFBM0dBLElBQTJHO0FBQUEsTUFBckdDLGFBQXFHLFFBQXJHQSxhQUFxRztBQUFBLE1BQXRGQyxrQkFBc0YsUUFBdEZBLGtCQUFzRjtBQUFBLE1BQWxFQyxVQUFrRSxRQUFsRUEsVUFBa0U7QUFBQSxNQUF0REMsV0FBc0QsUUFBdERBLFdBQXNEO0FBQUEsTUFBekNDLFFBQXlDLFFBQXpDQSxRQUF5QztBQUFBLE1BQS9CQyxNQUErQixRQUEvQkEsTUFBK0I7QUFBQSxNQUF2QkMsTUFBdUIsUUFBdkJBLE1BQXVCO0FBQUEsTUFB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IjpbImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIEJ1dHRvbixcbiAgVG9vbGJhcixcbiAgVG9vbGJhckdyb3VwLFxuICBUb29sYmFySXRlbVxufSBmcm9tICdAcGF0dGVybmZseS9yZWFjdC1jb3JlJztcbmltcG9ydCB7IE91dGxpbmVkUXVlc3Rpb25DaXJjbGVJY29uIH0gZnJvbSAnQHBhdHRlcm5mbHkvcmVhY3QtaWNvbnMnO1xuaW1wb3J0IHsgSGVscE1vZGFsIH0gZnJvbSAnLi9IZWxwTW9kYWwnO1xuaW1wb3J0IHsgU2VhcmNoIH0gZnJvbSAnLi9TZWFyY2gnO1xuaW1wb3J0IHsgQ2hhbmdlVHJhY2tlciB9IGZyb20gJy4vQ2hhbmdlVHJhY2tlcic7XG5pbXBvcnQgJy4vRWRpdG9yVG9vbGJhci5jc3MnO1xuXG5jb25zdCBFZGl0b3JUb29sYmFyID0gUmVhY3QubWVtbzx7IFxuICBkYXRhOiBhbnksIFxuICBhbGxSb3dzTGVuZ3RoOiBhbnksXG4gIGZpbHRlcmVkUm93c0xlbmd0aDogbnVtYmVyLCBcbiAgZmlsdGVyUm93czogYW55LCBcbiAgY29sdW1uTmFtZXM6IGFueSxcbiAgdW5kb1JlZG86IGFueSxcbiAgb25VbmRvOiBhbnksXG4gIG9uUmVkbzogYW55LFxuICByZWFkT25seTogYm9vbGVhblxufT4oKHsgZGF0YSwgYWxsUm93c0xlbmd0aCwgZmlsdGVyZWRSb3dzTGVuZ3RoLCBmaWx0ZXJSb3dzLCBjb2x1bW5OYW1lcywgdW5kb1JlZG8sIG9uVW5kbywgb25SZWRvLCByZWFkT25seSB9KSA9PiB7XG4gIGNvbnNvbGUubG9nKCdyZW5kZXIgRWRpdG9yVG9vbGJhcicpO1xuXG4gIGNvbnN0IFtpc01vZGVsT3Blbiwgc2V0TW9kYWxPcGVuXSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcblxuICBjb25zdCBbdG9vbGJhclN0YXRlRnJvbVByb3BzLCBzZXRUb29sYmFyU3RhdGVGcm9tUHJvcHNdID0gUmVhY3QudXNlU3RhdGUoeyBcbiAgICBkYXRhLFxuICAgIGFsbFJvd3NMZW5ndGgsIFxuICAgIGZpbHRlcmVkUm93c0xlbmd0aCwgXG4gICAgY29sdW1uTmFtZXMsIFxuICAgIHVuZG9SZWRvXG4gIH0pO1xuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgLy8gdXBkYXRlIHN0YXRlIGZyb20gcHJvcHNcbiAgICBzZXRUb29sYmFyU3RhdGVGcm9tUHJvcHMoe1xuICAgICAgZGF0YSxcbiAgICAgIGFsbFJvd3NMZW5ndGgsIFxuICAgICAgZmlsdGVyZWRSb3dzTGVuZ3RoLCBcbiAgICAgIGNvbHVtbk5hbWVzLCBcbiAgICAgIHVuZG9SZWRvXG4gICAgfSk7XG4gIH0sIFtcbiAgICBkYXRhLFxuICAgIGFsbFJvd3NMZW5ndGgsIFxuICAgIGZpbHRlcmVkUm93c0xlbmd0aCwgXG4gICAgY29sdW1uTmFtZXMsIFxuICAgIHVuZG9SZWRvXG4gIF0pO1xuXG4gIGNvbnN0IG9uU2VhcmNoQ2hhbmdlID0gKHZhbHVlOiBzdHJpbmcsIHNlbGVjdGVkOiBhbnlbXSkgPT4ge1xuICAgIGZpbHRlclJvd3ModmFsdWUsIHNlbGVjdGVkKTtcbiAgfTtcbiAgXG4gIC8qKlxuICAgKiBPcGVucyB0aGUgSGVscCBtb2RhbFxuICAgKi9cbiAgY29uc3Qgb3Blbk1vZGFsID0gKCkgPT4ge1xuICAgIHNldE1vZGFsT3Blbih0cnVlKTtcbiAgfTtcblxuICAvKipcbiAgICogQ2xvc2VzIHRoZSBIZWxwIG1vZGFsXG4gICAqL1xuICBjb25zdCBjbG9zZU1vZGFsID0gKCkgPT4ge1xuICAgIHNldE1vZGFsT3BlbihmYWxzZSk7XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPFRvb2xiYXIgY2xhc3NOYW1lPVwicGYtbC10b29sYmFyIHBmLXUtanVzdGlmeS1jb250ZW50LXNwYWNlLWJldHdlZW4gcGYtdS1teC14bCBwZi11LW15LW1kXCI+XG4gICAgICAgIHshcmVhZE9ubHkgJiYgPFRvb2xiYXJHcm91cD5cbiAgICAgICAgICA8Q2hhbmdlVHJhY2tlciB1bmRvUmVkbz17dG9vbGJhclN0YXRlRnJvbVByb3BzLnVuZG9SZWRvfSBvblVuZG89e29uVW5kb30gb25SZWRvPXtvblJlZG99IC8+XG4gICAgICAgIDwvVG9vbGJhckdyb3VwPn1cbiAgICAgICAgPFRvb2xiYXJHcm91cD5cbiAgICAgICAgICB7dG9vbGJhclN0YXRlRnJvbVByb3BzLmFsbFJvd3NMZW5ndGggPT09IGZpbHRlcmVkUm93c0xlbmd0aCA/IChcbiAgICAgICAgICAgIDxUb29sYmFySXRlbSBjbGFzc05hbWU9XCJwZi11LW1yLW1kXCI+e3Rvb2xiYXJTdGF0ZUZyb21Qcm9wcy5hbGxSb3dzTGVuZ3RofSBpdGVtczwvVG9vbGJhckl0ZW0+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxUb29sYmFySXRlbSBjbGFzc05hbWU9XCJwZi11LW1yLW1kXCI+e2ZpbHRlcmVkUm93c0xlbmd0aH0gb2Yge3Rvb2xiYXJTdGF0ZUZyb21Qcm9wcy5hbGxSb3dzTGVuZ3RofSBpdGVtczwvVG9vbGJhckl0ZW0+XG4gICAgICAgICAgKX1cbiAgICAgICAgICA8U2VhcmNoIGRhdGE9e2RhdGF9IGNvbHVtbk5hbWVzPXt0b29sYmFyU3RhdGVGcm9tUHJvcHMuY29sdW1uTmFtZXN9IG9uQ2hhbmdlPXtvblNlYXJjaENoYW5nZX0gLz5cbiAgICAgICAgICA8VG9vbGJhckl0ZW0+PEJ1dHRvbiB2YXJpYW50PVwicGxhaW5cIiBvbkNsaWNrPXtvcGVuTW9kYWx9PjxPdXRsaW5lZFF1ZXN0aW9uQ2lyY2xlSWNvbiBzaXplPVwibWRcIiAvPjwvQnV0dG9uPjwvVG9vbGJhckl0ZW0+XG4gICAgICAgIDwvVG9vbGJhckdyb3VwPlxuICAgICAgPC9Ub29sYmFyPlxuICAgICAgPEhlbHBNb2RhbCBpc09wZW49e2lzTW9kZWxPcGVufSBvbkNsb3NlPXtjbG9zZU1vZGFsfSByZWFkT25seT17cmVhZE9ubHl9IC8+XG4gICAgPC8+XG4gICk7XG59LCAocHJldlByb3BzLCBuZXh0UHJvcHMpID0+IHtcbiAgaWYgKHByZXZQcm9wcy5hbGxSb3dzTGVuZ3RoICE9PSBuZXh0UHJvcHMuYWxsUm93c0xlbmd0aCkge1xuICAgIC8vIGZpbHRlcmVkUm93cyBoYXZlIGNoYW5nZWQsIHJlLXJlbmRlclxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAocHJldlByb3BzLmZpbHRlcmVkUm93c0xlbmd0aCAhPT0gbmV4dFByb3BzLmZpbHRlcmVkUm93c0xlbmd0aCkge1xuICAgIC8vIGZpbHRlcmVkUm93cyBoYXZlIGNoYW5nZWQsIHJlLXJlbmRlclxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAocHJldlByb3BzLnVuZG9SZWRvLnVuZG9MaXN0Lmxlbmd0aCAhPT0gbmV4dFByb3BzLnVuZG9SZWRvLnVuZG9MaXN0Lmxlbmd0aCB8fCBKU09OLnN0cmluZ2lmeShwcmV2UHJvcHMudW5kb1JlZG8udW5kb0xpc3QpICE9PSBKU09OLnN0cmluZ2lmeShuZXh0UHJvcHMudW5kb1JlZG8udW5kb0xpc3QpKSB7XG4gICAgLy8gbGFzdCBjaGFuZ2VkIGNlbGwgaGFzIGNoYW5nZWQsIHJlLXJlbmRlclxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAocHJldlByb3BzLnVuZG9SZWRvLnJlZG9MaXN0Lmxlbmd0aCAhPT0gbmV4dFByb3BzLnVuZG9SZWRvLnJlZG9MaXN0Lmxlbmd0aCB8fCBKU09OLnN0cmluZ2lmeShwcmV2UHJvcHMudW5kb1JlZG8ucmVkb0xpc3QpICE9PSBKU09OLnN0cmluZ2lmeShuZXh0UHJvcHMudW5kb1JlZG8ucmVkb0xpc3QpKSB7XG4gICAgLy8gbGFzdCBjaGFuZ2VkIGNlbGwgaGFzIGNoYW5nZWQsIHJlLXJlbmRlclxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn0pO1xuXG4vLyBAdHMtaWdub3JlXG5FZGl0b3JUb29sYmFyLndoeURpZFlvdVJlbmRlciA9IHtcbiAgY3VzdG9tTmFtZTogJ0VkaXRvclRvb2xiYXInXG59O1xuXG5leHBvcnQgeyBFZGl0b3JUb29sYmFyIH07Il19
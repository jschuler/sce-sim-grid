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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1Rvb2xiYXIvRWRpdG9yVG9vbGJhci50c3giXSwibmFtZXMiOlsiRWRpdG9yVG9vbGJhciIsIlJlYWN0IiwibWVtbyIsImRhdGEiLCJhbGxSb3dzTGVuZ3RoIiwiZmlsdGVyZWRSb3dzTGVuZ3RoIiwiZmlsdGVyUm93cyIsImNvbHVtbk5hbWVzIiwidW5kb1JlZG8iLCJvblVuZG8iLCJvblJlZG8iLCJyZWFkT25seSIsImNvbnNvbGUiLCJsb2ciLCJ1c2VTdGF0ZSIsImlzTW9kZWxPcGVuIiwic2V0TW9kYWxPcGVuIiwidG9vbGJhclN0YXRlRnJvbVByb3BzIiwic2V0VG9vbGJhclN0YXRlRnJvbVByb3BzIiwidXNlRWZmZWN0Iiwib25TZWFyY2hDaGFuZ2UiLCJ2YWx1ZSIsInNlbGVjdGVkIiwib3Blbk1vZGFsIiwiY2xvc2VNb2RhbCIsInByZXZQcm9wcyIsIm5leHRQcm9wcyIsInVuZG9MaXN0IiwibGVuZ3RoIiwiSlNPTiIsInN0cmluZ2lmeSIsInJlZG9MaXN0Iiwid2h5RGlkWW91UmVuZGVyIiwiY3VzdG9tTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQU1BOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLGFBQWEsR0FBR0MsS0FBSyxDQUFDQyxJQUFOLENBVW5CLGdCQUE4RztBQUFBLE1BQTNHQyxJQUEyRyxRQUEzR0EsSUFBMkc7QUFBQSxNQUFyR0MsYUFBcUcsUUFBckdBLGFBQXFHO0FBQUEsTUFBdEZDLGtCQUFzRixRQUF0RkEsa0JBQXNGO0FBQUEsTUFBbEVDLFVBQWtFLFFBQWxFQSxVQUFrRTtBQUFBLE1BQXREQyxXQUFzRCxRQUF0REEsV0FBc0Q7QUFBQSxNQUF6Q0MsUUFBeUMsUUFBekNBLFFBQXlDO0FBQUEsTUFBL0JDLE1BQStCLFFBQS9CQSxNQUErQjtBQUFBLE1BQXZCQyxNQUF1QixRQUF2QkEsTUFBdUI7QUFBQSxNQUFmQyxR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aW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtcbiAgQnV0dG9uLFxuICBUb29sYmFyLFxuICBUb29sYmFyR3JvdXAsXG4gIFRvb2xiYXJJdGVtXG59IGZyb20gJ0BwYXR0ZXJuZmx5L3JlYWN0LWNvcmUnO1xuaW1wb3J0IHsgT3V0bGluZWRRdWVzdGlvbkNpcmNsZUljb24gfSBmcm9tICdAcGF0dGVybmZseS9yZWFjdC1pY29ucyc7XG5pbXBvcnQgeyBIZWxwTW9kYWwgfSBmcm9tICcuL0hlbHBNb2RhbCc7XG5pbXBvcnQgeyBTZWFyY2ggfSBmcm9tICcuL1NlYXJjaCc7XG5pbXBvcnQgeyBDaGFuZ2VUcmFja2VyIH0gZnJvbSAnLi9DaGFuZ2VUcmFja2VyJztcbmltcG9ydCAnLi9FZGl0b3JUb29sYmFyLmNzcyc7XG5cbmNvbnN0IEVkaXRvclRvb2xiYXIgPSBSZWFjdC5tZW1vPHsgXG4gIGRhdGE6IGFueSwgXG4gIGFsbFJvd3NMZW5ndGg6IGFueSxcbiAgZmlsdGVyZWRSb3dzTGVuZ3RoOiBudW1iZXIsIFxuICBmaWx0ZXJSb3dzOiBhbnksIFxuICBjb2x1bW5OYW1lczogYW55LFxuICB1bmRvUmVkbzogYW55LFxuICBvblVuZG86IGFueSxcbiAgb25SZWRvOiBhbnksXG4gIHJlYWRPbmx5OiBib29sZWFuXG59PigoeyBkYXRhLCBhbGxSb3dzTGVuZ3RoLCBmaWx0ZXJlZFJvd3NMZW5ndGgsIGZpbHRlclJvd3MsIGNvbHVtbk5hbWVzLCB1bmRvUmVkbywgb25VbmRvLCBvblJlZG8sIHJlYWRPbmx5IH0pID0+IHtcbiAgY29uc29sZS5sb2coJ3JlbmRlciBFZGl0b3JUb29sYmFyJyk7XG5cbiAgY29uc3QgW2lzTW9kZWxPcGVuLCBzZXRNb2RhbE9wZW5dID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuXG4gIGNvbnN0IFt0b29sYmFyU3RhdGVGcm9tUHJvcHMsIHNldFRvb2xiYXJTdGF0ZUZyb21Qcm9wc10gPSBSZWFjdC51c2VTdGF0ZSh7IFxuICAgIGRhdGEsXG4gICAgYWxsUm93c0xlbmd0aCwgXG4gICAgZmlsdGVyZWRSb3dzTGVuZ3RoLCBcbiAgICBjb2x1bW5OYW1lcywgXG4gICAgdW5kb1JlZG9cbiAgfSk7XG5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAvLyB1cGRhdGUgc3RhdGUgZnJvbSBwcm9wc1xuICAgIHNldFRvb2xiYXJTdGF0ZUZyb21Qcm9wcyh7XG4gICAgICBkYXRhLFxuICAgICAgYWxsUm93c0xlbmd0aCwgXG4gICAgICBmaWx0ZXJlZFJvd3NMZW5ndGgsIFxuICAgICAgY29sdW1uTmFtZXMsIFxuICAgICAgdW5kb1JlZG9cbiAgICB9KTtcbiAgfSwgW1xuICAgIGRhdGEsXG4gICAgYWxsUm93c0xlbmd0aCwgXG4gICAgZmlsdGVyZWRSb3dzTGVuZ3RoLCBcbiAgICBjb2x1bW5OYW1lcywgXG4gICAgdW5kb1JlZG9cbiAgXSk7XG5cbiAgY29uc3Qgb25TZWFyY2hDaGFuZ2UgPSAodmFsdWU6IHN0cmluZywgc2VsZWN0ZWQ6IGFueVtdKSA9PiB7XG4gICAgZmlsdGVyUm93cyh2YWx1ZSwgc2VsZWN0ZWQpO1xuICB9O1xuICBcbiAgLyoqXG4gICAqIE9wZW5zIHRoZSBIZWxwIG1vZGFsXG4gICAqL1xuICBjb25zdCBvcGVuTW9kYWwgPSAoKSA9PiB7XG4gICAgc2V0TW9kYWxPcGVuKHRydWUpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDbG9zZXMgdGhlIEhlbHAgbW9kYWxcbiAgICovXG4gIGNvbnN0IGNsb3NlTW9kYWwgPSAoKSA9PiB7XG4gICAgc2V0TW9kYWxPcGVuKGZhbHNlKTtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8VG9vbGJhciBjbGFzc05hbWU9XCJwZi1sLXRvb2xiYXIgcGYtdS1qdXN0aWZ5LWNvbnRlbnQtc3BhY2UtYmV0d2VlbiBwZi11LW14LXhsIHBmLXUtbXktbWRcIj5cbiAgICAgICAgeyFyZWFkT25seSAmJiA8VG9vbGJhckdyb3VwPlxuICAgICAgICAgIDxDaGFuZ2VUcmFja2VyIHVuZG9SZWRvPXt0b29sYmFyU3RhdGVGcm9tUHJvcHMudW5kb1JlZG99IG9uVW5kbz17b25VbmRvfSBvblJlZG89e29uUmVkb30gLz5cbiAgICAgICAgPC9Ub29sYmFyR3JvdXA+fVxuICAgICAgICA8VG9vbGJhckdyb3VwPlxuICAgICAgICAgIHt0b29sYmFyU3RhdGVGcm9tUHJvcHMuYWxsUm93c0xlbmd0aCA9PT0gZmlsdGVyZWRSb3dzTGVuZ3RoID8gKFxuICAgICAgICAgICAgPFRvb2xiYXJJdGVtIGNsYXNzTmFtZT1cInBmLXUtbXItbWRcIj57dG9vbGJhclN0YXRlRnJvbVByb3BzLmFsbFJvd3NMZW5ndGh9IGl0ZW1zPC9Ub29sYmFySXRlbT5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPFRvb2xiYXJJdGVtIGNsYXNzTmFtZT1cInBmLXUtbXItbWRcIj57ZmlsdGVyZWRSb3dzTGVuZ3RofSBvZiB7dG9vbGJhclN0YXRlRnJvbVByb3BzLmFsbFJvd3NMZW5ndGh9IGl0ZW1zPC9Ub29sYmFySXRlbT5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxTZWFyY2ggZGF0YT17ZGF0YX0gY29sdW1uTmFtZXM9e3Rvb2xiYXJTdGF0ZUZyb21Qcm9wcy5jb2x1bW5OYW1lc30gb25DaGFuZ2U9e29uU2VhcmNoQ2hhbmdlfSAvPlxuICAgICAgICAgIDxUb29sYmFySXRlbT48QnV0dG9uIHZhcmlhbnQ9XCJwbGFpblwiIG9uQ2xpY2s9e29wZW5Nb2RhbH0+PE91dGxpbmVkUXVlc3Rpb25DaXJjbGVJY29uIHNpemU9XCJtZFwiIC8+PC9CdXR0b24+PC9Ub29sYmFySXRlbT5cbiAgICAgICAgPC9Ub29sYmFyR3JvdXA+XG4gICAgICA8L1Rvb2xiYXI+XG4gICAgICA8SGVscE1vZGFsIGlzT3Blbj17aXNNb2RlbE9wZW59IG9uQ2xvc2U9e2Nsb3NlTW9kYWx9IHJlYWRPbmx5PXtyZWFkT25seX0gLz5cbiAgICA8Lz5cbiAgKTtcbn0sIChwcmV2UHJvcHMsIG5leHRQcm9wcykgPT4ge1xuICBpZiAocHJldlByb3BzLmFsbFJvd3NMZW5ndGggIT09IG5leHRQcm9wcy5hbGxSb3dzTGVuZ3RoKSB7XG4gICAgLy8gZmlsdGVyZWRSb3dzIGhhdmUgY2hhbmdlZCwgcmUtcmVuZGVyXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChwcmV2UHJvcHMuZmlsdGVyZWRSb3dzTGVuZ3RoICE9PSBuZXh0UHJvcHMuZmlsdGVyZWRSb3dzTGVuZ3RoKSB7XG4gICAgLy8gZmlsdGVyZWRSb3dzIGhhdmUgY2hhbmdlZCwgcmUtcmVuZGVyXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChwcmV2UHJvcHMudW5kb1JlZG8udW5kb0xpc3QubGVuZ3RoICE9PSBuZXh0UHJvcHMudW5kb1JlZG8udW5kb0xpc3QubGVuZ3RoIHx8IEpTT04uc3RyaW5naWZ5KHByZXZQcm9wcy51bmRvUmVkby51bmRvTGlzdCkgIT09IEpTT04uc3RyaW5naWZ5KG5leHRQcm9wcy51bmRvUmVkby51bmRvTGlzdCkpIHtcbiAgICAvLyBsYXN0IGNoYW5nZWQgY2VsbCBoYXMgY2hhbmdlZCwgcmUtcmVuZGVyXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChwcmV2UHJvcHMudW5kb1JlZG8ucmVkb0xpc3QubGVuZ3RoICE9PSBuZXh0UHJvcHMudW5kb1JlZG8ucmVkb0xpc3QubGVuZ3RoIHx8IEpTT04uc3RyaW5naWZ5KHByZXZQcm9wcy51bmRvUmVkby5yZWRvTGlzdCkgIT09IEpTT04uc3RyaW5naWZ5KG5leHRQcm9wcy51bmRvUmVkby5yZWRvTGlzdCkpIHtcbiAgICAvLyBsYXN0IGNoYW5nZWQgY2VsbCBoYXMgY2hhbmdlZCwgcmUtcmVuZGVyXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufSk7XG5cbi8vIEB0cy1pZ25vcmVcbkVkaXRvclRvb2xiYXIud2h5RGlkWW91UmVuZGVyID0ge1xuICBjdXN0b21OYW1lOiAnRWRpdG9yVG9vbGJhcidcbn07XG5cbmV4cG9ydCB7IEVkaXRvclRvb2xiYXIgfTsiXX0=
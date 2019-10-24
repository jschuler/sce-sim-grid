"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HelpModal = void 0;

var React = _interopRequireWildcard(require("react"));

var _reactCore = require("@patternfly/react-core");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var HelpModal = function HelpModal(_ref) {
  var isOpen = _ref.isOpen,
      onClose = _ref.onClose,
      readOnly = _ref.readOnly;
  // console.log('render HelpModal');
  return React.createElement(_reactCore.Modal, {
    isSmall: true,
    title: "Help",
    isOpen: isOpen,
    onClose: onClose,
    actions: [React.createElement(_reactCore.Button, {
      key: "confirm",
      variant: "primary",
      onClick: onClose
    }, "Close")],
    isFooterLeftAligned: true
  }, React.createElement("div", {
    className: "pf-c-content"
  }, React.createElement("p", null, "The following keyboard interactions are available:"), React.createElement("ul", null, React.createElement("li", null, "Once a cell is selected, arrow keys can be used to navigate between the cells."), React.createElement("li", null, "The Tab and Shift+Tab keys can be used to tab to the next and previous cell."), React.createElement("li", null, "CMD+C / CTRL+C copies the cell content."), !readOnly && React.createElement(React.Fragment, null, React.createElement("li", null, "Use the Enter key on a cell to enter editing mode."), React.createElement("li", null, "CMD+Z / CTRL+Z undoes the last change."), React.createElement("li", null, "CMD+Shift+Z / CTRL+Shift+Z redoes the last change."), React.createElement("li", null, "When in editing mode:", React.createElement("ul", null, React.createElement("li", null, "The Enter key will save the current cell contents."), React.createElement("li", null, "THe Escape key will reset the cell contents.")))))));
};

exports.HelpModal = HelpModal;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1Rvb2xiYXIvSGVscE1vZGFsLnRzeCJdLCJuYW1lcyI6WyJIZWxwTW9kYWwiLCJpc09wZW4iLCJvbkNsb3NlIiwicmVhZE9ubHkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsU0FBMEUsR0FBRyxTQUE3RUEsU0FBNkUsT0FBbUM7QUFBQSxNQUFoQ0MsTUFBZ0MsUUFBaENBLE1BQWdDO0FBQUEsTUFBeEJDLE9BQXdCLFFBQXhCQSxPQUF3QjtBQUFBLE1BQWZDLFFBQWUsUUFBZkEsUUFBZTtBQUNwSDtBQUVBLFNBQ0Usb0JBQUMsZ0JBQUQ7QUFDRSxJQUFBLE9BQU8sTUFEVDtBQUVFLElBQUEsS0FBSyxFQUFDLE1BRlI7QUFHRSxJQUFBLE1BQU0sRUFBRUYsTUFIVjtBQUlFLElBQUEsT0FBTyxFQUFFQyxPQUpYO0FBS0UsSUFBQSxPQUFPLEVBQUUsQ0FDUCxvQkFBQyxpQkFBRDtBQUFRLE1BQUEsR0FBRyxFQUFDLFNBQVo7QUFBc0IsTUFBQSxPQUFPLEVBQUMsU0FBOUI7QUFBd0MsTUFBQSxPQUFPLEVBQUVBO0FBQWpELGVBRE8sQ0FMWDtBQVVFLElBQUEsbUJBQW1CO0FBVnJCLEtBWUU7QUFBSyxJQUFBLFNBQVMsRUFBQztBQUFmLEtBQ0Usb0ZBREYsRUFFRSxnQ0FDRSxpSEFERixFQUVFLCtHQUZGLEVBR0UsMEVBSEYsRUFJRyxDQUFDQyxRQUFELElBQWEsMENBQ1oscUZBRFksRUFFWix5RUFGWSxFQUdaLHFGQUhZLEVBSVoseURBQ0UsZ0NBQ0UscUZBREYsRUFFRSwrRUFGRixDQURGLENBSlksQ0FKaEIsQ0FGRixDQVpGLENBREY7QUFrQ0QsQ0FyQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IE1vZGFsLCBCdXR0b24gfSBmcm9tICdAcGF0dGVybmZseS9yZWFjdC1jb3JlJztcblxuY29uc3QgSGVscE1vZGFsOiBSZWFjdC5TRkM8eyBpc09wZW46IGJvb2xlYW4sIG9uQ2xvc2U6IGFueSwgcmVhZE9ubHk6IGJvb2xlYW4gfT4gPSAoeyBpc09wZW4sIG9uQ2xvc2UsIHJlYWRPbmx5IH0pID0+IHtcbiAgLy8gY29uc29sZS5sb2coJ3JlbmRlciBIZWxwTW9kYWwnKTtcbiAgXG4gIHJldHVybiAoXG4gICAgPE1vZGFsXG4gICAgICBpc1NtYWxsXG4gICAgICB0aXRsZT1cIkhlbHBcIlxuICAgICAgaXNPcGVuPXtpc09wZW59XG4gICAgICBvbkNsb3NlPXtvbkNsb3NlfVxuICAgICAgYWN0aW9ucz17W1xuICAgICAgICA8QnV0dG9uIGtleT1cImNvbmZpcm1cIiB2YXJpYW50PVwicHJpbWFyeVwiIG9uQ2xpY2s9e29uQ2xvc2V9PlxuICAgICAgICAgIENsb3NlXG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgXX1cbiAgICAgIGlzRm9vdGVyTGVmdEFsaWduZWRcbiAgICA+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInBmLWMtY29udGVudFwiPlxuICAgICAgICA8cD5UaGUgZm9sbG93aW5nIGtleWJvYXJkIGludGVyYWN0aW9ucyBhcmUgYXZhaWxhYmxlOjwvcD5cbiAgICAgICAgPHVsPlxuICAgICAgICAgIDxsaT5PbmNlIGEgY2VsbCBpcyBzZWxlY3RlZCwgYXJyb3cga2V5cyBjYW4gYmUgdXNlZCB0byBuYXZpZ2F0ZSBiZXR3ZWVuIHRoZSBjZWxscy48L2xpPlxuICAgICAgICAgIDxsaT5UaGUgVGFiIGFuZCBTaGlmdCtUYWIga2V5cyBjYW4gYmUgdXNlZCB0byB0YWIgdG8gdGhlIG5leHQgYW5kIHByZXZpb3VzIGNlbGwuPC9saT5cbiAgICAgICAgICA8bGk+Q01EK0MgLyBDVFJMK0MgY29waWVzIHRoZSBjZWxsIGNvbnRlbnQuPC9saT5cbiAgICAgICAgICB7IXJlYWRPbmx5ICYmIDw+XG4gICAgICAgICAgICA8bGk+VXNlIHRoZSBFbnRlciBrZXkgb24gYSBjZWxsIHRvIGVudGVyIGVkaXRpbmcgbW9kZS48L2xpPlxuICAgICAgICAgICAgPGxpPkNNRCtaIC8gQ1RSTCtaIHVuZG9lcyB0aGUgbGFzdCBjaGFuZ2UuPC9saT5cbiAgICAgICAgICAgIDxsaT5DTUQrU2hpZnQrWiAvIENUUkwrU2hpZnQrWiByZWRvZXMgdGhlIGxhc3QgY2hhbmdlLjwvbGk+XG4gICAgICAgICAgICA8bGk+V2hlbiBpbiBlZGl0aW5nIG1vZGU6XG4gICAgICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgICAgICA8bGk+VGhlIEVudGVyIGtleSB3aWxsIHNhdmUgdGhlIGN1cnJlbnQgY2VsbCBjb250ZW50cy48L2xpPlxuICAgICAgICAgICAgICAgIDxsaT5USGUgRXNjYXBlIGtleSB3aWxsIHJlc2V0IHRoZSBjZWxsIGNvbnRlbnRzLjwvbGk+XG4gICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICAgIDwvPn1cbiAgICAgICAgPC91bD5cbiAgICAgIDwvZGl2PlxuICAgIDwvTW9kYWw+XG4gIClcbn07XG5cbmV4cG9ydCB7IEhlbHBNb2RhbCB9O1xuIl19
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvY29tcG9uZW50cy9Ub29sYmFyL0hlbHBNb2RhbC50c3giXSwibmFtZXMiOlsiSGVscE1vZGFsIiwiaXNPcGVuIiwib25DbG9zZSIsInJlYWRPbmx5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLFNBQTBFLEdBQUcsU0FBN0VBLFNBQTZFLE9BQW1DO0FBQUEsTUFBaENDLE1BQWdDLFFBQWhDQSxNQUFnQztBQUFBLE1BQXhCQyxPQUF3QixRQUF4QkEsT0FBd0I7QUFBQSxNQUFmQyxRQUFlLFFBQWZBLFFBQWU7QUFDcEg7QUFFQSxTQUNFLG9CQUFDLGdCQUFEO0FBQ0UsSUFBQSxPQUFPLE1BRFQ7QUFFRSxJQUFBLEtBQUssRUFBQyxNQUZSO0FBR0UsSUFBQSxNQUFNLEVBQUVGLE1BSFY7QUFJRSxJQUFBLE9BQU8sRUFBRUMsT0FKWDtBQUtFLElBQUEsT0FBTyxFQUFFLENBQ1Asb0JBQUMsaUJBQUQ7QUFBUSxNQUFBLEdBQUcsRUFBQyxTQUFaO0FBQXNCLE1BQUEsT0FBTyxFQUFDLFNBQTlCO0FBQXdDLE1BQUEsT0FBTyxFQUFFQTtBQUFqRCxlQURPLENBTFg7QUFVRSxJQUFBLG1CQUFtQjtBQVZyQixLQVlFO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixLQUNFLG9GQURGLEVBRUUsZ0NBQ0UsaUhBREYsRUFFRSwrR0FGRixFQUdFLDBFQUhGLEVBSUcsQ0FBQ0MsUUFBRCxJQUFhLDBDQUNaLHFGQURZLEVBRVoseUVBRlksRUFHWixxRkFIWSxFQUlaLHlEQUNFLGdDQUNFLHFGQURGLEVBRUUsK0VBRkYsQ0FERixDQUpZLENBSmhCLENBRkYsQ0FaRixDQURGO0FBa0NELENBckNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBNb2RhbCwgQnV0dG9uIH0gZnJvbSAnQHBhdHRlcm5mbHkvcmVhY3QtY29yZSc7XG5cbmNvbnN0IEhlbHBNb2RhbDogUmVhY3QuU0ZDPHsgaXNPcGVuOiBib29sZWFuLCBvbkNsb3NlOiBhbnksIHJlYWRPbmx5OiBib29sZWFuIH0+ID0gKHsgaXNPcGVuLCBvbkNsb3NlLCByZWFkT25seSB9KSA9PiB7XG4gIC8vIGNvbnNvbGUubG9nKCdyZW5kZXIgSGVscE1vZGFsJyk7XG4gIFxuICByZXR1cm4gKFxuICAgIDxNb2RhbFxuICAgICAgaXNTbWFsbFxuICAgICAgdGl0bGU9XCJIZWxwXCJcbiAgICAgIGlzT3Blbj17aXNPcGVufVxuICAgICAgb25DbG9zZT17b25DbG9zZX1cbiAgICAgIGFjdGlvbnM9e1tcbiAgICAgICAgPEJ1dHRvbiBrZXk9XCJjb25maXJtXCIgdmFyaWFudD1cInByaW1hcnlcIiBvbkNsaWNrPXtvbkNsb3NlfT5cbiAgICAgICAgICBDbG9zZVxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgIF19XG4gICAgICBpc0Zvb3RlckxlZnRBbGlnbmVkXG4gICAgPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJwZi1jLWNvbnRlbnRcIj5cbiAgICAgICAgPHA+VGhlIGZvbGxvd2luZyBrZXlib2FyZCBpbnRlcmFjdGlvbnMgYXJlIGF2YWlsYWJsZTo8L3A+XG4gICAgICAgIDx1bD5cbiAgICAgICAgICA8bGk+T25jZSBhIGNlbGwgaXMgc2VsZWN0ZWQsIGFycm93IGtleXMgY2FuIGJlIHVzZWQgdG8gbmF2aWdhdGUgYmV0d2VlbiB0aGUgY2VsbHMuPC9saT5cbiAgICAgICAgICA8bGk+VGhlIFRhYiBhbmQgU2hpZnQrVGFiIGtleXMgY2FuIGJlIHVzZWQgdG8gdGFiIHRvIHRoZSBuZXh0IGFuZCBwcmV2aW91cyBjZWxsLjwvbGk+XG4gICAgICAgICAgPGxpPkNNRCtDIC8gQ1RSTCtDIGNvcGllcyB0aGUgY2VsbCBjb250ZW50LjwvbGk+XG4gICAgICAgICAgeyFyZWFkT25seSAmJiA8PlxuICAgICAgICAgICAgPGxpPlVzZSB0aGUgRW50ZXIga2V5IG9uIGEgY2VsbCB0byBlbnRlciBlZGl0aW5nIG1vZGUuPC9saT5cbiAgICAgICAgICAgIDxsaT5DTUQrWiAvIENUUkwrWiB1bmRvZXMgdGhlIGxhc3QgY2hhbmdlLjwvbGk+XG4gICAgICAgICAgICA8bGk+Q01EK1NoaWZ0K1ogLyBDVFJMK1NoaWZ0K1ogcmVkb2VzIHRoZSBsYXN0IGNoYW5nZS48L2xpPlxuICAgICAgICAgICAgPGxpPldoZW4gaW4gZWRpdGluZyBtb2RlOlxuICAgICAgICAgICAgICA8dWw+XG4gICAgICAgICAgICAgICAgPGxpPlRoZSBFbnRlciBrZXkgd2lsbCBzYXZlIHRoZSBjdXJyZW50IGNlbGwgY29udGVudHMuPC9saT5cbiAgICAgICAgICAgICAgICA8bGk+VEhlIEVzY2FwZSBrZXkgd2lsbCByZXNldCB0aGUgY2VsbCBjb250ZW50cy48L2xpPlxuICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICA8Lz59XG4gICAgICAgIDwvdWw+XG4gICAgICA8L2Rpdj5cbiAgICA8L01vZGFsPlxuICApXG59O1xuXG5leHBvcnQgeyBIZWxwTW9kYWwgfTtcbiJdfQ==
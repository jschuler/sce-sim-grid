"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Spinner = void 0;

var React = _interopRequireWildcard(require("react"));

var _reactCore = require("@patternfly/react-core");

var _experimental = require("@patternfly/react-core/dist/js/experimental");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * Loading spinner used when loading the app and when loading the next page for the grid infinite scrolling
 */
var Spinner = function Spinner(_ref) {
  var text = _ref.text,
      className = _ref.className,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? 'xl' : _ref$size;
  return React.createElement(_reactCore.Bullseye, {
    className: className
  }, React.createElement("div", {
    className: "pf-l-flex pf-m-column"
  }, React.createElement("div", {
    className: "pf-l-flex__item",
    style: {
      textAlign: 'center'
    }
  }, React.createElement(_experimental.Spinner, {
    size: size
  })), text && React.createElement("div", null, React.createElement(_reactCore.Title, {
    headingLevel: "h1",
    size: "xl",
    className: "pf-u-mt-md"
  }, text))));
};

exports.Spinner = Spinner;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1NwaW5uZXIvU3Bpbm5lci50c3giXSwibmFtZXMiOlsiU3Bpbm5lciIsInRleHQiLCJjbGFzc05hbWUiLCJzaXplIiwidGV4dEFsaWduIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBR0E7O0FBQ0E7O0FBQ0E7Ozs7OztBQUxBOzs7QUFPQSxJQUFNQSxPQUFzRixHQUFHLFNBQXpGQSxPQUF5RjtBQUFBLE1BQUdDLElBQUgsUUFBR0EsSUFBSDtBQUFBLE1BQVNDLFNBQVQsUUFBU0EsU0FBVDtBQUFBLHVCQUFvQkMsSUFBcEI7QUFBQSxNQUFvQkEsSUFBcEIsMEJBQTJCLElBQTNCO0FBQUEsU0FDN0Ysb0JBQUMsbUJBQUQ7QUFBVSxJQUFBLFNBQVMsRUFBRUQ7QUFBckIsS0FDRTtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsS0FDRTtBQUFLLElBQUEsU0FBUyxFQUFDLGlCQUFmO0FBQWlDLElBQUEsS0FBSyxFQUFFO0FBQUVFLE1BQUFBLFNBQVMsRUFBRTtBQUFiO0FBQXhDLEtBQ0Usb0JBQUMscUJBQUQ7QUFBVyxJQUFBLElBQUksRUFBRUQ7QUFBakIsSUFERixDQURGLEVBSUdGLElBQUksSUFBSSxpQ0FDUCxvQkFBQyxnQkFBRDtBQUFPLElBQUEsWUFBWSxFQUFDLElBQXBCO0FBQXlCLElBQUEsSUFBSSxFQUFDLElBQTlCO0FBQW1DLElBQUEsU0FBUyxFQUFDO0FBQTdDLEtBQTJEQSxJQUEzRCxDQURPLENBSlgsQ0FERixDQUQ2RjtBQUFBLENBQS9GIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBMb2FkaW5nIHNwaW5uZXIgdXNlZCB3aGVuIGxvYWRpbmcgdGhlIGFwcCBhbmQgd2hlbiBsb2FkaW5nIHRoZSBuZXh0IHBhZ2UgZm9yIHRoZSBncmlkIGluZmluaXRlIHNjcm9sbGluZ1xuICovXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBCdWxsc2V5ZSwgVGl0bGUgfSBmcm9tICdAcGF0dGVybmZseS9yZWFjdC1jb3JlJztcbmltcG9ydCB7IFNwaW5uZXIgYXMgUGZTcGlubmVyLCBTcGlubmVyUHJvcHMgfSBmcm9tICdAcGF0dGVybmZseS9yZWFjdC1jb3JlL2Rpc3QvanMvZXhwZXJpbWVudGFsJztcblxuY29uc3QgU3Bpbm5lcjogUmVhY3QuU0ZDPHsgdGV4dD86IHN0cmluZywgY2xhc3NOYW1lPzogc3RyaW5nLCBzaXplPzogU3Bpbm5lclByb3BzWydzaXplJ10gfT4gPSAoeyB0ZXh0LCBjbGFzc05hbWUsIHNpemUgPSAneGwnIH0pID0+IChcbiAgPEJ1bGxzZXllIGNsYXNzTmFtZT17Y2xhc3NOYW1lfT5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cInBmLWwtZmxleCBwZi1tLWNvbHVtblwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJwZi1sLWZsZXhfX2l0ZW1cIiBzdHlsZT17eyB0ZXh0QWxpZ246ICdjZW50ZXInIH19PlxuICAgICAgICA8UGZTcGlubmVyIHNpemU9e3NpemV9IC8+XG4gICAgICA8L2Rpdj5cbiAgICAgIHt0ZXh0ICYmIDxkaXY+XG4gICAgICAgIDxUaXRsZSBoZWFkaW5nTGV2ZWw9XCJoMVwiIHNpemU9XCJ4bFwiIGNsYXNzTmFtZT1cInBmLXUtbXQtbWRcIj57dGV4dH08L1RpdGxlPlxuICAgICAgPC9kaXY+fVxuICAgIDwvZGl2PlxuICA8L0J1bGxzZXllPlxuKTtcblxuZXhwb3J0IHsgU3Bpbm5lciB9O1xuIl19
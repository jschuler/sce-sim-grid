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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvY29tcG9uZW50cy9TcGlubmVyL1NwaW5uZXIudHN4Il0sIm5hbWVzIjpbIlNwaW5uZXIiLCJ0ZXh0IiwiY2xhc3NOYW1lIiwic2l6ZSIsInRleHRBbGlnbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUdBOztBQUNBOztBQUNBOzs7Ozs7QUFMQTs7O0FBT0EsSUFBTUEsT0FBc0YsR0FBRyxTQUF6RkEsT0FBeUY7QUFBQSxNQUFHQyxJQUFILFFBQUdBLElBQUg7QUFBQSxNQUFTQyxTQUFULFFBQVNBLFNBQVQ7QUFBQSx1QkFBb0JDLElBQXBCO0FBQUEsTUFBb0JBLElBQXBCLDBCQUEyQixJQUEzQjtBQUFBLFNBQzdGLG9CQUFDLG1CQUFEO0FBQVUsSUFBQSxTQUFTLEVBQUVEO0FBQXJCLEtBQ0U7QUFBSyxJQUFBLFNBQVMsRUFBQztBQUFmLEtBQ0U7QUFBSyxJQUFBLFNBQVMsRUFBQyxpQkFBZjtBQUFpQyxJQUFBLEtBQUssRUFBRTtBQUFFRSxNQUFBQSxTQUFTLEVBQUU7QUFBYjtBQUF4QyxLQUNFLG9CQUFDLHFCQUFEO0FBQVcsSUFBQSxJQUFJLEVBQUVEO0FBQWpCLElBREYsQ0FERixFQUlHRixJQUFJLElBQUksaUNBQ1Asb0JBQUMsZ0JBQUQ7QUFBTyxJQUFBLFlBQVksRUFBQyxJQUFwQjtBQUF5QixJQUFBLElBQUksRUFBQyxJQUE5QjtBQUFtQyxJQUFBLFNBQVMsRUFBQztBQUE3QyxLQUEyREEsSUFBM0QsQ0FETyxDQUpYLENBREYsQ0FENkY7QUFBQSxDQUEvRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogTG9hZGluZyBzcGlubmVyIHVzZWQgd2hlbiBsb2FkaW5nIHRoZSBhcHAgYW5kIHdoZW4gbG9hZGluZyB0aGUgbmV4dCBwYWdlIGZvciB0aGUgZ3JpZCBpbmZpbml0ZSBzY3JvbGxpbmdcbiAqL1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQnVsbHNleWUsIFRpdGxlIH0gZnJvbSAnQHBhdHRlcm5mbHkvcmVhY3QtY29yZSc7XG5pbXBvcnQgeyBTcGlubmVyIGFzIFBmU3Bpbm5lciwgU3Bpbm5lclByb3BzIH0gZnJvbSAnQHBhdHRlcm5mbHkvcmVhY3QtY29yZS9kaXN0L2pzL2V4cGVyaW1lbnRhbCc7XG5cbmNvbnN0IFNwaW5uZXI6IFJlYWN0LlNGQzx7IHRleHQ/OiBzdHJpbmcsIGNsYXNzTmFtZT86IHN0cmluZywgc2l6ZT86IFNwaW5uZXJQcm9wc1snc2l6ZSddIH0+ID0gKHsgdGV4dCwgY2xhc3NOYW1lLCBzaXplID0gJ3hsJyB9KSA9PiAoXG4gIDxCdWxsc2V5ZSBjbGFzc05hbWU9e2NsYXNzTmFtZX0+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJwZi1sLWZsZXggcGYtbS1jb2x1bW5cIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGYtbC1mbGV4X19pdGVtXCIgc3R5bGU9e3sgdGV4dEFsaWduOiAnY2VudGVyJyB9fT5cbiAgICAgICAgPFBmU3Bpbm5lciBzaXplPXtzaXplfSAvPlxuICAgICAgPC9kaXY+XG4gICAgICB7dGV4dCAmJiA8ZGl2PlxuICAgICAgICA8VGl0bGUgaGVhZGluZ0xldmVsPVwiaDFcIiBzaXplPVwieGxcIiBjbGFzc05hbWU9XCJwZi11LW10LW1kXCI+e3RleHR9PC9UaXRsZT5cbiAgICAgIDwvZGl2Pn1cbiAgICA8L2Rpdj5cbiAgPC9CdWxsc2V5ZT5cbik7XG5cbmV4cG9ydCB7IFNwaW5uZXIgfTtcbiJdfQ==
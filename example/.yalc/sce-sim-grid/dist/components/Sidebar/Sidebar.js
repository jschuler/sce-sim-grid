"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DefinitionsDrawerPanel = void 0;

var React = _interopRequireWildcard(require("react"));

var _reactCore = require("@patternfly/react-core");

var _reactIcons = require("@patternfly/react-icons");

var _classnames = _interopRequireDefault(require("classnames"));

var _utils = require("../utils");

require("./Sidebar.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var DefinitionsDrawerPanel = React.memo(function (_ref) {
  var definitions = _ref.definitions,
      dmnFilePath = _ref.dmnFilePath;
  // const DefinitionsDrawerPanel: React.FC<{ definitions: any, dmnFilePath: string }> = ({ definitions, dmnFilePath }) => {
  console.log('render DefinitionsDrawerPanel'); // DMN file path ClipboardCopy expansion

  var _React$useState = React.useState(false),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      isExpanded = _React$useState2[0],
      setExpanded = _React$useState2[1];

  var _React$useState3 = React.useState(definitions),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      definitionsState = _React$useState4[0],
      setDefinitionsState = _React$useState4[1];

  var _React$useState5 = React.useState(dmnFilePath),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      dmnFilePathState = _React$useState6[0],
      setDmnFilePathState = _React$useState6[1];

  React.useEffect(function () {
    // scroll towards the end of the DMN file path input
    setTimeout(function () {
      var element = document.getElementById('dmnFilePath');

      if (element) {
        (0, _utils.setCaretPositionAtEnd)(element);
      }
    }, 1);
  }, [dmnFilePath]);
  React.useEffect(function () {
    if (definitions !== definitionsState) {
      setDefinitionsState(definitions);
    }

    if (dmnFilePath !== dmnFilePathState) {
      setDmnFilePathState(dmnFilePath);
    }
  }, [definitions, dmnFilePath]);
  /**
   * Toggles the DMN file path
   */

  var onToggle = function onToggle() {
    setExpanded(!isExpanded);
  };
  /**
   * Copy the DMN file path
   */


  var onCopy = function onCopy(event) {
    /* Get the text field */
    var copyText = document.getElementById('dmnFilePath');

    if (copyText && copyText.select) {
      /* Select the text field */
      copyText.select();
      copyText.setSelectionRange(0, 99999);
      /*For mobile devices*/

      /* Copy the text inside the text field */

      document.execCommand('copy'); // do not mark the whole text as selected

      (0, _utils.setCaretPositionAtEnd)(copyText);
    }
  };

  var ClipboardCopy = function ClipboardCopy() {
    return React.createElement("div", {
      className: (0, _classnames.default)('pf-c-clipboard-copy', isExpanded && 'pf-m-expanded')
    }, React.createElement("div", {
      className: "pf-c-clipboard-copy__group"
    }, React.createElement("button", {
      className: "pf-c-clipboard-copy__group-toggle",
      id: "dmnPathToggle",
      "aria-labelledby": "dmnPathToggle dmnFilePath",
      "aria-controls": "content-6",
      "aria-expanded": "true",
      "aria-label": "Show content",
      onClick: onToggle
    }, React.createElement(_reactIcons.AngleRightIcon, {
      className: "pf-c-clipboard-copy__group-toggle-icon"
    })), React.createElement("input", {
      className: "pf-c-form-control",
      readOnly: true,
      type: "text",
      value: dmnFilePathState,
      id: "dmnFilePath",
      "aria-label": "Copyable input"
    }), React.createElement("button", {
      className: "pf-c-clipboard-copy__group-copy",
      "aria-label": "Copy to clipboard",
      id: "dmnPathCopy",
      "aria-labelledby": "dmnPathCopy dmnFilePath",
      onClick: onCopy
    }, React.createElement(_reactIcons.CopyIcon, null))), isExpanded && React.createElement("div", {
      className: "pf-c-clipboard-copy__expandable-content",
      id: "dmnPathContent",
      style: {
        color: 'rgb(33, 36, 39)'
      }
    }, dmnFilePathState));
  };

  return React.createElement("div", null, React.createElement(_reactCore.TextContent, {
    className: "pf-u-m-lg"
  }, React.createElement("div", {
    className: "pf-u-mb-xl"
  }, React.createElement("div", null, "DMN file path"), React.createElement(ClipboardCopy, null)), React.createElement("p", null, "To create a test template, define the \"Given\" and \"Expect\" columns by using the expression editor below."), React.createElement("h2", null, "Select Data Object"), React.createElement("h3", null, "Complex Types"), definitionsState.complex.map(function (item) {
    return React.createElement(_reactCore.Expandable, {
      key: item.typeRef,
      toggleText: item.text
    }, Object.keys(item.elements).map(function (elementKey) {
      return React.createElement("div", {
        className: "pf-u-mb-sm",
        key: elementKey
      }, React.createElement(_reactCore.Button, {
        variant: "link"
      }, elementKey), React.createElement("span", null, " [", item.elements[elementKey], "]"));
    }));
  }), React.createElement("h3", null, "Simple Types"), definitionsState.simple.map(function (item) {
    return React.createElement(_reactCore.Expandable, {
      key: item.typeRef,
      toggleText: item.text
    }, Object.keys(item.elements).map(function (elementKey) {
      return React.createElement("div", {
        className: "pf-u-mb-sm",
        key: elementKey
      }, React.createElement(_reactCore.Button, {
        variant: "link"
      }, elementKey), React.createElement("span", null, " [", item.elements[elementKey], "]"));
    }));
  })));
}, function (prevProps, nextProps) {
  if (JSON.stringify(prevProps.definitions) !== JSON.stringify(nextProps.definitions)) {
    // definitions have changed, re-render
    return false;
  }

  if (prevProps.dmnFilePath !== nextProps.dmnFilePath) {
    // dmnFilePath have changed, re-render
    return false;
  }

  return true;
});
exports.DefinitionsDrawerPanel = DefinitionsDrawerPanel;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1NpZGViYXIvU2lkZWJhci50c3giXSwibmFtZXMiOlsiRGVmaW5pdGlvbnNEcmF3ZXJQYW5lbCIsIlJlYWN0IiwibWVtbyIsImRlZmluaXRpb25zIiwiZG1uRmlsZVBhdGgiLCJjb25zb2xlIiwibG9nIiwidXNlU3RhdGUiLCJpc0V4cGFuZGVkIiwic2V0RXhwYW5kZWQiLCJkZWZpbml0aW9uc1N0YXRlIiwic2V0RGVmaW5pdGlvbnNTdGF0ZSIsImRtbkZpbGVQYXRoU3RhdGUiLCJzZXREbW5GaWxlUGF0aFN0YXRlIiwidXNlRWZmZWN0Iiwic2V0VGltZW91dCIsImVsZW1lbnQiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwib25Ub2dnbGUiLCJvbkNvcHkiLCJldmVudCIsImNvcHlUZXh0Iiwic2VsZWN0Iiwic2V0U2VsZWN0aW9uUmFuZ2UiLCJleGVjQ29tbWFuZCIsIkNsaXBib2FyZENvcHkiLCJjb2xvciIsImNvbXBsZXgiLCJtYXAiLCJpdGVtIiwidHlwZVJlZiIsInRleHQiLCJPYmplY3QiLCJrZXlzIiwiZWxlbWVudHMiLCJlbGVtZW50S2V5Iiwic2ltcGxlIiwicHJldlByb3BzIiwibmV4dFByb3BzIiwiSlNPTiIsInN0cmluZ2lmeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsc0JBQXNCLEdBQUdDLEtBQUssQ0FBQ0MsSUFBTixDQUc1QixnQkFBa0M7QUFBQSxNQUEvQkMsV0FBK0IsUUFBL0JBLFdBQStCO0FBQUEsTUFBbEJDLFdBQWtCLFFBQWxCQSxXQUFrQjtBQUNyQztBQUNFQyxFQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSwrQkFBWixFQUZtQyxDQUluQzs7QUFKbUMsd0JBS0RMLEtBQUssQ0FBQ00sUUFBTixDQUFlLEtBQWYsQ0FMQztBQUFBO0FBQUEsTUFLNUJDLFVBTDRCO0FBQUEs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QUNHQyxNQUFNLENBQUNDLElBQVAsQ0FBWUosSUFBSSxDQUFDSyxRQUFqQixFQUEyQk4sR0FBM0IsQ0FBK0IsVUFBQ08sVUFBRDtBQUFBLGFBQzlCO0FBQUssUUFBQSxTQUFTLEVBQUMsWUFBZjtBQUE0QixRQUFBLEdBQUcsRUFBRUE7QUFBakMsU0FDRSxvQkFBQyxpQkFBRDtBQUFRLFFBQUEsT0FBTyxFQUFDO0FBQWhCLFNBQXdCQSxVQUF4QixDQURGLEVBRUUsd0NBQVNOLElBQUksQ0FBQ0ssUUFBTCxDQUFjQyxVQUFkLENBQVQsTUFGRixDQUQ4QjtBQUFBLEtBQS9CLENBREgsQ0FEMkI7QUFBQSxHQUE1QixDQXBCSCxDQURGLENBREY7QUFtQ0QsQ0FsSDhCLEVBa0g1QixVQUFDRSxTQUFELEVBQVlDLFNBQVosRUFBMEI7QUFDM0IsTUFBSUMsSUFBSSxDQUFDQyxTQUFMLENBQWVILFNBQVMsQ0FBQ25DLFdBQXpCLE1BQTBDcUMsSUFBSSxDQUFDQyxTQUFMLENBQWVGLFNBQVMsQ0FBQ3BDLFdBQXpCLENBQTlDLEVBQXFGO0FBQ25GO0FBQ0EsV0FBTyxLQUFQO0FBQ0Q7O0FBQ0QsTUFBSW1DLFNBQVMsQ0FBQ2xDLFdBQVYsS0FBMEJtQyxTQUFTLENBQUNuQyxXQUF4QyxFQUFxRDtBQUNuRDtBQUNBLFdBQU8sS0FBUDtBQUNEOztBQUNELFNBQU8sSUFBUDtBQUNELENBNUg4QixDQUEvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgRXhwYW5kYWJsZSwgVGV4dENvbnRlbnQsIEJ1dHRvbiB9IGZyb20gJ0BwYXR0ZXJuZmx5L3JlYWN0LWNvcmUnO1xuaW1wb3J0IHsgQ29weUljb24sIEFuZ2xlUmlnaHRJY29uIH0gZnJvbSAnQHBhdHRlcm5mbHkvcmVhY3QtaWNvbnMnO1xuaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQgeyBzZXRDYXJldFBvc2l0aW9uQXRFbmQgfSBmcm9tIFwiLi4vdXRpbHNcIjtcbmltcG9ydCAnLi9TaWRlYmFyLmNzcyc7XG5cbmNvbnN0IERlZmluaXRpb25zRHJhd2VyUGFuZWwgPSBSZWFjdC5tZW1vPHsgXG4gIGRlZmluaXRpb25zOiBhbnksIFxuICBkbW5GaWxlUGF0aDogc3RyaW5nXG59PigoeyBkZWZpbml0aW9ucywgZG1uRmlsZVBhdGggfSkgPT4ge1xuLy8gY29uc3QgRGVmaW5pdGlvbnNEcmF3ZXJQYW5lbDogUmVhY3QuRkM8eyBkZWZpbml0aW9uczogYW55LCBkbW5GaWxlUGF0aDogc3RyaW5nIH0+ID0gKHsgZGVmaW5pdGlvbnMsIGRtbkZpbGVQYXRoIH0pID0+IHtcbiAgY29uc29sZS5sb2coJ3JlbmRlciBEZWZpbml0aW9uc0RyYXdlclBhbmVsJyk7XG5cbiAgLy8gRE1OIGZpbGUgcGF0aCBDbGlwYm9hcmRDb3B5IGV4cGFuc2lvblxuICBjb25zdCBbaXNFeHBhbmRlZCwgc2V0RXhwYW5kZWRdID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbZGVmaW5pdGlvbnNTdGF0ZSwgc2V0RGVmaW5pdGlvbnNTdGF0ZV0gPSBSZWFjdC51c2VTdGF0ZShkZWZpbml0aW9ucyk7XG4gIGNvbnN0IFtkbW5GaWxlUGF0aFN0YXRlLCBzZXREbW5GaWxlUGF0aFN0YXRlXSA9IFJlYWN0LnVzZVN0YXRlKGRtbkZpbGVQYXRoKTtcblxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIC8vIHNjcm9sbCB0b3dhcmRzIHRoZSBlbmQgb2YgdGhlIERNTiBmaWxlIHBhdGggaW5wdXRcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZG1uRmlsZVBhdGgnKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgc2V0Q2FyZXRQb3NpdGlvbkF0RW5kKGVsZW1lbnQpO1xuICAgICAgfVxuICAgIH0sIDEpXG4gIH0sIFtkbW5GaWxlUGF0aF0pO1xuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGRlZmluaXRpb25zICE9PSBkZWZpbml0aW9uc1N0YXRlKSB7XG4gICAgICBzZXREZWZpbml0aW9uc1N0YXRlKGRlZmluaXRpb25zKTtcbiAgICB9XG4gICAgaWYgKGRtbkZpbGVQYXRoICE9PSBkbW5GaWxlUGF0aFN0YXRlKSB7XG4gICAgICBzZXREbW5GaWxlUGF0aFN0YXRlKGRtbkZpbGVQYXRoKTtcbiAgICB9XG4gIH0sIFtkZWZpbml0aW9ucywgZG1uRmlsZVBhdGhdKTtcblxuICAvKipcbiAgICogVG9nZ2xlcyB0aGUgRE1OIGZpbGUgcGF0aFxuICAgKi9cbiAgY29uc3Qgb25Ub2dnbGUgPSAoKSA9PiB7XG4gICAgc2V0RXhwYW5kZWQoIWlzRXhwYW5kZWQpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDb3B5IHRoZSBETU4gZmlsZSBwYXRoXG4gICAqL1xuICBjb25zdCBvbkNvcHkgPSAoZXZlbnQ6IGFueSkgPT4ge1xuICAgIC8qIEdldCB0aGUgdGV4dCBmaWVsZCAqL1xuICAgIGNvbnN0IGNvcHlUZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RtbkZpbGVQYXRoJykgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICBpZiAoY29weVRleHQgJiYgY29weVRleHQuc2VsZWN0KSB7XG4gICAgICAvKiBTZWxlY3QgdGhlIHRleHQgZmllbGQgKi9cbiAgICAgIGNvcHlUZXh0LnNlbGVjdCgpO1xuICAgICAgY29weVRleHQuc2V0U2VsZWN0aW9uUmFuZ2UoMCwgOTk5OTkpOyAvKkZvciBtb2JpbGUgZGV2aWNlcyovXG4gICAgICAvKiBDb3B5IHRoZSB0ZXh0IGluc2lkZSB0aGUgdGV4dCBmaWVsZCAqL1xuICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2NvcHknKTtcbiAgICAgIC8vIGRvIG5vdCBtYXJrIHRoZSB3aG9sZSB0ZXh0IGFzIHNlbGVjdGVkXG4gICAgICBzZXRDYXJldFBvc2l0aW9uQXRFbmQoY29weVRleHQpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBDbGlwYm9hcmRDb3B5ID0gKCkgPT4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc05hbWVzKCdwZi1jLWNsaXBib2FyZC1jb3B5JywgaXNFeHBhbmRlZCAmJiAncGYtbS1leHBhbmRlZCcpfT5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGYtYy1jbGlwYm9hcmQtY29weV9fZ3JvdXBcIj5cbiAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJwZi1jLWNsaXBib2FyZC1jb3B5X19ncm91cC10b2dnbGVcIlxuICAgICAgICAgICAgaWQ9XCJkbW5QYXRoVG9nZ2xlXCIgYXJpYS1sYWJlbGxlZGJ5PVwiZG1uUGF0aFRvZ2dsZSBkbW5GaWxlUGF0aFwiIGFyaWEtY29udHJvbHM9XCJjb250ZW50LTZcIlxuICAgICAgICAgICAgYXJpYS1leHBhbmRlZD1cInRydWVcIlxuICAgICAgICAgICAgYXJpYS1sYWJlbD1cIlNob3cgY29udGVudFwiXG4gICAgICAgICAgICBvbkNsaWNrPXtvblRvZ2dsZX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8QW5nbGVSaWdodEljb24gY2xhc3NOYW1lPVwicGYtYy1jbGlwYm9hcmQtY29weV9fZ3JvdXAtdG9nZ2xlLWljb25cIiAvPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cInBmLWMtZm9ybS1jb250cm9sXCIgcmVhZE9ubHkgdHlwZT1cInRleHRcIiB2YWx1ZT17ZG1uRmlsZVBhdGhTdGF0ZX0gaWQ9XCJkbW5GaWxlUGF0aFwiIGFyaWEtbGFiZWw9XCJDb3B5YWJsZSBpbnB1dFwiPjwvaW5wdXQ+XG4gICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwicGYtYy1jbGlwYm9hcmQtY29weV9fZ3JvdXAtY29weVwiXG4gICAgICAgICAgYXJpYS1sYWJlbD1cIkNvcHkgdG8gY2xpcGJvYXJkXCJcbiAgICAgICAgICAgIGlkPVwiZG1uUGF0aENvcHlcIiBcbiAgICAgICAgICAgIGFyaWEtbGFiZWxsZWRieT1cImRtblBhdGhDb3B5IGRtbkZpbGVQYXRoXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e29uQ29weX1cbiAgICAgICAgICA+XG4gICAgICAgICAgPENvcHlJY29uIC8+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgICB7aXNFeHBhbmRlZCAmJiA8ZGl2IGNsYXNzTmFtZT1cInBmLWMtY2xpcGJvYXJkLWNvcHlfX2V4cGFuZGFibGUtY29udGVudFwiIGlkPVwiZG1uUGF0aENvbnRlbnRcIiBzdHlsZT17eyBjb2xvcjogJ3JnYigzMywgMzYsIDM5KScgfX0+e2RtbkZpbGVQYXRoU3RhdGV9PC9kaXY+fVxuICAgIDwvZGl2PlxuICApO1xuICByZXR1cm4gKFxuICAgIDxkaXY+XG4gICAgICA8VGV4dENvbnRlbnQgY2xhc3NOYW1lPVwicGYtdS1tLWxnXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGYtdS1tYi14bFwiPlxuICAgICAgICAgIDxkaXY+RE1OIGZpbGUgcGF0aDwvZGl2PlxuICAgICAgICAgIDxDbGlwYm9hcmRDb3B5IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8cD5UbyBjcmVhdGUgYSB0ZXN0IHRlbXBsYXRlLCBkZWZpbmUgdGhlIFwiR2l2ZW5cIiBhbmQgXCJFeHBlY3RcIiBjb2x1bW5zIGJ5IHVzaW5nIHRoZSBleHByZXNzaW9uIGVkaXRvciBiZWxvdy48L3A+XG4gICAgICAgIDxoMj5TZWxlY3QgRGF0YSBPYmplY3Q8L2gyPlxuICAgICAgICA8aDM+Q29tcGxleCBUeXBlczwvaDM+XG4gICAgICAgIHtkZWZpbml0aW9uc1N0YXRlLmNvbXBsZXgubWFwKChpdGVtOiBhbnkpID0+IChcbiAgICAgICAgICA8RXhwYW5kYWJsZSBrZXk9e2l0ZW0udHlwZVJlZn0gdG9nZ2xlVGV4dD17aXRlbS50ZXh0fT5cbiAgICAgICAgICAgIHtPYmplY3Qua2V5cyhpdGVtLmVsZW1lbnRzKS5tYXAoKGVsZW1lbnRLZXk6IGFueSkgPT4gKFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBmLXUtbWItc21cIiBrZXk9e2VsZW1lbnRLZXl9PlxuICAgICAgICAgICAgICAgIDxCdXR0b24gdmFyaWFudD1cImxpbmtcIj57ZWxlbWVudEtleX08L0J1dHRvbj5cbiAgICAgICAgICAgICAgICA8c3Bhbj4gW3tpdGVtLmVsZW1lbnRzW2VsZW1lbnRLZXldfV08L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKSl9XG4gICAgICAgICAgPC9FeHBhbmRhYmxlPlxuICAgICAgICApKX1cbiAgICAgICAgXG4gICAgICAgIDxoMz5TaW1wbGUgVHlwZXM8L2gzPlxuICAgICAgICB7ZGVmaW5pdGlvbnNTdGF0ZS5zaW1wbGUubWFwKChpdGVtOiBhbnkpID0+IChcbiAgICAgICAgICA8RXhwYW5kYWJsZSBrZXk9e2l0ZW0udHlwZVJlZn0gdG9nZ2xlVGV4dD17aXRlbS50ZXh0fT5cbiAgICAgICAgICAgIHtPYmplY3Qua2V5cyhpdGVtLmVsZW1lbnRzKS5tYXAoKGVsZW1lbnRLZXk6IGFueSkgPT4gKFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBmLXUtbWItc21cIiBrZXk9e2VsZW1lbnRLZXl9PlxuICAgICAgICAgICAgICAgIDxCdXR0b24gdmFyaWFudD1cImxpbmtcIj57ZWxlbWVudEtleX08L0J1dHRvbj5cbiAgICAgICAgICAgICAgICA8c3Bhbj4gW3tpdGVtLmVsZW1lbnRzW2VsZW1lbnRLZXldfV08L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKSl9XG4gICAgICAgICAgPC9FeHBhbmRhYmxlPlxuICAgICAgICApKX1cbiAgICAgIDwvVGV4dENvbnRlbnQ+XG4gICAgPC9kaXY+XG4gIClcbn0sIChwcmV2UHJvcHMsIG5leHRQcm9wcykgPT4ge1xuICBpZiAoSlNPTi5zdHJpbmdpZnkocHJldlByb3BzLmRlZmluaXRpb25zKSAhPT0gSlNPTi5zdHJpbmdpZnkobmV4dFByb3BzLmRlZmluaXRpb25zKSkge1xuICAgIC8vIGRlZmluaXRpb25zIGhhdmUgY2hhbmdlZCwgcmUtcmVuZGVyXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChwcmV2UHJvcHMuZG1uRmlsZVBhdGggIT09IG5leHRQcm9wcy5kbW5GaWxlUGF0aCkge1xuICAgIC8vIGRtbkZpbGVQYXRoIGhhdmUgY2hhbmdlZCwgcmUtcmVuZGVyXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufSk7XG5cbmV4cG9ydCB7IERlZmluaXRpb25zRHJhd2VyUGFuZWwgfTtcbiJdfQ==
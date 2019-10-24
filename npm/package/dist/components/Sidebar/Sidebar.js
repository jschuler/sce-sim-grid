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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvY29tcG9uZW50cy9TaWRlYmFyL1NpZGViYXIudHN4Il0sIm5hbWVzIjpbIkRlZmluaXRpb25zRHJhd2VyUGFuZWwiLCJSZWFjdCIsIm1lbW8iLCJkZWZpbml0aW9ucyIsImRtbkZpbGVQYXRoIiwiY29uc29sZSIsImxvZyIsInVzZVN0YXRlIiwiaXNFeHBhbmRlZCIsInNldEV4cGFuZGVkIiwiZGVmaW5pdGlvbnNTdGF0ZSIsInNldERlZmluaXRpb25zU3RhdGUiLCJkbW5GaWxlUGF0aFN0YXRlIiwic2V0RG1uRmlsZVBhdGhTdGF0ZSIsInVzZUVmZmVjdCIsInNldFRpbWVvdXQiLCJlbGVtZW50IiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsIm9uVG9nZ2xlIiwib25Db3B5IiwiZXZlbnQiLCJjb3B5VGV4dCIsInNlbGVjdCIsInNldFNlbGVjdGlvblJhbmdlIiwiZXhlY0NvbW1hbmQiLCJDbGlwYm9hcmRDb3B5IiwiY29sb3IiLCJjb21wbGV4IiwibWFwIiwiaXRlbSIsInR5cGVSZWYiLCJ0ZXh0IiwiT2JqZWN0Iiwia2V5cyIsImVsZW1lbnRzIiwiZWxlbWVudEtleSIsInNpbXBsZSIsInByZXZQcm9wcyIsIm5leHRQcm9wcyIsIkpTT04iLCJzdHJpbmdpZnkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLHNCQUFzQixHQUFHQyxLQUFLLENBQUNDLElBQU4sQ0FHNUIsZ0JBQWtDO0FBQUEsTUFBL0JDLFdBQStCLFFBQS9CQSxXQUErQjtBQUFBLE1BQWxCQyxXQUFrQixRQUFsQkEsV0FBa0I7QUFDckM7QUFDRUMsRUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksK0JBQVosRUFGbUMsQ0FJbkM7O0FBSm1DLHdCQUtETCxLQUFLLENBQUNNLFFBQU4sQ0FBZSxLQUFmLENBTEM7QUFBQTtBQUFBLE1BSzVCQyxVQUw0QjtB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aEQsT0FDR0MsTUFBTSxDQUFDQyxJQUFQLENBQVlKLElBQUksQ0FBQ0ssUUFBakIsRUFBMkJOLEdBQTNCLENBQStCLFVBQUNPLFVBQUQ7QUFBQSxhQUM5QjtBQUFLLFFBQUEsU0FBUyxFQUFDLFlBQWY7QUFBNEIsUUFBQSxHQUFHLEVBQUVBO0FBQWpDLFNBQ0Usb0JBQUMsaUJBQUQ7QUFBUSxRQUFBLE9BQU8sRUFBQztBQUFoQixTQUF3QkEsVUFBeEIsQ0FERixFQUVFLHdDQUFTTixJQUFJLENBQUNLLFFBQUwsQ0FBY0MsVUFBZCxDQUFULE1BRkYsQ0FEOEI7QUFBQSxLQUEvQixDQURILENBRDJCO0FBQUEsR0FBNUIsQ0FwQkgsQ0FERixDQURGO0FBbUNELENBbEg4QixFQWtINUIsVUFBQ0UsU0FBRCxFQUFZQyxTQUFaLEVBQTBCO0FBQzNCLE1BQUlDLElBQUksQ0FBQ0MsU0FBTCxDQUFlSCxTQUFTLENBQUNuQyxXQUF6QixNQUEwQ3FDLElBQUksQ0FBQ0MsU0FBTCxDQUFlRixTQUFTLENBQUNwQyxXQUF6QixDQUE5QyxFQUFxRjtBQUNuRjtBQUNBLFdBQU8sS0FBUDtBQUNEOztBQUNELE1BQUltQyxTQUFTLENBQUNsQyxXQUFWLEtBQTBCbUMsU0FBUyxDQUFDbkMsV0FBeEMsRUFBcUQ7QUFDbkQ7QUFDQSxXQUFPLEtBQVA7QUFDRDs7QUFDRCxTQUFPLElBQVA7QUFDRCxDQTVIOEIsQ0FBL0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IEV4cGFuZGFibGUsIFRleHRDb250ZW50LCBCdXR0b24gfSBmcm9tICdAcGF0dGVybmZseS9yZWFjdC1jb3JlJztcbmltcG9ydCB7IENvcHlJY29uLCBBbmdsZVJpZ2h0SWNvbiB9IGZyb20gJ0BwYXR0ZXJuZmx5L3JlYWN0LWljb25zJztcbmltcG9ydCBjbGFzc05hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHsgc2V0Q2FyZXRQb3NpdGlvbkF0RW5kIH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5pbXBvcnQgJy4vU2lkZWJhci5jc3MnO1xuXG5jb25zdCBEZWZpbml0aW9uc0RyYXdlclBhbmVsID0gUmVhY3QubWVtbzx7IFxuICBkZWZpbml0aW9uczogYW55LCBcbiAgZG1uRmlsZVBhdGg6IHN0cmluZ1xufT4oKHsgZGVmaW5pdGlvbnMsIGRtbkZpbGVQYXRoIH0pID0+IHtcbi8vIGNvbnN0IERlZmluaXRpb25zRHJhd2VyUGFuZWw6IFJlYWN0LkZDPHsgZGVmaW5pdGlvbnM6IGFueSwgZG1uRmlsZVBhdGg6IHN0cmluZyB9PiA9ICh7IGRlZmluaXRpb25zLCBkbW5GaWxlUGF0aCB9KSA9PiB7XG4gIGNvbnNvbGUubG9nKCdyZW5kZXIgRGVmaW5pdGlvbnNEcmF3ZXJQYW5lbCcpO1xuXG4gIC8vIERNTiBmaWxlIHBhdGggQ2xpcGJvYXJkQ29weSBleHBhbnNpb25cbiAgY29uc3QgW2lzRXhwYW5kZWQsIHNldEV4cGFuZGVkXSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW2RlZmluaXRpb25zU3RhdGUsIHNldERlZmluaXRpb25zU3RhdGVdID0gUmVhY3QudXNlU3RhdGUoZGVmaW5pdGlvbnMpO1xuICBjb25zdCBbZG1uRmlsZVBhdGhTdGF0ZSwgc2V0RG1uRmlsZVBhdGhTdGF0ZV0gPSBSZWFjdC51c2VTdGF0ZShkbW5GaWxlUGF0aCk7XG5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAvLyBzY3JvbGwgdG93YXJkcyB0aGUgZW5kIG9mIHRoZSBETU4gZmlsZSBwYXRoIGlucHV0XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RtbkZpbGVQYXRoJykgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgIHNldENhcmV0UG9zaXRpb25BdEVuZChlbGVtZW50KTtcbiAgICAgIH1cbiAgICB9LCAxKVxuICB9LCBbZG1uRmlsZVBhdGhdKTtcblxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChkZWZpbml0aW9ucyAhPT0gZGVmaW5pdGlvbnNTdGF0ZSkge1xuICAgICAgc2V0RGVmaW5pdGlvbnNTdGF0ZShkZWZpbml0aW9ucyk7XG4gICAgfVxuICAgIGlmIChkbW5GaWxlUGF0aCAhPT0gZG1uRmlsZVBhdGhTdGF0ZSkge1xuICAgICAgc2V0RG1uRmlsZVBhdGhTdGF0ZShkbW5GaWxlUGF0aCk7XG4gICAgfVxuICB9LCBbZGVmaW5pdGlvbnMsIGRtbkZpbGVQYXRoXSk7XG5cbiAgLyoqXG4gICAqIFRvZ2dsZXMgdGhlIERNTiBmaWxlIHBhdGhcbiAgICovXG4gIGNvbnN0IG9uVG9nZ2xlID0gKCkgPT4ge1xuICAgIHNldEV4cGFuZGVkKCFpc0V4cGFuZGVkKTtcbiAgfTtcblxuICAvKipcbiAgICogQ29weSB0aGUgRE1OIGZpbGUgcGF0aFxuICAgKi9cbiAgY29uc3Qgb25Db3B5ID0gKGV2ZW50OiBhbnkpID0+IHtcbiAgICAvKiBHZXQgdGhlIHRleHQgZmllbGQgKi9cbiAgICBjb25zdCBjb3B5VGV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkbW5GaWxlUGF0aCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgaWYgKGNvcHlUZXh0ICYmIGNvcHlUZXh0LnNlbGVjdCkge1xuICAgICAgLyogU2VsZWN0IHRoZSB0ZXh0IGZpZWxkICovXG4gICAgICBjb3B5VGV4dC5zZWxlY3QoKTtcbiAgICAgIGNvcHlUZXh0LnNldFNlbGVjdGlvblJhbmdlKDAsIDk5OTk5KTsgLypGb3IgbW9iaWxlIGRldmljZXMqL1xuICAgICAgLyogQ29weSB0aGUgdGV4dCBpbnNpZGUgdGhlIHRleHQgZmllbGQgKi9cbiAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdjb3B5Jyk7XG4gICAgICAvLyBkbyBub3QgbWFyayB0aGUgd2hvbGUgdGV4dCBhcyBzZWxlY3RlZFxuICAgICAgc2V0Q2FyZXRQb3NpdGlvbkF0RW5kKGNvcHlUZXh0KTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgQ2xpcGJvYXJkQ29weSA9ICgpID0+IChcbiAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NOYW1lcygncGYtYy1jbGlwYm9hcmQtY29weScsIGlzRXhwYW5kZWQgJiYgJ3BmLW0tZXhwYW5kZWQnKX0+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInBmLWMtY2xpcGJvYXJkLWNvcHlfX2dyb3VwXCI+XG4gICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwicGYtYy1jbGlwYm9hcmQtY29weV9fZ3JvdXAtdG9nZ2xlXCJcbiAgICAgICAgICAgIGlkPVwiZG1uUGF0aFRvZ2dsZVwiIGFyaWEtbGFiZWxsZWRieT1cImRtblBhdGhUb2dnbGUgZG1uRmlsZVBhdGhcIiBhcmlhLWNvbnRyb2xzPVwiY29udGVudC02XCJcbiAgICAgICAgICAgIGFyaWEtZXhwYW5kZWQ9XCJ0cnVlXCJcbiAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJTaG93IGNvbnRlbnRcIlxuICAgICAgICAgICAgb25DbGljaz17b25Ub2dnbGV9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPEFuZ2xlUmlnaHRJY29uIGNsYXNzTmFtZT1cInBmLWMtY2xpcGJvYXJkLWNvcHlfX2dyb3VwLXRvZ2dsZS1pY29uXCIgLz5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJwZi1jLWZvcm0tY29udHJvbFwiIHJlYWRPbmx5IHR5cGU9XCJ0ZXh0XCIgdmFsdWU9e2RtbkZpbGVQYXRoU3RhdGV9IGlkPVwiZG1uRmlsZVBhdGhcIiBhcmlhLWxhYmVsPVwiQ29weWFibGUgaW5wdXRcIj48L2lucHV0PlxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cInBmLWMtY2xpcGJvYXJkLWNvcHlfX2dyb3VwLWNvcHlcIlxuICAgICAgICAgIGFyaWEtbGFiZWw9XCJDb3B5IHRvIGNsaXBib2FyZFwiXG4gICAgICAgICAgICBpZD1cImRtblBhdGhDb3B5XCIgXG4gICAgICAgICAgICBhcmlhLWxhYmVsbGVkYnk9XCJkbW5QYXRoQ29weSBkbW5GaWxlUGF0aFwiXG4gICAgICAgICAgICBvbkNsaWNrPXtvbkNvcHl9XG4gICAgICAgICAgPlxuICAgICAgICAgIDxDb3B5SWNvbiAvPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgICAge2lzRXhwYW5kZWQgJiYgPGRpdiBjbGFzc05hbWU9XCJwZi1jLWNsaXBib2FyZC1jb3B5X19leHBhbmRhYmxlLWNvbnRlbnRcIiBpZD1cImRtblBhdGhDb250ZW50XCIgc3R5bGU9e3sgY29sb3I6ICdyZ2IoMzMsIDM2LCAzOSknIH19PntkbW5GaWxlUGF0aFN0YXRlfTwvZGl2Pn1cbiAgICA8L2Rpdj5cbiAgKTtcbiAgcmV0dXJuIChcbiAgICA8ZGl2PlxuICAgICAgPFRleHRDb250ZW50IGNsYXNzTmFtZT1cInBmLXUtbS1sZ1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBmLXUtbWIteGxcIj5cbiAgICAgICAgICA8ZGl2PkRNTiBmaWxlIHBhdGg8L2Rpdj5cbiAgICAgICAgICA8Q2xpcGJvYXJkQ29weSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPHA+VG8gY3JlYXRlIGEgdGVzdCB0ZW1wbGF0ZSwgZGVmaW5lIHRoZSBcIkdpdmVuXCIgYW5kIFwiRXhwZWN0XCIgY29sdW1ucyBieSB1c2luZyB0aGUgZXhwcmVzc2lvbiBlZGl0b3IgYmVsb3cuPC9wPlxuICAgICAgICA8aDI+U2VsZWN0IERhdGEgT2JqZWN0PC9oMj5cbiAgICAgICAgPGgzPkNvbXBsZXggVHlwZXM8L2gzPlxuICAgICAgICB7ZGVmaW5pdGlvbnNTdGF0ZS5jb21wbGV4Lm1hcCgoaXRlbTogYW55KSA9PiAoXG4gICAgICAgICAgPEV4cGFuZGFibGUga2V5PXtpdGVtLnR5cGVSZWZ9IHRvZ2dsZVRleHQ9e2l0ZW0udGV4dH0+XG4gICAgICAgICAgICB7T2JqZWN0LmtleXMoaXRlbS5lbGVtZW50cykubWFwKChlbGVtZW50S2V5OiBhbnkpID0+IChcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwZi11LW1iLXNtXCIga2V5PXtlbGVtZW50S2V5fT5cbiAgICAgICAgICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJsaW5rXCI+e2VsZW1lbnRLZXl9PC9CdXR0b24+XG4gICAgICAgICAgICAgICAgPHNwYW4+IFt7aXRlbS5lbGVtZW50c1tlbGVtZW50S2V5XX1dPC9zcGFuPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgIDwvRXhwYW5kYWJsZT5cbiAgICAgICAgKSl9XG4gICAgICAgIFxuICAgICAgICA8aDM+U2ltcGxlIFR5cGVzPC9oMz5cbiAgICAgICAge2RlZmluaXRpb25zU3RhdGUuc2ltcGxlLm1hcCgoaXRlbTogYW55KSA9PiAoXG4gICAgICAgICAgPEV4cGFuZGFibGUga2V5PXtpdGVtLnR5cGVSZWZ9IHRvZ2dsZVRleHQ9e2l0ZW0udGV4dH0+XG4gICAgICAgICAgICB7T2JqZWN0LmtleXMoaXRlbS5lbGVtZW50cykubWFwKChlbGVtZW50S2V5OiBhbnkpID0+IChcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwZi11LW1iLXNtXCIga2V5PXtlbGVtZW50S2V5fT5cbiAgICAgICAgICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJsaW5rXCI+e2VsZW1lbnRLZXl9PC9CdXR0b24+XG4gICAgICAgICAgICAgICAgPHNwYW4+IFt7aXRlbS5lbGVtZW50c1tlbGVtZW50S2V5XX1dPC9zcGFuPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgIDwvRXhwYW5kYWJsZT5cbiAgICAgICAgKSl9XG4gICAgICA8L1RleHRDb250ZW50PlxuICAgIDwvZGl2PlxuICApXG59LCAocHJldlByb3BzLCBuZXh0UHJvcHMpID0+IHtcbiAgaWYgKEpTT04uc3RyaW5naWZ5KHByZXZQcm9wcy5kZWZpbml0aW9ucykgIT09IEpTT04uc3RyaW5naWZ5KG5leHRQcm9wcy5kZWZpbml0aW9ucykpIHtcbiAgICAvLyBkZWZpbml0aW9ucyBoYXZlIGNoYW5nZWQsIHJlLXJlbmRlclxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAocHJldlByb3BzLmRtbkZpbGVQYXRoICE9PSBuZXh0UHJvcHMuZG1uRmlsZVBhdGgpIHtcbiAgICAvLyBkbW5GaWxlUGF0aCBoYXZlIGNoYW5nZWQsIHJlLXJlbmRlclxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn0pO1xuXG5leHBvcnQgeyBEZWZpbml0aW9uc0RyYXdlclBhbmVsIH07XG4iXX0=
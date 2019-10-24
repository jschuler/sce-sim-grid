"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Select = void 0;

var React = _interopRequireWildcard(require("react"));

var _reactCore = require("@patternfly/react-core");

require("./Input.css");

require("./Select.css");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var Select = React.memo(function (_ref) {
  var originalValue = _ref.originalValue,
      path = _ref.path,
      id = _ref.id,
      type = _ref.type,
      isReadOnly = _ref.isReadOnly,
      onSelectToggleCallback = _ref.onSelectToggleCallback,
      options = _ref.options,
      deactivateAndFocusCell = _ref.deactivateAndFocusCell,
      setEditable = _ref.setEditable,
      onSave = _ref.onSave;

  // console.log('render Select');
  var _React$useState = React.useState(true),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      isExpanded = _React$useState2[0],
      setExpanded = _React$useState2[1];

  var _React$useState3 = React.useState(originalValue),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      selected = _React$useState4[0],
      setSelected = _React$useState4[1];

  var _React$useState5 = React.useState(originalValue),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      savedSelection = _React$useState6[0],
      setSavedSelection = _React$useState6[1];

  var _React$useState7 = React.useState(false),
      _React$useState8 = _slicedToArray(_React$useState7, 2),
      overflown = _React$useState8[0],
      setOverflown = _React$useState8[1];

  React.useEffect(function () {
    // workaround to focus on the first list item to enable keyboard navigation
    if (!isReadOnly) {
      onToggle(true);
      setTimeout(function () {
        var element = document.querySelector("button[id=\"".concat(id, "\"]"));

        if (element && element.parentNode && element.parentNode.querySelector('.pf-c-select__menu-item')) {
          element.parentNode.querySelector('.pf-c-select__menu-item').focus();
        }
      }, 1);
    }
  }, [isReadOnly]);
  React.useEffect(function () {
    setSelected(originalValue);
    setSavedSelection(originalValue);
  }, [originalValue]);
  /**
   * Returns the current DOM element
   * 
   * TODO: Possibly change to React refs
   */

  var thisElement = function thisElement() {
    return document.getElementById(id);
  };
  /**
   * Saves the current value
   */


  var save = function save(selection) {
    setSelected(selection);

    if (savedSelection !== selection) {
      setSavedSelection(selection);
      onSave && onSave(id, selection, originalValue);
    }
  };
  /**
   * The Select options
   */


  var selectOptions = options.map(function (option, index) {
    return React.createElement(_reactCore.SelectOption, {
      key: index,
      value: option,
      isSelected: true
    });
  });
  /**
   * Toggle the Select
   */

  var onToggle = function onToggle(isExpanded) {
    setExpanded(isExpanded);
    onSelectToggleCallback(id, isExpanded);
  };
  /**
   * Set the selection
   */


  var onSelect = function onSelect(event, selection) {
    // close the dropdown
    onToggle(false); // save operation

    save(selection); // mark itself as not editable but maintain focus

    setTimeout(function () {
      deactivateAndFocusCell(id);
    }, 1);
  };

  var onKeyDown = function onKeyDown(event) {
    var key = event.key;

    if (key === 'Escape') {
      onSelectToggleCallback(false);
      setTimeout(function () {
        deactivateAndFocusCell(id);
      }, 1);
    }
  };
  /**
   * Check if the element is overflown
   */


  var checkForOverflow = function checkForOverflow(event) {
    var element = event ? event.target : thisElement();
    var isOverflown = element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
    setOverflown(isOverflown);
  };

  return React.createElement(React.Fragment, null, isReadOnly ? React.createElement(_reactCore.Tooltip, {
    content: selected,
    distance: 0,
    exitDelay: 0,
    trigger: overflown ? 'mouseenter focus' : 'manual'
  }, React.createElement("input", {
    onMouseOver: checkForOverflow,
    className: "editor-input truncate",
    style: {
      cursor: 'default',
      textAlign: type === 'string' ? 'left' : 'center'
    },
    type: "text",
    value: selected,
    id: id,
    "aria-label": selected,
    readOnly: true
  })) : React.createElement(_reactCore.Select, {
    toggleId: id,
    variant: _reactCore.SelectVariant.single,
    "aria-label": "Select Input",
    onToggle: onToggle,
    onSelect: onSelect,
    selections: selected,
    isExpanded: isExpanded,
    ariaLabelledBy: "typeahead-select-id",
    onKeyDown: onKeyDown
  }, selectOptions));
}, function (prevProps, nextProps) {
  var shouldRerender = prevProps.isReadOnly !== nextProps.isReadOnly || prevProps.originalValue !== nextProps.originalValue;

  if (shouldRerender) {
    console.log("prevProps ".concat(prevProps.originalValue, ", nextProps ").concat(nextProps.originalValue));
    return false;
  }

  return true;
});
exports.Select = Select;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvY29tcG9uZW50cy9DZWxsL1NlbGVjdC50c3giXSwibmFtZXMiOlsiU2VsZWN0IiwiUmVhY3QiLCJtZW1vIiwib3JpZ2luYWxWYWx1ZSIsInBhdGgiLCJpZCIsInR5cGUiLCJpc1JlYWRPbmx5Iiwib25TZWxlY3RUb2dnbGVDYWxsYmFjayIsIm9wdGlvbnMiLCJkZWFjdGl2YXRlQW5kRm9jdXNDZWxsIiwic2V0RWRpdGFibGUiLCJvblNhdmUiLCJ1c2VTdGF0ZSIsImlzRXhwYW5kZWQiLCJzZXRFeHBhbmRlZCIsInNlbGVjdGVkIiwic2V0U2VsZWN0ZWQiLCJzYXZlZFNlbGVjdGlvbiIsInNldFNhdmVkU2VsZWN0aW9uIiwib3ZlcmZsb3duIiwic2V0T3ZlcmZsb3duIiwidXNlRWZmZWN0Iiwib25Ub2dnbGUiLCJzZXRUaW1lb3V0IiwiZWxlbWVudCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsInBhcmVudE5vZGUiLCJmb2N1cyIsInRoaXNFbGVtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJzYXZlIiwic2VsZWN0aW9uIiwic2VsZWN0T3B0aW9ucyIsIm1hcCIsIm9wdGlvbiIsImluZGV4Iiwib25TZWxlY3QiLCJldmVudCIsIm9uS2V5RG93biIsImtleSIsImNoZWNrRm9yT3ZlcmZsb3ciLCJ0YXJnZXQiLCJpc092ZXJmbG93biIsInNjcm9sbEhlaWdodCIsImNsaWVudEhlaWdodCIsInNjcm9sbFdpZHRoIiwiY2xpZW50V2lkdGgiLCJjdXJzb3IiLCJ0ZXh0QWxpZ24iLCJTZWxlY3RWYXJpYW50Iiwic2luZ2xlIiwicHJldlByb3BzIiwibmV4dFByb3BzIiwic2hvdWxkUmVyZW5kZXIiLCJjb25zb2xlIiwibG9nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsTUFBTSxHQUFHQyxLQUFLLENBQUNDLElBQU4sQ0FXWixnQkFXRztBQUFBLE1BVkpD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LFNBQVMsQ0FBQ2xELGFBQVYsS0FBNEJtRCxTQUFTLENBQUNuRCxhQUFqSDs7QUFDQSxNQUFJb0QsY0FBSixFQUFvQjtBQUNsQkMsSUFBQUEsT0FBTyxDQUFDQyxHQUFSLHFCQUF5QkosU0FBUyxDQUFDbEQsYUFBbkMseUJBQStEbUQsU0FBUyxDQUFDbkQsYUFBekU7QUFDQSxXQUFPLEtBQVA7QUFDRDs7QUFDRCxTQUFPLElBQVA7QUFDRCxDQXpKYyxDQUFmIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBUb29sdGlwLCBTZWxlY3QgYXMgUGZTZWxlY3QsIFNlbGVjdE9wdGlvbiwgU2VsZWN0VmFyaWFudCwgU2VsZWN0T3B0aW9uT2JqZWN0IH0gZnJvbSAnQHBhdHRlcm5mbHkvcmVhY3QtY29yZSc7XG5pbXBvcnQgJy4vSW5wdXQuY3NzJztcbmltcG9ydCAnLi9TZWxlY3QuY3NzJztcblxuY29uc3QgU2VsZWN0ID0gUmVhY3QubWVtbzx7IFxuICBvcmlnaW5hbFZhbHVlPzogYW55LCBcbiAgcGF0aD86IHN0cmluZywgXG4gIGlkPzogYW55LCBcbiAgdHlwZT86IHN0cmluZywgXG4gIGlzUmVhZE9ubHk/OiBib29sZWFuLFxuICBvblNlbGVjdFRvZ2dsZUNhbGxiYWNrPzogYW55LFxuICBvcHRpb25zPzogYW55LFxuICBkZWFjdGl2YXRlQW5kRm9jdXNDZWxsPzogYW55LFxuICBzZXRFZGl0YWJsZTogYW55LFxuICBvblNhdmU6IGFueVxufT4oKHsgXG4gIG9yaWdpbmFsVmFsdWUsIFxuICBwYXRoLCBcbiAgaWQsIFxuICB0eXBlLCBcbiAgaXNSZWFkT25seSwgXG4gIG9uU2VsZWN0VG9nZ2xlQ2FsbGJhY2ssIFxuICBvcHRpb25zLCBcbiAgZGVhY3RpdmF0ZUFuZEZvY3VzQ2VsbCwgXG4gIHNldEVkaXRhYmxlLFxuICBvblNhdmVcbn0pID0+IHtcbiAgLy8gY29uc29sZS5sb2coJ3JlbmRlciBTZWxlY3QnKTtcbiAgY29uc3QgW2lzRXhwYW5kZWQsIHNldEV4cGFuZGVkXSA9IFJlYWN0LnVzZVN0YXRlPGJvb2xlYW4+KHRydWUpO1xuICBjb25zdCBbc2VsZWN0ZWQsIHNldFNlbGVjdGVkXSA9IFJlYWN0LnVzZVN0YXRlPGFueT4ob3JpZ2luYWxWYWx1ZSk7XG4gIGNvbnN0IFtzYXZlZFNlbGVjdGlvbiwgc2V0U2F2ZWRTZWxlY3Rpb25dID0gUmVhY3QudXNlU3RhdGU8YW55PihvcmlnaW5hbFZhbHVlKTtcbiAgY29uc3QgW292ZXJmbG93biwgc2V0T3ZlcmZsb3duXSA9IFJlYWN0LnVzZVN0YXRlPGJvb2xlYW4+KGZhbHNlKTtcblxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIC8vIHdvcmthcm91bmQgdG8gZm9jdXMgb24gdGhlIGZpcnN0IGxpc3QgaXRlbSB0byBlbmFibGUga2V5Ym9hcmQgbmF2aWdhdGlvblxuICAgIGlmICghaXNSZWFkT25seSkge1xuICAgICAgb25Ub2dnbGUodHJ1ZSk7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGJ1dHRvbltpZD1cIiR7aWR9XCJdYCk7XG4gICAgICAgIGlmIChlbGVtZW50ICYmIGVsZW1lbnQucGFyZW50Tm9kZSAmJiAoZWxlbWVudC5wYXJlbnROb2RlIGFzIEhUTUxFbGVtZW50KS5xdWVyeVNlbGVjdG9yKCcucGYtYy1zZWxlY3RfX21lbnUtaXRlbScpKSB7XG4gICAgICAgICAgKChlbGVtZW50LnBhcmVudE5vZGUgYXMgSFRNTEVsZW1lbnQpLnF1ZXJ5U2VsZWN0b3IoJy5wZi1jLXNlbGVjdF9fbWVudS1pdGVtJykgYXMgSFRNTEJ1dHRvbkVsZW1lbnQpLmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICAgIH0sIDEpO1xuICAgIH1cbiAgfSwgW2lzUmVhZE9ubHldKTtcblxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNldFNlbGVjdGVkKG9yaWdpbmFsVmFsdWUpO1xuICAgIHNldFNhdmVkU2VsZWN0aW9uKG9yaWdpbmFsVmFsdWUpO1xuICB9LCBbb3JpZ2luYWxWYWx1ZV0pO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBjdXJyZW50IERPTSBlbGVtZW50XG4gICAqIFxuICAgKiBUT0RPOiBQb3NzaWJseSBjaGFuZ2UgdG8gUmVhY3QgcmVmc1xuICAgKi9cbiAgY29uc3QgdGhpc0VsZW1lbnQgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFNhdmVzIHRoZSBjdXJyZW50IHZhbHVlXG4gICAqL1xuICBjb25zdCBzYXZlID0gKHNlbGVjdGlvbjogc3RyaW5nKSA9PiB7XG4gICAgc2V0U2VsZWN0ZWQoc2VsZWN0aW9uKTtcbiAgICBpZiAoc2F2ZWRTZWxlY3Rpb24gIT09IHNlbGVjdGlvbikge1xuICAgICAgc2V0U2F2ZWRTZWxlY3Rpb24oc2VsZWN0aW9uKTtcbiAgICAgIG9uU2F2ZSAmJiBvblNhdmUoaWQsIHNlbGVjdGlvbiwgb3JpZ2luYWxWYWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBTZWxlY3Qgb3B0aW9uc1xuICAgKi9cbiAgY29uc3Qgc2VsZWN0T3B0aW9ucyA9IG9wdGlvbnMubWFwKChvcHRpb246IHN0cmluZywgaW5kZXg6IG51bWJlcikgPT4gKFxuICAgIDxTZWxlY3RPcHRpb24ga2V5PXtpbmRleH0gdmFsdWU9e29wdGlvbn0gaXNTZWxlY3RlZCAvPlxuICApKTtcblxuICAvKipcbiAgICogVG9nZ2xlIHRoZSBTZWxlY3RcbiAgICovXG4gIGNvbnN0IG9uVG9nZ2xlID0gKGlzRXhwYW5kZWQ6IGJvb2xlYW4pID0+IHtcbiAgICBzZXRFeHBhbmRlZChpc0V4cGFuZGVkKTtcbiAgICBvblNlbGVjdFRvZ2dsZUNhbGxiYWNrKGlkLCBpc0V4cGFuZGVkKTtcbiAgfTtcblxuICAvKipcbiAgICogU2V0IHRoZSBzZWxlY3Rpb25cbiAgICovXG4gIGNvbnN0IG9uU2VsZWN0ID0gKGV2ZW50OiBSZWFjdC5Nb3VzZUV2ZW50IHwgUmVhY3QuQ2hhbmdlRXZlbnQsIHNlbGVjdGlvbjogc3RyaW5nIHwgU2VsZWN0T3B0aW9uT2JqZWN0KSA9PiB7XG4gICAgLy8gY2xvc2UgdGhlIGRyb3Bkb3duXG4gICAgb25Ub2dnbGUoZmFsc2UpO1xuICAgIC8vIHNhdmUgb3BlcmF0aW9uXG4gICAgc2F2ZShzZWxlY3Rpb24gYXMgc3RyaW5nKTtcbiAgICAvLyBtYXJrIGl0c2VsZiBhcyBub3QgZWRpdGFibGUgYnV0IG1haW50YWluIGZvY3VzXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBkZWFjdGl2YXRlQW5kRm9jdXNDZWxsKGlkKTtcbiAgICB9LCAxKVxuICB9O1xuXG4gIGNvbnN0IG9uS2V5RG93biA9IChldmVudDogYW55KSA9PiB7XG4gICAgY29uc3QgeyBrZXkgfSA9IGV2ZW50O1xuICAgIGlmIChrZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICBvblNlbGVjdFRvZ2dsZUNhbGxiYWNrKGZhbHNlKTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBkZWFjdGl2YXRlQW5kRm9jdXNDZWxsKGlkKTtcbiAgICAgIH0sIDEpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBlbGVtZW50IGlzIG92ZXJmbG93blxuICAgKi9cbiAgY29uc3QgY2hlY2tGb3JPdmVyZmxvdyA9IChldmVudD86IGFueSkgPT4ge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBldmVudCA/IGV2ZW50LnRhcmdldCA6IHRoaXNFbGVtZW50KCk7XG4gICAgY29uc3QgaXNPdmVyZmxvd24gPSBlbGVtZW50LnNjcm9sbEhlaWdodCA+IGVsZW1lbnQuY2xpZW50SGVpZ2h0IHx8IGVsZW1lbnQuc2Nyb2xsV2lkdGggPiBlbGVtZW50LmNsaWVudFdpZHRoO1xuICAgIHNldE92ZXJmbG93bihpc092ZXJmbG93bik7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICB7aXNSZWFkT25seSA/IChcbiAgICAgICAgPFRvb2x0aXAgY29udGVudD17c2VsZWN0ZWR9IGRpc3RhbmNlPXswfSBleGl0RGVsYXk9ezB9IHRyaWdnZXI9e292ZXJmbG93biA/ICdtb3VzZWVudGVyIGZvY3VzJyA6ICdtYW51YWwnfT5cbiAgICAgICAgICA8aW5wdXQgXG4gICAgICAgICAgICBvbk1vdXNlT3Zlcj17Y2hlY2tGb3JPdmVyZmxvd31cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImVkaXRvci1pbnB1dCB0cnVuY2F0ZVwiIFxuICAgICAgICAgICAgc3R5bGU9e3sgY3Vyc29yOiAnZGVmYXVsdCcsIHRleHRBbGlnbjogdHlwZSA9PT0gJ3N0cmluZycgPyAnbGVmdCcgOiAnY2VudGVyJyB9fSBcbiAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCIgXG4gICAgICAgICAgICB2YWx1ZT17c2VsZWN0ZWR9XG4gICAgICAgICAgICBpZD17aWR9XG4gICAgICAgICAgICBhcmlhLWxhYmVsPXtzZWxlY3RlZH1cbiAgICAgICAgICAgIHJlYWRPbmx5XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9Ub29sdGlwPlxuICAgICAgKSA6IChcbiAgICAgICAgPFBmU2VsZWN0XG4gICAgICAgICAgdG9nZ2xlSWQ9e2lkfVxuICAgICAgICAgIHZhcmlhbnQ9e1NlbGVjdFZhcmlhbnQuc2luZ2xlfVxuICAgICAgICAgIGFyaWEtbGFiZWw9XCJTZWxlY3QgSW5wdXRcIlxuICAgICAgICAgIG9uVG9nZ2xlPXtvblRvZ2dsZX1cbiAgICAgICAgICBvblNlbGVjdD17b25TZWxlY3R9XG4gICAgICAgICAgc2VsZWN0aW9ucz17c2VsZWN0ZWR9XG4gICAgICAgICAgaXNFeHBhbmRlZD17aXNFeHBhbmRlZH1cbiAgICAgICAgICBhcmlhTGFiZWxsZWRCeT1cInR5cGVhaGVhZC1zZWxlY3QtaWRcIlxuICAgICAgICAgIG9uS2V5RG93bj17b25LZXlEb3dufVxuICAgICAgICA+XG4gICAgICAgICAge3NlbGVjdE9wdGlvbnN9XG4gICAgICAgIDwvUGZTZWxlY3Q+XG4gICAgICApfVxuICAgIDwvPik7XG59LCAocHJldlByb3BzLCBuZXh0UHJvcHMpID0+IHtcbiAgY29uc3Qgc2hvdWxkUmVyZW5kZXIgPSAocHJldlByb3BzLmlzUmVhZE9ubHkgIT09IG5leHRQcm9wcy5pc1JlYWRPbmx5KSB8fCAocHJldlByb3BzLm9yaWdpbmFsVmFsdWUgIT09IG5leHRQcm9wcy5vcmlnaW5hbFZhbHVlKTtcbiAgaWYgKHNob3VsZFJlcmVuZGVyKSB7XG4gICAgY29uc29sZS5sb2coYHByZXZQcm9wcyAke3ByZXZQcm9wcy5vcmlnaW5hbFZhbHVlfSwgbmV4dFByb3BzICR7bmV4dFByb3BzLm9yaWdpbmFsVmFsdWV9YCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufSk7XG5cbmV4cG9ydCB7IFNlbGVjdCB9O1xuIl19
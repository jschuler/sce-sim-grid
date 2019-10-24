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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0NlbGwvU2VsZWN0LnRzeCJdLCJuYW1lcyI6WyJTZWxlY3QiLCJSZWFjdCIsIm1lbW8iLCJvcmlnaW5hbFZhbHVlIiwicGF0aCIsImlkIiwidHlwZSIsImlzUmVhZE9ubHkiLCJvblNlbGVjdFRvZ2dsZUNhbGxiYWNrIiwib3B0aW9ucyIsImRlYWN0aXZhdGVBbmRGb2N1c0NlbGwiLCJzZXRFZGl0YWJsZSIsIm9uU2F2ZSIsInVzZVN0YXRlIiwiaXNFeHBhbmRlZCIsInNldEV4cGFuZGVkIiwic2VsZWN0ZWQiLCJzZXRTZWxlY3RlZCIsInNhdmVkU2VsZWN0aW9uIiwic2V0U2F2ZWRTZWxlY3Rpb24iLCJvdmVyZmxvd24iLCJzZXRPdmVyZmxvd24iLCJ1c2VFZmZlY3QiLCJvblRvZ2dsZSIsInNldFRpbWVvdXQiLCJlbGVtZW50IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwicGFyZW50Tm9kZSIsImZvY3VzIiwidGhpc0VsZW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsInNhdmUiLCJzZWxlY3Rpb24iLCJzZWxlY3RPcHRpb25zIiwibWFwIiwib3B0aW9uIiwiaW5kZXgiLCJvblNlbGVjdCIsImV2ZW50Iiwib25LZXlEb3duIiwia2V5IiwiY2hlY2tGb3JPdmVyZmxvdyIsInRhcmdldCIsImlzT3ZlcmZsb3duIiwic2Nyb2xsSGVpZ2h0IiwiY2xpZW50SGVpZ2h0Iiwic2Nyb2xsV2lkdGgiLCJjbGllbnRXaWR0aCIsImN1cnNvciIsInRleHRBbGlnbiIsIlNlbGVjdFZhcmlhbnQiLCJzaW5nbGUiLCJwcmV2UHJvcHMiLCJuZXh0UHJvcHMiLCJzaG91bGRSZXJlbmRlciIsImNvbnNvbGUiLCJsb2ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxNQUFNLEdBQUdDLEtBQUssQ0FBQ0MsSUFBTixDQVdaLGdCQVdHO0FBQUEsTUFWSkMsYUFV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UyxDQUFDbEQsYUFBVixLQUE0Qm1ELFNBQVMsQ0FBQ25ELGFBQWpIOztBQUNBLE1BQUlvRCxjQUFKLEVBQW9CO0FBQ2xCQyxJQUFBQSxPQUFPLENBQUNDLEdBQVIscUJBQXlCSixTQUFTLENBQUNsRCxhQUFuQyx5QkFBK0RtRCxTQUFTLENBQUNuRCxhQUF6RTtBQUNBLFdBQU8sS0FBUDtBQUNEOztBQUNELFNBQU8sSUFBUDtBQUNELENBekpjLENBQWYiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IFRvb2x0aXAsIFNlbGVjdCBhcyBQZlNlbGVjdCwgU2VsZWN0T3B0aW9uLCBTZWxlY3RWYXJpYW50LCBTZWxlY3RPcHRpb25PYmplY3QgfSBmcm9tICdAcGF0dGVybmZseS9yZWFjdC1jb3JlJztcbmltcG9ydCAnLi9JbnB1dC5jc3MnO1xuaW1wb3J0ICcuL1NlbGVjdC5jc3MnO1xuXG5jb25zdCBTZWxlY3QgPSBSZWFjdC5tZW1vPHsgXG4gIG9yaWdpbmFsVmFsdWU/OiBhbnksIFxuICBwYXRoPzogc3RyaW5nLCBcbiAgaWQ/OiBhbnksIFxuICB0eXBlPzogc3RyaW5nLCBcbiAgaXNSZWFkT25seT86IGJvb2xlYW4sXG4gIG9uU2VsZWN0VG9nZ2xlQ2FsbGJhY2s/OiBhbnksXG4gIG9wdGlvbnM/OiBhbnksXG4gIGRlYWN0aXZhdGVBbmRGb2N1c0NlbGw/OiBhbnksXG4gIHNldEVkaXRhYmxlOiBhbnksXG4gIG9uU2F2ZTogYW55XG59PigoeyBcbiAgb3JpZ2luYWxWYWx1ZSwgXG4gIHBhdGgsIFxuICBpZCwgXG4gIHR5cGUsIFxuICBpc1JlYWRPbmx5LCBcbiAgb25TZWxlY3RUb2dnbGVDYWxsYmFjaywgXG4gIG9wdGlvbnMsIFxuICBkZWFjdGl2YXRlQW5kRm9jdXNDZWxsLCBcbiAgc2V0RWRpdGFibGUsXG4gIG9uU2F2ZVxufSkgPT4ge1xuICAvLyBjb25zb2xlLmxvZygncmVuZGVyIFNlbGVjdCcpO1xuICBjb25zdCBbaXNFeHBhbmRlZCwgc2V0RXhwYW5kZWRdID0gUmVhY3QudXNlU3RhdGU8Ym9vbGVhbj4odHJ1ZSk7XG4gIGNvbnN0IFtzZWxlY3RlZCwgc2V0U2VsZWN0ZWRdID0gUmVhY3QudXNlU3RhdGU8YW55PihvcmlnaW5hbFZhbHVlKTtcbiAgY29uc3QgW3NhdmVkU2VsZWN0aW9uLCBzZXRTYXZlZFNlbGVjdGlvbl0gPSBSZWFjdC51c2VTdGF0ZTxhbnk+KG9yaWdpbmFsVmFsdWUpO1xuICBjb25zdCBbb3ZlcmZsb3duLCBzZXRPdmVyZmxvd25dID0gUmVhY3QudXNlU3RhdGU8Ym9vbGVhbj4oZmFsc2UpO1xuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgLy8gd29ya2Fyb3VuZCB0byBmb2N1cyBvbiB0aGUgZmlyc3QgbGlzdCBpdGVtIHRvIGVuYWJsZSBrZXlib2FyZCBuYXZpZ2F0aW9uXG4gICAgaWYgKCFpc1JlYWRPbmx5KSB7XG4gICAgICBvblRvZ2dsZSh0cnVlKTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgYnV0dG9uW2lkPVwiJHtpZH1cIl1gKTtcbiAgICAgICAgaWYgKGVsZW1lbnQgJiYgZWxlbWVudC5wYXJlbnROb2RlICYmIChlbGVtZW50LnBhcmVudE5vZGUgYXMgSFRNTEVsZW1lbnQpLnF1ZXJ5U2VsZWN0b3IoJy5wZi1jLXNlbGVjdF9fbWVudS1pdGVtJykpIHtcbiAgICAgICAgICAoKGVsZW1lbnQucGFyZW50Tm9kZSBhcyBIVE1MRWxlbWVudCkucXVlcnlTZWxlY3RvcignLnBmLWMtc2VsZWN0X19tZW51LWl0ZW0nKSBhcyBIVE1MQnV0dG9uRWxlbWVudCkuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgfSwgMSk7XG4gICAgfVxuICB9LCBbaXNSZWFkT25seV0pO1xuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgc2V0U2VsZWN0ZWQob3JpZ2luYWxWYWx1ZSk7XG4gICAgc2V0U2F2ZWRTZWxlY3Rpb24ob3JpZ2luYWxWYWx1ZSk7XG4gIH0sIFtvcmlnaW5hbFZhbHVlXSk7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGN1cnJlbnQgRE9NIGVsZW1lbnRcbiAgICogXG4gICAqIFRPRE86IFBvc3NpYmx5IGNoYW5nZSB0byBSZWFjdCByZWZzXG4gICAqL1xuICBjb25zdCB0aGlzRWxlbWVudCA9ICgpID0+IHtcbiAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gIH1cblxuICAvKipcbiAgICogU2F2ZXMgdGhlIGN1cnJlbnQgdmFsdWVcbiAgICovXG4gIGNvbnN0IHNhdmUgPSAoc2VsZWN0aW9uOiBzdHJpbmcpID0+IHtcbiAgICBzZXRTZWxlY3RlZChzZWxlY3Rpb24pO1xuICAgIGlmIChzYXZlZFNlbGVjdGlvbiAhPT0gc2VsZWN0aW9uKSB7XG4gICAgICBzZXRTYXZlZFNlbGVjdGlvbihzZWxlY3Rpb24pO1xuICAgICAgb25TYXZlICYmIG9uU2F2ZShpZCwgc2VsZWN0aW9uLCBvcmlnaW5hbFZhbHVlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhlIFNlbGVjdCBvcHRpb25zXG4gICAqL1xuICBjb25zdCBzZWxlY3RPcHRpb25zID0gb3B0aW9ucy5tYXAoKG9wdGlvbjogc3RyaW5nLCBpbmRleDogbnVtYmVyKSA9PiAoXG4gICAgPFNlbGVjdE9wdGlvbiBrZXk9e2luZGV4fSB2YWx1ZT17b3B0aW9ufSBpc1NlbGVjdGVkIC8+XG4gICkpO1xuXG4gIC8qKlxuICAgKiBUb2dnbGUgdGhlIFNlbGVjdFxuICAgKi9cbiAgY29uc3Qgb25Ub2dnbGUgPSAoaXNFeHBhbmRlZDogYm9vbGVhbikgPT4ge1xuICAgIHNldEV4cGFuZGVkKGlzRXhwYW5kZWQpO1xuICAgIG9uU2VsZWN0VG9nZ2xlQ2FsbGJhY2soaWQsIGlzRXhwYW5kZWQpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHNlbGVjdGlvblxuICAgKi9cbiAgY29uc3Qgb25TZWxlY3QgPSAoZXZlbnQ6IFJlYWN0Lk1vdXNlRXZlbnQgfCBSZWFjdC5DaGFuZ2VFdmVudCwgc2VsZWN0aW9uOiBzdHJpbmcgfCBTZWxlY3RPcHRpb25PYmplY3QpID0+IHtcbiAgICAvLyBjbG9zZSB0aGUgZHJvcGRvd25cbiAgICBvblRvZ2dsZShmYWxzZSk7XG4gICAgLy8gc2F2ZSBvcGVyYXRpb25cbiAgICBzYXZlKHNlbGVjdGlvbiBhcyBzdHJpbmcpO1xuICAgIC8vIG1hcmsgaXRzZWxmIGFzIG5vdCBlZGl0YWJsZSBidXQgbWFpbnRhaW4gZm9jdXNcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGRlYWN0aXZhdGVBbmRGb2N1c0NlbGwoaWQpO1xuICAgIH0sIDEpXG4gIH07XG5cbiAgY29uc3Qgb25LZXlEb3duID0gKGV2ZW50OiBhbnkpID0+IHtcbiAgICBjb25zdCB7IGtleSB9ID0gZXZlbnQ7XG4gICAgaWYgKGtleSA9PT0gJ0VzY2FwZScpIHtcbiAgICAgIG9uU2VsZWN0VG9nZ2xlQ2FsbGJhY2soZmFsc2UpO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGRlYWN0aXZhdGVBbmRGb2N1c0NlbGwoaWQpO1xuICAgICAgfSwgMSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGVsZW1lbnQgaXMgb3ZlcmZsb3duXG4gICAqL1xuICBjb25zdCBjaGVja0Zvck92ZXJmbG93ID0gKGV2ZW50PzogYW55KSA9PiB7XG4gICAgY29uc3QgZWxlbWVudCA9IGV2ZW50ID8gZXZlbnQudGFyZ2V0IDogdGhpc0VsZW1lbnQoKTtcbiAgICBjb25zdCBpc092ZXJmbG93biA9IGVsZW1lbnQuc2Nyb2xsSGVpZ2h0ID4gZWxlbWVudC5jbGllbnRIZWlnaHQgfHwgZWxlbWVudC5zY3JvbGxXaWR0aCA+IGVsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgc2V0T3ZlcmZsb3duKGlzT3ZlcmZsb3duKTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIHtpc1JlYWRPbmx5ID8gKFxuICAgICAgICA8VG9vbHRpcCBjb250ZW50PXtzZWxlY3RlZH0gZGlzdGFuY2U9ezB9IGV4aXREZWxheT17MH0gdHJpZ2dlcj17b3ZlcmZsb3duID8gJ21vdXNlZW50ZXIgZm9jdXMnIDogJ21hbnVhbCd9PlxuICAgICAgICAgIDxpbnB1dCBcbiAgICAgICAgICAgIG9uTW91c2VPdmVyPXtjaGVja0Zvck92ZXJmbG93fVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZWRpdG9yLWlucHV0IHRydW5jYXRlXCIgXG4gICAgICAgICAgICBzdHlsZT17eyBjdXJzb3I6ICdkZWZhdWx0JywgdGV4dEFsaWduOiB0eXBlID09PSAnc3RyaW5nJyA/ICdsZWZ0JyA6ICdjZW50ZXInIH19IFxuICAgICAgICAgICAgdHlwZT1cInRleHRcIiBcbiAgICAgICAgICAgIHZhbHVlPXtzZWxlY3RlZH1cbiAgICAgICAgICAgIGlkPXtpZH1cbiAgICAgICAgICAgIGFyaWEtbGFiZWw9e3NlbGVjdGVkfVxuICAgICAgICAgICAgcmVhZE9ubHlcbiAgICAgICAgICAvPlxuICAgICAgICA8L1Rvb2x0aXA+XG4gICAgICApIDogKFxuICAgICAgICA8UGZTZWxlY3RcbiAgICAgICAgICB0b2dnbGVJZD17aWR9XG4gICAgICAgICAgdmFyaWFudD17U2VsZWN0VmFyaWFudC5zaW5nbGV9XG4gICAgICAgICAgYXJpYS1sYWJlbD1cIlNlbGVjdCBJbnB1dFwiXG4gICAgICAgICAgb25Ub2dnbGU9e29uVG9nZ2xlfVxuICAgICAgICAgIG9uU2VsZWN0PXtvblNlbGVjdH1cbiAgICAgICAgICBzZWxlY3Rpb25zPXtzZWxlY3RlZH1cbiAgICAgICAgICBpc0V4cGFuZGVkPXtpc0V4cGFuZGVkfVxuICAgICAgICAgIGFyaWFMYWJlbGxlZEJ5PVwidHlwZWFoZWFkLXNlbGVjdC1pZFwiXG4gICAgICAgICAgb25LZXlEb3duPXtvbktleURvd259XG4gICAgICAgID5cbiAgICAgICAgICB7c2VsZWN0T3B0aW9uc31cbiAgICAgICAgPC9QZlNlbGVjdD5cbiAgICAgICl9XG4gICAgPC8+KTtcbn0sIChwcmV2UHJvcHMsIG5leHRQcm9wcykgPT4ge1xuICBjb25zdCBzaG91bGRSZXJlbmRlciA9IChwcmV2UHJvcHMuaXNSZWFkT25seSAhPT0gbmV4dFByb3BzLmlzUmVhZE9ubHkpIHx8IChwcmV2UHJvcHMub3JpZ2luYWxWYWx1ZSAhPT0gbmV4dFByb3BzLm9yaWdpbmFsVmFsdWUpO1xuICBpZiAoc2hvdWxkUmVyZW5kZXIpIHtcbiAgICBjb25zb2xlLmxvZyhgcHJldlByb3BzICR7cHJldlByb3BzLm9yaWdpbmFsVmFsdWV9LCBuZXh0UHJvcHMgJHtuZXh0UHJvcHMub3JpZ2luYWxWYWx1ZX1gKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59KTtcblxuZXhwb3J0IHsgU2VsZWN0IH07XG4iXX0=
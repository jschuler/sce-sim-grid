"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Input = void 0;

var React = _interopRequireWildcard(require("react"));

var _reactCore = require("@patternfly/react-core");

var _utils = require("../utils");

require("./Input.css");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var Input = React.memo(function (_ref) {
  var originalValue = _ref.originalValue,
      path = _ref.path,
      id = _ref.id,
      type = _ref.type,
      isReadOnly = _ref.isReadOnly,
      deactivateAndFocusCell = _ref.deactivateAndFocusCell,
      setEditable = _ref.setEditable,
      onSave = _ref.onSave;

  // console.log(`render Input`);
  var _React$useState = React.useState(originalValue),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      value = _React$useState2[0],
      setValue = _React$useState2[1];

  var _React$useState3 = React.useState(originalValue),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      savedValue = _React$useState4[0],
      setSavedValue = _React$useState4[1];

  var _React$useState5 = React.useState(false),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      overflown = _React$useState6[0],
      setOverflown = _React$useState6[1]; // const [changes, setChanges] = React.useState<any[]>([]);


  var _React$useState7 = React.useState(isReadOnly),
      _React$useState8 = _slicedToArray(_React$useState7, 2),
      isReadOnlyState = _React$useState8[0],
      setReadOnlyState = _React$useState8[1];

  React.useEffect(function () {
    // sync prop to state
    if (isReadOnly !== isReadOnlyState) {
      setReadOnlyState(isReadOnly);
    }
  }, [isReadOnly]);
  React.useEffect(function () {
    if (isReadOnlyState) {
      // update cell on data changes coming from EditorContainer -> Editor
      if (value !== originalValue) {
        setValue(originalValue);
        setSavedValue(originalValue);
      }
    }
  }, [originalValue]);
  /**
   * Returns the current DOM element
   * 
   * TODO: Possibly change to React refs
   */

  var thisElement = function thisElement() {
    return document.getElementById(id);
  };

  React.useEffect(function () {
    if (!isReadOnlyState) {
      // set caret at the end of the input
      setTimeout(function () {
        (0, _utils.setCaretPositionAtEnd)(thisElement());
      }, 1);
    }
  });
  /**
   * Set the value on input
   */

  var handleTextInputChange = function handleTextInputChange(event) {
    setValue(event.currentTarget.value);
  };
  /**
   * Saves the current value
   */


  var save = function save() {
    if (savedValue !== value) {
      // setChanges((prevState: any) => ([...prevState, {
      //   value,
      //   previousValue: savedValue
      // }]));
      setSavedValue(value);
      onSave && onSave(id, value, originalValue);
    }
  };
  /**
   * save current input
   */


  var onEnter = function onEnter(event) {
    // save operation
    save(); // mark itself as not editable but maintain focus
    // deactivateAndFocusCell(event.target.id);

    setEditable('');
    setReadOnlyState(true);
  };
  /**
   * Reverts input to previous saved value if changed
   */


  var onEscape = function onEscape(event) {
    if (savedValue !== value) {
      setValue(savedValue);
    } // mark itself as not editable but maintain focus
    // deactivateAndFocusCell(event.target.id);


    setEditable('');
    setReadOnlyState(true);
  };

  (0, _utils.useKeyPress)('Escape', onEscape, {
    log: 'input',
    id: id,
    isActive: !isReadOnlyState
  });
  (0, _utils.useKeyPress)('Enter', onEnter, {
    log: 'input',
    id: id,
    isActive: !isReadOnlyState
  });
  /**
   * When the element loses focus
   * Save the value and notify the Editor that we're not editable anymore
   */

  var onLoseFocus = function onLoseFocus(event) {
    if (!isReadOnlyState) {
      setReadOnlyState(true); // setEditable('');

      save();
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

  var input = React.createElement("input", {
    onMouseOver: checkForOverflow,
    className: "editor-input truncate",
    style: {
      cursor: isReadOnlyState ? 'default' : 'text',
      textAlign: type === 'string' ? 'left' : 'center'
    },
    value: value,
    type: "text",
    onChange: handleTextInputChange,
    onBlur: onLoseFocus,
    "aria-label": value,
    id: id,
    readOnly: isReadOnlyState
  });
  return React.createElement(_reactCore.Tooltip, {
    content: value,
    distance: 0,
    exitDelay: 0,
    trigger: overflown ? 'mouseenter focus' : 'manual'
  }, input);
}, function (prevProps, nextProps) {
  var shouldRerender = prevProps.isReadOnly !== nextProps.isReadOnly || prevProps.originalValue !== nextProps.originalValue;

  if (shouldRerender) {
    // console.log(`re-render Input ${nextProps.id}`)
    return false;
  }

  return true;
}); // @ts-ignore

exports.Input = Input;
Input.whyDidYouRender = {
  customName: 'Input'
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvY29tcG9uZW50cy9DZWxsL0lucHV0LnRzeCJdLCJuYW1lcyI6WyJJbnB1dCIsIlJlYWN0IiwibWVtbyIsIm9yaWdpbmFsVmFsdWUiLCJwYXRoIiwiaWQiLCJ0eXBlIiwiaXNSZWFkT25seSIsImRlYWN0aXZhdGVBbmRGb2N1c0NlbGwiLCJzZXRFZGl0YWJsZSIsIm9uU2F2ZSIsInVzZVN0YXRlIiwidmFsdWUiLCJzZXRWYWx1ZSIsInNhdmVkVmFsdWUiLCJzZXRTYXZlZFZhbHVlIiwib3ZlcmZsb3duIiwic2V0T3ZlcmZsb3duIiwiaXNSZWFkT25seVN0YXRlIiwic2V0UmVhZE9ubHlTdGF0ZSIsInVzZUVmZmVjdCIsInRoaXNFbGVtZW50IiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsInNldFRpbWVvdXQiLCJoYW5kbGVUZXh0SW5wdXRDaGFuZ2UiLCJldmVudCIsImN1cnJlbnRUYXJnZXQiLCJzYXZlIiwib25FbnRlciIsIm9uRXNjYXBlIiwibG9nIiwiaXNBY3RpdmUiLCJvbkxvc2VGb2N1cyIsImNoZWNrRm9yT3ZlcmZsb3ciLCJlbGVtZW50IiwidGFyZ2V0IiwiaXNPdmVyZmxvd24iLCJzY3JvbGxIZWlnaHQiLCJjbGllbnRIZWlnaHQiLCJzY3JvbGxXaWR0aCIsImNsaWVudFdpZHRoIiwiaW5wdXQiLCJjdXJzb3IiLCJ0ZXh0QWxpZ24iLCJwcmV2UHJvcHMiLCJuZXh0UHJvcHMiLCJzaG91bGRSZXJlbmRlciIsIndoeURpZFlvdVJlbmRlciIsImN1c3RvbU5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxLQUFLLEdBQUdDLEtBQUssQ0FBQ0MsSUFBTixDQVNYLGdCQVNHO0FBQUEsTUFSSkMsYUFRSSxRQVJKQSxhQVFJO0FBQUEsTUFQSkMsSUFPSSxRQVBKQSxJQU9JO0FBQUEsTUFOSkMsRUFNSSxRQU5KQSxFQU1JO0FBQUEsTUFM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O0FBQUVTLE1BQUFBLE1BQU0sRUFBRXpCLGVBQWUsR0FBRyxTQUFILEdBQWUsTUFBeEM7QUFBZ0QwQixNQUFBQSxTQUFTLEVBQUV0QyxJQUFJLEtBQUssUUFBVCxHQUFvQixNQUFwQixHQUE2QjtBQUF4RixLQUhUO0FBSUUsSUFBQSxLQUFLLEVBQUVNLEtBSlQ7QUFLRSxJQUFBLElBQUksRUFBQyxNQUxQO0FBTUUsSUFBQSxRQUFRLEVBQUVhLHFCQU5aO0FBT0UsSUFBQSxNQUFNLEVBQUVRLFdBUFY7QUFRRSxrQkFBWXJCLEtBUmQ7QUFTRSxJQUFBLEVBQUUsRUFBRVAsRUFUTjtBQVVFLElBQUEsUUFBUSxFQUFFYTtBQVZaLElBREY7QUFjQSxTQUFPLG9CQUFDLGtCQUFEO0FBQVMsSUFBQSxPQUFPLEVBQUVOLEtBQWxCO0FBQXlCLElBQUEsUUFBUSxFQUFFLENBQW5DO0FBQXNDLElBQUEsU0FBUyxFQUFFLENBQWpEO0FBQW9ELElBQUEsT0FBTyxFQUFFSSxTQUFTLEdBQUcsa0JBQUgsR0FBd0I7QUFBOUYsS0FBeUcwQixLQUF6RyxDQUFQO0FBQ0QsQ0ExSmEsRUEwSlgsVUFBQ0csU0FBRCxFQUFZQyxTQUFaLEVBQTBCO0FBQzNCLE1BQU1DLGNBQWMsR0FBSUYsU0FBUyxDQUFDdEMsVUFBVixLQUF5QnVDLFNBQVMsQ0FBQ3ZDLFVBQXBDLElBQW9Ec0MsU0FBUyxDQUFDMUMsYUFBVixLQUE0QjJDLFNBQVMsQ0FBQzNDLGFBQWpIOztBQUNBLE1BQUk0QyxjQUFKLEVBQW9CO0FBQ2xCO0FBQ0EsV0FBTyxLQUFQO0FBQ0Q7O0FBQ0QsU0FBTyxJQUFQO0FBQ0QsQ0FqS2EsQ0FBZCxDLENBbUtBOzs7QUFDQS9DLEtBQUssQ0FBQ2dELGVBQU4sR0FBd0I7QUFDdEJDLEVBQUFBLFVBQVUsRUFBRTtBQURVLENBQXhCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBUb29sdGlwIH0gZnJvbSAnQHBhdHRlcm5mbHkvcmVhY3QtY29yZSc7XG5pbXBvcnQgeyB1c2VLZXlQcmVzcywgc2V0Q2FyZXRQb3NpdGlvbkF0RW5kLCBmb2N1c0NlbGwgIH0gZnJvbSAnLi4vdXRpbHMnOyBcbmltcG9ydCAnLi9JbnB1dC5jc3MnO1xuXG5jb25zdCBJbnB1dCA9IFJlYWN0Lm1lbW88eyBcbiAgb3JpZ2luYWxWYWx1ZTogYW55LCBcbiAgcGF0aDogc3RyaW5nLCBcbiAgaWQ/OiBhbnksIFxuICB0eXBlPzogc3RyaW5nLCBcbiAgaXNSZWFkT25seTogYm9vbGVhbixcbiAgZGVhY3RpdmF0ZUFuZEZvY3VzQ2VsbDogYW55LFxuICBzZXRFZGl0YWJsZTogYW55LFxuICBvblNhdmU6IGFueVxufT4oKHsgXG4gIG9yaWdpbmFsVmFsdWUsIFxuICBwYXRoLCBcbiAgaWQsIFxuICB0eXBlLCBcbiAgaXNSZWFkT25seSwgXG4gIGRlYWN0aXZhdGVBbmRGb2N1c0NlbGwsIFxuICBzZXRFZGl0YWJsZSwgXG4gIG9uU2F2ZVxufSkgPT4ge1xuICAvLyBjb25zb2xlLmxvZyhgcmVuZGVyIElucHV0YCk7XG4gIGNvbnN0IFt2YWx1ZSwgc2V0VmFsdWVdID0gUmVhY3QudXNlU3RhdGU8YW55PihvcmlnaW5hbFZhbHVlKTtcbiAgY29uc3QgW3NhdmVkVmFsdWUsIHNldFNhdmVkVmFsdWVdID0gUmVhY3QudXNlU3RhdGU8YW55PihvcmlnaW5hbFZhbHVlKTtcbiAgY29uc3QgW292ZXJmbG93biwgc2V0T3ZlcmZsb3duXSA9IFJlYWN0LnVzZVN0YXRlPGJvb2xlYW4+KGZhbHNlKTtcbiAgLy8gY29uc3QgW2NoYW5nZXMsIHNldENoYW5nZXNdID0gUmVhY3QudXNlU3RhdGU8YW55W10+KFtdKTtcbiAgY29uc3QgW2lzUmVhZE9ubHlTdGF0ZSwgc2V0UmVhZE9ubHlTdGF0ZV0gPSBSZWFjdC51c2VTdGF0ZTxib29sZWFuPihpc1JlYWRPbmx5KTtcblxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIC8vIHN5bmMgcHJvcCB0byBzdGF0ZVxuICAgIGlmIChpc1JlYWRPbmx5ICE9PSBpc1JlYWRPbmx5U3RhdGUpIHtcbiAgICAgIHNldFJlYWRPbmx5U3RhdGUoaXNSZWFkT25seSk7XG4gICAgfVxuICB9LCBbaXNSZWFkT25seV0pO1xuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGlzUmVhZE9ubHlTdGF0ZSkge1xuICAgICAgLy8gdXBkYXRlIGNlbGwgb24gZGF0YSBjaGFuZ2VzIGNvbWluZyBmcm9tIEVkaXRvckNvbnRhaW5lciAtPiBFZGl0b3JcbiAgICAgIGlmICh2YWx1ZSAhPT0gb3JpZ2luYWxWYWx1ZSkge1xuICAgICAgICBzZXRWYWx1ZShvcmlnaW5hbFZhbHVlKTtcbiAgICAgICAgc2V0U2F2ZWRWYWx1ZShvcmlnaW5hbFZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIFtvcmlnaW5hbFZhbHVlXSk7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGN1cnJlbnQgRE9NIGVsZW1lbnRcbiAgICogXG4gICAqIFRPRE86IFBvc3NpYmx5IGNoYW5nZSB0byBSZWFjdCByZWZzXG4gICAqL1xuICBjb25zdCB0aGlzRWxlbWVudCA9ICgpID0+IHtcbiAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gIH1cblxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghaXNSZWFkT25seVN0YXRlKSB7XG4gICAgICAvLyBzZXQgY2FyZXQgYXQgdGhlIGVuZCBvZiB0aGUgaW5wdXRcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBzZXRDYXJldFBvc2l0aW9uQXRFbmQodGhpc0VsZW1lbnQoKSk7XG4gICAgICB9LCAxKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHZhbHVlIG9uIGlucHV0XG4gICAqL1xuICBjb25zdCBoYW5kbGVUZXh0SW5wdXRDaGFuZ2UgPSAoZXZlbnQ6IGFueSkgPT4ge1xuICAgIHNldFZhbHVlKGV2ZW50LmN1cnJlbnRUYXJnZXQudmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNhdmVzIHRoZSBjdXJyZW50IHZhbHVlXG4gICAqL1xuICBjb25zdCBzYXZlID0gKCkgPT4ge1xuICAgIGlmIChzYXZlZFZhbHVlICE9PSB2YWx1ZSkge1xuICAgICAgLy8gc2V0Q2hhbmdlcygocHJldlN0YXRlOiBhbnkpID0+IChbLi4ucHJldlN0YXRlLCB7XG4gICAgICAvLyAgIHZhbHVlLFxuICAgICAgLy8gICBwcmV2aW91c1ZhbHVlOiBzYXZlZFZhbHVlXG4gICAgICAvLyB9XSkpO1xuICAgICAgc2V0U2F2ZWRWYWx1ZSh2YWx1ZSk7XG4gICAgICBvblNhdmUgJiYgb25TYXZlKGlkLCB2YWx1ZSwgb3JpZ2luYWxWYWx1ZSk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBzYXZlIGN1cnJlbnQgaW5wdXRcbiAgICovXG4gIGNvbnN0IG9uRW50ZXIgPSAoZXZlbnQ6IGFueSkgPT4ge1xuICAgIC8vIHNhdmUgb3BlcmF0aW9uXG4gICAgc2F2ZSgpO1xuICAgIC8vIG1hcmsgaXRzZWxmIGFzIG5vdCBlZGl0YWJsZSBidXQgbWFpbnRhaW4gZm9jdXNcbiAgICAvLyBkZWFjdGl2YXRlQW5kRm9jdXNDZWxsKGV2ZW50LnRhcmdldC5pZCk7XG4gICAgc2V0RWRpdGFibGUoJycpO1xuICAgIHNldFJlYWRPbmx5U3RhdGUodHJ1ZSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldmVydHMgaW5wdXQgdG8gcHJldmlvdXMgc2F2ZWQgdmFsdWUgaWYgY2hhbmdlZFxuICAgKi9cbiAgY29uc3Qgb25Fc2NhcGUgPSAoZXZlbnQ6IGFueSkgPT4ge1xuICAgIGlmIChzYXZlZFZhbHVlICE9PSB2YWx1ZSkge1xuICAgICAgc2V0VmFsdWUoc2F2ZWRWYWx1ZSk7XG4gICAgfVxuICAgIC8vIG1hcmsgaXRzZWxmIGFzIG5vdCBlZGl0YWJsZSBidXQgbWFpbnRhaW4gZm9jdXNcbiAgICAvLyBkZWFjdGl2YXRlQW5kRm9jdXNDZWxsKGV2ZW50LnRhcmdldC5pZCk7XG4gICAgc2V0RWRpdGFibGUoJycpO1xuICAgIHNldFJlYWRPbmx5U3RhdGUodHJ1ZSk7XG4gIH07XG5cbiAgdXNlS2V5UHJlc3MoJ0VzY2FwZScsIG9uRXNjYXBlLCB7IFxuICAgIGxvZzogJ2lucHV0JyxcbiAgICBpZCxcbiAgICBpc0FjdGl2ZTogIWlzUmVhZE9ubHlTdGF0ZVxuICB9KTtcbiAgdXNlS2V5UHJlc3MoJ0VudGVyJywgb25FbnRlciwgeyBcbiAgICBsb2c6ICdpbnB1dCcsXG4gICAgaWQsXG4gICAgaXNBY3RpdmU6ICFpc1JlYWRPbmx5U3RhdGVcbiAgfSk7XG5cbiAgLyoqXG4gICAqIFdoZW4gdGhlIGVsZW1lbnQgbG9zZXMgZm9jdXNcbiAgICogU2F2ZSB0aGUgdmFsdWUgYW5kIG5vdGlmeSB0aGUgRWRpdG9yIHRoYXQgd2UncmUgbm90IGVkaXRhYmxlIGFueW1vcmVcbiAgICovXG4gIGNvbnN0IG9uTG9zZUZvY3VzID0gKGV2ZW50OiBhbnkpID0+IHtcbiAgICBpZiAoIWlzUmVhZE9ubHlTdGF0ZSkge1xuICAgICAgc2V0UmVhZE9ubHlTdGF0ZSh0cnVlKTtcbiAgICAgIC8vIHNldEVkaXRhYmxlKCcnKTtcbiAgICAgIHNhdmUoKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBlbGVtZW50IGlzIG92ZXJmbG93blxuICAgKi9cbiAgY29uc3QgY2hlY2tGb3JPdmVyZmxvdyA9IChldmVudD86IGFueSkgPT4ge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBldmVudCA/IGV2ZW50LnRhcmdldCA6IHRoaXNFbGVtZW50KCk7XG4gICAgY29uc3QgaXNPdmVyZmxvd24gPSBlbGVtZW50LnNjcm9sbEhlaWdodCA+IGVsZW1lbnQuY2xpZW50SGVpZ2h0IHx8IGVsZW1lbnQuc2Nyb2xsV2lkdGggPiBlbGVtZW50LmNsaWVudFdpZHRoO1xuICAgIHNldE92ZXJmbG93bihpc092ZXJmbG93bik7XG4gIH1cblxuICBjb25zdCBpbnB1dCA9IChcbiAgICA8aW5wdXQgXG4gICAgICBvbk1vdXNlT3Zlcj17Y2hlY2tGb3JPdmVyZmxvd31cbiAgICAgIGNsYXNzTmFtZT1cImVkaXRvci1pbnB1dCB0cnVuY2F0ZVwiIFxuICAgICAgc3R5bGU9e3sgY3Vyc29yOiBpc1JlYWRPbmx5U3RhdGUgPyAnZGVmYXVsdCcgOiAndGV4dCcsIHRleHRBbGlnbjogdHlwZSA9PT0gJ3N0cmluZycgPyAnbGVmdCcgOiAnY2VudGVyJyB9fSBcbiAgICAgIHZhbHVlPXt2YWx1ZX0gXG4gICAgICB0eXBlPVwidGV4dFwiIFxuICAgICAgb25DaGFuZ2U9e2hhbmRsZVRleHRJbnB1dENoYW5nZX1cbiAgICAgIG9uQmx1cj17b25Mb3NlRm9jdXN9XG4gICAgICBhcmlhLWxhYmVsPXt2YWx1ZX0gXG4gICAgICBpZD17aWR9IFxuICAgICAgcmVhZE9ubHk9e2lzUmVhZE9ubHlTdGF0ZX1cbiAgICAvPlxuICApO1xuICByZXR1cm4gPFRvb2x0aXAgY29udGVudD17dmFsdWV9IGRpc3RhbmNlPXswfSBleGl0RGVsYXk9ezB9IHRyaWdnZXI9e292ZXJmbG93biA/ICdtb3VzZWVudGVyIGZvY3VzJyA6ICdtYW51YWwnfT57aW5wdXR9PC9Ub29sdGlwPjtcbn0sIChwcmV2UHJvcHMsIG5leHRQcm9wcykgPT4ge1xuICBjb25zdCBzaG91bGRSZXJlbmRlciA9IChwcmV2UHJvcHMuaXNSZWFkT25seSAhPT0gbmV4dFByb3BzLmlzUmVhZE9ubHkpIHx8IChwcmV2UHJvcHMub3JpZ2luYWxWYWx1ZSAhPT0gbmV4dFByb3BzLm9yaWdpbmFsVmFsdWUpO1xuICBpZiAoc2hvdWxkUmVyZW5kZXIpIHtcbiAgICAvLyBjb25zb2xlLmxvZyhgcmUtcmVuZGVyIElucHV0ICR7bmV4dFByb3BzLmlkfWApXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufSk7XG5cbi8vIEB0cy1pZ25vcmVcbklucHV0LndoeURpZFlvdVJlbmRlciA9IHtcbiAgY3VzdG9tTmFtZTogJ0lucHV0J1xufTtcblxuZXhwb3J0IHsgSW5wdXQgfTtcbiJdfQ==
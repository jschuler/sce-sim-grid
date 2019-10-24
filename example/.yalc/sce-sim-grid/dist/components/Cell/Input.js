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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0NlbGwvSW5wdXQudHN4Il0sIm5hbWVzIjpbIklucHV0IiwiUmVhY3QiLCJtZW1vIiwib3JpZ2luYWxWYWx1ZSIsInBhdGgiLCJpZCIsInR5cGUiLCJpc1JlYWRPbmx5IiwiZGVhY3RpdmF0ZUFuZEZvY3VzQ2VsbCIsInNldEVkaXRhYmxlIiwib25TYXZlIiwidXNlU3RhdGUiLCJ2YWx1ZSIsInNldFZhbHVlIiwic2F2ZWRWYWx1ZSIsInNldFNhdmVkVmFsdWUiLCJvdmVyZmxvd24iLCJzZXRPdmVyZmxvd24iLCJpc1JlYWRPbmx5U3RhdGUiLCJzZXRSZWFkT25seVN0YXRlIiwidXNlRWZmZWN0IiwidGhpc0VsZW1lbnQiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwic2V0VGltZW91dCIsImhhbmRsZVRleHRJbnB1dENoYW5nZSIsImV2ZW50IiwiY3VycmVudFRhcmdldCIsInNhdmUiLCJvbkVudGVyIiwib25Fc2NhcGUiLCJsb2ciLCJpc0FjdGl2ZSIsIm9uTG9zZUZvY3VzIiwiY2hlY2tGb3JPdmVyZmxvdyIsImVsZW1lbnQiLCJ0YXJnZXQiLCJpc092ZXJmbG93biIsInNjcm9sbEhlaWdodCIsImNsaWVudEhlaWdodCIsInNjcm9sbFdpZHRoIiwiY2xpZW50V2lkdGgiLCJpbnB1dCIsImN1cnNvciIsInRleHRBbGlnbiIsInByZXZQcm9wcyIsIm5leHRQcm9wcyIsInNob3VsZFJlcmVuZGVyIiwid2h5RGlkWW91UmVuZGVyIiwiY3VzdG9tTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLEtBQUssR0FBR0MsS0FBSyxDQUFDQyxJQUFOLENBU1gsZ0JBU0c7QUFBQSxNQVJKQyxhQVFJLFFBUkpBLGFBUUk7QUFBQSxNQVBKQyxJQU9JLFFBUEpBLElBT0k7QUFBQSxNQU5KQyxFQU1JLFFBTkpBLEVBTUk7QUFBQSxNQUxKQyxJ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RVMsTUFBQUEsTUFBTSxFQUFFekIsZUFBZSxHQUFHLFNBQUgsR0FBZSxNQUF4QztBQUFnRDBCLE1BQUFBLFNBQVMsRUFBRXRDLElBQUksS0FBSyxRQUFULEdBQW9CLE1BQXBCLEdBQTZCO0FBQXhGLEtBSFQ7QUFJRSxJQUFBLEtBQUssRUFBRU0sS0FKVDtBQUtFLElBQUEsSUFBSSxFQUFDLE1BTFA7QUFNRSxJQUFBLFFBQVEsRUFBRWEscUJBTlo7QUFPRSxJQUFBLE1BQU0sRUFBRVEsV0FQVjtBQVFFLGtCQUFZckIsS0FSZDtBQVNFLElBQUEsRUFBRSxFQUFFUCxFQVROO0FBVUUsSUFBQSxRQUFRLEVBQUVhO0FBVlosSUFERjtBQWNBLFNBQU8sb0JBQUMsa0JBQUQ7QUFBUyxJQUFBLE9BQU8sRUFBRU4sS0FBbEI7QUFBeUIsSUFBQSxRQUFRLEVBQUUsQ0FBbkM7QUFBc0MsSUFBQSxTQUFTLEVBQUUsQ0FBakQ7QUFBb0QsSUFBQSxPQUFPLEVBQUVJLFNBQVMsR0FBRyxrQkFBSCxHQUF3QjtBQUE5RixLQUF5RzBCLEtBQXpHLENBQVA7QUFDRCxDQTFKYSxFQTBKWCxVQUFDRyxTQUFELEVBQVlDLFNBQVosRUFBMEI7QUFDM0IsTUFBTUMsY0FBYyxHQUFJRixTQUFTLENBQUN0QyxVQUFWLEtBQXlCdUMsU0FBUyxDQUFDdkMsVUFBcEMsSUFBb0RzQyxTQUFTLENBQUMxQyxhQUFWLEtBQTRCMkMsU0FBUyxDQUFDM0MsYUFBakg7O0FBQ0EsTUFBSTRDLGNBQUosRUFBb0I7QUFDbEI7QUFDQSxXQUFPLEtBQVA7QUFDRDs7QUFDRCxTQUFPLElBQVA7QUFDRCxDQWpLYSxDQUFkLEMsQ0FtS0E7OztBQUNBL0MsS0FBSyxDQUFDZ0QsZUFBTixHQUF3QjtBQUN0QkMsRUFBQUEsVUFBVSxFQUFFO0FBRFUsQ0FBeEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IFRvb2x0aXAgfSBmcm9tICdAcGF0dGVybmZseS9yZWFjdC1jb3JlJztcbmltcG9ydCB7IHVzZUtleVByZXNzLCBzZXRDYXJldFBvc2l0aW9uQXRFbmQsIGZvY3VzQ2VsbCAgfSBmcm9tICcuLi91dGlscyc7IFxuaW1wb3J0ICcuL0lucHV0LmNzcyc7XG5cbmNvbnN0IElucHV0ID0gUmVhY3QubWVtbzx7IFxuICBvcmlnaW5hbFZhbHVlOiBhbnksIFxuICBwYXRoOiBzdHJpbmcsIFxuICBpZD86IGFueSwgXG4gIHR5cGU/OiBzdHJpbmcsIFxuICBpc1JlYWRPbmx5OiBib29sZWFuLFxuICBkZWFjdGl2YXRlQW5kRm9jdXNDZWxsOiBhbnksXG4gIHNldEVkaXRhYmxlOiBhbnksXG4gIG9uU2F2ZTogYW55XG59PigoeyBcbiAgb3JpZ2luYWxWYWx1ZSwgXG4gIHBhdGgsIFxuICBpZCwgXG4gIHR5cGUsIFxuICBpc1JlYWRPbmx5LCBcbiAgZGVhY3RpdmF0ZUFuZEZvY3VzQ2VsbCwgXG4gIHNldEVkaXRhYmxlLCBcbiAgb25TYXZlXG59KSA9PiB7XG4gIC8vIGNvbnNvbGUubG9nKGByZW5kZXIgSW5wdXRgKTtcbiAgY29uc3QgW3ZhbHVlLCBzZXRWYWx1ZV0gPSBSZWFjdC51c2VTdGF0ZTxhbnk+KG9yaWdpbmFsVmFsdWUpO1xuICBjb25zdCBbc2F2ZWRWYWx1ZSwgc2V0U2F2ZWRWYWx1ZV0gPSBSZWFjdC51c2VTdGF0ZTxhbnk+KG9yaWdpbmFsVmFsdWUpO1xuICBjb25zdCBbb3ZlcmZsb3duLCBzZXRPdmVyZmxvd25dID0gUmVhY3QudXNlU3RhdGU8Ym9vbGVhbj4oZmFsc2UpO1xuICAvLyBjb25zdCBbY2hhbmdlcywgc2V0Q2hhbmdlc10gPSBSZWFjdC51c2VTdGF0ZTxhbnlbXT4oW10pO1xuICBjb25zdCBbaXNSZWFkT25seVN0YXRlLCBzZXRSZWFkT25seVN0YXRlXSA9IFJlYWN0LnVzZVN0YXRlPGJvb2xlYW4+KGlzUmVhZE9ubHkpO1xuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgLy8gc3luYyBwcm9wIHRvIHN0YXRlXG4gICAgaWYgKGlzUmVhZE9ubHkgIT09IGlzUmVhZE9ubHlTdGF0ZSkge1xuICAgICAgc2V0UmVhZE9ubHlTdGF0ZShpc1JlYWRPbmx5KTtcbiAgICB9XG4gIH0sIFtpc1JlYWRPbmx5XSk7XG5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoaXNSZWFkT25seVN0YXRlKSB7XG4gICAgICAvLyB1cGRhdGUgY2VsbCBvbiBkYXRhIGNoYW5nZXMgY29taW5nIGZyb20gRWRpdG9yQ29udGFpbmVyIC0+IEVkaXRvclxuICAgICAgaWYgKHZhbHVlICE9PSBvcmlnaW5hbFZhbHVlKSB7XG4gICAgICAgIHNldFZhbHVlKG9yaWdpbmFsVmFsdWUpO1xuICAgICAgICBzZXRTYXZlZFZhbHVlKG9yaWdpbmFsVmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgfSwgW29yaWdpbmFsVmFsdWVdKTtcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY3VycmVudCBET00gZWxlbWVudFxuICAgKiBcbiAgICogVE9ETzogUG9zc2libHkgY2hhbmdlIHRvIFJlYWN0IHJlZnNcbiAgICovXG4gIGNvbnN0IHRoaXNFbGVtZW50ID0gKCkgPT4ge1xuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgfVxuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFpc1JlYWRPbmx5U3RhdGUpIHtcbiAgICAgIC8vIHNldCBjYXJldCBhdCB0aGUgZW5kIG9mIHRoZSBpbnB1dFxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHNldENhcmV0UG9zaXRpb25BdEVuZCh0aGlzRWxlbWVudCgpKTtcbiAgICAgIH0sIDEpO1xuICAgIH1cbiAgfSk7XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgdmFsdWUgb24gaW5wdXRcbiAgICovXG4gIGNvbnN0IGhhbmRsZVRleHRJbnB1dENoYW5nZSA9IChldmVudDogYW55KSA9PiB7XG4gICAgc2V0VmFsdWUoZXZlbnQuY3VycmVudFRhcmdldC52YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogU2F2ZXMgdGhlIGN1cnJlbnQgdmFsdWVcbiAgICovXG4gIGNvbnN0IHNhdmUgPSAoKSA9PiB7XG4gICAgaWYgKHNhdmVkVmFsdWUgIT09IHZhbHVlKSB7XG4gICAgICAvLyBzZXRDaGFuZ2VzKChwcmV2U3RhdGU6IGFueSkgPT4gKFsuLi5wcmV2U3RhdGUsIHtcbiAgICAgIC8vICAgdmFsdWUsXG4gICAgICAvLyAgIHByZXZpb3VzVmFsdWU6IHNhdmVkVmFsdWVcbiAgICAgIC8vIH1dKSk7XG4gICAgICBzZXRTYXZlZFZhbHVlKHZhbHVlKTtcbiAgICAgIG9uU2F2ZSAmJiBvblNhdmUoaWQsIHZhbHVlLCBvcmlnaW5hbFZhbHVlKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIHNhdmUgY3VycmVudCBpbnB1dFxuICAgKi9cbiAgY29uc3Qgb25FbnRlciA9IChldmVudDogYW55KSA9PiB7XG4gICAgLy8gc2F2ZSBvcGVyYXRpb25cbiAgICBzYXZlKCk7XG4gICAgLy8gbWFyayBpdHNlbGYgYXMgbm90IGVkaXRhYmxlIGJ1dCBtYWludGFpbiBmb2N1c1xuICAgIC8vIGRlYWN0aXZhdGVBbmRGb2N1c0NlbGwoZXZlbnQudGFyZ2V0LmlkKTtcbiAgICBzZXRFZGl0YWJsZSgnJyk7XG4gICAgc2V0UmVhZE9ubHlTdGF0ZSh0cnVlKTtcbiAgfTtcblxuICAvKipcbiAgICogUmV2ZXJ0cyBpbnB1dCB0byBwcmV2aW91cyBzYXZlZCB2YWx1ZSBpZiBjaGFuZ2VkXG4gICAqL1xuICBjb25zdCBvbkVzY2FwZSA9IChldmVudDogYW55KSA9PiB7XG4gICAgaWYgKHNhdmVkVmFsdWUgIT09IHZhbHVlKSB7XG4gICAgICBzZXRWYWx1ZShzYXZlZFZhbHVlKTtcbiAgICB9XG4gICAgLy8gbWFyayBpdHNlbGYgYXMgbm90IGVkaXRhYmxlIGJ1dCBtYWludGFpbiBmb2N1c1xuICAgIC8vIGRlYWN0aXZhdGVBbmRGb2N1c0NlbGwoZXZlbnQudGFyZ2V0LmlkKTtcbiAgICBzZXRFZGl0YWJsZSgnJyk7XG4gICAgc2V0UmVhZE9ubHlTdGF0ZSh0cnVlKTtcbiAgfTtcblxuICB1c2VLZXlQcmVzcygnRXNjYXBlJywgb25Fc2NhcGUsIHsgXG4gICAgbG9nOiAnaW5wdXQnLFxuICAgIGlkLFxuICAgIGlzQWN0aXZlOiAhaXNSZWFkT25seVN0YXRlXG4gIH0pO1xuICB1c2VLZXlQcmVzcygnRW50ZXInLCBvbkVudGVyLCB7IFxuICAgIGxvZzogJ2lucHV0JyxcbiAgICBpZCxcbiAgICBpc0FjdGl2ZTogIWlzUmVhZE9ubHlTdGF0ZVxuICB9KTtcblxuICAvKipcbiAgICogV2hlbiB0aGUgZWxlbWVudCBsb3NlcyBmb2N1c1xuICAgKiBTYXZlIHRoZSB2YWx1ZSBhbmQgbm90aWZ5IHRoZSBFZGl0b3IgdGhhdCB3ZSdyZSBub3QgZWRpdGFibGUgYW55bW9yZVxuICAgKi9cbiAgY29uc3Qgb25Mb3NlRm9jdXMgPSAoZXZlbnQ6IGFueSkgPT4ge1xuICAgIGlmICghaXNSZWFkT25seVN0YXRlKSB7XG4gICAgICBzZXRSZWFkT25seVN0YXRlKHRydWUpO1xuICAgICAgLy8gc2V0RWRpdGFibGUoJycpO1xuICAgICAgc2F2ZSgpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGVsZW1lbnQgaXMgb3ZlcmZsb3duXG4gICAqL1xuICBjb25zdCBjaGVja0Zvck92ZXJmbG93ID0gKGV2ZW50PzogYW55KSA9PiB7XG4gICAgY29uc3QgZWxlbWVudCA9IGV2ZW50ID8gZXZlbnQudGFyZ2V0IDogdGhpc0VsZW1lbnQoKTtcbiAgICBjb25zdCBpc092ZXJmbG93biA9IGVsZW1lbnQuc2Nyb2xsSGVpZ2h0ID4gZWxlbWVudC5jbGllbnRIZWlnaHQgfHwgZWxlbWVudC5zY3JvbGxXaWR0aCA+IGVsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgc2V0T3ZlcmZsb3duKGlzT3ZlcmZsb3duKTtcbiAgfVxuXG4gIGNvbnN0IGlucHV0ID0gKFxuICAgIDxpbnB1dCBcbiAgICAgIG9uTW91c2VPdmVyPXtjaGVja0Zvck92ZXJmbG93fVxuICAgICAgY2xhc3NOYW1lPVwiZWRpdG9yLWlucHV0IHRydW5jYXRlXCIgXG4gICAgICBzdHlsZT17eyBjdXJzb3I6IGlzUmVhZE9ubHlTdGF0ZSA/ICdkZWZhdWx0JyA6ICd0ZXh0JywgdGV4dEFsaWduOiB0eXBlID09PSAnc3RyaW5nJyA/ICdsZWZ0JyA6ICdjZW50ZXInIH19IFxuICAgICAgdmFsdWU9e3ZhbHVlfSBcbiAgICAgIHR5cGU9XCJ0ZXh0XCIgXG4gICAgICBvbkNoYW5nZT17aGFuZGxlVGV4dElucHV0Q2hhbmdlfVxuICAgICAgb25CbHVyPXtvbkxvc2VGb2N1c31cbiAgICAgIGFyaWEtbGFiZWw9e3ZhbHVlfSBcbiAgICAgIGlkPXtpZH0gXG4gICAgICByZWFkT25seT17aXNSZWFkT25seVN0YXRlfVxuICAgIC8+XG4gICk7XG4gIHJldHVybiA8VG9vbHRpcCBjb250ZW50PXt2YWx1ZX0gZGlzdGFuY2U9ezB9IGV4aXREZWxheT17MH0gdHJpZ2dlcj17b3ZlcmZsb3duID8gJ21vdXNlZW50ZXIgZm9jdXMnIDogJ21hbnVhbCd9PntpbnB1dH08L1Rvb2x0aXA+O1xufSwgKHByZXZQcm9wcywgbmV4dFByb3BzKSA9PiB7XG4gIGNvbnN0IHNob3VsZFJlcmVuZGVyID0gKHByZXZQcm9wcy5pc1JlYWRPbmx5ICE9PSBuZXh0UHJvcHMuaXNSZWFkT25seSkgfHwgKHByZXZQcm9wcy5vcmlnaW5hbFZhbHVlICE9PSBuZXh0UHJvcHMub3JpZ2luYWxWYWx1ZSk7XG4gIGlmIChzaG91bGRSZXJlbmRlcikge1xuICAgIC8vIGNvbnNvbGUubG9nKGByZS1yZW5kZXIgSW5wdXQgJHtuZXh0UHJvcHMuaWR9YClcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59KTtcblxuLy8gQHRzLWlnbm9yZVxuSW5wdXQud2h5RGlkWW91UmVuZGVyID0ge1xuICBjdXN0b21OYW1lOiAnSW5wdXQnXG59O1xuXG5leHBvcnQgeyBJbnB1dCB9O1xuIl19
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useDebounce = useDebounce;

var _react = require("react");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// Our hook
function useDebounce(value, delay) {
  // State and setters for debounced value
  var _useState = (0, _react.useState)(value),
      _useState2 = _slicedToArray(_useState, 2),
      debouncedValue = _useState2[0],
      setDebouncedValue = _useState2[1];

  (0, _react.useEffect)(function () {
    // Set debouncedValue to value (passed in) after the specified delay
    var handler = setTimeout(function () {
      setDebouncedValue(value);
    }, delay); // Return a cleanup function that will be called every time ...
    // ... useEffect is re-called. useEffect will only be re-called ...
    // ... if value changes (see the inputs array below). 
    // This is how we prevent debouncedValue from changing if value is ...
    // ... changed within the delay period. Timeout gets cleared and restarted.
    // To put it in context, if the user is typing within our app's ...
    // ... search box, we don't want the debouncedValue to update until ...
    // ... they've stopped typing for more than 500ms.

    return function () {
      clearTimeout(handler);
    };
  }, // Only re-call effect if value changes
  // You could also add the "delay" var to inputs array if you ...
  // ... need to be able to change that dynamically.
  [value]);
  return debouncedValue;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3V0aWxzL3VzZURlYm91bmNlLnRzIl0sIm5hbWVzIjpbInVzZURlYm91bmNlIiwidmFsdWUiLCJkZWxheSIsImRlYm91bmNlZFZhbHVlIiwic2V0RGVib3VuY2VkVmFsdWUiLCJoYW5kbGVyIiwic2V0VGltZW91dCIsImNsZWFyVGltZW91dCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOzs7Ozs7Ozs7O0FBRUE7QUFDTyxTQUFTQSxXQUFULENBQXFCQyxLQUFyQixFQUFvQ0MsS0FBcEMsRUFBbUQ7QUFDeEQ7QUFEd0Qsa0JBRVoscUJBQVNELEtBQVQsQ0FGWTtBQUFBO0FBQUEsTUFFakRFLGNBRmlEO0FBQUEsTUFFakNDLGlCQUZpQzs7QUFJeEQsd0JBQ0UsWUFBTTtBQUNKO0FBQ0EsUUFBTUMsT0FBTyxHQUFHQyxVQUFVLENBQUMsWUFBTTtBQUMvQkYsTUFBQUEsaUJBQWlCLENBQUNILEtBQUQsQ0FBakI7QUFDRCxLQUZ5QixFQUV2QkMsS0FGdUIsQ0FBMUIsQ0FGSSxDQU1KO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsV0FBTyxZQUFNO0FBQ1hLLE1BQUFBLFlBQVksQ0FBQ0YsT0FBRCxDQUFaO0FBQ0QsS0FGRDtBQUdELEdBbEJILEVBbUJFO0FBQ0E7QUFDQTtBQUNBLEdBQUNKLEtBQUQsQ0F0QkY7QUF5QkEsU0FBT0UsY0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaHR0cHM6Ly9kZXYudG8vZ2FiZV9yYWdsYW5kL2RlYm91bmNpbmctd2l0aC1yZWFjdC1ob29rcy1qY2lcblxuaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XG5cbi8vIE91ciBob29rXG5leHBvcnQgZnVuY3Rpb24gdXNlRGVib3VuY2UodmFsdWU6IHN0cmluZywgZGVsYXk6IG51bWJlcikge1xuICAvLyBTdGF0ZSBhbmQgc2V0dGVycyBmb3IgZGVib3VuY2VkIHZhbHVlXG4gIGNvbnN0IFtkZWJvdW5jZWRWYWx1ZSwgc2V0RGVib3VuY2VkVmFsdWVdID0gdXNlU3RhdGUodmFsdWUpO1xuXG4gIHVzZUVmZmVjdChcbiAgICAoKSA9PiB7XG4gICAgICAvLyBTZXQgZGVib3VuY2VkVmFsdWUgdG8gdmFsdWUgKHBhc3NlZCBpbikgYWZ0ZXIgdGhlIHNwZWNpZmllZCBkZWxheVxuICAgICAgY29uc3QgaGFuZGxlciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBzZXREZWJvdW5jZWRWYWx1ZSh2YWx1ZSk7XG4gICAgICB9LCBkZWxheSk7XG5cbiAgICAgIC8vIFJldHVybiBhIGNsZWFudXAgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGxlZCBldmVyeSB0aW1lIC4uLlxuICAgICAgLy8gLi4uIHVzZUVmZmVjdCBpcyByZS1jYWxsZWQuIHVzZUVmZmVjdCB3aWxsIG9ubHkgYmUgcmUtY2FsbGVkIC4uLlxuICAgICAgLy8gLi4uIGlmIHZhbHVlIGNoYW5nZXMgKHNlZSB0aGUgaW5wdXRzIGFycmF5IGJlbG93KS4gXG4gICAgICAvLyBUaGlzIGlzIGhvdyB3ZSBwcmV2ZW50IGRlYm91bmNlZFZhbHVlIGZyb20gY2hhbmdpbmcgaWYgdmFsdWUgaXMgLi4uXG4gICAgICAvLyAuLi4gY2hhbmdlZCB3aXRoaW4gdGhlIGRlbGF5IHBlcmlvZC4gVGltZW91dCBnZXRzIGNsZWFyZWQgYW5kIHJlc3RhcnRlZC5cbiAgICAgIC8vIFRvIHB1dCBpdCBpbiBjb250ZXh0LCBpZiB0aGUgdXNlciBpcyB0eXBpbmcgd2l0aGluIG91ciBhcHAncyAuLi5cbiAgICAgIC8vIC4uLiBzZWFyY2ggYm94LCB3ZSBkb24ndCB3YW50IHRoZSBkZWJvdW5jZWRWYWx1ZSB0byB1cGRhdGUgdW50aWwgLi4uXG4gICAgICAvLyAuLi4gdGhleSd2ZSBzdG9wcGVkIHR5cGluZyBmb3IgbW9yZSB0aGFuIDUwMG1zLlxuICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KGhhbmRsZXIpO1xuICAgICAgfTtcbiAgICB9LFxuICAgIC8vIE9ubHkgcmUtY2FsbCBlZmZlY3QgaWYgdmFsdWUgY2hhbmdlc1xuICAgIC8vIFlvdSBjb3VsZCBhbHNvIGFkZCB0aGUgXCJkZWxheVwiIHZhciB0byBpbnB1dHMgYXJyYXkgaWYgeW91IC4uLlxuICAgIC8vIC4uLiBuZWVkIHRvIGJlIGFibGUgdG8gY2hhbmdlIHRoYXQgZHluYW1pY2FsbHkuXG4gICAgW3ZhbHVlXSBcbiAgKTtcblxuICByZXR1cm4gZGVib3VuY2VkVmFsdWU7XG59Il19
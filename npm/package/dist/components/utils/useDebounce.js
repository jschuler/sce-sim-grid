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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvY29tcG9uZW50cy91dGlscy91c2VEZWJvdW5jZS50cyJdLCJuYW1lcyI6WyJ1c2VEZWJvdW5jZSIsInZhbHVlIiwiZGVsYXkiLCJkZWJvdW5jZWRWYWx1ZSIsInNldERlYm91bmNlZFZhbHVlIiwiaGFuZGxlciIsInNldFRpbWVvdXQiLCJjbGVhclRpbWVvdXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7Ozs7Ozs7OztBQUVBO0FBQ08sU0FBU0EsV0FBVCxDQUFxQkMsS0FBckIsRUFBb0NDLEtBQXBDLEVBQW1EO0FBQ3hEO0FBRHdELGtCQUVaLHFCQUFTRCxLQUFULENBRlk7QUFBQTtBQUFBLE1BRWpERSxjQUZpRDtBQUFBLE1BRWpDQyxpQkFGaUM7O0FBSXhELHdCQUNFLFlBQU07QUFDSjtBQUNBLFFBQU1DLE9BQU8sR0FBR0MsVUFBVSxDQUFDLFlBQU07QUFDL0JGLE1BQUFBLGlCQUFpQixDQUFDSCxLQUFELENBQWpCO0FBQ0QsS0FGeUIsRUFFdkJDLEtBRnVCLENBQTFCLENBRkksQ0FNSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLFdBQU8sWUFBTTtBQUNYSyxNQUFBQSxZQUFZLENBQUNGLE9BQUQsQ0FBWjtBQUNELEtBRkQ7QUFHRCxHQWxCSCxFQW1CRTtBQUNBO0FBQ0E7QUFDQSxHQUFDSixLQUFELENBdEJGO0FBeUJBLFNBQU9FLGNBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIGh0dHBzOi8vZGV2LnRvL2dhYmVfcmFnbGFuZC9kZWJvdW5jaW5nLXdpdGgtcmVhY3QtaG9va3MtamNpXG5cbmltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuXG4vLyBPdXIgaG9va1xuZXhwb3J0IGZ1bmN0aW9uIHVzZURlYm91bmNlKHZhbHVlOiBzdHJpbmcsIGRlbGF5OiBudW1iZXIpIHtcbiAgLy8gU3RhdGUgYW5kIHNldHRlcnMgZm9yIGRlYm91bmNlZCB2YWx1ZVxuICBjb25zdCBbZGVib3VuY2VkVmFsdWUsIHNldERlYm91bmNlZFZhbHVlXSA9IHVzZVN0YXRlKHZhbHVlKTtcblxuICB1c2VFZmZlY3QoXG4gICAgKCkgPT4ge1xuICAgICAgLy8gU2V0IGRlYm91bmNlZFZhbHVlIHRvIHZhbHVlIChwYXNzZWQgaW4pIGFmdGVyIHRoZSBzcGVjaWZpZWQgZGVsYXlcbiAgICAgIGNvbnN0IGhhbmRsZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgc2V0RGVib3VuY2VkVmFsdWUodmFsdWUpO1xuICAgICAgfSwgZGVsYXkpO1xuXG4gICAgICAvLyBSZXR1cm4gYSBjbGVhbnVwIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBjYWxsZWQgZXZlcnkgdGltZSAuLi5cbiAgICAgIC8vIC4uLiB1c2VFZmZlY3QgaXMgcmUtY2FsbGVkLiB1c2VFZmZlY3Qgd2lsbCBvbmx5IGJlIHJlLWNhbGxlZCAuLi5cbiAgICAgIC8vIC4uLiBpZiB2YWx1ZSBjaGFuZ2VzIChzZWUgdGhlIGlucHV0cyBhcnJheSBiZWxvdykuIFxuICAgICAgLy8gVGhpcyBpcyBob3cgd2UgcHJldmVudCBkZWJvdW5jZWRWYWx1ZSBmcm9tIGNoYW5naW5nIGlmIHZhbHVlIGlzIC4uLlxuICAgICAgLy8gLi4uIGNoYW5nZWQgd2l0aGluIHRoZSBkZWxheSBwZXJpb2QuIFRpbWVvdXQgZ2V0cyBjbGVhcmVkIGFuZCByZXN0YXJ0ZWQuXG4gICAgICAvLyBUbyBwdXQgaXQgaW4gY29udGV4dCwgaWYgdGhlIHVzZXIgaXMgdHlwaW5nIHdpdGhpbiBvdXIgYXBwJ3MgLi4uXG4gICAgICAvLyAuLi4gc2VhcmNoIGJveCwgd2UgZG9uJ3Qgd2FudCB0aGUgZGVib3VuY2VkVmFsdWUgdG8gdXBkYXRlIHVudGlsIC4uLlxuICAgICAgLy8gLi4uIHRoZXkndmUgc3RvcHBlZCB0eXBpbmcgZm9yIG1vcmUgdGhhbiA1MDBtcy5cbiAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGNsZWFyVGltZW91dChoYW5kbGVyKTtcbiAgICAgIH07XG4gICAgfSxcbiAgICAvLyBPbmx5IHJlLWNhbGwgZWZmZWN0IGlmIHZhbHVlIGNoYW5nZXNcbiAgICAvLyBZb3UgY291bGQgYWxzbyBhZGQgdGhlIFwiZGVsYXlcIiB2YXIgdG8gaW5wdXRzIGFycmF5IGlmIHlvdSAuLi5cbiAgICAvLyAuLi4gbmVlZCB0byBiZSBhYmxlIHRvIGNoYW5nZSB0aGF0IGR5bmFtaWNhbGx5LlxuICAgIFt2YWx1ZV0gXG4gICk7XG5cbiAgcmV0dXJuIGRlYm91bmNlZFZhbHVlO1xufSJdfQ==
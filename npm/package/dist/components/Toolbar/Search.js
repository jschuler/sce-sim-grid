"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Search = void 0;

var React = _interopRequireWildcard(require("react"));

var _reactCore = require("@patternfly/react-core");

var _utils = require("../utils");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var Search = React.memo(function (_ref) {
  var data = _ref.data,
      columnNames = _ref.columnNames,
      onChange = _ref.onChange;
  console.log('render Search');

  var _React$useState = React.useState(false),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      isExpanded = _React$useState2[0],
      setExpanded = _React$useState2[1];

  var _React$useState3 = React.useState([]),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      selected = _React$useState4[0],
      setSelected = _React$useState4[1];

  var _React$useState5 = React.useState(''),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      searchValue = _React$useState6[0],
      setSearchValue = _React$useState6[1];

  var debouncedSearchTerm = (0, _utils.useDebounce)(searchValue, 500);
  React.useEffect(function () {
    // this gets triggered after the debounce timer
    onChange(debouncedSearchTerm, selected);
  }, [debouncedSearchTerm]);
  React.useEffect(function () {
    // When selections in the filter change, update the filtered rows
    if (searchValue) {
      onChange(searchValue, selected);
    }
  }, [selected]);
  React.useEffect(function () {
    // reset search and selection if the underlying data has changed
    setSelected([]);
    setSearchValue('');
  }, [data]);
  /**
   * Update filtered rows on search change
   */

  var handleSearchChange = function handleSearchChange(value) {
    setSearchValue(value);
  };
  /**
   * Toggles the filter select
   */


  var onSelectToggle = function onSelectToggle(isOpen) {
    setExpanded(isOpen);
  };
  /**
   * Updates selection on filter select change
   */


  var onSelect = function onSelect(event, selection) {
    var selections;

    if (selection.indexOf(selected) > -1) {
      selections = selected.filter(function (item) {
        return item !== selection;
      });
    } else {
      selections = [].concat(_toConsumableArray(selected), [selection]);
    }

    setSelected(selections);
  };
  /**
   * Builds the search box
   */


  var buildSearchBox = function buildSearchBox() {
    return React.createElement(_reactCore.TextInput, {
      type: "text",
      id: "gridSearch",
      name: "gridSearch",
      placeholder: "Search grid",
      "aria-label": "Search grid",
      value: searchValue,
      onChange: handleSearchChange
    });
  };
  /**
   * Builds the filter select
   */


  var buildSelect = function buildSelect() {
    var items = [];
    columnNames.forEach(function (item, index) {
      var value = "".concat(item.group, " ").concat(item.name);
      items.push(React.createElement(_reactCore.SelectOption, {
        key: index,
        index: index,
        value: value
      }));
    });
    return React.createElement(_reactCore.Select, {
      variant: "checkbox",
      "aria-label": "Select Input",
      onToggle: onSelectToggle,
      onSelect: onSelect,
      selections: selected,
      isExpanded: isExpanded,
      placeholderText: "Filter on column",
      ariaLabelledBy: "Filter on column"
    }, items);
  };

  return React.createElement(React.Fragment, null, React.createElement(_reactCore.ToolbarItem, {
    className: "pf-u-mr-md"
  }, buildSearchBox()), React.createElement(_reactCore.ToolbarItem, null, buildSelect()));
}, function (prevProps, nextProps) {
  if (JSON.stringify(prevProps.data) !== JSON.stringify(nextProps.data)) {
    // data has changed, re-render
    return false;
  }

  if (JSON.stringify(prevProps.columnNames) !== JSON.stringify(nextProps.columnNames)) {
    // allRows have changed, re-render
    return false;
  }

  return true;
}); // @ts-ignore

exports.Search = Search;
Search.whyDidYouRender = {
  customName: 'Search'
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvY29tcG9uZW50cy9Ub29sYmFyL1NlYXJjaC50c3giXSwibmFtZXMiOlsiU2VhcmNoIiwiUmVhY3QiLCJtZW1vIiwiZGF0YSIsImNvbHVtbk5hbWVzIiwib25DaGFuZ2UiLCJjb25zb2xlIiwibG9nIiwidXNlU3RhdGUiLCJpc0V4cGFuZGVkIiwic2V0RXhwYW5kZWQiLCJzZWxlY3RlZCIsInNldFNlbGVjdGVkIiwic2VhcmNoVmFsdWUiLCJzZXRTZWFyY2hWYWx1ZSIsImRlYm91bmNlZFNlYXJjaFRlcm0iLCJ1c2VFZmZlY3QiLCJoYW5kbGVTZWFyY2hDaGFuZ2UiLCJ2YWx1ZSIsIm9uU2VsZWN0VG9nZ2xlIiwiaXNPcGVuIiwib25TZWxlY3QiLCJldmVudCIsInNlbGVjdGlvbiIsInNlbGVjdGlvbnMiLCJpbmRleE9mIiwiZmlsdGVyIiwiaXRlbSIsImJ1aWxkU2VhcmNoQm94IiwiYnVpbGRTZWxlY3QiLCJpdGVtcyIsImZvckVhY2giLCJpbmRleCIsImdyb3VwIiwibmFtZSIsInB1c2giLCJwcmV2UHJvcHMiLCJuZXh0UHJvcHMiLCJKU09OIiwic3RyaW5naWZ5Iiwid2h5RGlkWW91UmVuZGVyIiwiY3VzdG9tTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQU1BOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsTUFBTSxHQUFHQyxLQUFLLENBQUNDLElBQU4sQ0FJWixnQkFBcUM7QUFBQSxNQUFsQ0MsSUFBa0MsUUFBbENBLElBQWtDO0FBQUEsTUFBNUJDLFdBQTRCLFFBQTVCQSxXQUE0QjtBQUFBLE1BQWZDLFFBQWUsUUFBZkEsUUFBZTtBQUN0Q0MsRUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksZUFBWjs7QUFEc0Msd0JBR0pOLEtBQUssQ0FBQ08sUUFBTixDQUFlLEtBQWYsQ0FISTtBQUFBO0FBQUEsTUFHL0JDLFVBSCtCO0FBQUEsTUFHbkJDLFdBSG1COztBQUFBLHlCQUlOVCxLQUFL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LFdBQ0Usb0JBQUMsaUJBQUQ7QUFDRSxNQUFBLE9BQU8sRUFBQyxVQURWO0FBRUUsb0JBQVcsY0FGYjtBQUdFLE1BQUEsUUFBUSxFQUFFQyxjQUhaO0FBSUUsTUFBQSxRQUFRLEVBQUVFLFFBSlo7QUFLRSxNQUFBLFVBQVUsRUFBRVYsUUFMZDtBQU1FLE1BQUEsVUFBVSxFQUFFRixVQU5kO0FBT0UsTUFBQSxlQUFlLEVBQUMsa0JBUGxCO0FBUUUsTUFBQSxjQUFjLEVBQUM7QUFSakIsT0FVR3FCLEtBVkgsQ0FERjtBQWNELEdBdEJEOztBQXdCQSxTQUNFLDBDQUNFLG9CQUFDLHNCQUFEO0FBQWEsSUFBQSxTQUFTLEVBQUM7QUFBdkIsS0FBcUNGLGNBQWMsRUFBbkQsQ0FERixFQUVFLG9CQUFDLHNCQUFELFFBQWNDLFdBQVcsRUFBekIsQ0FGRixDQURGO0FBTUQsQ0E1R2MsRUE0R1osVUFBQ08sU0FBRCxFQUFZQyxTQUFaLEVBQTBCO0FBQzNCLE1BQUlDLElBQUksQ0FBQ0MsU0FBTCxDQUFlSCxTQUFTLENBQUNqQyxJQUF6QixNQUFtQ21DLElBQUksQ0FBQ0MsU0FBTCxDQUFlRixTQUFTLENBQUNsQyxJQUF6QixDQUF2QyxFQUF1RTtBQUNyRTtBQUNBLFdBQU8sS0FBUDtBQUNEOztBQUNELE1BQUltQyxJQUFJLENBQUNDLFNBQUwsQ0FBZUgsU0FBUyxDQUFDaEMsV0FBekIsTUFBMENrQyxJQUFJLENBQUNDLFNBQUwsQ0FBZUYsU0FBUyxDQUFDakMsV0FBekIsQ0FBOUMsRUFBcUY7QUFDbkY7QUFDQSxXQUFPLEtBQVA7QUFDRDs7QUFDRCxTQUFPLElBQVA7QUFDRCxDQXRIYyxDQUFmLEMsQ0F3SEE7OztBQUNBSixNQUFNLENBQUN3QyxlQUFQLEdBQXlCO0FBQ3ZCQyxFQUFBQSxVQUFVLEVBQUU7QUFEVyxDQUF6QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIFRleHRJbnB1dCxcbiAgVG9vbGJhckl0ZW0sXG4gIFNlbGVjdCxcbiAgU2VsZWN0T3B0aW9uXG59IGZyb20gJ0BwYXR0ZXJuZmx5L3JlYWN0LWNvcmUnO1xuaW1wb3J0IHsgdXNlRGVib3VuY2UgfSBmcm9tICcuLi91dGlscyc7XG5cbmNvbnN0IFNlYXJjaCA9IFJlYWN0Lm1lbW88eyBcbiAgZGF0YTogYW55LFxuICBjb2x1bW5OYW1lczogYW55LFxuICBvbkNoYW5nZTogYW55XG59PigoeyBkYXRhLCBjb2x1bW5OYW1lcywgb25DaGFuZ2UgfSkgPT4ge1xuICBjb25zb2xlLmxvZygncmVuZGVyIFNlYXJjaCcpO1xuXG4gIGNvbnN0IFtpc0V4cGFuZGVkLCBzZXRFeHBhbmRlZF0gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtzZWxlY3RlZCwgc2V0U2VsZWN0ZWRdID0gUmVhY3QudXNlU3RhdGU8YW55W10+KFtdKTtcbiAgY29uc3QgW3NlYXJjaFZhbHVlLCBzZXRTZWFyY2hWYWx1ZV0gPSBSZWFjdC51c2VTdGF0ZSgnJyk7XG5cbiAgY29uc3QgZGVib3VuY2VkU2VhcmNoVGVybSA9IHVzZURlYm91bmNlKHNlYXJjaFZhbHVlLCA1MDApO1xuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgLy8gdGhpcyBnZXRzIHRyaWdnZXJlZCBhZnRlciB0aGUgZGVib3VuY2UgdGltZXJcbiAgICBvbkNoYW5nZShkZWJvdW5jZWRTZWFyY2hUZXJtLCBzZWxlY3RlZCk7XG4gIH0sIFtkZWJvdW5jZWRTZWFyY2hUZXJtXSk7XG5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAvLyBXaGVuIHNlbGVjdGlvbnMgaW4gdGhlIGZpbHRlciBjaGFuZ2UsIHVwZGF0ZSB0aGUgZmlsdGVyZWQgcm93c1xuICAgIGlmIChzZWFyY2hWYWx1ZSkge1xuICAgICAgb25DaGFuZ2Uoc2VhcmNoVmFsdWUsIHNlbGVjdGVkKTtcbiAgICB9XG4gIH0sIFsgc2VsZWN0ZWQgXSk7XG5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAvLyByZXNldCBzZWFyY2ggYW5kIHNlbGVjdGlvbiBpZiB0aGUgdW5kZXJseWluZyBkYXRhIGhhcyBjaGFuZ2VkXG4gICAgc2V0U2VsZWN0ZWQoW10pO1xuICAgIHNldFNlYXJjaFZhbHVlKCcnKTtcbiAgfSwgWyBkYXRhIF0pO1xuXG4gIC8qKlxuICAgKiBVcGRhdGUgZmlsdGVyZWQgcm93cyBvbiBzZWFyY2ggY2hhbmdlXG4gICAqL1xuICBjb25zdCBoYW5kbGVTZWFyY2hDaGFuZ2UgPSAodmFsdWU6IHN0cmluZykgPT4ge1xuICAgIHNldFNlYXJjaFZhbHVlKHZhbHVlKTtcbiAgfTtcblxuICAvKipcbiAgICogVG9nZ2xlcyB0aGUgZmlsdGVyIHNlbGVjdFxuICAgKi9cbiAgY29uc3Qgb25TZWxlY3RUb2dnbGUgPSAoaXNPcGVuOiBib29sZWFuKSA9PiB7XG4gICAgc2V0RXhwYW5kZWQoaXNPcGVuKTtcbiAgfTtcblxuICAvKipcbiAgICogVXBkYXRlcyBzZWxlY3Rpb24gb24gZmlsdGVyIHNlbGVjdCBjaGFuZ2VcbiAgICovXG4gIGNvbnN0IG9uU2VsZWN0ID0gKGV2ZW50OiBhbnksIHNlbGVjdGlvbjogYW55KSA9PiB7XG4gICAgbGV0IHNlbGVjdGlvbnM7XG4gICAgaWYgKHNlbGVjdGlvbi5pbmRleE9mKHNlbGVjdGVkKSA+IC0xKSB7XG4gICAgICBzZWxlY3Rpb25zID0gc2VsZWN0ZWQuZmlsdGVyKChpdGVtOiBhbnkpID0+IGl0ZW0gIT09IHNlbGVjdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGVjdGlvbnMgPSBbLi4uc2VsZWN0ZWQsIHNlbGVjdGlvbl07XG4gICAgfVxuICAgIHNldFNlbGVjdGVkKHNlbGVjdGlvbnMpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBCdWlsZHMgdGhlIHNlYXJjaCBib3hcbiAgICovXG4gIGNvbnN0IGJ1aWxkU2VhcmNoQm94ID0gKCkgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICA8VGV4dElucHV0XG4gICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgaWQ9XCJncmlkU2VhcmNoXCJcbiAgICAgICAgbmFtZT1cImdyaWRTZWFyY2hcIlxuICAgICAgICBwbGFjZWhvbGRlcj1cIlNlYXJjaCBncmlkXCJcbiAgICAgICAgYXJpYS1sYWJlbD1cIlNlYXJjaCBncmlkXCJcbiAgICAgICAgdmFsdWU9e3NlYXJjaFZhbHVlfVxuICAgICAgICBvbkNoYW5nZT17aGFuZGxlU2VhcmNoQ2hhbmdlfVxuICAgICAgLz5cbiAgICApO1xuICB9O1xuXG4gIC8qKlxuICAgKiBCdWlsZHMgdGhlIGZpbHRlciBzZWxlY3RcbiAgICovXG4gIGNvbnN0IGJ1aWxkU2VsZWN0ID0gKCkgPT4ge1xuICAgIGxldCBpdGVtczogYW55W10gPSBbXTtcbiAgICBjb2x1bW5OYW1lcy5mb3JFYWNoKChpdGVtOiBhbnksIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlID0gYCR7aXRlbS5ncm91cH0gJHtpdGVtLm5hbWV9YDtcbiAgICAgIGl0ZW1zLnB1c2goXG4gICAgICAgIDxTZWxlY3RPcHRpb24ga2V5PXtpbmRleH0gaW5kZXg9e2luZGV4fSB2YWx1ZT17dmFsdWV9IC8+XG4gICAgICApO1xuICAgIH0pXG4gICAgcmV0dXJuIChcbiAgICAgIDxTZWxlY3RcbiAgICAgICAgdmFyaWFudD0nY2hlY2tib3gnXG4gICAgICAgIGFyaWEtbGFiZWw9XCJTZWxlY3QgSW5wdXRcIlxuICAgICAgICBvblRvZ2dsZT17b25TZWxlY3RUb2dnbGV9XG4gICAgICAgIG9uU2VsZWN0PXtvblNlbGVjdH1cbiAgICAgICAgc2VsZWN0aW9ucz17c2VsZWN0ZWR9XG4gICAgICAgIGlzRXhwYW5kZWQ9e2lzRXhwYW5kZWR9XG4gICAgICAgIHBsYWNlaG9sZGVyVGV4dD1cIkZpbHRlciBvbiBjb2x1bW5cIlxuICAgICAgICBhcmlhTGFiZWxsZWRCeT1cIkZpbHRlciBvbiBjb2x1bW5cIlxuICAgICAgPlxuICAgICAgICB7aXRlbXN9XG4gICAgICA8L1NlbGVjdD5cbiAgICApO1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxUb29sYmFySXRlbSBjbGFzc05hbWU9XCJwZi11LW1yLW1kXCI+e2J1aWxkU2VhcmNoQm94KCl9PC9Ub29sYmFySXRlbT5cbiAgICAgIDxUb29sYmFySXRlbT57YnVpbGRTZWxlY3QoKX08L1Rvb2xiYXJJdGVtPlxuICAgIDwvPlxuICApO1xufSwgKHByZXZQcm9wcywgbmV4dFByb3BzKSA9PiB7XG4gIGlmIChKU09OLnN0cmluZ2lmeShwcmV2UHJvcHMuZGF0YSkgIT09IEpTT04uc3RyaW5naWZ5KG5leHRQcm9wcy5kYXRhKSkge1xuICAgIC8vIGRhdGEgaGFzIGNoYW5nZWQsIHJlLXJlbmRlclxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoSlNPTi5zdHJpbmdpZnkocHJldlByb3BzLmNvbHVtbk5hbWVzKSAhPT0gSlNPTi5zdHJpbmdpZnkobmV4dFByb3BzLmNvbHVtbk5hbWVzKSkge1xuICAgIC8vIGFsbFJvd3MgaGF2ZSBjaGFuZ2VkLCByZS1yZW5kZXJcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59KTtcblxuLy8gQHRzLWlnbm9yZVxuU2VhcmNoLndoeURpZFlvdVJlbmRlciA9IHtcbiAgY3VzdG9tTmFtZTogJ1NlYXJjaCdcbn07XG5cbmV4cG9ydCB7IFNlYXJjaCB9OyJdfQ==
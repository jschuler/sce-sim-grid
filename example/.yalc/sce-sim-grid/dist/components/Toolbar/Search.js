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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1Rvb2xiYXIvU2VhcmNoLnRzeCJdLCJuYW1lcyI6WyJTZWFyY2giLCJSZWFjdCIsIm1lbW8iLCJkYXRhIiwiY29sdW1uTmFtZXMiLCJvbkNoYW5nZSIsImNvbnNvbGUiLCJsb2ciLCJ1c2VTdGF0ZSIsImlzRXhwYW5kZWQiLCJzZXRFeHBhbmRlZCIsInNlbGVjdGVkIiwic2V0U2VsZWN0ZWQiLCJzZWFyY2hWYWx1ZSIsInNldFNlYXJjaFZhbHVlIiwiZGVib3VuY2VkU2VhcmNoVGVybSIsInVzZUVmZmVjdCIsImhhbmRsZVNlYXJjaENoYW5nZSIsInZhbHVlIiwib25TZWxlY3RUb2dnbGUiLCJpc09wZW4iLCJvblNlbGVjdCIsImV2ZW50Iiwic2VsZWN0aW9uIiwic2VsZWN0aW9ucyIsImluZGV4T2YiLCJmaWx0ZXIiLCJpdGVtIiwiYnVpbGRTZWFyY2hCb3giLCJidWlsZFNlbGVjdCIsIml0ZW1zIiwiZm9yRWFjaCIsImluZGV4IiwiZ3JvdXAiLCJuYW1lIiwicHVzaCIsInByZXZQcm9wcyIsIm5leHRQcm9wcyIsIkpTT04iLCJzdHJpbmdpZnkiLCJ3aHlEaWRZb3VSZW5kZXIiLCJjdXN0b21OYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBTUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxNQUFNLEdBQUdDLEtBQUssQ0FBQ0MsSUFBTixDQUlaLGdCQUFxQztBQUFBLE1BQWxDQyxJQUFrQyxRQUFsQ0EsSUFBa0M7QUFBQSxNQUE1QkMsV0FBNEIsUUFBNUJBLFdBQTRCO0FBQUEsTUFBZkMsUUFBZSxRQUFmQSxRQUFlO0FBQ3RDQyxFQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxlQUFaOztBQURzQyx3QkFHSk4sS0FBSyxDQUFDTyxRQUFOLENBQWUsS0FBZixDQUhJO0FBQUE7QUFBQSxNQUcvQkMsVUFIK0I7QUFBQSxNQUduQkMsV0FIbUI7O0FBQUEseUJBSU5ULEtBQUssQ0FB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RSxvQkFBQyxpQkFBRDtBQUNFLE1BQUEsT0FBTyxFQUFDLFVBRFY7QUFFRSxvQkFBVyxjQUZiO0FBR0UsTUFBQSxRQUFRLEVBQUVDLGNBSFo7QUFJRSxNQUFBLFFBQVEsRUFBRUUsUUFKWjtBQUtFLE1BQUEsVUFBVSxFQUFFVixRQUxkO0FBTUUsTUFBQSxVQUFVLEVBQUVGLFVBTmQ7QUFPRSxNQUFBLGVBQWUsRUFBQyxrQkFQbEI7QUFRRSxNQUFBLGNBQWMsRUFBQztBQVJqQixPQVVHcUIsS0FWSCxDQURGO0FBY0QsR0F0QkQ7O0FBd0JBLFNBQ0UsMENBQ0Usb0JBQUMsc0JBQUQ7QUFBYSxJQUFBLFNBQVMsRUFBQztBQUF2QixLQUFxQ0YsY0FBYyxFQUFuRCxDQURGLEVBRUUsb0JBQUMsc0JBQUQsUUFBY0MsV0FBVyxFQUF6QixDQUZGLENBREY7QUFNRCxDQTVHYyxFQTRHWixVQUFDTyxTQUFELEVBQVlDLFNBQVosRUFBMEI7QUFDM0IsTUFBSUMsSUFBSSxDQUFDQyxTQUFMLENBQWVILFNBQVMsQ0FBQ2pDLElBQXpCLE1BQW1DbUMsSUFBSSxDQUFDQyxTQUFMLENBQWVGLFNBQVMsQ0FBQ2xDLElBQXpCLENBQXZDLEVBQXVFO0FBQ3JFO0FBQ0EsV0FBTyxLQUFQO0FBQ0Q7O0FBQ0QsTUFBSW1DLElBQUksQ0FBQ0MsU0FBTCxDQUFlSCxTQUFTLENBQUNoQyxXQUF6QixNQUEwQ2tDLElBQUksQ0FBQ0MsU0FBTCxDQUFlRixTQUFTLENBQUNqQyxXQUF6QixDQUE5QyxFQUFxRjtBQUNuRjtBQUNBLFdBQU8sS0FBUDtBQUNEOztBQUNELFNBQU8sSUFBUDtBQUNELENBdEhjLENBQWYsQyxDQXdIQTs7O0FBQ0FKLE1BQU0sQ0FBQ3dDLGVBQVAsR0FBeUI7QUFDdkJDLEVBQUFBLFVBQVUsRUFBRTtBQURXLENBQXpCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtcbiAgVGV4dElucHV0LFxuICBUb29sYmFySXRlbSxcbiAgU2VsZWN0LFxuICBTZWxlY3RPcHRpb25cbn0gZnJvbSAnQHBhdHRlcm5mbHkvcmVhY3QtY29yZSc7XG5pbXBvcnQgeyB1c2VEZWJvdW5jZSB9IGZyb20gJy4uL3V0aWxzJztcblxuY29uc3QgU2VhcmNoID0gUmVhY3QubWVtbzx7IFxuICBkYXRhOiBhbnksXG4gIGNvbHVtbk5hbWVzOiBhbnksXG4gIG9uQ2hhbmdlOiBhbnlcbn0+KCh7IGRhdGEsIGNvbHVtbk5hbWVzLCBvbkNoYW5nZSB9KSA9PiB7XG4gIGNvbnNvbGUubG9nKCdyZW5kZXIgU2VhcmNoJyk7XG5cbiAgY29uc3QgW2lzRXhwYW5kZWQsIHNldEV4cGFuZGVkXSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW3NlbGVjdGVkLCBzZXRTZWxlY3RlZF0gPSBSZWFjdC51c2VTdGF0ZTxhbnlbXT4oW10pO1xuICBjb25zdCBbc2VhcmNoVmFsdWUsIHNldFNlYXJjaFZhbHVlXSA9IFJlYWN0LnVzZVN0YXRlKCcnKTtcblxuICBjb25zdCBkZWJvdW5jZWRTZWFyY2hUZXJtID0gdXNlRGVib3VuY2Uoc2VhcmNoVmFsdWUsIDUwMCk7XG5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAvLyB0aGlzIGdldHMgdHJpZ2dlcmVkIGFmdGVyIHRoZSBkZWJvdW5jZSB0aW1lclxuICAgIG9uQ2hhbmdlKGRlYm91bmNlZFNlYXJjaFRlcm0sIHNlbGVjdGVkKTtcbiAgfSwgW2RlYm91bmNlZFNlYXJjaFRlcm1dKTtcblxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIC8vIFdoZW4gc2VsZWN0aW9ucyBpbiB0aGUgZmlsdGVyIGNoYW5nZSwgdXBkYXRlIHRoZSBmaWx0ZXJlZCByb3dzXG4gICAgaWYgKHNlYXJjaFZhbHVlKSB7XG4gICAgICBvbkNoYW5nZShzZWFyY2hWYWx1ZSwgc2VsZWN0ZWQpO1xuICAgIH1cbiAgfSwgWyBzZWxlY3RlZCBdKTtcblxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIC8vIHJlc2V0IHNlYXJjaCBhbmQgc2VsZWN0aW9uIGlmIHRoZSB1bmRlcmx5aW5nIGRhdGEgaGFzIGNoYW5nZWRcbiAgICBzZXRTZWxlY3RlZChbXSk7XG4gICAgc2V0U2VhcmNoVmFsdWUoJycpO1xuICB9LCBbIGRhdGEgXSk7XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBmaWx0ZXJlZCByb3dzIG9uIHNlYXJjaCBjaGFuZ2VcbiAgICovXG4gIGNvbnN0IGhhbmRsZVNlYXJjaENoYW5nZSA9ICh2YWx1ZTogc3RyaW5nKSA9PiB7XG4gICAgc2V0U2VhcmNoVmFsdWUodmFsdWUpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBUb2dnbGVzIHRoZSBmaWx0ZXIgc2VsZWN0XG4gICAqL1xuICBjb25zdCBvblNlbGVjdFRvZ2dsZSA9IChpc09wZW46IGJvb2xlYW4pID0+IHtcbiAgICBzZXRFeHBhbmRlZChpc09wZW4pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHNlbGVjdGlvbiBvbiBmaWx0ZXIgc2VsZWN0IGNoYW5nZVxuICAgKi9cbiAgY29uc3Qgb25TZWxlY3QgPSAoZXZlbnQ6IGFueSwgc2VsZWN0aW9uOiBhbnkpID0+IHtcbiAgICBsZXQgc2VsZWN0aW9ucztcbiAgICBpZiAoc2VsZWN0aW9uLmluZGV4T2Yoc2VsZWN0ZWQpID4gLTEpIHtcbiAgICAgIHNlbGVjdGlvbnMgPSBzZWxlY3RlZC5maWx0ZXIoKGl0ZW06IGFueSkgPT4gaXRlbSAhPT0gc2VsZWN0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZWN0aW9ucyA9IFsuLi5zZWxlY3RlZCwgc2VsZWN0aW9uXTtcbiAgICB9XG4gICAgc2V0U2VsZWN0ZWQoc2VsZWN0aW9ucyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEJ1aWxkcyB0aGUgc2VhcmNoIGJveFxuICAgKi9cbiAgY29uc3QgYnVpbGRTZWFyY2hCb3ggPSAoKSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxUZXh0SW5wdXRcbiAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICBpZD1cImdyaWRTZWFyY2hcIlxuICAgICAgICBuYW1lPVwiZ3JpZFNlYXJjaFwiXG4gICAgICAgIHBsYWNlaG9sZGVyPVwiU2VhcmNoIGdyaWRcIlxuICAgICAgICBhcmlhLWxhYmVsPVwiU2VhcmNoIGdyaWRcIlxuICAgICAgICB2YWx1ZT17c2VhcmNoVmFsdWV9XG4gICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVTZWFyY2hDaGFuZ2V9XG4gICAgICAvPlxuICAgICk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEJ1aWxkcyB0aGUgZmlsdGVyIHNlbGVjdFxuICAgKi9cbiAgY29uc3QgYnVpbGRTZWxlY3QgPSAoKSA9PiB7XG4gICAgbGV0IGl0ZW1zOiBhbnlbXSA9IFtdO1xuICAgIGNvbHVtbk5hbWVzLmZvckVhY2goKGl0ZW06IGFueSwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSBgJHtpdGVtLmdyb3VwfSAke2l0ZW0ubmFtZX1gO1xuICAgICAgaXRlbXMucHVzaChcbiAgICAgICAgPFNlbGVjdE9wdGlvbiBrZXk9e2luZGV4fSBpbmRleD17aW5kZXh9IHZhbHVlPXt2YWx1ZX0gLz5cbiAgICAgICk7XG4gICAgfSlcbiAgICByZXR1cm4gKFxuICAgICAgPFNlbGVjdFxuICAgICAgICB2YXJpYW50PSdjaGVja2JveCdcbiAgICAgICAgYXJpYS1sYWJlbD1cIlNlbGVjdCBJbnB1dFwiXG4gICAgICAgIG9uVG9nZ2xlPXtvblNlbGVjdFRvZ2dsZX1cbiAgICAgICAgb25TZWxlY3Q9e29uU2VsZWN0fVxuICAgICAgICBzZWxlY3Rpb25zPXtzZWxlY3RlZH1cbiAgICAgICAgaXNFeHBhbmRlZD17aXNFeHBhbmRlZH1cbiAgICAgICAgcGxhY2Vob2xkZXJUZXh0PVwiRmlsdGVyIG9uIGNvbHVtblwiXG4gICAgICAgIGFyaWFMYWJlbGxlZEJ5PVwiRmlsdGVyIG9uIGNvbHVtblwiXG4gICAgICA+XG4gICAgICAgIHtpdGVtc31cbiAgICAgIDwvU2VsZWN0PlxuICAgICk7XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPFRvb2xiYXJJdGVtIGNsYXNzTmFtZT1cInBmLXUtbXItbWRcIj57YnVpbGRTZWFyY2hCb3goKX08L1Rvb2xiYXJJdGVtPlxuICAgICAgPFRvb2xiYXJJdGVtPntidWlsZFNlbGVjdCgpfTwvVG9vbGJhckl0ZW0+XG4gICAgPC8+XG4gICk7XG59LCAocHJldlByb3BzLCBuZXh0UHJvcHMpID0+IHtcbiAgaWYgKEpTT04uc3RyaW5naWZ5KHByZXZQcm9wcy5kYXRhKSAhPT0gSlNPTi5zdHJpbmdpZnkobmV4dFByb3BzLmRhdGEpKSB7XG4gICAgLy8gZGF0YSBoYXMgY2hhbmdlZCwgcmUtcmVuZGVyXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChKU09OLnN0cmluZ2lmeShwcmV2UHJvcHMuY29sdW1uTmFtZXMpICE9PSBKU09OLnN0cmluZ2lmeShuZXh0UHJvcHMuY29sdW1uTmFtZXMpKSB7XG4gICAgLy8gYWxsUm93cyBoYXZlIGNoYW5nZWQsIHJlLXJlbmRlclxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn0pO1xuXG4vLyBAdHMtaWdub3JlXG5TZWFyY2gud2h5RGlkWW91UmVuZGVyID0ge1xuICBjdXN0b21OYW1lOiAnU2VhcmNoJ1xufTtcblxuZXhwb3J0IHsgU2VhcmNoIH07Il19
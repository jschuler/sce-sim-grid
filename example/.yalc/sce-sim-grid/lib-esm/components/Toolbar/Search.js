var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import * as React from 'react';
import { TextInput, ToolbarItem, Select, SelectOption } from '@patternfly/react-core';
import { useDebounce } from '../utils';
var Search = React.memo(function (_a) {
    var data = _a.data, columnNames = _a.columnNames, onChange = _a.onChange;
    console.log('render Search');
    var _b = React.useState(false), isExpanded = _b[0], setExpanded = _b[1];
    var _c = React.useState([]), selected = _c[0], setSelected = _c[1];
    var _d = React.useState(''), searchValue = _d[0], setSearchValue = _d[1];
    var debouncedSearchTerm = useDebounce(searchValue, 500);
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
    var handleSearchChange = function (value) {
        setSearchValue(value);
    };
    /**
     * Toggles the filter select
     */
    var onSelectToggle = function (isOpen) {
        setExpanded(isOpen);
    };
    /**
     * Updates selection on filter select change
     */
    var onSelect = function (event, selection) {
        var selections;
        if (selection.indexOf(selected) > -1) {
            selections = selected.filter(function (item) { return item !== selection; });
        }
        else {
            selections = __spreadArrays(selected, [selection]);
        }
        setSelected(selections);
    };
    /**
     * Builds the search box
     */
    var buildSearchBox = function () {
        return (React.createElement(TextInput, { type: "text", id: "gridSearch", name: "gridSearch", placeholder: "Search grid", "aria-label": "Search grid", value: searchValue, onChange: handleSearchChange }));
    };
    /**
     * Builds the filter select
     */
    var buildSelect = function () {
        var items = [];
        columnNames.forEach(function (item, index) {
            var value = item.group + " " + item.name;
            items.push(React.createElement(SelectOption, { key: index, index: index, value: value }));
        });
        return (React.createElement(Select, { variant: 'checkbox', "aria-label": "Select Input", onToggle: onSelectToggle, onSelect: onSelect, selections: selected, isExpanded: isExpanded, placeholderText: "Filter on column", ariaLabelledBy: "Filter on column" }, items));
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(ToolbarItem, { className: "pf-u-mr-md" }, buildSearchBox()),
        React.createElement(ToolbarItem, null, buildSelect())));
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
});
// @ts-ignore
Search.whyDidYouRender = {
    customName: 'Search'
};
export { Search };
//# sourceMappingURL=Search.js.map
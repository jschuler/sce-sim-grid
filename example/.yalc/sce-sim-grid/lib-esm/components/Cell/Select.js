import { Select as PfSelect, SelectOption, SelectVariant, Tooltip } from '@patternfly/react-core';
import * as React from 'react';
import './Input.css';
import './Select.css';
var Select = React.memo(function (_a) {
    var originalValue = _a.originalValue, path = _a.path, id = _a.id, type = _a.type, isReadOnly = _a.isReadOnly, onSelectToggleCallback = _a.onSelectToggleCallback, options = _a.options, deactivateAndFocusCell = _a.deactivateAndFocusCell, setEditable = _a.setEditable, onSave = _a.onSave;
    // console.log('render Select');
    var _b = React.useState(true), isExpanded = _b[0], setExpanded = _b[1];
    var _c = React.useState(originalValue), selected = _c[0], setSelected = _c[1];
    var _d = React.useState(originalValue), savedSelection = _d[0], setSavedSelection = _d[1];
    var _e = React.useState(false), overflown = _e[0], setOverflown = _e[1];
    React.useEffect(function () {
        // workaround to focus on the first list item to enable keyboard navigation
        if (!isReadOnly) {
            onToggle(true);
            setTimeout(function () {
                var element = document.querySelector("button[id=\"" + id + "\"]");
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
    var thisElement = function () {
        return document.getElementById(id);
    };
    /**
     * Saves the current value
     */
    var save = function (selection) {
        setSelected(selection);
        if (savedSelection !== selection) {
            setSavedSelection(selection);
            if (onSave) {
                onSave(id, selection, originalValue);
            }
        }
    };
    /**
     * The Select options
     */
    var selectOptions = options.map(function (option, index) { return (React.createElement(SelectOption, { key: index, value: option, isSelected: true })); });
    /**
     * Toggle the Select
     */
    var onToggle = function (expanded) {
        setExpanded(expanded);
        onSelectToggleCallback(id, expanded);
    };
    /**
     * Set the selection
     */
    var onSelect = function (event, selection) {
        // close the dropdown
        onToggle(false);
        // save operation
        save(selection);
        // mark itself as not editable but maintain focus
        setTimeout(function () {
            deactivateAndFocusCell(id);
        }, 1);
    };
    var onKeyDown = function (event) {
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
    var checkForOverflow = function (event) {
        var element = event ? event.target : thisElement();
        var isOverflown = element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
        setOverflown(isOverflown);
    };
    return (React.createElement(React.Fragment, null, isReadOnly ? (React.createElement(Tooltip, { content: selected, distance: 0, exitDelay: 0, trigger: overflown ? 'mouseenter focus' : 'manual' },
        React.createElement("input", { onMouseOver: checkForOverflow, className: "editor-input truncate", style: { cursor: 'default', textAlign: type === 'string' ? 'left' : 'center' }, type: "text", value: selected, id: id, "aria-label": selected, readOnly: true }))) : (React.createElement(PfSelect, { toggleId: id, variant: SelectVariant.single, "aria-label": "Select Input", onToggle: onToggle, onSelect: onSelect, selections: selected, isExpanded: isExpanded, ariaLabelledBy: "typeahead-select-id", onKeyDown: onKeyDown }, selectOptions))));
}, function (prevProps, nextProps) {
    var shouldRerender = (prevProps.isReadOnly !== nextProps.isReadOnly) || (prevProps.originalValue !== nextProps.originalValue);
    if (shouldRerender) {
        // console.log(`prevProps ${prevProps.originalValue}, nextProps ${nextProps.originalValue}`);
        return false;
    }
    return true;
});
export { Select };
//# sourceMappingURL=Select.js.map
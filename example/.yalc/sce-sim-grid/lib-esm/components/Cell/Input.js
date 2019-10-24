import * as React from "react";
import { Tooltip } from '@patternfly/react-core';
import { useKeyPress, setCaretPositionAtEnd } from '../utils';
import './Input.css';
var Input = React.memo(function (_a) {
    var originalValue = _a.originalValue, path = _a.path, id = _a.id, type = _a.type, isReadOnly = _a.isReadOnly, deactivateAndFocusCell = _a.deactivateAndFocusCell, setEditable = _a.setEditable, onSave = _a.onSave;
    // console.log(`render Input`);
    var _b = React.useState(originalValue), value = _b[0], setValue = _b[1];
    var _c = React.useState(originalValue), savedValue = _c[0], setSavedValue = _c[1];
    var _d = React.useState(false), overflown = _d[0], setOverflown = _d[1];
    // const [changes, setChanges] = React.useState<any[]>([]);
    var _e = React.useState(isReadOnly), isReadOnlyState = _e[0], setReadOnlyState = _e[1];
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
    var thisElement = function () {
        return document.getElementById(id);
    };
    React.useEffect(function () {
        if (!isReadOnlyState) {
            // set caret at the end of the input
            setTimeout(function () {
                setCaretPositionAtEnd(thisElement());
            }, 1);
        }
    });
    /**
     * Set the value on input
     */
    var handleTextInputChange = function (event) {
        setValue(event.currentTarget.value);
    };
    /**
     * Saves the current value
     */
    var save = function () {
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
    var onEnter = function (event) {
        // save operation
        save();
        // mark itself as not editable but maintain focus
        // deactivateAndFocusCell(event.target.id);
        setEditable('');
        setReadOnlyState(true);
    };
    /**
     * Reverts input to previous saved value if changed
     */
    var onEscape = function (event) {
        if (savedValue !== value) {
            setValue(savedValue);
        }
        // mark itself as not editable but maintain focus
        // deactivateAndFocusCell(event.target.id);
        setEditable('');
        setReadOnlyState(true);
    };
    useKeyPress('Escape', onEscape, {
        log: 'input',
        id: id,
        isActive: !isReadOnlyState
    });
    useKeyPress('Enter', onEnter, {
        log: 'input',
        id: id,
        isActive: !isReadOnlyState
    });
    /**
     * When the element loses focus
     * Save the value and notify the Editor that we're not editable anymore
     */
    var onLoseFocus = function (event) {
        if (!isReadOnlyState) {
            setReadOnlyState(true);
            // setEditable('');
            save();
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
    var input = (React.createElement("input", { onMouseOver: checkForOverflow, className: "editor-input truncate", style: { cursor: isReadOnlyState ? 'default' : 'text', textAlign: type === 'string' ? 'left' : 'center' }, value: value, type: "text", onChange: handleTextInputChange, onBlur: onLoseFocus, "aria-label": value, id: id, readOnly: isReadOnlyState }));
    return React.createElement(Tooltip, { content: value, distance: 0, exitDelay: 0, trigger: overflown ? 'mouseenter focus' : 'manual' }, input);
}, function (prevProps, nextProps) {
    var shouldRerender = (prevProps.isReadOnly !== nextProps.isReadOnly) || (prevProps.originalValue !== nextProps.originalValue);
    if (shouldRerender) {
        // console.log(`re-render Input ${nextProps.id}`)
        return false;
    }
    return true;
});
// @ts-ignore
Input.whyDidYouRender = {
    customName: 'Input'
};
export { Input };
//# sourceMappingURL=Input.js.map
import * as React from 'react';
import { Button, ToolbarItem, Expandable } from '@patternfly/react-core';
import { UndoIcon, RedoIcon } from '@patternfly/react-icons';
import { focusCell } from '../utils';
var ChangeTracker = React.memo(function (_a) {
    var undoRedo = _a.undoRedo, onUndo = _a.onUndo, onRedo = _a.onRedo;
    console.log('render ChangeTracker');
    var _b = React.useState({
        undoRedo: undoRedo
    }), stateFromProps = _b[0], setStateFromProps = _b[1];
    React.useEffect(function () {
        // sync props to state
        setStateFromProps({ undoRedo: undoRedo });
    }, [undoRedo]);
    /**
     * The text to display for the change-tracker
     */
    var getChangeText = function () {
        if (stateFromProps.undoRedo.undoList.length === 1) {
            return "1 change";
        }
        else {
            return stateFromProps.undoRedo.undoList.length + " changes";
        }
    };
    /**
     * When a cell id is clicked in the change-tracker, it scrolls and focuses the corresponding element in the grid
     */
    var focusElement = function (id) {
        focusCell(id, 250, true);
    };
    /**
     * The change-tracker element
     */
    var changeTracker = function () {
        var input = (React.createElement("input", { className: "pf-c-form-control pf-u-px-md", type: "button", id: "textInput10", name: "textInput10", "aria-label": "Input example with popover", value: getChangeText() }));
        if (stateFromProps.undoRedo.undoList.length) {
            return (React.createElement(Expandable, { toggleText: getChangeText(), className: "kie-changes pf-u-mx-sm" },
                React.createElement("div", { className: "pf-c-content" },
                    React.createElement("dl", null, stateFromProps.undoRedo.undoList.map(function (change, index) { return (React.createElement(React.Fragment, { key: index },
                        React.createElement("dt", null,
                            React.createElement(Button, { variant: "link", onClick: function () { return focusElement(change.id); }, isInline: true }, change.id)),
                        React.createElement("dd", null, change.value))); })))));
        }
        else {
            return input;
        }
    };
    // const redoTracker = () => {
    //   return (
    //     <Expandable toggleText={(stateFromProps.redoList.length).toString()} className="kie-changes pf-u-mx-sm">
    //       <div className="pf-c-content">
    //         <dl>
    //           {stateFromProps.redoList.map((redo: any, index: number) => (
    //             <React.Fragment key={index}>
    //               <dt><Button variant="link" onClick={() => focusElement(redo.id)} isInline>{redo.id}</Button></dt>
    //               <dd>{redo.value}</dd>
    //             </React.Fragment>
    //           ))}
    //         </dl>
    //       </div>
    //     </Expandable>
    //   );
    // }
    return (React.createElement(ToolbarItem, null,
        React.createElement("div", { className: "pf-c-input-group" },
            React.createElement(Button, { onClick: onUndo, variant: "control", isDisabled: stateFromProps.undoRedo.undoList.length === 0 },
                React.createElement(UndoIcon, null)),
            changeTracker(),
            React.createElement(Button, { onClick: onRedo, variant: "control", isDisabled: stateFromProps.undoRedo.redoList.length === 0 },
                React.createElement(RedoIcon, null)))));
}, function (prevProps, nextProps) {
    if (prevProps.undoRedo.undoList.length !== nextProps.undoRedo.undoList.length || JSON.stringify(prevProps.undoRedo.undoList) !== JSON.stringify(nextProps.undoRedo.undoList)) {
        // last changed cell has changed, re-render
        return false;
    }
    if (prevProps.undoRedo.redoList.length !== nextProps.undoRedo.redoList.length || JSON.stringify(prevProps.undoRedo.redoList) !== JSON.stringify(nextProps.undoRedo.redoList)) {
        // last changed cell has changed, re-render
        return false;
    }
    return true;
});
// @ts-ignore
ChangeTracker.whyDidYouRender = {
    customName: 'ChangeTracker'
};
export { ChangeTracker };
//# sourceMappingURL=ChangeTracker.js.map
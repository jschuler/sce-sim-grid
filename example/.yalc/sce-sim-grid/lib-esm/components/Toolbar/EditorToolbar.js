import { Button, Toolbar, ToolbarGroup, ToolbarItem, } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import * as React from 'react';
import { ChangeTracker } from './ChangeTracker';
import './EditorToolbar.css';
import { HelpModal } from './HelpModal';
import { Search } from './Search';
var EditorToolbar = React.memo(function (_a) {
    // console.log('render EditorToolbar');
    var data = _a.data, allRowsLength = _a.allRowsLength, filteredRowsLength = _a.filteredRowsLength, filterRows = _a.filterRows, columnNames = _a.columnNames, undoRedo = _a.undoRedo, onUndo = _a.onUndo, onRedo = _a.onRedo, readOnly = _a.readOnly;
    var _b = React.useState(false), isModelOpen = _b[0], setModalOpen = _b[1];
    var _c = React.useState({
        data: data,
        allRowsLength: allRowsLength,
        filteredRowsLength: filteredRowsLength,
        columnNames: columnNames,
        undoRedo: undoRedo,
    }), toolbarStateFromProps = _c[0], setToolbarStateFromProps = _c[1];
    React.useEffect(function () {
        // update state from props
        setToolbarStateFromProps({
            data: data,
            allRowsLength: allRowsLength,
            filteredRowsLength: filteredRowsLength,
            columnNames: columnNames,
            undoRedo: undoRedo,
        });
    }, [
        data,
        allRowsLength,
        filteredRowsLength,
        columnNames,
        undoRedo,
    ]);
    var onSearchChange = function (value, selected) {
        filterRows(value, selected);
    };
    /**
     * Opens the Help modal
     */
    var openModal = function () {
        setModalOpen(true);
    };
    /**
     * Closes the Help modal
     */
    var closeModal = function () {
        setModalOpen(false);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Toolbar, { className: "pf-l-toolbar pf-u-justify-content-space-between pf-u-mx-xl pf-u-my-md" },
            !readOnly && React.createElement(ToolbarGroup, null,
                React.createElement(ChangeTracker, { undoRedo: toolbarStateFromProps.undoRedo, onUndo: onUndo, onRedo: onRedo })),
            React.createElement(ToolbarGroup, null,
                toolbarStateFromProps.allRowsLength === filteredRowsLength ? (React.createElement(ToolbarItem, { className: "pf-u-mr-md" },
                    toolbarStateFromProps.allRowsLength,
                    " items")) : (React.createElement(ToolbarItem, { className: "pf-u-mr-md" },
                    filteredRowsLength,
                    " of ",
                    toolbarStateFromProps.allRowsLength,
                    " items")),
                React.createElement(Search, { data: data, columnNames: toolbarStateFromProps.columnNames, onChange: onSearchChange }),
                React.createElement(ToolbarItem, null,
                    React.createElement(Button, { variant: "plain", onClick: openModal },
                        React.createElement(OutlinedQuestionCircleIcon, { size: "md" }))))),
        React.createElement(HelpModal, { isOpen: isModelOpen, onClose: closeModal, readOnly: readOnly })));
}, function (prevProps, nextProps) {
    if (prevProps.allRowsLength !== nextProps.allRowsLength) {
        // filteredRows have changed, re-render
        return false;
    }
    if (prevProps.filteredRowsLength !== nextProps.filteredRowsLength) {
        // filteredRows have changed, re-render
        return false;
    }
    if (prevProps.undoRedo.undoList.length !== nextProps.undoRedo.undoList.length ||
        JSON.stringify(prevProps.undoRedo.undoList) !== JSON.stringify(nextProps.undoRedo.undoList)) {
        // last changed cell has changed, re-render
        return false;
    }
    if (prevProps.undoRedo.redoList.length !== nextProps.undoRedo.redoList.length ||
        JSON.stringify(prevProps.undoRedo.redoList) !== JSON.stringify(nextProps.undoRedo.redoList)) {
        // last changed cell has changed, re-render
        return false;
    }
    return true;
});
// @ts-ignore
EditorToolbar.whyDidYouRender = {
    customName: 'EditorToolbar',
};
export { EditorToolbar };
//# sourceMappingURL=EditorToolbar.js.map
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
var react_core_1 = require("@patternfly/react-core");
var react_icons_1 = require("@patternfly/react-icons");
var HelpModal_1 = require("./HelpModal");
var Search_1 = require("./Search");
var ChangeTracker_1 = require("./ChangeTracker");
require("./EditorToolbar.css");
var EditorToolbar = React.memo(function (_a) {
    var data = _a.data, allRowsLength = _a.allRowsLength, filteredRowsLength = _a.filteredRowsLength, filterRows = _a.filterRows, columnNames = _a.columnNames, undoRedo = _a.undoRedo, onUndo = _a.onUndo, onRedo = _a.onRedo, readOnly = _a.readOnly;
    console.log('render EditorToolbar');
    var _b = React.useState(false), isModelOpen = _b[0], setModalOpen = _b[1];
    var _c = React.useState({
        data: data,
        allRowsLength: allRowsLength,
        filteredRowsLength: filteredRowsLength,
        columnNames: columnNames,
        undoRedo: undoRedo
    }), toolbarStateFromProps = _c[0], setToolbarStateFromProps = _c[1];
    React.useEffect(function () {
        // update state from props
        setToolbarStateFromProps({
            data: data,
            allRowsLength: allRowsLength,
            filteredRowsLength: filteredRowsLength,
            columnNames: columnNames,
            undoRedo: undoRedo
        });
    }, [
        data,
        allRowsLength,
        filteredRowsLength,
        columnNames,
        undoRedo
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
        React.createElement(react_core_1.Toolbar, { className: "pf-l-toolbar pf-u-justify-content-space-between pf-u-mx-xl pf-u-my-md" },
            !readOnly && React.createElement(react_core_1.ToolbarGroup, null,
                React.createElement(ChangeTracker_1.ChangeTracker, { undoRedo: toolbarStateFromProps.undoRedo, onUndo: onUndo, onRedo: onRedo })),
            React.createElement(react_core_1.ToolbarGroup, null,
                toolbarStateFromProps.allRowsLength === filteredRowsLength ? (React.createElement(react_core_1.ToolbarItem, { className: "pf-u-mr-md" },
                    toolbarStateFromProps.allRowsLength,
                    " items")) : (React.createElement(react_core_1.ToolbarItem, { className: "pf-u-mr-md" },
                    filteredRowsLength,
                    " of ",
                    toolbarStateFromProps.allRowsLength,
                    " items")),
                React.createElement(Search_1.Search, { data: data, columnNames: toolbarStateFromProps.columnNames, onChange: onSearchChange }),
                React.createElement(react_core_1.ToolbarItem, null,
                    React.createElement(react_core_1.Button, { variant: "plain", onClick: openModal },
                        React.createElement(react_icons_1.OutlinedQuestionCircleIcon, { size: "md" }))))),
        React.createElement(HelpModal_1.HelpModal, { isOpen: isModelOpen, onClose: closeModal, readOnly: readOnly })));
}, function (prevProps, nextProps) {
    if (prevProps.allRowsLength !== nextProps.allRowsLength) {
        // filteredRows have changed, re-render
        return false;
    }
    if (prevProps.filteredRowsLength !== nextProps.filteredRowsLength) {
        // filteredRows have changed, re-render
        return false;
    }
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
exports.EditorToolbar = EditorToolbar;
// @ts-ignore
EditorToolbar.whyDidYouRender = {
    customName: 'EditorToolbar'
};
//# sourceMappingURL=EditorToolbar.js.map
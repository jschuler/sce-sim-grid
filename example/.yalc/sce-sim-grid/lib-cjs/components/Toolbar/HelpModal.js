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
var HelpModal = function (_a) {
    // console.log('render HelpModal');
    var isOpen = _a.isOpen, onClose = _a.onClose, readOnly = _a.readOnly;
    return (React.createElement(react_core_1.Modal, { isSmall: true, title: "Help", isOpen: isOpen, onClose: onClose, actions: [
            React.createElement(react_core_1.Button, { key: "confirm", variant: "primary", onClick: onClose }, "Close")
        ], isFooterLeftAligned: true },
        React.createElement("div", { className: "pf-c-content" },
            React.createElement("p", null, "The following keyboard interactions are available:"),
            React.createElement("ul", null,
                React.createElement("li", null, "Once a cell is selected, arrow keys can be used to navigate between the cells."),
                React.createElement("li", null, "The Tab and Shift+Tab keys can be used to tab to the next and previous cell."),
                React.createElement("li", null, "CMD+C / CTRL+C copies the cell content."),
                !readOnly && React.createElement(React.Fragment, null,
                    React.createElement("li", null, "Use the Enter key on a cell to enter editing mode."),
                    React.createElement("li", null, "CMD+Z / CTRL+Z undoes the last change."),
                    React.createElement("li", null, "CMD+Shift+Z / CTRL+Shift+Z redoes the last change."),
                    React.createElement("li", null,
                        "When in editing mode:",
                        React.createElement("ul", null,
                            React.createElement("li", null, "The Enter key will save the current cell contents."),
                            React.createElement("li", null, "THe Escape key will reset the cell contents."))))))));
};
exports.HelpModal = HelpModal;
//# sourceMappingURL=HelpModal.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_core_1 = require("@patternfly/react-core");
var react_icons_1 = require("@patternfly/react-icons");
var classnames_1 = __importDefault(require("classnames"));
var React = __importStar(require("react"));
var utils_1 = require("../utils");
require("./Sidebar.css");
var DefinitionsDrawerPanel = React.memo(function (_a) {
    // console.log('render DefinitionsDrawerPanel');
    var definitions = _a.definitions, dmnFilePath = _a.dmnFilePath;
    // DMN file path ClipboardCopy expansion
    var _b = React.useState(false), isExpanded = _b[0], setExpanded = _b[1];
    var _c = React.useState(definitions), definitionsState = _c[0], setDefinitionsState = _c[1];
    var _d = React.useState(dmnFilePath), dmnFilePathState = _d[0], setDmnFilePathState = _d[1];
    React.useEffect(function () {
        // scroll towards the end of the DMN file path input
        setTimeout(function () {
            var element = document.getElementById('dmnFilePath');
            if (element) {
                utils_1.setCaretPositionAtEnd(element);
            }
        }, 1);
    }, [dmnFilePath]);
    React.useEffect(function () {
        if (definitions !== definitionsState) {
            setDefinitionsState(definitions);
        }
        if (dmnFilePath !== dmnFilePathState) {
            setDmnFilePathState(dmnFilePath);
        }
    }, [definitions, dmnFilePath]);
    /**
     * Toggles the DMN file path
     */
    var onToggle = function () {
        setExpanded(!isExpanded);
    };
    /**
     * Copy the DMN file path
     */
    var onCopy = function (event) {
        /* Get the text field */
        var copyText = document.getElementById('dmnFilePath');
        if (copyText && copyText.select) {
            /* Select the text field */
            copyText.select();
            copyText.setSelectionRange(0, 99999); /*For mobile devices*/
            /* Copy the text inside the text field */
            document.execCommand('copy');
            // do not mark the whole text as selected
            utils_1.setCaretPositionAtEnd(copyText);
        }
    };
    var ClipboardCopy = function () { return (React.createElement("div", { className: classnames_1.default('pf-c-clipboard-copy', isExpanded && 'pf-m-expanded') },
        React.createElement("div", { className: "pf-c-clipboard-copy__group" },
            React.createElement("button", { className: "pf-c-clipboard-copy__group-toggle", id: "dmnPathToggle", "aria-labelledby": "dmnPathToggle dmnFilePath", "aria-controls": "content-6", "aria-expanded": "true", "aria-label": "Show content", onClick: onToggle },
                React.createElement(react_icons_1.AngleRightIcon, { className: "pf-c-clipboard-copy__group-toggle-icon" })),
            React.createElement("input", { className: "pf-c-form-control", readOnly: true, type: "text", value: dmnFilePathState, id: "dmnFilePath", "aria-label": "Copyable input" }),
            React.createElement("button", { className: "pf-c-clipboard-copy__group-copy", "aria-label": "Copy to clipboard", id: "dmnPathCopy", "aria-labelledby": "dmnPathCopy dmnFilePath", onClick: onCopy },
                React.createElement(react_icons_1.CopyIcon, null))),
        isExpanded && (React.createElement("div", { className: "pf-c-clipboard-copy__expandable-content", id: "dmnPathContent", style: { color: 'rgb(33, 36, 39)' } }, dmnFilePathState)))); };
    return (React.createElement("div", null,
        React.createElement(react_core_1.TextContent, { className: "pf-u-m-lg" },
            React.createElement("div", { className: "pf-u-mb-xl" },
                React.createElement("div", null, "DMN file path"),
                React.createElement(ClipboardCopy, null)),
            React.createElement("p", null, "To create a test template, define the \"Given\" and \"Expect\" columns by using the expression editor below."),
            React.createElement("h2", null, "Select Data Object"),
            React.createElement("h3", null, "Complex Types"),
            definitionsState.complex.map(function (item) { return (React.createElement(react_core_1.Expandable, { key: item.typeRef, toggleText: item.text }, Object.keys(item.elements).map(function (elementKey) { return (React.createElement("div", { className: "pf-u-mb-sm", key: elementKey },
                React.createElement(react_core_1.Button, { variant: "link" }, elementKey),
                React.createElement("span", null,
                    " [",
                    item.elements[elementKey],
                    "]"))); }))); }),
            React.createElement("h3", null, "Simple Types"),
            definitionsState.simple.map(function (item) { return (React.createElement(react_core_1.Expandable, { key: item.typeRef, toggleText: item.text }, Object.keys(item.elements).map(function (elementKey) { return (React.createElement("div", { className: "pf-u-mb-sm", key: elementKey },
                React.createElement(react_core_1.Button, { variant: "link" }, elementKey),
                React.createElement("span", null,
                    " [",
                    item.elements[elementKey],
                    "]"))); }))); }))));
}, function (prevProps, nextProps) {
    if (JSON.stringify(prevProps.definitions) !== JSON.stringify(nextProps.definitions)) {
        // definitions have changed, re-render
        return false;
    }
    if (prevProps.dmnFilePath !== nextProps.dmnFilePath) {
        // dmnFilePath have changed, re-render
        return false;
    }
    return true;
});
exports.DefinitionsDrawerPanel = DefinitionsDrawerPanel;
//# sourceMappingURL=Sidebar.js.map
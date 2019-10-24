"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Loading spinner used when loading the app and when loading the next page for the grid infinite scrolling
 */
var React = __importStar(require("react"));
var react_core_1 = require("@patternfly/react-core");
var experimental_1 = require("@patternfly/react-core/dist/js/experimental");
var Spinner = function (_a) {
    var text = _a.text, className = _a.className, _b = _a.size, size = _b === void 0 ? 'xl' : _b;
    return (React.createElement(react_core_1.Bullseye, { className: className },
        React.createElement("div", { className: "pf-l-flex pf-m-column" },
            React.createElement("div", { className: "pf-l-flex__item", style: { textAlign: 'center' } },
                React.createElement(experimental_1.Spinner, { size: size })),
            text && React.createElement("div", null,
                React.createElement(react_core_1.Title, { headingLevel: "h1", size: "xl", className: "pf-u-mt-md" }, text)))));
};
exports.Spinner = Spinner;
//# sourceMappingURL=Spinner.js.map
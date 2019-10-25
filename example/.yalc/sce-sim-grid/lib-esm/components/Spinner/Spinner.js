/**
 * Loading spinner used when loading the app and when loading the next page for the grid infinite scrolling
 */
import { Bullseye, Title } from '@patternfly/react-core';
import { Spinner as PfSpinner } from '@patternfly/react-core/dist/js/experimental';
import * as React from 'react';
var Spinner = function (_a) {
    var text = _a.text, className = _a.className, _b = _a.size, size = _b === void 0 ? 'xl' : _b;
    return (React.createElement(Bullseye, { className: className },
        React.createElement("div", { className: "pf-l-flex pf-m-column" },
            React.createElement("div", { className: "pf-l-flex__item", style: { textAlign: 'center' } },
                React.createElement(PfSpinner, { size: size })),
            text && React.createElement("div", null,
                React.createElement(Title, { headingLevel: "h1", size: "xl", className: "pf-u-mt-md" }, text)))));
};
export { Spinner };
//# sourceMappingURL=Spinner.js.map
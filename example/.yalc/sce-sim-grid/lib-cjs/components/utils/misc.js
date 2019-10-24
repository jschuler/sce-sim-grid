"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCaretPosition = function (element, caretPos) {
    // (el.selectionStart === 0 added for Firefox bug)
    if (element.selectionStart || element.selectionStart === 0) {
        element.focus();
        element.setSelectionRange(caretPos, caretPos);
        return true;
    }
    return false;
};
exports.setCaretPositionAtEnd = function (element) {
    var end = element.value.length;
    exports.setCaretPosition(element, end);
};
exports.focusCell = function (id, focusTimeout, scrollTo) {
    if (focusTimeout === void 0) { focusTimeout = 1; }
    if (scrollTo === void 0) { scrollTo = false; }
    var element = document.getElementById(id);
    if (element) {
        scrollTo && element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        setTimeout(function () {
            element.focus();
        }, focusTimeout);
    }
};
exports.getRowColumnFromId = function (id) {
    var currentIdArr = id.split(' ');
    var row = Number.parseInt(currentIdArr[1]);
    var column = Number.parseInt(currentIdArr[3]);
    return {
        row: row,
        column: column
    };
};
//# sourceMappingURL=misc.js.map
export var setCaretPosition = function (element, caretPos) {
    // (el.selectionStart === 0 added for Firefox bug)
    if (element.selectionStart || element.selectionStart === 0) {
        element.focus();
        element.setSelectionRange(caretPos, caretPos);
        return true;
    }
    return false;
};
export var setCaretPositionAtEnd = function (element) {
    var end = element.value.length;
    setCaretPosition(element, end);
};
export var focusCell = function (id, focusTimeout, scrollTo) {
    if (focusTimeout === void 0) { focusTimeout = 1; }
    if (scrollTo === void 0) { scrollTo = false; }
    var element = document.getElementById(id);
    if (element) {
        if (scrollTo) {
            element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        }
        setTimeout(function () {
            element.focus();
        }, focusTimeout);
    }
};
export var getRowColumnFromId = function (id) {
    var currentIdArr = id.split(' ');
    var row = Number.parseInt(currentIdArr[1], 10);
    var column = Number.parseInt(currentIdArr[3], 10);
    return {
        row: row,
        column: column,
    };
};
//# sourceMappingURL=misc.js.map
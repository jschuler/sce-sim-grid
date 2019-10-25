"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
exports.useKeyPress = function (targetKey, fn, options) {
    react_1.useEffect(function () {
        var ref = (options && options.hasOwnProperty('ref')) ? options.ref : null;
        var id = (options && options.hasOwnProperty('id')) ? options.id : null;
        var withModifier = (options && options.hasOwnProperty('withModifier')) ? options.withModifier : false;
        var withShift = (options && options.hasOwnProperty('withShift')) ? options.withShift : false;
        var isActive = (options && options.hasOwnProperty('isActive')) ? options.isActive : true;
        // const log = (options && options.hasOwnProperty('log')) ? options.log : '';
        if (isActive === false) {
            return;
        }
        function downHandler(event) {
            var key = event.key, keyCode = event.keyCode;
            if (id && event.target.getAttribute('id') !== id) {
                return;
            }
            if (!withModifier && (event.ctrlKey || event.metaKey)) {
                // ignore key combination like ctrl+c/command+c unless we specifically asked to use with modifier
                return;
            }
            if ((typeof targetKey === 'string' && key === targetKey) ||
                (typeof targetKey === 'number' && keyCode === targetKey) ||
                (targetKey.test && targetKey.test(key))) {
                if (withModifier && !withShift) {
                    if ((event.ctrlKey || event.metaKey) && !event.shiftKey) {
                        fn(event);
                    }
                }
                else if (!withModifier && withShift) {
                    if (!event.ctrlKey && !event.metaKey && event.shiftKey) {
                        fn(event);
                    }
                }
                else if (withModifier && withShift) {
                    if ((event.ctrlKey || event.metaKey) && event.shiftKey) {
                        fn(event);
                    }
                }
                else {
                    fn(event);
                }
            }
        }
        if (ref && ref.current) {
            // console.log(`add event listener ${log} - ref`);
            ref.current.addEventListener('keydown', downHandler);
        }
        else {
            // console.log(`add event listener ${log} - window`);
            window.addEventListener('keydown', downHandler);
        }
        return function () {
            if (ref && ref.current) {
                // console.log(`remove event listener ${log} - ref`);
                ref.current.removeEventListener('keydown', downHandler);
            }
            else {
                // console.log(`remove event listener ${log} - window`);
                window.removeEventListener('keydown', downHandler);
            }
        };
    });
};
//# sourceMappingURL=useKeyPress.js.map
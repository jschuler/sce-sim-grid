"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
var react_test_renderer_1 = __importDefault(require("react-test-renderer"));
var Spinner_1 = require("./Spinner");
describe('Spinner tests', function () {
    test('it renders', function () {
        var spinner = react_test_renderer_1.default.create(React.createElement(Spinner_1.Spinner, null)).toJSON();
        expect(spinner).toMatchSnapshot();
    });
});
//# sourceMappingURL=Spinner.test.js.map
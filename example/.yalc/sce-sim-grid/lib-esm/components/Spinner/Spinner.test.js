import * as React from 'react';
import renderer from 'react-test-renderer';
import { Spinner } from './Spinner';
describe('Spinner tests', function () {
    test('it renders', function () {
        var spinner = renderer.create(React.createElement(Spinner, null)).toJSON();
        expect(spinner).toMatchSnapshot();
    });
});
//# sourceMappingURL=Spinner.test.js.map
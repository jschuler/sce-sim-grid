import * as React from 'react';
import renderer from 'react-test-renderer';
import { Spinner } from './Spinner';

describe('Spinner tests', () => {
  test('it renders', () => {
    const spinner = renderer.create(<Spinner />).toJSON();
    expect(spinner).toMatchSnapshot();
  });
});
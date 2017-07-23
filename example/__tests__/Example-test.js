import React from 'react';

import renderer from 'react-test-renderer';

import Example from '../Example';

describe('<Example/>', () => {
  it('should render', () => {
    expect(
      renderer.create(<Example />).toJSON()
    ).toMatchSnapshot();
  });
});

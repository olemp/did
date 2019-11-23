import React from 'react';
import { shallow } from 'enzyme';

import CustomersPage from '../index';

describe('<CustomersPage />', () => {
  it('should render its heading', () => {
    const renderedComponent = shallow(<CustomersPage />);
    expect(renderedComponent.contains(<h1>Customers</h1>)).toBe(true);
  });

  it('should never re-render the component', () => {
    const renderedComponent = shallow(<CustomersPage />);
    const inst = renderedComponent.instance();
    expect(inst.shouldComponentUpdate()).toBe(false);
  });
});

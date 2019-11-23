import React from 'react';
import { shallow } from 'enzyme';
import WeekViewPage from '../index';

describe('<WeekViewPage />', () => {
  it('should render its heading', () => {
    const renderedComponent = shallow(<WeekViewPage />);
    expect(renderedComponent.contains(<h1>Week View</h1>)).toBe(true);
  });

  it('should never re-render the component', () => {
    const renderedComponent = shallow(<WeekViewPage />);
    const inst = renderedComponent.instance();
    expect(inst.shouldComponentUpdate()).toBe(false);
  });
});

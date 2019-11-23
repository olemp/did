import React from 'react';
import { shallow } from 'enzyme';
import ProjectsPage from '../ProjectsPage';

describe('<ProjectsPage />', () => {
  it('should render its heading', () => {
    const renderedComponent = shallow(<ProjectsPage />);
    expect(renderedComponent.contains(<h1>Projects</h1>)).toBe(true);
  });

  it('should never re-render the component', () => {
    const renderedComponent = shallow(<ProjectsPage />);
    const inst = renderedComponent.instance();
    expect(inst.shouldComponentUpdate()).toBe(false);
  });
});

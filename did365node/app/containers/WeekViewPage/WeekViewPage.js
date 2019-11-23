import React from 'react';
import { Helmet } from 'react-helmet';
import './style.scss';

export default class WeekViewPage extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div className="weekview-page">
        <Helmet>
          <title>Week View</title>
          <meta
            name="description"
            content=""
          />
        </Helmet>
        <h1>Week View</h1>
        <ul>
          <li>
            <p className="title">Next generation JavaScript</p>
            <p>
              Use template strings, object destructuring, arrow functions, JSX
              syntax and more, today.
            </p>
          </li>
        </ul>
      </div>
    );
  }
}

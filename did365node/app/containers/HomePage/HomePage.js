import React from 'react';
import { Helmet } from 'react-helmet';
import './style.scss';

export default class HomePage extends React.PureComponent {
  componentDidMount() { }

  render() {
    return (
      <article>
        <Helmet>
          <title>Home</title>
          <meta name="description" content="" />
        </Helmet>
        <div className="home-page">
          <section className="centered">
            <h2>Your calendar is your timesheet!</h2>
          </section>
        </div>
      </article>
    );
  }
}

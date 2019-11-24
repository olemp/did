
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { WeekView } from './components/WeekView';
import { Projects } from './components/Projects';
import { Customers } from './components/Customers';
import { Charts } from './components/Charts';
import { initializeIcons } from '@uifabric/icons';

initializeIcons();

if (document.getElementById('app-week') !== null) ReactDom.render(<WeekView weeksToShow={10} />, document.getElementById('app-week'));
if (document.getElementById('app-projects') !== null) ReactDom.render(<Projects />, document.getElementById('app-projects'));
if (document.getElementById('app-customers') !== null) ReactDom.render(<Customers />, document.getElementById('app-customers'));
if (document.getElementById('app-charts') !== null) ReactDom.render(<Charts />, document.getElementById('app-charts'));

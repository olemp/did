
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Week } from './Components/Week';
import { Projects } from './Components/Projects';
import { Customers } from './Components/Customers';

if (document.getElementById('app-week') !== null) ReactDom.render(<Week />, document.getElementById('app-week'));
if (document.getElementById('app-projects') !== null) ReactDom.render(<Projects />, document.getElementById('app-projects'));
if (document.getElementById('app-customers') !== null) ReactDom.render(<Customers />, document.getElementById('app-customers'));
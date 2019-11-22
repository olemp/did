
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Week } from './Components/Week';

if (document.getElementById('app-week') !== null) ReactDom.render(<Week />, document.getElementById('app-week'));
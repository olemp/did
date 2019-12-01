
import { initializeIcons } from '@uifabric/icons';
import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import * as ReactDom from 'react-dom';
import { Customers } from './components/Customers';
import { EventView } from './components/EventView';
import { Projects } from './components/Projects';
import { Reports } from './components/Reports';
import { AdminView } from './components/AdminView';
import { client } from './graphql';

initializeIcons();

/**
 * Registry of components
 */
const COMPONENTS = {
    WEEK: document.getElementById('app-week'),
    PROJECTS: document.getElementById('app-projects'),
    CUSTOMERS: document.getElementById('app-customers'),
    REPORTS: document.getElementById('app-reports'),
    ADMIN: document.getElementById('app-admin'),
}

if (COMPONENTS.WEEK !== null) ReactDom.render(<ApolloProvider client={client}><EventView visibleWeeks={10} /></ApolloProvider>, COMPONENTS.WEEK);
if (COMPONENTS.PROJECTS !== null) ReactDom.render(<ApolloProvider client={client}><Projects /></ApolloProvider>, COMPONENTS.PROJECTS);
if (COMPONENTS.CUSTOMERS !== null) ReactDom.render(<ApolloProvider client={client}><Customers /></ApolloProvider>, COMPONENTS.CUSTOMERS);
if (COMPONENTS.REPORTS !== null) ReactDom.render(<ApolloProvider client={client}><Reports /></ApolloProvider>, COMPONENTS.REPORTS);
if (COMPONENTS.ADMIN !== null) ReactDom.render(<ApolloProvider client={client}><AdminView /></ApolloProvider>, COMPONENTS.ADMIN);
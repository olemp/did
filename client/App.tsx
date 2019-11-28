
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { WeekView } from './components/WeekView';
import { Projects } from './components/Projects';
import { Customers } from './components/Customers';
import { Reports } from './components/Reports';
import { UserRole } from './partials/UserRole';
import { initializeIcons } from '@uifabric/icons';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from 'react-apollo';

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({ uri: `${document.location.origin}/graphql` }),
});

initializeIcons();

/**
 * Registry of components
 */
const COMPONENTS = {
    WEEK: document.getElementById('app-week'),
    PROJECTS: document.getElementById('app-projects'),
    CUSTOMERS: document.getElementById('app-customers'),
    REPORTS: document.getElementById('app-reports'),
}

/**
 * Registry of partials
 */
const PARTIALS = {
    USERROLE: document.getElementById('partial-user-role'),
}

if (COMPONENTS.WEEK !== null) ReactDom.render(<ApolloProvider client={client}><WeekView weeksToShow={10} /></ApolloProvider>, COMPONENTS.WEEK);
if (COMPONENTS.PROJECTS !== null) ReactDom.render(<ApolloProvider client={client}><Projects /></ApolloProvider>, COMPONENTS.PROJECTS);
if (COMPONENTS.CUSTOMERS !== null) ReactDom.render(<ApolloProvider client={client}><Customers /></ApolloProvider>, COMPONENTS.CUSTOMERS);
if (COMPONENTS.REPORTS !== null) ReactDom.render(<ApolloProvider client={client}><Reports /></ApolloProvider>, COMPONENTS.REPORTS);
if (PARTIALS.USERROLE !== null) { ReactDom.render(<UserRole role={PARTIALS.USERROLE.textContent.trim()} />, PARTIALS.USERROLE); }

import * as React from 'react';
import * as ReactDom from 'react-dom';
import { WeekView2 as WeekView } from './components/WeekView';
import { Projects } from './components/Projects';
import { Customers } from './components/Customers';
import { Reports } from './components/Reports';
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

if (document.getElementById('app-week') !== null) ReactDom.render(<ApolloProvider client={client}><WeekView weeksToShow={10} /></ApolloProvider>, document.getElementById('app-week'));
if (document.getElementById('app-projects') !== null) ReactDom.render(<ApolloProvider client={client}><Projects /></ApolloProvider>, document.getElementById('app-projects'));
if (document.getElementById('app-customers') !== null) ReactDom.render(<ApolloProvider client={client}><Customers /></ApolloProvider>, document.getElementById('app-customers'));
if (document.getElementById('app-reports') !== null) ReactDom.render(<ApolloProvider client={client}><Reports /></ApolloProvider>, document.getElementById('app-reports'));
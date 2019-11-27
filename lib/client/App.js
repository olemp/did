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
var cache = new InMemoryCache();
var link = new HttpLink({ uri: document.location.origin + "/graphql" });
var client = new ApolloClient({ cache: cache, link: link, });
initializeIcons(undefined);
if (document.getElementById('app-week') !== null)
    ReactDom.render(React.createElement(ApolloProvider, { client: client },
        React.createElement(WeekView, { weeksToShow: 10 })), document.getElementById('app-week'));
if (document.getElementById('app-projects') !== null)
    ReactDom.render(React.createElement(ApolloProvider, { client: client },
        React.createElement(Projects, null)), document.getElementById('app-projects'));
if (document.getElementById('app-customers') !== null)
    ReactDom.render(React.createElement(ApolloProvider, { client: client },
        React.createElement(Customers, null)), document.getElementById('app-customers'));
if (document.getElementById('app-reports') !== null)
    ReactDom.render(React.createElement(ApolloProvider, { client: client },
        React.createElement(Reports, null)), document.getElementById('app-reports'));
//# sourceMappingURL=App.js.map
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import {
    GraphQLClient,
    ClientContext as GraphQLClientContext,
} from 'graphql-hooks';
import graphQLMemCache from 'graphql-hooks-memcache';
import { AjaxHooksClient, AjaxHooksProvider } from 'ajax-hooks';

import App from 'components/App';

const ajaxHooksClient = new AjaxHooksClient({
    initialState: window.__AJAX_HOOKS_INITIAL_STATE__,
});

const graphqlClient = new GraphQLClient({
    url: '/api/graphql',
    cache: graphQLMemCache({ initialState: window.__GRAPHQL_INITIAL_STATE__ }),
});

ReactDOM.hydrate(
    (
        <AjaxHooksProvider client={ajaxHooksClient}>
            <GraphQLClientContext.Provider value={graphqlClient}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </GraphQLClientContext.Provider>
        </AjaxHooksProvider>
    ),
    document.getElementById('root'),
);

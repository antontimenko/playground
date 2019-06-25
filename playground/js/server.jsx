import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Helmet } from 'react-helmet';
import { StaticRouter } from 'react-router-dom';
import {
    GraphQLClient,
    ClientContext as GraphQLClientContext,
} from 'graphql-hooks';
import graphQLMemCache from 'graphql-hooks-memcache';
import { getInitialState as getGraphQLInitialState } from 'graphql-hooks-ssr';
import fetch from 'node-fetch';
import axios from 'axios';
import express from 'express';

import { AjaxHooksClient, AjaxHooksProvider } from 'ajax-hooks';

import App from 'components/App';

const HTML = (root, helmet, graphQLState, ajaxHooksState) => (
    `<!DOCTYPE html>
<html ${helmet.htmlAttributes.toString()}>
    <head>
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}
    </head>
    <body ${helmet.bodyAttributes.toString()}>
        <div id="root">${root}</div>

        <script type="text/javascript">
            window.__GRAPHQL_INITIAL_STATE__ = ${JSON.stringify(graphQLState)};
            window.__AJAX_HOOKS_INITIAL_STATE__ = ${JSON.stringify(ajaxHooksState)};
        </script>
        <script type="text/javascript" src="http://localhost:8001/main.js"></script>
    </body>
</html>`
);

const app = express();

app.get('*', async (req, res) => {
    const axiosInstance = axios.create({
        baseURL: 'http://api:8002',
        timeout: 5000,
    });

    const ajaxHooksClient = new AjaxHooksClient({
        axios: axiosInstance,
        ssrMode: true,
    });

    const graphqlClient = new GraphQLClient({
        url: 'http://api:8002/api/graphql',
        ssrMode: true,
        cache: graphQLMemCache(),
        fetch,
    });

    const staticContext = {};

    const Application = (
        <AjaxHooksProvider client={ajaxHooksClient}>
            <GraphQLClientContext.Provider value={graphqlClient}>
                <StaticRouter location={req.url} context={staticContext}>
                    <App />
                </StaticRouter>
            </GraphQLClientContext.Provider>
        </AjaxHooksProvider>
    );

    let graphQLState;
    let lastAjaxRequestsCount = 0;
    while (true) {
        graphQLState = await getGraphQLInitialState({
            App: Application,
            client: graphqlClient,
        });

        const ajaxRequestsCount = await ajaxHooksClient.waitSSRRequests(
            Application,
        );

        if (staticContext.url) {
            res.redirect(staticContext.url);
            return;
        }

        if (ajaxRequestsCount === lastAjaxRequestsCount) {
            break;
        }

        lastAjaxRequestsCount = ajaxRequestsCount;
    }

    const rootHTML = ReactDOMServer.renderToString(Application);

    const helmet = Helmet.renderStatic();

    const pageStatus = staticContext.pageStatus
        ? staticContext.pageStatus
        : 200;

    res.status(pageStatus).send(
        HTML(rootHTML, helmet, graphQLState, ajaxHooksClient.dumpCache()),
    );
});

app.listen(8003, () => {
    console.log('SSR server listening on port 8003!'); // eslint-disable-line no-console
});

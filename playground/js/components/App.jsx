import React from 'react';
import Helmet from 'react-helmet';
import { Route, Switch } from 'react-router-dom';

import IndexView from 'views/IndexView';
import AnotherView from 'views/AnotherView';
import RedirectView from 'views/RedirectView';
import Error404View from 'views/Error404View';

const App = () => (
    <>
        <Helmet>
            <meta charset='utf-8' />
        </Helmet>
        <Switch>
            <Route path='/' exact component={IndexView} />
            <Route path='/another' component={AnotherView} />
            <Route path='/redirect' component={RedirectView} />
            <Route component={Error404View} />
        </Switch>
    </>
);

export default App;

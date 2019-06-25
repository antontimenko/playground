import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import AjaxButtonsBlock from 'components/AjaxButtonsBlock';
import GraphQLButtonsBlock from 'components/GraphQLButtonsBlock';
import MixedButtonsBlock from 'components/MixedButtonsBlock';

const IndexView = () => (
    <>
        <Helmet>
            <title>Index View</title>
        </Helmet>
        <h1>Index View</h1>
        <Link to='/another'>Another View</Link>
        <br />
        <Link to='/redirect'>Redirect View</Link>
        <br />
        <Link to='/404'>404 View</Link>
        <br />
        <GraphQLButtonsBlock />
        <br />
        <AjaxButtonsBlock />
        <br />
        <MixedButtonsBlock />
    </>
);

export default IndexView;

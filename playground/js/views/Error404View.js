import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import { setPageStatus } from 'utils/staticcontext';

const Error404View = ({ staticContext }) => {
    setPageStatus(staticContext, 404);

    return (
        <>
            <Helmet>
                <title>Error 404 View</title>
            </Helmet>
            <h1>Error 404 View</h1>
            <Link to="/">Index View</Link>
        </>
    );
};

export default Error404View;

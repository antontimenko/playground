import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import { setPageStatus } from 'utils/static-context';

const Error404View = ({ staticContext }) => {
    setPageStatus(staticContext, 404);

    return (
        <>
            <Helmet>
                <title>Error 404 View</title>
            </Helmet>
            <h1>Error 404 View</h1>
            <Link to='/'>Index View</Link>
        </>
    );
};

Error404View.propTypes = {
    staticContext: PropTypes.any.isRequired,
};

export default Error404View;

import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

const AnotherView = () => (
    <>
        <Helmet>
            <title>Another View</title>
        </Helmet>
        <h1>Another View</h1>
        <Link to="/">Index View</Link>
    </>
);

export default AnotherView;

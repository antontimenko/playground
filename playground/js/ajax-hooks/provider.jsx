import React from 'react';
import PropTypes from 'prop-types';

import AjaxHooksClient from './client';
import AjaxHooksContext from './context';

const AjaxHooksProvider = ({ client, children }) => {
    if (client.ssrMode) {
        client.cache.resetOneTimeCounts();
    }

    return (
        <AjaxHooksContext.Provider value={client}>
            {children}
        </AjaxHooksContext.Provider>
    );
};

AjaxHooksProvider.propTypes = {
    client: PropTypes.instanceOf(AjaxHooksClient).isRequired,
    children: PropTypes.node.isRequired,
};

export default AjaxHooksProvider;

import React from 'react';

import AjaxHooksContext from './context';

const AjaxHooksProvider = ({ client, children }) => {
    if (client.ssrMode) {
        client.cache.resetOneTimeCounts();
    }

    return (
        <AjaxHooksContext.Provider
            value={client}
            children={children}
        />
    );
};

export default AjaxHooksProvider;

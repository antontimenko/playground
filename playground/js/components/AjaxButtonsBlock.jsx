import React from 'react';
import PropTypes from 'prop-types';
import { useAjax } from 'ajax-hooks';

const getButtonText = ({ loading, error, response }) => {
    if (loading) {
        return 'LOADING';
    }

    if (error) {
        return 'ERROR';
    }

    if (response) {
        return response.data.text;
    }

    return 'MANUAL';
};

const AjaxButtonSSR = () => {
    const { loading, error, response, execute } = useAjax('/api/random-text');

    return (
        <button type='button' onClick={execute}>
            {getButtonText({ loading, error, response })}
        </button>
    );
};

const AjaxButtonSkipSSR = () => {
    const { loading, error, response, execute } = useAjax({
        url: '/api/random-text',
        params: { button: 'skipssr' },
    }, {
        skipSSR: true,
    });

    return (
        <button type='button' onClick={execute}>
            {getButtonText({ loading, error, response })}
        </button>
    );
};

const AjaxButtonManual = () => {
    const { loading, error, response, execute } = useAjax({
        url: '/api/random-text',
        params: { button: 'manual' },
    }, {
        manual: true,
    });

    return (
        <button type='button' onClick={execute}>
            {getButtonText({ loading, error, response })}
        </button>
    );
};

const AjaxButtonManualCache = () => {
    const { loading, error, response, execute } = useAjax({
        url: '/api/random-text',
        params: { button: 'manual_cache' },
    }, {
        manual: true,
    });

    return (
        <button
            type='button'
            onClick={() => execute({ options: { cacheRead: true } })}
        >
            {getButtonText({ loading, error, response })}
        </button>
    );
};

const AjaxButtonChainElement = ({
    chainIndex,
    chainSize,
    requestOptions,
    requestAttr,
}) => {
    if (chainIndex === chainSize) {
        return null;
    }

    const { loading, error, response, execute } = useAjax({
        url: '/api/random-text',
        params: { button: requestAttr },
    }, requestOptions);

    return (
        <>
            <button type='button' onClick={execute}>
                {getButtonText({ loading, error, response })}
            </button>
            {(!loading) && (!error) && response ? (
                <AjaxButtonChainElement
                    chainIndex={chainIndex + 1}
                    chainSize={chainSize}
                    requestOptions={requestOptions}
                    requestAttr={requestAttr}
                />
            ) : null}
        </>
    );
};

AjaxButtonChainElement.propTypes = {
    chainIndex: PropTypes.number.isRequired,
    chainSize: PropTypes.number.isRequired,
    requestOptions: PropTypes.any,
    requestAttr: PropTypes.string,
};

AjaxButtonChainElement.defaultProps = {
    requestOptions: undefined,
    requestAttr: undefined,
};

const AjaxButtonChain = ({ chainSize, requestOptions, requestAttr }) => (
    <AjaxButtonChainElement
        chainIndex={0}
        chainSize={chainSize}
        requestOptions={requestOptions}
        requestAttr={requestAttr}
    />
);

AjaxButtonChain.propTypes = {
    chainSize: PropTypes.number.isRequired,
    requestOptions: PropTypes.any,
    requestAttr: PropTypes.string,
};

AjaxButtonChain.defaultProps = {
    requestOptions: undefined,
    requestAttr: undefined,
};

const AjaxButtonsBlock = () => (
    <div>
        <h3>Ajax Buttons Block</h3>
        <p>
            SSR Button:
            <AjaxButtonSSR />
        </p>
        <p>
            SSR Skip Button:
            <AjaxButtonSkipSSR />
        </p>
        <p>
            Manual Button (with cache):
            <AjaxButtonManualCache />
        </p>
        <p>
            Manual Button (without cache):
            <AjaxButtonManual />
        </p>
        <p>
            Chain SSR (with cache):
            <AjaxButtonChain chainSize={5} requestAttr='chain_ssr_cache' />
        </p>
        <p>
            Chain SSR (onetime cache):
            <AjaxButtonChain
                chainSize={5}
                requestOptions={{ cacheOnetime: true }}
                requestAttr='chain_ssr_onetime_cache'
            />
        </p>
        <p>
            Chain SSR skip (with cache):
            <AjaxButtonChain
                chainSize={5}
                requestOptions={{ skipSSR: true }}
                requestAttr='chain_ssr_skip_cache'
            />
        </p>
        <p>
            Chain SSR skip (no cache):
            <AjaxButtonChain
                chainSize={5}
                requestOptions={{
                    skipSSR: true,
                    cacheRead: false,
                    cacheWrite: false,
                }}
                requestAttr='chain_ssr_skip_no_cache'
            />
        </p>
    </div>
);

export default AjaxButtonsBlock;

import React, { useState } from 'react';
import { useAjax } from 'ajax-hooks';

const getButtonText = ({ loading, error, response }) => {
    if (loading) {
        return 'LOADING';
    } else if (error) {
        return 'ERROR';
    } else if (response) {
        return response.data.text;
    } else {
        return 'MANUAL';
    }
}

const AjaxButtonSSR = () => {
    const { loading, error, response, execute } = useAjax('/api/random-text');

    return (
        <button type='button' onClick={execute()}>{getButtonText({ loading, error, response })}</button>
    )
}

const AjaxButtonSkipSSR = () => {
    const { loading, error, response, execute } = useAjax({
        url: '/api/random-text',
        params: { 'button': 'skipssr' },
    }, {
        skipSSR: true,
    });

    return (
        <button type='button' onClick={execute()}>{getButtonText({ loading, error, response })}</button>
    )
}

const AjaxButtonManual = () => {
    const { loading, error, response, execute } = useAjax({
        url: '/api/random-text',
        params: { 'button': 'manual' },
    }, {
        manual: true,
    });

    return (
        <button type='button' onClick={execute()}>{getButtonText({ loading, error, response })}</button>
    )
}

const AjaxButtonManualCache = () => {
    const { loading, error, response, execute } = useAjax({
        url: '/api/random-text',
        params: { 'button': 'manual_cache' },
    }, {
        manual: true,
    });

    return (
        <button type='button' onClick={execute({ options: { cacheRead: true } })}>{getButtonText({ loading, error, response })}</button>
    )
}

const AjaxButtonChainElement = ({ chainIndex, chainSize, requestProps, requestAttr }) => {
    if (chainIndex === chainSize) {
        return null;
    }

    const { loading, error, response, execute } = useAjax({
        url: '/api/random-text',
        params: { 'button': requestAttr },
    }, requestProps);

    return (
        <>
            <button type='button' onClick={execute()}>{getButtonText({ loading, error, response })}</button>
            {(!loading) && (!error) && response ? (
                <AjaxButtonChainElement
                    chainIndex={chainIndex + 1}
                    chainSize={chainSize}
                    requestProps={requestProps}
                    requestAttr={requestAttr}
                />
            ) : null}
        </>
    )
}

const AjaxButtonChain = ({ chainSize, requestProps, requestAttr }) => (
    <AjaxButtonChainElement
        chainIndex={0}
        chainSize={chainSize}
        requestProps={requestProps}
        requestAttr={requestAttr}
    />
)

const AjaxButtonsBlock = () => (
    <div>
        <h3>Ajax Buttons Block</h3>
        <p>
            SSR Button: <AjaxButtonSSR />
        </p>
        <p>
            SSR Skip Button: <AjaxButtonSkipSSR />
        </p>
        <p>
            Manual Button (with cache): <AjaxButtonManualCache />
        </p>
        <p>
            Manual Button (without cache): <AjaxButtonManual />
        </p>
        <p>
            Chain SSR (with cache):
            <AjaxButtonChain chainSize={5} requestAttr={'chain_ssr_cache'} />
        </p>
        <p>
            Chain SSR (onetime cache):
            <AjaxButtonChain chainSize={5} requestProps={{ cacheOnetime: true }} requestAttr={'chain_ssr_onetime_cache'} />
        </p>
        <p>
            Chain SSR skip (with cache):
            <AjaxButtonChain chainSize={5} requestProps={{ skipSSR: true }} requestAttr={'chain_ssr_skip_cache'} />
        </p>
        <p>
            Chain SSR skip (no cache):
            <AjaxButtonChain chainSize={5} requestProps={{ skipSSR: true, cacheRead: false, cacheWrite: false }} requestAttr={'chain_ssr_skip_no_cache'} />
        </p>
    </div>
);

export default AjaxButtonsBlock;

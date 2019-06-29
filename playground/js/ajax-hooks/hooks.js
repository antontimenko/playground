import { useState, useEffect, useContext, useMemo } from 'react';
import hash from 'object-hash';

import AjaxHooksContext from './context';

const useAjaxHooksClient = () => useContext(AjaxHooksContext);

const getRequestHash = axiosProps => hash(JSON.stringify(axiosProps));

const performHttpRequest = async (axiosProps, ajaxHooksClient) => {
    try {
        const response = await ajaxHooksClient.axios(axiosProps);
        return { error: null, response };
    } catch (error) {
        return { error, response: error.response || null };
    }
};

const MANUAL_RESULT = {
    loading: false,
    error: null,
    response: null,
    fromCache: null,
};

const LOADING_RESULT = {
    loading: true,
    error: null,
    response: null,
    fromCache: null,
};

const ajaxOnServer = (
    axiosProps,
    {
        manual = false,
        skipSSR = false,
        cacheRead = true,
        cacheWrite = true,
        cacheOnetime = false,
    },
    ajaxHooksClient,
) => {
    let result;

    if (manual) {
        result = MANUAL_RESULT;
    } else if (skipSSR || !cacheRead || !cacheWrite) {
        result = LOADING_RESULT;
    } else {
        const requestHash = getRequestHash(axiosProps);

        const cacheResult = ajaxHooksClient.cache.get(
            requestHash,
            cacheOnetime,
        );
        if (cacheResult) {
            const { error, response } = cacheResult;
            result = { error, response, fromCache: true };
        } else {
            if (!ajaxHooksClient.ssrPromises[requestHash]) {
                const requestPromise = (async () => {
                    const { error, response } = await performHttpRequest(
                        axiosProps,
                        ajaxHooksClient,
                    );
                    ajaxHooksClient.cache.set(requestHash, error, response);
                })();

                ajaxHooksClient.ssrPromises[requestHash] = requestPromise;
            }

            result = LOADING_RESULT;
        }
    }

    return {
        execute: () => () => null,
        ...result,
    };
};

const getExecuteFunc = (
    baseAxiosProps,
    baseOptions,
    ajaxHooksClient,
    setResult,
) => async ({
    axiosProps: executeAxiosProps = {},
    options: executeOptions = {},
} = {}) => {
    if (typeof baseAxiosProps === 'string') {
        baseAxiosProps = { url: baseAxiosProps };
    }

    if (typeof executeAxiosProps === 'string') {
        executeAxiosProps = { url: executeAxiosProps };
    }

    if (executeOptions.cacheRead === undefined) {
        executeOptions.cacheRead = false;
    }

    const axiosProps = { ...baseAxiosProps, ...executeAxiosProps };
    const options = { ...baseOptions, ...executeOptions };

    const requestHash = getRequestHash(axiosProps);
    const { cacheRead, cacheWrite, cacheOnetime } = options;

    if (cacheRead) {
        const cacheResult = ajaxHooksClient.cache.get(
            requestHash,
            cacheOnetime,
        );
        if (cacheResult) {
            const { error, response } = cacheResult;
            setResult({
                loading: false,
                error,
                response,
                fromCache: true,
            });
            return;
        }
    }

    setResult(LOADING_RESULT);

    const { error, response } = await performHttpRequest(
        axiosProps,
        ajaxHooksClient,
    );

    if (cacheWrite) {
        ajaxHooksClient.cache.set(requestHash, error, response);
    }

    setResult({ loading: false, error, response, fromCache: false });
};

const ajaxOnClient = (
    axiosProps,
    {
        manual = false,
        cacheRead = true,
        cacheWrite = true,
        cacheOnetime = false,
    },
    ajaxHooksClient,
) => {
    const requestHash = getRequestHash(axiosProps);
    axiosProps = useMemo(() => axiosProps, [requestHash]);

    const initResult = useMemo(() => {
        if (manual) {
            return MANUAL_RESULT;
        }
        if (!cacheRead) {
            return LOADING_RESULT;
        }

        const cacheResult = ajaxHooksClient.cache.get(
            requestHash,
            cacheOnetime,
        );
        if (cacheResult) {
            const { error, response } = cacheResult;
            return { loading: false, error, response, fromCache: true };
        }

        return LOADING_RESULT;
    }, [requestHash]);

    const [result, setResult] = useState(initResult);

    useEffect(() => {
        (async () => {
            if (!(manual || initResult.fromCache)) {
                const { error, response } = await performHttpRequest(
                    axiosProps,
                    ajaxHooksClient,
                );

                if (cacheWrite) {
                    ajaxHooksClient.cache.set(requestHash, error, response);
                }

                setResult({
                    loading: false,
                    error,
                    response,
                    fromCache: false,
                });
            }
        })();
    }, [
        axiosProps,
        ajaxHooksClient,
        requestHash,
        manual,
        cacheRead,
        cacheWrite,
        cacheOnetime,
    ]);

    return {
        execute: getExecuteFunc(
            axiosProps,
            { cacheRead, cacheWrite, cacheOnetime },
            ajaxHooksClient,
            setResult,
        ),
        ...result,
    };
};

export const useAjax = (axiosProps, options = {}) => {
    const ajaxHooksClient = useAjaxHooksClient();

    if (ajaxHooksClient.ssrMode) {
        return ajaxOnServer(axiosProps, options, ajaxHooksClient);
    }

    return ajaxOnClient(axiosProps, options, ajaxHooksClient);
};

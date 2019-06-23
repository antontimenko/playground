import React from 'react';
import { useQuery } from 'graphql-hooks';
import { useAjax } from 'ajax-hooks';

const ButtonBase = ({ prefix, loading, error, data, getText, onClick }) => {
    let buttonText = `${prefix}: `;
    if (loading) {
        buttonText += 'LOADING';
    } else if (error) {
        buttonText += 'ERROR';
    } else if (data) {
        buttonText += getText(data);
    } else {
        buttonText += 'MANUAL';
    }

    return (
        <button type='button' onClick={onClick}>{buttonText}</button>
    )
}

const RANDOM_TEXT_QUERY = `
    query {
        randomText
    }
`;

const GraphQLButtonChainElement = ({ chainIndex, chainSize, withCache, getAttr, ...otherProps }) => {
    const { loading, error, data, refetch } = useQuery(RANDOM_TEXT_QUERY, {
        skipCache: !withCache,
        ssr: withCache,
        variables: {
            button: getAttr(chainIndex),
        }
    });

    return (
        <>
            <ButtonBase
                prefix={'GraphQL'}
                loading={loading}
                error={error}
                data={data}
                getText={data => data.randomText}
                onClick={refetch}
            />
            {(!loading) && (!error) && data ? (
                <MixedButtonChainElement
                    chainIndex={chainIndex + 1}
                    chainSize={chainSize}
                    withCache={withCache}
                    getAttr={getAttr}
                    {...otherProps}
                />
            ) : null}
        </>
    );
}

const AjaxButtonChainElement = ({ chainIndex, chainSize, withCache, getAttr, ...otherProps }) => {
    const { loading, error, response, execute } = useAjax({
        url: '/api/random-text',
        params: { button: getAttr(chainIndex) },
    }, {
        cacheRead: withCache,
    });

    return (
        <>
            <ButtonBase
                prefix={'Ajax'}
                loading={loading}
                error={error}
                data={response}
                getText={response => response.data.text}
                onClick={execute()}
            />
            {(!loading) && (!error) && response ? (
                <MixedButtonChainElement
                    chainIndex={chainIndex + 1}
                    chainSize={chainSize}
                    withCache={withCache}
                    getAttr={getAttr}
                    {...otherProps}
                />
            ) : null}
        </>
    );

    return (
        <button type='button'>AJAX</button>
    );
}

const MixedButtonChainElement = ({ chainIndex, chainSize, ...otherProps }) => {
    if (chainIndex === chainSize) {
        return null;
    }

    return (
        <>
            {chainIndex % 2 === 0 ? (
                <GraphQLButtonChainElement
                    chainIndex={chainIndex}
                    chainSize={chainSize}
                    {...otherProps}
                />
            ) : (
                <AjaxButtonChainElement
                    chainIndex={chainIndex}
                    chainSize={chainSize}
                    {...otherProps}
                />
            )}
        </>
    );
}

const MixedButtonChain = ({ chainSize, ...otherProps }) => (
    <MixedButtonChainElement
        chainIndex={0}
        chainSize={chainSize}
        {...otherProps}
    />
);

const MixedButtonsBlock = () => (
    <div>
        <h3>Mixed buttons block</h3>
        <p>
            Mixed Depend Chain (with cache):
            <MixedButtonChain chainSize={10} withCache={true} getAttr={index => 'mixed_chain_cache'} />
        </p>
        <p>
            Mixed Depend Chain Variable (with cache):
            <MixedButtonChain chainSize={10} withCache={true} getAttr={index => `mixed_chain_cache_${index}`} />
        </p>
        <p>
            Mixed Depend Chain (without cache):
            <MixedButtonChain chainSize={10} withCache={false} getAttr={index => 'mixed_chain_no_cache'} />
        </p>
    </div>
);

export default MixedButtonsBlock;

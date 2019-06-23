import React, { useState } from 'react';
import { useQuery, useManualQuery } from 'graphql-hooks';

const RANDOM_TEXT_QUERY = `
    query {
        randomText
    }
`;

const GraphQLButtonBase = ({ loading, error, data, onClick }) => {
    let buttonText;
    if (loading) {
        buttonText = 'LOADING';
    } else if (error) {
        buttonText = 'ERROR';
    } else if (data) {
        buttonText = data.randomText;
    } else {
        buttonText = 'MANUAL';
    }

    return (
        <button type='button' onClick={onClick}>{buttonText}</button>
    );
}

const GraphQLButton = ({ options }) => {
    const { loading, error, data, refetch } = useQuery(RANDOM_TEXT_QUERY, options);

    return (
        <GraphQLButtonBase
            loading={loading}
            error={error}
            data={data}
            onClick={refetch}
        />
    );
};

const GraphQLButtonManual = ({ attr }) => {
    const [count, setCount] = useState(0);

    const [fetchRandomText, { loading, error, data }] = useManualQuery(
        RANDOM_TEXT_QUERY,
        {
            variables: {
                attr,
                seed: count,
            },
        }
    );

    const buttonClick = () => {
        fetchRandomText();
        setCount(count + 1);
    };

    return (
        <GraphQLButtonBase
            loading={loading}
            error={error}
            data={data}
            onClick={buttonClick}
        />
    );
};

const GraphQLButtonChainElement = ({ chainIndex, chainSize, options, attr }) => {
    if (chainIndex === chainSize) {
        return null;
    }

    const { loading, error, data, refetch } = useQuery(RANDOM_TEXT_QUERY, options);

    return (
        <>
            <GraphQLButtonBase
                loading={loading}
                error={error}
                data={data}
                onClick={refetch}
            />
            {(!loading) && (!error) && data ? (
                <GraphQLButtonChainElement
                    chainIndex={chainIndex + 1}
                    chainSize={chainSize}
                    options={options}
                    attr={attr}
                />
            ) : null}
        </>
    );
};

const GraphQLButtonChain = ({ chainSize, options, attr }) => (
    <GraphQLButtonChainElement
        chainIndex={0}
        chainSize={chainSize}
        options={options}
        attr={attr}
    />
);

const GraphQLButtonsBlock = () => (
    <div>
        <h3>GraphQL Buttons Block</h3>
        <p>
            SSR Button: <GraphQLButton options={{ variables: { attr: 'ssr' } }} />
        </p>
        <p>
            SSR Skip Button: <GraphQLButton options={{ variables: { attr: 'ssr_skip' }, ssr: false } } />
        </p>
        <p>
            Manual button: <GraphQLButtonManual options={{ variables: { attr: 'manual' } }} />
        </p>
        <p>
            Chain SSR (with cache):
            <GraphQLButtonChain chainSize={5} options={{ variables: { attr: 'chain_ssr_cache' } }} />
        </p>
        <p>
            Chain SSR skip (with cache):
            <GraphQLButtonChain chainSize={5} options={{ variables: { attr: 'chain_ssr_skip_cache' }, ssr: false }} />
        </p>
        <p>
            Chain SSR skip (no cache):
            <GraphQLButtonChain chainSize={5} options={{ variables: { attr: 'chain_ssr_skip_no_cache' }, skipCache: true, ssr: false }} />
        </p>
    </div>
);

export default GraphQLButtonsBlock;

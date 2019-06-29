import React from 'react';
import PropTypes from 'prop-types';
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
    );
};

ButtonBase.propTypes = {
    prefix: PropTypes.string.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.any,
    data: PropTypes.any,
    getText: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
};

ButtonBase.defaultProps = {
    loading: false,
    error: null,
    data: null,
};

const RANDOM_TEXT_QUERY = `
    query {
        randomText
    }
`;

const GraphQLButtonChainElement = ({
    chainIndex,
    chainSize,
    withCache,
    getAttr,
    ...otherProps
}) => {
    const { loading, error, data, refetch } = useQuery(RANDOM_TEXT_QUERY, {
        skipCache: !withCache,
        ssr: withCache,
        variables: {
            button: getAttr(chainIndex),
        },
    });

    return (
        <>
            <ButtonBase
                prefix='GraphQL'
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
};

GraphQLButtonChainElement.propTypes = {
    chainIndex: PropTypes.number.isRequired,
    chainSize: PropTypes.number.isRequired,
    withCache: PropTypes.bool.isRequired,
    getAttr: PropTypes.func.isRequired,
};

const AjaxButtonChainElement = ({
    chainIndex,
    chainSize,
    withCache,
    getAttr,
    ...otherProps
}) => {
    const { loading, error, response, execute } = useAjax({
        url: '/api/random-text',
        params: { button: getAttr(chainIndex) },
    }, {
        cacheRead: withCache,
    });

    return (
        <>
            <ButtonBase
                prefix='Ajax'
                loading={loading}
                error={error}
                data={response}
                getText={response => response.data.text}
                onClick={execute}
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
};

AjaxButtonChainElement.propTypes = {
    chainIndex: PropTypes.number.isRequired,
    chainSize: PropTypes.number.isRequired,
    withCache: PropTypes.bool.isRequired,
    getAttr: PropTypes.func.isRequired,
};

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
};

MixedButtonChainElement.propTypes = {
    chainIndex: PropTypes.number.isRequired,
    chainSize: PropTypes.number.isRequired,
};

const MixedButtonChain = ({ chainSize, ...otherProps }) => (
    <MixedButtonChainElement
        chainIndex={0}
        chainSize={chainSize}
        {...otherProps}
    />
);

MixedButtonChain.propTypes = {
    chainSize: PropTypes.number.isRequired,
};

const MixedButtonsBlock = () => (
    <div>
        <h3>Mixed buttons block</h3>
        <p>
            Mixed Depend Chain (with cache):
            <MixedButtonChain
                chainSize={10}
                withCache
                getAttr={() => 'mixed_chain_cache'}
            />
        </p>
        <p>
            Mixed Depend Chain Variable (with cache):
            <MixedButtonChain
                chainSize={10}
                withCache
                getAttr={index => `mixed_chain_cache_${index}`}
            />
        </p>
        <p>
            Mixed Depend Chain (without cache):
            <MixedButtonChain
                chainSize={10}
                withCache={false}
                getAttr={() => 'mixed_chain_no_cache'}
            />
        </p>
    </div>
);

export default MixedButtonsBlock;

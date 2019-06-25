export const setStaticContext = (staticContext, props) => {
    if (staticContext) {
        Object.assign(staticContext, props);
    }
};

export const setPageStatus = (staticContext, pageStatus) => {
    setStaticContext(staticContext, { pageStatus });
};

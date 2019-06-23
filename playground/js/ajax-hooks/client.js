import ReactDOMServer from 'react-dom/server';
import defaultAxios from 'axios';

import AjaxHooksCache from './cache';

class AjaxHooksClient {

    constructor(init = {}) {
        const { axios, ssrMode, initialState, cacheSize } = init;

        this.axios = axios || defaultAxios;

        this.ssrMode = Boolean(ssrMode);
        this.ssrPromises = this.ssrMode ? {} : null;

        this.cache = new AjaxHooksCache({ ssrMode, initialState, size: cacheSize});
    }

    async waitSSRRequests(App) {
        let prevPromisesCount = 0;
        let currentPromisesCount = 0;
        do {
            prevPromisesCount = currentPromisesCount;
            await Promise.all(Object.values(this.ssrPromises));
            ReactDOMServer.renderToStaticMarkup(App);
            currentPromisesCount = Object.keys(this.ssrPromises).length;
        } while (currentPromisesCount !== prevPromisesCount);
        return currentPromisesCount;
    }

    dumpCache() {
        return this.cache.dump();
    }

}

export default AjaxHooksClient;

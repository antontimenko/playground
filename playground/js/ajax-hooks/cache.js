import LRU from 'lru-cache';

class AjaxHooksCache {

    constructor ({
        ssrMode = false,
        initialState,
        size,
    }) {
        this.lru = new LRU(size);
        if (initialState) {
            this.lru.load(JSON.parse(JSON.stringify(initialState)));
        }

        this.ssrMode = ssrMode;
    }

    set (hash, error, response) {
        let cachedResponse = null;
        if (response) {
            const { data, status, statusText, headers } = response;
            cachedResponse = { data, status, statusText, headers };
        }

        this.lru.set(hash, {
            error,
            response: cachedResponse,
            onetimeCount: 0,
        });
    }

    get (hash, onetime = false) {
        const result = this.lru.get(hash);

        if (result) {
            if (onetime) {
                if (this.ssrMode) {
                    ++result.onetimeCount;
                    return result;
                } else {
                    if (result.onetimeCount) {
                        --result.onetimeCount;
                        return result;
                    } else {
                        return null;
                    }
                }
            } else {
                return result;
            }
        }
    }

    dump () {
        return this.lru.dump();
    }

    resetOneTimeCounts () {
        this.lru.forEach((result) => {
            result.onetimeCount = 0;
        });
    }

}

export default AjaxHooksCache;

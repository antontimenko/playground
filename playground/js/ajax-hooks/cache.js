import LRU from 'lru-cache';

class AjaxHooksCache {
    constructor({
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

    set(hash, error, response) {
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

    get(hash, onetime = false) {
        const result = this.lru.get(hash);

        if (result) {
            if (onetime) {
                if (this.ssrMode) {
                    result.onetimeCount += 1;
                    return result;
                }

                if (result.onetimeCount) {
                    result.onetimeCount -= 1;
                    return result;
                }

                return null;
            }

            return result;
        }

        return null;
    }

    dump() {
        return this.lru.dump();
    }

    resetOneTimeCounts() {
        for (const result of this.lru.values()) {
            result.onetimeCount = 0;
        }
    }
}

export default AjaxHooksCache;

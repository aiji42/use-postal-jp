import { useState, useEffect } from 'react';
import { makeRequestURL, parseResponse, sanitize } from './utils';
export const usePostalJp = (postalCode, ready, option) => {
    var _a, _b;
    const url = (_a = option === null || option === void 0 ? void 0 : option.url) !== null && _a !== void 0 ? _a : makeRequestURL;
    const parse = (((_b = option === null || option === void 0 ? void 0 : option.parse) !== null && _b !== void 0 ? _b : parseResponse));
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState(null);
    useEffect(() => {
        let mounted = true;
        if (!ready)
            return;
        setLoading(true);
        fetch(url(sanitize(postalCode)))
            .then((res) => {
            if (!res.ok)
                throw new Error('Bad request');
            return res.json();
        })
            .then((data) => {
            mounted && setAddress(parse(data));
            mounted && setError(null);
        })
            .catch((e) => {
            mounted && setAddress(null);
            mounted && setError(e);
        })
            .finally(() => {
            mounted && setLoading(false);
        });
        return () => {
            mounted = false;
        };
    }, [postalCode, ready]);
    return [address, loading, error];
};
//# sourceMappingURL=main.js.map
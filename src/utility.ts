/** utility function for getting path of current route */
export const getPath = (
    pathname: string = window.location.pathname
): Array<string> => decodeURI(pathname).split('/')
    .filter((seg) => seg !== '');


/** utility function for getting hash of current route */
export const getHash = (hash: string = window.location.hash): string => {
    const decodedHash = decodeURI(hash);
    return decodedHash.length > 0 && decodedHash[1] === '#'
        ? decodedHash.slice(1)
        : '';
};


/** utility function for getting query of current route */
export const getQuery = (
    search: string = window.location.search
): Record<string, string> => {
    let queryString = decodeURI(search);
    while (queryString.startsWith('?')) {
        queryString = queryString.slice(1);
    }
    return queryString
        // split pairs into array, ex: '&a=1&b=2' => ['a=1', 'b=2']
        .split('&')
        // remove empty strings
        .filter((seg) => seg !== '')
        // convert 'key=value' to ['key', 'value']
        .map((keyValue) => keyValue.split('='))
        // convert ['key', 'value'] to { 'key': 'value' }
        .map(([key, value]) => {
            const pair = {} as Record<string, string>;
            pair[key] = value;
            return pair;
        })
        // combine all key value pairs
        .reduce((acc, cur) => ({
            ...acc,
            ...cur,
        }), {});
};


/** constructs the relative href for the given parameters */
export const pathFor = ({
    path = [],
    query = {},
    hash = '',
}: {
    path?: Array<string>;
    query?: Record<string, string>;
    hash?: string;
}): string => {
    const pathStr = path.join('/');
    const hashStr = hash ? `#${hash}` : '';
    const queryParameters = [];
    for (const [key, value] of Object.entries(query)) {
        queryParameters.push(`${key}=${value}`);
    }
    let queryStr = queryParameters.length > 0 ? '?' : '';
    queryStr += queryParameters.join('&');
    return encodeURI(`/${pathStr}${queryStr}${hashStr}`);
};


/** goes to the relative page */
export const goTo = ({
    path = [],
    query = {},
    hash = '',
}: {
    path?: Array<string>;
    query?: Record<string, string>;
    hash?: string;
}): void => {
    const href = pathFor({
        path,
        query,
        hash,
    });
    window.location.href = window.location.origin + href;
};

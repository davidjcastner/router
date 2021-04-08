import type { FunctionComponent } from 'react';
import { Fragment } from 'react';

/** information required for registering a route */
export type RouteDefinition = {

    /** internal name used for router */
    route: string;

    /** react component to render as route page */
    component: FunctionComponent;

    /** url path segments for route */
    path: Array<string>;

    /** whether or not a user must be logged in to see page - default: false */
    isPublic?: boolean;

    /** number of token segments on end of path - default: 0 */
    tokenCount?: number;
};

/** information from parsed url */
export type RouteInformation = {

    /** internal name used for router */
    route: string;

    /** tokens on end of path */
    tokens: Array<string>;

    /** key value pairs from query string */
    query: Record<string, string>;

    /** string appended by hash */
    hash: string;
};

/** values available in router context */
export type RouteState = Required<RouteDefinition> & Omit<RouteInformation, 'route'>;

/** route definition to default to */
const DEFAULT_ROUTE = {
    route: '',
    component: Fragment,
    path: [],
    isPublic: true,
} as RouteDefinition;

/** all registered route by internal route name */
const registry = {
    byName: {} as Record<string, RouteDefinition>,
    byArray: [] as Array<RouteDefinition>,
};


/** checks if two path definitions match */
const isSameDef = (
    defA: RouteDefinition,
    defB: RouteDefinition
): boolean => {
    const totalSegmentsA = defA.path.length + (defA.tokenCount ?? 0);
    const totalSegmentsB = defB.path.length + (defB.tokenCount ?? 0);
    if (totalSegmentsA !== totalSegmentsB) { return false; }
    const minSegments = Math.min(defA.path.length, defB.path.length);
    // checks if the segments match to the minimum depth
    return defA.path.slice(0, minSegments)
        .every((seg, idx) => seg === defB.path[idx]);
};

/** utility functions for routing */
export const router = {

    /** adds all routes to the registry, checks for overlap */
    register: (routes: Array<RouteDefinition>): void => {
        routes.forEach((def) => {
            if (def.route === '') {
                throw Error('Invalid route definition name');
            }
            if (def.route in registry.byName) {
                throw Error(`Duplicate registered route: ${def.route}`);
            }
            if (registry.byArray.some((regDef) => isSameDef(def, regDef))) {
                throw Error(`Path definitions overlap for ${def.route}`);
            }
            registry.byName[def.route] = def;
            registry.byArray.push(def);
        });
    },

    /** utility function for getting path of current route */
    getPath: (): Array<string> => decodeURI(window.location.pathname).split('/')
        .filter((seg) => seg !== ''),


    /** utility function for getting hash of current route */
    getHash: (): string => {
        const decodedHash = decodeURI(window.location.hash);
        return decodedHash.length > 0 && decodedHash[1] === '#'
            ? decodedHash.slice(1)
            : '';
    },

    /** utility function for getting query of current route */
    getQuery: (): Record<string, string> => {
        let queryString = decodeURI(window.location.search);
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
    },

    /** finds the matching route definition for current route */
    getDefinition: (): RouteDefinition => {
        const path = router.getPath();
        const definition = registry.byArray.find((def) => {
            const matchLength = def.path.length + (def.tokenCount ?? 0);
            if (path.length !== matchLength) { return false; }
            return def.path.every((seg, idx) => seg === path[idx]);
        });
        return definition ?? DEFAULT_ROUTE;
    },

    /** gets the full state context for current route */
    getRouteState: (): RouteState => {
        const path = router.getPath();
        const definition = router.getDefinition();
        const tokenStart = path.length - (definition.tokenCount ?? 0);
        return {
            ...definition,
            isPublic: definition.isPublic ?? false,
            tokenCount: definition.tokenCount ?? 0,
            tokens: path.slice(tokenStart),
            query: router.getQuery(),
            hash: router.getHash(),
        };
    },

    /** constructs the relative href for the given route */
    pathFor: ({
        route,
        tokens,
        hash,
        query,
    }: RouteInformation): string => {
        const definition = route in registry.byName
            ? registry.byName[route]
            : DEFAULT_ROUTE;
        const pathStr = definition.path.join('/');
        const hashStr = hash ? `#${hash}` : '';
        const tokenStr = tokens.join('/');
        const queryParameters = [];
        for (const [key, value] of Object.entries(query)) {
            queryParameters.push(`${key}=${value}`);
        }
        let queryStr = queryParameters.length > 0 ? '?' : '';
        queryStr += queryParameters.join('&');
        return encodeURI(`/${pathStr}${tokenStr}${queryStr}${hashStr}`);
    },

    /**
     * pushes the route to the window's history state
     * simulates going to a route
     */
    goTo: ({
        route,
        tokens = [],
        hash = '',
        query = {},
    }: {
        route: string;
        tokens?: Array<string>;
        hash?: string;
        query?: Record<string, string>;
    }): void => {
        const path = router.pathFor({
            route,
            tokens,
            hash,
            query,
        });
        // TODO: replace temporary fix with react re-rendering
        // window.history.pushState({ name: path }, '', path);
        window.location.href = window.location.origin + path;
    },
};

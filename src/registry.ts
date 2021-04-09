import type { RouteDefinition, RouteInformation, RouteState } from './types';
import { Fragment } from 'react';
import { getPath, getQuery, getHash, goTo, pathFor } from './utility';


/** route definition to default to */
const DEFAULT_ROUTE = {
    route: '',
    component: Fragment,
    path: [],
    isPublic: true,
} as RouteDefinition;


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


/** creates a set of utility functions for a set of route definitions */
export const registry = (routes: Array<RouteDefinition>): {
    getRouteState: () => RouteState;
    pathForRoute: (info: Partial<RouteInformation>) => string;
    goToRoute: (info: Partial<RouteInformation>) => void;
} => {
    // all registered routes as array and mapping
    const byName = {} as Record<string, RouteDefinition>;
    const byArray = [] as Array<RouteDefinition>;

    // add each route to the registry
    routes.forEach((def) => {
        if (def.route === '') {
            throw Error('Invalid route definition name');
        }
        if (def.route in byName) {
            throw Error(`Duplicate registered route: ${def.route}`);
        }
        if (byArray.some((regDef) => isSameDef(def, regDef))) {
            throw Error(`Path definitions overlap for ${def.route}`);
        }
        byName[def.route] = def;
        byArray.push(def);
    });

    /** converts RouteInformation to standardize url information */
    const standardizeInfo = ({
        route = '',
        tokens = [],
        query = {},
        hash = '',
    }: {
        route?: string;
        tokens?: Array<string>;
        query?: Record<string, string>;
        hash?: string;
    }): {
        path: Array<string>;
        query: Record<string, string>;
        hash: string;
    } => {
        const def = route in byName ? byName[route] : DEFAULT_ROUTE;
        return {
            path: def.path.concat(tokens),
            query,
            hash,
        };
    };

    /** finds the matching route definition for current route */
    const getDefinition = (): RouteDefinition => {
        const path = getPath();
        const definition = byArray.find((def) => {
            const matchLength = def.path.length + (def.tokenCount ?? 0);
            if (path.length !== matchLength) { return false; }
            return def.path.every((seg, idx) => seg === path[idx]);
        });
        return definition ?? DEFAULT_ROUTE;
    };

    // return utility functions for this registry
    return {

        /** gets the full state context for current route */
        getRouteState: (): RouteState => {
            const path = getPath();
            const definition = getDefinition();
            const tokenStart = path.length - (definition.tokenCount ?? 0);
            return {
                ...definition,
                isPublic: definition.isPublic ?? false,
                tokenCount: definition.tokenCount ?? 0,
                tokens: path.slice(tokenStart),
                query: getQuery(),
                hash: getHash(),
            };
        },

        /** constructs the relative href for the given route */
        pathForRoute: (
            info: Partial<RouteInformation>
        ): string => pathFor(standardizeInfo(info)),

        /** goes to the relative route */
        goToRoute: (
            info: Partial<RouteInformation>
        ): void => { goTo(standardizeInfo(info)); },
    };
};

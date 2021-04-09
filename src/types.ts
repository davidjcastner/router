import type { FunctionComponent } from 'react';


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


/** route information of the current window location */
export type RouteState = Required<RouteDefinition> & Omit<RouteInformation, 'route'>;


/** values available in router/location context */
export type LocationContext = {

    /** internal name used for router */
    route: string;

    /** url path segments for route */
    path: Array<string>;

    /** tokens on end of path */
    tokens: Array<string>;

    /** key value pairs from query string */
    query: Record<string, string>;

    /** string appended by hash */
    hash: string;

    /** whether or not a user must be logged in to see page - default: false */
    isPublic: boolean;

    /** react component to render as route page */
    component: FunctionComponent;

    /** utility function for constructing a relative href based on route info */
    pathForRoute: (info: Partial<RouteInformation>) => string;

    /** utility function for directing to a relative href based on route info */
    goToRoute: (info: Partial<RouteInformation>) => void;
};

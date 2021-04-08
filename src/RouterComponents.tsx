/**
 * library of react components for interacting with the router:
 *
 * components: RouteRegistry, RoutePage, Link
 *
 * contexts: useLocation
 */

import type { FunctionComponent } from 'react';
import type { RouteDefinition, RouteState } from './router';
import React, { Fragment, createContext, useContext, useEffect, useState } from 'react';
import { router } from './router';

/** default values for route context */
const initialLocation: RouteState = {
    route: '',
    component: Fragment,
    path: [],
    isPublic: true,
    tokenCount: 0,
    tokens: [],
    query: {},
    hash: '',
};

/** react context wrapper for location */
const LocationContext = createContext<RouteState>(initialLocation);

/** provides location context to all children in Router component */
export const useLocation = (): RouteState => useContext(LocationContext);

/**
  * registers all routes, and
  * provides location context to all children
  */
export const RouteRegistry: FunctionComponent<{
    routes: Array<RouteDefinition>;
}> = ({
    routes,
    children,
}) => {
    const [state, setState] = useState<RouteState>(initialLocation);
    useEffect(() => {
        // add all routes to the registry
        router.register(routes);
        setState(router.getRouteState());
    }, []);

    // return children wrapped by context provider
    return <LocationContext.Provider value={state}>
        {children}
    </LocationContext.Provider>;
};


/** renders the page component associated with the current route */
export const RoutePage: FunctionComponent<{
    notFound?: FunctionComponent;
    signIn?: FunctionComponent;
    isSignedIn?: boolean;
}> = ({
    notFound = Fragment,
    signIn = Fragment,
    isSignedIn = false,
}) => {
    const { route, component, isPublic } = useLocation();
    const isMissing = route === '';
    const requiresSignIn = !isPublic && !isSignedIn;
    // rename components for valid jsx
    const NotFound = notFound;
    const SignIn = signIn;
    const Page = component;
    return <>
        {isMissing && <NotFound />}
        {!isMissing && requiresSignIn && <SignIn />}
        {!isMissing && !requiresSignIn && <Page />}
    </>;
};


/**
  * creates an anchor element with the correct href,
  * for registered routes only, not path literals,
  * must be within a router component
  */
export const Link: FunctionComponent<{
    route: string;
    tokens?: Array<string>;
    query?: Record<string, string>;
    hash?: string;
    className?: string;
    afterClick?: (() => void) | null;
}> = ({
    route,
    tokens = [],
    query = {},
    hash = '',
    className = '',
    children,
    afterClick = null,
}) => {
    const href = router.pathFor({
        route,
        tokens,
        query,
        hash,
    });
    const onClick = (): void => {
        if (afterClick) {
            afterClick();
        }
    };
    return <a
        href={href}
        className={className}
        onClick={onClick}
    >
        {children}
    </a>;
};

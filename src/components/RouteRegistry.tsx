import type { FC } from 'react';
import type { LocationContext, RouteDefinition } from '../types';
import React, { useEffect, useState } from 'react';
import { initialLocation, Location } from '../context/location';
import { registry } from '../registry';


/**
  * registers all routes, and
  * provides location context to all children
  */
export const RouteRegistry: FC<{
    routes: Array<RouteDefinition>;
}> = ({
    routes,
    children,
}) => {
    const [state, setState] = useState<LocationContext>(initialLocation);
    useEffect(() => {
        // add all routes to the registry
        const reg = registry(routes);
        const routeState = reg.getRouteState();
        setState({
            route: routeState.route,
            path: routeState.path,
            tokens: routeState.tokens,
            query: routeState.query,
            hash: routeState.hash,
            isPublic: routeState.isPublic,
            component: routeState.component,
            pathForRoute: reg.pathForRoute,
            goToRoute: reg.goToRoute,
        });
    }, []);

    // return children wrapped by context provider
    return <Location.Provider value={state}>
        {children}
    </Location.Provider>;
};

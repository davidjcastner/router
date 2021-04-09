import type { LocationContext } from '../types';
import { createContext, Fragment, useContext } from 'react';

/** default values for route context */
export const initialLocation: LocationContext = {
    route: '',
    path: [],
    tokens: [],
    query: {},
    hash: '',
    isPublic: true,
    component: Fragment,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    pathForRoute: (...args) => '',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    goToRoute: (...args) => {
        // do nothing
    },
};

/** react context wrapper for location */
export const Location = createContext<LocationContext>(initialLocation);

/** provides location context to all children in Router component */
export const useLocation = (): LocationContext => useContext(Location);

# Router

NPM Router package with react components for single page apps

- [Router](#router)
  - [How to use](#how-to-use)
  - [Types](#types)
    - [RouteDefinition](#routedefinition)
    - [RouteInformation](#routeinformation)
    - [RouteState](#routestate)
    - [LocationContext](#locationcontext)
  - [Components](#components)
    - [RouteRegistry](#routeregistry)
    - [RoutePage](#routepage)
    - [Link](#link)
  - [Context](#context)
    - [useLocation](#uselocation)
  - [Utility Functions](#utility-functions)

## How to use

```ts
import type { FunctionComponent } from 'react';
import type { RouteDefinition } from '@davidjcastner/router';
import React from 'react';
import { RoutePage, RouteRegistry } from '@davidjcastner/router';

// import all pages
const HomePage: FunctionComponent = () => <div />;
const AccountPage: FunctionComponent = () => <div />;
const OtherPage: FunctionComponent = () => <div />;
const NotFoundPage: FunctionComponent = () => <div />;

// authentication
const SignInForm: FunctionComponent = () => <div />;

// all route definitions
// TIP: use an enum for route names
// routes default to isPublic: false
const routes: Array<RouteDefinition> = [
    {
        route: 'home',
        component: HomePage,
        path: [],
        isPublic: true,
    },
    {
        route: 'account',
        component: AccountPage,
        path: ['account'],
    },
    {
        route: 'other',
        component: OtherPage,
        path: ['other', 'path'],
        tokenCount: 1,
    },
];

// App - root Component
// render or export App component
export const App: FunctionComponent = () => {
    // use authentication method to get a user
    // user/signin is optional (leave all routes public)
    const user = null;

    // wrap RoutePage with RouteRegistry
    // can add layout here or on each page
    return <RouteRegistry routes={routes} >
        <RoutePage
            notFound={NotFoundPage}
            signIn={SignInForm}
            isSignedIn={Boolean(user)} />
    </RouteRegistry>;
};
```

## Types

### RouteDefinition

```ts
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
```

### RouteInformation

```ts
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
```

### RouteState

```ts
/** values available in router/location context */
export type RouteState = Required<RouteDefinition> & Omit<RouteInformation, 'route'>;
```

### LocationContext

```ts
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
```

## Components

### RouteRegistry

Wrap application with RouteRegistry to provide all children with location context.
When using authentication context, the RouteRegistry should be place inside of the authentication context.

```ts
export const RouteRegistry: FunctionComponent<{
    routes: Array<RouteDefinition>;
}>;
```

### RoutePage

RoutePage renders the component that was registered for the current route.
RoutePage must be within a RouteRegistry component.
If the current route, does not match a registered definition, then the notFound component is rendered.
If the route is private and isSignedIn is false, then the signIn component is rendered.

```ts
export const RoutePage: FunctionComponent<{
    notFound?: FunctionComponent;
    signIn?: FunctionComponent;
    isSignedIn?: boolean;
}>;
```

### Link

Link adds a link to the page with the correct relative href for the route specified.
RoutePage must be within a RouteRegistry component.
Additional css classes can be added or an action to complete after being clicked.

```ts
export const Link: FunctionComponent<{
    route: string;
    tokens?: Array<string>;
    query?: Record<string, string>;
    hash?: string;
    className?: string;
    afterClick?: (() => void) | null;
}>;
```

## Context

### useLocation

useLocation provides information about the current route to any child component of a RouteRegistry.
See LocationContext for details.

## Utility Functions

```ts
/** utility function for getting path of current route */
export const getPath = (
    pathname: string = window.location.pathname
) => Array<string>;

/** utility function for getting hash of current route */
export const getHash = (
    hash: string = window.location.hash
) => string;


/** utility function for getting query of current route */
export const getQuery = (
    search: string = window.location.search
) => Record<string, string>;


/** constructs the relative href for the given parameters */
export const pathFor = ({
    path = [],
    query = {},
    hash = '',
}: {
    path?: Array<string>;
    query?: Record<string, string>;
    hash?: string;
}) => string;


/** goes to the relative page */
export const goTo = ({
    path = [],
    query = {},
    hash = '',
}: {
    path?: Array<string>;
    query?: Record<string, string>;
    hash?: string;
}) => void;
```

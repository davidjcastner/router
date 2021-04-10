# Router

front end router for react apps

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

RouteDefinition

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

RouteInformation

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

RouteState

```ts
/** values available in router/location context */
export type RouteState = Required<RouteDefinition> & Omit<RouteInformation, 'route'>;
```

## Components

RouteRegistry

RoutePage

Link

## Context

useLocation

## Utility Functions

pathFor

goTo
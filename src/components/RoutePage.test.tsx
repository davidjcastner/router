import type { FC } from 'react';
import { render } from '@testing-library/react';
import React from 'react';

// import indirectly from index to ensure that
// the component is exported correctly
import {
    RoutePage,
    RouteRegistry,
} from '../index';


// components for testing
const HomePage: FC = () => <div>Home</div>;
const NotFoundPage: FC = () => <div>Missing</div>;
const SignIn: FC = () => <div>SignIn</div>;

describe('RoutePage', () => {
    it('should render a root page', () => {
        const routes = [
            {
                route: 'home',
                component: HomePage,
                path: [],
                isPublic: true,
            },
        ];
        const App: FC = () => <RouteRegistry routes={routes} >
            <RoutePage
                notFound={NotFoundPage}
                signIn={SignIn}
                isSignedIn={true} />
        </RouteRegistry>;
        const { getByText, queryByText } = render(<App />);
        expect(getByText('Home')).toBeTruthy();
        expect(queryByText('Missing')).toBeFalsy();
        expect(queryByText('SignIn')).toBeFalsy();
    });

    it('should render a public root page even if not signed in', () => {
        const routes = [
            {
                route: 'home',
                component: HomePage,
                path: [],
                isPublic: true,
            },
        ];
        const App: FC = () => <RouteRegistry routes={routes} >
            <RoutePage
                notFound={NotFoundPage}
                signIn={SignIn}
                isSignedIn={false} />
        </RouteRegistry>;
        const { getByText, queryByText } = render(<App />);
        expect(getByText('Home')).toBeTruthy();
        expect(queryByText('Missing')).toBeFalsy();
        expect(queryByText('SignIn')).toBeFalsy();
    });

    it('should render the sign in form if not signed in on private page', () => {
        const routes = [
            {
                route: 'home',
                component: HomePage,
                path: [],
            },
        ];
        const App: FC = () => <RouteRegistry routes={routes} >
            <RoutePage
                notFound={NotFoundPage}
                signIn={SignIn}
                isSignedIn={false} />
        </RouteRegistry>;
        const { getByText, queryByText } = render(<App />);
        expect(queryByText('Home')).toBeFalsy();
        expect(queryByText('Missing')).toBeFalsy();
        expect(getByText('SignIn')).toBeTruthy();
    });

    it('should render the missing page if route not found', () => {
        const routes = [
            {
                route: 'home',
                component: HomePage,
                path: ['home'],
                isPublic: true,
            },
        ];
        const App: FC = () => <RouteRegistry routes={routes} >
            <RoutePage
                notFound={NotFoundPage}
                signIn={SignIn}
                isSignedIn={false} />
        </RouteRegistry>;
        const { getByText, queryByText } = render(<App />);
        expect(queryByText('Home')).toBeFalsy();
        expect(getByText('Missing')).toBeTruthy();
        expect(queryByText('SignIn')).toBeFalsy();
    });
});

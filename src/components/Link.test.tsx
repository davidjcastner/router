import type { FunctionComponent } from 'react';
import { render } from '@testing-library/react';
import React, { Fragment } from 'react';

// import indirectly from index to ensure that
// the component is exported correctly
import {
    Link,
    RouteRegistry,
} from '../index';


describe('Link', () => {
    it('should add an "a" tag with the correct relative href', () => {
        const routes = [
            {
                route: 'home',
                component: Fragment,
                path: ['a', 'b', 'c'],
                isPublic: true,
                tokenCount: 2,
            },
        ];
        const App: FunctionComponent = () => <RouteRegistry routes={routes} >
            <Link
                route='home'
                tokens={['1', '2']}
                query={{ abc: 'def' }}
                hash={'anchor'}>
                child_comps
            </Link>
        </RouteRegistry>;
        const { container } = render(<App />);
        const element = container.querySelector('a');
        expect(element?.getAttribute('href')).toBe('/a/b/c/1/2?abc=def#anchor');
    });

    it('should render children', () => {
        const routes = [
            {
                route: 'home',
                component: Fragment,
                path: ['a', 'b', 'c'],
                isPublic: true,
                tokenCount: 2,
            },
        ];
        const App: FunctionComponent = () => <RouteRegistry routes={routes} >
            <Link
                route='home'
                tokens={['1', '2']}
                query={{ abc: 'def' }}
                hash={'anchor'}>
                child_comps
            </Link>
        </RouteRegistry>;
        const { getByText } = render(<App />);
        expect(getByText('child_comps')).toBeTruthy();
    });

    it('should render have optional parameters', () => {
        const routes = [
            {
                route: 'home',
                component: Fragment,
                path: ['a', 'b', 'c'],
                isPublic: true,
                tokenCount: 2,
            },
        ];
        const App: FunctionComponent = () => <RouteRegistry routes={routes} >
            <Link
                route='home'>
                child_comps
            </Link>
        </RouteRegistry>;
        const { container } = render(<App />);
        const element = container.querySelector('a');
        expect(element?.getAttribute('href')).toBe('/a/b/c');
    });
});

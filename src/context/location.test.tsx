// useLocation indirectly tested through RoutePage and Link
// hard to test routing, can come back to add test if bugs are found

// see ../components/Link.test.tsx
// and ../components/RoutePage.test.tsx

import type { FC } from 'react';
import { render } from '@testing-library/react';
import React, { Fragment } from 'react';

// import indirectly from index to ensure that
// the component is exported correctly
import {
    useLocation,
    RouteRegistry,
} from '../index';


describe('useLocation', () => {
    it('should provide context within a RouteRegistry component', () => {
        const routes = [
            {
                route: 'home',
                component: Fragment,
                path: [],
                isPublic: true,
            },
        ];
        const Ctx: FC = () => {
            const { route } = useLocation();
            return <div>
                {route}
            </div>;
        };
        const App: FC = () => <RouteRegistry routes={routes} >
            <Ctx />
        </RouteRegistry>;
        const { getByText } = render(<App />);
        expect(getByText('home')).toBeTruthy();
    });
});

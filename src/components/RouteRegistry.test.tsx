// RouteRegistry indirectly tested through RoutePage and Link
// hard to test routing, can come back to add test if bugs are found

// see ./Link.test.tsx
// and ./RoutePage.test.tsx

import { render } from '@testing-library/react';
import React from 'react';

// import indirectly from index to ensure that
// the component is exported correctly
import { RouteRegistry } from '../index';


describe('RouteRegistry', () => {
    it('should render with children', () => {
        const { getByText } = render(<RouteRegistry routes={[]}>
            <div>hello</div>
        </RouteRegistry>);
        expect(getByText('hello')).toBeTruthy();
    });
});

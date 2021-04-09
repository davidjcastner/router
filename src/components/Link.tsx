import type { FunctionComponent } from 'react';
import React from 'react';
import { useLocation } from '../context/location';


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
    const { pathForRoute } = useLocation();
    const href = pathForRoute({
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

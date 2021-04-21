import type { FC } from 'react';
import React, { Fragment } from 'react';
import { useLocation } from '../context/location';


/** renders the page component associated with the current route */
export const RoutePage: FC<{
    notFound?: FC;
    signIn?: FC;
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

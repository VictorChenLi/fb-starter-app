import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from '../hooks/useAuth';
import React from 'react';

const AuthGuard = (props) => {
  const { children } = props;
  const { identity } = useAuth();
  const location = useLocation();
  const [requestedLocation, setRequestedLocation] = useState(null);

  if (!!!identity) {
    if (location.pathname !== requestedLocation) {
      setRequestedLocation(location.pathname);
    }

    return <Navigate to="/login" />;
  }

  // This is done so that in case the route changes by any chance through other
  // means between the moment of request and the render we navigate to the initially
  // requested route.
  if (requestedLocation && location.pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
};

AuthGuard.propTypes = {
  children: PropTypes.node,
};

export default AuthGuard;

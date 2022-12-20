import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import useAuth from '../hooks/useAuth';

const GuestGuard = ({ children }) => {
  const { identity } = useAuth();

  if (identity) {
    return <Navigate to="/dashboard/app" />;
  }

  return <>{children}</>;
};

GuestGuard.propTypes = {
  children: PropTypes.node,
};

export default GuestGuard;

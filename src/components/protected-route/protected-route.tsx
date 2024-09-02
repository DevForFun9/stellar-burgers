import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import {
  selectIsAuthChecked,
  selectIsAuthorized
} from '../../services/slices/auth';
import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';

type TProps = {
  onlyUnAuth?: boolean;
};

export const ProtectedRoute: React.FC<TProps> = ({ onlyUnAuth }) => {
  const isAuthorized = useSelector(selectIsAuthorized);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !isAuthorized) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && isAuthorized) {
    const from = location.state?.from || { pathname: '/' };

    return <Navigate replace to={from} />;
  }

  return <Outlet />;
};

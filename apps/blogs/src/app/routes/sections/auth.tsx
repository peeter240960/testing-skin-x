import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { GuestGuard } from '../../auth/guard';
import AuthClassicLayout from '../../layouts/auth/classic';
import { SplashScreen } from '../../components/loading-screen';

// ----------------------------------------------------------------------

// JWT
const JwtLoginPage = lazy(
  () => import('../../modules/auth/jwt/jwt-login-view')
);

// ----------------------------------------------------------------------

export const authRoutes = [
  {
    path: 'auth',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [{
      path: 'login',
      element: (
        <GuestGuard>
          <AuthClassicLayout>
            <JwtLoginPage />
          </AuthClassicLayout>
        </GuestGuard>
      ),
    },],
  },
];

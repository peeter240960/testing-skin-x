import { Navigate, useRoutes } from 'react-router-dom';

import { authRoutes } from './auth';
import { mainRoutes } from './main';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    // SET INDEX PAGE WITH SKIP HOME PAGE
    // {
    //   path: '/',
    //   element: <Navigate to={paths.post.root} replace />,
    // },

    // Auth routes
    ...authRoutes,
    // Main routes
    ...mainRoutes,
    // No match 404
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

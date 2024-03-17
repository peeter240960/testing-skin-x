import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import MainLayout from '../../layouts/main';
import { SplashScreen } from '../../components/loading-screen';
import { AuthGuard } from '../../auth/guard';
// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('../../modules/home/home-view'));
export const PostPage = lazy(() => import('../../modules/post/post-view'));
const PostDetailsPage = lazy(
  () => import('../../modules/post/post-detail-view')
);
// ----------------------------------------------------------------------

export const mainRoutes = [
  {
    element: (
      <AuthGuard>
        <MainLayout>
          <Suspense fallback={<SplashScreen />}>
            <Outlet />
          </Suspense>
        </MainLayout>
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'post',
        children: [
          { element: <PostPage />, index: true },
          { path: 'list', element: <PostPage /> },
          { path: ':id', element: <PostDetailsPage /> },
        ],
      },
    ],
  },
  {
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [
      { path: '500', element: <div>500</div> },
      { path: '404', element: <div>404</div> },
      { path: '403', element: <div>403</div> },
    ],
  },
];

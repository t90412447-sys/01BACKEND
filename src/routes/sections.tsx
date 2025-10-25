import type { RouteObject } from 'react-router';
import { lazy, Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { DashboardLayout } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------
// Lazy-loaded pages
export const DashboardPage = lazy(() => import('src/pages/dashboard'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const ProfilePage = lazy(() => import('src/pages/profile'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const CreateGoalPage = lazy(() => import('src/sections/creategoal/CreateGoalView'));
export const ConversationPage = lazy(() => import('src/pages/conversation'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const ActionGroupFeedPage = lazy(() => import('src/pages/action-group-feed'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const ConnectionsPage = lazy(() => import('src/sections/LiveActionSupport/connectionspage'));

// ----------------------------------------------------------------------
// Fallback Loader for Lazy Pages
const renderFallback = () => (
  <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    Loading...
  </div>
);

// ----------------------------------------------------------------------
// Routes Definition
export const routesSection: RouteObject[] = [
  // DASHBOARD + CHILD PAGES
  {
    element: (
      <DashboardLayout>
        <Suspense fallback={renderFallback()}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'user', element: <UserPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'blog', element: <BlogPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'connections', element: <ConnectionsPage /> },
    ],
  },

  // SIGN-IN
  {
    path: 'sign-in',
    element: (
      <Suspense fallback={renderFallback()}>
        <SignInPage />
      </Suspense>
    ),
  },

  // CREATE GOAL
  {
    path: 'creategoal',
    element: (
      <Suspense fallback={renderFallback()}>
        <CreateGoalPage />
      </Suspense>
    ),
  },

  // ACTION GROUP FEED
  {
    path: 'groups/:groupId',
    element: (
      <Suspense fallback={renderFallback()}>
        <ActionGroupFeedPage />
      </Suspense>
    ),
  },

  // CONVERSATION PAGE
  {
    path: 'conversation/:userId',
    element: (
      <Suspense fallback={renderFallback()}>
        <ConversationPage />
      </Suspense>
    ),
  },

  // 404 PAGE
  {
    path: '404',
    element: (
      <Suspense fallback={renderFallback()}>
        <Page404 />
      </Suspense>
    ),
  },

  // DEFAULT REDIRECT -> now goes to dashboard instead of sign-in
  { path: '*', element: <Navigate to="/dashboard" replace /> },
];

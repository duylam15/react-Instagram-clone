import { createBrowserRouter } from 'react-router-dom';
import LayoutDefault from '../layouts/LayoutDefault';
import LayoutDefaultAdmin from '../layout/DefaultLayoutAdmin';

import React from 'react';
import Home from '../pages/home';
import Error from '../pages/error';
import MyProfile from '../pages/my_profile';
import Messages from '../pages/messages';
import Explore from '../pages/explore';
import Login from '../pages/login';
import Register from '../pages/register';
import ForgotPassword from '../pages/forgotpassword';
import EditProfile from '../pages/my_profile/EditProfile';

const Dashboard = React.lazy(() => import('../views/dashboard/Dashboard'))
const User = React.lazy(() => import('../views/user/User'))
const Post = React.lazy(() => import('../views/post/Post'))
const Comment = React.lazy(() => import('../views/comment/Comment'))
const Conversation = React.lazy(() => import('../views/conversation/Conversation'))
const Message = React.lazy(() => import('../views/message/Message'))
const Friend = React.lazy(() => import('../views/friend/Friend'))

// Định nghĩa kiểu cho route
interface Route {
  path: string
  exact?: boolean
  name?: string
  element?: React.ReactNode // Đảm bảo element có thể là một React component hoặc Lazy-loaded component
}

export const routes: Route[] = [
  { path: '/', exact: true, name: 'Dashboard', element: <Dashboard /> },
  { path: '/dashboard', name: 'Dashboard', element: <Dashboard /> },
  { path: '/user', name: 'User', element: <User /> },
  { path: '/post', name: 'Post', element: <Post /> }, // Now using the lazy-loaded Post
  { path: '/comment', name: 'Comment', element: <Comment /> },
  { path: '/conversation', name: 'Conversation', element: <Conversation /> },
  { path: '/message', name: 'Message', element: <Message /> },
  { path: '/friend', name: 'Friend', element: <Friend /> },
]

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutDefault />,// Hiển thị Layout cho các route này
    errorElement: <Error />, // Hiển thị NotFound khi có lỗi
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/profile',
        element: <MyProfile />,
      },
      {
        path: '/profile/:id',
        element: <MyProfile />,
      },
      {
        path: '/messages',
        element: <Messages />,
      },
      {
        path: '/edit-profile',
        element: <EditProfile />,
      },
      {
        path: '/explore',
        element: <Explore />,
      },
    ],
  },

  {
    path: '/login',
    element: <Login />
  },

  {
    path: '/register',
    element: <Register />
  },

  {
    path: '/forgotpassword',
    element: <ForgotPassword />
  },
  {
    path: '/admin',
    element: <LayoutDefaultAdmin />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Dashboard /> }, // Khi truy cập /admin, hiển thị Dashboard
      { path: 'dashboard', element: <Dashboard /> }, // Khi truy cập /admin/dashboard, cũng hiển thị Dashboard
      { path: 'user', element: <User /> },
      { path: 'post', element: <Post /> },
      { path: 'comment', element: <Comment /> },
      { path: 'conversation', element: <Conversation /> },
      { path: 'message', element: <Message /> },
      { path: 'friend', element: <Friend /> },
    ],
  },
])

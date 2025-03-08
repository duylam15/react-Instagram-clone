import { createBrowserRouter } from 'react-router-dom';
import LayoutDefault from '../layouts/LayoutDefault';

import React from 'react';
import Home from '../pages/home';
import Error from '../pages/error';
import MyProfile from '../pages/my_profile';
import Messages from '../pages/messages';
import Explore from '../pages/explore';
import Login from '../pages/login';
import Register from '../pages/register';
import ForgotPassword from '../pages/forgotpassword';

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
        path: '/messages',
        element: <Messages />,
      },
      {
        path: '/explore',
        element: <Explore />,
      },
    ],
  },

  {
    path: '/login',
    element:<Login/>
  },

  {
    path: '/register',
    element:<Register/>
  },

  {
    path: '/forgotpassword',
    element:<ForgotPassword/>
  },
]);

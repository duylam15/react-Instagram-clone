import React from 'react';
import CIcon from '@coreui/icons-react';
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons';
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react';

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: 'dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: 'User',
    to: 'user',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />, // Thay cilSpeedometer bằng cilStar
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: 'Post',
    to: 'post',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />, // Biểu tượng ghi chú cho bài đăng
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: 'Comment',
    to: 'comment',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />, // Biểu tượng mô tả cho bình luận
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: 'Conversation',
    to: 'conversation',
    icon: <CIcon icon={cilExternalLink} customClassName="nav-icon" />, // Biểu tượng liên kết cho hội thoại
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: 'Message',
    to: 'message',
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />, // Biểu tượng chuông cho tin nhắn
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: 'Friend',
    to: 'friend',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />, // Biểu tượng câu đố cho bạn bè (kết nối)
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
];

export default _nav;
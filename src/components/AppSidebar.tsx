import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logo } from '../assets/brand/logo'
import { sygnet } from '../assets/brand/sygnet'

// sidebar nav config
import navigation from '../_nav'

interface RootState {
  sidebarShow: boolean
  sidebarUnfoldable: boolean
}

const AppSidebar: React.FC = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state: RootState) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state: RootState) => state.sidebarShow)

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible: boolean) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
      
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand>
          <NavLink to="/">
            <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} />
            <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} />
          </NavLink>
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)

import React, { useCallback, useEffect, useState } from 'react';
import SideBar from '../../components/SideBar';
import { Outlet, useNavigate } from 'react-router-dom';
import "./LayoutDefault.scss"
import { useLocation } from 'react-router-dom';

export default function LayoutDefault() {
	const location = useLocation();
	return (
		<div className='layout-app'>
			<div className='sidebar'>
				<SideBar key={location.key} />
			</div>
			<div className='main-content'>
				<Outlet />
			</div>
		</div>
	);
}

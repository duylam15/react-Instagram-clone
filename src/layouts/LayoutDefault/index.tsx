import React, { useCallback, useEffect, useState } from 'react';
import SideBar from '../../components/SideBar';
import { Outlet, useNavigate } from 'react-router-dom';
import "./LayoutDefault.scss"

export default function LayoutDefault() {
	return (
		<div className='layout-app'>
			<div className='sidebar'>
				<SideBar />
			</div>
			<div className='main-content'>
				<Outlet />
			</div>
		</div>
	);
}

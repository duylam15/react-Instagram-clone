import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useColorModes } from '@coreui/react';
import { AppContent, AppSidebar, AppHeader } from '../components';

interface RootState {
  sidebarShow: boolean;
  sidebarUnfoldable: boolean;
  theme: string;
}

const DefaultLayoutAdmin = () => {
  const adminContainerRef = useRef<HTMLDivElement>(null);
  const unfoldable = useSelector((state: RootState) => state.sidebarUnfoldable);
  const storedTheme = useSelector((state: RootState) => state.theme);

  const { isColorModeSet, setColorMode, colorMode } = useColorModes(
    'coreui-free-react-admin-template-theme'
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1]);
    const theme =
      urlParams.get('theme') && urlParams.get('theme')?.match(/^[A-Za-z0-9\s]+/);
    if (theme) {
      setColorMode(theme[0]);
    }

    if (!isColorModeSet()) {
      setColorMode(storedTheme);
    }
  }, [isColorModeSet, setColorMode, storedTheme]);

  useEffect(() => {
    document.documentElement.removeAttribute('data-coreui-theme');
    if (adminContainerRef.current) {
      // Cung cấp giá trị mặc định nếu colorMode là undefined
      adminContainerRef.current.setAttribute('data-coreui-theme', colorMode || 'light');
    }
  }, [colorMode]);

  return (
    <div ref={adminContainerRef} className="admin-container">
      <AppSidebar />
      <div
        className={`wrapper d-flex flex-column min-vh-100 ${
          unfoldable ? 'sidebar-unfoldable' : ''
        }`}
      >
        {/* Cung cấp giá trị mặc định cho colorMode */}
        <AppHeader colorMode={colorMode || 'light'} setColorMode={setColorMode} />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
      </div>
    </div>
  );
};

export default DefaultLayoutAdmin;
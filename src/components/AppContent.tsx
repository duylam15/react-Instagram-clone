import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// Import routes config
import { routes } from '../routes/index'

const AppContent: React.FC = () => {
  return (
    <CContainer className="px-4" lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            // Kiểm tra xem route có element hay không
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  
                  // Không cần thêm ''name' `exact` trong React Router v6
                  element={route.element}
                />
              )
            )
          })}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)

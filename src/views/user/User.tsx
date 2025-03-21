import React from 'react'
import { CCard, CCardHeader, CCardBody, CCol, CRow } from '@coreui/react'

const User = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>React Action</strong>
          </CCardHeader>
          <CCardBody>Đây là nội dung bên trong thẻ Card.</CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default User

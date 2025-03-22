import React from "react";
import { CAlert } from "@coreui/react";

interface AlertMessageProps {
  message: string;
  severity: "success" | "warning" | "info" | "danger";
}

const AlertMessage: React.FC<AlertMessageProps> = ({ message, severity }) => {
  if (!message) return null; // Không hiển thị nếu message rỗng

  return (
    <CAlert color={severity} className="position-fixed top-0 end-0 m-3" style={{ zIndex: 9999, minWidth: "250px" }}>
      {message}
    </CAlert>
  );
};

export default AlertMessage;

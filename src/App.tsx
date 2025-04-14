import React, { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CSpinner } from "@coreui/react";
import { RefreshProvider } from "./contexts/RefreshContext";
import { NotificationSocketProvider } from "./contexts/NotificationSocketContext";

import { router } from "./routes";
import '@coreui/coreui/dist/css/coreui.min.css';
import "./assets/css/styles.css";
import "./scss/style.scss";
import "./scss/examples.scss";

const App: React.FC = () => {
  return (
    <NotificationSocketProvider
      userId={66}
      onReceive={(notify) => console.log("🔔 " + notify.content)}
    >
      <RefreshProvider>
        <ThemeProvider>
          <Suspense     
            fallback={
              <div className="pt-3 text-center">
                <CSpinner color="primary" variant="grow" />
              </div>
            }
          >
            <RouterProvider router={router} />
          </Suspense>
        </ThemeProvider>
      </RefreshProvider>
    </NotificationSocketProvider>
  );
};

export default App;

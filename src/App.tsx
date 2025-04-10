import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider, Route, Routes, HashRouter } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CSpinner } from "@coreui/react";
import '@coreui/coreui/dist/css/coreui.min.css';

import "./assets/css/styles.css";
import "./scss/style.scss";
import "./scss/examples.scss";

import { router } from "./routes";
import store from "./store";
import { RefreshProvider } from "./contexts/RefreshContext";
import { NotificationSocketProvider } from "./contexts/NotificationSocketContext";
// Lazy load layout của admin
const DefaultLayoutAdmin = React.lazy(() => import("./layout/DefaultLayoutAdmin"));
const App: React.FC = () => {

  return (
    <NotificationSocketProvider
      userId={66}
      onReceive={(notify) => console.log("🔔 " + notify.content)}
    >
      {/* App nội dung ở đây */}

      <RefreshProvider>
        <ThemeProvider>
          <RouterProvider router={router} />
          <HashRouter>
            <Suspense
              fallback={
                <div className="pt-3 text-center">
                  <CSpinner color="primary" variant="grow" />
                </div>
              }
            >
              <Routes>
                <Route path="admin/*" element={<DefaultLayoutAdmin />} />
              </Routes>
            </Suspense>
          </HashRouter>
        </ThemeProvider>
      </RefreshProvider>
    </NotificationSocketProvider>

  );
};

// Render App vào DOM
createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <App />
  </Provider>
);

export default App;
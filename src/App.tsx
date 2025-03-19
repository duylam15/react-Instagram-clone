import React, { Suspense, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Provider, useSelector } from "react-redux";
import { RouterProvider, Route, Routes, HashRouter } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CSpinner, useColorModes } from "@coreui/react";

import "./assets/css/styles.css";
import "./scss/style.scss";
import "./scss/examples.scss";

import { router } from "./routes";
import store from "./store";

// Lazy load layout của admin
const DefaultLayout = React.lazy(() => import("./layout/DefaultLayoutAdmin"));

const App: React.FC = () => {
  const { isColorModeSet, setColorMode } = useColorModes(
    "coreui-free-react-admin-template-theme"
  );
  const storedTheme = useSelector((state: any) => state.theme);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split("?")[1]);
    const theme =
      urlParams.get("theme") &&
      urlParams.get("theme")?.match(/^[A-Za-z0-9\s]+/);
    if (theme) {
      setColorMode(theme[0]);
    }

    if (!isColorModeSet()) {
      setColorMode(storedTheme);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
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
            <Route path="admin/*" element={<DefaultLayout />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </ThemeProvider>
  );
};

// Render App vào DOM
createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <App />
  </Provider>
);

export default App;
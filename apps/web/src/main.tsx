import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { router } from "./routes/index.js";
import { queryClient } from "./lib/queryClient.js";
import { ThemeProvider } from "./lib/theme.js";
import AuthBridge from "./components/AuthBridge.js";
import ErrorBoundary from "./components/ErrorBoundary.js";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthBridge />
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
);

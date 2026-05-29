import { createBrowserRouter, type RouteObject } from "react-router-dom";
import Layout from "../components/Layout.js";
import ProtectedRoute from "../components/ProtectedRoute.js";
import LandingPage from "../pages/LandingPage.js";
import AuthPage from "../pages/AuthPage.js";
import DashboardPage from "../pages/DashboardPage.js";
import NewEntryPage from "../pages/NewEntryPage.js";
import EntryDetailPage from "../pages/EntryDetailPage.js";
import WellbeingPage from "../pages/WellbeingPage.js";
import WellbeingDetailPage from "../pages/WellbeingDetailPage.js";
import HistoryPage from "../pages/HistoryPage.js";
import InsightsPage from "../pages/InsightsPage.js";
import NotFoundPage from "../pages/NotFoundPage.js";

const routes: RouteObject[] = [
  { path: "/", element: <LandingPage /> },
  { path: "/auth", element: <AuthPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/journal/new", element: <NewEntryPage /> },
          { path: "/journal/:id", element: <EntryDetailPage /> },
          { path: "/journal/wellbeing", element: <WellbeingPage /> },
          { path: "/journal/wellbeing/:date", element: <WellbeingDetailPage /> },
          { path: "/history", element: <HistoryPage /> },
          { path: "/insights", element: <InsightsPage /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
];

export const router: ReturnType<typeof createBrowserRouter> =
  createBrowserRouter(routes);

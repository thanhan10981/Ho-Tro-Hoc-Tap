import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import DashboardPage from "../pages/Home/DashboardPage";
import SchedulePage from "../pages/Schedule/SchedulePage";
import { KnowledgeStoragePage } from "../pages/KnowledgeStorage/KnowledgeStoragePage";
import SummaryPage from "../pages/SummaryPage";
import AiChatPage from "../pages/AiChat/AiChatPage";
import QuizFlashcard from "../pages/QuizFlashcard/QuizFlashcard";

import Login from "../../features/auth/pages/Login";
import Register from "../../features/auth/pages/Register";
import PrivateRoute from "./PrivateRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* PRIVATE */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/schedule"
        element={
          <PrivateRoute>
            <MainLayout>
              <SchedulePage />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/knowledgestorage"
        element={
          <PrivateRoute>
            <MainLayout>
              <KnowledgeStoragePage />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/summary"
        element={
          <PrivateRoute>
            <MainLayout>
              <SummaryPage />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/ai-chat"
        element={
          <PrivateRoute>
            <MainLayout>
              <AiChatPage />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/quiz"
        element={
          <PrivateRoute>
            <MainLayout>
              <QuizFlashcard />
            </MainLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

/* PAGES */
import DashboardPage from "../pages/Home/DashboardPage";
import SchedulePage from "../pages/Schedule/SchedulePage";
import KnowledgeStoragePage from "../pages/KnowledgeStorage/KnowledgeStoragePage";
import PersonalDocPage from "../pages/KnowledgeStorage/PersonalDocPage";
import SummaryPage from "../pages/SummaryPage/SummaryPage";
import AiChatPage from "../pages/AiChat/AiChatPage";
import QuizFlashcard from "../pages/QuizFlashcard/QuizFlashcard";

/* AUTH */
import Login from "../../features/auth/pages/Login";
import Register from "../../features/auth/pages/Register";
import PrivateRoute from "./PrivateRoute";
import QuizPlay from "../../features/QuizFlashcard/component/QuizPlay";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ===== PUBLIC ROUTES ===== */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ===== PRIVATE ROUTES ===== */}
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
      <Route path="/quiz/:maQuiz" element={<QuizPlay />} />

      <Route
        path="/personalStore/:id"
        element={
          <PrivateRoute>
            <MainLayout>
              <PersonalDocPage />
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

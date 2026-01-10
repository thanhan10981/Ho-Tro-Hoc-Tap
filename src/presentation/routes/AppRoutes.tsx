// AppRoutes.tsx
import MainLayout from "../layouts/MainLayout";

import SchedulePage from "../pages/Schedule/SchedulePage";

import { Routes, Route } from "react-router-dom";
import DashboardPage from "../pages/Home/DashboardPage";
import SummaryPage from "../pages/SummaryPage";
import AiChatPage from "../pages/AiChat/AiChatPage";
import QuizFlashcard from "../pages/QuizFlashcard/QuizFlashcard";
import KnowledgeStoragePage from "../pages/KnowledgeStorage/KnowledgeStoragePage";
import PersonalDocPage from "../pages/KnowledgeStorage/PersonalDocPage";

export default function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/knowledgestorage" element={<KnowledgeStoragePage />} />
        <Route path="/summary" element={<SummaryPage />} />
        <Route path="/ai-chat" element={<AiChatPage />} />
        <Route path="/quiz" element={<QuizFlashcard />} />
        <Route path="/personalStore/:id" element={<PersonalDocPage />} />
      </Routes>
    </MainLayout>
  );
}

// AppRoutes.tsx
import MainLayout from "../layouts/MainLayout";

import SchedulePage from "../pages/Schedule/SchedulePage";
import { KnowledgeStoragePage } from "../pages/KnowledgeStorage/KnowledgeStoragePage";
import { Routes, Route } from "react-router-dom";
import DashboardPage from "../pages/Home/DashboardPage";
import SummaryPage from "../pages/SummaryPage";

export default function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/knowledgestorage" element={<KnowledgeStoragePage />} />
        <Route path="/summary" element={<SummaryPage />} />
      </Routes>
    </MainLayout>
  );
}

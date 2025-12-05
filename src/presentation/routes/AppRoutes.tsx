// AppRoutes.tsx
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/Home/HomePage";
import SchedulePage from "../pages/Schedule/SchedulePage";
import { KnowledgeStoragePage } from "../pages/KnowledgeStorage/KnowledgeStoragePage";
import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/knowledgestorage" element={<KnowledgeStoragePage />} />
      </Routes>
    </MainLayout>
  );
}

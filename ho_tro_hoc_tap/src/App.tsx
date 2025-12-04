import MainLayout from "./presentation/layouts/MainLayout";
import DashboardPage from "./presentation/pages/DashboardPage";
import "./index.css";


export default function App() {
  return (
    <MainLayout>
      <DashboardPage />
    </MainLayout>
  );
}

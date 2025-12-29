import Header from "../../shared/components/Header";
import FloatingButtons from "../components/FloatingButtons";
// import Navbar from "../components/Navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* <Navbar /> */}
      <Header />
      <div className="pt-24 px-10">{children}</div>
      <FloatingButtons />
    </div>
  );
}

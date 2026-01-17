import Header from "../../shared/components/Header";
import FloatingButtons from "../components/FloatingButtons";

interface MainLayoutProps {
  children: React.ReactNode;
  hideFloatingButtons?: boolean;
}

export default function MainLayout({
  children,
  hideFloatingButtons = false
}: MainLayoutProps) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="pt-24 px-10">{children}</div>

      {!hideFloatingButtons && <FloatingButtons />}
    </div>
  );
}

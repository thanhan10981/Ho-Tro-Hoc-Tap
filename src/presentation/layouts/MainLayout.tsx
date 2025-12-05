import Header from "../../shared/components/Header";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />

      {/* Đảm bảo nội dung không bị che bởi Header fixed */}
      <div style={{ marginTop: "80px", padding: "20px" }}>
        {children}
      </div>
    </>
  );
}

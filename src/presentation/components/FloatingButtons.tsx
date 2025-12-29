import "../../styles/floatingButtons.css";

export default function FloatingButtons() {
  const buttons = [
    { color: "blue", label: "Upload tài liệu", icon: "/icons/upload.svg" },
    { color: "green", label: "Tạo Quiz", icon: "/icons/help.svg" },
    { color: "purple", label: "Học Flashcard", icon: "/icons/layers.svg" },
    { color: "orange", label: "Xem lịch thi", icon: "/icons/calendar.svg" },
    { color: "gradient", label: "AI Assistant", icon: "/logo_ai.svg" },
  ];

  return (
    <div className="floating-buttons">
      {buttons.map((btn, i) => (
        <div key={i} className="fab-wrapper">
          <div className="tooltip">{btn.label}</div>
          <button className={`fab ${btn.color}`}>
            <img src={btn.icon} alt={btn.label} />
          </button>
        </div>
      ))}
    </div>
  );
}
import { useState } from "react";
import type { SummaryItem } from "../../shared/types/Summary.type";

export const useSummary = () => {

  const [selected, setSelected] = useState<number | null>(null);
  const [sortLabel, setSortLabel] = useState("Mới nhất");

  const sortOptions = ["Mới nhất", "Tên A–Z", "Môn học", "Trạng thái"];

  const handleSortChange = (value: string) => setSortLabel(value);

  // ===============================
  // 🌟 DỮ LIỆU MẪU – LẤY TỪ UI MẪU
  // ===============================
  const summaries: SummaryItem[] = [
    {
      id: 1,
      title: "Giải tích hàm nhiều biến",
      chapter: "Chương 3: Đạo hàm riêng",
      subject: "Toán cao cấp",
      timeAgo: "2 ngày trước",
      wordCount: 1247,
      pageCount: 8,
      fileName: "calculus_chapter3.pdf",

      description: `
Đạo hàm riêng là khái niệm cơ bản trong giải tích hàm nhiều biến, cho phép ta nghiên cứu sự thay đổi của hàm số theo từng biến độc lập.

Định nghĩa: Đạo hàm riêng của hàm f(x,y) theo biến x tại điểm (a,b) được định nghĩa là giới hạn của tỉ số gia khi chỉ biến x thay đổi.

Ký hiệu: ∂f/∂x, ∂f/∂y, hoặc fₓ.

Ứng dụng:
• Tìm cực trị của hàm nhiều biến
• Giải phương trình đạo hàm riêng
• Tính toán trong vật lý & kỹ thuật
`,

      keywords: ["đạo hàm riêng", "giải tích", "hàm nhiều biến", "cực trị"],
      icon: "file", 
      status: "done",
    },

    {
      id: 2,
      title: "Cơ học Newton",
      chapter: "Định luật chuyển động",
      subject: "Vật lý",
      timeAgo: "1 tuần trước",
      wordCount: 892,
      pageCount: 5,
      fileName: "newton_motion.pdf",

      description: `
Định luật chuyển động Newton mô tả mối quan hệ giữa lực tác dụng và gia tốc của vật.

Ba định luật cơ bản:
1. Vật không chịu lực sẽ đứng yên hoặc chuyển động thẳng đều.
2. F = m × a.
3. Lực tác dụng luôn có phản lực tương ứng.

Ứng dụng:
• Tính toán chuyển động
• Mô phỏng vật lý
• Cơ học cổ điển
`,

      keywords: ["vật lý", "định luật", "newton", "chuyển động"],
      icon: "grid", 
      status: "done",
    },

    {
      id: 3,
      title: "Machine Learning Basics",
      chapter: "Supervised Learning",
      subject: "Trí tuệ nhân tạo",
      timeAgo: "3 ngày trước",
      wordCount: 1856,
      pageCount: 12,
      fileName: "ml_supervised_learning.pdf",

      description: `
Machine Learning là lĩnh vực giúp máy tính học từ dữ liệu và đưa ra dự đoán.

Supervised Learning gồm:
• Classification
• Regression
• Training signals từ dữ liệu đã gán nhãn

Ứng dụng:
• AI
• Dự đoán dữ liệu
• Công nghệ thông minh
`,

      keywords: ["machine learning", "supervised learning", "AI"],
      icon: "image", 
      status: "done",
    },

    {
      id: 4,
      title: "Phản ứng hóa học",
      subject: "Hóa học",
      timeAgo: "Đang xử lý...",
      wordCount: 0,
      pageCount: 0,
      fileName: "chemical_reaction.pdf",

      description: `
Đang xử lý tài liệu...  
Hệ thống sẽ tự động cập nhật khi hoàn thành.
`,

      keywords: ["hóa học"],
      icon: "circle", 
      status: "processing",
    }
  ];

  return {
    summaries,
    selected,
    setSelected,
    sortLabel,
    sortOptions,
    handleSortChange,
  };
};

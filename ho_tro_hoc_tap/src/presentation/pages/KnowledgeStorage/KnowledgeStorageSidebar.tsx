import { useState } from "react";

const KnowledgeStorageSidebar = () => {
  const [open, setOpen] = useState(true);

  return (
    <>
      {open ? (
        <div
          className="
            fixed top-50 right-4 
            w-72 bg-white shadow-xl rounded-2xl p-5 
            flex flex-col gap-4 z-50
          "
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-[18px]">Thống kê kho kiến thức</h2>

            {/* Nút X (SVG thuần) */}
            <button onClick={() => setOpen(false)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-600 hover:text-gray-800"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-col gap-3 mt-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tổng tài liệu</span>
              <span className="font-bold text-blue-600">247</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Downloads tuần này</span>
              <span className="font-bold text-green-600">1.2k</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tài liệu mới</span>
              <span className="font-bold text-red-500">15</span>
            </div>
          </div>

          {/* Top tài liệu */}
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Top tài liệu</h3>

            <div className="space-y-2">
              {[
                { name: "Giải tích nâng cao", downloads: "2.1k" },
                { name: "Machine Learning", downloads: "1.8k" },
                { name: "Cơ học Newton", downloads: "1.5k" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl hover:bg-gray-100 cursor-pointer"
                >
                  {/* File Icon SVG */}
                  <div className="w-8 h-8 bg-red-100 flex items-center justify-center rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-4 h-4 text-red-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
                      />
                    </svg>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-xs text-gray-500">
                      {item.downloads} downloads
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Đề xuất */}
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Đề xuất cho bạn</h3>

            <div className="space-y-2">
              {[
                { name: "Lập trình Python cơ bản", desc: "Dựa trên lịch sử xem" },
                { name: "Đại số tuyến tính", desc: "Liên quan đến Giải tích" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-xl p-3 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="text-sm font-medium">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Nút mở lại sidebar (emoji icon)
        <button
          className="
            fixed right-4 top-24 
            w-12 h-12 bg-white shadow-lg rounded-full 
            flex items-center justify-center 
            hover:scale-105 transition z-50 text-2xl
          "
          onClick={() => setOpen(true)}
        >
          📚
        </button>
      )}
    </>
  );
};

export default KnowledgeStorageSidebar;

import React, { useState } from "react";
import PreviewModal from "./PreviewModal";

type DocumentItem = {
  id: number;
  title: string;
  description: string;
  subjectTag: string;
  typeTag: string;
  rating: number;
  views: number;
  downloads: number;
  size: string;
  time: string;
  thumbnail: string;
  format: string;
};

const mockData: DocumentItem[] = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
  title: `Tài liệu số ${i + 1} - Chủ đề nâng cao`,
  description: "Mô tả tài liệu mẫu dùng để hiển thị phân trang...",
  subjectTag: i % 2 === 0 ? "Toán học" : "Vật lý",
  typeTag: i % 3 === 0 ? "Bài giảng" : "Ghi chú",
  rating: 4.5,
  views: 1000 + i * 3,
  downloads: 200 + i * 2,
  size: `${(2 + i * 0.1).toFixed(1)} MB`,
  time: `${i + 1} ngày trước`,
  thumbnail: "/sample/book1.jpg",
  format: "PDF",
}));

export default function KnowledgeStorageBody() {
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(mockData.length / ITEMS_PER_PAGE);

  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DocumentItem | null>(null);

  const paginatedData = mockData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const createPageNumbers = () => {
    if (totalPages <= 6) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, 4, "...", totalPages];
    if (page >= totalPages - 2)
      return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  return (
    <div>
      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-[980px] ml-16 mt-3">
        {paginatedData.map((item) => (
          <div
            key={item.id}
            className="
              group bg-white rounded-2xl shadow-sm border border-gray-100
              transition-all duration-300 p-3 cursor-pointer
              hover:shadow-xl hover:-translate-y-[3px] hover:scale-[1.02]
            "
          >
            <div className="relative">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="rounded-xl h-[180px] w-full object-cover"
              />

              <div
                className="
                  absolute top-3 right-3 bg-gray-900/60 text-white 
                  text-[12px] px-2 py-1 rounded-md backdrop-blur
                "
              >
                {item.format}
              </div>

              {/* Buttons xuất hiện khi hover */}
              <div
                className="
                  absolute bottom-3 right-3 flex gap-2
                  opacity-0 pointer-events-none
                  group-hover:opacity-100 group-hover:pointer-events-auto
                  transition
                "
              >
                <button
                  onClick={() => {
                    setSelectedItem(item);
                    setOpen(true);
                  }}
                  className="
                    px-3 py-1 rounded-lg bg-blue-600 text-white text-sm 
                    font-medium shadow hover:bg-blue-700
                  "
                >
                  Xem trước
                </button>

                <button className="w-9 h-9 rounded-lg bg-green-600 flex items-center justify-center">
                  <img src="/download-svgrepo-com.svg" className="w-5 h-5 invert" />
                </button>

                <button className="w-9 h-9 rounded-lg bg-gray-700 flex items-center justify-center">
                  <img src="/share-svgrepo-com.svg" className="w-5 h-5 invert" />
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="mt-4 px-1">
              <div className="font-semibold text-[17px] line-clamp-2">{item.title}</div>
              <div className="text-gray-600 text-sm line-clamp-2 mt-1">
                {item.description}
              </div>

              <div className="flex gap-2 mt-3">
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-xl text-xs">
                  {item.subjectTag}
                </span>
                <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-xl text-xs">
                  {item.typeTag}
                </span>
              </div>

              <div className="flex items-center gap-3 mt-3 text-sm">
                <div className="flex items-center gap-1 text-yellow-500">
                  ⭐ <span className="text-gray-700 font-medium">{item.rating}</span>
                </div>

                <span className="text-gray-400">•</span>

                <div className="flex items-center gap-1 text-gray-500">👁 {item.views}</div>

                <span className="text-gray-400">•</span>

                <div className="flex items-center gap-1 text-gray-500">⬇ {item.downloads}</div>
              </div>

              <div className="flex justify-between text-xs text-gray-500 mt-3">
                <span>{item.size}</span>
                <span>{item.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6 w-[980px] ml-16 px-1">
        <span className="text-sm text-gray-600">
          Hiển thị {(page - 1) * ITEMS_PER_PAGE + 1}–
          {Math.min(page * ITEMS_PER_PAGE, mockData.length)} trong tổng số{" "}
          {mockData.length} tài liệu
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => page > 1 && setPage(page - 1)}
            className="w-9 h-9 rounded-lg border bg-white hover:bg-gray-100"
          >
            ←
          </button>

          {createPageNumbers().map((num, i) =>
            num === "..." ? (
              <span key={i} className="px-2 text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={i}
                onClick={() => setPage(num as number)}
                className={`w-9 h-9 rounded-lg border flex items-center justify-center 
                  ${page === num ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-100"}
                `}
              >
                {num}
              </button>
            )
          )}

          <button
            onClick={() => page < totalPages && setPage(page + 1)}
            className="w-9 h-9 rounded-lg border bg-white hover:bg-gray-100"
          >
            →
          </button>
        </div>
      </div>

      {/* SINGLE MODAL — CHỈ RENDER 1 LẦN */}
      {selectedItem && (
        <PreviewModal
          open={open}
          onClose={() => setOpen(false)}
          title={selectedItem.title}
          fileType={selectedItem.format}
          fileSize={selectedItem.size}
          description={selectedItem.description}
          contentPreview={`Tài liệu mẫu: ${selectedItem.title}\n\nĐây chỉ là nội dung preview minh hoạ.`}
        />
      )}
    </div>
  );
}

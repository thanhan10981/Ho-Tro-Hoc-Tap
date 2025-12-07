import React from "react";

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;

  title: string;
  fileType: string;
  fileSize: string;

  description: string;
  contentPreview: string;
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  open,
  onClose,
  title,
  fileType,
  fileSize,
  description,
  contentPreview,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-gray-500 text-sm mt-0.5">
              {fileType} • {fileSize}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm">
              Tải xuống
            </button>

            <button className="px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition text-sm">
              Chia sẻ
            </button>

            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="mt-6">
          <div className="bg-gray-50 border rounded-xl p-8 text-center">
            <div className="text-red-500 text-4xl">📄</div>
            <p className="font-semibold mt-3 text-lg">Xem trước tài liệu</p>
            <p className="text-gray-500 text-sm mt-1">
              Đây là phiên bản xem trước của tài liệu.  
              Tải xuống để xem đầy đủ nội dung.
            </p>
          </div>

          {/* Nội dung */}
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">Chương 5: Tích phân</h3>

            <p className="text-gray-700">{description}</p>

            <div className="bg-gray-50 border p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-gray-700 text-sm">
                {contentPreview}
              </pre>
            </div>

            <p className="text-gray-500 text-center mt-4">
              ... Nội dung tiếp theo trong phiên bản đầy đủ ...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;

import "../../../styles/ConfirmDeleteModal.css";

interface Props {
  open: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDeleteModal({
  open,
  title = "Xác nhận xóa",
  message = "Bạn có chắc chắn muốn xóa cuộc trò chuyện này? Hành động này không thể hoàn tác.",
  onConfirm,
  onCancel
}: Props) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">

        <div className="modal-header">
          <h3>{title}</h3>
        </div>

        <div className="modal-body">
          <p>{message}</p>
        </div>

        <div className="modal-footer">
          <button className="btn cancel" onClick={onCancel}>
            Hủy
          </button>
          <button className="btn danger" onClick={onConfirm}>
            Xóa
          </button>
        </div>

      </div>
    </div>
  );
}

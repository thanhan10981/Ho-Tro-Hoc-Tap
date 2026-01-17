// EditEventPopup.tsx
import React, { useState } from "react";
import Toast from "./Toast";

import type { LichHocCalendarDTO } from "../../../shared/types/lichHoc";
import UpdateEventForm from "./UpdateEventForm";
import "../../../styles/Schedule/EditEventPopup.css";

interface Props {
  event: LichHocCalendarDTO;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditEventPopup({ event, onClose, onSuccess }: Props) {
    const [toast, setToast] = useState<string | null>(null);

  return (
    <>
        {/* TOAST */}
        {toast && <Toast message={toast} />}

        <div className="edit-backdrop" onClick={onClose}>
        <div className="edit-card" onClick={(e) => e.stopPropagation()}>
            <div className="edit-header">
            <h3>Sửa sự kiện</h3>
            <button onClick={onClose}>✕</button>
            </div>

            <div className="edit-body">
            <UpdateEventForm
                event={event}
                onClose={onClose}
                onSuccess={onSuccess}
                onToast={setToast}  
            />
            </div>
        </div>
        </div>
    </>
    );

}

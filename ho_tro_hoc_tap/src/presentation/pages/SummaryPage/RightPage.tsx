import { useEffect, useState } from "react";

import { getRecentAuditLogs } from "../../../shared/services/summary.Service";
import type { AuditLogDTO } from "../../../shared/types/Summary.type";

export default function RightPage() {

  const [logs, setLogs] = useState<AuditLogDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecentAuditLogs()
      .then(data => setLogs(data))
      .catch(err => console.error("Lỗi load log:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="right-column">

      <div className="recent-box under-detail">
        <h3>Hoạt động gần đây</h3>

        {loading && <p>Đang tải...</p>}

        {!loading && logs.length === 0 && (
          <p className="empty">Chưa có hoạt động nào</p>
        )}

        {logs.map((log, index) => (
          <div className="recent-item" key={index}>
            <span className="check">✔</span>
            <div>
              <p>{log.moTa}</p>
              <small>{log.thoiGian}</small>
            </div>
          </div>
        ))}

      </div>

    </div>
  );
}

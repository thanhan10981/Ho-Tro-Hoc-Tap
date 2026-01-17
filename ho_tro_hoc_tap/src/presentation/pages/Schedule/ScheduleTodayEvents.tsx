import { useEffect, useState } from "react";
import { getTodayEvents } from "../../../shared/services/lichHocService";
import type { TodayEventDTO } from "../../../shared/types/lichHoc";
import "../../../styles/Schedule/ScheduleTodayEvents.css";

type Props = {
  refreshKey: number;
};
export default function ScheduleTodayEvents({ refreshKey }: Props) {
  
  const [data, setData] = useState<Record<string, TodayEventDTO[]>>({});
  const ICON_MAP: Record<string, string> = {
  hoc: "🕮",
  deadline: "⏱",
  thi: "🗁",
  on_tap: "𓂃🖊"
};
const COLOR_CLASS_MAP: Record<string, string> = {
  hoc: "blue",
  deadline: "red",
  thi: "orange",
  on_tap: "green",
};

  useEffect(() => {
    getTodayEvents().then(setData);
  }, [refreshKey]);
    return (
    <div className="today-section">
      <h3>Sự kiện hôm nay</h3>

      {Object.entries(data).map(([loai, events]) =>
        events.map((e) => (
          <div
            key={e.maSuKien}
            className={`today-event ${
              COLOR_CLASS_MAP[loai] ?? "gray"
            }`}
          >
            <div className="icon">
              {ICON_MAP[loai] ?? ICON_MAP.khac}
            </div>

            <div className="content">
              <div className="title">{e.tieuDe}</div>

              <div className="desc">
                {loai === "hoc" ? (
                  <>
                    {e.thoiGianHoc} • {e.diaDiem} • {e.tenMonHoc}
                  </>
                ) : (
                  <>
                    {e.thoiGian?.slice(11, 16)} • {e.tenMonHoc}
                  </>
                )}
              </div>
            </div>

            <div className="actions">
              <button className="edit">✎</button>
              <button className="delete">🗑</button>
            </div>
          </div>
        ))
      )}

    </div>
  );
}



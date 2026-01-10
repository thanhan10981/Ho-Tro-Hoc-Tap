import { useEffect, useRef, useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { fabric } from "fabric";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "../../../styles/PersonalDocPage.css";

type Tool = "draw" | "highlight" | "text" | "erase" | null;

type Note = {
  id: string;
  content: string;
  createdAt: number;
};

export default function PersonalDocPage() {
  const layoutPluginInstance = defaultLayoutPlugin();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pdfLayerRef = useRef<HTMLDivElement | null>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);

  const [tool, setTool] = useState<Tool>(null);

  /* ===== STATE GHI CHÚ ===== */
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  /* ===== INIT CANVAS ===== */
  useEffect(() => {
    if (!canvasRef.current || !pdfLayerRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      selection: false,
      preserveObjectStacking: true,
    });

    const resize = () => {
      const rect = pdfLayerRef.current!.getBoundingClientRect();
      canvas.setWidth(rect.width);
      canvas.setHeight(rect.height);
      canvas.renderAll();
    };

    resize();
    window.addEventListener("resize", resize);

    fabricRef.current = canvas;

    return () => {
      window.removeEventListener("resize", resize);
      canvas.dispose();
      fabricRef.current = null;
    };
  }, []);

  /* ===== TOOL HANDLER ===== */
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    canvas.isDrawingMode = false;
    canvas.off("mouse:down");
    canvas.off("mouse:up");

    /* ✏️ DRAW */
    if (tool === "draw") {
      const brush = new fabric.PencilBrush(canvas);
      brush.color = "#111";
      brush.width = 2;
      brush.decimate = 0.4;
      canvas.freeDrawingBrush = brush;
      canvas.isDrawingMode = true;
    }

    /* 🖍 HIGHLIGHT (2 line giả lập) */
    if (tool === "highlight") {
      let startX = 0;
      let startY = 0;

      canvas.on("mouse:down", (opt) => {
        const p = canvas.getPointer(opt.e);
        startX = p.x;
        startY = p.y;
      });

      canvas.on("mouse:up", (opt) => {
        const p = canvas.getPointer(opt.e);
        const offset = 6;

        const makeLine = (dy: number) =>
          new fabric.Line([startX, startY + dy, p.x, p.y + dy], {
            stroke: "rgba(255,230,0,0.45)",
            strokeWidth: 6,
            selectable: true,
            globalCompositeOperation: "multiply",
          });

        canvas.add(makeLine(-offset), makeLine(offset));
        canvas.renderAll();
      });
    }

    /* 🧽 ERASE */
    if (tool === "erase") {
      canvas.on("mouse:down", (opt) => {
        if (opt.target) {
          canvas.remove(opt.target);
          canvas.renderAll();
        }
      });
    }
  }, [tool]);

  /* ===== TẠO NOTE MỚI ===== */
  const createNote = () => {
    const id = crypto.randomUUID();
    setNotes((prev) => [
      { id, content: "", createdAt: Date.now() },
      ...prev,
    ]);
    setActiveNoteId(id);
  };

  return (
    <div className="personal-page">
      {/* ===== SIDEBAR TRÁI ===== */}
      <aside className="personal-sidebar">
        <h3>Tài liệu đã lưu</h3>
        <div className="personal-doc-item active">
          Tomato TOEIC – Part 5 & 6
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <main className="personal-content">
        <div className="personal-header">
          <h2>Tomato TOEIC – Part 5 & 6</h2>
          <span>Cập nhật: 29/12/2025</span>
        </div>

        <div className="draw-toolbar">
          <button onClick={() => setTool("draw")}>✏️ Draw</button>
          <button onClick={() => setTool("highlight")}>🖍 Highlight</button>
          <button onClick={createNote}>📝 Note</button>
          <button onClick={() => setTool("erase")}>🧽 Erase</button>
        </div>

        <div className="pdf-wrapper">
          <div className="pdf-layer" ref={pdfLayerRef}>
            <Worker workerUrl="/pdf.worker.min.js">
              <Viewer
                fileUrl="/Tomato-TOEIC-Compact-Part-5&6.pdf"
                plugins={[layoutPluginInstance]}
              />
            </Worker>
            <canvas ref={canvasRef} className="draw-canvas active" />
          </div>
        </div>
      </main>

      {/* ===== SIDEBAR GHI CHÚ ===== */}
      <aside className="outline">
        <h4>📝 Ghi chú</h4>

        {notes.length === 0 && (
          <p style={{ fontSize: 14, color: "#888" }}>
            Chưa có ghi chú nào
          </p>
        )}

        {notes.map((note) => (
          <div
            key={note.id}
            style={{
              border:
                note.id === activeNoteId
                  ? "1px solid #4f46e5"
                  : "1px solid #ddd",
              borderRadius: 8,
              padding: 8,
              marginBottom: 8,
              background: "#fff",
            }}
            onClick={() => setActiveNoteId(note.id)}
          >
            <textarea
              value={note.content}
              placeholder="Nhập ghi chú..."
              onChange={(e) =>
                setNotes((prev) =>
                  prev.map((n) =>
                    n.id === note.id
                      ? { ...n, content: e.target.value }
                      : n
                  )
                )
              }
              style={{
                width: "100%",
                minHeight: 60,
                border: "none",
                outline: "none",
                resize: "vertical",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                color: "#666",
                marginTop: 4,
              }}
            >
              <span>
                {new Date(note.createdAt).toLocaleTimeString()}
              </span>
              <button
                style={{
                  border: "none",
                  background: "none",
                  color: "#e11d48",
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setNotes((prev) =>
                    prev.filter((n) => n.id !== note.id)
                  );
                  if (activeNoteId === note.id) setActiveNoteId(null);
                }}
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </aside>
    </div>
  );
}

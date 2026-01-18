import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import * as fabric from "fabric";
import "../../../styles/PersonalDocPage.css";

/* ===== TYPES ===== */
type Tool = "draw" | "highlight" | "erase" | null;

type Note = {
  id: string;
  noiDung: string;
  createdAt: string;
};

type PersonalDoc = {
  id: number;
  title: string;
  type: string;
  size: number;
  filePath: string;
  savedAt: string;
  status: string;
};

const API = "http://localhost:9090";

export default function PersonalDocPage() {
  const { docId } = useParams();
  const docIdNum = Number(docId);
  const token = localStorage.getItem("token");

  /* ===== DATA ===== */
  const [doc, setDoc] = useState<PersonalDoc | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [tool, setTool] = useState<Tool>(null);

  /* ===== CANVAS ===== */
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pdfLayerRef = useRef<HTMLDivElement | null>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);

  /* ================= LOAD DOC DETAIL ================= */
  useEffect(() => {
    if (!docIdNum) return;

    fetch(`${API}/api/personal-library/${docIdNum}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setDoc)
      .catch(console.error);
  }, [docIdNum]);

  /* ================= INIT CANVAS ================= */
  useEffect(() => {
    if (!canvasRef.current || !pdfLayerRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      selection: false,
      preserveObjectStacking: true,
    });

    const resize = () => {
      const rect = pdfLayerRef.current!.getBoundingClientRect();
      canvas.setDimensions({
        width: rect.width,
        height: rect.height,
      });
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

  /* ================= LOAD CANVAS ================= */
  useEffect(() => {
    if (!fabricRef.current || !docIdNum) return;

    fetch(`${API}/api/personal-docs/${docIdNum}/canvas`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.canvasJson) {
          fabricRef.current!.loadFromJSON(
            data.canvasJson,
            fabricRef.current!.renderAll.bind(fabricRef.current)
          );
        }
      })
      .catch(console.error);
  }, [docIdNum]);

  /* ================= TOOL HANDLER ================= */
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    canvas.isDrawingMode = false;
    canvas.off();

    if (tool === "draw") {
      const brush = new fabric.PencilBrush(canvas);
      brush.color = "#111";
      brush.width = 2;
      canvas.freeDrawingBrush = brush;
      canvas.isDrawingMode = true;
    }

    if (tool === "highlight") {
      let x = 0;
      let y = 0;

      canvas.on("mouse:down", (opt) => {
        const p = canvas.getScenePoint(opt.e);
        x = p.x;
        y = p.y;
      });

      canvas.on("mouse:up", (opt) => {
        const p = canvas.getScenePoint(opt.e);
        canvas.add(
          new fabric.Line([x, y, p.x, p.y], {
            stroke: "rgba(255,230,0,0.45)",
            strokeWidth: 10,
            globalCompositeOperation: "multiply",
          })
        );
      });
    }

    if (tool === "erase") {
      canvas.on("mouse:down", (opt) => {
        if (opt.target) canvas.remove(opt.target);
      });
    }
  }, [tool]);

  /* ================= SAVE CANVAS ================= */
  const saveCanvas = () => {
    if (!fabricRef.current) return;

    fetch(`${API}/api/personal-docs/${docIdNum}/canvas`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fabricRef.current.toJSON()),
    });
  };

  /* ================= NOTES ================= */
useEffect(() => {
  if (!docIdNum) return;

  console.log("📌 loading docId =", docIdNum);
  console.log("📌 token =", token);

  fetch(`${API}/api/personal-library/${docIdNum}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      console.log("📌 status =", res.status);

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API error ${res.status}: ${text}`);
      }

      return res.json();
    })
    .then((data) => {
      console.log("📌 doc data =", data);
      setDoc(data);
    })
    .catch((err) => {
      console.error("❌ load doc failed:", err);
    });
}, [docIdNum, token]);


  const addNote = () => {
    fetch(`${API}/api/personal-docs/${docIdNum}/notes`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(""),
    })
      .then((res) => res.json())
      .then((n) => setNotes((prev) => [n, ...prev]));
  };
if (!doc) {
  return <p>Đang tải...</p>;
}

return (
  <div className="personal-page">
    <main className="personal-content">
      <div className="personal-header">
        <h2>{doc.title}</h2>
        <span>
          Lưu ngày: {new Date(doc.savedAt).toLocaleDateString("vi-VN")}
        </span>
      </div>

        <div className="draw-toolbar">
          <button onClick={() => setTool("draw")}>✏️ Draw</button>
          <button onClick={() => setTool("highlight")}>🖍 Highlight</button>
          <button onClick={addNote}>📝 Note</button>
          <button onClick={() => setTool("erase")}>🧽 Erase</button>
          <button onClick={saveCanvas}>💾 Save</button>
        </div>

        <div className="pdf-wrapper">
          <div className="pdf-layer" ref={pdfLayerRef}>
            <iframe
              src={`${API}/api/knowledge/preview/${doc.id}`}
              title="PDF"
            />
            <canvas ref={canvasRef} className="draw-canvas" />
          </div>
        </div>
      </main>

      {/* ===== NOTES ===== */}
      <aside className="outline">
        <h4>📝 Ghi chú</h4>

        {notes.map((n) => (
          <textarea
            key={n.id}
            value={n.noiDung || ""}
            onChange={(e) =>
              setNotes((prev) =>
                prev.map((x) =>
                  x.id === n.id ? { ...x, noiDung: e.target.value } : x
                )
              )
            }
          />
        ))}
      </aside>
    </div>
  );
}

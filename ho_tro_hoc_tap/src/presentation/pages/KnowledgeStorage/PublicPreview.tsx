import { useParams } from "react-router-dom";

export default function PublicPreview() {
  const { id } = useParams();

  return (
    <div style={{ padding: 20 }}>
      <h2>Xem tài liệu</h2>

      <iframe
        src={`http://localhost:9090/api/knowledge/preview-file/${id}`}
        width="100%"
        height="700"
        style={{ border: "none" }}
      />
    </div>
  );
}

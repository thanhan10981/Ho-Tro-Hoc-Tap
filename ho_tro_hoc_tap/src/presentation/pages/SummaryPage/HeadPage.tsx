interface Props {
  onCreateAI: () => void;
}

export default function HeadPage({ onCreateAI }: Props) {
  return (
    <section className="page-header">
      <div className="title-left">
        <h1>Tóm tắt bài học</h1>
        <p>Sử dụng AI để tóm tắt tài liệu học tập một cách thông minh và hiệu quả</p>
      </div>

      <div className="title-right">
        <button className="btn create" onClick={onCreateAI}>
          ✨ Tạo tóm tắt mới
        </button>
      </div>
    </section>
  );
}

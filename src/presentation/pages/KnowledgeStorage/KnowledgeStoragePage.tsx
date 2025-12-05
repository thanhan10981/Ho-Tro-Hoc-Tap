import KnowledgeStorageBody from "./KnowledgeStorageBody";
import KnowledgeStorageFilter from "./KnowledgeStorageFilter";
import KnowledgeStorageHeader from "./KnowledgeStorageHeader";
import KnowledgeStorageSidebar from "./KnowledgeStorageSidebar";

export function KnowledgeStoragePage() {
  return (
    <div
      className="
        knowledge-storage-page
        max-w-[1400px]
        mx-auto
        p-0
        flex flex-col
        min-h-screen
        bg-white
      "
    >
      <KnowledgeStorageHeader />

      <div className="flex gap-6 mt-6">
        {/* Left Filter */}
        <div className="w-[240px] shrink-0">
          <div className="sticky top-4">
            <div className="rounded-xl p-4">
              <KnowledgeStorageFilter />
            </div>
          </div>
        </div>

        {/* Main content — tuỳ bạn */}
        <div className="flex-1">
          <KnowledgeStorageBody />
        </div>
      </div>

      <KnowledgeStorageSidebar />
    </div>
  );
}

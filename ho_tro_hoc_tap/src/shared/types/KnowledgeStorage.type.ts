export interface KnowledgeStorageFilters {
  subject?: string;
  type?: string[];      // ← Sửa thành array
  popularity?: string;
  rating?: number;
  fileSize?: number;

  keyword?: string;
  department?: string;
  position?: string;
  employee?: string;
  date?: string;
}

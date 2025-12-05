import { useState } from "react";

export interface OptionItem {
  id: number;
  label: string;
  value: string;
}

export const useKnowledgeHeader = () => {
  const [searchValue, setSearchValue] = useState<string>("");

  const subjects: OptionItem[] = [
    { id: 1, label: "Toán cao cấp", value: "math" },
    { id: 2, label: "Vật lý đại cương", value: "physics" },
    { id: 3, label: "Khoa học máy tính", value: "cs" },
  ];

  const types: OptionItem[] = [
    { id: 1, label: "Bài giảng", value: "lecture" },
    { id: 2, label: "Ghi chú", value: "note" },
    { id: 3, label: "Tài liệu tham khảo", value: "reference" },
  ];

  const handleAdvancedSearch = (): void => {
    console.log("Advanced search clicked");
  };

  const handleOpenUploadModal = (): void => {
    console.log("Open upload modal");
  };

  return {
    searchValue,
    setSearchValue,
    handleAdvancedSearch,
    handleOpenUploadModal,
    subjects,
    types,
  };
};

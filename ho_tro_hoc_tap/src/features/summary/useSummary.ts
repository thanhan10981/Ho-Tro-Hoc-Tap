import { useEffect, useState } from "react";
import type { SummaryItem } from "../../shared/types/Summary.type";
import type { TomTatFilterRequest, TomTatSortType } from "../../shared/types/Summary.type";
import { getMySummaries, filterSummaries } from "../../shared/services/summary.Service";

export const useSummary = () => {
  const [summaries, setSummaries] = useState<SummaryItem[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [sortLabel, setSortLabel] = useState("Mới nhất");
  const [loading, setLoading] = useState(false);

  const sortOptions = [
    "Mới nhất",
    "Cũ nhất",
    "Tên A–Z",
    "Số trang ↑",
    "Số trang ↓",
    "Số từ ↑",
    "Số từ ↓",
  ];

  const mapSortLabelToEnum = (label: string): TomTatSortType | undefined => {
    switch (label) {
      case "Mới nhất": return "MOI_NHAT";
      case "Cũ nhất": return "CU_NHAT";
      case "Tên A–Z": return "TEN_A_Z";
      case "Số trang ↑": return "SO_TRANG_CAO_NHAT";
      case "Số trang ↓": return "SO_TRANG_THAP_NHAT";
      case "Số từ ↑": return "SO_TU_NHIEU_NHAT";
      case "Số từ ↓": return "SO_TU_IT_NHAT";
      default: return undefined;
    }
  };

  const applyFilter = async (filter: Omit<TomTatFilterRequest, "sortType">) => {
    setLoading(true);
    try {
      const data = await filterSummaries({
        ...filter,
        sortType: mapSortLabelToEnum(sortLabel),
      });
      setSummaries(data);
    } finally {
      setLoading(false);
    }
  };
    const handleSortChange = async (label: string) => {
    setSortLabel(label);
    setLoading(true);

    try {
      const data = await filterSummaries({
        sortType: mapSortLabelToEnum(label),
      });
      setSummaries(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMySummaries().then(setSummaries);
  }, []);

  return {
    summaries,
    selected,
    setSelected,
    sortLabel,
    sortOptions,
    setSortLabel,
    handleSortChange,
    applyFilter,
    loading,
  };
};

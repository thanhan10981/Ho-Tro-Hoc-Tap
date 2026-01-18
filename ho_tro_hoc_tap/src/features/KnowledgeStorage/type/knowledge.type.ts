import type { ChuDe, LinhVuc } from "./sidebar.type";

export type Doc = {
  id: number;
  title: string;
  description: string;
  type: string;

  filePath: string;
  views?: number;
  downloads?: number;
  rating?: number;

  linhVuc?: LinhVuc;
  chuDe?: ChuDe;

  size: number | string;
  createdAt: string;
  status?: "done" | "todo";
};

export type PersonalDoc = {
  id: number;
  title: string;
  type: string;
  content: string;
  updatedAt: string;
};



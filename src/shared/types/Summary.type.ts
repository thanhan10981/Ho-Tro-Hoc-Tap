export interface SummaryItem {
  id: number;

  title: string;
  chapter?: string;

  subject: string;
  timeAgo: string;

  fileName: string;

  wordCount: number;
  pageCount: number;

  description: string;

  keywords: string[];

  icon: "file" | "grid" | "image" | "circle";

  status: "done" | "processing";
}

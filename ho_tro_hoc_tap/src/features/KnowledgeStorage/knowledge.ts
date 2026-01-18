import type { Doc } from "./type/knowledge.type";
import type { CapBac, ChuDe, LinhVuc, SidebarItem } from "./type/sidebar.type";

const BASE_URL = "http://localhost:9090/api/knowledge";

export async function fetchCommonDocs(page = 0, size = 6) {
  const res = await fetch(`${BASE_URL}/common?page=${page}&size=${size}`);
  if (!res.ok) throw new Error("Failed");
  return res.json(); // Page<KnowledgeDocResponse>
}

export async function fetchDocDetail(id: number) {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

export async function saveToPersonal(docId: number) {
  const res = await fetch(`${BASE_URL}/save?docId=${docId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) {
    throw new Error("Save failed");
  }
}


export async function fetchSidebarLinhVuc(): Promise<SidebarItem[]> {
  const res = await fetch(`${BASE_URL}/sidebar/linh-vuc`);
  if (!res.ok) throw new Error("Sidebar linh vuc failed");
  return res.json();
}

export async function fetchCapBac(): Promise<CapBac[]> {
  const res = await fetch(`${BASE_URL}/cap-bac`);
  if (!res.ok) throw new Error("Cap bac failed");
  return res.json();
}

export async function fetchLinhVuc(): Promise<LinhVuc[]> {
  const res = await fetch(`${BASE_URL}/linh-vuc`);
  if (!res.ok) throw new Error("Linh vuc failed");
  return res.json();
}

export async function fetchChuDe(linhVucId: number): Promise<ChuDe[]> {
  const res = await fetch(`${BASE_URL}/chu-de?linhVucId=${linhVucId}`);
  if (!res.ok) throw new Error("Chu de failed");
  return res.json();
}

export async function searchDocs(params: {
  keyword?: string;
  type?: string;
  linhVucId?: number;
  chuDeId?: number;
  capBacId?: number;
  rating?: number;
  page?: number;
  size?: number;
}): Promise<{
  content: Doc[];
  totalElements: number;
}> {
  const qs = new URLSearchParams();

  if (params.keyword) qs.append("keyword", params.keyword);
  if (params.type) qs.append("type", params.type);
  if (params.rating) qs.append("rating", params.rating.toString());
  if (params.linhVucId) qs.append("linhVucId", params.linhVucId.toString());
if (params.chuDeId) qs.append("chuDeId", params.chuDeId.toString());
if (params.capBacId) qs.append("capBacId", params.capBacId.toString());


  qs.append("page", (params.page ?? 0).toString());
  qs.append("size", (params.size ?? 6).toString());
 

  const res = await fetch(
    `${BASE_URL}/search?${qs.toString()}`
  );


  if (!res.ok) throw new Error("Search failed");
  return res.json();
}



// tăng lượt view
export async function increaseView(id: number) {
  await fetch(`${BASE_URL}/view/${id}`, { method: "POST" });
}


export async function uploadDoc(
  token: string,
  formData: FormData
) {
  const res = await fetch(
    "http://localhost:9090/api/knowledge/upload-full",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}



// tải file
export async function downloadDoc(id: number, title: string, type: string) {
  const res = await fetch(`http://localhost:9090/api/knowledge/download/${id}`);
  const blob = await res.blob();

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = `${title}.${type.toLowerCase()}`;
  document.body.appendChild(a);
  a.click();

  a.remove();
  window.URL.revokeObjectURL(url);
}



// tăng lượt download (optional)
export async function increaseDownload(id: number) {
  await fetch(`${BASE_URL}/download/${id}/count`, { method: "POST" });
}


export async function fetchPersonalLibrary() {
  const res = await fetch(
    "http://localhost:9090/api/personal-library",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (!res.ok) throw new Error("Fetch personal library failed");
  return res.json();
}


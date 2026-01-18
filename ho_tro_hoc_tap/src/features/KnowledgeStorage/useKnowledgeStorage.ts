import { useEffect, useState } from "react";
import {fetchSidebarLinhVuc,fetchCapBac,fetchChuDe,searchDocs, uploadDoc, fetchPersonalLibrary} from "./knowledge";

import type { CapBac, ChuDe, SidebarItem } from "./type/sidebar.type";
import type { Doc } from "./type/knowledge.type";

type Mode = "common" | "personal";

export function useKnowledgeStorage() {
  /* ================= MODE ================= */
  const [mode, setMode] = useState<Mode>("common");

  /* ================= SIDEBAR DATA ================= */
  const [sidebarLinhVuc, setSidebarLinhVuc] = useState<SidebarItem[]>([]);
  const [capBacList, setCapBacList] = useState<CapBac[]>([]);
  const [chuDeList, setChuDeList] = useState<ChuDe[]>([]);

  const [activeLinhVuc, setActiveLinhVuc] = useState<number | null>(null);
  const [activeCapBac, setActiveCapBac] = useState<number | null>(null);
  const [activeChuDe, setActiveChuDe] = useState<number | null>(null);

  /* ================= SEARCH STATE ================= */
  const [docs, setDocs] = useState<Doc[]>([]);
  const [totalDocs, setTotalDocs] = useState(0);

  const [keyword, setKeyword] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [type, setType] = useState<string | null>(null);

  /* ================= UI STATE ================= */
  const [preview, setPreview] = useState<Doc | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [page, setPage] = useState(1);

  const ITEMS = 6;

  /* ================= UPLOAD STATE ================= */
const [file, setFile] = useState<File | null>(null);
const [title, setTitle] = useState("");
const [description, setDescription] = useState("");

const [capBacId, setCapBacId] = useState<number | null>(null);
const [linhVucId, setLinhVucId] = useState<number | null>(null);
const [chuDeId, setChuDeId] = useState<number | null>(null);

const [uploading, setUploading] = useState(false);


  /* ================= INIT SIDEBAR ================= */
  useEffect(() => {
    fetchSidebarLinhVuc().then(setSidebarLinhVuc);
    fetchCapBac().then(setCapBacList);
  }, []);

  /* ================= LOAD CHỦ ĐỀ ================= */
    useEffect(() => {
    if (activeLinhVuc === null) return;

    let cancelled = false;

    fetchChuDe(activeLinhVuc).then(data => {
        if (!cancelled) {
        setChuDeList(data);
        }
    });

    return () => {
        cancelled = true;
    };
    }, [activeLinhVuc]);


  /* ================= SEARCH EFFECT ================= */
  useEffect(() => {
  if (mode === "common") {
    searchDocs({
      keyword: keyword || undefined,
      type: type || undefined,
      rating: rating || undefined,
      linhVucId: activeLinhVuc || undefined,
      chuDeId: activeChuDe || undefined,
      capBacId: activeCapBac || undefined,
      page: page - 1,
      size: ITEMS,
    })
      .then((res) => {
        setDocs(res.content);
        setTotalDocs(res.totalElements);
      })
      .catch(console.error);
  }

  if (mode === "personal") {
    fetchPersonalLibrary()
      .then((data) => {
        setDocs(data);
        setTotalDocs(data.length);
      })
      .catch(console.error);
  }
}, [
  mode,
  keyword,
  type,
  rating,
  activeLinhVuc,
  activeChuDe,
  activeCapBac,
  page,
]);



  /* ================= ACTIONS ================= */
  // function saveToPersonal(doc: Doc) {
  //   const stored = JSON.parse(
  //     localStorage.getItem("personalDocs") || "[]"
  //   );

  //   if (stored.some((d: Doc) => d.title === doc.title)) {
  //     alert("Tài liệu đã tồn tại trong kho cá nhân");
  //     return;
  //   }

  //   stored.push({
  //     id: Date.now(),
  //     title: doc.title,
  //     type: doc.type,
  //     content: "",
  //     updatedAt: new Date().toISOString()
  //   });

  //   localStorage.setItem("personalDocs", JSON.stringify(stored));
  //   alert("Đã lưu vào kho cá nhân");
  // }

  async function submitUpload(token: string) {
  if (!file || !title || !capBacId || !linhVucId || !chuDeId) {
    alert("Vui lòng nhập đủ thông tin");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);
  formData.append("description", description);
  formData.append("capBacId", capBacId.toString());
  formData.append("linhVucId", linhVucId.toString());
  formData.append("chuDeId", chuDeId.toString());

  try {
    setUploading(true);

    await uploadDoc(token, formData);

    alert("Upload thành công");

    // reset form
    setFile(null);
    setTitle("");
    setDescription("");
    setCapBacId(null);
    setLinhVucId(null);
    setChuDeId(null);
    setUploadOpen(false);

    setPage(1); 
  } catch (err) {
    console.error(err);
    alert("Upload thất bại");
  } finally {
    setUploading(false);
  }
}



  /* ================= RETURN DUY NHẤT ================= */
  return {
    /* mode */
    mode,
    setMode,

    /* sidebar */
    sidebarLinhVuc,
    capBacList,
    chuDeList,
    activeLinhVuc,
    setActiveLinhVuc,
    activeCapBac,
    setActiveCapBac,
    activeChuDe,
    setActiveChuDe,

    /* search */
    docs,
    totalDocs,
    keyword,
    setKeyword,
    rating,
    setRating,
    type,
    setType,

    /* ui */
    preview,
    setPreview,
    uploadOpen,
    setUploadOpen,
    page,
    setPage,
    ITEMS,

    /* actions */
    // saveToPersonal,

    /* upload */
file,
setFile,
title,
setTitle,
description,
setDescription,
capBacId,
setCapBacId,
linhVucId,
setLinhVucId,
chuDeId,
setChuDeId,
uploading,
submitUpload,

  };

  

}

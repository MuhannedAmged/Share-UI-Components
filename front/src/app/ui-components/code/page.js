"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SideBarUiComponents from "../../components/SideBarUiComponents";
import { getProjectById, setSaveProject } from "@/app/api/project";
import HtmlEditor from "@/app/components/HtmlEditor";
import CssEditor from "@/app/components/CssEditor";
import { IconCopy, IconDeviceFloppy, IconChevronLeft, IconBracketsAngle, IconEye } from "@tabler/icons-react";
import Toast from "@/app/components/Toast";
import NavBarMain from "@/app/components/NavBarMain";
import Link from "next/link";

const GetCodeFromIdContent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [project, setProject] = useState(null);
  const [index, setIndex] = useState(1);
  const [toast, setToast] = useState({ show: false, text: "", status: "" });

  const showToast = (status, text) => {
    setToast({ show: true, text, status });
    setTimeout(() => setToast({ show: false, text: "", status: "" }), 3000);
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await getProjectById(id);
        setProject(res.project);
      } catch (err) {
        showToast("error", "Failed to load component");
      }
    };
    if (id) fetchProject();
  }, [id]);

  const handleSave = async (projectId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("warning", "Login to save components to your library");
      return;
    }
    try {
      const response = await setSaveProject(projectId, token);
      if (response.success) {
        showToast("success", "Saved to library!");
      } else {
        showToast("error", response.message || "Failed to save");
      }
    } catch (error) {
      showToast("error", "Something went wrong");
    }
  };

  const copyToClipboard = (type, code) => {
    navigator.clipboard.writeText(code);
    showToast("success", `${type} copied to clipboard`);
  };

  return (
    <div className="flex bg-gray-950 min-h-screen text-white">
      <Toast show={toast.show} status={toast.status} text={toast.text} />
      <SideBarUiComponents />
      <div className="flex-1 overflow-auto flex flex-col">
        <NavBarMain />
        <div className="p-8 max-md:p-4 flex-1 flex flex-col">
          <Link href="/ui-components" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-6 group w-fit">
            <IconChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Library</span>
          </Link>

          {project ? (
            <div className="flex-1 flex flex-col gap-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-[10px] uppercase font-bold tracking-widest border border-sky-500/20">
                      {project.type || "Component"}
                    </span>
                    <span className="text-gray-600 font-mono text-xs">#{project._id.slice(-6)}</span>
                  </div>
                  <h1 className="text-4xl font-bold tracking-tight italic capitalize">
                    {project.name}
                  </h1>
                </div>
                <button
                  onClick={() => handleSave(project._id)}
                  className="flex items-center gap-2 bg-white/5 hover:bg-sky-500 hover:text-white text-sky-400 border border-sky-500/30 px-6 py-3 rounded-2xl font-bold transition-all shadow-xl active:scale-95"
                >
                  <IconDeviceFloppy size={22} />
                  <span>Save to Favorites</span>
                </button>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 flex-1">
                {/* Editor Section */}
                <div className="flex flex-col bg-white/5 border border-white/10 rounded-3xl overflow-hidden min-h-[500px]">
                  <div className="flex items-center justify-between p-4 bg-white/[0.02] border-b border-white/10">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIndex(1)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                          index === 1 ? "bg-white text-black" : "text-gray-400 hover:bg-white/5"
                        }`}
                      >
                        <IconBracketsAngle size={16} />
                        HTML
                      </button>
                      <button
                        onClick={() => setIndex(2)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                          index === 2 ? "bg-white text-black" : "text-gray-400 hover:bg-white/5"
                        }`}
                      >
                        <IconBracketsAngle size={16} />
                        CSS
                      </button>
                    </div>
                    <button
                      onClick={() => copyToClipboard(index === 1 ? "HTML" : "CSS", index === 1 ? project.htmlCode : project.cssCode)}
                      className="p-2 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-all"
                      title="Copy Code"
                    >
                      <IconCopy size={20} />
                    </button>
                  </div>
                  <div className="flex-1 overflow-auto p-4 bg-[#1e1e1e]">
                    {index === 1 ? (
                      <HtmlEditor code={project.htmlCode} readOnly={true} />
                    ) : (
                      <CssEditor code={project.cssCode} readOnly={true} />
                    )}
                  </div>
                </div>

                {/* Preview Section */}
                <div className="flex flex-col bg-white/5 border border-sky-500/20 rounded-3xl overflow-hidden min-h-[500px] shadow-2xl shadow-sky-500/5">
                   <div className="flex items-center gap-2 p-4 bg-white/[0.02] border-b border-white/10">
                    <IconEye size={20} className="text-sky-400" />
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Live Preview</span>
                  </div>
                  <div className="flex-1 bg-gray-900/50 backdrop-blur-3xl relative">
                    <iframe
                      title={`preview-${project._id}`}
                      srcDoc={`<html><head><style>body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: transparent; color: white; font-family: sans-serif; } ${project.cssCode || ""}</style></head><body>${project.htmlCode || ""}</body></html>`}
                      className="w-full h-full"
                      sandbox="allow-scripts allow-same-origin"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-10">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <div className="w-2 h-6 bg-sky-500 rounded-full" />
                  Description
                </h2>
                <p className="text-gray-400 leading-relaxed text-lg max-w-4xl">
                  {project.description || "This component was created with the UI Components Live Builder. It is fully responsive and ready to be integrated into your Next.js or Vite projects."}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-20 bg-white/5 border border-dashed border-white/10 rounded-3xl">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500 mb-4"></div>
               <p className="text-gray-400 text-xl font-medium animate-pulse">Loading component details...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const GetCodeFromId = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <GetCodeFromIdContent />
  </Suspense>
);

export default GetCodeFromId;

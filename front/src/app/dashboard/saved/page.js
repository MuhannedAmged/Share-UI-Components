"use client";
import React, { useEffect, useState } from "react";
import SideBar from "@/app/components/SideBar";
import Toast from "@/app/components/Toast";
import { IconCode, IconTrash, IconExternalLink } from "@tabler/icons-react";
import { getSaveProject, unSaveProject } from "@/app/api/project";
import { useRouter } from "next/navigation";
import { checkUser } from "@/app/api/auth";
import Link from "next/link";

const Saved = () => {
  const [projects, setProjects] = useState([]);
  const [toast, setToast] = useState({ show: false, status: "", text: "" });
  const router = useRouter();

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/sign-in");
        return;
      }
      const res = await checkUser(token);
      if (!res.success) {
        localStorage.removeItem("token");
        router.push("/auth/sign-in");
      }
    };
    verifyUser();
  }, []);

  useEffect(() => {
    const loadProjects = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await getSaveProject(token);
      if (res.success) {
        setProjects(res.projects);
      } else {
        setToast({ show: true, status: "error", text: res.message });
      }
      setTimeout(() => setToast({ show: false, status: "", text: "" }), 3000);
    };
    loadProjects();
  }, []);

  const handleUnSave = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) return;
    const res = await unSaveProject(token, id);
    if (res.success) {
      setProjects(projects.filter((p) => p._id !== id));
      setToast({ show: true, status: "success", text: "Project removed." });
    } else {
      setToast({ show: true, status: "error", text: res.message });
    }
    setTimeout(() => setToast({ show: false, status: "", text: "" }), 3000);
  };

  return (
    <div className="flex bg-gray-950 min-h-screen">
      <SideBar />
      <div className="flex-1 text-white p-8 max-md:p-4 overflow-auto">
        <div className="w-full flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Saved Library</h1>
            <p className="text-gray-400 mt-2 text-lg">Your curated collection of favorite components.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {projects.length > 0 ? (
            projects.map((project) => (
              <Link
                key={project._id}
                href={`/ui-components/code?id=${project._id}`}
                className="group bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:bg-white/[0.08] hover:border-sky-500/50 flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                      <IconCode size={24} stroke={1.75} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-purple-400 transition-colors uppercase line-clamp-1">{project.name}</h3>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider">{project.type}</span>
                    </div>
                  </div>
                  <IconExternalLink size={18} className="text-gray-500 group-hover:text-white transition-all" />
                </div>
                
                <p className="text-sm text-gray-400 mb-6 line-clamp-2 h-10">{project.description || "Beautifully saved component."}</p>

                <div className="relative mb-6 border border-white/5 rounded-xl overflow-hidden h-48 bg-gray-950 group-hover:border-purple-500/30 transition-all pointer-events-none">
                  <iframe
                    title={`preview-${project._id}`}
                    srcDoc={`<html><head><style>body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: transparent; color: white; font-family: sans-serif; } ${project.cssCode || ""}</style></head><body>${project.htmlCode || ""}</body></html>`}
                    className="w-full h-full"
                    sandbox="allow-scripts allow-same-origin"
                  />
                  <div className="absolute inset-0 bg-transparent" />
                </div>

                <div className="mt-auto flex items-center justify-end pt-4 border-t border-white/5">
                  <button
                    onClick={(e) => handleUnSave(e, project._id)}
                    className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all"
                  >
                    <IconTrash size={16} />
                    <span>Remove from Saved</span>
                  </button>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white/5 border border-dashed border-white/10 rounded-2xl">
              <p className="text-gray-400 text-lg">Your library is empty. Go explore some components!</p>
              <Link href="/ui-components" className="inline-block mt-4 text-sky-400 hover:underline">Browse Library</Link>
            </div>
          )}
        </div>
      </div>

      {toast.show && <Toast status={toast.status} text={toast.text} />}
    </div>
  );
};

export default Saved;

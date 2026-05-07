"use client";
import React, { useEffect, useState } from "react";
import SideBar from "@/app/components/SideBar";
import Toast from "@/app/components/Toast";
import CreateProjects from "@/app/components/CreateProjects";
import UpdateProjects from "@/app/components/UpdateProjects";
import {
  IconCode,
  IconEdit,
  IconPlus,
  IconTrash,
  IconExternalLink,
} from "@tabler/icons-react";
import { fetchProjects, deleteProject } from "@/app/api/project";
import { useRouter } from "next/navigation";
import { checkUser } from "@/app/api/auth";
import Link from "next/link";

const Projects = () => {
  const [createProjectsModel, setCreateProjectsModel] = useState(false);
  const [updateProjectModel, setUpdateProjectModel] = useState(null);
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
  }, [router]);

  useEffect(() => {
    const loadProjects = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetchProjects(token);
      if (res.success) {
        setProjects(res.projects);
      } else {
        setToast({ show: true, status: "error", text: res.message });
      }
    };
    loadProjects();
  }, []);

  const onClose = () => {
    setCreateProjectsModel(false);
    setUpdateProjectModel(null);
  };

  const handleProjectCreated = (project) => {
    setProjects((prev) => [...prev, project]);
    setToast({
      show: true,
      status: "success",
      text: "Project created successfully",
    });
    setTimeout(() => setToast({ show: false, status: "", text: "" }), 3000);
  };

  const handleProjectUpdated = (updatedProject) => {
    setProjects((prev) =>
      prev.map((p) => (p._id === updatedProject._id ? updatedProject : p)),
    );
    setToast({
      show: true,
      status: "success",
      text: "Project updated successfully",
    });
    setTimeout(() => setToast({ show: false, status: "", text: "" }), 3000);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const res = await deleteProject(id, token);
    if (res.success) {
      setProjects((prev) => prev.filter((p) => p._id !== id));
      setToast({ show: true, status: "success", text: "Project deleted." });
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
            <h1 className="text-4xl font-bold tracking-tight">Your Projects</h1>
            <p className="text-gray-400 mt-2">
              Manage and edit your component collection.
            </p>
          </div>
          <button
            onClick={() => setCreateProjectsModel(true)}
            className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-sky-500/20 transform hover:scale-105"
          >
            <IconPlus size={20} />
            <span className="max-md:hidden">New Component</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div
                key={project._id}
                className="group bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:bg-white/[0.08] hover:border-sky-500/50 flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                      <IconCode size={24} stroke={1.75} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-sky-400 transition-colors">
                        {project.name}
                      </h3>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                        {project.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/ui-components/code?id=${project._id}`}
                      className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
                    >
                      <IconExternalLink size={18} />
                    </Link>
                  </div>
                </div>

                <p className="text-sm text-gray-400 mb-6 line-clamp-2 h-10">
                  {project.description || "No description provided."}
                </p>

                <div className="relative mb-6 border border-white/5 rounded-xl overflow-hidden h-48 bg-gray-950 group-hover:border-sky-500/30 transition-all pointer-events-none">
                  <iframe
                    title={`preview-${project._id}`}
                    srcDoc={`<html><head><style>body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: transparent; color: white; font-family: sans-serif; } ${project.cssCode || ""}</style></head><body>${project.htmlCode || ""}</body></html>`}
                    className="w-full h-full"
                    sandbox="allow-scripts allow-same-origin"
                  />
                  <div className="absolute inset-0 bg-transparent" />
                </div>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setUpdateProjectModel(project)}
                      className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-all"
                    >
                      <IconEdit size={16} />
                      <span>Edit</span>
                    </button>
                  </div>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all"
                    title="Delete Project"
                  >
                    <IconTrash size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white/5 border border-dashed border-white/10 rounded-2xl">
              <p className="text-gray-400 text-lg">
                No projects found. Start by creating your first component!
              </p>
            </div>
          )}
        </div>
      </div>

      {createProjectsModel && (
        <CreateProjects
          onClose={onClose}
          onProjectCreated={handleProjectCreated}
        />
      )}

      {updateProjectModel && (
        <UpdateProjects
          project={updateProjectModel}
          onClose={onClose}
          onProjectUpdated={handleProjectUpdated}
        />
      )}

      {toast.show && <Toast status={toast.status} text={toast.text} />}
    </div>
  );
};

export default Projects;

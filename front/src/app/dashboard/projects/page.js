"use client";
import React, { useEffect, useState } from "react";
import SideBar from "@/app/components/SideBar";
import Toast from "@/app/components/Toast";
import CreateProjects from "@/app/components/CreateProjects";
import UpdateProjects from "@/app/components/UpdateProjects";
import { IconCode, IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { fetchProjects, deleteProject } from "@/app/api/project";
import { useRouter } from "next/navigation";
import { checkUser } from "@/app/api/auth";

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
  }, []);

  useEffect(() => {
    const loadProjects = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetchProjects(token);

      if (res.success) {
        setProjects(res.projects);
      } else {
        setToast({ show: true, status: "error", text: res.message });
        localStorage.removeItem("token");
      }

      setTimeout(() => setToast({ show: false, status: "", text: "" }), 3000);
    };

    loadProjects();
  }, []);

  const onClose = () => {
    setCreateProjectsModel(false);
    setUpdateProjectModel(null);
  };

  const handleProjectCreated = (project) => {
    setProjects((prev) => [...prev, project]);
    setToast({ show: true, status: "success", text: "Project created successfully" });
    setTimeout(() => setToast({ show: false, status: "", text: "" }), 3000);
  };

  const handleProjectUpdated = (updatedProject) => {
    setProjects((prev) =>
      prev.map((p) => (p._id === updatedProject._id ? updatedProject : p))
    );
    setToast({ show: true, status: "success", text: "Project updated successfully" });
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
    <div className="flex">
      <SideBar />
      <div className="w-full text-white p-8 max-md:p-4">
        <div className="w-full flex justify-between items-center">
          <h1 className="text-2xl">Projects</h1>
          <button
            onClick={() => setCreateProjectsModel(true)}
            className="border border-gray-700 p-2 rounded-md hover:text-sky-400"
          >
            <IconPlus size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div
                key={project._id}
                className="bg-gray-950 p-4 rounded hover:border-sky-400 border border-gray-950"
              >
                <div className="flex items-center gap-3 mb-2.5">
                  <IconCode size={35} stroke={1.75} className="main-shadow p-2 rounded" />
                  <h3 className="text-sm font-bold">{project.name}</h3>
                </div>
                <p className="text-sm text-gray-400">{project.description}</p>

                <div className="mt-4 border border-gray-800 rounded overflow-hidden">
                  <iframe
                    title={`preview-${project._id}`}
                    srcDoc={`<html><head><style>${project.cssCode || ""}</style></head><body>${project.htmlCode || ""}</body></html>`}
                    className="w-full h-50"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>

                <div className="flex items-center justify-center gap-2.5 mt-2">
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="main-shadow p-2 hover:text-sky-400 duration-300"
                  >
                    <IconTrash size={20} stroke={1.75} />
                  </button>
                  <button
                    onClick={() => setUpdateProjectModel(project)}
                    className="main-shadow p-2 hover:text-sky-400 duration-300"
                  >
                    <IconEdit size={20} stroke={1.75} />
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-2">Type: {project.type}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No projects found.</p>
          )}
        </div>
      </div>

      {createProjectsModel && (
        <CreateProjects onClose={onClose} onProjectCreated={handleProjectCreated} />
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

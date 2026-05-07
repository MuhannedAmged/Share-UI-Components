"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SideBarUiComponents from "../../components/SideBarUiComponents";
import { getProjectById, setSaveProject } from "@/app/api/project";
import HtmlEditor from "@/app/components/HtmlEditor";
import CssEditor from "@/app/components/CssEditor";
import { IconCopy, IconDeviceFloppy } from "@tabler/icons-react";
import Toast from "@/app/components/Toast";
import NavBarMain from "@/app/components/NavBarMain";

const GetCodeFromId = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [project, setProject] = useState(null);
  const [index, setIndex] = useState(1);

  const renderEditor = () => {
    if (index === 1)
      return (
        <HtmlEditor classes={""} code={project.htmlCode} readOnly={true} />
      );
    if (index === 2)
      return <CssEditor code={project.cssCode} readOnly={true} />;
    return null;
  };

  const [toast, setToast] = useState({
    show: false,
    text: "",
    status: "",
  });

  const showToast = (status, text) => {
    setToast({ show: true, text, status });
    setTimeout(() => setToast({ show: false, text: "", status: "" }), 3000);
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await getProjectById(id);
        await setProject(res.project);
        console.log(project);
      } catch (err) {
        showToast("error", "Failed to load user data");
      }
    };

    if (id) fetchProject();
  }, [id]);

  const handleSave = async (projectId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      showToast("error", "You must be logged in to save projects");
      return;
    }

    try {
      const response = await setSaveProject(projectId, token);

      if (response.success) {
        showToast("success", "Project saved!");
      } else {
        showToast("error", response.message || "Failed to save project");
      }
    } catch (error) {
      showToast("error", "Something went wrong while saving the project");
    }
  };

  return (
    <div className="flex min-h-screen text-white">
      <Toast show={toast.show} status={toast.status} text={toast.text} />
      <SideBarUiComponents />
      <div className="flex-1 overflow-auto">
        <NavBarMain />
        <div className="p-8">
          {project ? (
            <div className="">
              <h1 className="text-3xl mb-6 capitalize">
                UI Components - {project.name}
              </h1>
              <div className="mb-4">
                <h2 className="text-xl mb-2 mr-1 inline-block">Description:</h2>
                <p className="inline-block">{project.description}</p>
              </div>
              <div>
                <div className="mb-3 w-full flex items-center justify-between gap-2.5">
                  <div>
                    <span
                      onClick={() => setIndex(1)}
                      className={`uppercase p-1 text-center rounded-sm cursor-pointer ${
                        index === 1 ? "bg-white text-black" : ""
                      }`}
                    >
                      html
                    </span>
                    <span
                      onClick={() => setIndex(2)}
                      className={`uppercase p-1 text-center rounded-sm cursor-pointer ${
                        index === 2 ? "bg-white text-black" : ""
                      }`}
                    >
                      css
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (index === 1) {
                        navigator.clipboard.writeText(project.htmlCode);
                        showToast("success", "Html code copied to clipboard");
                      } else if (index === 2) {
                        navigator.clipboard.writeText(project.cssCode);
                        showToast("success", "Css code copied to clipboard");
                      }
                    }}
                  >
                    <IconCopy size={20} stroke={1.75} />
                  </button>
                </div>
                <div className="flex items-center g-3 max-md:block">
                  <div className="mb-3 w-full rounded overflow-hidden h-80 min-md:mr-3">
                    {renderEditor()}
                  </div>
                  <div className="mb-3 w-full border rounded overflow-hidden h-80">
                    <iframe
                      title={`preview-${project._id}`}
                      srcDoc={`<html><head><style>${
                        project.cssCode || ""
                      }</style></head><body>${
                        project.htmlCode || ""
                      }</body></html>`}
                      className="w-full h-full"
                      sandbox="allow-scripts allow-same-origin"
                    />
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => {
                      handleSave(project._id);
                    }}
                    className={`text-white ${
                      project.isSaved ? "text-sky-400" : ""
                    } hover:text-sky-400 transition`}
                  >
                    {project.isSaved}
                    <IconDeviceFloppy size={20} stroke={1.75} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-white p-8 flex-1 text-3xl">
              Project not found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GetCodeFromId;

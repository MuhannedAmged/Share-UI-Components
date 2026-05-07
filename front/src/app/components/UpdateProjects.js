"use client";
import React, { useState } from "react";
import HtmlEditor from "./HtmlEditor";
import CssEditor from "./CssEditor";
import { updateProject } from "@/app/api/project";
import Toast from "./Toast";

const UpdateProjects = ({ onClose, onProjectUpdated, project }) => {
  const [index, setIndex] = useState(1);
  const [htmlCode, setHtmlCode] = useState(project?.htmlCode || "");
  const [cssCode, setCssCode] = useState(project?.cssCode || "");
  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");
  const [type, setType] = useState(project?.type || "");

  const [toast, setToast] = useState({
    show: false,
    text: "",
    status: "",
  });

  const showToast = (status, text) => {
    setToast({ show: true, text, status });
    setTimeout(() => setToast({ show: false, text: "", status: "" }), 3000);
  };

  const renderEditor = () => {
    if (index === 1) return <HtmlEditor code={htmlCode} setCode={setHtmlCode} />;
    if (index === 2) return <CssEditor code={cssCode} setCode={setCssCode} />;
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      showToast("error", "Unauthorized: Please login.");
      return;
    }

    const res = await updateProject(project._id, {
      name,
      description,
      type,
      htmlCode,
      cssCode,
      token,
    });

    if (res.success) {
      onProjectUpdated(res.project);
      showToast("success", "Project updated successfully.");
      setTimeout(onClose, 1000);
    } else {
      showToast("error", res.message || "Failed to update project.");
    }
  };

  return (
    <>
      <Toast show={toast.show} status={toast.status} text={toast.text} />

      <div
        onClick={onClose}
        className="h-screen w-screen fixed top-0 left-0 bg-gray-900/40 z-10"
      ></div>
      <div className="w-md max-md:w-sm p-5 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-gray-900 z-10 text-white">
        <h3 className="text-1xl">Update project</h3>
        <p className="text-sm my-3">
          Modify the project details and save your changes.
        </p>
        <div className="mb-3 flex items-center gap-2.5">
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
        <form onSubmit={handleSubmit}>
          <div className="h-40">{renderEditor()}</div>
          <div className="mt-2">
            <label htmlFor="project-name">Project name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Type here"
              className="my-2 mt-1 w-full bg-transparent border border-slate-500 rounded-md p-2 text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="project-description">Project description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Type here"
              className="my-2 mt-1 w-full bg-transparent border border-slate-500 rounded-md p-2 text-white"
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="project-type">Project type</label>
            <select
              id="project-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="my-2 mt-1 w-full bg-transparent border border-slate-500 rounded-md p-2 text-white"
              required
            >
              <option className="text-black" value="">
                Select a type
              </option>
              <option className="text-black capitalize" value="button">
                Button
              </option>
              <option className="text-black capitalize" value="input">
                Input
              </option>
              <option className="text-black capitalize" value="card">
                Card
              </option>
              <option className="text-black capitalize" value="model">
                Model
              </option>
              <option className="text-black capitalize" value="toast">
                Toast
              </option>
              <option className="text-black capitalize" value="form">
                Form
              </option>
              <option className="text-black capitalize" value="animation">
                Animation
              </option>
              <option className="text-black capitalize" value="other">
                Other
              </option>
            </select>
          </div>

          <div className="flex justify-end gap-2.5 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 p-1 rounded-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 p-1 rounded-sm cursor-pointer"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateProjects;

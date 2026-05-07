"use client";
import React, { useState } from "react";
import HtmlEditor from "./HtmlEditor";
import CssEditor from "./CssEditor";
import { createProject } from "@/app/api/project";
import Toast from "./Toast";

const CreateProjects = ({ onClose, onProjectCreated }) => {
  const [index, setIndex] = useState(1);
  const [htmlCode, setHtmlCode] = useState("<!-- Write HTML Code Here -->");
  const [cssCode, setCssCode] = useState("/* Write CSS Code Here */");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");

  const [toast, setToast] = useState({
    show: false,
    text: "",
    status: "", // "success" | "error" | "warning"
  });

  const showToast = (status, text) => {
    setToast({ show: true, text, status });
    setTimeout(() => setToast({ show: false, text: "", status: "" }), 3000);
  };

  const renderEditor = () => {
    if (index === 1)
      return <HtmlEditor code={htmlCode} setCode={setHtmlCode} />;
    if (index === 2) return <CssEditor code={cssCode} setCode={setCssCode} />;
    return null;
  };

  const containsUnsafeCode = (code) => {
    const jsKeywords = [
      "<script",
      "onerror",
      "onload",
      "onclick",
      "javascript:",
    ];
    return jsKeywords.some((kw) => code.toLowerCase().includes(kw));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (containsUnsafeCode(htmlCode) || containsUnsafeCode(cssCode)) {
      showToast(
        "error",
        "Your code contains unsafe content like <script> or JS events."
      );
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      showToast("error", "Unauthorized: Please login.");
      return;
    }

    const res = await createProject({
      name,
      description,
      type,
      htmlCode,
      cssCode,
      token,
    });

    if (res.success) {
      onProjectCreated(res.project);
      showToast("success", "Project created successfully.");
      setTimeout(onClose, 1000);
    } else {
      showToast("error", res.message || "Failed to create project.");
    }
  };

  return (
    <>
      <Toast show={toast.show} status={toast.status} text={toast.text} />

      <div
        onClick={onClose}
        className="h-screen w-screen fixed top-0 left-0 bg-gray-900/40 z-10"
      ></div>
      <div className="w-full max-w-xl mx-4 p-8 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-gray-950 border border-white/10 z-10 text-white shadow-2xl">
        <h3 className="text-1xl">Create a new project</h3>
        <p className="text-sm my-3">
          A project is a collection of pages that you can create and manage.
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
          <div className="h-[150px] overflow-y-auto">{renderEditor()}</div>
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
              <option className="text-black capitalize" value="from">
                From
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
              Create
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateProjects;

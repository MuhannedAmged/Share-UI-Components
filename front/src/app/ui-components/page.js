"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import SideBarUiComponents from "../components/SideBarUiComponents";
import Link from "next/link";
import NavBarMain from "../components/NavBarMain";

const UiComponents = () => {
  const [projects, setProjects] = useState([]);
  const [visibleCount, setVisibleCount] = useState(20);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/random-projects`
      );
      setProjects(res.data.projects || []);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 20);
  };

  return (
    <div className="flex min-h-screen text-white">
      <SideBarUiComponents />
      <div className="flex-1 overflow-auto">
        <NavBarMain />
        <div className="p-8">
          <h1 className="text-3xl mb-6">UI Components</h1>

          {projects.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {projects.slice(0, visibleCount).map((project) => (
                  <Link
                    href={`/ui-components/code?id=${project._id}`}
                    key={project._id}
                    className="group"
                  >
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 transition-all duration-300 group-hover:bg-white/[0.08] group-hover:border-sky-500/50 group-hover:shadow-lg group-hover:shadow-sky-500/10 h-full flex flex-col">
                      <div className="relative mb-4 border border-white/5 rounded-xl overflow-hidden h-48 bg-gray-900 group-hover:border-sky-500/30 transition-colors">
                        <iframe
                          title={`preview-${project._id}`}
                          srcDoc={`
                        <html>
                          <head>
                            <style>
                              body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: transparent; color: white; font-family: sans-serif; }
                              ${project.cssCode || ""}
                            </style>
                          </head>
                          <body>
                            ${project.htmlCode || ""}
                          </body>
                        </html>
                      `}
                          className="w-full h-full pointer-events-none"
                          sandbox="allow-scripts allow-same-origin"
                        />
                        <div className="absolute inset-0 bg-transparent group-hover:bg-sky-500/5 transition-colors" />
                      </div>

                      <div className="flex-1">
                        <h2 className="text-xl font-bold mb-2 group-hover:text-sky-400 transition-colors line-clamp-1">{project.name}</h2>
                        <p className="text-sm text-gray-400 mb-4 line-clamp-2 h-10">
                          {project.description || "Beautifully crafted UI component."}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-[10px] font-bold">
                            {project.user?.name?.[0]?.toUpperCase() || "U"}
                          </div>
                          <span className="text-xs text-gray-400">{project.user?.name || "Anonymous"}</span>
                        </div>
                        <span className="text-[10px] text-gray-500 font-mono">#{project._id.slice(-6)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {visibleCount < projects.length && (
                <div className="mt-12 text-center pb-10">
                  <button
                    onClick={handleShowMore}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-3 rounded-full text-white font-semibold transition-all hover:scale-105 active:scale-95"
                  >
                    Load More Components
                  </button>
                </div>
              )}
            </>
          ) : (
            <p>No projects found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UiComponents;

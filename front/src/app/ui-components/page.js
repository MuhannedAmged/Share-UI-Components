"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import SideBarUiComponents from "../components/SideBarUiComponents";
import Link from "next/link";
import NavBarMain from "../components/NavBarMain";
import { IconCode, IconExternalLink, IconUser } from "@tabler/icons-react";

const UiComponents = () => {
  const [projects, setProjects] = useState([]);
  const [visibleCount, setVisibleCount] = useState(20);

  useEffect(() => {
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
    fetchProjects();
  }, []);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 20);
  };

  return (
    <div className="flex bg-gray-950 min-h-screen">
      <SideBarUiComponents />
      <div className="flex-1 overflow-auto">
        <NavBarMain />
        <div className="p-8 max-md:p-4">
          <header className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight text-white italic">UI Components Library</h1>
            <p className="text-gray-400 mt-2 text-lg">Discover and use thousands of community-crafted components.</p>
          </header>

          {projects.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                {projects.slice(0, visibleCount).map((project) => (
                  <Link
                    href={`/ui-components/code?id=${project._id}`}
                    key={project._id}
                    className="group bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:bg-white/[0.08] hover:border-sky-500/50 flex flex-col hover:shadow-2xl hover:shadow-sky-500/10"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                          <IconCode size={20} stroke={1.75} />
                        </div>
                        <h3 className="font-bold text-lg text-white group-hover:text-sky-400 transition-colors uppercase line-clamp-1">{project.name}</h3>
                      </div>
                      <IconExternalLink size={18} className="text-gray-500 group-hover:text-white transition-all" />
                    </div>

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
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                          {project.user?.name?.[0]?.toUpperCase() || <IconUser size={14} />}
                        </div>
                        <span className="text-xs text-gray-400 font-medium">{project.user?.name || "Anonymous"}</span>
                      </div>
                      <span className="text-[10px] text-gray-600 font-mono">#{project._id.slice(-6)}</span>
                    </div>
                  </Link>
                ))}
              </div>

              {visibleCount < projects.length && (
                <div className="mt-16 text-center pb-12">
                  <button
                    onClick={handleShowMore}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 px-10 py-4 rounded-2xl text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-xl hover:border-sky-500/30"
                  >
                    Load More Components
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center bg-white/5 border border-dashed border-white/10 rounded-3xl">
              <p className="text-gray-400 text-xl font-medium italic">No projects found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UiComponents;

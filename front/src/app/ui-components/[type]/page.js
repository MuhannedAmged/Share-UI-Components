"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import SideBarUiComponents from "../../components/SideBarUiComponents";
import { usePathname } from "next/navigation";
import Link from "next/link";
import NavBarMain from "@/app/components/NavBarMain";

const UiComponentsType = () => {
  const pathName = usePathname();
  const pathParts = pathName.toString().split("/");
  const type = pathParts[pathParts.length - 1];

  const [projects, setProjects] = useState([]);
  const [visibleCount, setVisibleCount] = useState(20);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/by-type/${type}`
      );
      setProjects(res.data.projects || []);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [type]);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 20);
  };

  return (
    <div className="flex min-h-screen text-white">
      <SideBarUiComponents />
      <div className="flex-1 overflow-auto">
        <NavBarMain />
        <div className="p-8">
          <h1 className="text-3xl mb-6 capitalize">UI Components - {type}</h1>

          {projects.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {projects.slice(0, visibleCount).map((project) => (
                  <Link
                    href={`/ui-components/code?id=${project._id}`}
                    key={project._id}
                  >
                    <div className="bg-gray-950 p-4 hover:border-sky-400 border border-gray-950 rounded shadow">
                      <h2 className="text-lg font-bold mb-2">{project.name}</h2>
                      <p className="mb-2 text-sm text-gray-300">
                        {project.description}
                      </p>

                      <div className="mb-3 border rounded overflow-hidden h-40">
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

                      <p className="text-xs text-gray-400">
                        Created by: {project.user?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-500">ID: {project._id}</p>
                    </div>
                  </Link>
                ))}
              </div>

              {visibleCount < projects.length && (
                <div className="mt-8 text-center">
                  <button
                    onClick={handleShowMore}
                    className="bg-sky-600 hover:bg-sky-700 px-6 py-2 rounded text-white font-medium transition"
                  >
                    Show More
                  </button>
                </div>
              )}
            </>
          ) : (
            <p>No projects found for type: {type}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UiComponentsType;

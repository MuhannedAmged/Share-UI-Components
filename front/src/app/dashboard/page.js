"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import SideBar from "../components/SideBar";
import { checkUser } from "../api/auth";

const Dashboard = () => {
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

  return (
    <div className="flex bg-gray-950 min-h-screen">
      <SideBar />
      <div className="flex-1 text-white p-8 overflow-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Overview</h1>
          <p className="text-gray-400 mt-2">Welcome back! Here's what's happening with your components.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Total Projects", value: "12", icon: "📁", color: "bg-blue-500/10 text-blue-500" },
            { label: "Saved Components", value: "48", icon: "💾", color: "bg-purple-500/10 text-purple-500" },
            { label: "Total Views", value: "1.2k", icon: "👁️", color: "bg-sky-500/10 text-sky-500" },
            { label: "Followers", value: "85", icon: "👥", color: "bg-emerald-500/10 text-emerald-500" },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className={`p-2 rounded-lg ${stat.color} text-xl`}>{stat.icon}</span>
                <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">+12%</span>
              </div>
              <h3 className="text-gray-400 text-sm font-medium">{stat.label}</h3>
              <p className="text-3xl font-bold mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
            <div className="space-y-6">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400">
                    <span className="text-xs">UI</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">You updated "Modern Button Pack"</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-sky-500/10 border border-sky-500/20 rounded-xl hover:bg-sky-500/20 transition-all text-sm font-medium text-sky-400">
                New Project
              </button>
              <button className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl hover:bg-purple-500/20 transition-all text-sm font-medium text-purple-400">
                Explore Components
              </button>
              <button className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-sm font-medium">
                View Profile
              </button>
              <button className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-sm font-medium">
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

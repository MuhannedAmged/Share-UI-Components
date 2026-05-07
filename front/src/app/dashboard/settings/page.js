"use client";
import React, { useEffect, useState } from "react";
import SideBar from "@/app/components/SideBar";
import {
  updateUser,
  changePassword,
  deleteAccount,
  uploadImageToCloudinary,
} from "@/app/api/user";
import Toast from "@/app/components/Toast";
import axios from "axios";
import { IconUser, IconMail, IconLock, IconTrash, IconDeviceFloppy, IconLogout, IconCamera } from "@tabler/icons-react";

const Settings = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [token, setToken] = useState("");

  const [toast, setToast] = useState({
    status: "",
    text: "",
    show: false,
  });

  const showToast = (status, text) => {
    setToast({ status, text, show: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      window.location.href = "/auth/sign-in";
      return;
    }
    setToken(storedToken);
    fetchUserData(storedToken);
  }, []);

  const fetchUserData = async (storedToken) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`,
        { token: storedToken },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = res.data;
      setName(data.name || "");
      setEmail(data.email || "");
      setImageUrl(data.image || "");
      if (data.image) setPreview(data.image);
    } catch (err) {
      console.error("Fetch error:", err);
      showToast("error", "Failed to load user data");
    }
  };

  const handleUpdateField = async (field) => {
    try {
      const storedToken = localStorage.getItem("token");
      await updateUser(storedToken, name, email, imageUrl);
      showToast("success", "Profile updated successfully");
    } catch {
      showToast("error", `Failed to update ${field}`);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setLoadingImage(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setImageUrl(url);
      showToast("success", "Image uploaded successfully");
    } catch {
      showToast("error", "Image upload failed");
    } finally {
      setLoadingImage(false);
    }
  };

  const handleChangePassword = async () => {
    if (!password) return showToast("error", "Please enter a new password");
    try {
      await changePassword(token, password);
      showToast("success", "Password changed successfully");
      setPassword("");
    } catch {
      showToast("error", "Failed to change password");
    }
  };

  const handleLogOut = async () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleDeleteAccount = async () => {
    const confirmed = confirm("Are you sure? This action is permanent and will delete all your projects.");
    if (!confirmed) return;
    try {
      await deleteAccount(token);
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch {
      showToast("error", "Failed to delete account");
    }
  };

  return (
    <div className="flex bg-gray-950 min-h-screen">
      <SideBar />
      <Toast status={toast.status} text={toast.text} show={toast.show} />
      <div className="flex-1 text-white p-8 max-md:p-4 overflow-auto">
        <header className="mb-10 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
          <p className="text-gray-400 mt-2 text-lg">Manage your account preferences and profile.</p>
        </header>

        <div className="max-w-4xl mx-auto space-y-8 pb-10">
          {/* Profile Section */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <IconUser className="text-sky-400" />
              Public Profile
            </h2>
            
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gray-800 border-2 border-white/10 group-hover:border-sky-500/50 transition-all">
                  {preview ? (
                    <img src={preview} className="w-full h-full object-cover" alt="Profile" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <IconUser size={48} />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-[-10px] right-[-10px] bg-sky-500 hover:bg-sky-400 p-2 rounded-xl cursor-pointer shadow-lg transition-all">
                  <IconCamera size={20} />
                  <input type="file" className="hidden" onChange={handleImageChange} />
                </label>
              </div>

              <div className="flex-1 space-y-6 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Full Name</label>
                    <div className="relative">
                      <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-sky-500/50 outline-none transition-all"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Email Address</label>
                    <div className="relative">
                      <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input
                        type="email"
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-sky-500/50 outline-none transition-all text-gray-400"
                        value={email}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleUpdateField("profile")}
                  className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-sky-500/20"
                >
                  <IconDeviceFloppy size={20} />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </section>

          {/* Security Section */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <IconLock className="text-yellow-400" />
              Security
            </h2>
            <div className="max-w-md">
              <label className="text-sm font-medium text-gray-400 mb-2 block">New Password</label>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="password"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-sky-500/50 outline-none transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <button
                  onClick={handleChangePassword}
                  className="bg-yellow-600/10 hover:bg-yellow-600/20 text-yellow-500 px-6 py-3 rounded-xl font-semibold border border-yellow-600/20 transition-all"
                >
                  Update Password
                </button>
              </div>
            </div>
          </section>

          {/* Danger Zone Section */}
          <section className="bg-red-500/5 border border-red-500/10 rounded-2xl p-8">
            <h2 className="text-xl font-semibold mb-2 text-red-500 flex items-center gap-2">
              <IconTrash size={24} />
              Danger Zone
            </h2>
            <p className="text-gray-400 mb-6">Once you delete your account, there is no going back. Please be certain.</p>
            
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleLogOut}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-white/5 hover:bg-white/10 text-gray-300 transition-all"
              >
                <IconLogout size={20} />
                <span>Sign Out</span>
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-red-500 hover:bg-red-600 text-white transition-all shadow-lg shadow-red-500/20"
              >
                <IconTrash size={20} />
                <span>Delete Account</span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;

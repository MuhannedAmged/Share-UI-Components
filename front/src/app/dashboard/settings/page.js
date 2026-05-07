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
import { logException } from "@codemirror/view";

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
      window.location.href = "/login";
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
      const data = {
        token: localStorage.getItem("token"),
        name: field === "name" ? name : "",
        email: field === "email" ? email : "",
        image: field === "image" ? imageUrl : "",
      };
      await updateUser(data.token, data.name, data.email, data.image);
      showToast("success", `${field} updated successfully`);
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
      showToast("success", "Image uploaded");
    } catch {
      showToast("error", "Image upload failed");
    } finally {
      setLoadingImage(false);
    }
  };

  const handleChangePassword = async () => {
    if (!password) return showToast("error", "Please enter a password");
    try {
      await changePassword(token, password);
      showToast("success", "Password changed");
      setPassword("");
    } catch {
      showToast("error", "Failed to change password");
    }
  };

  const handleLogOut = async () => {
    localStorage.removeItem("token");
    showToast("success", "Logged out");
    window.location.href = "/";
  };

  const handleDeleteAccount = async () => {
    const confirmed = confirm("Are you sure you want to delete your account?");
    if (!confirmed) return;
    try {
      await deleteAccount(token);
      localStorage.removeItem("token");
      showToast("success", "Account deleted");
      window.location.href = "/";
    } catch {
      showToast("error", "Failed to delete account");
    }
  };

  return (
    <div className="flex min-h-screen">
      <SideBar />
      <Toast status={toast.status} text={toast.text} show={toast.show} />
      <div className="p-6 text-white w-full max-w-2xl mx-auto">
        <h1 className="text-2xl mb-6">Settings</h1>

        <div className="mb-4">
          <label>Name:</label>
          <div className="flex gap-2">
            <input
              type="text"
              className="w-full p-2 bg-gray-800 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              onClick={() => handleUpdateField("name")}
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label>Email:</label>
          <div className="flex gap-2">
            <input
              type="email"
              className="w-full p-2 bg-gray-800 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={() => handleUpdateField("email")}
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label>Profile Image:</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="mb-2 ml-1 border border-sky-400"
          />
          {preview && (
            <img
              src={preview}
              className="w-20 h-20 rounded mb-2 object-cover"
              alt="preview"
            />
          )}
          <button
            onClick={() => handleUpdateField("image")}
            disabled={loadingImage}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            {loadingImage ? "Uploading..." : "Save Image"}
          </button>
        </div>

        <hr className="my-6 border-gray-700" />

        <div className="mb-4">
          <label>New Password:</label>
          <div className="flex gap-2">
            <input
              type="password"
              className="w-full p-2 bg-gray-800 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={handleChangePassword}
              className="bg-yellow-600 px-4 py-2 rounded hover:bg-yellow-700"
            >
              Change
            </button>
          </div>
        </div>

        <hr className="my-6 border-gray-700" />

        <button
          onClick={handleLogOut}
          className="bg-blue-500 mr-2 px-4 py-2 rounded hover:bg-blue-600"
        >
          Log Out
        </button>
        <button
          onClick={handleDeleteAccount}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Settings;

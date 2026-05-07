import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL + "/api/user";

export const updateUser = async (token, name, email, image) => {
  const res = await axios.post(`${API_BASE}/update`, {
    token,
    name,
    email,
    image,
  });
  return res.data;
};

export const changePassword = async (token, password) => {
  const res = await axios.post(`${API_BASE}/change-password`, {
    token,
    password,
  });
  return res.data;
};

export const deleteAccount = async (token) => {
  const res = await axios.post(`${API_BASE}/delete`, {
    token,
  });
  return res.data;
};

export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "frontend_unsigned");

  try {
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dxv6e10cx/image/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return res.data.secure_url;
  } catch (error) {
    console.error(
      "Cloudinary upload error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

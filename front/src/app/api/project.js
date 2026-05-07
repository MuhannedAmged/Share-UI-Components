import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const fetchProjects = async (token) => {
  try {
    const res = await axios.post(`${API_URL}/projects/get`, { token });
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to fetch projects",
      projects: [],
    };
  }
};

export const createProject = async (projectData) => {
  try {
    const res = await axios.post(`${API_URL}/projects/create`, projectData);
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to create project",
    };
  }
};

export const updateProject = async (id, data) => {
  try {
    const res = await axios.put(`${API_URL}/projects/update/${id}`, data);
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to update project",
    };
  }
};

export const deleteProject = async (id, token) => {
  try {
    const res = await axios.delete(`${API_URL}/projects/delete`, {
      data: { id, token },
    });
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to delete project",
    };
  }
};
export const getProjectById = async (id) => {
  try {
    const res = await axios.post(`${API_URL}/projects/${id}`, {
      token: localStorage.getItem("token") ? localStorage.getItem("token") : "",
    });
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to delete project",
    };
  }
};
export const setSaveProject = async (id, token) => {
  try {
    const authToken = token || localStorage.getItem("token") || "";

    const res = await axios.post(`${API_URL}/projects/set-save-project`, {
      id,
      token: authToken,
    });

    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to save project",
    };
  }
};
export const getSaveProject = async (token) => {
  try {
    const authToken = token || localStorage.getItem("token") || "";

    const res = await axios.post(`${API_URL}/projects/get-save-project`, {
      token: authToken,
    });

    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to get save project",
    };
  }
};
export const unSaveProject = async (token, id) => {
  try {
    const authToken = token || localStorage.getItem("token") || "";

    const res = await axios.post(`${API_URL}/projects/unsave-project`, {
      token: authToken,
      id: id,
    });

    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to un save project",
    };
  }
};

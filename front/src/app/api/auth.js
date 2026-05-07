import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const signIn = async (email, password) => {
  try {
    const res = await axios.post(`${API_URL}/auth/sign-in`, {
      email,
      password,
    });

    return {
      success: true,
      message: res.data.message || "Signed in successfully",
      token: res.data.token,
    };
  } catch (err) {
    return {
      success: false,
      message:
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred",
    };
  }
};

export const signUp = async (name, email, password) => {
  try {
    const res = await axios.post("http://localhost:5000/auth/sign-up", {
      name,
      email,
      password,
    });
    return {
      statusCode: res.status,
      success: true,
      message: res.data.message || "Signed up successfully",
    };
  } catch (err) {
    console.error("signUp error:", err);
    return {
      statusCode: err.response?.status || 500,
      success: false,
      message:
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred",
    };
  }
};
export const checkUser = async (token) => {
  try {
    const res = await axios.post(`${API_URL}/api/check`, { token });
    return {
      success: true,
      message: res.data.message,
      user: res.data.user,
    };
  } catch (err) {
    return {
      success: false,
      message:
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred",
    };
  }
};

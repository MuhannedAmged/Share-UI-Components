"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signUp, checkUser } from "@/app/api/auth";
import Toast from "@/app/components/Toast";
import Link from "next/link";

const SignUp = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [statusToast, setStatusToast] = useState("");
  const [textToast, setTextToast] = useState("");

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await checkUser(token);

      if (res.success) {
        router.push("/dashboard");
      } else {
        localStorage.removeItem("token");
      }
    };

    verifyUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signUp(name, email, password);

      if (res.statusCode === 200) {
        router.push("/auth/sign-in");
        setStatusToast("success");
        setTextToast(res.message);
      } else if (res.statusCode >= 400 && res.statusCode < 500) {
        setStatusToast("unknown");
        setTextToast(res.message);
      } else {
        setStatusToast("error");
        setTextToast(res.message);
      }
    } catch (err) {
      console.error(err);

      const errorMessage =
        err?.response?.data?.message ||
        err.message ||
        "An unexpected error occurred.";

      setStatusToast("error");
      setTextToast(errorMessage);
    }

    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="main-shadow w-md p-5">
        <h1 className="text-white text-center text-2xl">Create an account</h1>
        <p className="text-white text-center text-sm my-3">
          Already have an account?{" "}
          <Link className="text-sky-400" href="/auth/sign-in">
            Sign In
          </Link>
        </p>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="text-white">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="my-2 w-full bg-transparent border border-slate-500 rounded-md p-2 text-white"
              required
            />
          </div>
          <div>
            <label className="text-white">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="my-2 w-full bg-transparent border border-slate-500 rounded-md p-2 text-white"
              required
            />
          </div>
          <div>
            <label className="text-white">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="my-2 w-full bg-transparent border border-slate-500 rounded-md p-2 text-white"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full cursor-pointer text-1xl p-2 rounded-md text-white bg-sky-400 transition-all duration-300 hover:bg-sky-500 my-2"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
      <Toast status={statusToast} text={textToast} show={showToast} />
    </div>
  );
};

export default SignUp;

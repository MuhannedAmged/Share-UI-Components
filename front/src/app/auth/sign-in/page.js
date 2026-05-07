"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, checkUser } from "@/app/api/auth";
import Toast from "@/app/components/Toast";
import Link from "next/link";

const SignIn = () => {
  const router = useRouter();

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
      const res = await signIn(email, password);

      if (res.success) {
        setStatusToast("success");
        setTextToast(res.message || "Signed in successfully");
        localStorage.setItem("token", res.token);
        router.push("/dashboard");
      } else {
        setStatusToast("error");
        setTextToast(res.message || "Invalid credentials");
      }
    } catch (err) {
      setStatusToast("error");
      setTextToast(err.message || "Something went wrong");
    }

    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="main-shadow w-full max-w-md mx-4 p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
        <h1 className="text-white text-center text-2xl">Welcome back</h1>
        <p className="text-white text-center text-sm my-3">
          Don't have an account?{" "}
          <Link className="text-sky-400" href="/auth/sign-up">
            Sign Up
          </Link>
        </p>
        <form onSubmit={handleSubmit}>
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
              Sign In
            </button>
          </div>
        </form>
      </div>

      <Toast status={statusToast} text={textToast} show={showToast} />
    </div>
  );
};

export default SignIn;

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { loginUser } from "@/ultis/AuthAPI";
import { LoginResponse } from "@/type/auth";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Logo/title transition effect
  const [showLogo, setShowLogo] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setShowLogo((prev) => !prev);
        setFade(false);
      }, 1200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response: LoginResponse = await loginUser({ email, password });
      if (response.status) {
        toast.success(response.message || "Welcome SuperAdmin!", {
          style: { background: "#000", color: "#fff" },
        });
        localStorage.setItem("token", response.data.token);
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        toast.error(response.message || "Access denied.", {
          style: { background: "#000", color: "#fff" },
        });
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Server error.", {
        style: { background: "#000", color: "#fff" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-black text-white text-center py-6 h-[80px] relative overflow-hidden">
          <div
            className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
            style={{ opacity: showLogo && !fade ? 1 : 0 }}
          >
            <Image
              src="https://res.cloudinary.com/dpbscvwv3/image/upload/v1745103663/71ecf1849f9887a5649c505595aa7586_tn_uxgitg_agcfkg.webp"
              alt="SuperAdmin"
              width={70}
              height={10}
            />
          </div>

          <div
            className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
            style={{ opacity: !showLogo ? 1 : 0 }}
          >
            <h1 className="text-2xl font-semibold">Xin chào ADMIN</h1>
          </div>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 font-semibold uppercase rounded-lg bg-black text-white hover:opacity-90 transition-opacity"
          >
            {loading ? "Đang đăng nhập vô hệ thống..." : "Đăng nhập"}
          </button>
        </form>
        <div className="py-4 text-center text-xs text-gray-500">
          © 2025 SuperAdmin Portal
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

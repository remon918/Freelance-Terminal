"use client";

import { useState } from "react";
import { Input, Button } from "@heroui/react";
import {
  User,
  Mail,
  Image as ImageIcon,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Code,
  Palette,
} from "lucide-react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [role, setRole] = useState("client");

  // 🚀 গুগল সাইন-আপ/লগইন হ্যান্ডলার (রোল মেটাডেটাসহ)
  const handleGoogleSignUp = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/", // লগইন সাকসেস হওয়ার পর হোমপেজে বা ড্যাশবোর্ডে পাঠাবে
        newUserOptions: {
          // গুগলের মাধ্যমে নতুন অ্যাকাউন্ট তৈরি হলে এই রোলটি ডেটাবেজে জমা হবে
          data: {
            role: role,
          }
        }
      });
    } catch (error) {
      console.error("Google Auth Error:", error);
      toast.error("Google Authentication Failed");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setPasswordError("");

    const isLengthValid = password.length >= 6;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);

    if (!isLengthValid || !hasLowercase || !hasUppercase) {
      setPasswordError(
        "Password must be at least 6 characters long and contain at least one uppercase letter and one lowercase letter."
      );
      return;
    }

    const formData = new FormData(e.currentTarget);
    const baseData = Object.fromEntries(formData.entries());

    const payload = {
      name: baseData.name,
      email: baseData.email,
      password: baseData.password,
      image: baseData.image,

      role,

      skills:
        role === "freelancer"
          ? baseData.skills
          : undefined,

      bio:
        role === "freelancer"
          ? baseData.bio
          : undefined,

      hourlyRate:
        role === "freelancer" && baseData.hourlyRate
          ? Number(baseData.hourlyRate)
          : undefined,
    };

    console.log("SIGNUP PAYLOAD:", payload);

    const { data, error } = await authClient.signUp.email(payload);

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
      toast.error(error.message || "Signup Failed");
      return;
    }

    toast.success("Signup Successful!");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen pb-12">
      <div className="mb-4 mt-5 ml-2 md:ml-50 lg:ml-100 flex justify-start">
        <Link href="/">
          <Button
            variant="light"
            size="sm"
            className="flex items-center gap-2 font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-center px-3">
        <div className="w-full max-w-lg rounded-md border border-gray-200 shadow-md">
          <div className="p-5 md:p-6">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold">Create Account</h1>
              <p className="text-sm text-gray-500 mt-1">
                Fill in the details below to Get Started
              </p>
            </div>

            <form
              onSubmit={handleSignUp}
              className="border-t border-gray-200 pt-5 space-y-5"
            >
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-1.5">
                  <User size={16} />
                  Name
                </label>
                <div className="w-full border-2 border-gray-300 rounded-md">
                  <Input
                    id="name"
                    required
                    placeholder="Enter your name"
                    radius="sm"
                    size="md"
                    className="w-full"
                    name="name"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-1.5">
                  <ImageIcon size={16} />
                  Image URL
                </label>
                <div className="w-full border-2 border-gray-300 rounded-md">
                  <Input
                    id="image"
                    required
                    placeholder="https://example.com/avatar.png"
                    radius="sm"
                    size="md"
                    className="w-full"
                    name="image"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-1.5">
                  <Mail size={16} />
                  Email
                </label>
                <div className="w-full border-2 border-gray-300 rounded-md">
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full"
                    id="email"
                    name="email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-1.5">
                  <Lock size={16} />
                  Password
                </label>
                <div className="relative w-full border-2 border-gray-300 rounded-md">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    radius="sm"
                    size="md"
                    className="w-full"
                    id="password"
                    name="password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError("");
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {passwordError && (
                  <p className="mt-2 text-sm text-red-500 font-medium">
                    {passwordError}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold block">
                  I want to join as a:
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    onClick={() => setRole("client")}
                    className={`relative cursor-pointer rounded-2xl border-2 p-5 text-center flex flex-col items-center justify-center transition-all duration-300 ${
                      role === "client"
                        ? "border-teal-400 bg-amber-50/20 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {role === "client" && (
                      <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 rounded-full bg-teal-500 border-2 border-white shadow-sm" />
                    )}
                    <div
                      className={`p-3 rounded-2xl mb-2 transition-colors ${role === "client" ? "bg-teal-100/50 text-teal-400" : "bg-teal-100 text-gray-500"}`}
                    >
                      <User size={24} />
                    </div>
                    <h3
                      className={`font-bold text-lg ${role === "client" ? "text-teal-400" : ""}`}
                    >
                      Client
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Hire talent</p>
                  </div>

                  <div
                    onClick={() => setRole("freelancer")}
                    className={`relative cursor-pointer rounded-2xl border-2 p-5 text-center flex flex-col items-center justify-center transition-all duration-300 ${
                      role === "freelancer"
                        ? "border-emerald-500 bg-emerald-50/20 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {role === "freelancer" && (
                      <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                    )}
                    <div
                      className={`p-3 rounded-2xl mb-2 transition-colors ${role === "freelancer" ? "bg-teal-100/30 text-emerald-400" : "bg-gray-100 text-gray-500"}`}
                    >
                      <Code size={24} />
                    </div>
                    <h3
                      className={`font-bold text-lg ${role === "freelancer" ? "text-emerald-400" : ""}`}
                    >
                      Freelancer
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Find work</p>
                  </div>
                </div>
              </div>

              {role === "freelancer" && (
                <div className="p-4 border border-teal-500/90 rounded-xl bg-emerald-50/5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-2 text-emerald-500 font-semibold text-sm border-b border-gray-100/10 pb-2">
                    <Palette size={16} />
                    Freelancer Profile
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Skills{" "}
                      <span className="text-gray-500 font-normal">
                        (comma-separated)
                      </span>
                    </label>
                    <div className="w-full border-2 border-gray-300 rounded-md">
                      <Input
                        id="skills"
                        name="skills"
                        required
                        placeholder="React, Node.js, Design"
                        radius="sm"
                        size="md"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Bio
                    </label>
                    <div className="w-full border-2 border-gray-300 rounded-md">
                      <Input
                        id="bio"
                        name="bio"
                        required
                        placeholder="Tell clients about yourself..."
                        radius="sm"
                        className="w-full"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Hourly Rate (USD){" "}
                      <span className="text-gray-500 font-normal">
                        optional
                      </span>
                    </label>
                    <div className="w-full border-2 border-gray-300 rounded-md">
                      <Input
                        type="number"
                        id="hourlyRate"
                        name="hourlyRate"
                        placeholder="50"
                        radius="sm"
                        size="md"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold bg-linear-to-r from-teal-500 to-teal-400 hover:bg-linear-to-r hover:from-teal-400 hover:to-teal-500 text-white rounded-lg hover:scale-101 duration-300"
                radius="sm"
              >
                Register
              </Button>

              <Button
                onClick={handleGoogleSignUp}
                type="button"
                variant="bordered"
                radius="sm"
                className="w-full h-11 font-medium border-2 border-gray-300 rounded-lg hover:scale-101 duration-300"
              >
                <FcGoogle />
                Continue With Google
              </Button>

              <p className="text-sm text-center pt-1">
                Already have an account?{" "}
                <span className="text-red-500 underline cursor-pointer">
                  <Link href={"/login"}>Login</Link>
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
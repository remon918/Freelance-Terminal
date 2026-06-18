"use client";

import { useState } from "react";
import { Card, Input, Button } from "@heroui/react";
import {
  User,
  Mail,
  Image as ImageIcon,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const SignupPage = () => {
  const handleGoogleSignUp = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const signUpData = Object.fromEntries(formData.entries());
    const { data, error } = await authClient.signUp.email({
      ...signUpData,
    });

    if (!error) {
      toast.success("Signup Successful! Redirecting...");
      window.location.href = "/";
    }
    if (error) {
      toast.error(error.message || "Signup Failed");
      return;
    }
  };

  const passwordRules = [
    {
      label: "At least 8 characters",
      valid: password.length >= 8,
    },
    {
      label: "At least 1 number",
      valid: /\d/.test(password),
    },
    {
      label: "At least 1 lowercase letter",
      valid: /[a-z]/.test(password),
    },
    {
      label: "At least 1 uppercase letter",
      valid: /[A-Z]/.test(password),
    },
  ];

  return (
    <div className="flex items-center justify-center px-3 py-6">
      <div className="w-full max-w-lg rounded-md border border-gray-200 shadow-md">
        <div className="p-5 md:p-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold">
              Create Account
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Fill in the details below to Get Started
            </p>
          </div>

          <form
            onSubmit={handleSignUp}
            className="border-t border-gray-200 pt-5 space-y-4"
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
                  radius="sm"
                  size="md"
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
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="mt-4 border-t border-gray-200 pt-3">
                <h3 className="text-sm font-medium  mb-2">
                  Enter a password. Must contain:
                </h3>

                <div className="space-y-1.5">
                  {passwordRules.map((rule, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 text-sm ${
                        rule.valid ? "text-green-600" : ""
                      }`}
                    >
                      <span className="text-lg leading-none">
                        {rule.valid ? "✓" : "×"}
                      </span>

                      <span>{rule.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

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
  );
};

export default SignupPage;

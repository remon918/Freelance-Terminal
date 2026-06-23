"use client";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { FaGoogle, FaPaypal, FaArrowRight } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { SiMeta, SiNetflix, SiPayoneer } from "react-icons/si";

const Banner = () => {
  const { data: session } = authClient.useSession();

  const categories = [
    "Website Development",
    "Architecture & Interior Design",
    "UGC Videos",
    "Video Editing",
    "Graphic Design",
    "Digital Marketing",
  ];

  return (
    <section className="relative overflow-hidden py-10 md:py-12">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="bg-grid-pattern absolute inset-0 opacity-30" />

        <div className="absolute left-0 top-0 h-112.5 w-112.5 rounded-full bg-primary/20 blur-[120px] banner-blob" />

        <div
          className="absolute bottom-0 right-0 h-112.5 w-112.5 rounded-full bg-secondary/20 blur-[120px] banner-blob"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative mx-auto w-[95%] lg:w-[76%]">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div
            className="md:mt-3 mb-3 rounded-full border border-base-300 bg-base-100/50 px-4 py-2 text-sm font-medium backdrop-blur banner-in"
            style={{ animationDelay: "0ms" }}
          >
            🚀 Best Freelance Marketplace
          </div>

          {/* Heading */}
          <h1
            className="max-w-5xl text-4xl font-extrabold leading-tight md:text-6xl lg:text-7xl banner-in"
            style={{ animationDelay: "80ms" }}
          >
            Hire Top Freelancers
            <br />
            For Every Project
          </h1>

          {/* Description */}
          <p
            className="mt-6 max-w-2xl text-base leading-7 text-base-content/70 md:text-lg banner-in"
            style={{ animationDelay: "160ms" }}
          >
            Discover talented freelancers, post tasks, and collaborate
            seamlessly on a platform built for modern work. From web development
            to creative services, find the right expert for every project.
          </p>

          {/* Buttons based on user roles */}
          <div
            className="mt-5 flex flex-wrap justify-center gap-4 banner-in"
            style={{ animationDelay: "240ms" }}
          >
            {/* 1. Client Role Buttons */}
            {session?.user && session.user.role === "client" && (
              <>
                <Link
                  href="/client/tasks/post-task"
                  className="btn btn-primary border px-5 py-2 rounded-md btn-md md:btn-lg transition-all
                  duration-300 hover:-translate-y-1 hover:border-primary/40
                  hover:shadow-xl font-semibold bg-cyan-400 hover:bg-teal-400 flex items-center gap-2"
                >
                  Post a Task
                  <FiExternalLink />
                </Link>

                <Link
                  href="/client/tasks"
                  className="btn btn-outline border px-5 py-2 rounded btn-md md:btn-lg 
                  transition-all duration-300 hover:-translate-y-1 hover:border-primary/40
                  hover:shadow-xl font-semibold flex items-center gap-2"
                >
                  My Tasks
                  <FiExternalLink />
                </Link>
              </>
            )}

            {/* 2. Freelancer Role Buttons */}
            {session?.user && session.user.role === "freelancer" && (
              <>
                <Link
                  href="/browse-task"
                  className="btn btn-primary border px-5 py-2 rounded-md btn-md md:btn-lg transition-all
                  duration-300 hover:-translate-y-1 hover:border-primary/40
                  hover:shadow-xl font-semibold bg-cyan-400 hover:bg-teal-400 flex items-center gap-2"
                >
                  Browse Tasks
                  <FiExternalLink />
                </Link>

                <Link
                  href="/freelancer/profile"
                  className="btn btn-outline border px-5 py-2 rounded btn-md md:btn-lg 
                  transition-all duration-300 hover:-translate-y-1 hover:border-primary/40
                  hover:shadow-xl font-semibold flex items-center gap-2"
                >
                  Profile Preview
                  <FiExternalLink />
                </Link>
              </>
            )}

            {/* 🔥 3. Guest (No User) OR Admin Role Buttons */}
            {(!session?.user || session.user.role === "admin") && (
              <>
                <Link
                  href="/browse-task"
                  className="btn btn-primary border px-5 py-2 rounded-md btn-md md:btn-lg transition-all
                  duration-300 hover:-translate-y-1 hover:border-primary/40
                  hover:shadow-xl font-semibold bg-cyan-400 hover:bg-teal-400 flex items-center gap-2"
                >
                  Browse Tasks
                  <FiExternalLink />
                </Link>

                <Link
                  href="/browse-freelancer"
                  className="btn btn-outline border px-5 py-2 rounded btn-md md:btn-lg 
                  transition-all duration-300 hover:-translate-y-1 hover:border-primary/40
                  hover:shadow-xl font-semibold flex items-center gap-2"
                >
                  Browse Freelancers
                  <FiExternalLink />
                </Link>
              </>
            )}
          </div>

          {/* Categories */}
          <div className="mt-18 flex flex-wrap justify-center gap-2 md:gap-4">
            {categories.map((item, index) => (
              <div
                key={item}
                className="banner-in"
                style={{ animationDelay: `${320 + index * 50}ms` }}
              >
                <div
                  className="
                    group
                    flex
                    items-center
                    gap-2
                    rounded-2xl
                    border
                    border-base-300
                    bg-base-100/40 px-2
                    py-1.5
                    md:px-5
                    md:py-4
                    cursor-pointer
                    md:font-medium
                    text-xs
                    md:text-md
                    backdrop-blur-md
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-primary/40
                    hover:shadow-md
                  "
                >
                  <span>{item}</span>

                  <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>

          {/* Trusted By */}
          <div
            className="mt-8 w-full max-w-5xl banner-in"
            style={{ animationDelay: "640ms" }}
          >
            <div className="mb-4 flex items-center justify-center gap-4">
              <div className="h-px flex-1 bg-base-300" />

              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-base-content/50">
                Trusted By Industry Leaders
              </p>

              <div className="h-px flex-1 bg-base-300" />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-16">
              <div className="flex items-center gap-2 text-base-content/60 transition hover:text-base-content">
                <FaGoogle className="text-xl" />
                <span className="font-semibold">Google</span>
              </div>

              <div className="flex items-center gap-2 text-base-content/60 transition hover:text-base-content">
                <SiMeta className="text-xl" />
                <span className="font-semibold">Meta</span>
              </div>

              <div className="flex items-center gap-2 text-base-content/60 transition hover:text-base-content">
                <SiNetflix className="text-lg" />
                <span className="font-semibold">Netflix</span>
              </div>

              <div className="flex items-center gap-2 text-base-content/60 transition hover:text-base-content">
                <FaPaypal className="text-xl" />
                <span className="font-semibold">PayPal</span>
              </div>

              <div className="flex items-center gap-2 text-base-content/60 transition hover:text-base-content">
                <SiPayoneer className="text-xl" />
                <span className="font-semibold">Payoneer</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bannerFadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bannerGlow {
          0%, 100% {
            opacity: 0.55;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.1);
          }
        }

        .banner-in {
          opacity: 0;
          animation: bannerFadeUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .banner-blob {
          animation: bannerGlow 7s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .banner-in {
            animation: none;
            opacity: 1;
          }
          .banner-blob {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
};

export default Banner;
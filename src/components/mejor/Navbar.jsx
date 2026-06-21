"use client";

import Image from "next/image";
import Link from "next/link";
import DropDownMenu from "../minor/DropDownMenu";
import NavLink from "../minor/NavLink";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

import avatar from "@/assets/user.png";

const Navbar = () => {
  const { data: session, isPending } = authClient.useSession();

  const userImage =
    typeof session?.user?.image === "string" &&
    session.user.image.startsWith("http")
      ? session.user.image
      : avatar;

  const menus = session?.user
    ? [
        { name: "Home", href: "/" },
        {
          name: "Dashboard",
          href: session.user.role === "freelancer" ? "/freelancer" : "/client",
        },
        {
          name: "Browse Tasks",
          href: "/browse-task",
        },
        {
          name: "Browse Freelancers",
          href: "/browse-freelancer",
        },
      ]
    : [
        { name: "Home", href: "/" },
        { name: "Browse Tasks", href: "/browse-task" },
        { name: "Browse Freelancers", href: "/browse-freelancer" },
      ];

  const handleLogout = async () => {
    const { error } = await authClient.signOut();

    if (!error) {
      toast.success("Logged out successfully");
      window.location.href = "/";
    }
    if (error) {
      toast.error(error.message || "Logout Failed");
    }
  };

  return (
    // header থেকে অতিরিক্ত py-3 বাদ দিয়ে শুধুমাত্র sticky/z-index এর জন্য রাখা হয়েছে
    <header className="z-50 py-2">
      <nav className="mx-auto flex w-[95%] items-center justify-between rounded-2xl border border-gray-500/50 px-3 py-2.5 shadow-md lg:w-[76%]">
        {/* Left */}
        <div className="flex items-center gap-2">
          {/* Mobile Menu */}
          <div className="block md:hidden">
            <DropDownMenu menus={menus} />
          </div>

          {/* এখানে mb-6 এবং mt-8 বাদ দেওয়া হয়েছে, ফলে হাইট স্বাভাবিক থাকবে */}
          <Link href="/" className="flex items-center gap-3">
            {/* Desktop Logo */}
            <div className="hidden h-9 w-9 items-center justify-center rounded-xl shadow-[0_0_20px_rgba(34,211,238,.25)] md:flex">
              <span className="text-xl font-bold text-cyan-400">F</span>
            </div>

            <div className="leading-tight">
              <h2 className="text-base font-bold md:text-lg">
                Freelance<span className="text-cyan-400">Terminal</span>
              </h2>
              <p className="text-[9px] md:text-[10px]">Freelance Marketplace</p>
            </div>
          </Link>
        </div>

        {/* Center */}
        <ul className="hidden lg:flex items-center gap-8">
          {menus.map((menu) => (
            <li key={menu.href}>
              <NavLink href={menu.href}>
                <span className="font-medium text-sm transition-colors hover:text-primary">
                  {menu.name}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right */}
        <div className="flex items-center gap-2">
          {isPending ? (
            <div className="h-8 w-20 animate-pulse rounded-xl bg-base-200" />
          ) : session?.user ? (
            <>
              <Link href="/profile" className="flex items-center">
                <Image
                  src={userImage}
                  alt="User"
                  width={32}
                  height={32}
                  className="rounded-full border border-base-300 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = avatar.src || avatar;
                  }}
                />
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-gray-500/50 px-3 py-1.5 text-xs md:text-sm cursor-pointer font-medium transition hover:bg-gray-500/30"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl border border-transparent bg-primary px-3 py-1.5 text-sm font-semibold text-primary-content transition hover:opacity-70"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="rounded-xl border border-transparent bg-primary px-3 py-1.5 text-sm font-semibold text-primary-content transition hover:opacity-70"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
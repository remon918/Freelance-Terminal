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
    <header className=" z-50 py-3">
      <nav className="mx-auto flex w-[95%] items-center justify-between rounded-2xl border border-base-300 px-2 md:px-4 py-3 shadow-md  lg:w-[76%]">
        {/* Left */}
        <div className="flex items-center gap-1">
          <DropDownMenu menus={menus} />

          <Link href={"/"}>
            <h2 className="text-lg font-bold leading-none">
              Freelance
              <span className="text-cyan-400">Terminal</span>
            </h2>

            <p className="mt-1 text-[10px]">Freelance Marketplace</p>
          </Link>
        </div>

        {/* Center */}
        <ul className="hidden lg:flex items-center gap-12">
          {menus.map((menu) => (
            <li key={menu.href}>
              <NavLink href={menu.href}>
                <span className="font-medium transition-colors hover:text-primary">
                  {menu.name}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right */}
        <div className="flex items-center">
          {isPending ? (
            <div className="h-9 w-24 animate-pulse rounded-xl bg-base-200" />
          ) : session?.user ? (
            <>
              <Link href="/profile">
                <Image
                  src={userImage} // 👈 এখানে পরিবর্তন করা হয়েছে
                  alt="User"
                  width={35}
                  height={35}
                  className="rounded-full border border-base-300 md:mr-2 object-cover"
                  // 👈 কোনো কারণে ইমেজ লিংক ব্রোকেন বা ইনভ্যালিড হলে নিচের ফলব্যাকটি কাজ করবে
                  onError={(e) => {
                    e.currentTarget.src = avatar.src || avatar;
                  }}
                />
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl md:border border-base-300 px-3 py-2 text-sm cursor-pointer font-medium transition hover:bg-base-200 md:mr-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl md:border bg-primary px-2 py-2 text-md font-semibold text-primary-content transition hover:opacity-70 md:mr-2"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="rounded-xl md:border bg-primary px-2 py-2 text-md font-semibold text-primary-content transition hover:opacity-70"
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

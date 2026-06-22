"use client";
import avatar from "@/assets/user.png";
import Image from "next/image";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutGrid,
  ClipboardList,
  PlusCircle,
  FileText,
  Wallet,
  ChevronRight,
  Menu,
  X,
  Search,
  BriefcaseBusiness,
  DollarSign,
  UserRoundPen,
  Users,
  Briefcase,
  LogOut, // 👈 Logout আইকন ইমপোর্ট করা হলো
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

export default function Sidebar() {
  const { data: session, isPending } = authClient.useSession();

  const clientLinks = [
    {
      name: "Overview",
      icon: LayoutGrid,
      href: "/client",
    },
    {
      name: "My Tasks",
      icon: ClipboardList,
      href: "/client/tasks",
    },
    {
      name: "Post Task",
      icon: PlusCircle,
      href: "/client/tasks/post-task",
    },
    {
      name: "Proposals",
      icon: FileText,
      href: "/client/proposals",
    },
    {
      name: "Payments",
      icon: Wallet,
      href: "/client/payments",
    },
  ];

  const freelancerLinks = [
    {
      name: "Overview",
      icon: LayoutGrid,
      href: "/freelancer",
    },
    {
      name: "Profile Preview",
      icon: UserRoundPen,
      href: "/freelancer/profile",
    },
    {
      name: "Browse Tasks",
      icon: Search,
      href: "/browse-task",
    },
    {
      name: "My Proposals",
      icon: FileText,
      href: "/freelancer/my-proposals",
    },
    {
      name: "Active Projects",
      icon: BriefcaseBusiness,
      href: "/freelancer/active-projects",
    },
    {
      name: "Earnings",
      icon: DollarSign,
      href: "/freelancer/earnings",
    },
  ];

  const adminLinks = [
    {
      name: "Overview",
      icon: LayoutGrid,
      href: "/admin",
    },
    {
      name: "Users",
      icon: Users,
      href: "/admin/users",
    },
    {
      name: "Tasks",
      icon: Briefcase,
      href: "/admin/tasks",
    },
    {
      name: "Payments",
      icon: DollarSign,
      href: "/admin/payments",
    },
  ];

  const linksMap = {
    client: clientLinks,
    freelancer: freelancerLinks,
    admin: adminLinks,
  };

  const role = session?.user?.role || "client";

  const menuItems = linksMap[role] || clientLinks;

  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // ⚡ লগআউট ফাংশন
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/"; // লগআউট সফল হলে হোম পেজে রিডাইরেক্ট করবে
        },
      },
    });
  };

  return (
    <>
      {/* Mobile Header */}
      {!isOpen && (
        <div className="fixed left-4 top-3 z-50 flex items-center gap-3 md:hidden">
          <button
            onClick={() => setIsOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-500/20 shadow-lg"
          >
            {" "}
            <Menu size={20} className="text-cyan-400" />{" "}
          </button>
          <Link href={"/"}>
            <h2 className="text-lg font-bold leading-none">
              Freelance
              <span className="text-cyan-400">Terminal</span>
            </h2>

            <p className="mt-1 text-[10px]">Freelance Marketplace</p>
          </Link>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 backdrop-blur-md md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
      fixed left-0 top-0 z-50 flex h-screen w-65 flex-col
      border-r border-cyan-400/20
      
      p-4
      transition-transform duration-300

      ${isOpen ? "translate-x-0" : "-translate-x-full"}

      md:static
      md:translate-x-0
    `}
      >
        {/* Mobile Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 text-slate-500 hover:text-cyan-400 md:hidden"
        >
          <X size={20} />
        </button>

        {/* Logo */}
        <Link href="/" className="mb-6 mt-8 flex items-center gap-3 md:mt-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl shadow-[0_0_20px_rgba(34,211,238,.25)]">
            <span className="text-2xl font-bold text-cyan-400">F</span>
          </div>

          <div className="">
            <h2 className="text-lg font-bold leading-none">
              Freelance
              <span className="text-cyan-400">Terminal</span>
            </h2>

            <p className="mt-1 text-[10px]">Freelance Marketplace</p>
          </div>
          
        </Link>

        {/* Menu */}
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center justify-between rounded-xl px-3 py-2.5 transition-all duration-300 ${
                  isActive
                    ? "border border-cyan-400/20 "
                    : "hover:bg-white/5 hover:text-cyan-400"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
                      isActive
                        ? "bg-cyan-500/15 text-cyan-500"
                        : "   group-hover:bg-cyan-500/10 group-hover:text-cyan-400"
                    }`}
                  >
                    <Icon size={18} />
                  </div>

                  <span
                    className={`text-sm font-medium ${
                      isActive ? "text-cyan-400" : ""
                    }`}
                  >
                    {item.name}
                  </span>
                </div>

                <ChevronRight
                  size={16}
                  className={`transition-all ${
                    isActive ? "text-cyan-400" : " group-hover:text-cyan-400"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="mt-auto space-y-3">
          <div className="rounded-xl border border-cyan-500/10 bg-white/5 p-3 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
                📈
              </div>

              <div>
                <h4 className="text-sm font-semibold">Stay Productive!</h4>

                <p className="text-xs text-slate-400">
                  You have some task left
                </p>
              </div>
            </div>
          </div>

          {/* User Profile & Logout Wrapper */}
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-2.5 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <Image
                src={
                  session?.user?.image?.startsWith("https")
                    ? session.user.image
                    : avatar
                }
                alt="profile"
                width={40}
                height={40}
                className="rounded-full border border-cyan-400 object-cover"
              />

              <div>
                <h4 className="text-sm font-semibold truncate max-w-[110px]">
                  {session?.user?.name}
                </h4>

                <p className="text-[11px] text-cyan-400 font-semibold capitalize">
                  {session?.user?.role}
                </p>
              </div>
            </div>

            {/* 🚪 Logout Button */}
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-white/5 rounded-lg transition-all"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
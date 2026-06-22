"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import avatar from "@/assets/user.png";
import { Search, ShieldAlert, ShieldCheck, Loader2 } from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // এনভায়রনমেন্ট ভেরিয়েবল থেকে বেজ ইউআরএল নেওয়া
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // ১. ভিএস কোডের এররটি ফিক্স করতে useEffect এর ভেতর প্রপার অ্যাসিনক্রোনাস হ্যান্ডলিং
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const res = await fetch(`${API_URL}/api/admin/users`);
        const data = await res.json();
        if (data.success && isMounted) {
          setUsers(data.users);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [API_URL]);

  // ২. স্ট্যাটাস টগল (Block/Unblock) করার ফাংশন
  const handleToggleStatus = async (userId, currentStatus) => {
    const updatedStatus = currentStatus === "Blocked" ? "Active" : "Blocked";

    try {
      const res = await fetch(`${API_URL}/api/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: updatedStatus }),
      });

      const data = await res.json();
      if (data.success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, status: updatedStatus } : user
          )
        );
      }
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  };

  // ৩. সার্চ এবং রোল ফিল্টারিং লজিক
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      roleFilter === "all" ? true : user.role?.toLowerCase() === roleFilter.toLowerCase();

    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loader2 className="animate-spin text-cyan-500" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen text-inherit">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-inherit">User Management</h1>
        <p className="text-sm opacity-60">{users.length} total users</p>
      </div>

      {/* Search and Filters */}
      {/* Search and Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-current/10 bg-current/5 py-2 pl-10 pr-4 text-sm outline-none transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-inherit placeholder:opacity-40"
          />
        </div>

        {/* ক্যাটাগরি ড্রপডাউন ফিক্স */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-lg border border-current/10 bg-current/5 px-4 py-2 text-sm outline-none transition-all focus:border-cyan-500 text-inherit dark:bg-[#0f172a]"
        >
          <option value="all" className="text-inherit dark:text-white dark:bg-[#0f172a]">All Roles</option>
          <option value="admin" className="text-inherit dark:text-white dark:bg-[#0f172a]">Admin</option>
          <option value="client" className="text-inherit dark:text-white dark:bg-[#0f172a]">Client</option>
          <option value="freelancer" className="text-inherit dark:text-white dark:bg-[#0f172a]">Freelancer</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-xl border border-current/10 bg-current/5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-current/10 bg-current/5 text-xs font-semibold uppercase opacity-70">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-current/5 text-sm">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center opacity-40">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const userStatus = user.status || "Active";
                  const isBlocked = userStatus === "Blocked";

                  const joinedDate = user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Jun 22, 2026";

                  return (
                    <tr key={user._id} className="hover:bg-current/5 transition-colors">
                      {/* User Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Image
                            src={user.image && user.image.startsWith("http") ? user.image : avatar}
                            alt={user.name || "user"}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full border border-current/10 object-cover"
                          />
                          <div>
                            <div className="font-semibold text-inherit">{user.name || "N/A"}</div>
                            <div className="text-xs opacity-50">{user.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full border border-current/10 bg-current/5 px-2.5 py-0.5 text-xs font-medium capitalize opacity-90">
                          {user.role || "Client"}
                        </span>
                      </td>

                      {/* Status Tag - শুধুমাত্র গ্রিন এবং রোজ কালার ব্যবহার করা হয়েছে */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                            isBlocked
                              ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                              : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          }`}
                        >
                          {userStatus}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="px-6 py-4 opacity-70">{joinedDate}</td>

                      {/* Action Button - রিকোয়ারমেন্ট অনুযায়ী আইকন ও পারফেক্ট টগল কালার */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleToggleStatus(user._id, userStatus)}
                          className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:opacity-80 ${
                            isBlocked ? "text-emerald-500" : "text-rose-500"
                          }`}
                        >
                          {isBlocked ? (
                            <>
                              <ShieldCheck size={16} />
                              Unblock
                            </>
                          ) : (
                            <>
                              <ShieldAlert size={16} />
                              Block
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
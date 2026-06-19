import Link from "next/link";
import {
  BriefcaseBusiness,
  Clock3,
  CheckCircle2,
  Wallet,
  PlusCircle,
} from "lucide-react";

const stats = [
  {
    title: "All Tasks",
    value: 0,
    description: "All created tasks",
    icon: BriefcaseBusiness,
  },
  {
    title: "Open Tasks",
    value: 0,
    description: "Tasks currently open",
    icon: Clock3,
  },
  {
    title: "In Progress",
    value: 0,
    description: "Tasks in progress",
    icon: CheckCircle2,
  },
  {
    title: "Total Spent",
    value: "$0",
    description: "Overall spending",
    icon: Wallet,
  },
];

export default function ClientDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            Client Dashboard
          </h1>

          <p className="mt-2 opacity-70">
            Track projects and collaborate with top freelancers.
          </p>
        </div>

        <Link
          href="/client/tasks/post-task"
          className="btn border-0 bg-teal-500 text-white hover:bg-teal-600 rounded-md flex items-center gap-2 px-5 py-3 font-medium transition"
        >
          <PlusCircle size={18} />
          Create Project
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="
                rounded-[30px]
                border
                p-7
                transition-all
                duration-300
                hover:border-teal-400/40
                hover:shadow-[0_0_35px_rgba(45,212,191,0.15)]
              "
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">
                    {item.title}
                  </h3>

                  <h2 className="mt-4 text-5xl font-bold">
                    {item.value}
                  </h2>
                </div>

                <div
                  className="
                    flex h-16 w-16 items-center justify-center
                    rounded-3xl
                    border border-teal-400/20
                    text-teal-400
                  "
                >
                  <Icon size={30} />
                </div>
              </div>

              <p className="mt-5 opacity-70">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Projects */}
      <div
        className="
          rounded-[30px]
          border
          p-8
          transition-all
          duration-300
          hover:border-teal-400/40
          hover:shadow-[0_0_35px_rgba(45,212,191,0.15)]
        "
      >
        <h2 className="text-2xl font-semibold">
          Recent Projects
        </h2>

        <p className="mt-2 opacity-70">
          Your latest posted tasks and project activities will appear here.
        </p>
      </div>
    </div>
  );
}
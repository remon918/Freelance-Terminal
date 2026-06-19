import {
  FileText,
  Clock3,
  CheckCircle2,
  DollarSign,
  Search,
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    title: "Total Proposals",
    value: 0,
    description: "Proposals submitted",
    icon: FileText,
  },
  {
    title: "Pending",
    value: 0,
    description: "Awaiting response",
    icon: Clock3,
  },
  {
    title: "Accepted",
    value: 0,
    description: "Proposals accepted",
    icon: CheckCircle2,
  },
  {
    title: "Total Earned",
    value: "$0",
    description: "From completed tasks",
    icon: DollarSign,
  },
];

const FreelancerDashboard = () => {
  return (
    <div className="space-y-8 mt-10 md:mt-0">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            Freelancer Dashboard
          </h1>

          <p className="mt-2 opacity-70">
            Track your proposals and earnings
          </p>
        </div>

        <Link
          href="/browse-task"
          className="btn border-0 bg-teal-500 rounded-md hover:bg-teal-600 text-white flex items-center gap-2 px-5 py-3 font-medium transition"
        >
          <Search size={18} />
          Browse Tasks
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="
                rounded-3xl
                border
                p-6
                transition-all
                duration-300
                hover:border-teal-400/40
                hover:shadow-[0_0_30px_rgba(45,212,191,0.15)]
              "
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold opacity-70">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-5xl font-bold">
                    {item.value}
                  </p>
                </div>

                <div
                  className="
                    flex h-14 w-14 items-center justify-center
                    rounded-2xl
                    border border-teal-400/20
                    text-teal-400
                  "
                >
                  <Icon size={26} />
                </div>
              </div>

              <p className="mt-5 opacity-60">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Placeholder */}
      <div
        className="
          rounded-3xl
          border
          p-8
          transition-all
          duration-300
          hover:border-teal-400/40
          hover:shadow-[0_0_30px_rgba(45,212,191,0.15)]
        "
      >
        <h2 className="text-2xl font-semibold">
          Recent Activity
        </h2>

        <p className="mt-2 opacity-70">
          Your latest proposals and project updates will appear here.
        </p>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
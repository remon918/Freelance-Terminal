import {
  Briefcase,
  Clock3,
  CheckCircle2,
  Wallet,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";

export default function ClientDashboard() {
  const stats = [
    {
      title: "All Task",
      value: "12",
      description: "All Created Tasks",
      icon: Briefcase,
    },
    {
      title: "Opened Task",
      value: "4",
      description: "Tasks that are currently open",
      icon: Clock3,
    },
    {
      title: "In Progress",
      value: "28",
      description: "Tasks in progress",
      icon: CheckCircle2,
    },
    {
      title: "Total Investment",
      value: "$2,450",
      description: "Overall spending",
      icon: Wallet,
    },
  ];

  return (
    <section className="space-y-8 mt-8 md:block">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Client Dashboard
          </h1>

          <p className="mt-1 text-muted-foreground">
            Track projects and collaborate with top freelancers.
          </p>
        </div>

        <Link href="/client/tasks/post-task" className="flex items-center gap-2 rounded-xl bg-teal-800 px-5 py-3 font-medium text-white transition hover:bg-teal-600">
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
              className="rounded-3xl border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-muted-foreground text-lg font-medium">
                    {item.title}
                  </h3>

                  <h2 className="mt-3 text-5xl font-bold">
                    {item.value}
                  </h2>

                  <p className="mt-4 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-500/10">
                  <Icon
                    size={26}
                    className="text-amber-600"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity + Quick Actions */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-3xl border bg-card p-6 lg:col-span-2">
          <h3 className="mb-5 text-xl font-semibold">
            Recent Activities
          </h3>

          <div className="space-y-4">
            {[
              "UI/UX Design Project received 8 proposals",
              "Mobile App Task marked as completed",
              "Payment released to freelancer",
              "Backend API Project published",
            ].map((activity) => (
              <div
                key={activity}
                className="rounded-xl border p-4"
              >
                {activity}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border bg-card p-6">
          <h3 className="mb-5 text-xl font-semibold">
            Quick Actions
          </h3>

          <div className="space-y-3">
            <button className="w-full rounded-xl border p-3 text-left transition hover:bg-muted">
              Post a New Project
            </button>

            <button className="w-full rounded-xl border p-3 text-left transition hover:bg-muted">
              Review Proposals
            </button>

            <button className="w-full rounded-xl border p-3 text-left transition hover:bg-muted">
              Manage Payments
            </button>

            <button className="w-full rounded-xl border p-3 text-left transition hover:bg-muted">
              View Contracts
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
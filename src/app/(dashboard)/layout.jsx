import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/mejor/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="">
        <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
    </div>
  );
}
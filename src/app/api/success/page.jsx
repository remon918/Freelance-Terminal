import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";
import { payment } from "@/lib/actions/payment";

export default async function SuccessPage({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error("Missing valid stripe checkout session id.");
  }

  // ১. স্ট্রাইপ থেকে সেশন অবজেক্ট রিড করা
  const session = await stripe.checkout.sessions.retrieve(session_id);

  if (session.status === "open") {
    return redirect("/");
  }

  if (session.status === "complete") {
    const { taskId, proposalId, userId, userEmail, price } = session.metadata;

    // ⚡ ২. তোমার সার্ভার অ্যাকশন (payment) কল করে এক্সপ্রেস ব্যাকএন্ডে ডাটা পাঠানো
    const dbSync = await payment({
      sessionId: session.id,
      userId,
      userEmail,
      taskId,
      proposalId,
      price
    });

    // ডাটাবেজ আপডেট ফেইল করলে কনসোলে ট্র্যাক রাখা
    if (dbSync?.success === false) {
      console.error("Database sync failed:", dbSync.error);
    }

    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 antialiased text-gray-200">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[300px] bg-gradient-to-b from-cyan-500/10 to-transparent blur-3xl pointer-events-none" />
        
        <div className="w-full max-w-md bg-neutral-900/50 border border-neutral-800/80 rounded-3xl p-6 md:p-8 text-center backdrop-blur-xl shadow-2xl relative overflow-hidden">
          
          {/* Success Animation Icon */}
          <div className="mx-auto w-16 h-16 bg-cyan-500/10 border border-cyan-400/20 rounded-2xl flex items-center justify-center mb-6 text-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
            <CheckCircle2 className="w-8 h-8 stroke-[2.3]" />
          </div>

          <h1 className="text-2xl font-black text-white tracking-tight mb-2">Payment Completed!</h1>
          <p className="text-xs text-neutral-400 font-medium max-w-xs mx-auto leading-relaxed">
            Payment verified successfully. Budget of <span className="text-cyan-400 font-bold">${price} USD</span> is safely allocated into contract escrow.
          </p>

          {/* ট্রানজেকশন রিসিট */}
          <div className="my-6 p-4 bg-neutral-950/50 border border-neutral-800/60 rounded-2xl text-left text-xs space-y-2.5 font-medium">
            <div className="flex justify-between">
              <span className="text-neutral-500">Receipt Email</span>
              <span className="text-neutral-300 truncate max-w-[180px]">{session.customer_details?.email}</span>
            </div>
            <div className="flex justify-between border-t border-neutral-800/40 pt-2.5">
              <span className="text-neutral-500">Stripe Ref ID</span>
              <span className="text-neutral-400 font-mono text-[10px] truncate max-w-[150px]">{session.id}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-emerald-400/80 bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl justify-center font-semibold mb-6">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Project assigned & Freelancer notified.</span>
          </div>

          {/* নেভিগেশন বাটন */}
          <Link
            href="/client" // তোমার ড্যাশবোর্ড বা প্রজেক্ট ম্যানেজমেন্টের কারেক্ট পাথটি এখানে দিও
            className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all border border-neutral-700 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Go To Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }
}
import Link from 'next/link';
import React from 'react';

const UnAuthorizedPage = () => {
  // কর্নার রোটেশনগুলোর জন্য একটি অ্যারে যাতে SVG ডুপ্লিকেট করতে না হয়
  const corners = ['top-[-1px] left-[-1px]', 'top-[-1px] right-[-1px] rotate-90', 'bottom-[-1px] right-[-1px] rotate-180', 'bottom-[-1px] left-[-1px] rotate-270'];

  

  return (
    <div className="py-3 px-0 font-['Inter'] font-light">
      {/* গ্লোবাল অ্যানিমেশন ইনজেকশন (যদি গ্লোবাল সিএসএস ফাইলে না রাখতে চান) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Inter:wght@300;400;500&display=swap');
        @keyframes glitch {
          0%,90%,100%{transform:translateX(0);text-shadow:0 0 28px rgba(138,248,230,0.55),0 0 70px rgba(138,248,230,0.18)}
          92%{transform:translateX(-3px);text-shadow:3px 0 #ff3e9d,-3px 0 #00f5d4;clip-path:polygon(0 15%,100% 15%,100% 40%,0 40%)}
          94%{transform:translateX(3px);text-shadow:-3px 0 #ff3e9d,3px 0 #00f5d4;clip-path:polygon(0 60%,100% 60%,100% 85%,0 85%)}
          96%{transform:translateX(-1px);text-shadow:0 0 28px rgba(138,248,230,0.55);clip-path:none}
        }
        @keyframes cardpulse {
          0%,100%{box-shadow:0 0 22px rgba(138,248,230,0.07),0 0 55px rgba(138,248,230,0.03)}
          50%{box-shadow:0 0 36px rgba(138,248,230,0.13),0 0 80px rgba(138,248,230,0.06)}
        }
        @keyframes cornerdraw { from{stroke-dashoffset:60} to{stroke-dashoffset:0} }
        .animate-glitch { animation: glitch 5s steps(1) infinite; }
        .animate-cardpulse { animation: cardpulse 3.5s ease-in-out infinite; }
        .animate-cornerdraw path { stroke-dasharray:60; animation: cornerdraw 0.7s ease forwards; }
      `}</style>

      <div className="relative bg-[#050d1a] rounded-[10px] overflow-hidden py-12 px-6 flex flex-col items-center min-h-200">
        {/* background grids & effects */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(138,248,230,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(138,248,230,0.025)_1px,transparent_1px)] bg-size-[52px_52px]"></div>
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_55%_at_50%_50%,rgba(138,248,230,0.044)_0%,transparent_70%)]"></div>
        <div className="animate-[scan_6s_linear_infinite] absolute left-0 right-0 h-32.5 bg-[linear-gradient(180deg,transparent_0%,rgba(138,248,230,0.03)_25%,rgba(138,248,230,0.062)_50%,rgba(138,248,230,0.03)_75%,transparent_100%)] pointer-events-none z-10"></div>

        {/* main card */}
        <div className="animate-cardpulse relative z-20 w-full max-w-105 bg-[rgba(7,17,36,0.94)] border border-[rgba(138,248,230,0.17)] rounded integrity-card p-7 pb-6 backdrop-blur-[14px]">
          
          {/* dynamic corners */}
          {corners.map((pos, idx) => (
            <svg key={idx} className={`animate-cornerdraw absolute ${pos}`} width="13" height="13" viewBox="0 0 14 14">
              <path d="M1 13 L1 1 L13 1" fill="none" stroke="#8af8e6" strokeWidth="1.5" strokeLinecap="square"/>
            </svg>
          ))}

          {/* window bar */}
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#8af8e6]"></span>
            <div className="flex-1 h-px ml-1.5 bg-[rgba(138,248,230,0.08)]"></div>
            <span className="font-['Space_Mono'] text-[9px] color-[rgba(138,248,230,0.3)] tracking-[1.5px]">SYSTEM_GUARD</span>
          </div>

          {/* shield icon */}
          <div className="text-center mb-4">
            <svg width="48" height="54" viewBox="0 0 52 58" fill="none" className="inline-block">
              <path d="M26 3L4 11V28C4 41 14.5 52.5 26 55C37.5 52.5 48 41 48 28V11L26 3Z" fill="rgba(138,248,230,0.05)" stroke="rgba(138,248,230,0.35)" strokeWidth="1.4"/>
              <path d="M26 3L4 11V28C4 41 14.5 52.5 26 55C37.5 52.5 48 41 48 28V11L26 3Z" fill="none" stroke="rgba(138,248,230,0.12)" strokeWidth="1" strokeDasharray="4 3"/>
              <rect x="16" y="28" width="20" height="15" rx="2" fill="rgba(138,248,230,0.08)" stroke="rgba(138,248,230,0.75)" strokeWidth="1.4"/>
              <path d="M20 28V23C20 20.24 22.69 18 26 18C29.31 18 32 20.24 32 23V28" stroke="rgba(138,248,230,0.75)" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
              <circle cx="26" cy="34" r="2.6" fill="#8af8e6" className="opacity-85"/>
              <rect x="24.8" y="34" width="2.4" height="4" rx="1" fill="#8af8e6" className="opacity-85"/>
            </svg>
          </div>

          {/* 403 text */}
          <div className="text-center mb-3">
            <span className="animate-glitch inline-block font-['Space_Mono'] text-[clamp(60px,13vw,88px)] font-bold color-[#8af8e6] leading-none tracking-[-4px]">403</span>
          </div>

          {/* badge */}
          <div className="text-center mb-5">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 border border-[rgba(138,248,230,0.22)] bg-[rgba(138,248,230,0.04)] font-['Space_Mono'] text-[9px] text-[#8af8e6] tracking-[4px]">
              <span className="animate-[badgedot_2s_ease-in-out_infinite] w-1.25 h-1.25 rounded-full bg-[#8af8e6]"></span>
              ACCESS DENIED
            </span>
          </div>

          <div className="border-t border-[rgba(138,248,230,0.07)] mb-4.5"></div>

          <p className="text-center text-[#7a9daa] text-zm font-light leading-[1.75] mb-6">
            You do not have permission to access this resource.<br/>
            This attempt has been logged and flagged.<br/>
            <span className="text-[rgba(138,248,230,0.38)] text-xs">Contact your administrator if this is a mistake.</span>
          </p>

          {/* buttons */}
          <div className="flex gap-2.5 justify-center mb-5.5">
            <Link href="/"  className="bg-[#8af8e6] text-[#050d1a] border-none py-2.5 px-5.5 font-['Space_Mono'] text-[10px] font-bold tracking-[1.5px] rounded-[2px] transition-all hover:-translate-y-0.5 hover:bg-[#6cf4dc] hover:shadow-[0_6px_22px_rgba(138,248,230,0.26)]">← GO BACK</Link >
            <Link href="/" 
            className="bg-transparent text-[#8af8e6] border border-[rgba(138,248,230,0.24)] py-2.5 px-5.5 font-['Space_Mono'] text-[10px] tracking-[1.5px] rounded-sm transition-all hover:-translate-y-0.5 hover:bg-[rgba(138,248,230,0.07)] hover:border-[rgba(138,248,230,0.5)]">HOME</Link>
          </div>

          {/* footer */}
          <div className="border-t border-[rgba(138,248,230,0.07)] pt-3.5">
            <p className="font-['Space_Mono'] text-[10px] text-[rgba(138,248,230,0.28)]">
              <span className="text-[rgba(138,248,230,0.55)]">$</span> ERR_HTTP_403_FORBIDDEN
              <span className="animate-[cursorblink_1.1s_step-end_infinite] text-[#8af8e6] ml-0.5">█</span>
            </p>
          </div>
        </div>

        <p className="absolute bottom-3.5 left-0 right-0 text-center font-['Space_Mono'] text-[8px] text-[rgba(138,248,230,0.13)] tracking-[4px]">UNAUTHORIZED · HTTP 403 · ACCESS RESTRICTED</p>
      </div>
    </div>
  );
};

export default UnAuthorizedPage;
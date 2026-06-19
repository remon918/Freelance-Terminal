"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const messages = [
  "Oops! Page not found...",
  "Hmm... you seem lost 👀",
  "RRedirecting you to home...",
];

export default function NotFound() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    let charIndex = 0;
    const currentMessage = messages[messageIndex];

    const typingInterval = setInterval(() => {
      if (charIndex < currentMessage.length) {
        setText((prev) => prev + currentMessage.charAt(charIndex));
        charIndex++;
      } else {
        clearInterval(typingInterval);

        setTimeout(() => {
          if (messageIndex < messages.length - 1) {
            setText("");
            setMessageIndex((prev) => prev + 1);
          }
        }, 800);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [messageIndex]);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="text-center space-y-6">
        {/* 404 */}
        <h1 className="text-7xl font-bold ">404</h1>

        {/* Typing text */}
        <p className="text-xl font-medium min-h-10">
          {text}
          <span className="animate-pulse">|</span>
        </p>

        {/* Progress bar */}
        <div className="w-64 h-1  rounded-full overflow-hidden mx-auto">
          <div className="h-full animate-[progress_5s_linear_forwards]" />
        </div>

        <p className="text-md">
          You will be redirected automatically...
        </p>
      </div>
    </div>
  );
}
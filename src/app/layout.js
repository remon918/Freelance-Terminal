import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeController from "./components/minor/ThemeController";
import Scroll from "./components/minor/Scroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Freelance Terminal",
  description: "Best Freelance Job Portal of Bangladesh",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <ThemeController />
        <Scroll />
        </body>
    </html>
  );
}

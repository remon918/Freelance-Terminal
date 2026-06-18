import Link from "next/link";
import {
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="mt-24 border-t border-base-300">
      <div className="mx-auto w-[95%] lg:w-[76%] py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          
          {/* Brand */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Freelance-Terminal
            </h2>

            <p className="mt-4 max-w-md text-sm leading-6 text-base-content/70">
              Connect with skilled freelancers and discover quality projects.
              Build, hire, and grow together through a modern freelance
              marketplace.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a className="rounded-xl border border-base-300 p-2 transition hover:bg-base-200">
                <FaFacebookF />
              </a>

              <a className="rounded-xl border border-base-300 p-2 transition hover:bg-base-200">
                <FaLinkedinIn />
              </a>

              <a className="rounded-xl border border-base-300 p-2 transition hover:bg-base-200">
                <FaGithub />
              </a>

              <a className="rounded-xl border border-base-300 p-2 transition hover:bg-base-200">
                <FaXTwitter />
              </a>
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h3 className="mb-4 font-semibold">
              Marketplace
            </h3>

            <ul className="space-y-3 text-sm text-base-content/70">
              <li>
                <Link href="/browse-tasks">
                  Browse Tasks
                </Link>
              </li>

              <li>
                <Link href="/browse-freelancers">
                  Browse Freelancers
                </Link>
              </li>

              <li>
                <Link href="/post-task">
                  Post a Task
                </Link>
              </li>

              <li>
                <Link href="/categories">
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 font-semibold">
              Company
            </h3>

            <ul className="space-y-3 text-sm text-base-content/70">
              <li>
                <Link href="/about">
                  About
                </Link>
              </li>

              <li>
                <Link href="/contact">
                  Contact
                </Link>
              </li>

              <li>
                <Link href="/careers">
                  Careers
                </Link>
              </li>

              <li>
                <Link href="/blog">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 font-semibold">
              Support
            </h3>

            <ul className="space-y-3 text-sm text-base-content/70">
              <li>
                <Link href="/faq">
                  FAQ
                </Link>
              </li>

              <li>
                <Link href="/help-center">
                  Help Center
                </Link>
              </li>

              <li>
                <Link href="/privacy">
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link href="/terms">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-base-300">
        <div className="mx-auto flex w-[95%] lg:w-[76%] flex-col items-center justify-between gap-4 py-5 text-sm text-base-content/60 md:flex-row">
          <p>
            © {new Date().getFullYear()} Freelance-Terminal.
            All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/cookies">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
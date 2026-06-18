import Link from "next/link";
import { FaGoogle, FaPaypal, FaArrowRight } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { SiMeta, SiNetflix, SiPayoneer } from "react-icons/si";

const Banner = () => {
  const categories = [
    "Website Development",
    "Architecture & Interior Design",
    "UGC Videos",
    "Video Editing",
    "Graphic Design",
    "Digital Marketing",
  ];

  return (
    <section className="relative overflow-hidden py-10 md:py-12">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="bg-grid-pattern absolute inset-0 opacity-30" />

        <div className="absolute left-0 top-0 h-112.5 w-112.5 rounded-full bg-primary/20 blur-[120px]" />

        <div className="absolute bottom-0 right-0 h-112.5 w-112.5 rounded-full bg-secondary/20 blur-[120px]" />
      </div>

      <div className="relative mx-auto w-[95%] lg:w-[76%]">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="md:mt-3 mb-3 md:mb-5 rounded-full border border-base-300 bg-base-100/50 px-4 py-2 text-sm font-medium backdrop-blur">
            🚀 Freelance Marketplace Platform
          </div>

          {/* Heading */}
          <h1 className="max-w-5xl text-4xl font-extrabold leading-tight md:text-6xl lg:text-7xl">
            Hire Top Freelancers
            <br />
            For Every Project
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-2xl text-base leading-7 text-base-content/70 md:text-lg">
            Discover talented freelancers, post tasks, and collaborate
            seamlessly on a platform built for modern work. From web development
            to creative services, find the right expert for every project.
          </p>

          {/* Buttons */}
          <div className="mt-5 flex flex-wrap justify-center gap-4">
            <Link
              href="/browse-task"
              className="btn btn-primary border px-5 py-2 rounded-md btn-md md:btn-lg transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-primary/40
                  hover:shadow-xl font-semibold bg-teal-500 hover:bg-teal-300 flex items-center gap-2"
            >
              Browse Tasks
              <FiExternalLink />
            </Link>

            <Link
              href="/profile"
              className="btn btn-outline border px-5 py-2 rounded btn-md md:btn-lg 
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-primary/40
                  hover:shadow-xl font-semibold flex items-center gap-2"
            >
              Profile Preview
              <FiExternalLink />
            </Link>
          </div>

          {/* Categories */}
          <div className="mt-18 flex flex-wrap justify-center gap-2 md:gap-4">
            {categories.map((item) => (
              <div
                key={item}
                className="
                  group
                  flex
                  items-center
                  gap-2
                  rounded-2xl
                  border
                  border-base-300
                  bg-base-100/40 px-2
                  py-1.5
                  md:px-5
                  md:py-4
                  cursor-pointer
                  
                  md:font-medium
                  text-xs
                  md:text-md
                  backdrop-blur-md
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-primary/40
                  hover:shadow-md
                "
              >
                <span>{item}</span>

                <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            ))}
          </div>

          {/* Trusted By */}
          <div className="mt-8 w-full max-w-5xl">
            <div className="mb-4 flex items-center justify-center gap-4">
              <div className="h-px flex-1 bg-base-300" />

              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-base-content/50">
                Trusted By Industry Leaders
              </p>

              <div className="h-px flex-1 bg-base-300" />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-16">
              <div className="flex items-center gap-2 text-base-content/60 transition hover:text-base-content">
                <FaGoogle className="text-xl" />
                <span className="font-semibold">Google</span>
              </div>

              <div className="flex items-center gap-2 text-base-content/60 transition hover:text-base-content">
                <SiMeta className="text-xl" />
                <span className="font-semibold">Meta</span>
              </div>

              <div className="flex items-center gap-2 text-base-content/60 transition hover:text-base-content">
                <SiNetflix className="text-lg" />
                <span className="font-semibold">Netflix</span>
              </div>

              <div className="flex items-center gap-2 text-base-content/60 transition hover:text-base-content">
                <FaPaypal className="text-xl" />
                <span className="font-semibold">PayPal</span>
              </div>

              <div className="flex items-center gap-2 text-base-content/60 transition hover:text-base-content">
                <SiPayoneer className="text-xl" />
                <span className="font-semibold">Payoneer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;

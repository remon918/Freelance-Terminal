"use client";

import { useState } from "react";
import Image from "next/image"; // Next.js Optimized Image Component load
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { FaQuoteLeft, FaThumbsUp, FaCheckCircle } from "react-icons/fa";

// Swiper structural module stylesheets assets
import "swiper/css";
import "swiper/css/pagination";

// 5 Extended platform reviews array dataset
const initialTestimonials = [
  {
    id: 1,
    name: "Alex Rivera",
    role: "Senior Enterprise Product Client",
    company: "DevSync Global",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    comment: "This platform drastically accelerated our software engineering iteration metrics. Finding elite Full-Stack talent took less than 48 hours. Absolute game changer!",
    helpfulCount: 24,
    userHasVoted: false,
  },
  {
    id: 2,
    name: "Mahima Hasan",
    role: "Expert UI/UX Architect Specialist",
    company: "Freelancer Profile Resource",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    comment: "The integrated workspace contracts tracking ecosystem and streamlined financial milestones protection mechanism ensure I get paid securely on schedule every single time.",
    helpfulCount: 42,
    userHasVoted: false,
  },
  {
    id: 3,
    name: "Marcus Sterling",
    role: "Strategic Brand Operations Manager",
    company: "Vortex Media",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    comment: "Verified talent portfolio credentials make contract screening trivial. We managed to complete our 4K video post-production sprint ahead of timeline constraints.",
    helpfulCount: 18,
    userHasVoted: false,
  },
  {
    id: 4,
    name: "Sajid Ahmed",
    role: "Lead Full Stack Developer",
    company: "Freelancer Resource Space",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    comment: "As a developer, I love the automated project tracking board. Client communication tools are highly responsive, and the standard developer support team helps solve ticket queries efficiently.",
    helpfulCount: 31,
    userHasVoted: false,
  },
  {
    id: 5,
    name: "Emily Watson",
    role: "Operations Technical Director",
    company: "Fintech Lab Inc.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    comment: "Outsourcing database audit procedures to freelance contractors on this portal removed administrative overheads. Highly robust validation framework structure for enterprise-grade assignments.",
    helpfulCount: 56,
    userHasVoted: false,
  }
];

const Testimonials = () => {
  const [reviews, setReviews] = useState(initialTestimonials);

  // Dynamic Clickable Function: Single selection increments or decrements total sum cleanly
  const handleVoteToggle = (id) => {
    setReviews((prevReviews) =>
      prevReviews.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            helpfulCount: item.userHasVoted ? item.helpfulCount - 1 : item.helpfulCount + 1,
            userHasVoted: !item.userHasVoted,
          };
        }
        return item;
      })
    );
  };

  return (
    <section className="py-16 bg-base-200/40 relative overflow-hidden">
      <div className="mx-auto w-[95%] lg:w-[65%]">
        
        {/* Header Segment Grid element container */}
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 text-xs font-bold text-teal-600 bg-teal-50 dark:bg-teal-950/40 rounded-full mb-3 uppercase tracking-wider">
            User Success Reviews
          </div>
          <h2 className="text-3xl font-extrabold md:text-5xl text-base-content tracking-tight">
            Voices from Our Active Network
          </h2>
          <p className="mt-4 text-base text-base-content/60 max-w-xl mx-auto">
            Discover how global business operators and elite engineering practitioners accelerate deliverables workflow.
          </p>
        </div>

        {/* Carousel Framework View Area container */}
        <div className="relative px-2 md:px-10">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            className="pb-14 testimonial-swiper"
          >
            {reviews.map((card) => (
              <SwiperSlide key={card.id}>
                <div className="bg-base-100 border border-base-300 rounded-3xl p-6 md:p-10 shadow-sm flex flex-col md:flex-row gap-6 items-center relative transition-all duration-300">
                  
                  {/* Absolute Accent Layout Object */}
                  <div className="absolute right-8 top-6 text-base-content/10 pointer-events-none hidden md:block">
                    <FaQuoteLeft className="text-7xl" />
                  </div>

                  {/* Profile Section Node containing Optimized Next.js Images */}
                  <div className="flex flex-col items-center text-center shrink-0 w-full md:w-44">
                    <div className="relative group">
                      <Image
                        className="h-24 w-24 rounded-full object-cover ring-4 ring-teal-600/20"
                        src={card.avatar}
                        alt={card.name}
                        width={150} // Required props for layout image components mapping optimization
                        height={150} // Required props for layout image components mapping optimization
                        priority={card.id === 1} // Initial node priority setup
                      />
                      <span className="absolute bottom-1 right-1 bg-teal-500 text-white p-1 rounded-full text-xs shadow-md">
                        <FaCheckCircle />
                      </span>
                    </div>
                    <h4 className="mt-4 font-bold text-lg text-base-content tracking-tight">{card.name}</h4>
                    <p className="text-xs text-base-content/50 mt-0.5 line-clamp-1">{card.role}</p>
                    <span className="text-[10px] font-semibold bg-base-200 px-2 py-0.5 rounded text-base-content/70 mt-1.5 uppercase tracking-wide">
                      {card.company}
                    </span>
                  </div>

                  {/* Comment & Interactive Controls Section */}
                  <div className="flex-1 flex flex-col justify-between text-center md:text-left h-full">
                    <div>
                      <span className="text-teal-600 mb-2 md:text-left text-xl justify-center flex md:justify-start">
                        <FaQuoteLeft className="opacity-40 text-sm md:text-lg mr-1 md:inline hidden" />
                      </span>
                      <p className="text-base text-base-content/80 leading-relaxed font-medium italic">
                        {card.comment}
                      </p>
                    </div>

                    {/* Highly responsive evaluation action area */}
                    <div className="mt-6 pt-4 border-t border-base-300 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <span className="text-xs text-base-content/40">
                        Was this review helpful to your project decisions?
                      </span>

                      <button
                        onClick={() => handleVoteToggle(card.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wide border transition-all duration-200 active:scale-95 ${
                          card.userHasVoted
                            ? "bg-teal-600 border-teal-600 text-white shadow-md shadow-teal-600/30"
                            : "bg-base-100 border-base-300 hover:border-base-content/40 text-base-content/70 hover:bg-base-200/60"
                        }`}
                      >
                        <FaThumbsUp className={card.userHasVoted ? "animate-pulse" : ""} />
                        <span>Helpful ({card.helpfulCount})</span>
                      </button>
                    </div>
                  </div>

                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </div>

      {/* Custom styled dynamic bullet points layer */}
      <style>{`
        .testimonial-swiper .swiper-pagination-bullet-active {
          background: #0d9488 !important;
          width: 18px;
          border-radius: 4px;
        }
        .testimonial-swiper .swiper-pagination-bullet {
          background: #a1a1aa;
          opacity: 0.6;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
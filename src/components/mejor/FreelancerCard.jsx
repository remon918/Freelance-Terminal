import React from 'react';
import Link from 'next/link'; // Next.js এর লিংক ইম্পোর্ট করা হলো
import { Star, ArrowRight } from 'lucide-react';

const FreelancerCard = ({ freelancer }) => {
  // ডাটাবেজের আইডি চেক (_id অথবা id)
  const freelancerId = freelancer._id || freelancer.id;

  return (
    // text-gray-800, text-left এবং no-underline দিয়ে ডিফল্ট লিংক স্টাইল ব্লক করা হলো
    <Link 
      href={`/browse-freelancer/${freelancerId}`} 
      className="block h-full text-left  no-underline hover:no-underline"
    >
      <div className=" border border-gray-500 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between h-full cursor-pointer group">
        <div>
          {/* টপ সেকশন: অ্যাভাটার ও নাম */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-linear-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-lg uppercase shadow-sm">
              {freelancer.name ? freelancer.name[0] : 'F'}
            </div>
            <div>
              {/* group-hover:text-blue-600 ব্যবহারের ফলে কার্ডে হোভার করলেই নাম নীল হয়ে যাবে */}
              <h3 className="font-bold  text-base leading-tight group-hover:text-blue-600 transition-colors">
                {freelancer.name}
              </h3>
              <p className="text-xs text-blue-600 font-medium mt-0.5">
                {freelancer.title || "Professional Freelancer"}
              </p>
            </div>
          </div>

          {/* স্কিল বা বায়ো সেকশন */}
          <p className="text-gray-500 text-xs line-clamp-2 mb-4 leading-relaxed">
            {freelancer.bio || "No bio added yet. Ready to collaborate on exciting projects!"}
          </p>

          {/* স্কিল ব্যাজ সমূহ */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(() => {
              if (Array.isArray(freelancer.skills)) {
                return freelancer.skills;
              }
              if (typeof freelancer.skills === "string" && freelancer.skills.trim() !== "") {
                return freelancer.skills.split(",").map(s => s.trim());
              }
              return ["React", "Tailwind", "Node.js"];
            })()
              .slice(0, 3)
              .map((skill, index) => (
                <span key={index} className="bg-gray-50 border border-gray-400 text-gray-600 px-2 py-0.5 rounded-md text-[10px] font-medium">
                  {skill}
                </span>
              ))}
          </div>
        </div>

        {/* বটম সেকশন: রেটিং ও ভিউ প্রোফাইল */}
        <div className="border-t border-gray-100 pt-3 mt-2 flex items-center justify-between text-xs ">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-semibold ">{freelancer.rating || "5.0"}</span>
          </div>
          
          <span className="text-blue-600 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            View Profile <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default FreelancerCard;
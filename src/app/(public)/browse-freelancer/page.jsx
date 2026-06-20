"use client";

import React, { useEffect, useState } from 'react';

import FreelancerCard from '@/components/mejor/FreelancerCard';
import { Users } from 'lucide-react';
import { getAllFreelancers } from '@/lib/api/tasks';

const BrowseFreelancersPage = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFreelancers = async () => {
      try {
        setLoading(true);
        const data = await getAllFreelancers();
        setFreelancers(data || []);
      } catch (error) {
        console.error("Error loading freelancers:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFreelancers();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-6 font-sans mt-9">
      {/* হেডার সেকশন */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          Browse Top Freelancers
        </h2>
        <p className="text-gray-400 text-sm">Find and connect with world-class experts for your projects.</p>
      </div>

      {/* কন্ডিশনাল রেন্ডারিং */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading talent pool...</div>
      ) : freelancers.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
          <p className="text-gray-400 text-sm">No freelancers registered yet.</p>
        </div>
      ) : (
        /* ৩ কলাম বিশিষ্ট রেসপন্সিভ গ্রিড */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {freelancers.map((freelancer) => (
            <FreelancerCard key={freelancer._id} freelancer={freelancer} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseFreelancersPage;
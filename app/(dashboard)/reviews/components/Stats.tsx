"use client";

import { useReviewStatsQuery } from "@/redux/api/stats.api";
import { FaStar } from "react-icons/fa6";
import { MdAutoGraph } from "react-icons/md";
import { TbPercentage } from "react-icons/tb";

const Stats = () => {
  const { data } = useReviewStatsQuery("");
  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl font-medium">Reviews & Feedback</h1>
        <p className="text-[#555555] text-xs pb-3 sm:pb-4">
          Monitor and manage guest reviews
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-3">
          {/* 1. Total Reviews */}
          <div className="flex items-center justify-between p-2.5 sm:p-3 bg-white hover:shadow-md border border-gray-100 rounded-xl shadow-xs transition-all duration-200">
            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                Total Reviews
              </h4>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg sm:text-2xl font-bold text-gray-900 leading-none">
                  {data?.result?.totalReviews?.toLocaleString() ?? 0}
                </span>
              </div>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-2 rounded-lg shrink-0 ml-2">
              <FaStar size={18} />
            </div>
          </div>

          {/* 2. Average Rating */}
          <div className="flex items-center justify-between p-2.5 sm:p-3 bg-white hover:shadow-md border border-gray-100 rounded-xl shadow-xs transition-all duration-200">
            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                Average Rating
              </h4>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg sm:text-2xl font-bold text-gray-900 leading-none">
                  {data?.result?.averageRating?.toFixed(1) ?? "0.0"}
                </span>
              </div>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-2 rounded-lg shrink-0 ml-2">
              <MdAutoGraph size={18} />
            </div>
          </div>

          {/* 3. Positive Reviews */}
          <div className="flex items-center justify-between p-2.5 sm:p-3 bg-white hover:shadow-md border border-gray-100 rounded-xl shadow-xs transition-all duration-200">
            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                Positive Reviews
              </h4>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg sm:text-2xl font-bold text-green-600 leading-none">
                  {data?.result?.positiveCount?.toLocaleString() ?? 0}
                </span>
              </div>
            </div>
            <div className="bg-green-100 text-green-600 p-2 rounded-lg shrink-0 ml-2">
              <FaStar size={18} />
            </div>
          </div>

          {/* 4. Positive Percentage */}
          <div className="flex items-center justify-between p-2.5 sm:p-3 bg-white hover:shadow-md border border-gray-100 rounded-xl shadow-xs transition-all duration-200">
            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                Positive %
              </h4>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg sm:text-2xl font-bold text-green-600 leading-none">
                  {data?.result?.positivePercentage?.toFixed(1) ?? 0}%
                </span>
              </div>
            </div>
            <div className="bg-green-100 text-green-600 p-2 rounded-lg shrink-0 ml-2">
              <TbPercentage size={18} />
            </div>
          </div>

          {/* 5. Negative Reviews */}
          <div className="flex items-center justify-between p-2.5 sm:p-3 bg-white hover:shadow-md border border-gray-100 rounded-xl shadow-xs transition-all duration-200">
            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                Negative Reviews
              </h4>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg sm:text-2xl font-bold text-red-600 leading-none">
                  {data?.result?.negativeCount?.toLocaleString() ?? 0}
                </span>
              </div>
            </div>
            <div className="bg-red-100 text-red-600 p-2 rounded-lg shrink-0 ml-2">
              <FaStar size={18} />
            </div>
          </div>

          {/* 6. Negative Percentage */}
          <div className="flex items-center justify-between p-2.5 sm:p-3 bg-white hover:shadow-md border border-gray-100 rounded-xl shadow-xs transition-all duration-200">
            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                Negative %
              </h4>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg sm:text-2xl font-bold text-red-600 leading-none">
                  {data?.result?.negativePercentage?.toFixed(1) ?? 0}%
                </span>
              </div>
            </div>
            <div className="bg-red-100 text-red-600 p-2 rounded-lg shrink-0 ml-2">
              <TbPercentage size={18} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;

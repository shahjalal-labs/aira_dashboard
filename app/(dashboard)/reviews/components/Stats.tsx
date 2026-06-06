"use client";

import { useReviewStatsQuery } from "@/redux/api/stats.api";
import { FaStar } from "react-icons/fa6";
import { MdAutoGraph } from "react-icons/md";
import { TbPercentage } from "react-icons/tb";

const Stats = () => {
  const { data } = useReviewStatsQuery("");
  return (
    <div>
         <h1 className="text-xl font-medium">Reviews & Feedback</h1>
        <p className="text-[#555555] text-xs pb-4">
          Monitor and manage guest reviews
        </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="shadow-xl rounded-lg p-6 bg-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#555555]">Total Reviews</h3>
              <h3 className="text-3xl font-medium pt-2">
                {data?.result?.totalReviews?.toLocaleString()}
              </h3>
            </div>
            <div className="bg-bprimary/10 p-3 text-2xl rounded-lg text-bprimary">
              <FaStar></FaStar>
            </div>
          </div>
        </div>
        <div className="shadow-xl rounded-lg p-6 bg-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#555555]">Average Rating</h3>
              <h3 className="text-3xl font-medium pt-2">
                {data?.result?.averageRating?.toFixed(1)}
              </h3>
            </div>
            <div className="bg-bprimary/10 p-3 text-2xl rounded-lg text-bprimary">
              <MdAutoGraph ></MdAutoGraph >
            </div>
          </div>
        </div>
        <div className="shadow-xl rounded-lg p-6 bg-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#555555]">Positive Reviews</h3>
              <h3 className="text-3xl font-medium pt-2">
                {data?.result?.positiveCount?.toLocaleString()}
              </h3>
            </div>
            <div className="bg-bprimary/10 p-3 text-2xl rounded-lg text-bprimary">
              <FaStar></FaStar>
            </div>
          </div>
        </div>
        <div className="shadow-xl rounded-lg p-6 bg-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#555555]">Positive Percentage</h3>
              <h3 className="text-3xl font-medium pt-2">
                {data?.result?.positivePercentage?.toFixed(1)}%
              </h3>
            </div>
            <div className="bg-bprimary/10 p-3 text-2xl rounded-lg text-bprimary">
              <TbPercentage />
            </div>
          </div>
        </div>
        <div className="shadow-xl rounded-lg p-6 bg-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#555555]">Negative Reviews</h3>
              <h3 className="text-3xl font-medium pt-2">
                {data?.result?.negativeCount?.toLocaleString()}
              </h3>
            </div>
            <div className="bg-bprimary/10 p-3 text-2xl rounded-lg text-bprimary">
              <FaStar></FaStar>
            </div>
          </div>
        </div>
        <div className="shadow-xl rounded-lg p-6 bg-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#555555]">Negative Percentage</h3>
              <h3 className="text-3xl font-medium pt-2">
                {data?.result?.negativePercentage?.toFixed(1)}%
              </h3>
            </div>
            <div className="bg-bprimary/10 p-3 text-2xl rounded-lg text-bprimary">
              <TbPercentage  />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;

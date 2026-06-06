"use client";

import {
  useReportStatsQuery,
} from "@/redux/api/stats.api";
import { Users, Wallet } from "lucide-react";
import { FaRegFileAlt } from "react-icons/fa";
import { GrMoney } from "react-icons/gr";


const Stats = () => {
  const { data } = useReportStatsQuery("");

  return (
    <div>
      <h1 className="text-xl font-medium">Reports & Analytics</h1>
      <p className="text-[#555555] text-xs pb-4">
        Financial and operational insights
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="shadow-xl rounded-lg p-6 bg-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#555555]">GROSS REVENUE</h3>
              <h3 className="text-3xl font-medium pt-2">
                ${data?.result?.grossRevenue?.toLocaleString()}
              </h3>
            </div>
            <div className="bg-bprimary/10 p-3 text-2xl rounded-lg text-bprimary">
              <Wallet></Wallet>
            </div>
          </div>
        </div>
        <div className="shadow-xl rounded-lg p-6 bg-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#555555]">PLATFORM FEES</h3>
              <h3 className="text-3xl font-medium pt-2">
                ${data?.result?.totalPlatformFee?.toLocaleString()}
              </h3>
            </div>
            <div className="bg-bprimary/10 p-3 text-2xl rounded-lg text-bprimary">
              <GrMoney />
            </div>
          </div>
        </div>
        <div className="shadow-xl rounded-lg p-6 bg-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#555555]">TOTAL USERS</h3>
              <h3 className="text-3xl font-medium pt-2">
                {data?.result?.totalUsers?.toLocaleString()}
              </h3>
            </div>
            <div className="bg-bprimary/10 p-3 text-2xl rounded-lg text-bprimary">
              <Users></Users>
            </div>
          </div>
        </div>
        <div className="shadow-xl rounded-lg p-6 bg-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#555555]">BOOKINGS</h3>
              <h3 className="text-3xl font-medium pt-2">
                {data?.result?.totalBookings}
              </h3>
            </div>
            <div className="bg-bprimary/10 p-3 text-2xl rounded-lg text-bprimary">
              <FaRegFileAlt />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;

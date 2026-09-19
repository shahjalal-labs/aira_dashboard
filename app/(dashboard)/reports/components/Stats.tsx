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
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl font-medium">Reports & Analytics</h1>
        <p className="text-[#555555] text-xs pb-3 sm:pb-4">
          Financial and operational insights
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {/* 1. Gross Revenue */}
          <div className="flex items-center justify-between p-2.5 sm:p-3 bg-white hover:shadow-md border border-gray-100 rounded-xl shadow-xs transition-all duration-200">
            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                Gross Revenue
              </h4>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base sm:text-xl font-bold text-gray-900 leading-none truncate">
                  Kz {data?.result?.grossRevenue?.toLocaleString() ?? 0}
                </span>
              </div>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-2 rounded-lg shrink-0 ml-2">
              <Wallet size={18} />
            </div>
          </div>

          {/* 2. Platform Fees */}
          <div className="flex items-center justify-between p-2.5 sm:p-3 bg-white hover:shadow-md border border-gray-100 rounded-xl shadow-xs transition-all duration-200">
            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                Platform Fees
              </h4>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base sm:text-xl font-bold text-gray-900 leading-none truncate">
                  Kz {data?.result?.totalPlatformFee?.toLocaleString() ?? 0}
                </span>
              </div>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-2 rounded-lg shrink-0 ml-2">
              <GrMoney size={18} />
            </div>
          </div>

          {/* 3. Total Users */}
          <div className="flex items-center justify-between p-2.5 sm:p-3 bg-white hover:shadow-md border border-gray-100 rounded-xl shadow-xs transition-all duration-200">
            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                Total Users
              </h4>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-lg sm:text-2xl font-bold text-gray-900 leading-none">
                  {data?.result?.totalUsers?.toLocaleString() ?? 0}
                </span>
              </div>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-2 rounded-lg shrink-0 ml-2">
              <Users size={18} />
            </div>
          </div>

          {/* 4. Bookings */}
          <div className="flex items-center justify-between p-2.5 sm:p-3 bg-white hover:shadow-md border border-gray-100 rounded-xl shadow-xs transition-all duration-200">
            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                Total Bookings
              </h4>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-lg sm:text-2xl font-bold text-gray-900 leading-none">
                  {data?.result?.totalBookings ?? 0}
                </span>
              </div>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-2 rounded-lg shrink-0 ml-2">
              <FaRegFileAlt size={18} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;

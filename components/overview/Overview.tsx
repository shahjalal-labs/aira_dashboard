"use client";

import Link from "next/link";
import { useOverviewStatsQuery } from "@/redux/api/stats.api";
import {
  Banknote,
  FileChartColumnIncreasing,
  Users,
  Book,
  Wallet,
} from "lucide-react";
import { CiWarning } from "react-icons/ci";

const Overview = () => {
  const { data } = useOverviewStatsQuery("");

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl font-medium">Dashboard</h1>
        <p className="text-[#555555] text-xs pb-3 sm:pb-4">
          Platform revenue tracking metrics
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* 1. Total Revenue */}
          <div className="flex items-center justify-between p-4 sm:p-5 bg-white rounded-xl shadow-xs border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                Total Revenue
              </h4>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight truncate">
                  Kz {data?.result?.totalPlatformRevenue?.toLocaleString() ?? 0}
                </span>
              </div>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-3 rounded-xl shrink-0 ml-3">
              <Banknote className="w-6 h-6" />
            </div>
          </div>

          {/* 2. Active Users -> /user-management?status=ACTIVE */}
          <Link
            href="/user-management?status=ACTIVE"
            className="flex items-center justify-between p-4 sm:p-5 bg-white rounded-xl shadow-xs border border-gray-100 hover:shadow-md hover:border-bprimary/30 transition-all duration-200 cursor-pointer group"
          >
            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-medium text-gray-500 group-hover:text-bprimary transition-colors truncate">
                Active Users
              </h4>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight truncate">
                  {data?.result?.activeUsers?.toLocaleString() ?? 0}
                </span>
              </div>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-3 rounded-xl shrink-0 ml-3 group-hover:bg-bprimary group-hover:text-white transition-colors">
              <Users className="w-6 h-6" />
            </div>
          </Link>

          {/* 3. Active Listings -> /listings?status=active */}
          <Link
            href="/listings?status=active"
            className="flex items-center justify-between p-4 sm:p-5 bg-white rounded-xl shadow-xs border border-gray-100 hover:shadow-md hover:border-bprimary/30 transition-all duration-200 cursor-pointer group"
          >
            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-medium text-gray-500 group-hover:text-bprimary transition-colors truncate">
                Active Listings
              </h4>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight truncate">
                  {data?.result?.activeListings?.toLocaleString() ?? 0}
                </span>
              </div>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-3 rounded-xl shrink-0 ml-3 group-hover:bg-bprimary group-hover:text-white transition-colors">
              <FileChartColumnIncreasing className="w-6 h-6" />
            </div>
          </Link>

          {/* 4. Total Bookings -> /bookings */}
          <Link
            href="/bookings"
            className="flex items-center justify-between p-4 sm:p-5 bg-white rounded-xl shadow-xs border border-gray-100 hover:shadow-md hover:border-bprimary/30 transition-all duration-200 cursor-pointer group"
          >
            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-medium text-gray-500 group-hover:text-bprimary transition-colors truncate">
                Total Bookings
              </h4>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight truncate">
                  {data?.result?.totalBookings?.toLocaleString() ?? 0}
                </span>
              </div>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-3 rounded-xl shrink-0 ml-3 group-hover:bg-bprimary group-hover:text-white transition-colors">
              <Book className="w-6 h-6" />
            </div>
          </Link>

          {/* 5. Pending Payouts -> /payouts?status=PENDING */}
          <Link
            href="/payouts?status=PENDING"
            className="flex items-center justify-between p-4 sm:p-5 bg-white rounded-xl shadow-xs border border-gray-100 hover:shadow-md hover:border-bprimary/30 transition-all duration-200 cursor-pointer group"
          >
            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-medium text-gray-500 group-hover:text-bprimary transition-colors truncate">
                Pending Payouts
              </h4>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight truncate">
                  Kz {data?.result?.totalHostPayouts?.toLocaleString() ?? 0}
                </span>
              </div>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-3 rounded-xl shrink-0 ml-3 group-hover:bg-bprimary group-hover:text-white transition-colors">
              <Wallet className="w-6 h-6" />
            </div>
          </Link>

          {/* 6. Pending Approvals -> /listings?status=pending */}
          <Link
            href="/listings?status=pending"
            className="flex items-center justify-between p-4 sm:p-5 bg-white rounded-xl shadow-xs border border-gray-100 hover:shadow-md hover:border-bprimary/30 transition-all duration-200 cursor-pointer group"
          >
            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-medium text-gray-500 group-hover:text-bprimary transition-colors truncate">
                Pending Approvals
              </h4>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight truncate">
                  {data?.result?.payoutEventsCount?.toLocaleString() ?? 0}
                </span>
              </div>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-3 rounded-xl shrink-0 ml-3 group-hover:bg-bprimary group-hover:text-white transition-colors">
              <CiWarning className="w-6 h-6" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Overview;

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
      <h1 className="text-xl font-medium">Dashboard</h1>
      <p className="text-[#555555] text-xs pb-4">
        Platform revenue tracking metrics
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Revenue */}
        <div className="shadow-xl rounded-lg p-6 bg-white border border-transparent">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#555555]">Total Revenue</h3>
              <h3 className="text-3xl font-medium pt-2">
                Kz {data?.result?.totalPlatformRevenue?.toLocaleString() ?? 0}
              </h3>
            </div>
            <div className="bg-bprimary/10 p-3 text-2xl rounded-lg text-bprimary">
              <Banknote className="w-7 h-7" />
            </div>
          </div>
        </div>

        {/* Active Users -> /user-management?status=ACTIVE */}
        <Link
          href="/user-management?status=ACTIVE"
          className="block shadow-xl rounded-lg p-6 bg-white border border-transparent hover:shadow-2xl hover:border-bprimary/30 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#555555] group-hover:text-bprimary transition-colors">
                Active Users
              </h3>
              <h3 className="text-3xl font-medium pt-2">
                {data?.result?.activeUsers?.toLocaleString() ?? 0}
              </h3>
            </div>
            <div className="bg-bprimary/10 p-3 text-2xl rounded-lg text-bprimary group-hover:bg-bprimary group-hover:text-white transition-colors">
              <Users className="w-7 h-7" />
            </div>
          </div>
        </Link>

        {/* Active Listings -> /listings?status=active */}
        <Link
          href="/listings?status=active"
          className="block shadow-xl rounded-lg p-6 bg-white border border-transparent hover:shadow-2xl hover:border-bprimary/30 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#555555] group-hover:text-bprimary transition-colors">
                Active Listings
              </h3>
              <h3 className="text-3xl font-medium pt-2">
                {data?.result?.activeListings?.toLocaleString() ?? 0}
              </h3>
            </div>
            <div className="bg-bprimary/10 p-3 text-2xl rounded-lg text-bprimary group-hover:bg-bprimary group-hover:text-white transition-colors">
              <FileChartColumnIncreasing className="w-7 h-7" />
            </div>
          </div>
        </Link>

        {/* Total Bookings -> /bookings */}
        <Link
          href="/bookings"
          className="block shadow-xl rounded-lg p-6 bg-white border border-transparent hover:shadow-2xl hover:border-bprimary/30 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#555555] group-hover:text-bprimary transition-colors">
                Total Bookings
              </h3>
              <h3 className="text-3xl font-medium pt-2">
                {data?.result?.totalBookings?.toLocaleString() ?? 0}
              </h3>
            </div>
            <div className="bg-bprimary/10 p-3 text-2xl rounded-lg text-bprimary group-hover:bg-bprimary group-hover:text-white transition-colors">
              <Book className="w-7 h-7" />
            </div>
          </div>
        </Link>

        {/* Pending Payouts -> /payouts?status=PENDING */}
        <Link
          href="/payouts?status=PENDING"
          className="block shadow-xl rounded-lg p-6 bg-white border border-transparent hover:shadow-2xl hover:border-bprimary/30 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#555555] group-hover:text-bprimary transition-colors">
                Pending Payouts
              </h3>
              <h3 className="text-3xl font-medium pt-2">
                Kz {data?.result?.totalHostPayouts?.toLocaleString() ?? 0}
              </h3>
            </div>
            <div className="bg-bprimary/10 p-3 text-2xl rounded-lg text-bprimary group-hover:bg-bprimary group-hover:text-white transition-colors">
              <Wallet className="w-7 h-7" />
            </div>
          </div>
        </Link>

        {/* Pending Approvals -> /listings?status=pending */}
        <Link
          href="/listings?status=pending"
          className="block shadow-xl rounded-lg p-6 bg-white border border-transparent hover:shadow-2xl hover:border-bprimary/30 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#555555] group-hover:text-bprimary transition-colors">
                Pending Approvals
              </h3>
              <h3 className="text-3xl font-medium pt-2">
                {data?.result?.payoutEventsCount?.toLocaleString() ?? 0}
              </h3>
            </div>
            <div className="bg-bprimary/10 p-3 text-2xl rounded-lg text-bprimary group-hover:bg-bprimary group-hover:text-white transition-colors">
              <CiWarning className="w-7 h-7" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Overview;

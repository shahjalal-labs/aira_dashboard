"use client";

import { useOverviewStatsQuery } from "@/redux/api/stats.api";
import {
  DollarSignIcon,
  FileChartColumnIncreasing,
  Users,
  Book,
  Wallet,
} from "lucide-react";
import { CiWarning } from "react-icons/ci";

const Overview = () => {
  const { data, isLoading, isError } = useOverviewStatsQuery("");

  return (
    <div>
      <h1 className="text-xl font-medium">Dashboard</h1>
      <p className="text-[#555555] text-xs pb-4">
        Platform revenue tracking metrics
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="shadow-xl rounded-lg p-6 bg-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#555555]">Total Revenue</h3>
              <h3 className="text-3xl font-medium pt-2">
                ${data?.result?.totalPlatformRevenue?.toLocaleString()}
              </h3>
            </div>
            <div className="bg-bprimary/10 p-3 text-2xl rounded-lg text-bprimary">
              <DollarSignIcon></DollarSignIcon>
            </div>
          </div>
        </div>
        <div className="shadow-xl rounded-lg p-6 bg-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#555555]">Active Users</h3>
              <h3 className="text-3xl font-medium pt-2">
                {data?.result?.activeUsers?.toLocaleString()}
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
              <h3 className="text-[#555555]">Active Listings</h3>
              <h3 className="text-3xl font-medium pt-2">
                {data?.result?.activeListings?.toLocaleString()}
              </h3>
            </div>
            <div className="bg-bprimary/10 p-3 text-2xl rounded-lg text-bprimary">
              <FileChartColumnIncreasing></FileChartColumnIncreasing>
            </div>
          </div>
        </div>
        <div className="shadow-xl rounded-lg p-6 bg-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#555555]">Total Bookings</h3>
              <h3 className="text-3xl font-medium pt-2">
                {data?.result?.totalBookings?.toLocaleString()}
              </h3>             
            </div>
            <div className="bg-bprimary/10 p-3 text-2xl rounded-lg text-bprimary">
              <Book></Book>
            </div>
          </div>
        </div>
        <div className="shadow-xl rounded-lg p-6 bg-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#555555]">Pending Payouts</h3>
              <h3 className="text-3xl font-medium pt-2">
                ${data?.result?.totalHostPayouts?.toLocaleString()}
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
              <h3 className="text-[#555555]">Pending Approvals</h3>
              <h3 className="text-3xl font-medium pt-2">
                {data?.result?.payoutEventsCount?.toLocaleString()}
              </h3>
             
            </div>
            <div className="bg-bprimary/10 p-3 text-2xl rounded-lg text-bprimary">
              <CiWarning />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;

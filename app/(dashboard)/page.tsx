"use client";

import { JWTDecodeToken } from "@/lib/jwtDecode";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Overview from "@/components/overview/Overview";
import { BookingOverview } from "@/components/overview/BookingPieChart";
import PlatformChart from "./reports/components/PlatFormChart";
import UserGrowthChart from "./reports/components/UserGrowth";
import TopListing from "./reports/components/TopListing";

export default function Home() {
  const { decoded }: any = JWTDecodeToken();
  const router = useRouter();
  useEffect(() => {
    if (!decoded?.role || decoded?.role !== "ADMIN") {
      router.replace("/login");
    }
  }, [decoded, router]);
  return (
    <div className="space-y-6 pb-6">
      <Overview />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PlatformChart />
        </div>
        <div className="lg:col-span-1">
          <BookingOverview />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UserGrowthChart />
        </div>
        <div className="lg:col-span-1">
          <TopListing />
        </div>
      </div>
    </div>
  );
}

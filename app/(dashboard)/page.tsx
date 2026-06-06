"use client";

import { MonthlyEarnings } from "@/components/overview/MonthlyEarnings";
import { JWTDecodeToken } from "@/lib/jwtDecode";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import HomeUser from "./user-management/components/HomeUser";
import Overview from "@/components/overview/Overview";
import { BookingOverview } from "@/components/overview/BookingPieChart";
import PlatformChart from "./reports/components/PlatFormChart";

export default function Home() {
  const [type, setType] = useState("monthly");

  const { decoded }: any = JWTDecodeToken();
  const router = useRouter();
  useEffect(() => {
    if (!decoded?.role || decoded?.role !== "ADMIN") {
      router.replace("/login");
    }
  }, [decoded, router]);
  return (
    <div>
      <Overview></Overview>
      <div className="grid grid-cols-3 mt-8 gap-8">
        <div className="col-span-3 lg:col-span-2">
          <PlatformChart></PlatformChart>
        </div>
        <div className="col-span-3 lg:col-span-1">
          <BookingOverview></BookingOverview>
        </div>
      </div>
      <HomeUser></HomeUser>
    </div>
  );
}

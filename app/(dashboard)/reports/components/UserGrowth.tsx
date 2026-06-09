"use client"; // Required for Next.js App Router

import { useUserGrowthQuery } from '@/redux/api/stats.api';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface ApiMonthData {
  month: string;
  cumulativeUsers: number;
}



export default function UserGrowthChart() {
  const { data } = useUserGrowthQuery("");
  const apiData: ApiMonthData[] = data?.result || [];
  // Guard clause for empty or missing data
if (!apiData || apiData.length === 0) {
  return (
    <div className="w-full max-w-3xl p-6 bg-white rounded-xl shadow-sm font-sans">
      <h2 className="text-xl font-bold text-[#1e293b] mb-6">
        User Growth
      </h2>

      <div className="h-[279px] flex items-center justify-center text-slate-400">
        No growth data available.
      </div>
    </div>
  );
}

  const currentMonthIndex = new Date().getMonth();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Filter out future months that might be padded by the backend
  const validApiData = apiData.filter(item => {
    const idx = monthNames.indexOf(item.month);
    return idx === -1 || idx <= currentMonthIndex;
  });

  // Maps strictly over available data; ignores any months not present in the response
  const transformedData = validApiData.map((item, index) => {
    let monthlyNewUsers = 0;

    if (index === 0) {
      monthlyNewUsers = item.cumulativeUsers;
    } else {
      const previousCumulative = validApiData[index - 1].cumulativeUsers;
      // Calculate delta safely
      monthlyNewUsers = Math.max(0, item.cumulativeUsers - previousCumulative);
    }

    return {
      month: item.month,
      totalUsers: item.cumulativeUsers, // Dark Navy Bar
      newUsers: monthlyNewUsers,        // Bright Blue Bar
    };
  });

  return (
    <div className="w-full max-w-3xl p-6 bg-white rounded-xl shadow-sm font-sans">
      <h2 className="text-xl font-bold text-[#1e293b] mb-6">User Growth</h2>

      <div className="w-full h-[279px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={transformedData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            barGap={8}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />

            {/* X-Axis: Will automatically adjust to only show Jan through Jun based on your payload */}
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 14 }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 14 }}
              allowDecimals={false}
            />

            <Tooltip
              cursor={{ fill: 'transparent' }}
              contentStyle={{
                backgroundColor: '#1e2538',
                borderRadius: '8px',
                color: '#fff',
                border: 'none'
              }}
            />

            {/* Dark Navy Bars */}
            <Bar
              dataKey="totalUsers"
              name="Total Users"
              fill="#1e293b"
              radius={[4, 4, 0, 0]}
              maxBarSize={24}
            />

            {/* Bright Blue Bars */}
            <Bar
              dataKey="newUsers"
              name="New Users This Month"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              maxBarSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
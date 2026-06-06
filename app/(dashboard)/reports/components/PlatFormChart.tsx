"use client"; // Required for Next.js App Router

import { usePlatfromChatQuery } from '@/redux/api/stats.api';
import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

interface ApiMonthData {
    month: string;
    value: number;
}

export default function PlatformChart() {
    const { data } = usePlatfromChatQuery("");
    const apiData: ApiMonthData[] = data?.result || [];

    // Guard clause for empty or missing data
    if (!apiData || apiData.length === 0) {
        return (
            <div className="w-full max-w-3xl p-6 bg-white rounded-xl shadow-sm flex items-center justify-center h-[279px] text-slate-400">
                No revenue data available.
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

    return (
        <div className="w-full max-w-6xl p-6 bg-white rounded-xl shadow-sm font-sans">
            <h2 className="text-xl font-bold text-[#1e293b] mb-6">Revenue & Fees</h2>

            <div className="w-full h-[279px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={validApiData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#f1f5f9"
                        />

                        {/* X-Axis: Will automatically adjust based on filtered data */}
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 14 }}
                            dy={10}
                        />

                        {/* Y-Axis: Formatted to show $ and k */}
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 14 }}
                            tickFormatter={(val) => `$${val}`}
                        />

                        <Tooltip
                            cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }}
                            contentStyle={{
                                backgroundColor: '#1e2538',
                                borderRadius: '8px',
                                color: '#fff',
                                border: 'none'
                            }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value: number) => [`$${value}`, 'Revenue']}
                        />

                        {/* Area Line and Fill */}
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#1e293b"
                            strokeWidth={2}
                            fill="#f1f5f9"
                            activeDot={{ r: 6, fill: '#1e293b', stroke: '#fff', strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
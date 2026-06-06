"use client";

import { useBookingPieChartQuery } from "@/redux/api/stats.api";
import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ['#1e293b', '#3b82f6', '#a855f7', '#10b981', '#f59e0b', '#ef4444'];

const formatLabel = (key: string) => {
    return key
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

const BookingPieChart = () => {
    const { data } = useBookingPieChartQuery("");

    const rawData = data?.result || {};

    // Filter out the 'total' field and map the rest to a format Recharts expects
    const chartData = Object.keys(rawData)
        .filter(key => key !== 'total' && typeof rawData[key] === 'number')
        .map((key, index) => ({
            name: formatLabel(key),
            value: rawData[key],
            fill: COLORS[index % COLORS.length]
        }))
        // It's usually best to filter out 0 values for a donut chart so paddingAngle doesn't render weird tiny gaps
        .filter(item => item.value > 0);

    const hasData = chartData.length > 0;

    return (
        <div className="w-full p-6 bg-white rounded-xl shadow-sm font-sans">
            <h2 className="text-xl font-bold text-[#1e293b] mb-6">Bookings by Category</h2>

            <div className="w-full h-[279px] flex items-center justify-center">
                {hasData ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={110}
                                cornerRadius={8}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e2538',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    border: 'none'
                                }}
                                itemStyle={{ color: '#fff' }}
                                formatter={(value: number, name: string) => [value, name]}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="text-slate-400">No booking data available.</div>
                )}
            </div>
            <div className="flex gap-5 justify-center">
                <div className="flex gap-2 items-center">
                    <h1 className="bg-black h-[10px] w-[10px] rounded-full"></h1>
                    <p className="text-gray-500">House Rental</p>
                </div>
                <div className="flex gap-2 items-center">
                    <h1 className="bg-blue-600 h-[10px] w-[10px] rounded-full"></h1>
                    <p className="text-gray-500">Car Rental</p>
                </div>
                <div className="flex gap-2 items-center">
                    <h1 className="bg-purple-600 h-[10px] w-[10px] rounded-full"></h1>
                    <p className="text-gray-500">Experiences</p>
                </div>
            </div>
        </div>
    );
};

export default BookingPieChart;

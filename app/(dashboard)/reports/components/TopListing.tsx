"use client";

import Link from "next/link";
import { useTopListingQuery } from "@/redux/api/stats.api";

const TopListing = () => {
  const { data, isLoading } = useTopListingQuery("");

  if (isLoading) {
    return (
      <div className="w-full rounded-xl p-5 sm:p-6 bg-white shadow-xs border border-gray-100 overflow-hidden">
        <h2 className="text-xl font-bold text-[#1e293b]">Top Performing Listings</h2>

        <div className="mt-4 space-y-3">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-b-0 animate-pulse"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1 pr-3">
                <div className="h-5 w-6 bg-gray-200 rounded shrink-0" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="h-4 w-3/4 max-w-[160px] bg-gray-200 rounded" />
                  <div className="h-3.5 w-1/2 max-w-[100px] bg-gray-200 rounded" />
                </div>
              </div>

              <div className="shrink-0 text-right space-y-1">
                <div className="h-4 w-16 bg-gray-200 rounded ml-auto" />
                <div className="h-3.5 w-14 bg-gray-200 rounded ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data?.result?.length) {
    return (
      <div className="w-full rounded-xl p-5 sm:p-6 bg-white shadow-xs border border-gray-100 overflow-hidden">
        <h2 className="text-xl font-bold text-[#1e293b]">Top Performing Listings</h2>

        <div className="h-[260px] flex items-center justify-center">
          <p className="text-gray-400 text-sm">No listing data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl p-5 sm:p-6 bg-white shadow-xs border border-gray-100 overflow-hidden">
      <h2 className="text-xl font-bold text-[#1e293b]">Top Performing Listings</h2>

      <div className="mt-4 divide-y divide-gray-100">
        {data.result.map((listing: any, index: number) => {
          const propertyId = listing.id;

          return (
            <Link
              key={propertyId || index}
              href={propertyId ? `/listings/${propertyId}` : "#"}
              className="flex items-center justify-between py-3 px-2 -mx-2 hover:bg-gray-50/80 rounded-xl transition-colors cursor-pointer group"
              title={listing.title || "View Property Details"}
            >
              {/* Left Section: Rank + Title & Host */}
              <div className="flex items-center gap-3 min-w-0 flex-1 pr-3">
                <span className="text-sm font-semibold text-gray-400 shrink-0 w-6">
                  #{index + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <h3
                    className="font-medium text-sm text-gray-900 truncate group-hover:text-bprimary transition-colors"
                    title={listing.title}
                  >
                    {listing.title || "Untitled Property"}
                  </h3>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {listing.host?.fullName || "Unknown Host"}
                  </p>
                </div>
              </div>

              {/* Right Section: Price & Bookings */}
              <div className="shrink-0 text-right">
                <p className="font-semibold text-sm sm:text-base text-gray-900 whitespace-nowrap">
                  Kz {listing.basePrice !== undefined ? listing.basePrice : "—"}
                </p>
                <p className="text-xs text-gray-500 whitespace-nowrap mt-0.5">
                  {listing.bookingCount ?? 0} bookings
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TopListing;
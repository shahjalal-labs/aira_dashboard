"use client";

import { useTopListingQuery } from "@/redux/api/stats.api";

const TopListing = () => {
  const { data, isLoading } = useTopListingQuery("");

  if (isLoading) {
    return (
      <div className="rounded-lg p-6 bg-white">
        <h1 className="text-xl font-medium">Top Performing Listings</h1>

        <div className="mt-4 space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="flex justify-between items-center py-2 border-b animate-pulse"
            >
              <div className="flex items-center space-x-4">
                <div className="h-5 w-8 bg-gray-200 rounded" />
                <div>
                  <div className="h-5 w-40 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                </div>
              </div>

              <div className="text-right">
                <div className="h-6 w-20 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-16 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data?.result?.length) {
    return (
      <div className="rounded-lg p-6 bg-white">
        <h1 className="text-xl font-medium">Top Performing Listings</h1>

        <div className="h-[300px] flex items-center justify-center">
          <p className="text-gray-400 text-lg">No listing data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg p-6 bg-white">
      <h1 className="text-xl font-medium">Top Performing Listings</h1>

      <div className="mt-4">
        {data.result.map((listing: any, index: number) => (
          <div
            key={index}
            className="flex justify-between items-center py-2 border-b"
          >
            <div className="flex items-center space-x-4">
              <h1 className="text-gray-500">#{index + 1}</h1>

              <div>
                <h1 className="font-medium">{listing.title}</h1>
                <h1 className="text-sm text-gray-500">
                  {listing.host?.fullName}
                </h1>
              </div>
            </div>

            <div>
              <h1 className="font-medium text-xl">
                Kz {listing.basePrice}
              </h1>
              <h1 className="text-sm text-gray-500">
                {listing.bookingCount} bookings
              </h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopListing;
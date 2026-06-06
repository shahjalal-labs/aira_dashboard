"use client";

import { useTopListingQuery } from "@/redux/api/stats.api";

const TopListing = () => {
  const { data } = useTopListingQuery("");

  console.log(data?.result);
  return (
    <div className="rounded-lg p-6 bg-white">
      <h1 className="text-2xl font-medium">Top Performing Listings</h1>
      <div className="mt-4">
        {data?.result?.map((listing: any, index: number) => (
          <div
            key={index}
            className="flex justify-between items-center py-2 border-b"
          >
            <div className="flex items-center space-x-4">
              <h1 className="text-gray-500">#{index + 1}</h1>
              <div>
                <h1 className="font-medium text-xl">{listing.title}</h1>
                <h1 className="text-sm text-gray-500">
                  {listing.host?.fullName}
                </h1>
              </div>
            </div>
            <div>
              <h1 className="font-medium text-xl">${listing.basePrice}</h1>
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

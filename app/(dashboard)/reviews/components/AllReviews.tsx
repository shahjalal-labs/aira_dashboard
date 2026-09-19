"use client";

import { useAllReviewsQuery } from "@/redux/api/booking.api";
import { useState } from "react";
import Pagination from "@/components/Common/Pagination";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { FaArrowRightLong } from "react-icons/fa6";

const AllReviews = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading } = useAllReviewsQuery({ page, limit, searchTerm });

  console.log(data?.result);

  const totalPage = data?.result?.meta?.totalPages;
  const total = data?.result?.meta?.total;
  return (
    <div>
      <div>
        <input
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          type="text"
          placeholder="Search reviews and feedback..."
          className="border bg-white px-3 py-1.5 sm:py-2 rounded-[9px] text-xs sm:text-sm focus:outline-none focus:border-bprimary w-full sm:w-72 mt-2 sm:mt-4 mb-4"
        />
        <div>
          {data?.result?.data?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 mt-2">
              {data?.result?.data?.map((review: any) => (
                <div key={review.id} className="p-4 bg-white rounded-xl shadow-xs border border-gray-100 hover:shadow-md transition-all">
                  <div className="flex items-center gap-2">
                    <Rating style={{ maxWidth: 80 }} value={review.rating} />
                    <h1 className="bg-green-50 px-4 py-1 rounded-md text-green-500 text-xs">
                      Published
                    </h1>
                  </div>
                  <p className="py-2">{review.comment}</p>
                  <div className="flex items-center gap-1">
                    <h1>{review.reviewer?.fullName}</h1>
                    <FaArrowRightLong />
                    <h1 className="text-gray-400">
                      {review.target?.title || review.target?.name} •{" "}
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString()
                        : ""}
                    </h1>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 mt-2">
                  {[1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className="h-28 w-full bg-gray-200 rounded animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-red-500 text-center pt-12 text-4xl font-medium">
                  No reviews found.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="mt-12 w-full">
        {data?.result?.data?.length > 0 && (
          <Pagination
            totalPage={totalPage}
            page={page}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
            total={total}
          />
        )}
      </div>
    </div>
  );
};

export default AllReviews;

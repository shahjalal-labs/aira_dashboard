"use client";

import { useAllReviewsQuery } from "@/redux/api/booking.api";
import { useState } from "react";
import Pagination from "@/components/Common/Pagination";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { FaArrowRightLong } from "react-icons/fa6";

const AllReviews = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { data } = useAllReviewsQuery({ page, searchTerm });

  console.log(data?.result);

  const totalPage = data?.result?.meta?.totalPages;
  return (
    <div>
      <div>
        <input
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          placeholder="Search reviews and feedback"
          className="border bg-white w-1/4 p-2 mt-12 rounded-[7px] py-1"
        />
        <div>
          {data?.result?.data?.length > 0 ? (
            <div className="grid grid-cols-3 gap-4 mt-4">
              {data?.result?.data?.map((review: any) => (
                <div key={review.id} className="p-4 bg-white rounded-lg shadow">
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
                    <h1 className="text-gray-400">{review.target?.title || review.target?.name} • {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}</h1>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-red-500 text-center pt-12 text-4xl font-medium">No reviews found.</p>
          )}
        </div>
      </div>
     <div className="flex justify-center mt-12">
         {data?.result?.data?.length > 0 && (
        <Pagination totalPage={totalPage} page={page} setPage={setPage} />
      )}
     </div>
    </div>
  );
};

export default AllReviews;

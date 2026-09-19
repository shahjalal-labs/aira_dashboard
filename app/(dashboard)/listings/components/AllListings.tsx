"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { X, CarFront } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NoData from "@/components/Common/NoData";
import { FaStar } from "react-icons/fa";
import Pagination from "@/components/Common/Pagination";
import { IoCheckmarkOutline, IoRestaurant } from "react-icons/io5";
import {
  useAllListingsQuery,
  useListingStatsQuery,
} from "@/redux/api/listing.api";
import { RiHomeLine } from "react-icons/ri";
import { GiCruiser } from "react-icons/gi";
import { FaRegFileAlt } from "react-icons/fa";

const AllListings = () => {
  const searchParams = useSearchParams();
  const queryStatus = searchParams.get("status") || "";

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [active, setActive] = useState("");
  const [status, setStatus] = useState(queryStatus);

  useEffect(() => {
    if (queryStatus) {
      setStatus(queryStatus);
    }
  }, [queryStatus]);

  const {
    data: users,
    isLoading,
    isFetching,
  } = useAllListingsQuery({
    page,
    limit,
    searchTerm: searchTerm || "",
    status,
    type: active,
  });

  const { data: stats } = useListingStatsQuery("");

  const totalPage = users?.result?.meta?.totalPages;
  const total = users?.result?.meta?.total;

  console.log(users?.result);

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl font-medium">Listings</h1>
        <p className="text-[#555555] text-xs pb-3 sm:pb-4">Manage all listings</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2 sm:gap-3">
          {/* 1. All Listings */}
          <div
            className={`col-span-2 sm:col-span-1 flex items-center justify-between p-2.5 sm:p-3 transition-all duration-200 ${
              active === ""
                ? "bg-bprimary/10 border-2 border-bprimary shadow-xs"
                : "bg-white hover:shadow-md border border-gray-100"
            } rounded-xl shadow-xs cursor-pointer`}
            onClick={() => {
              setActive("");
              setPage(1);
            }}
          >
            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                All Listings
              </h4>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-lg sm:text-2xl font-bold text-gray-900 leading-none">
                  {stats?.result?.allProperties ?? 0}
                </span>
              </div>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-2 rounded-lg shrink-0 ml-2">
              <FaRegFileAlt size={18} />
            </div>
          </div>

          {/* 2. House Rentals */}
          <div
            className={`flex items-center justify-between p-2.5 sm:p-3 transition-all duration-200 ${
              active === "HOUSE_RENTAL"
                ? "bg-bprimary/10 border-2 border-bprimary shadow-xs"
                : "bg-white hover:shadow-md border border-gray-100"
            } rounded-xl shadow-xs cursor-pointer`}
            onClick={() => {
              setActive("HOUSE_RENTAL");
              setPage(1);
            }}
          >
            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                House Rentals
              </h4>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-lg sm:text-2xl font-bold text-gray-900 leading-none">
                  {stats?.result?.houseRentalCount ?? 0}
                </span>
              </div>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-2 rounded-lg shrink-0 ml-2">
              <RiHomeLine size={18} />
            </div>
          </div>

          {/* 3. Car Rentals */}
          <div
            className={`flex items-center justify-between p-2.5 sm:p-3 transition-all duration-200 ${
              active === "CAR_RENTAL"
                ? "bg-bprimary/10 border-2 border-bprimary shadow-xs"
                : "bg-white hover:shadow-md border border-gray-100"
            } rounded-xl shadow-xs cursor-pointer`}
            onClick={() => {
              setActive("CAR_RENTAL");
              setPage(1);
            }}
          >
            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                Car Rentals
              </h4>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-lg sm:text-2xl font-bold text-gray-900 leading-none">
                  {stats?.result?.carRentalCount ?? 0}
                </span>
              </div>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-2 rounded-lg shrink-0 ml-2">
              <CarFront size={18} />
            </div>
          </div>

          {/* 4. Experiences */}
          <div
            className={`flex items-center justify-between p-2.5 sm:p-3 transition-all duration-200 ${
              active === "EXPERIENCE"
                ? "bg-bprimary/10 border-2 border-bprimary shadow-xs"
                : "bg-white hover:shadow-md border border-gray-100"
            } rounded-xl shadow-xs cursor-pointer`}
            onClick={() => {
              setActive("EXPERIENCE");
              setPage(1);
            }}
          >
            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                Experiences
              </h4>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-lg sm:text-2xl font-bold text-gray-900 leading-none">
                  {stats?.result?.experienceCount ?? 0}
                </span>
              </div>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-2 rounded-lg shrink-0 ml-2">
              <GiCruiser size={18} />
            </div>
          </div>

          {/* 5. Restaurants */}
          <div
            className={`flex items-center justify-between p-2.5 sm:p-3 transition-all duration-200 ${
              active === "RESTAURANT"
                ? "bg-bprimary/10 border-2 border-bprimary shadow-xs"
                : "bg-white hover:shadow-md border border-gray-100"
            } rounded-xl shadow-xs cursor-pointer`}
            onClick={() => {
              setActive("RESTAURANT");
              setPage(1);
            }}
          >
            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                Restaurants
              </h4>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-lg sm:text-2xl font-bold text-gray-900 leading-none">
                  {stats?.result?.restaurantCount ?? 0}
                </span>
              </div>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-2 rounded-lg shrink-0 ml-2">
              <IoRestaurant size={18} />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4 mb-5 sm:mb-6">
          <input
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            type="text"
            placeholder="Search properties..."
            className="border bg-white px-3 py-1.5 sm:py-2 rounded-[9px] text-xs sm:text-sm focus:outline-none focus:border-bprimary w-full sm:w-64"
          />
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 shrink-0">
            <button
              type="button"
              onClick={() => {
                setStatus("");
                setPage(1);
              }}
              className={`px-4 sm:px-6 py-1.5 sm:py-2 border rounded-[9px] cursor-pointer transition text-xs sm:text-sm font-medium border-bprimary shrink-0 ${
                status === ""
                  ? "bg-bprimary text-white"
                  : "bg-bprimary/10 text-bprimary hover:bg-bprimary/20"
              }`}
            >
              All Status
            </button>
            <button
              type="button"
              onClick={() => {
                setStatus(status === "active" ? "" : "active");
                setPage(1);
              }}
              className={`px-4 sm:px-6 py-1.5 sm:py-2 border rounded-[9px] cursor-pointer transition text-xs sm:text-sm font-medium border-green-500 shrink-0 ${
                status === "active"
                  ? "bg-green-500 text-white"
                  : "bg-green-50 text-green-500 hover:bg-green-100"
              }`}
            >
              Published ({stats?.result?.activeCount ?? 0})
            </button>
            <button
              type="button"
              onClick={() => {
                setStatus(status === "pending" ? "" : "pending");
                setPage(1);
              }}
              className={`px-4 sm:px-6 py-1.5 sm:py-2 border rounded-[9px] cursor-pointer transition text-xs sm:text-sm font-medium border-yellow-500 shrink-0 ${
                status === "pending"
                  ? "bg-yellow-500 text-white"
                  : "bg-yellow-50 text-yellow-500 hover:bg-yellow-100"
              }`}
            >
              Draft ({stats?.result?.pendingCount ?? 0})
            </button>
            <button
              type="button"
              onClick={() => {
                setStatus(status === "rejected" ? "" : "rejected");
                setPage(1);
              }}
              className={`px-4 sm:px-6 py-1.5 sm:py-2 border rounded-[9px] cursor-pointer transition text-xs sm:text-sm font-medium border-red-500 shrink-0 ${
                status === "rejected"
                  ? "bg-red-500 text-white"
                  : "bg-red-50 text-red-500 hover:bg-red-100"
              }`}
            >
              Rejected ({stats?.result?.rejectedCount ?? 0})
            </button>
          </div>
        </div>
      </div>
      <div className="border border-gray-300 p-2  mb-6 bg-white rounded-xl">
        <Table className="rounded-lg min-w-[900px]">
          <TableHeader className="bg-gray-50 text-gray-400">
            <TableRow>
              <TableHead className="w-[250px] whitespace-nowrap">
                LISTING
              </TableHead>
              <TableHead>TYPE</TableHead>
              <TableHead>HOST</TableHead>
              <TableHead>PRICE</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>RATING</TableHead>
              <TableHead>BOOKING</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users?.result?.data?.length > 0 ? (
              users.result.data.map((user: any) => {
                const isCurrent = activeUserId === user.id;

                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={
                              user?.images[0] ||
                              "https://api.zenexcloud.com/emdadullah/uploads/messages/files/1780416667413-yjvj4j0m9i.png"
                            }
                            alt={user?.title}
                          />
                          <AvatarFallback>{user?.title}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className=" text-gray-800">{user?.title}</span>
                          <span className="text-xs  text-gray-500">
                            {user?.location.city}, {user?.location.state},{" "}
                            {user?.location.country}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {user?.type === "EXPERIENCE" && (
                          <span className="bg-yellow-50 text-yellow-600 px-2 py-1 rounded-full text-xs">
                            Experiences
                          </span>
                        )}
                        {user?.type === "HOUSE_RENTAL" && (
                          <span className="bg-gray-50 text-gray-700 px-2 py-1 rounded-full text-xs">
                            House Rentals
                          </span>
                        )}
                        {user?.type === "CAR_RENTAL" && (
                          <span className="bg-bprimary/10 text-bprimary px-2 py-1 rounded-full text-xs">
                            Car Rentals
                          </span>
                        )}
                        {user?.type === "RESTAURANT" && (
                          <span className="bg-purple-50 text-purple-800 px-2 py-1 rounded-full text-xs">
                            Restaurants
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>{user?.host?.fullName}</TableCell>
                    <TableCell>Kz {user?.basePrice}/night</TableCell>
                    <TableCell>
                      <div>
                        {user?.status === "DRAFT" && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            Draft
                          </span>
                        )}
                        {user?.status === "PUBLISHED" && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                            Published
                          </span>
                        )}
                        {user?.status === "REJECTED" && (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                            Rejected
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex text-black gap-1 items-center">
                        <FaStar></FaStar> {user?.averageRating}
                      </div>
                    </TableCell>
                    <TableCell>{user?.bookingCount}</TableCell>

                    <TableCell>
                      {user?.status === "DRAFT" ? (
                        <div className="flex gap-2">
                          <button className="text-white bg-red-500 p-1 rounded-[9px]">
                            <X size={20} />
                          </button>
                          <button className="text-white bg-green-500 p-1 rounded-[9px]">
                            <IoCheckmarkOutline size={20} />
                          </button>
                        </div>
                      ) : (
                        "---"
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <NoData
                title="Listing"
                isLoading={isLoading}
                isFetching={isFetching}
              />
            )}
          </TableBody>
        </Table>

        {users?.result?.data?.length > 0 && (
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

export default AllListings;

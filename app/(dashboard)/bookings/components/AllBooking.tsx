"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { X, CarFront } from "lucide-react";
import NoData from "@/components/Common/NoData";
import Pagination from "@/components/Common/Pagination";
import { IoCheckmarkOutline, IoRestaurant } from "react-icons/io5";
import { RiHomeLine } from "react-icons/ri";
import { GiCruiser } from "react-icons/gi";
import {
  useBookingStatsQuery,
  useAllBookingQuery,
} from "@/redux/api/booking.api";
import { FaHotel } from "react-icons/fa6";

const AllBookings = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [active, setActive] = useState("");
  const [status, setStatus] = useState("");

  const {
    data: users,
    isLoading,
    isFetching,
  } = useAllBookingQuery({
    page,
    limit,
    searchTerm: searchTerm || "",
    status,
    propertyType: active,
  });

  const { data: stats } = useBookingStatsQuery("");

  const totalPage = users?.result?.meta?.totalPages;
  const total = users?.result?.meta?.total;

  console.log(stats?.result);

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl font-medium">Property Booking</h1>
        <p className="text-[#555555] text-xs pb-3 sm:pb-4">
          View and manage all property bookings
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2 sm:gap-3">
          {/* 1. Total Property Bookings */}
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
                Total Bookings
              </h4>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-lg sm:text-2xl font-bold text-gray-900 leading-none">
                  {stats?.result?.totalBookings ?? 0}
                </span>
              </div>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-2 rounded-lg shrink-0 ml-2">
              <RiHomeLine size={18} />
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
                  {stats?.result?.totalPropertyBookings ?? 0}
                </span>
              </div>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-2 rounded-lg shrink-0 ml-2">
              <FaHotel size={18} />
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
                  {stats?.result?.totalCarRentalBookings ?? 0}
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
                  {stats?.result?.totalExperienceBookings ?? 0}
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
                  {stats?.result?.totalRestaurantBookings ?? 0}
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
            placeholder="Search property booking..."
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
                setStatus(status === "CONFIRMED" ? "" : "CONFIRMED");
                setPage(1);
              }}
              className={`px-4 sm:px-6 py-1.5 sm:py-2 border rounded-[9px] cursor-pointer transition text-xs sm:text-sm font-medium border-green-500 shrink-0 ${
                status === "CONFIRMED"
                  ? "bg-green-500 text-white"
                  : "bg-green-50 text-green-500 hover:bg-green-100"
              }`}
            >
              Confirmed ({stats?.result?.confirmedCount ?? 0})
            </button>
            <button
              type="button"
              onClick={() => {
                setStatus(status === "PENDING" ? "" : "PENDING");
                setPage(1);
              }}
              className={`px-4 sm:px-6 py-1.5 sm:py-2 border rounded-[9px] cursor-pointer transition text-xs sm:text-sm font-medium border-yellow-500 shrink-0 ${
                status === "PENDING"
                  ? "bg-yellow-500 text-white"
                  : "bg-yellow-50 text-yellow-500 hover:bg-yellow-100"
              }`}
            >
              Pending ({stats?.result?.pendingCount ?? 0})
            </button>
            <button
              type="button"
              onClick={() => {
                setStatus(status === "CANCELLED" ? "" : "CANCELLED");
                setPage(1);
              }}
              className={`px-4 sm:px-6 py-1.5 sm:py-2 border rounded-[9px] cursor-pointer transition text-xs sm:text-sm font-medium border-red-500 shrink-0 ${
                status === "CANCELLED"
                  ? "bg-red-500 text-white"
                  : "bg-red-50 text-red-500 hover:bg-red-100"
              }`}
            >
              Cancelled ({stats?.result?.cancelledCount ?? 0})
            </button>
          </div>
        </div>
      </div>
      <div className="border border-gray-300 p-2 mb-6 bg-white rounded-xl">
        <Table className="rounded-lg min-w-[900px]">
          <TableHeader className="bg-gray-50 text-gray-400">
            <TableRow>
              <TableHead className="w-[250px] whitespace-nowrap">
                BOOKING ID
              </TableHead>
              <TableHead>GUEST</TableHead>
              <TableHead>PROPERTY</TableHead>
              <TableHead>CHECK-IN</TableHead>
              <TableHead>CHECK-OUT</TableHead>
              <TableHead>AMOUNT</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users?.result?.data?.length > 0 ? (
              users.result.data.map((user: any) => {
                const isCurrent = activeUserId === user.id;

                return (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user?.guest?.fullName}</TableCell>
                    <TableCell>{user?.property?.title}</TableCell>
                    <TableCell>
                      {user?.checkInDate
                        ? new Date(user.checkInDate).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {user?.checkOutDate
                        ? new Date(user.checkOutDate).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>Kz {user?.totalPrice?.toLocaleString() ?? user?.totalPrice}</TableCell>
                    <TableCell>
                      <div>
                        {user?.status === "PENDING" && (
                          <span className="bg-yellow-50 text-yellow-600 px-2 py-1 rounded-full text-xs">
                            Pending
                          </span>
                        )}
                        {user?.status === "CONFIRMED" && (
                          <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs">
                            Confirmed
                          </span>
                        )}
                        {user?.status === "CANCELLED" && (
                          <span className="bg-red-50 text-red-700 px-2 py-1 rounded-full text-xs">
                            Cancelled
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user?.status === "PENDING" ? (
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
                title="Booking"
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

export default AllBookings;

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
import { useRouter } from "next/navigation";
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

const getBookingStatusBadge = (status?: string) => {
  const normalized = (status || "").toUpperCase();

  switch (normalized) {
    case "CONFIRMED":
      return {
        label: "Confirmed",
        badgeClass: "bg-green-50 text-green-700 border border-green-200",
        dotClass: "bg-green-500",
      };
    case "APPROVED":
      return {
        label: "Approved",
        badgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        dotClass: "bg-emerald-500",
      };
    case "PENDING":
      return {
        label: "Pending",
        badgeClass: "bg-yellow-50 text-yellow-700 border border-yellow-200",
        dotClass: "bg-yellow-500",
      };
    case "COMPLETED":
      return {
        label: "Completed",
        badgeClass: "bg-blue-50 text-blue-700 border border-blue-200",
        dotClass: "bg-blue-500",
      };
    case "CANCELLED":
      return {
        label: "Cancelled",
        badgeClass: "bg-red-50 text-red-700 border border-red-200",
        dotClass: "bg-red-500",
      };
    default:
      return {
        label: status || "Unknown",
        badgeClass: "bg-gray-100 text-gray-700 border border-gray-200",
        dotClass: "bg-gray-400",
      };
  }
};

const AllBookings = () => {
  const router = useRouter();
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
                setStatus(status === "APPROVED" ? "" : "APPROVED");
                setPage(1);
              }}
              className={`px-4 sm:px-6 py-1.5 sm:py-2 border rounded-[9px] cursor-pointer transition text-xs sm:text-sm font-medium border-emerald-500 shrink-0 ${
                status === "APPROVED"
                  ? "bg-emerald-500 text-white"
                  : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
              }`}
            >
              Approved {stats?.result?.approvedCount !== undefined ? `(${stats.result.approvedCount})` : ""}
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
                setStatus(status === "COMPLETED" ? "" : "COMPLETED");
                setPage(1);
              }}
              className={`px-4 sm:px-6 py-1.5 sm:py-2 border rounded-[9px] cursor-pointer transition text-xs sm:text-sm font-medium border-blue-500 shrink-0 ${
                status === "COMPLETED"
                  ? "bg-blue-500 text-white"
                  : "bg-blue-50 text-blue-600 hover:bg-blue-100"
              }`}
            >
              Completed ({stats?.result?.completedCount ?? 0})
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
                  <TableRow
                    key={user.id}
                    onClick={() => router.push(`/bookings/${user.id}`)}
                    className="cursor-pointer hover:bg-gray-50/80 transition"
                  >
                    <TableCell>
                      <span className="font-mono text-xs text-gray-700 hover:text-bprimary transition">
                        {user.id}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-gray-900">
                        {user?.guest?.fullName || "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-800 line-clamp-1 max-w-[200px]" title={user?.property?.title}>
                        {user?.property?.title || "—"}
                      </span>
                    </TableCell>
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
                    <TableCell>
                      <span className="font-semibold text-gray-900">
                        Kz {user?.totalPrice?.toLocaleString() ?? user?.totalPrice}
                      </span>
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const statusInfo = getBookingStatusBadge(user?.status);
                        return (
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusInfo.badgeClass}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`}
                            />
                            {statusInfo.label}
                          </span>
                        );
                      })()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/bookings/${user.id}`);
                          }}
                          className="px-2.5 py-1 text-xs font-medium text-bprimary bg-bprimary/10 hover:bg-bprimary hover:text-white rounded-md transition cursor-pointer"
                        >
                          View
                        </button>
                      </div>
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

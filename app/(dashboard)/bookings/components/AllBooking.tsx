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
    searchTerm: searchTerm || "",
    status,
    propertyType: active,
  });

  const { data: stats } = useBookingStatsQuery("");

  const totalPage = users?.result?.meta?.totalPages;

  console.log(stats?.result);

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-xl font-medium">Property Booking</h1>
        <p className="text-[#555555] text-xs pb-4">
          View and manage all property bookings
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div
            className={`flex justify-between items-center p-4 ${active === "" ? "bg-bprimary/10 border border-bprimary" : "bg-white"} rounded-lg shadow-xl cursor-pointer`}
            onClick={() => setActive("")}
          >
            <div>
              <h4>Total Property Bookings</h4>
              <h1 className="text-3xl pt-2 font-bold">
                {stats?.result?.totalBookings}
              </h1>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-3 rounded-lg">
              <RiHomeLine></RiHomeLine>
            </div>
          </div>
          <div
            className={`flex justify-between items-center p-4 ${active === "HOUSE_RENTAL" ? "bg-bprimary/10 border border-bprimary" : "bg-white"} rounded-lg shadow-xl cursor-pointer`}
            onClick={() => setActive("HOUSE_RENTAL")}
          >
            <div>
              <h4>House Rentals</h4>
              <h1 className="text-3xl pt-2 font-bold">
                {stats?.result?.totalPropertyBookings}
               
              </h1>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-3 rounded-lg">
              <FaHotel></FaHotel>
            </div>
          </div>
          <div
            className={`flex justify-between items-center p-4 ${active === "CAR_RENTAL" ? "bg-bprimary/10 border border-bprimary" : "bg-white"} rounded-lg shadow-xl cursor-pointer`}
            onClick={() => setActive("CAR_RENTAL")}
          >
            <div>
              <h4>Car Rentals</h4>
              <h1 className="text-3xl pt-2 font-bold">
                {stats?.result?.totalCarRentalBookings}
              </h1>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-3 rounded-lg">
              <CarFront></CarFront>
            </div>
          </div>
          <div
            className={`flex justify-between items-center p-4 ${active === "EXPERIENCE" ? "bg-bprimary/10 border border-bprimary" : "bg-white"} rounded-lg shadow-xl cursor-pointer`}
            onClick={() => setActive("EXPERIENCE")}
          >
            <div>
              <h4>Experiences</h4>
              <h1 className="text-3xl pt-2 font-bold">
                {stats?.result?.totalExperienceBookings}
              </h1>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-3 rounded-lg">
              <GiCruiser size={25}></GiCruiser>
            </div>
          </div>
          <div
            className={`flex justify-between items-center p-4 ${active === "RESTAURANT" ? "bg-bprimary/10 border border-bprimary" : "bg-white"} rounded-lg shadow-xl cursor-pointer`}
            onClick={() => setActive("RESTAURANT")}
          >
            <div>
              <h4>Restaurants</h4>
              <h1 className="text-3xl pt-2 font-bold">
                {stats?.result?.totalRestaurantBookings}
              </h1>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-3 rounded-lg">
              <IoRestaurant />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="lg:flex gap-5 mb-16">
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Search property booking..."
            className="border bg-white px-2 rounded-[7px] py-1"
          />
          <h1
            onClick={() => setStatus("CONFIRMED")}
            className={`px-8 py-2 border rounded-[9px] cursor-pointer border-green-500 ${status === "CONFIRMED" ? "bg-green-500 text-white" : "bg-green-50 text-green-500"}`}
          >
            Confirmed ({stats?.result?.confirmedCount})
          </h1>
          <h1
            onClick={() => setStatus("PENDING")}
            className={`px-8 py-2 border rounded-[9px] cursor-pointer border-yellow-500 ${status === "PENDING" ? "bg-yellow-500 text-white" : "bg-yellow-50 text-yellow-500"}`}
          >
            Pending ({stats?.result?.pendingCount})
          </h1>
          <h1
            onClick={() => setStatus("CANCELLED")}
            className={`px-8 py-2 border rounded-[9px] cursor-pointer border-red-500 ${status === "CANCELLED" ? "bg-red-500 text-white" : "bg-red-50 text-red-500"}`}
          >
            Cancelled ({stats?.result?.cancelledCount})
          </h1>
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
          <Pagination totalPage={totalPage} page={page} setPage={setPage} />
        )}
      </div>
    </div>
  );
};

export default AllBookings;

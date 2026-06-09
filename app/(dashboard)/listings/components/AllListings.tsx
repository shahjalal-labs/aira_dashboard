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
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [active, setActive] = useState("");
  const [status, setStatus] = useState("");

  const {
    data: users,
    isLoading,
    isFetching,
  } = useAllListingsQuery({
    page,
    searchTerm: searchTerm || "",
    status,
    type: active,
  });

  const { data: stats } = useListingStatsQuery("");

  const totalPage = users?.result?.meta?.totalPages;

  console.log(users?.result);

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-xl font-medium">Listings</h1>
        <p className="text-[#555555] text-xs pb-4">Manage all listings</p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div
            className={`flex justify-between items-center p-4 ${active === "" ? "bg-bprimary/10 border border-bprimary" : "bg-white"} rounded-lg shadow-xl cursor-pointer`}
            onClick={() => setActive("")}
          >
            <div>
              <h4>All Listings</h4>
              <h1 className="text-3xl pt-2 font-bold">
                {stats?.result?.allProperties}
              </h1>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-3 rounded-lg">
              <FaRegFileAlt></FaRegFileAlt>
            </div>
          </div>
          <div
            className={`flex justify-between items-center p-4 ${active === "HOUSE_RENTAL" ? "bg-bprimary/10 border border-bprimary" : "bg-white"} rounded-lg shadow-xl cursor-pointer`}
            onClick={() => setActive("HOUSE_RENTAL")}
          >
            <div>
              <h4>House Rentals</h4>
              <h1 className="text-3xl pt-2 font-bold">
                {stats?.result?.houseRentalCount}
              </h1>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-3 rounded-lg">
              <RiHomeLine></RiHomeLine>
            </div>
          </div>
          <div
            className={`flex justify-between items-center p-4 ${active === "CAR_RENTAL" ? "bg-bprimary/10 border border-bprimary" : "bg-white"} rounded-lg shadow-xl cursor-pointer`}
            onClick={() => setActive("CAR_RENTAL")}
          >
            <div>
              <h4>Car Rentals</h4>
              <h1 className="text-3xl pt-2 font-bold">
                {stats?.result?.carRentalCount}
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
                {stats?.result?.experienceCount}
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
                {stats?.result?.restaurantCount}
              </h1>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-3 rounded-lg">
              <IoRestaurant size={25}></IoRestaurant>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="lg:flex gap-5 mb-16">
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Search properties..."
            className="border bg-white px-2 rounded-[7px] py-1"
          />
          <h1
            onClick={() => setStatus("active")}
            className={`px-8 py-2 border rounded-[9px] cursor-pointer border-green-500 ${status === "active" ? "bg-green-500 text-white" : "bg-green-50 text-green-500"}`}
          >
            Published ({stats?.result?.activeCount})
          </h1>
          <h1
            onClick={() => setStatus("pending")}
            className={`px-8 py-2 border rounded-[9px] cursor-pointer border-yellow-500 ${status === "pending" ? "bg-yellow-500 text-white" : "bg-yellow-50 text-yellow-500"}`}
          >
            Draft ({stats?.result?.pendingCount})
          </h1>
          <h1
            onClick={() => setStatus("rejected")}
            className={`px-8 py-2 border rounded-[9px] cursor-pointer border-red-500 ${status === "rejected" ? "bg-red-500 text-white" : "bg-red-50 text-red-500"}`}
          >
            Rejected ({stats?.result?.rejectedCount})
          </h1>
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
                    <TableCell>${user?.basePrice}/night</TableCell>
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
          <Pagination totalPage={totalPage} page={page} setPage={setPage} />
        )}
      </div>
    </div>
  );
};

export default AllListings;

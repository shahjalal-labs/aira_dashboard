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
import { X, User, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NoData from "@/components/Common/NoData";
import { useAllUsersQuery, useUserStatsQuery } from "@/redux/api/authApi";
import Pagination from "@/components/Common/Pagination";
import { toast } from "sonner";
import { IoCheckmarkOutline } from "react-icons/io5";

const AllUsers = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // 🔑 Track which row is being acted on
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [active, setActive] = useState("");
  const [status, setStatus] = useState("");

  const {
    data: users,
    isLoading,
    isFetching,
  } = useAllUsersQuery({
    page,
    searchTerm: searchTerm || "",
    status,
    role: active,
  });

  const { data: stats } = useUserStatsQuery("");

  console.log(stats?.result, "stats");

  const totalPage = users?.result?.meta?.totalPages;

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-xl font-medium">Dashboard</h1>
        <p className="text-[#555555] text-xs pb-4">
          Platform revenue tracking metrics
        </p>
        <div className="grid grid-cols-1  lg:grid-cols-3 gap-4">
          <div
            className={`flex justify-between items-center p-4 ${active === "" ? "bg-bprimary/10 border border-bprimary" : "bg-white"} rounded-lg shadow-xl cursor-pointer`}
            onClick={() => setActive("")}
          >
            <div>
              <h4>All Users</h4>
              <h1 className="text-3xl pt-2 font-bold">
                {stats?.result?.totalUsers}
              </h1>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-3 rounded-lg">
              <Users></Users>
            </div>
          </div>
          <div
            className={`flex justify-between items-center p-4 ${active === "GUEST" ? "bg-bprimary/10 border border-bprimary" : "bg-white"} rounded-lg shadow-xl cursor-pointer`}
            onClick={() => setActive("GUEST")}
          >
            <div>
              <h4>Guests</h4>
              <h1 className="text-3xl pt-2 font-bold">
                {stats?.result?.totalGuests}
              </h1>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-3 rounded-lg">
              <User></User>
            </div>
          </div>
          <div
            className={`flex justify-between items-center p-4 ${active === "HOST" ? "bg-bprimary/10 border border-bprimary" : "bg-white"} rounded-lg shadow-xl cursor-pointer`}
            onClick={() => setActive("HOST")}
          >
            <div>
              <h4>Hosts</h4>
              <h1 className="text-3xl pt-2 font-bold">
                {stats?.result?.totalHosts}
              </h1>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-3 rounded-lg">
              <User></User>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="lg:flex gap-5 mb-16">
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Search users..."
            className="border bg-white px-2 rounded-[7px] py-1"
          />
          <h1
            onClick={() => setStatus("ACTIVE")}
            className={`px-8 py-2 border rounded-[9px] cursor-pointer border-green-500 ${status === "ACTIVE" ? "bg-green-500 text-white" : "bg-green-50 text-green-500"}`}
          >
            Active ({stats?.result?.totalActive})
          </h1>
          <h1
            onClick={() => setStatus("SUSPENDED")}
            className={`px-8 py-2 border rounded-[9px] cursor-pointer border-red-500 ${status === "SUSPENDED" ? "bg-red-500 text-white" : "bg-red-50 text-red-500"}`}
          >
            Suspended ({stats?.result?.totalSuspended})
          </h1>
          <h1
            onClick={() => setStatus("PENDING")}
            className={`px-8 py-2 border rounded-[9px] cursor-pointer border-yellow-500 ${status === "PENDING" ? "bg-yellow-500 text-white" : "bg-yellow-50 text-yellow-500"}`}
          >
            Pending ({stats?.result?.totalPending})
          </h1>
        </div>
      </div>
      <div className="border border-gray-300 p-2  mb-6 bg-white rounded-xl">
        <Table className="rounded-lg min-w-[900px]">
          <TableHeader className="bg-gray-50 text-gray-400">
            <TableRow>
              <TableHead className="w-[250px] whitespace-nowrap">
                USER
              </TableHead>
              <TableHead>ROLE</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>VERIFIED</TableHead>
              <TableHead>BOOKINGS</TableHead>
              <TableHead>JOINED</TableHead>
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
                              user?.profileImage ||
                              "https://api.zenexcloud.com/emdadullah/uploads/messages/files/1780416667413-yjvj4j0m9i.png"
                            }
                            alt={user?.fullName}
                          />
                          <AvatarFallback>{user?.fullName}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className=" text-gray-800">
                            {user?.fullName}
                          </span>
                          <span className="text-xs  text-gray-500">
                            {user?.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>                       
                        {user?.role === "GUEST" && (
                          <span className="bg-bprimary/10 text-bprimary px-2 py-1 rounded-full text-xs">
                            {user?.role}
                          </span>
                        )}
                        {user?.role === "HOST" && (
                          <span className="bg-black text-white px-2 py-1 rounded-full text-xs">
                            {user?.role}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {user?.status === "ACTIVE" && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            Active
                          </span>
                        )}
                        {user?.status === "SUSPENDED" && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                            Suspended
                          </span>
                        )}
                        {user?.status === "PENDING" && (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                            Pending
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user?.userProfile?.subProfession || "N/A"}
                    </TableCell>
                    <TableCell>{user?.bookingsCount}</TableCell>
                    <TableCell>
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
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
                title="User"
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

export default AllUsers;

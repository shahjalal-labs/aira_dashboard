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
import { useRouter, useSearchParams } from "next/navigation";
import { User, Users, UserCheck, UserX } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NoData from "@/components/Common/NoData";
import {
  useAllUsersQuery,
  useChangeUserStatusMutation,
  useUserStatsQuery,
} from "@/redux/api/authApi";
import Pagination from "@/components/Common/Pagination";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const AllUsers = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryStatus = searchParams.get("status") || "";

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState(""); // 🔑 Track which row is being acted on
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
  } = useAllUsersQuery({
    page,
    limit,
    searchTerm: searchTerm || "",
    status,
    role: active,
  });

  const { data: stats } = useUserStatsQuery("");
  const [changeUserStatus, { isLoading: isUpdating }] =
    useChangeUserStatusMutation();

  const handleStatusChange = async (
    userId: string,
    newStatus: "ACTIVE" | "SUSPENDED"
  ) => {
    setActiveUserId(userId);
    try {
      const res = await changeUserStatus({
        id: userId,
        status: newStatus,
      }).unwrap();
      toast.success(
        res?.message || `User marked as ${newStatus.toLowerCase()} successfully`
      );
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || "Failed to update user status"
      );
    } finally {
      setActiveUserId(null);
    }
  };

  console.log(stats?.result, "stats");

  const totalPage = users?.result?.meta?.totalPages;
  const total = users?.result?.meta?.total;

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <h1 className="text-lg sm:text-xl font-medium text-gray-900">Users</h1>
        <p className="text-[#555555] text-xs pb-3">
          Manage All Users
        </p>
        <TooltipProvider delayDuration={100}>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2 sm:gap-3">
            {/* 1. All Users */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`col-span-2 sm:col-span-1 flex items-center justify-between p-2.5 sm:p-3 transition-all duration-200 ${
                    active === "" && status === ""
                      ? "bg-bprimary/10 border-2 border-bprimary shadow-xs"
                      : "bg-white hover:shadow-md border border-gray-100"
                  } rounded-xl shadow-xs cursor-pointer`}
                  onClick={() => {
                    setActive("");
                    setStatus("");
                    setPage(1);
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                      All Users
                    </h4>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-lg sm:text-2xl font-bold text-gray-800 leading-none">
                        {stats?.result?.totalUsers ?? 0}
                      </span>
                      <span className="text-[10px] text-gray-400 font-normal">
                        Hosts & Guests
                      </span>
                    </div>
                  </div>
                  <div className="bg-bprimary/10 text-bprimary p-2 rounded-lg shrink-0 ml-2">
                    <Users size={18} />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="hidden md:block text-xs max-w-xs text-center py-1.5 px-3 z-50">
                Total registered user accounts across the platform (includes both hosts and guests).
              </TooltipContent>
            </Tooltip>

            {/* 2. Guests */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`flex items-center justify-between p-2.5 sm:p-3 transition-all duration-200 ${
                    active === "GUEST"
                      ? "bg-bprimary/10 border-2 border-bprimary shadow-xs"
                      : "bg-white hover:shadow-md border border-gray-100"
                  } rounded-xl shadow-xs cursor-pointer`}
                  onClick={() => {
                    setActive(active === "GUEST" ? "" : "GUEST");
                    setPage(1);
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                      Guests
                    </h4>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-lg sm:text-2xl font-bold text-gray-800 leading-none">
                        {stats?.result?.totalGuests ?? 0}
                      </span>
                      <span className="text-[10px] text-gray-400 font-normal">
                        Guest role
                      </span>
                    </div>
                  </div>
                  <div className="bg-blue-50 text-blue-600 p-2 rounded-lg shrink-0 ml-2">
                    <User size={18} />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="hidden md:block text-xs max-w-xs text-center py-1.5 px-3 z-50">
                Total accounts registered with the Guest role.
              </TooltipContent>
            </Tooltip>

            {/* 3. Hosts */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`flex items-center justify-between p-2.5 sm:p-3 transition-all duration-200 ${
                    active === "HOST"
                      ? "bg-bprimary/10 border-2 border-bprimary shadow-xs"
                      : "bg-white hover:shadow-md border border-gray-100"
                  } rounded-xl shadow-xs cursor-pointer`}
                  onClick={() => {
                    setActive(active === "HOST" ? "" : "HOST");
                    setPage(1);
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                      Hosts
                    </h4>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-lg sm:text-2xl font-bold text-gray-800 leading-none">
                        {stats?.result?.totalHosts ?? 0}
                      </span>
                      <span className="text-[10px] text-gray-400 font-normal">
                        Host role
                      </span>
                    </div>
                  </div>
                  <div className="bg-purple-50 text-purple-600 p-2 rounded-lg shrink-0 ml-2">
                    <User size={18} />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="hidden md:block text-xs max-w-xs text-center py-1.5 px-3 z-50">
                Total accounts registered with the Host role (listings & experiences).
              </TooltipContent>
            </Tooltip>

            {/* 4. Total Active Users */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`flex items-center justify-between p-2.5 sm:p-3 transition-all duration-200 ${
                    status === "ACTIVE"
                      ? "bg-green-50 border-2 border-green-500 shadow-xs"
                      : "bg-white hover:shadow-md border border-gray-100"
                  } rounded-xl shadow-xs cursor-pointer`}
                  onClick={() => {
                    setStatus(status === "ACTIVE" ? "" : "ACTIVE");
                    setPage(1);
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                      Active Users
                    </h4>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-lg sm:text-2xl font-bold text-green-600 leading-none">
                        {stats?.result?.totalActive ?? 0}
                      </span>
                      <span className="text-[10px] text-green-600 font-medium">
                        Hosts & Guests
                      </span>
                    </div>
                  </div>
                  <div className="bg-green-100 text-green-600 p-2 rounded-lg shrink-0 ml-2">
                    <UserCheck size={18} />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="hidden md:block text-xs max-w-xs text-center py-1.5 px-3 z-50">
                Active accounts in good standing (both hosts and guests are included).
              </TooltipContent>
            </Tooltip>

            {/* 5. Total Suspended Users */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`flex items-center justify-between p-2.5 sm:p-3 transition-all duration-200 ${
                    status === "SUSPENDED"
                      ? "bg-red-50 border-2 border-red-500 shadow-xs"
                      : "bg-white hover:shadow-md border border-gray-100"
                  } rounded-xl shadow-xs cursor-pointer`}
                  onClick={() => {
                    setStatus(status === "SUSPENDED" ? "" : "SUSPENDED");
                    setPage(1);
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                      Suspended
                    </h4>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-lg sm:text-2xl font-bold text-red-600 leading-none">
                        {stats?.result?.totalSuspended ?? 0}
                      </span>
                      <span className="text-[10px] text-red-500 font-medium">
                        Hosts & Guests
                      </span>
                    </div>
                  </div>
                  <div className="bg-red-100 text-red-600 p-2 rounded-lg shrink-0 ml-2">
                    <UserX size={18} />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="hidden md:block text-xs max-w-xs text-center py-1.5 px-3 z-50">
                Suspended accounts (both hosts and guests are included).
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
      <div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4 mb-5 sm:mb-6">
          <input
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            type="text"
            placeholder="Search users..."
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
                setStatus(status === "ACTIVE" ? "" : "ACTIVE");
                setPage(1);
              }}
              className={`px-4 sm:px-6 py-1.5 sm:py-2 border rounded-[9px] cursor-pointer transition text-xs sm:text-sm font-medium border-green-500 shrink-0 ${
                status === "ACTIVE"
                  ? "bg-green-500 text-white"
                  : "bg-green-50 text-green-500 hover:bg-green-100"
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => {
                setStatus(status === "SUSPENDED" ? "" : "SUSPENDED");
                setPage(1);
              }}
              className={`px-4 sm:px-6 py-1.5 sm:py-2 border rounded-[9px] cursor-pointer transition text-xs sm:text-sm font-medium border-red-500 shrink-0 ${
                status === "SUSPENDED"
                  ? "bg-red-500 text-white"
                  : "bg-red-50 text-red-500 hover:bg-red-100"
              }`}
            >
              Suspended
            </button>
          </div>
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
              {/* <TableHead>VERIFIED</TableHead> */}
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
                  <TableRow
                    key={user.id}
                    onClick={() =>
                      router.push(
                        `/user-management/${user.id}?role=${user.role}`
                      )
                    }
                    className="cursor-pointer hover:bg-gray-50/80 transition-colors group"
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10 border border-gray-100 shadow-xs">
                          <AvatarImage
                            src={user?.profileImage || ""}
                            alt={user?.fullName || "User"}
                          />
                          <AvatarFallback className="bg-bprimary/10 text-bprimary font-semibold">
                            {user?.fullName?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900 group-hover:text-bprimary transition-colors">
                            {user?.fullName || "Unnamed User"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {user?.email || "—"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {user?.role === "GUEST" && (
                          <span className="bg-bprimary/10 text-bprimary px-2.5 py-0.5 rounded-full text-xs font-medium">
                            {user?.role}
                          </span>
                        )}
                        {user?.role === "HOST" && (
                          <span className="bg-gray-900 text-white px-2.5 py-0.5 rounded-full text-xs font-medium">
                            {user?.role}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {user?.status === "ACTIVE" && (
                          <span className="bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
                            Active
                          </span>
                        )}
                        {user?.status === "SUSPENDED" && (
                          <span className="bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
                            Suspended
                          </span>
                        )}
                        {user?.status === "PENDING" && (
                          <span className="bg-yellow-100 text-yellow-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
                            Pending
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-gray-700">
                      {user?.bookingsCount ?? 0}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </TableCell>

                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `/user-management/${user.id}?role=${user.role}`
                            )
                          }
                          className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 transition cursor-pointer"
                        >
                          View
                        </button>

                        {user?.status === "ACTIVE" ? (
                          <button
                            disabled={isUpdating && isCurrent}
                            onClick={() =>
                              handleStatusChange(user.id, "SUSPENDED")
                            }
                            className="px-3 py-1 rounded-md text-xs font-medium bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 transition cursor-pointer disabled:opacity-50"
                          >
                            {isUpdating && isCurrent
                              ? "Suspending..."
                              : "Suspend"}
                          </button>
                        ) : (
                          <button
                            disabled={isUpdating && isCurrent}
                            onClick={() =>
                              handleStatusChange(user.id, "ACTIVE")
                            }
                            className="px-3 py-1 rounded-md text-xs font-medium bg-green-50 text-green-600 hover:bg-green-600 hover:text-white border border-green-200 transition cursor-pointer disabled:opacity-50"
                          >
                            {isUpdating && isCurrent
                              ? "Activating..."
                              : "Activate"}
                          </button>
                        )}
                      </div>
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

export default AllUsers;

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
import { X, Wallet, CircleOff } from "lucide-react";
import NoData from "@/components/Common/NoData";
import Pagination from "@/components/Common/Pagination";
import { IoCheckmarkOutline } from "react-icons/io5";
import {
  useAllPayoutsQuery,
  usePayoutStatsQuery,
} from "@/redux/api/payout.api";
import { GiWallet } from "react-icons/gi";

const AllPayouts = () => {
  const searchParams = useSearchParams();
  const queryStatus = searchParams.get("status") || "";

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
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
  } = useAllPayoutsQuery({
    page,
    limit,
    searchTerm: searchTerm || "",
    status,
  });

  const { data: stats } = usePayoutStatsQuery("");

  const totalPage = users?.result?.meta?.totalPages;
  const total = users?.result?.meta?.total;

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl font-medium">Properties Payments & Payouts</h1>
        <p className="text-[#555555] text-xs pb-3 sm:pb-4">
          Track transactions, payouts, and refunds
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {/* 1. Total Platform Balance */}
          <div className="flex items-center justify-between p-2.5 sm:p-3 bg-white hover:shadow-md border border-gray-100 rounded-xl shadow-xs transition-all duration-200">
            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                Total Platform Balance
              </h4>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base sm:text-xl font-bold text-gray-900 leading-none truncate">
                  Kz {stats?.result?.totalPlatformBalance?.toLocaleString() ?? 0}
                </span>
              </div>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-2 rounded-lg shrink-0 ml-2">
              <Wallet size={18} />
            </div>
          </div>

          {/* 2. Total Host Balance */}
          <div className="flex items-center justify-between p-2.5 sm:p-3 bg-white hover:shadow-md border border-gray-100 rounded-xl shadow-xs transition-all duration-200">
            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                Total Host Balance
              </h4>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base sm:text-xl font-bold text-gray-900 leading-none truncate">
                  Kz {stats?.result?.totalHostPayoutsBalance?.toLocaleString() ?? 0}
                </span>
              </div>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-2 rounded-lg shrink-0 ml-2">
              <Wallet size={18} />
            </div>
          </div>

          {/* 3. Payout Succeed */}
          <div className="flex items-center justify-between p-2.5 sm:p-3 bg-white hover:shadow-md border border-gray-100 rounded-xl shadow-xs transition-all duration-200">
            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                Payout Succeed
              </h4>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-lg sm:text-2xl font-bold text-gray-900 leading-none">
                  {stats?.result?.payoutSucceededCount ?? 0}
                </span>
              </div>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-2 rounded-lg shrink-0 ml-2">
              <GiWallet size={18} />
            </div>
          </div>

          {/* 4. Payout Failed */}
          <div className="flex items-center justify-between p-2.5 sm:p-3 bg-white hover:shadow-md border border-gray-100 rounded-xl shadow-xs transition-all duration-200">
            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                Payout Failed
              </h4>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-lg sm:text-2xl font-bold text-gray-900 leading-none">
                  {stats?.result?.payoutFailedCount ?? 0}
                </span>
              </div>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-2 rounded-lg shrink-0 ml-2">
              <CircleOff size={18} />
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
            placeholder="Search payouts..."
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
                setStatus(status === "SUCCEEDED" ? "" : "SUCCEEDED");
                setPage(1);
              }}
              className={`px-4 sm:px-6 py-1.5 sm:py-2 border rounded-[9px] cursor-pointer transition text-xs sm:text-sm font-medium border-green-500 shrink-0 ${
                status === "SUCCEEDED"
                  ? "bg-green-500 text-white"
                  : "bg-green-50 text-green-500 hover:bg-green-100"
              }`}
            >
              Succeeded ({users?.result?.meta?.succeededCount ?? 0})
            </button>
            <button
              type="button"
              onClick={() => {
                setStatus(status === "PROCESSING" ? "" : "PROCESSING");
                setPage(1);
              }}
              className={`px-4 sm:px-6 py-1.5 sm:py-2 border rounded-[9px] cursor-pointer transition text-xs sm:text-sm font-medium border-bprimary shrink-0 ${
                status === "PROCESSING"
                  ? "bg-bprimary text-white"
                  : "bg-bprimary/10 text-bprimary hover:bg-bprimary/20"
              }`}
            >
              Processing ({users?.result?.meta?.processingCount ?? 0})
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
              Pending ({users?.result?.meta?.pendingCount ?? 0})
            </button>
            <button
              type="button"
              onClick={() => {
                setStatus(status === "FAILED" ? "" : "FAILED");
                setPage(1);
              }}
              className={`px-4 sm:px-6 py-1.5 sm:py-2 border rounded-[9px] cursor-pointer transition text-xs sm:text-sm font-medium border-red-500 shrink-0 ${
                status === "FAILED"
                  ? "bg-red-500 text-white"
                  : "bg-red-50 text-red-500 hover:bg-red-100"
              }`}
            >
              Failed ({users?.result?.meta?.failedCount ?? 0})
            </button>
          </div>
        </div>
      </div>
      <div className="border border-gray-300 p-2  mb-6 bg-white rounded-xl">
        <Table className="rounded-lg min-w-[900px]">
          <TableHeader className="bg-gray-50 text-gray-400">
            <TableRow>
              <TableHead className="w-[250px] whitespace-nowrap">
                TRANSACTION ID
              </TableHead>
              <TableHead>HOST</TableHead>
              <TableHead>AMOUNT</TableHead>
              <TableHead>DATE</TableHead>
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
                    <TableCell>{user.stripeTransferId || "----"}</TableCell>
                    <TableCell>{user?.host?.fullName}</TableCell>
                    <TableCell>Kz {user?.amount?.toLocaleString() ?? user?.amount}</TableCell>
                    <TableCell>
                      {user?.requestedAt
                        ? new Date(user.requestedAt).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <div>
                        {user?.status === "SUCCEEDED" && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            Succeeded
                          </span>
                        )}
                        {user?.status === "PROCESSING" && (
                          <span className="bg-bprimary/10 text-bprimary px-2 py-1 rounded-full text-xs">
                            Processing
                          </span>
                        )}
                        {user?.status === "FAILED" && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                            Failed
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
                title="Payout"
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

export default AllPayouts;

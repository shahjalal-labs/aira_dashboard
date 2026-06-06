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
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  const {
    data: users,
    isLoading,
    isFetching,
  } = useAllPayoutsQuery({
    page,
    searchTerm: searchTerm || "",
    status,
  });

  const { data: stats } = usePayoutStatsQuery("");

  const totalPage = users?.result?.meta?.totalPages;

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-xl font-medium">Properties Payments & Payouts</h1>
        <p className="text-[#555555] text-xs pb-4">
          Track transactions, payouts, and refundes
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            className={`flex justify-between items-center p-4 bg-white rounded-lg shadow-xl`}
          >
            <div>
              <h4>Total Platform Balance</h4>
              <h1 className="text-3xl pt-2 font-bold">
                ${stats?.result?.totalPlatformBalance}
              </h1>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-3 rounded-lg">
              <Wallet></Wallet>
            </div>
          </div>
          <div
            className={`flex justify-between items-center p-4 bg-white rounded-lg shadow-xl`}
          >
            <div>
              <h4>Total Host Balance</h4>
              <h1 className="text-3xl pt-2 font-bold">
                ${stats?.result?.totalHostPayoutsBalance}
              </h1>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-3 rounded-lg">
              <Wallet></Wallet>
            </div>
          </div>
          <div
            className={`flex justify-between items-center p-4 bg-white rounded-lg shadow-xl`}
          >
            <div>
              <h4>Payout Succeed</h4>
              <h1 className="text-3xl pt-2 font-bold">
                {stats?.result?.payoutSucceededCount}
              </h1>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-3 rounded-lg">
              <GiWallet></GiWallet>
            </div>
          </div>
          <div
            className={`flex justify-between items-center p-4 bg-white rounded-lg shadow-xl`}
          >
            <div>
              <h4>Payout Failed</h4>
              <h1 className="text-3xl pt-2 font-bold">
                {stats?.result?.payoutFailedCount}
              </h1>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-3 rounded-lg">
              <CircleOff size={25}></CircleOff>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="lg:flex gap-5 mb-16">
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Search payouts..."
            className="border bg-white px-2 rounded-[7px] py-1"
          />
          <h1
            onClick={() => setStatus("SUCCEEDED")}
            className={`px-8 py-2 border rounded-[9px] cursor-pointer border-green-500 ${status === "SUCCEEDED" ? "bg-green-500 text-white" : "bg-green-50 text-green-500"}`}
          >
            Succeeded ({users?.result?.meta?.succeededCount})
          </h1>
          <h1
            onClick={() => setStatus("PROCESSING")}
            className={`px-8 py-2 border rounded-[9px] cursor-pointer border-bprimary ${status === "PROCESSING" ? "bg-bprimary text-white" : "bg-bprimary/10 text-bprimary"}`}
          >
            Processing ({users?.result?.meta?.processingCount})
          </h1>
          <h1
            onClick={() => setStatus("PENDING")}
            className={`px-8 py-2 border rounded-[9px] cursor-pointer border-yellow-500 ${status === "PENDING" ? "bg-yellow-500 text-white" : "bg-yellow-50 text-yellow-500"}`}
          >
            Pending ({users?.result?.meta?.pendingCount})
          </h1>
          <h1
            onClick={() => setStatus("FAILED")}
            className={`px-8 py-2 border rounded-[9px] cursor-pointer border-red-500 ${status === "FAILED" ? "bg-red-500 text-white" : "bg-red-50 text-red-500"}`}
          >
            Failed ({users?.result?.meta?.failedCount})
          </h1>
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
                    <TableCell>${user?.amount}</TableCell>
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
          <Pagination totalPage={totalPage} page={page} setPage={setPage} />
        )}
      </div>
    </div>
  );
};

export default AllPayouts;

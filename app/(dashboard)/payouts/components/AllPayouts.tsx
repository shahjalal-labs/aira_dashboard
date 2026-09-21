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
import { X, Wallet, Clock, CheckCircle2, XCircle } from "lucide-react";
import NoData from "@/components/Common/NoData";
import Pagination from "@/components/Common/Pagination";
import { IoCheckmarkOutline } from "react-icons/io5";
import {
  useAllPayoutsQuery,
  usePayoutStatsQuery,
  useUpdatePayoutStatusMutation,
} from "@/redux/api/payout.api";
import { toast } from "sonner";
import ReferenceImageUploader from "./ReferenceImageUploader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const getPayoutStatusBadge = (status?: string) => {
  const normalized = (status || "").toUpperCase();
  switch (normalized) {
    case "SUCCEEDED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 size={12} className="text-emerald-600" />
          Succeeded
        </span>
      );
    case "PROCESSING":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <Clock size={12} className="text-blue-600" />
          Processing
        </span>
      );
    case "FAILED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
          <XCircle size={12} className="text-red-600" />
          Failed
        </span>
      );
    case "PENDING":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <Clock size={12} className="text-amber-600" />
          Pending
        </span>
      );
  }
};

const AllPayouts = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryStatus = searchParams.get("status") || "";

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState(queryStatus);

  // Modals state
  const [selectedPayout, setSelectedPayout] = useState<any | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isFailedModalOpen, setIsFailedModalOpen] = useState(false);
  const [isProcessingModalOpen, setIsProcessingModalOpen] = useState(false);

  const [transactionIdInput, setTransactionIdInput] = useState("");
  const [failureReasonInput, setFailureReasonInput] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const [updatePayoutStatus, { isLoading: isUpdating }] =
    useUpdatePayoutStatusMutation();

  const openProcessingModal = (payout: any) => {
    setSelectedPayout(payout);
    setTransactionIdInput(payout?.transactionId || "");
    setSelectedImages([]);
    setIsProcessingModalOpen(true);
  };

  const openSuccessModal = (payout: any) => {
    setSelectedPayout(payout);
    setTransactionIdInput(payout?.transactionId || "");
    setSelectedImages([]);
    setIsSuccessModalOpen(true);
  };

  const openFailedModal = (payout: any) => {
    setSelectedPayout(payout);
    setFailureReasonInput("");
    setIsFailedModalOpen(true);
  };

  useEffect(() => {
    if (queryStatus) {
      setStatus(queryStatus);
    }
  }, [queryStatus]);

  const {
    data: users,
    isLoading,
    isFetching,
    refetch,
  } = useAllPayoutsQuery({
    page,
    limit,
    searchTerm: searchTerm || "",
    status,
  });

  const { data: stats } = usePayoutStatsQuery("");

  const totalPage = users?.result?.meta?.totalPages;
  const total = users?.result?.meta?.total;

  const handleMarkAsProcessing = async () => {
    if (!selectedPayout) return;
    try {
      if (selectedImages.length > 0) {
        const formData = new FormData();
        formData.append("status", "PROCESSING");
        if (transactionIdInput.trim()) {
          formData.append("transactionId", transactionIdInput.trim());
        }
        selectedImages.forEach((img) => {
          formData.append("referenceImages", img);
        });
        await updatePayoutStatus({
          id: selectedPayout.id,
          data: formData,
        }).unwrap();
      } else {
        await updatePayoutStatus({
          id: selectedPayout.id,
          status: "PROCESSING",
          transactionId: transactionIdInput.trim() || undefined,
        }).unwrap();
      }
      toast.success("Payout marked as Processing");
      setIsProcessingModalOpen(false);
      setSelectedPayout(null);
      setTransactionIdInput("");
      setSelectedImages([]);
      refetch();
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || "Failed to update payout status",
      );
    }
  };

  const handleMarkAsSucceeded = async () => {
    if (!selectedPayout) return;
    try {
      if (selectedImages.length > 0) {
        const formData = new FormData();
        formData.append("status", "SUCCEEDED");
        if (transactionIdInput.trim()) {
          formData.append("transactionId", transactionIdInput.trim());
        }
        selectedImages.forEach((img) => {
          formData.append("referenceImages", img);
        });
        await updatePayoutStatus({
          id: selectedPayout.id,
          data: formData,
        }).unwrap();
      } else {
        await updatePayoutStatus({
          id: selectedPayout.id,
          status: "SUCCEEDED",
          transactionId: transactionIdInput.trim() || undefined,
        }).unwrap();
      }
      toast.success("Payout marked as Succeeded and balance deducted!");
      setIsSuccessModalOpen(false);
      setSelectedPayout(null);
      setTransactionIdInput("");
      setSelectedImages([]);
      refetch();
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || "Failed to complete payout",
      );
    }
  };

  const handleMarkAsFailed = async () => {
    if (!selectedPayout) return;
    if (!failureReasonInput.trim()) {
      toast.error("Please provide a reason for the failure");
      return;
    }
    try {
      await updatePayoutStatus({
        id: selectedPayout.id,
        status: "FAILED",
        errorMessage: failureReasonInput.trim(),
      }).unwrap();
      toast.success("Payout marked as Failed");
      setIsFailedModalOpen(false);
      setSelectedPayout(null);
      setFailureReasonInput("");
      refetch();
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || "Failed to mark payout as failed"
      );
    }
  };

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
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base sm:text-xl font-bold text-gray-900 leading-none">
                  {stats?.result?.payoutSucceededCount ?? 0}
                </span>
              </div>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-2 rounded-lg shrink-0 ml-2">
              <CheckCircle2 size={18} />
            </div>
          </div>

          {/* 4. Payout Failed */}
          <div className="flex items-center justify-between p-2.5 sm:p-3 bg-white hover:shadow-md border border-gray-100 rounded-xl shadow-xs transition-all duration-200">
            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                Payout Failed
              </h4>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base sm:text-xl font-bold text-gray-900 leading-none">
                  {stats?.result?.payoutFailedCount ?? 0}
                </span>
              </div>
            </div>
            <div className="bg-bprimary/10 text-bprimary p-2 rounded-lg shrink-0 ml-2">
              <XCircle size={18} />
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
              className={`px-4 sm:px-6 py-1.5 sm:py-2 border rounded-[9px] cursor-pointer transition text-xs sm:text-sm font-medium border-blue-500 shrink-0 ${
                status === "PROCESSING"
                  ? "bg-blue-500 text-white"
                  : "bg-blue-50 text-blue-600 hover:bg-blue-100"
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

      <div className="border border-gray-300 p-2 mb-6 bg-white rounded-xl">
        <Table className="rounded-lg min-w-[900px]">
          <TableHeader className="bg-gray-50 text-gray-400">
            <TableRow>
              <TableHead className="w-[200px] whitespace-nowrap">
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
                return (
                  <TableRow
                    key={user.id}
                    onClick={() => router.push(`/payouts/${user.id}`)}
                    className="cursor-pointer hover:bg-gray-50/80 transition"
                  >
                    <TableCell className="font-mono text-xs text-gray-700">
                      {user.transactionId || user.stripeTransferId || "----"}
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {user?.host?.fullName || "Unknown Host"}
                    </TableCell>
                    <TableCell className="font-semibold text-gray-900">
                      Kz {user?.amount?.toLocaleString() ?? user?.amount}
                    </TableCell>
                    <TableCell className="text-gray-500 text-xs">
                      {user?.requestedAt
                        ? new Date(user.requestedAt).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>{getPayoutStatusBadge(user?.status)}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      {user?.status === "PENDING" && (
                        <div className="flex items-center gap-1.5">
                          <button
                            title="Mark as Processing"
                            onClick={() => openProcessingModal(user)}
                            className="text-white bg-blue-500 hover:bg-blue-600 p-1.5 rounded-lg transition shadow-2xs cursor-pointer"
                          >
                            <Clock size={16} />
                          </button>
                          <button
                            title="Mark as Succeeded"
                            onClick={() => openSuccessModal(user)}
                            className="text-white bg-emerald-500 hover:bg-emerald-600 p-1.5 rounded-lg transition shadow-2xs cursor-pointer"
                          >
                            <IoCheckmarkOutline size={16} />
                          </button>
                          <button
                            title="Mark as Failed"
                            onClick={() => openFailedModal(user)}
                            className="text-white bg-red-500 hover:bg-red-600 p-1.5 rounded-lg transition shadow-2xs cursor-pointer"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                      {user?.status === "PROCESSING" && (
                        <div className="flex items-center gap-1.5">
                          <button
                            title="Mark as Succeeded"
                            onClick={() => openSuccessModal(user)}
                            className="text-white bg-emerald-500 hover:bg-emerald-600 p-1.5 rounded-lg transition shadow-2xs cursor-pointer"
                          >
                            <IoCheckmarkOutline size={16} />
                          </button>
                          <button
                            title="Mark as Failed"
                            onClick={() => openFailedModal(user)}
                            className="text-white bg-red-500 hover:bg-red-600 p-1.5 rounded-lg transition shadow-2xs cursor-pointer"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                      {(user?.status === "SUCCEEDED" ||
                        user?.status === "FAILED") && (
                        <span className="text-gray-400 text-xs pl-2">---</span>
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

      {/* ── Action Modals ── */}

      {/* Modal 1: Mark as Processing */}
      <Dialog
        open={isProcessingModalOpen}
        onOpenChange={setIsProcessingModalOpen}
      >
        <DialogContent className="max-w-md bg-white rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Mark Payout as Processing
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500 pt-1">
              Mark this payout of{" "}
              <strong className="text-gray-900">
                Kz {selectedPayout?.amount?.toLocaleString()}
              </strong>{" "}
              for host{" "}
              <strong className="text-gray-900">
                {selectedPayout?.host?.fullName}
              </strong>{" "}
              as Processing. The host will be notified that their transfer is underway.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label
                htmlFor="procTxId"
                className="text-xs font-semibold text-gray-700 block"
              >
                Transaction Reference / ID{" "}
                <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                id="procTxId"
                type="text"
                placeholder="e.g. EMIS-TX-987654 or Bank Ref #..."
                value={transactionIdInput}
                onChange={(e) => setTransactionIdInput(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-bprimary"
              />
            </div>

            <ReferenceImageUploader
              images={selectedImages}
              onChange={setSelectedImages}
              maxImages={5}
            />
          </div>

          <DialogFooter className="flex gap-2 sm:justify-end pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsProcessingModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleMarkAsProcessing}
              disabled={isUpdating}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-xs disabled:opacity-50"
            >
              {isUpdating ? "Updating..." : "Confirm Processing"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal 2: Mark as Succeeded */}
      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent className="max-w-md bg-white rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Complete Payout & Deduct Balance
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500 pt-1">
              Approving this payout will mark it as Succeeded and deduct{" "}
              <strong className="text-gray-900">
                Kz {selectedPayout?.amount?.toLocaleString()}
              </strong>{" "}
              from host{" "}
              <strong className="text-gray-900">
                {selectedPayout?.host?.fullName}
              </strong>
              &apos;s available balance.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label
                htmlFor="payoutTxId"
                className="text-xs font-semibold text-gray-700 block"
              >
                Transaction Reference / ID{" "}
                <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                id="payoutTxId"
                type="text"
                placeholder="e.g. EMIS-TX-987654 or Bank Ref #..."
                value={transactionIdInput}
                onChange={(e) => setTransactionIdInput(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-bprimary"
              />
              <p className="text-[11px] text-gray-400">
                Provide the bank transfer reference or transaction ID for audit
                tracking.
              </p>
            </div>

            <ReferenceImageUploader
              images={selectedImages}
              onChange={setSelectedImages}
              maxImages={5}
            />
          </div>

          <DialogFooter className="flex gap-2 sm:justify-end pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsSuccessModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleMarkAsSucceeded}
              disabled={isUpdating}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition shadow-xs disabled:opacity-50"
            >
              {isUpdating ? "Processing..." : "Confirm & Succeeded"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal 3: Mark as Failed */}
      <Dialog open={isFailedModalOpen} onOpenChange={setIsFailedModalOpen}>
        <DialogContent className="max-w-md bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              Mark Payout as Failed
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500 pt-1">
              Marking this payout as failed will reject the request. The host&apos;s
              balance will not be deducted.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-3">
            <label
              htmlFor="payoutFailureReason"
              className="text-xs font-semibold text-gray-700 block"
            >
              Reason for Failure <span className="text-red-500">*</span>
            </label>
            <textarea
              id="payoutFailureReason"
              rows={3}
              placeholder="e.g. Invalid bank account details, IBAN mismatch, or requested by host..."
              value={failureReasonInput}
              onChange={(e) => setFailureReasonInput(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-bprimary"
            />
            <p className="text-[11px] text-gray-400">
              This explanation will be recorded and shown in the audit details.
            </p>
          </div>

          <DialogFooter className="flex gap-2 sm:justify-end pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsFailedModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleMarkAsFailed}
              disabled={isUpdating}
              className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition shadow-xs disabled:opacity-50"
            >
              {isUpdating ? "Updating..." : "Confirm Failure"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllPayouts;

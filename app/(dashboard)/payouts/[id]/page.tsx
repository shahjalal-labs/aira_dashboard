"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  usePayoutDetailsQuery,
  useAllPayoutsQuery,
  useUpdatePayoutStatusMutation,
} from "@/redux/api/payout.api";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Building2,
  User,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  DollarSign,
  Receipt,
  FileText,
} from "lucide-react";

export default function PayoutDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const payoutId = String(params?.id || "");

  // Fetch payout details from API
  const {
    data: detailsData,
    isLoading: isDetailsLoading,
    refetch,
  } = usePayoutDetailsQuery(payoutId, {
    skip: !payoutId,
  });

  // Fallback: If remote API hasn't deployed GET /admin/payouts/:id yet, pull from allPayouts list cache
  const { data: allPayoutsData, isLoading: isAllLoading } = useAllPayoutsQuery(
    { page: 1, limit: 100 },
    { skip: !!detailsData?.result }
  );

  const fallbackPayout = allPayoutsData?.result?.data?.find(
    (p: any) => p.id === payoutId
  );

  const payout = detailsData?.result || fallbackPayout;
  const isLoading = isDetailsLoading && !payout;

  const [updatePayoutStatus, { isLoading: isUpdating }] =
    useUpdatePayoutStatusMutation();

  // Action Modals State
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isFailedModalOpen, setIsFailedModalOpen] = useState(false);
  const [isProcessingModalOpen, setIsProcessingModalOpen] = useState(false);

  const [transactionIdInput, setTransactionIdInput] = useState("");
  const [failureReasonInput, setFailureReasonInput] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleMarkAsProcessing = async () => {
    try {
      await updatePayoutStatus({
        id: payoutId,
        status: "PROCESSING",
      }).unwrap();
      toast.success("Payout status marked as Processing");
      setIsProcessingModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || "Failed to update payout status"
      );
    }
  };

  const handleMarkAsSucceeded = async () => {
    try {
      await updatePayoutStatus({
        id: payoutId,
        status: "SUCCEEDED",
        transactionId: transactionIdInput.trim() || undefined,
      }).unwrap();
      toast.success("Payout marked as Succeeded and completed!");
      setIsSuccessModalOpen(false);
      setTransactionIdInput("");
      refetch();
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || "Failed to complete payout"
      );
    }
  };

  const handleMarkAsFailed = async () => {
    if (!failureReasonInput.trim()) {
      toast.error("Please provide a reason for the failure");
      return;
    }

    try {
      await updatePayoutStatus({
        id: payoutId,
        status: "FAILED",
        errorMessage: failureReasonInput.trim(),
      }).unwrap();
      toast.success("Payout marked as Failed");
      setIsFailedModalOpen(false);
      setFailureReasonInput("");
      refetch();
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || "Failed to mark payout as failed"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-3">
        <Loader2 className="w-9 h-9 animate-spin text-bprimary" />
        <p className="text-gray-500 text-sm font-medium">
          Loading payout details...
        </p>
      </div>
    );
  }

  if (!payout) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-xs">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Payout Not Found
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            The payout record with ID #{payoutId} could not be located.
          </p>
          <Link
            href="/payouts"
            className="inline-flex items-center gap-2 px-4 py-2 bg-bprimary text-white rounded-lg text-sm font-medium hover:bg-bprimary/90 transition"
          >
            <ArrowLeft size={16} /> Back to Payouts
          </Link>
        </div>
      </div>
    );
  }

  const host = payout.host || {};
  const hostBalance = host.hostNetAmount ?? 0;
  const payoutAmount = payout.amount ?? 0;
  const balanceAfterPayout = Math.max(0, hostBalance - payoutAmount);

  // Parse withdrawal details if available
  const bankDetailsText = host.hostWithdrawDetails || "";
  const bankLines = bankDetailsText
    .split("\n")
    .map((line: string) => line.trim())
    .filter(Boolean);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCEEDED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
            <CheckCircle2 size={13} className="text-emerald-600" /> Succeeded
          </span>
        );
      case "PROCESSING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-semibold">
            <Clock size={13} className="text-blue-600" /> Processing
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-semibold">
            <XCircle size={13} className="text-red-600" /> Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold">
            <Clock size={13} className="text-amber-600" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ── Top Navigation Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/payouts")}
            className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition shadow-2xs"
            title="Back to payouts"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">
                Payments & Payouts
              </span>
              <span className="text-gray-300">/</span>
              <span className="text-xs font-semibold text-bprimary font-mono">
                #{payout.id}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
              Payout Details
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {getStatusBadge(payout.status)}

          {payout.status === "PENDING" && (
            <button
              onClick={() => setIsProcessingModalOpen(true)}
              disabled={isUpdating}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold transition cursor-pointer disabled:opacity-50"
            >
              <Clock size={14} /> Mark as Processing
            </button>
          )}

          {(payout.status === "PENDING" || payout.status === "PROCESSING") && (
            <>
              <button
                onClick={() => setIsSuccessModalOpen(true)}
                disabled={isUpdating}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition shadow-xs cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 size={14} /> Mark as Succeeded
              </button>
              <button
                onClick={() => setIsFailedModalOpen(true)}
                disabled={isUpdating}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-semibold transition cursor-pointer disabled:opacity-50"
              >
                <XCircle size={14} /> Mark as Failed
              </button>
            </>
          )}
        </div>
      </div>

      {/* Failure Banner if FAILED */}
      {payout.status === "FAILED" && payout.errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-red-800">
              Payout Rejection / Failure Reason
            </h4>
            <p className="text-xs text-red-700">{payout.errorMessage}</p>
          </div>
        </div>
      )}

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) - Financial & Transaction Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Payout Financial Summary */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-bprimary/10 text-bprimary">
                  <DollarSign size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Financial & Calculation Overview
                  </h3>
                  <p className="text-xs text-gray-500">
                    Accurate payout amounts and host balance calculations
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">
                Currency: AOA (Kz)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Requested Payout Amount */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-xs font-medium text-gray-500">
                  Requested Amount
                </span>
                <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                  Kz {payoutAmount.toLocaleString()}
                </div>
                <span className="text-[11px] text-gray-400 mt-1 block">
                  Amount to be transferred to host
                </span>
              </div>

              {/* Host Net Balance */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-xs font-medium text-gray-500">
                  Host Available Balance
                </span>
                <div className="text-xl sm:text-2xl font-bold text-emerald-600 mt-1">
                  Kz {hostBalance.toLocaleString()}
                </div>
                <span className="text-[11px] text-gray-400 mt-1 block">
                  Current net balance on platform
                </span>
              </div>

              {/* Balance Remaining After Payout */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-xs font-medium text-gray-500">
                  {payout.status === "SUCCEEDED"
                    ? "Balance Status"
                    : "Balance After Payout"}
                </span>
                <div
                  className={`text-xl sm:text-2xl font-bold mt-1 ${
                    hostBalance < payoutAmount
                      ? "text-red-600"
                      : "text-gray-900"
                  }`}
                >
                  {payout.status === "SUCCEEDED"
                    ? "Deducted"
                    : `Kz ${balanceAfterPayout.toLocaleString()}`}
                </div>
                <span className="text-[11px] text-gray-400 mt-1 block">
                  {payout.status === "SUCCEEDED"
                    ? "Kz " + payoutAmount.toLocaleString() + " settled"
                    : hostBalance >= payoutAmount
                    ? "Sufficient balance"
                    : "Insufficient balance"}
                </span>
              </div>
            </div>

            {/* Detailed Transaction Info */}
            <div className="rounded-xl border border-gray-100 overflow-hidden">
              <div className="bg-gray-50/70 px-4 py-2.5 border-b border-gray-100 text-xs font-semibold text-gray-700">
                Transaction Reference & Verification
              </div>
              <div className="divide-y divide-gray-100 text-xs">
                <div className="flex items-center justify-between p-3.5">
                  <span className="text-gray-500">Transaction ID / Reference</span>
                  <span className="font-mono font-semibold text-gray-900 flex items-center gap-1.5">
                    {payout.transactionId || payout.stripeTransferId ? (
                      <>
                        {payout.transactionId || payout.stripeTransferId}
                        <button
                          onClick={() =>
                            copyToClipboard(
                              payout.transactionId || payout.stripeTransferId,
                              "txId"
                            )
                          }
                          className="text-gray-400 hover:text-gray-700 transition"
                          title="Copy Transaction ID"
                        >
                          {copiedKey === "txId" ? (
                            <Check size={13} className="text-emerald-600" />
                          ) : (
                            <Copy size={13} />
                          )}
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-400 font-normal italic">
                        Not assigned yet
                      </span>
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5">
                  <span className="text-gray-500">Payout Record ID</span>
                  <span className="font-mono font-semibold text-gray-900 flex items-center gap-1.5">
                    {payout.id}
                    <button
                      onClick={() => copyToClipboard(payout.id, "payoutId")}
                      className="text-gray-400 hover:text-gray-700 transition"
                      title="Copy Payout ID"
                    >
                      {copiedKey === "payoutId" ? (
                        <Check size={13} className="text-emerald-600" />
                      ) : (
                        <Copy size={13} />
                      )}
                    </button>
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5">
                  <span className="text-gray-500">Host Total Lifetime Earned</span>
                  <span className="font-semibold text-gray-900">
                    Kz {(host.hostTotalEarned ?? 0).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5">
                  <span className="text-gray-500">Requested Date & Time</span>
                  <span className="font-medium text-gray-900">
                    {payout.requestedAt
                      ? new Date(payout.requestedAt).toLocaleString()
                      : "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5">
                  <span className="text-gray-500">Completed Date & Time</span>
                  <span className="font-medium text-gray-900">
                    {payout.completedAt ? (
                      new Date(payout.completedAt).toLocaleString()
                    ) : (
                      <span className="text-gray-400 italic">
                        Awaiting completion
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Bank & Withdrawal Method Details */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
              <div className="p-2.5 rounded-xl bg-bprimary/10 text-bprimary">
                <Building2 size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Beneficiary Bank & Withdrawal Method
                </h3>
                <p className="text-xs text-gray-500">
                  Bank details submitted by the host for payout transfers
                </p>
              </div>
            </div>

            {bankLines.length > 0 ? (
              <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-200/80 space-y-2.5">
                {bankLines.map((line: string, index: number) => {
                  const parts = line.split(":");
                  const label = parts[0]?.trim();
                  const value = parts.slice(1).join(":").trim();

                  return (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 bg-white rounded-lg border border-gray-100 text-xs"
                    >
                      <span className="font-semibold text-gray-600">
                        {label || "Detail"}
                      </span>
                      <div className="flex items-center gap-2 font-mono font-medium text-gray-900">
                        <span>{value || line}</span>
                        {(value || line) && (
                          <button
                            onClick={() =>
                              copyToClipboard(value || line, `bank-${index}`)
                            }
                            className="text-gray-400 hover:text-gray-700 transition"
                            title="Copy"
                          >
                            {copiedKey === `bank-${index}` ? (
                              <Check size={13} className="text-emerald-600" />
                            ) : (
                              <Copy size={13} />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <CreditCard className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500 font-medium">
                  No bank or withdrawal details configured by this host.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col) - Host Overview */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <User size={16} className="text-bprimary" /> Host Information
              </h3>
              {host.id && (
                <Link
                  href={`/user-management/${host.id}`}
                  className="text-xs font-semibold text-bprimary hover:underline inline-flex items-center gap-1"
                >
                  Profile <ExternalLink size={12} />
                </Link>
              )}
            </div>

            <div className="flex items-center gap-3.5">
              <Avatar className="w-14 h-14 border border-gray-100">
                <AvatarImage src={host.profileImage} alt={host.fullName} />
                <AvatarFallback className="bg-bprimary/10 text-bprimary font-bold text-base">
                  {(host.fullName || "H")
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-gray-900 text-sm truncate">
                  {host.fullName || "Unknown Host"}
                </h4>
                <p className="text-xs text-gray-500 truncate">{host.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  {host.isVerifiedUser ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <ShieldCheck size={11} /> Verified Host
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                      <ShieldAlert size={11} /> Unverified
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-gray-100 text-xs">
              <div className="flex items-center justify-between text-gray-600">
                <span>Phone Number</span>
                <span className="font-medium text-gray-900">
                  {host.phoneNumber || "Not set"}
                </span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Host ID</span>
                <span className="font-mono text-gray-500 text-[11px]">
                  #{host.id ? host.id.slice(-8) : "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>City / Region</span>
                <span className="font-medium text-gray-900">
                  {host.city || "Not provided"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Action Modals ── */}

      {/* Modal 1: Mark as Processing Confirmation */}
      <Dialog
        open={isProcessingModalOpen}
        onOpenChange={setIsProcessingModalOpen}
      >
        <DialogContent className="max-w-md bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Mark Payout as Processing
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500 pt-1">
              Are you sure you want to transition this payout request of{" "}
              <strong className="text-gray-900">
                Kz {payoutAmount.toLocaleString()}
              </strong>{" "}
              to Processing status?
            </DialogDescription>
          </DialogHeader>

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

      {/* Modal 2: Mark as Succeeded (with Optional Transaction ID) */}
      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent className="max-w-md bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Complete Payout & Deduct Balance
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500 pt-1">
              Approving this payout will mark it as Succeeded and deduct{" "}
              <strong className="text-gray-900">
                Kz {payoutAmount.toLocaleString()}
              </strong>{" "}
              from host <strong className="text-gray-900">{host.fullName}</strong>
              &apos;s available net balance.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-3">
            <label
              htmlFor="txId"
              className="text-xs font-semibold text-gray-700 block"
            >
              Transaction Reference / ID{" "}
              <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              id="txId"
              type="text"
              placeholder="e.g. EMIS-TX-987654 or Bank Ref #..."
              value={transactionIdInput}
              onChange={(e) => setTransactionIdInput(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-bprimary"
            />
            <p className="text-[11px] text-gray-400">
              Provide the bank transaction ID or transfer reference for audit
              tracking.
            </p>
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

      {/* Modal 3: Mark as Failed (with Required Failure Reason) */}
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
              htmlFor="failureReason"
              className="text-xs font-semibold text-gray-700 block"
            >
              Reason for Failure <span className="text-red-500">*</span>
            </label>
            <textarea
              id="failureReason"
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
}

"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  useUserDetailsQuery,
  useChangeUserStatusMutation,
  useVerifyUserAccountMutation,
} from "@/redux/api/authApi";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  Star,
  Building,
  User,
  CheckCircle2,
  XCircle,
  Globe,
  GraduationCap,
  Briefcase,
  CreditCard,
  ExternalLink,
  FileText,
  UserCheck,
  UserX,
  Sparkles,
  HeartHandshake,
  MessageSquare,
  BadgeCheck,
  Loader2,
  ArrowUpDown,
  Layers,
  Info,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  X,
} from "lucide-react";

interface ZoomImageState {
  url: string;
  title: string;
}

export default function UserDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = params.id as string;
  // Always query with role=HOST to aggregate host reviews/ratings if available
  const { data, isLoading, isError, refetch } = useUserDetailsQuery({
    id,
    role: "HOST",
  });

  const [activeTab, setActiveTab] = useState<"all" | "host" | "guest">("all");

  // Image zoom state
  const [zoomImage, setZoomImage] = useState<ZoomImageState | null>(null);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  const [changeStatus, { isLoading: isChangingStatus }] =
    useChangeUserStatusMutation();
  const [verifyUser, { isLoading: isVerifying }] =
    useVerifyUserAccountMutation();

  const user = data?.result;
  const isCurrentHost = user?.role === "HOST";
  const isCurrentGuest = user?.role === "GUEST";

  // Handle open zoom
  const handleOpenZoom = (url: string, title: string) => {
    setZoomImage({ url, title });
    setZoomScale(1);
    setRotation(0);
  };

  // Handle close zoom
  const handleCloseZoom = () => {
    setZoomImage(null);
    setZoomScale(1);
    setRotation(0);
  };

  // Zoom in
  const handleZoomIn = () => {
    setZoomScale((prev) => Math.min(Number((prev + 0.25).toFixed(2)), 3.5));
  };

  // Zoom out
  const handleZoomOut = () => {
    setZoomScale((prev) => Math.max(Number((prev - 0.25).toFixed(2)), 0.5));
  };

  // Reset zoom & rotation
  const handleResetZoom = () => {
    setZoomScale(1);
    setRotation(0);
  };

  // Rotate 90 degrees clockwise
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Click image to toggle zoom
  const toggleClickZoom = () => {
    setZoomScale((prev) => (prev === 1 ? 2 : 1));
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  // Handle status toggle (ACTIVE <-> SUSPENDED)
  const handleStatusToggle = async () => {
    if (!user) return;
    const newStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      const res = await changeStatus({ id: user.id, status: newStatus }).unwrap();
      if (res?.success) {
        toast.success(
          `User ${newStatus === "ACTIVE" ? "activated" : "suspended"} successfully`
        );
        refetch();
      } else {
        toast.error(res?.message || "Failed to update status");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Error updating user status");
    }
  };

  // Handle verification toggle
  const handleVerifyToggle = async () => {
    if (!user) return;
    const newVerified = !user.isVerifiedUser;
    try {
      const res = await verifyUser({
        id: user.id,
        verified: newVerified,
      }).unwrap();
      if (res?.success) {
        toast.success(
          `User marked as ${newVerified ? "verified" : "unverified"} successfully`
        );
        refetch();
      } else {
        toast.error(res?.message || "Failed to update verification");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Error updating verification");
    }
  };

  // Parse withdrawal details if available
  const parseWithdrawalDetails = (detailsStr?: string | null) => {
    if (!detailsStr) return null;
    const lines = detailsStr.split("\n").filter((l) => l.trim().length > 0);
    return lines.map((line) => {
      const [key, ...valParts] = line.split(":");
      return {
        label: key?.trim() || "Detail",
        value: valParts.join(":").trim() || "—",
      };
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-9 h-9 animate-spin text-bprimary" />
        <p className="text-sm text-gray-500 font-medium">Loading user details...</p>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
          <XCircle size={32} />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-800">User Not Found</h2>
          <p className="text-sm text-gray-500 mt-1">
            Unable to load details for this user ID.
          </p>
        </div>
        <Link
          href="/user-management"
          className="inline-flex items-center gap-2 px-4 py-2 bg-bprimary text-white text-sm rounded-lg hover:bg-bprimary/90 transition"
        >
          <ArrowLeft size={16} />
          Back to Users
        </Link>
      </div>
    );
  }

  const withdrawalFields = parseWithdrawalDetails(user.hostWithdrawDetails);

  // ── Render Host Information Block ──
  const renderHostSection = (isActiveRole: boolean) => (
    <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden space-y-6 p-5 sm:p-6 transition">
      {/* Section Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl ${
              isActiveRole
                ? "bg-bprimary/10 text-bprimary"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <Building size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">Host Profile</h2>
              {isActiveRole ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Current Active Role
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  Switchable Role Profile
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Hosting metrics, verification documents, payout accounts, and host preferences.
            </p>
          </div>
        </div>

        {/* Quick Host Performance Summary */}
        <div className="flex items-center gap-2.5 bg-amber-50/70 border border-amber-100 rounded-xl px-3.5 py-2">
          <Star size={18} className="fill-amber-500 text-amber-500" />
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-gray-900 leading-none">
              {user.avgRating ? Number(user.avgRating).toFixed(1) : "0.0"}
            </span>
            <span className="text-xs text-gray-500 font-medium">/ 5.0</span>
          </div>
          <span className="text-xs text-amber-800 font-medium ml-1">
            ({user.totalReviews ?? 0} reviews)
          </span>
        </div>
      </div>

      {/* Grid: Professional Background & Verification Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Host Professional Info */}
        <div className="bg-gray-50/70 border border-gray-100 rounded-xl p-4 sm:p-5 space-y-3.5">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Briefcase size={16} className="text-bprimary" />
            Professional Background & Skills
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm">
            <div>
              <span className="text-xs text-gray-400 block mb-0.5">Profession</span>
              <span className="font-medium text-gray-900">
                {user.profession || "—"}
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block mb-0.5">Education</span>
              <span className="font-medium text-gray-900">
                {user.education || "—"}
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block mb-0.5">Contact Phone</span>
              <span className="font-medium text-gray-900 inline-flex items-center gap-1.5">
                {user.phoneNumber || "—"}
                {user.isPhoneNumberVerified && (
                  <span className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-medium">
                    Verified
                  </span>
                )}
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block mb-0.5">Host Status</span>
              <span className="font-medium text-gray-900">
                {user.isVerifiedUser ? "Verified Host" : "Standard Host"}
              </span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-xs text-gray-400 block mb-1">Languages Spoken</span>
              <div className="flex flex-wrap gap-1.5">
                {user.languages ? (
                  user.languages.split(",").map((lang: string) => (
                    <span
                      key={lang}
                      className="px-2.5 py-0.5 bg-white border border-gray-200 text-gray-700 rounded-md text-xs font-medium"
                    >
                      {lang.trim()}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 font-medium">—</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Host Payout & Bank Account Details */}
        <div className="bg-gray-50/70 border border-gray-100 rounded-xl p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <CreditCard size={16} className="text-bprimary" />
              Payout & Withdrawal Account
            </h3>
            {withdrawalFields && withdrawalFields.length > 0 && (
              <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium border border-emerald-100">
                Configured
              </span>
            )}
          </div>

          {withdrawalFields && withdrawalFields.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {withdrawalFields.map((field, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-200/80 rounded-lg p-3 space-y-0.5"
                >
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                    {field.label}
                  </p>
                  <p className="text-xs font-bold text-gray-900 break-all font-mono">
                    {field.value}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-gray-400 text-xs italic bg-white rounded-lg border border-dashed border-gray-200">
              No withdrawal bank account details provided.
            </div>
          )}
        </div>
      </div>

      {/* Hosting Preferences & Philosophy */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Sparkles size={16} className="text-amber-500" />
          Hosting Philosophy & Guest Experience
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {/* Hosting Style */}
          <div className="bg-amber-50/30 border border-amber-100/70 rounded-xl p-4 space-y-1.5">
            <span className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
              <HeartHandshake size={14} /> Hosting Style
            </span>
            <p className="text-sm text-gray-700 leading-relaxed">
              {user.hostingStyle || "—"}
            </p>
          </div>

          {/* Why I Host */}
          <div className="bg-blue-50/30 border border-blue-100/70 rounded-xl p-4 space-y-1.5">
            <span className="text-xs font-semibold text-blue-800 flex items-center gap-1.5">
              <Building size={14} /> Why I Host
            </span>
            <p className="text-sm text-gray-700 leading-relaxed">
              {user.hostReason || "—"}
            </p>
          </div>

          {/* Guest Expectations */}
          <div className="bg-emerald-50/30 border border-emerald-100/70 rounded-xl p-4 space-y-1.5">
            <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
              <MessageSquare size={14} /> Expectations for Guests
            </span>
            <p className="text-sm text-gray-700 leading-relaxed">
              {user.guestExpect || "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Identity Verification Documents */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-600" />
            Host Identity & Verification Documents
          </h3>
          <span className="text-xs text-gray-500 font-medium">
            {user.identityDocuments?.length || 0} document(s) uploaded
          </span>
        </div>

        {user.identityDocuments && user.identityDocuments.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {user.identityDocuments.map((docUrl: string, idx: number) => (
              <div
                key={idx}
                onClick={() =>
                  handleOpenZoom(docUrl, `Identity Document #${idx + 1}`)
                }
                className="group relative aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200 hover:border-bprimary hover:shadow-md transition cursor-pointer"
                title="Click to zoom document"
              >
                <img
                  src={docUrl}
                  alt={`Host identity document ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-medium gap-1.5">
                  <ZoomIn size={16} />
                  <span>Click to Zoom</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-gray-400 text-xs italic bg-gray-50 rounded-xl border border-dashed border-gray-200">
            No identity verification documents uploaded for this host account.
          </div>
        )}
      </div>
    </div>
  );

  // ── Render Guest Information Block ──
  const renderGuestSection = (isActiveRole: boolean) => (
    <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden space-y-6 p-5 sm:p-6 transition">
      {/* Section Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl ${
              isActiveRole
                ? "bg-bprimary/10 text-bprimary"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <User size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">Guest Profile</h2>
              {isActiveRole ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Current Active Role
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  Switchable Role Profile
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Guest travel bio, personal details, contact preferences, and residential location.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium border border-blue-100">
            Guest Account
          </span>
        </div>
      </div>

      {/* Grid: Personal Details & Location */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Personal Details */}
        <div className="bg-gray-50/70 border border-gray-100 rounded-xl p-4 sm:p-5 space-y-3.5">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <FileText size={16} className="text-bprimary" />
            Guest Personal Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm">
            <div>
              <span className="text-xs text-gray-400 block mb-0.5">Full Name</span>
              <span className="font-medium text-gray-900">
                {user.fullName || "—"}
              </span>
            </div>

            <div>
              <span className="text-xs text-gray-400 block mb-0.5">Date of Birth</span>
              <span className="font-medium text-gray-900">
                {user.birthDay || "—"}
              </span>
            </div>

            <div>
              <span className="text-xs text-gray-400 block mb-0.5">Email Address</span>
              <span className="font-medium text-gray-900 break-all">
                {user.email || "—"}
              </span>
            </div>

            <div>
              <span className="text-xs text-gray-400 block mb-0.5">Phone Number</span>
              <span className="font-medium text-gray-900 inline-flex items-center gap-1.5">
                {user.phoneNumber || "—"}
                {user.isPhoneNumberVerified && (
                  <span className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-medium">
                    Verified
                  </span>
                )}
              </span>
            </div>

            <div>
              <span className="text-xs text-gray-400 block mb-0.5">Resident City</span>
              <span className="font-medium text-gray-900">
                {user.city || "—"}
              </span>
            </div>

            <div>
              <span className="text-xs text-gray-400 block mb-0.5">Account Status</span>
              <span className="font-medium text-gray-900">
                {user.status}
              </span>
            </div>
          </div>
        </div>

        {/* Location & Address Info */}
        <div className="bg-gray-50/70 border border-gray-100 rounded-xl p-4 sm:p-5 space-y-3.5">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <MapPin size={16} className="text-bprimary" />
            Location & Travel Address
          </h3>

          <div className="space-y-3 text-sm">
            <div className="bg-white border border-gray-200/80 rounded-lg p-3 space-y-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                Full Address
              </span>
              <p className="text-sm text-gray-900 font-medium">
                {user.location || "No address provided"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-gray-200/80 rounded-lg p-3 space-y-0.5">
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider block">
                  City / Region
                </span>
                <p className="text-sm font-semibold text-gray-900">
                  {user.city || "—"}
                </p>
              </div>

              <div className="bg-white border border-gray-200/80 rounded-lg p-3 space-y-0.5">
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider block">
                  Identity Status
                </span>
                <p className="text-sm font-semibold text-gray-900">
                  {user.isVerifiedUser ? "Verified Guest" : "Unverified"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Bio / About Me */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Sparkles size={16} className="text-bprimary" />
          Guest Bio & About
        </h3>
        <div className="bg-gray-50/70 border border-gray-100 rounded-xl p-4">
          {user.bio ? (
            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
              {user.bio}
            </p>
          ) : (
            <p className="text-sm text-gray-400 italic">
              No personal bio provided by this guest.
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-5 max-w-6xl pb-12">
      {/* ── Top Navigation Bar ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition cursor-pointer shadow-xs"
        >
          <ArrowLeft size={16} />
          Back to Users
        </button>

        <div className="flex items-center gap-2.5">
          {/* Verify account button */}
          <button
            onClick={handleVerifyToggle}
            disabled={isVerifying}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer disabled:opacity-50 ${
              user.isVerifiedUser
                ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
            }`}
          >
            <BadgeCheck size={15} />
            {user.isVerifiedUser ? "Mark Unverified" : "Verify Account"}
          </button>

          {/* Status button */}
          <button
            onClick={handleStatusToggle}
            disabled={isChangingStatus}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer disabled:opacity-50 ${
              user.status === "ACTIVE"
                ? "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border-red-200"
                : "bg-green-50 text-green-600 hover:bg-green-600 hover:text-white border-green-200"
            }`}
          >
            {user.status === "ACTIVE" ? (
              <>
                <UserX size={15} />
                Suspend Account
              </>
            ) : (
              <>
                <UserCheck size={15} />
                Activate Account
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Universal Profile Header Card ── */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            {/* Clickable Avatar to Zoom */}
            <div
              onClick={() => {
                if (user.profileImage) {
                  handleOpenZoom(
                    user.profileImage,
                    `${user.fullName || "User"}'s Profile Photo`
                  );
                }
              }}
              className={`relative group rounded-2xl ${
                user.profileImage ? "cursor-pointer" : ""
              }`}
              title={user.profileImage ? "Click to zoom profile photo" : ""}
            >
              <Avatar className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-white shadow-md transition group-hover:ring-4 group-hover:ring-bprimary/20">
                <AvatarImage
                  src={user.profileImage || ""}
                  alt={user.fullName || "User"}
                  className="object-cover"
                />
                <AvatarFallback className="text-2xl font-bold bg-bprimary/10 text-bprimary rounded-2xl">
                  {user.fullName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>

              {user.profileImage && (
                <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center text-white text-[11px] font-medium gap-0.5">
                  <ZoomIn size={18} />
                  <span>Zoom</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-none">
                  {user.fullName || "Unnamed User"}
                </h1>

                {/* Current Active Role badge */}
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    isCurrentHost
                      ? "bg-gray-900 text-white"
                      : "bg-bprimary/10 text-bprimary border border-bprimary/20"
                  }`}
                >
                  {isCurrentHost ? <Building size={12} /> : <User size={12} />}
                  Active Role: {user.role}
                </span>

                {/* Status badge */}
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    user.status === "ACTIVE"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      user.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  {user.status}
                </span>

                {/* Verification badge */}
                {user.isVerifiedUser ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck size={13} className="text-emerald-600" />
                    Verified User
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                    <ShieldAlert size={13} className="text-amber-600" />
                    Unverified
                  </span>
                )}
              </div>

              {/* Quick Meta chips */}
              <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap pt-0.5">
                <span className="flex items-center gap-1">
                  <Mail size={14} className="text-gray-400" />
                  {user.email || "No email"}
                </span>

                {user.phoneNumber && (
                  <span className="flex items-center gap-1">
                    <Phone size={14} className="text-gray-400" />
                    {user.phoneNumber}
                    {user.isPhoneNumberVerified && (
                      <span title="Phone verified">
                        <CheckCircle2 size={13} className="text-emerald-500" />
                      </span>
                    )}
                  </span>
                )}

                {user.city && (
                  <span className="flex items-center gap-1">
                    <MapPin size={14} className="text-gray-400" />
                    {user.city}
                  </span>
                )}

                <span className="flex items-center gap-1">
                  <Calendar size={14} className="text-gray-400" />
                  Joined{" "}
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* User ID Tag */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-right">
            <span className="text-[11px] text-gray-400 uppercase tracking-wider block">
              User ID
            </span>
            <span className="font-mono text-xs font-medium text-gray-700 break-all">
              {user.id}
            </span>
          </div>
        </div>

        {/* Switchable Role Notice */}
        <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2 text-xs text-gray-500">
          <div className="flex items-center gap-1.5 text-gray-600">
            <Info size={14} className="text-bprimary shrink-0" />
            <span>
              Users can switch roles between <strong>Host</strong> and <strong>Guest</strong>. Both profile records are preserved below with the current active role displayed first.
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-gray-400">
            <ArrowUpDown size={12} />
            <span>Dual Role Architecture</span>
          </div>
        </div>
      </div>

      {/* ── View Tab Switcher ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-gray-100/90 rounded-xl border border-gray-200/60">
          <button
            onClick={() => setActiveTab("all")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === "all"
                ? "bg-white text-gray-900 shadow-xs"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Layers size={14} />
            All Information (Current Role First)
          </button>

          <button
            onClick={() => setActiveTab("host")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === "host"
                ? "bg-white text-gray-900 shadow-xs"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Building size={14} />
            Host Profile {isCurrentHost && "(Active)"}
          </button>

          <button
            onClick={() => setActiveTab("guest")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === "guest"
                ? "bg-white text-gray-900 shadow-xs"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <User size={14} />
            Guest Profile {isCurrentGuest && "(Active)"}
          </button>
        </div>
      </div>

      {/* ── Content Sections: Current Role Data First, Opposite Data Second ── */}
      <div className="space-y-6">
        {activeTab === "all" ? (
          isCurrentHost ? (
            <>
              {/* Current Role: Host First */}
              {renderHostSection(true)}
              {/* Opposite Role: Guest Second */}
              {renderGuestSection(false)}
            </>
          ) : (
            <>
              {/* Current Role: Guest First */}
              {renderGuestSection(true)}
              {/* Opposite Role: Host Second */}
              {renderHostSection(false)}
            </>
          )
        ) : activeTab === "host" ? (
          renderHostSection(isCurrentHost)
        ) : (
          renderGuestSection(isCurrentGuest)
        )}
      </div>

      {/* ── Full Interactive Image Zoom Dialog ── */}
      <Dialog open={!!zoomImage} onOpenChange={(open) => !open && handleCloseZoom()}>
        <DialogContent
          showCloseButton={false}
          className="max-w-4xl w-[95vw] sm:w-[90vw] md:w-[85vw] bg-white p-0 rounded-2xl overflow-hidden shadow-2xl border border-gray-200"
        >
          {/* Header & Controls Toolbar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-100 bg-gray-50/80 flex-wrap gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <DialogTitle className="text-sm font-semibold text-gray-800 truncate">
                {zoomImage?.title || "Image Preview"}
              </DialogTitle>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              <button
                onClick={handleZoomOut}
                disabled={zoomScale <= 0.5}
                title="Zoom out"
                className="p-1.5 rounded-lg text-gray-600 hover:bg-white hover:text-gray-900 border border-transparent hover:border-gray-200 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition"
              >
                <ZoomOut size={16} />
              </button>

              <span className="text-xs font-mono font-semibold text-gray-600 w-12 text-center select-none">
                {Math.round(zoomScale * 100)}%
              </span>

              <button
                onClick={handleZoomIn}
                disabled={zoomScale >= 3.5}
                title="Zoom in"
                className="p-1.5 rounded-lg text-gray-600 hover:bg-white hover:text-gray-900 border border-transparent hover:border-gray-200 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition"
              >
                <ZoomIn size={16} />
              </button>

              <div className="w-[1px] h-4 bg-gray-200 mx-1" />

              <button
                onClick={handleResetZoom}
                title="Reset zoom"
                className="p-1.5 rounded-lg text-gray-600 hover:bg-white hover:text-gray-900 border border-transparent hover:border-gray-200 cursor-pointer transition"
              >
                <RotateCcw size={15} />
              </button>

              <button
                onClick={handleRotate}
                title="Rotate 90°"
                className="p-1.5 rounded-lg text-gray-600 hover:bg-white hover:text-gray-900 border border-transparent hover:border-gray-200 cursor-pointer transition"
              >
                <RotateCw size={15} />
              </button>

              {zoomImage?.url && (
                <a
                  href={zoomImage.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open original in new tab"
                  className="p-1.5 rounded-lg text-gray-600 hover:bg-white hover:text-gray-900 border border-transparent hover:border-gray-200 cursor-pointer transition"
                >
                  <ExternalLink size={15} />
                </a>
              )}

              <div className="w-[1px] h-4 bg-gray-200 mx-1" />

              <button
                onClick={handleCloseZoom}
                title="Close"
                className="p-1.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 cursor-pointer transition ml-1"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Zoomable Image Viewport */}
          {zoomImage && (
            <div
              onWheel={handleWheel}
              className="relative max-h-[72vh] min-h-[300px] overflow-auto flex items-center justify-center p-4 bg-neutral-900/5 select-none"
            >
              <div
                onClick={toggleClickZoom}
                className={`transition-transform duration-200 ease-out inline-flex items-center justify-center ${
                  zoomScale === 1 ? "cursor-zoom-in" : "cursor-zoom-out"
                }`}
                style={{
                  transform: `scale(${zoomScale}) rotate(${rotation}deg)`,
                }}
                title={
                  zoomScale === 1
                    ? "Click to zoom in (or use mouse wheel)"
                    : "Click to reset zoom"
                }
              >
                <img
                  src={zoomImage.url}
                  alt={zoomImage.title}
                  className="max-h-[65vh] max-w-full w-auto object-contain rounded-lg shadow-sm"
                  draggable={false}
                />
              </div>
            </div>
          )}

          {/* Bottom Hint Bar */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-[11px] text-gray-400 text-center flex items-center justify-center gap-3">
            <span>Click image or scroll mouse wheel to zoom</span>
            <span>•</span>
            <span>Rotate or open original in new tab from toolbar</span>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

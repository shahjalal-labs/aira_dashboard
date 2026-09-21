"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  useBookingDetailsQuery,
  useCancelBookingMutation,
} from "@/redux/api/booking.api";
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
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Users,
  ShieldCheck,
  ShieldAlert,
  Home,
  CarFront,
  Compass,
  Utensils,
  Building,
  User,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  X,
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  FileText,
  BadgeCheck,
  Ban,
  Receipt,
  Sparkles,
  Bed,
  Bath,
} from "lucide-react";

interface ZoomImageState {
  url: string;
  title: string;
}

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data, isLoading, isError, refetch } = useBookingDetailsQuery(id);
  const [cancelBooking, { isLoading: isCancelling }] =
    useCancelBookingMutation();

  // Zoom modal state
  const [zoomImage, setZoomImage] = useState<ZoomImageState | null>(null);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  const booking = data?.result;

  const handleOpenZoom = (url: string, title: string) => {
    setZoomImage({ url, title });
    setZoomScale(1);
    setRotation(0);
  };

  const handleCloseZoom = () => {
    setZoomImage(null);
    setZoomScale(1);
    setRotation(0);
  };

  const handleZoomIn = () => {
    setZoomScale((prev) => Math.min(Number((prev + 0.25).toFixed(2)), 3.5));
  };

  const handleZoomOut = () => {
    setZoomScale((prev) => Math.max(Number((prev - 0.25).toFixed(2)), 0.5));
  };

  const handleResetZoom = () => {
    setZoomScale(1);
    setRotation(0);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const toggleClickZoom = () => {
    setZoomScale((prev) => (prev === 1 ? 2 : 1));
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  const handleCancelBooking = async () => {
    if (!booking) return;
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const res = await cancelBooking(booking.id).unwrap();
      if (res?.success) {
        toast.success("Booking cancelled successfully");
        refetch();
      } else {
        toast.error(res?.message || "Failed to cancel booking");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Error cancelling booking");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-9 h-9 animate-spin text-bprimary" />
        <p className="text-sm text-gray-500 font-medium">Loading booking details...</p>
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
          <XCircle size={32} />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-800">Booking Not Found</h2>
          <p className="text-sm text-gray-500 mt-1">
            Unable to load details for this booking ID.
          </p>
        </div>
        <Link
          href="/bookings"
          className="inline-flex items-center gap-2 px-4 py-2 bg-bprimary text-white text-sm rounded-lg hover:bg-bprimary/90 transition"
        >
          <ArrowLeft size={16} />
          Back to Bookings
        </Link>
      </div>
    );
  }

  const property = booking.property;
  const guest = booking.guest;
  const host = property?.host;

  // Calculate nights/days
  const checkIn = booking.checkInDate ? new Date(booking.checkInDate) : null;
  const checkOut = booking.checkOutDate ? new Date(booking.checkOutDate) : null;
  const nights =
    checkIn && checkOut
      ? Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)))
      : null;

  // Type badge helper
  const getTypeBadge = (type?: string) => {
    switch (type) {
      case "HOUSE_RENTAL":
        return {
          label: "House Rental",
          icon: <Home size={13} />,
          className: "bg-blue-50 text-blue-700 border-blue-200",
        };
      case "CAR_RENTAL":
        return {
          label: "Car Rental",
          icon: <CarFront size={13} />,
          className: "bg-indigo-50 text-indigo-700 border-indigo-200",
        };
      case "EXPERIENCE":
        return {
          label: "Experience",
          icon: <Compass size={13} />,
          className: "bg-amber-50 text-amber-700 border-amber-200",
        };
      case "RESTAURANT":
        return {
          label: "Restaurant",
          icon: <Utensils size={13} />,
          className: "bg-purple-50 text-purple-700 border-purple-200",
        };
      default:
        return {
          label: type || "Listing",
          icon: <Building size={13} />,
          className: "bg-gray-100 text-gray-700 border-gray-200",
        };
    }
  };

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

  const typeInfo = getTypeBadge(property?.type);
  const statusInfo = getBookingStatusBadge(booking.status);
  const propertyImage =
    property?.images?.[0] ||
    "https://api.zenexcloud.com/emdadullah/uploads/messages/files/1780416667413-yjvj4j0m9i.png";

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      {/* ── Top Navigation Bar & Action Controls ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition cursor-pointer shadow-xs"
        >
          <ArrowLeft size={16} />
          Back to Bookings
        </button>

        {/* Status badges & Cancel Action */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Booking Status */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.badgeClass}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`} />
            {statusInfo.label}
          </span>

          {/* Payment Status */}
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
              booking.paymentStatus === "PAID"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : booking.paymentStatus === "UNPAID"
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : "bg-gray-100 text-gray-700 border border-gray-200"
            }`}
          >
            {booking.paymentStatus === "PAID" ? (
              <ShieldCheck size={13} className="text-emerald-600" />
            ) : (
              <ShieldAlert size={13} className="text-amber-600" />
            )}
            Payment: {booking.paymentStatus}
          </span>

          {/* Cancel Booking Action (Only available for PENDING or APPROVED; cannot cancel once CONFIRMED) */}
          {["PENDING", "APPROVED"].includes(booking.status) && (
            <button
              onClick={handleCancelBooking}
              disabled={isCancelling}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-semibold transition cursor-pointer disabled:opacity-50"
            >
              <Ban size={14} />
              Cancel Booking
            </button>
          )}
        </div>
      </div>

      {/* ── Main Booking Header Card ── */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                Booking Details
              </h1>
              <span className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-md font-mono text-xs font-semibold">
                #{booking.id}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5 flex-wrap">
              <span>Booked on {new Date(booking.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}</span>
              {booking.updatedAt && (
                <>
                  <span>•</span>
                  <span>Last updated {new Date(booking.updatedAt).toLocaleDateString()}</span>
                </>
              )}
            </p>
          </div>

          {/* Total Price Banner */}
          <div className="bg-bprimary/5 border border-bprimary/15 rounded-xl px-4 py-3 shrink-0 text-right">
            <span className="text-xs text-gray-500 uppercase font-medium block">
              Total Amount
            </span>
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-2xl font-bold text-gray-900 leading-none">
                Kz {booking.totalPrice?.toLocaleString() ?? booking.totalPrice}
              </span>
            </div>
            <span className="text-[11px] text-gray-500 font-medium block mt-0.5">
              Host Payout: Kz {booking.hostNetAmount?.toLocaleString() ?? booking.hostNetAmount}
            </span>
          </div>
        </div>

        {/* ── Linked Property Overview Sub-Card ── */}
        {property ? (
          <div className="bg-gray-50/70 border border-gray-100 rounded-2xl p-4 sm:p-5">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                {/* Property Image with click-to-zoom */}
                <div
                  onClick={() =>
                    handleOpenZoom(
                      propertyImage,
                      `${property.title || "Property"} - Photo`
                    )
                  }
                  className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-200 shrink-0 cursor-pointer group border border-gray-200"
                  title="Click to zoom property image"
                >
                  <img
                    src={propertyImage}
                    alt={property.title || "Property"}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[11px] font-medium gap-1">
                    <ZoomIn size={14} />
                    <span>Zoom</span>
                  </div>
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${typeInfo.className}`}
                    >
                      {typeInfo.icon}
                      {typeInfo.label}
                    </span>
                    {property.houseSpaceType && (
                      <span className="text-[11px] bg-gray-200/80 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                        {property.houseSpaceType}
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/listings/${property.id}`}
                    className="text-base font-bold text-gray-900 hover:text-bprimary transition block truncate"
                    title={property.title}
                  >
                    {property.title || "Untitled Property"}
                  </Link>

                  <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
                    <MapPin size={13} className="text-gray-400 shrink-0" />
                    {[property.street, property.city, property.state, property.country]
                      .filter(Boolean)
                      .join(", ") || "Location not provided"}
                  </p>
                </div>
              </div>

              {/* Action: Go to property details */}
              <Link
                href={`/listings/${property.id}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-bprimary hover:text-white border border-gray-200 hover:border-bprimary rounded-xl text-xs font-semibold text-gray-700 shadow-xs transition shrink-0"
              >
                <ExternalLink size={13} />
                View Property Listing
              </Link>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center text-gray-400 text-xs italic bg-gray-50 rounded-xl border border-dashed border-gray-200">
            No property details associated with this booking record.
          </div>
        )}
      </div>

      {/* ── Booking Schedule & Financial Breakdown Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Schedule & Stay Details */}
        <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Calendar size={16} className="text-bprimary" />
            Stay Schedule & Reservation Details
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {/* Check-In */}
            <div className="bg-gray-50/80 rounded-xl p-3.5 space-y-1">
              <span className="text-xs text-gray-400 uppercase font-medium block">
                Check-In Date
              </span>
              <p className="text-sm font-bold text-gray-900">
                {checkIn
                  ? checkIn.toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "N/A"}
              </p>
              {booking.checkInTime && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock size={12} /> {booking.checkInTime}
                </span>
              )}
            </div>

            {/* Check-Out */}
            <div className="bg-gray-50/80 rounded-xl p-3.5 space-y-1">
              <span className="text-xs text-gray-400 uppercase font-medium block">
                Check-Out Date
              </span>
              <p className="text-sm font-bold text-gray-900">
                {checkOut
                  ? checkOut.toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "N/A"}
              </p>
              {booking.checkOutTime && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock size={12} /> {booking.checkOutTime}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
            {nights && (
              <div className="bg-blue-50/50 border border-blue-100/60 rounded-lg p-2.5 space-y-0.5">
                <span className="text-gray-500 block">Total Stay</span>
                <p className="font-bold text-gray-900">{nights} Night(s)</p>
              </div>
            )}
            <div className="bg-blue-50/50 border border-blue-100/60 rounded-lg p-2.5 space-y-0.5">
              <span className="text-gray-500 block">Guests</span>
              <p className="font-bold text-gray-900">
                {booking.guestCount ?? 1} Guest(s)
              </p>
            </div>
            {property?.priseBy && (
              <div className="bg-blue-50/50 border border-blue-100/60 rounded-lg p-2.5 space-y-0.5">
                <span className="text-gray-500 block">Pricing Rate</span>
                <p className="font-bold text-gray-900">{property.priseBy}</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment & Financial Breakdown */}
        <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Receipt size={16} className="text-bprimary" />
            Financial Breakdown & Payment
          </h3>

          <div className="space-y-2.5 text-sm">
            <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-500">Gross Total Price</span>
              <span className="font-bold text-gray-900">
                Kz {booking.totalPrice?.toLocaleString() ?? booking.totalPrice}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-500">Platform Commission Fee</span>
              <span className="font-semibold text-gray-700">
                Kz {booking.platformFee?.toLocaleString() ?? booking.platformFee}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-500">Host Net Earnings</span>
              <span className="font-bold text-emerald-600">
                Kz {booking.hostNetAmount?.toLocaleString() ?? booking.hostNetAmount}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-500">Payment Status</span>
              <span
                className={`font-semibold ${
                  booking.paymentStatus === "PAID"
                    ? "text-emerald-600"
                    : "text-amber-600"
                }`}
              >
                {booking.paymentStatus}
              </span>
            </div>

            {/* Payment Details / Gateway References */}
            {(booking.emisReference || booking.stripePaymentIntentId) && (
              <div className="flex items-center justify-between py-1.5 border-b border-gray-100 text-xs">
                <span className="text-gray-400">Payment Reference</span>
                <span className="font-mono text-gray-700 break-all">
                  {booking.emisReference || booking.stripePaymentIntentId}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Guest & Host Profiles Grid (Cross-Linking to User Management) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Guest Information */}
        <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <User size={16} className="text-bprimary" />
              Guest Information
            </h3>
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium border border-blue-100">
              Guest
            </span>
          </div>

          {guest ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <div
                  onClick={() =>
                    guest.profileImage &&
                    handleOpenZoom(guest.profileImage, `${guest.fullName || "Guest"}'s Photo`)
                  }
                  className={`relative group ${
                    guest.profileImage ? "cursor-pointer" : ""
                  }`}
                  title={guest.profileImage ? "Click to zoom photo" : ""}
                >
                  <Avatar className="w-14 h-14 rounded-xl border border-gray-100 shadow-xs">
                    <AvatarImage
                      src={guest.profileImage || ""}
                      alt={guest.fullName || "Guest"}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-bprimary/10 text-bprimary font-bold">
                      {guest.fullName?.charAt(0) || "G"}
                    </AvatarFallback>
                  </Avatar>
                  {guest.profileImage && (
                    <div className="absolute inset-0 bg-black/35 rounded-xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[10px] font-medium">
                      <ZoomIn size={14} />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-gray-900 truncate">
                      {guest.fullName || "Unnamed Guest"}
                    </h4>
                    {guest.isVerifiedUser && (
                      <span title="Verified User">
                        <BadgeCheck size={14} className="text-emerald-600 shrink-0" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {guest.email || "No email"}
                  </p>
                  {guest.phoneNumber && (
                    <p className="text-xs text-gray-500">{guest.phoneNumber}</p>
                  )}
                </div>
              </div>

              {/* Guest meta */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 rounded-xl p-3">
                <div>
                  <span className="text-gray-400 block">City</span>
                  <span className="font-semibold text-gray-800">
                    {guest.city || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">Date of Birth</span>
                  <span className="font-semibold text-gray-800">
                    {guest.birthDay || "—"}
                  </span>
                </div>
              </div>

              <Link
                href={`/user-management/${guest.id}?role=GUEST`}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-bprimary hover:text-white border border-gray-200 hover:border-bprimary rounded-xl text-xs font-semibold text-gray-700 transition"
              >
                <ExternalLink size={13} />
                View Guest User Details
              </Link>
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">
              No guest record associated with this booking.
            </p>
          )}
        </div>

        {/* Host Information */}
        <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Building size={16} className="text-bprimary" />
              Host Information
            </h3>
            <span className="text-xs bg-gray-900 text-white px-2 py-0.5 rounded font-medium">
              Host
            </span>
          </div>

          {host ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <div
                  onClick={() =>
                    host.profileImage &&
                    handleOpenZoom(host.profileImage, `${host.fullName || "Host"}'s Photo`)
                  }
                  className={`relative group ${
                    host.profileImage ? "cursor-pointer" : ""
                  }`}
                  title={host.profileImage ? "Click to zoom photo" : ""}
                >
                  <Avatar className="w-14 h-14 rounded-xl border border-gray-100 shadow-xs">
                    <AvatarImage
                      src={host.profileImage || ""}
                      alt={host.fullName || "Host"}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-bprimary/10 text-bprimary font-bold">
                      {host.fullName?.charAt(0) || "H"}
                    </AvatarFallback>
                  </Avatar>
                  {host.profileImage && (
                    <div className="absolute inset-0 bg-black/35 rounded-xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[10px] font-medium">
                      <ZoomIn size={14} />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-gray-900 truncate">
                      {host.fullName || "Unnamed Host"}
                    </h4>
                    {host.isSuperHost && (
                      <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-medium border border-amber-200">
                        SuperHost
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {host.email || "No email"}
                  </p>
                  {host.phoneNumber && (
                    <p className="text-xs text-gray-500">{host.phoneNumber}</p>
                  )}
                </div>
              </div>

              {/* Host quick specs */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 rounded-xl p-3">
                <div>
                  <span className="text-gray-400 block">Host Member Since</span>
                  <span className="font-semibold text-gray-800">
                    {host.createdAt ? new Date(host.createdAt).getFullYear() : "—"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">Host ID</span>
                  <span className="font-mono text-gray-700 truncate block">
                    {host.id}
                  </span>
                </div>
              </div>

              <Link
                href={`/user-management/${host.id}?role=HOST`}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-bprimary hover:text-white border border-gray-200 hover:border-bprimary rounded-xl text-xs font-semibold text-gray-700 transition"
              >
                <ExternalLink size={13} />
                View Host User Details
              </Link>
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">
              No host record available for this property.
            </p>
          )}
        </div>
      </div>

      {/* ── Booked Add-Ons Section ── */}
      {booking.addOns && booking.addOns.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Sparkles size={16} className="text-amber-500" />
            Booked Add-Ons & Extras
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {booking.addOns.map((item: any, i: number) => {
              const addOn = item.addOn || item;
              return (
                <div
                  key={i}
                  className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-gray-900">
                      {addOn.title || addOn.name || `Add-On #${i + 1}`}
                    </span>
                    {addOn.price !== undefined && (
                      <span className="text-xs font-bold text-bprimary">
                        Kz {addOn.price}
                      </span>
                    )}
                  </div>
                  {addOn.description && (
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {addOn.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

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

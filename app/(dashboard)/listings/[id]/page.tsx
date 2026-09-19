"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  usePropertyDetailsQuery,
  useUpdatePropertyStatusMutation,
} from "@/redux/api/listing.api";
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
  Building,
  CarFront,
  Sparkles,
  MapPin,
  Calendar,
  DollarSign,
  Star,
  User,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ShieldCheck,
  Bed,
  Bath,
  Users,
  Clock,
  Home,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Check,
  Ban,
  Tag,
  Phone,
  Mail,
  Compass,
  Utensils,
  PlusCircle,
  MessageSquare,
  BadgeAlert,
} from "lucide-react";

interface ZoomImageState {
  url: string;
  title: string;
}

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data, isLoading, isError, refetch } = usePropertyDetailsQuery(id);
  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useUpdatePropertyStatusMutation();

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Zoom state
  const [zoomImage, setZoomImage] = useState<ZoomImageState | null>(null);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  const property = data?.result;

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

  // Status update handler
  const handleStatusChange = async (
    newStatus: "DRAFT" | "PUBLISHED" | "REJECTED"
  ) => {
    if (!property) return;
    try {
      const res = await updateStatus({ id: property.id, status: newStatus }).unwrap();
      if (res?.success) {
        toast.success(`Property status updated to ${newStatus}`);
        refetch();
      } else {
        toast.error(res?.message || "Failed to update property status");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Error updating property status");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-9 h-9 animate-spin text-bprimary" />
        <p className="text-sm text-gray-500 font-medium">
          Loading property details...
        </p>
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
          <XCircle size={32} />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-800">Property Not Found</h2>
          <p className="text-sm text-gray-500 mt-1">
            Unable to load details for this property ID.
          </p>
        </div>
        <Link
          href="/listings"
          className="inline-flex items-center gap-2 px-4 py-2 bg-bprimary text-white text-sm rounded-lg hover:bg-bprimary/90 transition"
        >
          <ArrowLeft size={16} />
          Back to Listings
        </Link>
      </div>
    );
  }

  const images: string[] = property.images && property.images.length > 0
    ? property.images
    : ["https://api.zenexcloud.com/emdadullah/uploads/messages/files/1780416667413-yjvj4j0m9i.png"];

  // Helper for type styling
  const getTypeBadge = (type: string) => {
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

  const typeInfo = getTypeBadge(property.type);

  // Address string
  const city = property.location?.city || property.city || "";
  const state = property.location?.state || property.state || "";
  const country = property.location?.country || property.country || "";
  const street = property.location?.street || "";
  const flatFloorAddress = property.location?.flatFloorAddress || "";
  const postcode = property.location?.postcode || "";

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      {/* ── Top Navigation Bar & Action Controls ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition cursor-pointer shadow-xs"
        >
          <ArrowLeft size={16} />
          Back to Listings
        </button>

        {/* Status Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {property.status !== "PUBLISHED" && (
            <button
              onClick={() => handleStatusChange("PUBLISHED")}
              disabled={isUpdatingStatus}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer disabled:opacity-50"
            >
              <Check size={14} />
              Approve & Publish
            </button>
          )}

          {property.status !== "REJECTED" && (
            <button
              onClick={() => handleStatusChange("REJECTED")}
              disabled={isUpdatingStatus}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-semibold transition cursor-pointer disabled:opacity-50"
            >
              <Ban size={14} />
              Reject Listing
            </button>
          )}

          {property.status !== "DRAFT" && (
            <button
              onClick={() => handleStatusChange("DRAFT")}
              disabled={isUpdatingStatus}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 rounded-lg text-xs font-medium transition cursor-pointer disabled:opacity-50"
            >
              Move to Draft
            </button>
          )}
        </div>
      </div>

      {/* ── Hero Gallery & Main Card ── */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-5 sm:p-6 space-y-5">
        {/* Title & Primary Badges */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                {property.title}
              </h1>

              {/* Type badge */}
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${typeInfo.className}`}
              >
                {typeInfo.icon}
                {typeInfo.label}
              </span>

              {/* Status badge */}
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  property.status === "PUBLISHED"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : property.status === "DRAFT"
                    ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    property.status === "PUBLISHED"
                      ? "bg-green-500"
                      : property.status === "DRAFT"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                />
                {property.status}
              </span>
            </div>

            {/* Sub-meta chips */}
            <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
              {(city || country) && (
                <span className="flex items-center gap-1">
                  <MapPin size={14} className="text-gray-400" />
                  {[city, state, country].filter(Boolean).join(", ")}
                </span>
              )}

              <span className="flex items-center gap-1">
                <Calendar size={14} className="text-gray-400" />
                Created{" "}
                {property.createdAt
                  ? new Date(property.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "N/A"}
              </span>

              <span className="font-mono text-[11px] text-gray-400">
                ID: {property.id}
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="bg-bprimary/5 border border-bprimary/15 rounded-xl px-4 py-3 shrink-0 flex items-baseline gap-2">
            <div>
              <span className="text-xs text-gray-500 block uppercase font-medium">
                Base Price
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-900 leading-none">
                  Kz {property.basePrice}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  / {property.priseBy === "PER_DAY" ? "day" : "night"}
                </span>
              </div>
              {property.weekendPrice && (
                <span className="text-[11px] text-amber-700 font-medium block mt-0.5">
                  Weekend: Kz {property.weekendPrice}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Photo Gallery with Click to Zoom ── */}
        <div className="space-y-3">
          {/* Main Large Image */}
          <div
            onClick={() =>
              handleOpenZoom(
                images[activeImageIndex],
                `${property.title} - Photo #${activeImageIndex + 1}`
              )
            }
            className="relative h-64 sm:h-80 md:h-96 w-full rounded-2xl overflow-hidden bg-gray-100 group cursor-pointer border border-gray-200"
            title="Click to zoom image"
          >
            <img
              src={images[activeImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover transition duration-300 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-medium gap-2">
              <ZoomIn size={18} />
              <span>Click to Zoom</span>
            </div>

            {/* Image counter pill */}
            <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2.5 py-1 rounded-lg backdrop-blur-xs font-medium">
              {activeImageIndex + 1} / {images.length}
            </div>
          </div>

          {/* Thumbnail Carousel Strip */}
          {images.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition cursor-pointer ${
                    activeImageIndex === idx
                      ? "border-bprimary shadow-xs ring-2 ring-bprimary/20"
                      : "border-transparent opacity-65 hover:opacity-100"
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Description paragraph */}
        {property.description && (
          <div className="pt-2 border-t border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Description
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>
        )}
      </div>

      {/* ── Host Profile & Overview Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Host Information Card (Links to User Details) */}
        <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <User size={16} className="text-bprimary" />
              Host Information
            </h3>
            <span className="text-xs bg-bprimary/10 text-bprimary px-2 py-0.5 rounded font-medium">
              Host
            </span>
          </div>

          {property.host ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <Avatar className="w-14 h-14 rounded-xl border border-gray-100 shadow-xs">
                  <AvatarImage
                    src={property.host.profileImage || ""}
                    alt={property.host.fullName || "Host"}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-bprimary/10 text-bprimary font-bold">
                    {property.host.fullName?.charAt(0) || "H"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 truncate">
                    {property.host.fullName || "Unnamed Host"}
                  </h4>
                  <p className="text-xs text-gray-500 truncate">
                    {property.host.email || "No email"}
                  </p>
                  {property.host.phoneNumber && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {property.host.phoneNumber}
                    </p>
                  )}
                </div>
              </div>

              <Link
                href={`/user-management/${property.host.id}?role=HOST`}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-bprimary hover:text-white border border-gray-200 hover:border-bprimary rounded-xl text-xs font-semibold text-gray-700 transition"
              >
                <ExternalLink size={13} />
                View Host User Details
              </Link>
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">
              No host information associated with this property.
            </p>
          )}
        </div>

        {/* Space & Capacity Specs */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xs border border-gray-100 p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Building size={16} className="text-bprimary" />
            Property Specifications & Capacity
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {property.maxGuests !== undefined && (
              <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Users size={12} /> Max Guests
                </span>
                <p className="text-base font-bold text-gray-900">
                  {property.maxGuests} Guests
                </p>
              </div>
            )}

            {property.bedrooms !== undefined && (
              <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Bed size={12} /> Bedrooms
                </span>
                <p className="text-base font-bold text-gray-900">
                  {property.bedrooms} Beds
                </p>
              </div>
            )}

            {property.bathrooms !== undefined && (
              <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Bath size={12} /> Bathrooms
                </span>
                <p className="text-base font-bold text-gray-900">
                  {property.bathrooms} Baths
                </p>
              </div>
            )}

            {property.minStay !== undefined && (
              <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock size={12} /> Min Stay
                </span>
                <p className="text-base font-bold text-gray-900">
                  {property.minStay} Night(s)
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            {property.houseType && (
              <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-400">House Type</span>
                <span className="font-semibold text-gray-800 capitalize">
                  {property.houseType}
                </span>
              </div>
            )}
            {property.houseSpaceType && (
              <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-400">Space Type</span>
                <span className="font-semibold text-gray-800">
                  {property.houseSpaceType}
                </span>
              </div>
            )}
            {property.priseBy && (
              <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-400">Pricing Basis</span>
                <span className="font-semibold text-gray-800">
                  {property.priseBy}
                </span>
              </div>
            )}
            {property.lunchOffer !== undefined && (
              <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-400">Lunch Included</span>
                <span className="font-semibold text-gray-800">
                  {property.lunchOffer ? "Yes" : "No"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Address & Location Grid ── */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-5 sm:p-6 space-y-4">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
          <MapPin size={16} className="text-bprimary" />
          Location & Physical Address
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 text-sm">
          <div className="bg-gray-50 rounded-xl p-3.5 space-y-1">
            <span className="text-xs text-gray-400 block font-medium">City</span>
            <p className="text-sm font-bold text-gray-900">{city || "—"}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-3.5 space-y-1">
            <span className="text-xs text-gray-400 block font-medium">State / Region</span>
            <p className="text-sm font-bold text-gray-900">{state || "—"}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-3.5 space-y-1">
            <span className="text-xs text-gray-400 block font-medium">Country</span>
            <p className="text-sm font-bold text-gray-900">{country || "—"}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-3.5 space-y-1">
            <span className="text-xs text-gray-400 block font-medium">Postcode</span>
            <p className="text-sm font-bold text-gray-900">{postcode || "—"}</p>
          </div>

          {(street || flatFloorAddress) && (
            <div className="sm:col-span-2 md:col-span-4 bg-gray-50 rounded-xl p-3.5 space-y-1">
              <span className="text-xs text-gray-400 block font-medium">
                Street / Flat / Floor Address
              </span>
              <p className="text-sm font-medium text-gray-900">
                {[flatFloorAddress, street].filter(Boolean).join(", ")}
              </p>
            </div>
          )}

          {property.location?.latitude && property.location?.longitude && (
            <div className="sm:col-span-2 md:col-span-4 flex items-center gap-2 text-xs text-gray-500 font-mono">
              <span>Latitude: {property.location.latitude}</span>
              <span>•</span>
              <span>Longitude: {property.location.longitude}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Features & Amenities ── */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-5 sm:p-6 space-y-4">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
          <Sparkles size={16} className="text-amber-500" />
          Features, Amenities & Facilities
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* House Features */}
          {property.houseFeatures && property.houseFeatures.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                House Amenities
              </h4>
              <div className="flex flex-wrap gap-2">
                {property.houseFeatures.map((f: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg text-xs font-medium"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Essential Facilities */}
          {property.essentialFacilities && property.essentialFacilities.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Essential Facilities
              </h4>
              <div className="flex flex-wrap gap-2">
                {property.essentialFacilities.map((f: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-blue-50 text-blue-800 rounded-lg text-xs font-medium"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stand Out Facilities */}
          {property.standOutFacilities && property.standOutFacilities.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Standout Features
              </h4>
              <div className="flex flex-wrap gap-2">
                {property.standOutFacilities.map((f: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-amber-50 text-amber-800 rounded-lg text-xs font-medium"
                  >
                    ★ {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Safety Features */}
          {property.safetyFeatures && property.safetyFeatures.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Safety & Emergency
              </h4>
              <div className="flex flex-wrap gap-2">
                {property.safetyFeatures.map((f: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-medium"
                  >
                    ✓ {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Car Features */}
          {property.carFeatures && property.carFeatures.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Vehicle Features
              </h4>
              <div className="flex flex-wrap gap-2">
                {property.carFeatures.map((f: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-indigo-50 text-indigo-800 rounded-lg text-xs font-medium"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience Tours */}
          {property.guidedTour && property.guidedTour.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Tour Highlights
              </h4>
              <div className="flex flex-wrap gap-2">
                {property.guidedTour.map((f: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-purple-50 text-purple-800 rounded-lg text-xs font-medium"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Add-Ons Section ── */}
      {property.addOns && property.addOns.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <PlusCircle size={16} className="text-bprimary" />
            Configured Add-Ons & Extras
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {property.addOns.map((item: any, i: number) => {
              const addOn = item.addOn || item;
              return (
                <div
                  key={i}
                  className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-gray-900">
                      {addOn.title || addOn.name || `Add-on #${i + 1}`}
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

      {/* ── Guest Reviews Section ── */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare size={16} className="text-bprimary" />
            Guest Reviews & Feedback
          </h3>
          <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-lg text-amber-800 text-xs font-semibold">
            <Star size={13} className="fill-amber-500 text-amber-500" />
            <span>
              {property.avgRating ? Number(property.avgRating).toFixed(1) : "0.0"} / 5.0
            </span>
            <span className="text-gray-400 font-normal">
              ({property.reviews?.length || 0})
            </span>
          </div>
        </div>

        {property.reviews && property.reviews.length > 0 ? (
          <div className="space-y-3.5">
            {property.reviews.map((rev: any, idx: number) => (
              <div
                key={rev.id || idx}
                className="bg-gray-50/70 border border-gray-100 rounded-xl p-4 space-y-2"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="w-8 h-8 rounded-lg">
                      <AvatarImage
                        src={rev.user?.profileImage || ""}
                        alt={rev.user?.fullName || "User"}
                      />
                      <AvatarFallback className="text-xs font-bold">
                        {rev.user?.fullName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h5 className="text-xs font-bold text-gray-900">
                        {rev.user?.fullName || "Anonymous Guest"}
                      </h5>
                      <span className="text-[10px] text-gray-400">
                        {rev.createdAt
                          ? new Date(rev.createdAt).toLocaleDateString()
                          : "—"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                      <Star key={i} size={12} className="fill-amber-500" />
                    ))}
                  </div>
                </div>

                {rev.comment && (
                  <p className="text-xs text-gray-700 leading-relaxed pt-1">
                    {rev.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-400 text-xs italic bg-gray-50 rounded-xl border border-dashed border-gray-200">
            No guest reviews recorded for this listing yet.
          </div>
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
                {zoomImage?.title || "Property Photo Preview"}
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

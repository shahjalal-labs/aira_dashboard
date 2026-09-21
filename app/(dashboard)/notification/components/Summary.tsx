"use client";

import {
  useAllNotificationsQuery,
  useMarkAllReadMutation,
  useMarkSingleReadMutation,
  useNotificationStatsQuery,
} from "@/redux/api/notification.api";
import {
  Bell,
  Mail,
  AlertTriangle,
  CalendarCheck,
  CalendarX,
  MessageSquare,
  UserPlus,
  Info,
  Loader,
  Check,
  CreditCard,
  Building2,
  ShieldCheck,
  Clock,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoCheckmarkDone } from "react-icons/io5";
import { toast } from "sonner";

// ─── types & helpers ────────────────────────────────────────────────────────

type NotificationType =
  | "BOOKING_CREATED"
  | "BOOKING_CONFIRMED"
  | "BOOKING_CANCELLED"
  | "BOOKING_APPROVED"
  | "BOOKING_EXPIRED"
  | "DISPUTE_ESCALATED"
  | "NEW_HOST"
  | "SYSTEM"
  | string;

interface Notification {
  id: string;
  title: string;
  body: string;
  adminBody?: string | null;
  type: NotificationType;
  adminRead: boolean;
  adminReadAt?: string | null;
  createdAt: string;
  metaData?: any;
}

/**
 * Resolve notification destination from type and metadata
 */
function getNotificationDestination(n: Notification): string | null {
  let meta: any = n.metaData;
  if (typeof meta === "string") {
    try {
      meta = JSON.parse(meta);
    } catch {
      meta = {};
    }
  }

  // 1. Check explicit IDs in metadata
  const bookingId = meta?.bookingId || meta?.booking_id;
  const withdrawalId =
    meta?.withdrawalId || meta?.payoutId || meta?.withdrawal_id;
  const propertyId = meta?.propertyId || meta?.property_id;
  const userId = meta?.userId || meta?.user_id;

  if (withdrawalId) return `/payouts/${withdrawalId}`;
  if (bookingId) return `/bookings/${bookingId}`;
  if (propertyId) return `/listings/${propertyId}`;
  if (userId) return `/user-management/${userId}`;

  // 2. Type-based routing
  switch (n.type) {
    case "BOOKING_CREATED":
    case "BOOKING_CONFIRMED":
    case "BOOKING_CANCELLED":
    case "BOOKING_APPROVED":
    case "BOOKING_EXPIRED":
      return bookingId ? `/bookings/${bookingId}` : `/bookings`;
    case "NEW_HOST":
      return userId ? `/user-management/${userId}` : `/user-management`;
    case "SYSTEM": {
      const combined = `${n.title || ""} ${n.body || ""} ${
        n.adminBody || ""
      }`.toLowerCase();

      if (combined.includes("payout") || combined.includes("withdrawal")) {
        return withdrawalId ? `/payouts/${withdrawalId}` : `/payouts`;
      }
      if (combined.includes("booking")) {
        return bookingId ? `/bookings/${bookingId}` : `/bookings`;
      }
      if (combined.includes("listing") || combined.includes("property")) {
        return propertyId ? `/listings/${propertyId}` : `/listings`;
      }
      if (
        combined.includes("user") ||
        combined.includes("host") ||
        combined.includes("verification") ||
        combined.includes("identity") ||
        combined.includes("account")
      ) {
        return userId ? `/user-management/${userId}` : `/user-management`;
      }
      break;
    }
    default:
      break;
  }

  // 3. Fallback keyword matching on title and body
  const text = `${n.title || ""} ${n.body || ""} ${
    n.adminBody || ""
  }`.toLowerCase();

  if (text.includes("payout") || text.includes("withdrawal")) return `/payouts`;
  if (text.includes("booking")) return `/bookings`;
  if (text.includes("listing") || text.includes("property")) return `/listings`;
  if (text.includes("user") || text.includes("host") || text.includes("verification"))
    return `/user-management`;
  if (text.includes("review")) return `/reviews`;

  return null;
}

function getIcon(type: NotificationType, title?: string, metadata?: any) {
  const titleLower = (title || "").toLowerCase();

  // Payout related
  if (
    titleLower.includes("payout") ||
    titleLower.includes("withdrawal") ||
    metadata?.withdrawalId ||
    metadata?.payoutId
  ) {
    return (
      <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
        <CreditCard className="w-5 h-5" />
      </div>
    );
  }

  // User verification / Account related
  if (
    titleLower.includes("verification") ||
    titleLower.includes("verified") ||
    titleLower.includes("identity") ||
    titleLower.includes("account")
  ) {
    return (
      <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-purple-50 text-purple-600 shrink-0">
        <ShieldCheck className="w-5 h-5" />
      </div>
    );
  }

  // Property / Listing related
  if (
    titleLower.includes("listing") ||
    titleLower.includes("property") ||
    metadata?.propertyId
  ) {
    return (
      <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-amber-50 text-amber-600 shrink-0">
        <Building2 className="w-5 h-5" />
      </div>
    );
  }

  switch (type) {
    case "BOOKING_CREATED":
      return (
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50 text-blue-500 shrink-0">
          <CalendarCheck className="w-5 h-5" />
        </div>
      );
    case "BOOKING_APPROVED":
      return (
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-teal-50 text-teal-600 shrink-0">
          <CalendarCheck className="w-5 h-5" />
        </div>
      );
    case "BOOKING_CONFIRMED":
      return (
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-green-50 text-green-600 shrink-0">
          <CalendarCheck className="w-5 h-5" />
        </div>
      );
    case "BOOKING_CANCELLED":
      return (
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-red-50 text-red-500 shrink-0">
          <CalendarX className="w-5 h-5" />
        </div>
      );
    case "BOOKING_EXPIRED":
      return (
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-amber-50 text-amber-600 shrink-0">
          <Clock className="w-5 h-5" />
        </div>
      );
    case "DISPUTE_ESCALATED":
      return (
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-red-50 text-red-500 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
      );
    case "NEW_HOST":
      return (
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-50 text-indigo-500 shrink-0">
          <UserPlus className="w-5 h-5" />
        </div>
      );
    case "SYSTEM":
      return (
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-slate-100 text-slate-500 shrink-0">
          <MessageSquare className="w-5 h-5" />
        </div>
      );
    default:
      return (
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-slate-100 text-slate-400 shrink-0">
          <Info className="w-5 h-5" />
        </div>
      );
  }
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ─── component ──────────────────────────────────────────────────────────────

const Summary = () => {
  const router = useRouter();
  const { data } = useNotificationStatsQuery("");
  const [filter, setFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { data: notifications, isLoading } = useAllNotificationsQuery({
    searchTerm,
    filter,
  });
  const [markSingleRead] = useMarkSingleReadMutation();
  const [markAllRead] = useMarkAllReadMutation();

  const handleMarkSingleRead = async (notifId: string, read: boolean) => {
    try {
      const response: any = await markSingleRead({ notifId, read });
      if (response?.data?.success) {
        toast.success(`Notification marked as ${read ? "read" : "unread"}`);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update notification");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const response: any = await markAllRead("");
      if (response?.data?.success) {
        toast.success("All notifications marked as read");
      }
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  const handleCardClick = (n: Notification) => {
    // If notification is unread, mark it as read in the background
    if (!n.adminRead) {
      markSingleRead({ notifId: n.id, read: true }).catch(() => {});
    }

    const destination = getNotificationDestination(n);
    if (destination) {
      router.push(destination);
    } else {
      toast.info("No detailed view available for this notification type.");
    }
  };

  const items: Notification[] = notifications?.result?.data ?? [];

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Notifications</h1>
          <p className="text-xs text-gray-400 mt-0.5 mb-5">
            {data?.result?.unreadCount ?? 0} unread notifications
          </p>
        </div>
        <div className="flex">
          <button
            onClick={handleMarkAllRead}
            className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-white font-medium border border-bprimary hover:bg-bprimary/5 text-gray-800 rounded-lg text-xs transition active:scale-95 shadow-2xs"
          >
            <IoCheckmarkDone className="text-bprimary" size={18} />
            Mark All as Read
          </button>
        </div>
      </div>

      {/* ── Search ── */}
      <input
        onChange={(e) => setSearchTerm(e.target.value)}
        type="text"
        placeholder="Search notifications…"
        className="lg:w-1/2 w-full border border-gray-200 bg-white px-3.5 py-2 text-xs text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-bprimary/30 rounded-lg mb-6 shadow-2xs"
      />

      {/* ── Stats cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          {
            label: "Total Sent",
            value: data?.result?.totalCount,
            sub: "Email & SMS",
            key: "",
            icon: <Mail className="w-5 h-5 text-bprimary" />,
          },
          {
            label: "Unread",
            value: data?.result?.unreadCount,
            sub: "Require attention",
            key: "unread",
            icon: <Bell className="w-5 h-5 text-bprimary" />,
          },
          {
            label: "Sent Today",
            value: data?.result?.todayCount,
            sub: "Email & SMS",
            key: "today",
            icon: <Mail className="w-5 h-5 text-bprimary" />,
          },
        ].map((card) => (
          <div
            key={card.key}
            onClick={() => setFilter(card.key)}
            className={`rounded-xl p-5 cursor-pointer shadow-sm border transition-all ${
              filter === card.key
                ? "border-bprimary bg-bprimary/10 shadow-xs"
                : "border-gray-100 bg-white hover:shadow-md"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              {card.icon}
              <span className="text-sm font-medium text-gray-500">
                {card.label}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {card.value ?? "–"}
            </p>
            <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Notification list ── */}
      <div className="rounded-xl grid grid-cols-1 lg:grid-cols-2 gap-4">
        {items.length === 0 ? (
          <div className="col-span-full flex flex-col items-center gap-3 py-12 bg-white rounded-xl border border-gray-100">
            {isLoading ? (
              <Loader size={48} className="animate-spin text-bprimary" />
            ) : (
              <div className="text-center">
                <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-500">
                  No notifications found.
                </p>
              </div>
            )}
          </div>
        ) : (
          items.map((n) => {
            const destination = getNotificationDestination(n);

            return (
              <div
                key={n.id}
                onClick={() => handleCardClick(n)}
                className={`flex items-start sm:items-center justify-between gap-3 p-4 rounded-xl border transition-all cursor-pointer group ${
                  !n.adminRead
                    ? "bg-white border-blue-200/90 shadow-2xs hover:border-bprimary hover:shadow-md ring-1 ring-blue-500/10"
                    : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm"
                }`}
              >
                {/* Icon */}
                <div className="shrink-0 mt-0.5">
                  {getIcon(n.type, n.title, n.metaData)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-bprimary transition-colors">
                      {n.title}
                    </span>
                    {!n.adminRead && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-600 text-white leading-none shadow-2xs">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {n.adminBody ?? n.body}
                  </p>
                  {destination && (
                    <span className="text-[11px] font-medium text-bprimary/80 group-hover:text-bprimary flex items-center gap-0.5 mt-1.5 transition-colors">
                      View details{" "}
                      <ChevronRight
                        size={12}
                        className="group-hover:translate-x-0.5 transition-transform"
                      />
                    </span>
                  )}
                </div>

                {/* Right actions: time & mark as read/unread button */}
                <div className="shrink-0 flex flex-col items-end justify-between self-stretch gap-2.5">
                  <span className="text-[11px] text-gray-400 whitespace-nowrap">
                    {timeAgo(n.createdAt)}
                  </span>

                  {/* Mark Read / Unread Small Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkSingleRead(n.id, !n.adminRead);
                    }}
                    title={n.adminRead ? "Mark as Unread" : "Mark as Read"}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all cursor-pointer active:scale-95 shadow-2xs ${
                      !n.adminRead
                        ? "text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80"
                        : "text-gray-500 bg-gray-50 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {!n.adminRead ? (
                      <>
                        <Check size={12} className="stroke-[2.5]" />
                        <span>Mark Read</span>
                      </>
                    ) : (
                      <>
                        <Mail size={12} />
                        <span>Mark Unread</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Summary;

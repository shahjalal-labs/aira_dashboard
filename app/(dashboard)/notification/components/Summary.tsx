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
} from "lucide-react";
import { useState } from "react";
import { IoCheckmarkDone } from "react-icons/io5";
import { toast } from "sonner";

// ─── helpers ────────────────────────────────────────────────────────────────

type NotificationType =
  | "BOOKING_CREATED"
  | "BOOKING_CONFIRMED"
  | "BOOKING_CANCELLED"
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
  metaData?: Record<string, string>;
}

function getIcon(type: NotificationType) {
  switch (type) {
    case "BOOKING_CREATED":
      return (
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50">
          <CalendarCheck className="w-5 h-5 text-blue-500" />
        </div>
      );
    case "BOOKING_CONFIRMED":
      return (
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-green-50">
          <CalendarCheck className="w-5 h-5 text-green-500" />
        </div>
      );
    case "BOOKING_CANCELLED":
      return (
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-red-50">
          <CalendarX className="w-5 h-5 text-red-500" />
        </div>
      );
    case "DISPUTE_ESCALATED":
      return (
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-red-50">
          <AlertTriangle className="w-5 h-5 text-red-500" />
        </div>
      );
    case "NEW_HOST":
      return (
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-50">
          <UserPlus className="w-5 h-5 text-indigo-500" />
        </div>
      );
    case "SYSTEM":
      return (
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-slate-100">
          <MessageSquare className="w-5 h-5 text-slate-500" />
        </div>
      );
    default:
      return (
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-slate-100">
          <Info className="w-5 h-5 text-slate-400" />
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
    const response = await markSingleRead({ notifId, read });
    if (response.data.success) {
      toast.success(`Notification marked as ${read ? "read" : "unread"}`);
    }
  };

  const handleMarkAllRead = async () => {
    const response = await markAllRead("");
    if (response.data.success) {
      toast.success("All notifications marked as read");
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
        <div className="flex ">
          <button
            onClick={handleMarkAllRead}
            className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-white font-medium border border-bprimary rounded-lg"
          >
            <IoCheckmarkDone className="text-gray-500" size={20} />
            Mark All as Read
          </button>
        </div>
      </div>

      {/* ── Search ── */}
      <input
        onChange={(e) => setSearchTerm(e.target.value)}
        type="text"
        placeholder="Search notifications…"
        className="lg:w-1/2 w-full border border-gray-200 bg-white px-3 rounded-lg py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-bprimary/30 mb-6"
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
                ? "border-bprimary bg-bprimary/10"
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
          <div className="col-span-full flex flex-col items-center gap-3 py-10">
            {isLoading ? (
              <Loader size={90} className="animate-spin text-bprimary" />
            ) : (
              <p className="text-center text-sm text-gray-400">
                No notifications found.
              </p>
            )}
          </div>
        ) : (
          items.map((n) => (
            <div
              key={n.id}
              onClick={() => handleMarkSingleRead(n.id, !n.adminRead)}
              className="flex items-center gap-4 px-5 py-4 cursor-pointer bg-white rounded-lg"
            >
              {/* Icon */}
              <div className="shrink-0 mt-0.5">{getIcon(n.type)}</div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-gray-900 leading-snug">
                    {n.title}
                  </span>
                  {!n.adminRead && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-bprimary text-white leading-none">
                      New
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                  {n.adminBody ?? n.body}
                </p>
              </div>

              {/* Time */}
              <span className="shrink-0 text-[11px] text-gray-400 mt-1 whitespace-nowrap">
                {timeAgo(n.createdAt)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Summary;

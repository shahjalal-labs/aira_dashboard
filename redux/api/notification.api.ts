import { baseApi } from "./baseApi";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allNotifications: builder.query({
      query: ({ searchTerm, filter }) => {
        const params = new URLSearchParams({
          page: "1",
          limit: "150",
          searchTerm: searchTerm || "",
        });

        if (filter) {
          params.append("filter", filter);
        }

        return {
          url: `/admin/notifications?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["notifications"],
    }),
    notificationStats: builder.query({
      query: () => ({
        url: `/admin/notifications/summary`,
        method: "GET",
      }),
      providesTags: ["notifications"],
    }),
    markSingleRead: builder.mutation({
      query: ({ notifId, read }) => ({
        url: `/admin/notifications/${notifId}/mark-read`,
        method: "PATCH",
        body: { read },
      }),
      invalidatesTags: ["notifications"],
    }),
    markAllRead: builder.mutation({
      query: () => ({
        url: `/admin/notifications/mark-all-read`,
        method: "PATCH",
        body: { read: true },
      }),
      invalidatesTags: ["notifications"],
    }),
  }),
});

export const {
  useAllNotificationsQuery,
  useNotificationStatsQuery,
  useMarkSingleReadMutation,
  useMarkAllReadMutation,
} = notificationApi;

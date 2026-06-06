import { baseApi } from "./baseApi";

export const statsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    overviewStats: builder.query({
      query: () => ({
        url: `/admin/dashboard/stats`,
        method: "GET",
      }),
      providesTags: ["stats"],
    }),
    reviewStats: builder.query({
      query: () => ({
        url: `/admin/reviews/summary`,
        method: "GET",
      }),
      providesTags: ["stats"],
    }),
    reportStats: builder.query({
      query: () => ({
        url: `/admin/reports/overview`,
        method: "GET",
      }),
      providesTags: ["stats"],
    }),
    topListing: builder.query({
      query: () => ({
        url: `/admin/reports/top-properties`,
        method: "GET",
      }),
      providesTags: ["stats"],
    }),
    userGrowth: builder.query({
      query: () => ({
        url: `/admin/reports/users-chart`,
        method: "GET",
      }),
      providesTags: ["stats"],
    }),
    platfromChat: builder.query({
      query: () => ({
        url: `/admin/reports/platform-chart`,
        method: "GET",
      }),
      providesTags: ["stats"],
    }),
    bookingPieChart: builder.query({
      query: () => ({
        url: `/admin/reports/booking-pie-chart`,
        method: "GET",
      }),
      providesTags: ["stats"],
    }),
  }),
});

export const { useOverviewStatsQuery, useBookingPieChartQuery, usePlatfromChatQuery, useReviewStatsQuery, useReportStatsQuery, useTopListingQuery, useUserGrowthQuery } = statsApi;

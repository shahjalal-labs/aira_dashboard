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
  }),
});

export const { useOverviewStatsQuery, useReviewStatsQuery, useReportStatsQuery, useTopListingQuery, useUserGrowthQuery } = statsApi;

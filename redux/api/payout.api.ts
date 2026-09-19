import { baseApi } from "./baseApi";

export const payoutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allPayouts: builder.query({
      query: ({ page, limit = 10, searchTerm, status }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          searchTerm: searchTerm || "",
        });

        if (status) {
          params.append("status", status);
        }

        return {
          url: `/admin/payouts?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["payouts"],
    }),
    payoutStats: builder.query({
      query: () => ({
        url: `/admin/payouts/summary`,
        method: "GET",
      }),
      providesTags: ["payouts"],
    }),
  }),
});

export const { useAllPayoutsQuery, usePayoutStatsQuery } = payoutApi;

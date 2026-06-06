import { baseApi } from "./baseApi";

export const payoutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allPayouts: builder.query({
      query: ({ page, searchTerm, status }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: "15",
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

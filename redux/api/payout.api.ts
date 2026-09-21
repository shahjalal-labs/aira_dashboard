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
    payoutDetails: builder.query({
      query: (id: string) => ({
        url: `/admin/payouts/${id}`,
        method: "GET",
      }),
      providesTags: ["payouts"],
    }),
    updatePayoutStatus: builder.mutation({
      query: ({
        id,
        ...body
      }: {
        id: string;
        status: "SUCCEEDED" | "FAILED" | "PROCESSING";
        transactionId?: string;
        errorMessage?: string;
      }) => ({
        url: `/admin/payouts/status/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["payouts", "stats"],
    }),
  }),
});

export const {
  useAllPayoutsQuery,
  usePayoutStatsQuery,
  usePayoutDetailsQuery,
  useUpdatePayoutStatusMutation,
} = payoutApi;

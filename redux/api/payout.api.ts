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
      query: (arg: {
        id: string;
        status?: "SUCCEEDED" | "FAILED" | "PROCESSING";
        transactionId?: string;
        errorMessage?: string;
        data?: FormData;
      }) => {
        const { id, data, ...rest } = arg;
        const statusVal =
          rest.status ||
          (data instanceof FormData ? (data.get("status") as string) : undefined);
        const txIdVal =
          rest.transactionId ||
          (data instanceof FormData
            ? (data.get("transactionId") as string)
            : undefined);
        const errorMsgVal =
          rest.errorMessage ||
          (data instanceof FormData
            ? (data.get("errorMessage") as string)
            : undefined);

        const queryParams = new URLSearchParams();
        if (statusVal) queryParams.set("status", statusVal);
        if (txIdVal) queryParams.set("transactionId", txIdVal);
        if (errorMsgVal) queryParams.set("errorMessage", errorMsgVal);
        const queryString = queryParams.toString()
          ? `?${queryParams.toString()}`
          : "";

        return {
          url: `/admin/payouts/status/${id}${queryString}`,
          method: "PATCH",
          body: data || rest,
        };
      },
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

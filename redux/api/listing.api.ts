import { baseApi } from "./baseApi";

export const listingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allListings: builder.query({
      query: ({ page, limit = 10, searchTerm, status, type }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          searchTerm: searchTerm || "",
        });

        if (status) {
          params.append("status", status);
        }

        if (type) {
          params.append("type", type);
        }

        return {
          url: `/admin/properties?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["listings"],
    }),
    listingStats: builder.query({
      query: () => ({
        url: `/admin/properties/summary`,
        method: "GET",
      }),
      providesTags: ["listings"],
    }),
    propertyDetails: builder.query({
      query: (id: string) => ({
        url: `/properties/${id}`,
        method: "GET",
      }),
      providesTags: ["listings"],
    }),
    updatePropertyStatus: builder.mutation({
      query: ({
        id,
        status,
      }: {
        id: string;
        status: "DRAFT" | "PUBLISHED" | "REJECTED";
      }) => ({
        url: `/admin/properties/status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["listings"],
    }),
  }),
});

export const {
  useAllListingsQuery,
  useListingStatsQuery,
  usePropertyDetailsQuery,
  useUpdatePropertyStatusMutation,
} = listingApi;

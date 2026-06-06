import { baseApi } from "./baseApi";

export const listingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allListings: builder.query({
      query: ({ page, searchTerm, status, type }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: "15",
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
  }),
});

export const { useAllListingsQuery, useListingStatsQuery } = listingApi;

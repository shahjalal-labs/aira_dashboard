import { baseApi } from "./baseApi";

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allBooking: builder.query({
      query: ({ page, limit = 10, searchTerm, status, propertyType }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          searchTerm: searchTerm || "",
        });

        if (status) {
          params.append("status", status);
        }

        if (propertyType) {
          params.append("propertyType", propertyType);
        }

        return {
          url: `/admin/bookings?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["bookings"],
    }),
    allReviews: builder.query({
      query: ({ page, limit = 10, searchTerm }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          searchTerm: searchTerm || "",
        });

        return {
          url: `/admin/reviews?${params.toString()}`,
          method: "GET",
        };
      },
    }),
    bookingStats: builder.query({
      query: () => ({
        url: `/admin/bookings/summary`,
        method: "GET",
      }),
      providesTags: ["bookings"],
    }),
  }),
});

export const { useAllBookingQuery, useAllReviewsQuery, useBookingStatsQuery } =
  bookingApi;

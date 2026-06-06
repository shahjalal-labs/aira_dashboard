import { baseApi } from "./baseApi";

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allBooking: builder.query({
      query: ({ page, searchTerm, status, propertyType }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: "15",
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
      query: ({ page, searchTerm }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: "12",
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

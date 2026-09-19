import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (body) => ({
        url: `/auth/login`,
        method: `POST`,
        body: body,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (body) => ({
        url: `/auth/forget-password`,
        method: `POST`,
        body: body,
      }),
    }),
    verifyOTP: builder.mutation({
      query: (body) => ({
        url: `/auth/verify-otp`,
        method: `POST`,
        body: body,
      }),
    }),
    resetPassword: builder.mutation({
      query: (body) => {
        return {
          url: `/auth/reset-password`,
          method: `POST`,
          body: body,
        };
      },
    }),
    changePassword: builder.mutation({
      query: (body) => ({
        url: `/auth/change-pass`,
        method: `PATCH`,
        body: body,
      }),
    }),
    getMyProfile: builder.query({
      query: () => ({
        url: `/auth/me`,
        method: "GET",
      }),
      providesTags: ["profile"],
    }),
    userDetails: builder.query({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: "GET",
      }),
      providesTags: ["profile"],
    }),

    allUsers: builder.query({
      query: ({ page, limit = 10, searchTerm, status, role }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          searchTerm: searchTerm || "",
        });

        if (status) {
          params.append("status", status);
        }

        if (role) {
          params.append("role", role);
        }

        return {
          url: `/admin/users?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["profile"],
    }),
    userStats: builder.query({
      query: () => ({
        url: `/admin/users/summary`,
        method: "GET",
      }),
      providesTags: ["profile"],
    }),

    updateMyProfile: builder.mutation({
      query: (body) => ({
        url: `/auth/me/update`,
        method: `PATCH`,
        body: body,
      }),
      invalidatesTags: ["profile"],
    }),
    updateProfilePhoto: builder.mutation({
      query: (body: FormData) => ({
        url: `/auth/update-profile-photo`,
        method: `PATCH`,
        body: body,
      }),
      invalidatesTags: ["profile"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/delete/${id}`,
        method: `DELETE`,
      }),
      invalidatesTags: ["profile"],
    }),
    blockUnblock: builder.mutation({
      query: (id) => ({
        url: `/admin/users/status/${id}`,
        method: `PATCH`,
      }),
      invalidatesTags: ["profile"],
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useForgotPasswordMutation,
  useVerifyOTPMutation,
  useAllUsersQuery,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useUpdateProfilePhotoMutation,
  useUserDetailsQuery,
  useBlockUnblockMutation,
  useUserStatsQuery,
  useDeleteUserMutation,
} = authApi;

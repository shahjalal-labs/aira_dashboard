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
      query: (arg: string | { id: string; role?: string }) => {
        const id = typeof arg === "string" ? arg : arg.id;
        const role = typeof arg === "object" ? arg.role : undefined;
        return {
          url: `/user/${id}${role ? `?role=${role}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["profile"],
    }),
    verifyUserAccount: builder.mutation({
      query: ({ id, verified }: { id: string; verified: boolean }) => ({
        url: `/admin/users/verify/${id}`,
        method: "PATCH",
        body: { verified },
      }),
      invalidatesTags: ["profile"],
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
    updateIdentity: builder.mutation({
      query: (body) => ({
        url: `/auth/me/identity`,
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
    changeUserStatus: builder.mutation({
      query: ({
        id,
        status,
      }: {
        id: string;
        status: "ACTIVE" | "SUSPENDED";
      }) => ({
        url: `/admin/users/status/${id}`,
        method: `PATCH`,
        body: { status },
      }),
      invalidatesTags: ["profile"],
    }),
    blockUnblock: builder.mutation({
      query: (arg: any) => {
        const id = typeof arg === "object" ? arg.id : arg;
        const body =
          typeof arg === "object" && arg.status
            ? { status: arg.status }
            : undefined;
        return {
          url: `/admin/users/status/${id}`,
          method: `PATCH`,
          body,
        };
      },
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
  useUpdateIdentityMutation,
  useUpdateProfilePhotoMutation,
  useUserDetailsQuery,
  useBlockUnblockMutation,
  useChangeUserStatusMutation,
  useUserStatsQuery,
  useDeleteUserMutation,
  useVerifyUserAccountMutation,
} = authApi;

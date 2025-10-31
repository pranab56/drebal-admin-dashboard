import { api } from "../getBaseApi";

const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (loginCredentials) => {
        return {
          url: `/auth/login`,
          method: "POST",
          body: loginCredentials,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),
    register: builder.mutation({
      query: (registerData) => {
        return {
          url: "/users",
          method: "POST",
          body: registerData,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),
    verifyEmail: builder.mutation({
      query: ({ oneTimeCode, email }) => {
        return {
          url: "/auth/verify-account",
          method: "POST",
          body: { oneTimeCode, email },
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),
    resendOtp: builder.mutation({
      query: ({ email, authType }) => {
        return {
          url: "/auth/resend-otp",
          method: "POST",
          body: { email, authType },
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),
    forgotPassword: builder.mutation({
      query: ({ email }) => {
        return {
          url: "/auth/forget-password",
          method: "POST",
          body: { email },
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),
    resetPassword: builder.mutation({
      query: ({ newPassword, confirmPassword, verifyToken }) => {
        return {
          url: "/auth/reset-password",
          method: "POST",
          body: {
            newPassword,
            confirmPassword,
            verifyToken, // Include verifyToken in the request body
          },
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),
    changePassword: builder.mutation({
      query: ({ currentPassword, newPassword, confirmPassword }) => {
        return {
          url: "/auth/change-password",
          method: "POST",
          body: { currentPassword, newPassword, confirmPassword },
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),
    logout: builder.mutation({
      query: () => {
        return {
          url: "/auth/logout",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),
    getAdminByAuthId: builder.query({
      query: (authId) => {
        return {
          url: `/user/${authId}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
  useResendOtpMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useGetAdminByAuthIdQuery,
} = authApi;

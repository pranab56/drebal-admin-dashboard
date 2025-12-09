import { baseApi } from '../../../utils/apiBaseQuery';



export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    forgotEmail: builder.mutation({
      query: (forgotEmail) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: forgotEmail,
      }),
    }),

    resendOTP: builder.mutation({
      query: (forgotEmail) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: forgotEmail,
      }),
    }),



    verifyOTP: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: data,  // <-- must be an object
      }),
    }),


    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "post",
        headers: {
          Authorization: `${data.token}`,
          "Content-Type": "application/json"
        },
        body: {
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
          token: data.token
        },
      }),
    }),

  }),
});

// Export hooks
export const {
  useLoginMutation,
  useForgotEmailMutation,
  useVerifyOTPMutation,
  useResetPasswordMutation
} = authApi;

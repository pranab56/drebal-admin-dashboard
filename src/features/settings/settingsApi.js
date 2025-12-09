// features/category/categoryApi.ts
import { baseApi } from '../../../utils/apiBaseQuery';

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPersonalInformation: builder.query({
      query: () => ({
        url: `/user/profile`,
        method: "GET",
      }),
      providesTags: ['settings'],
    }),

    updatePersonalInformation: builder.mutation({
      query: (data) => ({
        url: `/user/profile`,
        method: "PATCH",
        body: data
      }),
      providesTags: ['settings'],
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: `/auth/change-password`,
        method: "POST",
        body: data
      }),
      providesTags: ['settings'],
    }),

    getPrivacyPolicy: builder.query({
      query: () => ({
        url: `/settings/privacy_policy`,
        method: "GET",
      }),
      providesTags: ['settings'],
    }),

    privacyPolicy: builder.mutation({
      query: (data) => ({
        url: `/settings`,
        method: "PUT",
        body: data
      }),
      providesTags: ['settings'],
    }),


    getTermsAndConditions: builder.query({
      query: () => ({
        url: `/settings/terms_and_conditions`,
        method: "GET",
      }),
      providesTags: ['settings'],
    }),

    termsAndConditions: builder.mutation({
      query: (data) => ({
        url: `/settings`,
        method: "PUT",
        body: data
      }),
      providesTags: ['settings'],
    }),

    getAbout: builder.query({
      query: () => ({
        url: `/settings/about_us`,
        method: "GET",
      }),
      providesTags: ['settings'],
    }),

    about: builder.mutation({
      query: (data) => ({
        url: `/settings`,
        method: "PUT",
        body: data
      }),
      providesTags: ['settings'],
    }),


    getFAQ: builder.query({
      query: ({ type, searchTerm }) => {
        const url = searchTerm
          ? `/settings/faq/${type}?searchTerm=${searchTerm}`
          : `/settings/faq/${type}`;

        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["settings"],
    }),


    createFAQ: builder.mutation({
      query: (data) => ({
        url: `/settings/faq`,
        method: "POST",
        body: data
      }),
      providesTags: ['settings'],
    }),


    deleteFAQ: builder.mutation({
      query: (id) => ({
        url: `/settings/faq/${id}`,
        method: "DELETE",
      }),
      providesTags: ['settings'],
    }),


    updateFAQ: builder.mutation({
      query: ({ data, id }) => ({
        url: `/settings/faq/${id}`,
        method: "PATCH",
        body: data
      }),
      providesTags: ['settings'],
    }),


  }),
});

export const {
  useGetPersonalInformationQuery,
  useUpdatePersonalInformationMutation,
  useChangePasswordMutation,
  useGetPrivacyPolicyQuery,
  usePrivacyPolicyMutation,
  useGetTermsAndConditionsQuery,
  useTermsAndConditionsMutation,
  useGetAboutQuery,
  useAboutMutation,
  useGetFAQQuery,
  useCreateFAQMutation,
  useDeleteFAQMutation,
  useUpdateFAQMutation
} = settingsApi;
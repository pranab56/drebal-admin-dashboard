// features/category/categoryApi.ts
import { baseApi } from '../../../utils/apiBaseQuery';

export const supportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSupport: builder.query({
      query: (searchTerm) => {
        const url = searchTerm
          ? `/settings/contact?searchTerm=${searchTerm}`
          : `/settings/contact`;  // no searchTerm → return all

        return {
          url,
          method: "GET",
        };
      },
      providesTags: ['support'],
    }),


    getSingleSupport: builder.query({
      query: (id) => ({
        url: `/settings/contact/${id}`,
        method: "GET",
      }),
      providesTags: ['event'],
    }),

    feedbackAdmin: builder.mutation({
      query: ({ data, id }) => ({
        url: `/settings/contact-email/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ['event'],
    }),

    deleteSupport: builder.mutation({
      query: (id) => ({
        url: `/settings/delete-contact/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['event'],
    }),
  }),
});

export const {
  useGetAllSupportQuery,
  useGetSingleSupportQuery,
  useFeedbackAdminMutation,
  useDeleteSupportMutation
} = supportApi;
// features/category/categoryApi.ts
import { baseApi } from '../../../utils/apiBaseQuery';

export const notficationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotification: builder.query({
      query: () => ({
        url: `/action/all-notification`,
        method: "GET",
      }),
      providesTags: ['notification'],
    }),


    AdminSendToboardCast: builder.mutation({
      query: (eventId) => ({
        url: `/notification/send-notification/${eventId}?status=success`,
        method: "PATCH",
      }),
      providesTags: ['notification'],
    }),


    AdminRejected: builder.mutation({
      query: (eventId) => ({
        url: `/notification/send-notification/${eventId}?status=rejected`,
        method: "PATCH",
      }),
      providesTags: ['notification'],
    }),


  }),
});

export const {
  useGetAllNotificationQuery,
  useAdminSendToboardCastMutation,
  useAdminRejectedMutation
} = notficationApi;
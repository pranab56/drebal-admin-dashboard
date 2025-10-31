import { api } from "../getBaseApi";

const notificationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => {
        return {
          url: `/notifications`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      providesTags: ["NOTIFICATION"],
    }),
    readSingleNotification: builder.mutation({
      query: (props: { id: string }) => {
        return {
          url: `/notifications/${props.id}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["NOTIFICATION"],
    }),
    readAllNotifications: builder.mutation({
      query: () => {
        return {
          url: `/notifications/all`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["NOTIFICATION"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetNotificationsQuery,
  useReadSingleNotificationMutation,
  useReadAllNotificationsMutation,
} = notificationApi;

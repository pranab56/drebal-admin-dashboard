// features/category/categoryApi.ts
import { baseApi } from '../../../utils/apiBaseQuery';

export const eventApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllEvents: builder.query({
      query: (eventStatus) => ({
        url: '/event/under-review',
        method: 'GET',
        params:
          eventStatus && eventStatus !== 'all'
            ? { EventStatus: eventStatus }
            : undefined,
      }),
      providesTags: ['event'],
    }),



    eventDetails: builder.query({
      query: (id) => ({
        url: `/event/${id}`,
        method: "GET",
      }),
      providesTags: ['event'],
    }),

    eventStatus: builder.mutation({
      query: (id) => ({
        url: `/action/event/${id}`,
        method: "PATCH",
      }),
      providesTags: ['event'],
    }),
  }),
});

export const {
  useGetAllEventsQuery,
  useEventDetailsQuery,
  useEventStatusMutation
} = eventApi;
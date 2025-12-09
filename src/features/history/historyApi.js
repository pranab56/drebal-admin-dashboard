// features/category/categoryApi.ts
import { baseApi } from '../../../utils/apiBaseQuery';

export const eventApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllHistory: builder.query({
      query: () => ({
        url: `/action/account-delete-history`,
        method: "GET",
      }),
      providesTags: ['history'],
    }),
  }),
});

export const {
  useGetAllHistoryQuery

} = eventApi;
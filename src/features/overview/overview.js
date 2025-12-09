// features/category/categoryApi.ts
import { baseApi } from '../../../utils/apiBaseQuery';

export const overviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllOverview: builder.query({
      query: () => ({
        url: "/action/dashboard",
        method: "GET",
      }),
      providesTags: ['overview'],
    }),

  }),
});

export const {
  useGetAllOverviewQuery
} = overviewApi;
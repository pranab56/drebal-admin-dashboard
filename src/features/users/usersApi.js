// features/category/subcategoryApi.ts
import { baseApi } from '../../../utils/apiBaseQuery';

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUser: builder.query({
      query: () => ({
        url: `/user`,
        method: "GET",
      }),
      providesTags: ["users"],
    }),

  }),
});

export const {
  useGetAllUserQuery
} = usersApi;
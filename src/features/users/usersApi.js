// features/category/subcategoryApi.ts
import { baseApi } from '../../../utils/apiBaseQuery';

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUser: builder.query({
      query: (search) => {
        const url = search
          ? `/action/all-user?searchTerm=${search}`
          : `/action/all-user`;

        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["users"],
    }),

    getSingleUser: builder.query({
      query: (id) => ({
        url: `/action/ticket-history/${id}`,
        method: "GET",
      }),
      providesTags: ['users'],
    }),

    blockAndUnBlock: builder.mutation({
      query: (id) => ({
        url: `/action/block-user/${id}`,
        method: "PATCH",
      }),
      providesTags: ['users'],
    }),


  }),
});

export const {
  useGetAllUserQuery,
  useGetSingleUserQuery,
  useBlockAndUnBlockMutation
} = usersApi;
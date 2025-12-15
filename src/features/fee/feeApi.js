// features/category/categoryApi.ts
import { baseApi } from '../../../utils/apiBaseQuery';

export const feeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    feeCreateAndUpdate: builder.mutation({
      query: (data) => ({
        url: `/user/mainland-fee`,
        method: "PUT",
        body: data,
      }),
      providesTags: ['fee'],
    }),


    getFee: builder.query({
      query: () => ({
        url: `/user/mainland-fee`,
        method: "GET",
      }),
      providesTags: ['fee'],
    }),



  }),
});

export const {
  useFeeCreateAndUpdateMutation,
  useGetFeeQuery
} = feeApi;
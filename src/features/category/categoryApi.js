// features/category/categoryApi.ts
import { baseApi } from '../../../utils/apiBaseQuery';

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategory: builder.query({
      query: () => ({
        url: "/event/allCategory",
        method: "GET",
      }),
      providesTags: ['Category'],
    }),

    createCategory: builder.mutation({
      query: (data) => ({
        url: "/event/category",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['Category'],
    }),

    editCategory: builder.mutation({
      query: ({ data, id }) => ({
        url: `/event/category/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ['Category'],
    }),

    deleteCategory: builder.mutation({
      query: ({ id, type }) => ({
        url: `/event/category-subcategory/${id}?type=${type}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Category'],
    }),
  }),
});

export const {
  useGetAllCategoryQuery,
  useCreateCategoryMutation,
  useEditCategoryMutation,
  useDeleteCategoryMutation
} = categoryApi;
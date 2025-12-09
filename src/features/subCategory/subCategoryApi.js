// features/category/subcategoryApi.ts
import { baseApi } from '../../../utils/apiBaseQuery';

export const subcategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubCategory: builder.query({
      query: () => ({
        url: `/event/Subcategory`,
        method: "GET",
      }),
      providesTags: ["SubCategory"],
    }),

    getCategorywiseSubCategory: builder.query({
      query: (categoryId) => ({
        url: `/event/Subcategory?categoryId=${categoryId}`,
        method: "GET",
      }),
      providesTags: ["SubCategory"],
    }),

    createSubCategory: builder.mutation({
      query: (data) => ({
        url: "/event/subCategory",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SubCategory"],
    }),

    editSubCategory: builder.mutation({
      query: ({ data, id }) => ({
        url: `/event/subcategory/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["SubCategory"],
    }),

    deleteSubCategory: builder.mutation({
      query: ({ subcategoryId, type }) => ({
        url: `/event/category-subcategory/${subcategoryId}?type=${type}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SubCategory"],
    }),
  }),
});

export const {
  useGetAllSubCategoryQuery,
  useGetCategorywiseSubCategoryQuery,
  useCreateSubCategoryMutation,
  useEditSubCategoryMutation,
  useDeleteSubCategoryMutation
} = subcategoryApi;
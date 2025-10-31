import { api } from "../getBaseApi";
import { UsersPropsType } from "./props.types";

const categoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: (props: UsersPropsType) => {
        return {
          url: `/category?page=${props.page}&limit=${props.limit}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      providesTags: ["CATEGORIES"],
    }),
    createCategory: builder.mutation({
      query: (data) => {
        return {
          url: `/category`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["CATEGORIES"],
    }),
    updateCategory: builder.mutation({
      query: (data) => {
        return {
          url: `/category/${data.id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["CATEGORIES"],
    }),
    deleteCategory: builder.mutation({
      query: (id) => {
        return {
          url: `/category/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["CATEGORIES"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} = categoryApi;

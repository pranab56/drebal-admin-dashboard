import { api } from "../getBaseApi";
import { SupportPropsType } from "./props.types";

const supportApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSupport: builder.query({
      query: (props: SupportPropsType) => {
        return {
          url: `/support?page=${props.page}&limit=${props.limit}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      providesTags: ["SUPPORT"],
    }),
    deleteSupport: builder.mutation({
      query: (id) => {
        return {
          url: `/support/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["SUPPORT"],
    }),
  }),
  overrideExisting: true,
});

export const { useGetSupportQuery, useDeleteSupportMutation } = supportApi;

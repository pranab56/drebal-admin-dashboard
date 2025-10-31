import { api } from "../getBaseApi";
import { UsersPropsType } from "./props.types";

const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (props: UsersPropsType) => {
        return {
          url: `/user?page=${props.page}&limit=${props.limit}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      providesTags: ["USERS"],
    }),
    deleteUser: builder.mutation({
      query: (id) => {
        return {
          url: `/user/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["USERS"],
    }),

    updateAdmin: builder.mutation({
      query: (data) => {
        return {
          url: `/user/profile`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["USERS"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateAdminMutation,
} = usersApi;

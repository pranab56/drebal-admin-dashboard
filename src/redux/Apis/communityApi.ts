import { api } from "../getBaseApi";
import { CommunityPropsType } from "./props.types";

const communityApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCommunity: builder.query({
      query: (props: CommunityPropsType & { sort?: string }) => {
        const params = new URLSearchParams({
          page: props.page.toString(),
          limit: props.limit.toString(),
        });

        if (props.sort) {
          params.append("sort", props.sort);
        }

        return {
          url: `/community?${params.toString()}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      providesTags: ["COMMUNITY"],
    }),
    createCommunity: builder.mutation({
      query: (data) => {
        return {
          url: `/community`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["COMMUNITY"],
    }),
    updateCommunity: builder.mutation({
      query: ({ id, ...data }) => {
        return {
          url: `/community/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["COMMUNITY"],
    }),

    deleteCommunity: builder.mutation({
      query: (id) => {
        return {
          url: `/community/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["COMMUNITY"],
    }),

    updateCommunityComment: builder.mutation({
      query: ({ communityId, answerId, ...data }) => {
        return {
          url: `/community/${communityId}/answers/${answerId}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["COMMUNITY"],
    }),
    deleteCommunityComment: builder.mutation({
      query: ({ communityId, answerId }) => {
        return {
          url: `/community/${communityId}/answers/${answerId}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["COMMUNITY"],
    }),

    createCommunityReply: builder.mutation({
      query: ({ communityId, ...data }) => {
        return {
          url: `/community/${communityId}/answers`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["COMMUNITY"],
    }),
  }),

  overrideExisting: true,
});

export const {
  useGetCommunityQuery,
  useCreateCommunityMutation,
  useDeleteCommunityMutation,
  useUpdateCommunityMutation,
  useDeleteCommunityCommentMutation,
  useUpdateCommunityCommentMutation,
  useCreateCommunityReplyMutation,
} = communityApi;

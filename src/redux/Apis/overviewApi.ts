import { api } from "../getBaseApi";
import { OverviewPropsType } from "./props.types";

const overviewApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStats: builder.query({
      query: () => {
        return {
          url: `/dashboard/stats`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      providesTags: ["OVERVIEW"],
    }),
    getUserEngagement: builder.mutation({
      query: (props: OverviewPropsType) => {
        return {
          url: `/dashboard/engagement?year=${props.year}`,
          method: "GET",
        };
      },
      invalidatesTags: ["OVERVIEW"],
    }),
  }),
  overrideExisting: true,
});

export const { useGetStatsQuery, useGetUserEngagementMutation } = overviewApi;

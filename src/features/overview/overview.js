// features/overview/overviewApi.ts
import { baseApi } from '../../../utils/apiBaseQuery';

export const overviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllOverview: builder.query({
      query: ({ year, month }) => {
        const params = new URLSearchParams();

        if (year) params.append("year", year);
        if (month) params.append("month", month);

        return {
          url: `/action/dashboard?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["overview"],
      // Automatically refetch when args change
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
  }),
});

export const {
  useGetAllOverviewQuery
} = overviewApi;
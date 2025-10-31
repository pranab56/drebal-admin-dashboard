import { api } from "../getBaseApi";
import { SupportPropsType } from "./props.types";

const readinessApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStandAloneExams: builder.query({
      query: (props: SupportPropsType) => {
        return {
          url: `/examination?page=${props.page}&limit=${props.limit}&test=68b6700814dfda1c81ffb6d9`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      providesTags: ["EXAMINATION"],
    }),
    createPromtStandAloneExam: builder.mutation({
      query: (data) => {
        return {
          url: `/prompt`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["EXAMINATION"],
    }),
    createPromtStandAloneQuestion: builder.mutation({
      query: (data) => {
        return {
          url: `/questions`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["EXAMINATION"],
    }),
    createPromtStandAloneQuestionSet: builder.mutation({
      query: (data) => {
        return {
          url: `/questionSet`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["EXAMINATION"],
    }),
    createPromtStandAloneExamination: builder.mutation({
      query: (data) => {
        return {
          url: `/examination`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["EXAMINATION"],
    }),
    getReadinessExams: builder.query({
      query: (props: SupportPropsType) => {
        return {
          url: `/examination?page=${props.page}&limit=${props.limit}&test=68b66fe114dfda1c81ffb6d7`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      providesTags: ["EXAMINATION"],
    }),

    // Readiness Exam Endpoints
    createPromtReadinessExam: builder.mutation({
      query: (data) => {
        // Handle form-data for both description and image types
        const formData = new FormData();

        if (data.type === "description") {
          // For description type: send JSON data in form-data
          formData.append(
            "data",
            JSON.stringify({
              title: data.title,
              description: data.description,
            })
          );
        } else if (data.type === "image") {
          // For image type: send both data and image
          formData.append(
            "data",
            JSON.stringify({
              title: data.title,
              description: data.description,
            })
          );
          if (data.image) {
            formData.append("image", data.image);
          }
        }

        return {
          url: `/prompt`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["EXAMINATION"],
    }),

    // Create Readiness Question
    createReadinessQuestion: builder.mutation({
      query: (data) => {
        return {
          url: `/questions`,
          method: "POST",
          body: data,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["EXAMINATION"],
    }),
    createPromptReadinessQuestionSet: builder.mutation({
      query: (data) => {
        return {
          url: `/questionSet`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["EXAMINATION"],
    }),
    createReadinessExamination: builder.mutation({
      query: (data) => {
        return {
          url: `/examination`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["EXAMINATION"],
    }),
    deleteExamination: builder.mutation({
      query: (id) => {
        return {
          url: `/examination/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["EXAMINATION"],
    }),
  }),

  overrideExisting: true,
});

export const {
  useGetStandAloneExamsQuery,
  useGetReadinessExamsQuery,
  useCreatePromtStandAloneExamMutation,
  useCreatePromtStandAloneQuestionMutation,
  useCreatePromtStandAloneQuestionSetMutation,
  useCreatePromtStandAloneExaminationMutation,
  useCreatePromtReadinessExamMutation,
  useCreateReadinessQuestionMutation,
  useCreatePromptReadinessQuestionSetMutation,
  useCreateReadinessExaminationMutation,
  useDeleteExaminationMutation,
} = readinessApi;

import { api } from "../getBaseApi";
import { StudyPropsType } from "./props.types";

const studyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCaseStudies: builder.query({
      query: (props: StudyPropsType & { course?: string }) => {
        const courseParam = props.course ? `&course=${props.course}` : "";
        return {
          url: `/studyLesson?page=${props.page}&limit=${props.limit}${courseParam}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      providesTags: ["STUDY"],
    }),
    getNextGenCourses: builder.query({
      query: (props: StudyPropsType) => {
        return {
          url: `/studyLesson?page=${props.page}&limit=${props.limit}&course=68b17feae57de2790ab6600e`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      providesTags: ["STUDY"],
    }),
    createCaseStudyPrompt: builder.mutation({
      query: (data: Record<string, unknown>) => {
        // Prepare the data object
        const dataObject: Record<string, unknown> = {
          title: data.title,
          description: data.description,
        };

        // Create FormData and append the data as JSON string
        const formData = new FormData();
        formData.append("data", JSON.stringify(dataObject));

        // Add image if present
        if (data.image instanceof File) {
          formData.append("image", data.image);
        } else if (typeof data.image === "string") {
          // If image is a string (base64 or URL), include it in the data
          dataObject.image = data.image;
        }

        // Add table-specific fields
        if (data.promptType) {
          formData.append("promptType", data.promptType as string);
        }

        if (data.promptTable) {
          formData.append("promptTable", JSON.stringify(data.promptTable));
        }

        return {
          url: `/prompt`,
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (response: {
        success: boolean;
        message?: string;
        data?: {
          _id: string;
          title: string;
          description: string;
          // Add other fields as needed
        };
      }) => {
        // Log the full response for debugging
        console.log("API Response:", response);

        // Ensure the response has the expected structure
        if (!response.success) {
          throw new Error(response.message || "Unknown error occurred");
        }

        return response;
      },
      invalidatesTags: ["STUDY"],
    }),
    createQuestion: builder.mutation({
      query: (data: Record<string, unknown>) => {
        return {
          url: `/questions`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["STUDY"],
    }),
    createQuestionSet: builder.mutation({
      query: (data) => {
        return {
          url: `/questionSet`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["STUDY"],
    }),
    createCaseStudy: builder.mutation({
      query: (data) => {
        return {
          url: `/studyLesson`,
          method: "POST",
          body: data,
        };
      },
    }),
    createNextGenCourse: builder.mutation({
      query: (formData: Record<string, unknown>) => {
        return {
          url: `/studyLesson`,
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (response: Record<string, unknown>) => {
        // Log the full response for debugging
        console.log("Next Gen Course API Response:", response);

        // Ensure the response has the expected structure
        if (!response.success) {
          throw new Error(
            (response.message as string) || "Unknown error occurred"
          );
        }

        return response;
      },
      invalidatesTags: ["STUDY"],
    }),
    deleteCaseStudy: builder.mutation({
      query: (id) => {
        return {
          url: `/studyLesson/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["STUDY"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCaseStudiesQuery,
  useGetNextGenCoursesQuery,
  useDeleteCaseStudyMutation,
  useCreateCaseStudyPromptMutation,
  useCreateQuestionMutation,
  useCreateQuestionSetMutation,
  useCreateCaseStudyMutation,
  useCreateNextGenCourseMutation,
} = studyApi;

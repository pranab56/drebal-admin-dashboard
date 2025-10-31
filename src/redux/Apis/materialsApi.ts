import { api } from "../getBaseApi";
import { MaterialsPropsType } from "./props.types";

const materialsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMaterials: builder.query({
      query: (props: MaterialsPropsType) => {
        return {
          url: `/studymaterial?page=${props.page}&limit=${props.limit}&category=${props.category}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      providesTags: ["MATERIALS"],
    }),
    createMaterial: builder.mutation({
      query: (data) => {
        return {
          url: `/studymaterial`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["MATERIALS"],
    }),
    deleteMaterial: builder.mutation({
      query: (id) => {
        return {
          url: `/studymaterial/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["MATERIALS"],
    }),
    getMnemonics: builder.query({
      query: (props: MaterialsPropsType) => {
        return {
          url: `/mnemonic?page=${props.page}&limit=${props.limit}&category=${props.category}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      providesTags: ["MATERIALS"],
    }),
    updateMnemonics: builder.mutation({
      query: ({ id, ...updateData }) => {
        return {
          url: `/mnemonic/${id}`,
          method: "PATCH",
          body: updateData,
        };
      },
      invalidatesTags: ["MATERIALS"],
    }),
    createMnemonics: builder.mutation({
      query: (data) => {
        return {
          url: `/mnemonic`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["MATERIALS"],
    }),
    deleteMnemonics: builder.mutation({
      query: (id) => {
        return {
          url: `/mnemonic/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["MATERIALS"],
    }),
    getQuestionSamples: builder.query({
      query: (props: MaterialsPropsType) => {
        return {
          url: `/studyMaterial?page=${props.page}&limit=${props.limit}&category=${props.category}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      providesTags: ["MATERIALS"],
    }),
    createQuestionSample: builder.mutation({
      query: (data) => {
        return {
          url: `/studyMaterial`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["MATERIALS"],
    }),

    updateStudyMaterial: builder.mutation({
      query: ({ id, ...updateData }) => {
        // Always use FormData for consistency
        const formData = new FormData();
        formData.append("name", updateData.name);
        formData.append("category", updateData.category);

        // Only append document if it's a File
        if (updateData.document instanceof File) {
          formData.append("document", updateData.document);
        }

        return {
          url: `/studymaterial/${id}`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["MATERIALS"],
      // Add timeout to prevent hanging requests
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Update study material failed:", error);
        }
      },
    }),
  }),

  overrideExisting: true,
});

export const {
  useGetMaterialsQuery,
  useDeleteMaterialMutation,
  useCreateMaterialMutation,
  useCreateMnemonicsMutation,
  useGetMnemonicsQuery,
  useUpdateMnemonicsMutation,
  useDeleteMnemonicsMutation,
  useCreateQuestionSampleMutation,
  useGetQuestionSamplesQuery,
  useUpdateStudyMaterialMutation,
} = materialsApi;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// StandAlone Exam Interface
interface StandAloneExam {
  _id: string;
  title: string;
  description: string;
  test: string;
  questionSetsCount: number;
  questionSteps: Array<{
    stepNo: number;
    questionSet: string;
    _id: string;
  }>;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  completedBy?: string[];
}

// Step 1 Form Data Interface
interface Step1FormData {
  title: string;
  description: string;
  image?: string; // Keep image if previously added
  isCompleted?: boolean;
}

// Prompt Interface
interface Prompt {
  _id: string;
  title: string;
  content: string;
  type: string;
  image?: string;
  description?: string;
}

// Question Interface
interface Question {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
  }[];
  correctAnswerId?: string;
  isSaved?: boolean;
}

interface StandAloneExamState {
  studyLessons: StandAloneExam[];
  step1FormData: Step1FormData;
  prompts: Prompt[];
  promptIds: string[]; // Change from latestPromptId to an array of IDs
  questions: Question[];
  questionIds: string[]; // Array to store question IDs
  questionSetIds: string[]; // Array to store question set IDs
  explanation: string; // Store explanation text
  completedContentTypes: string[]; // Track which content types are completed
  isLoading: boolean;
  error: string | null;
}

const initialState: StandAloneExamState = {
  studyLessons: [],
  step1FormData: {
    title: "",
    description: "",
    image: "", // Keep image if previously added
    isCompleted: false,
  },
  prompts: [],
  promptIds: [], // Initialize as an empty array
  questions: [],
  questionIds: [], // Initialize as an empty array
  questionSetIds: [], // Initialize as an empty array
  explanation: "", // Initialize explanation as empty string
  completedContentTypes: [], // Initialize as empty array
  isLoading: false,
  error: null,
};

const standAloneExamSlice = createSlice({
  name: "standAloneExam",
  initialState,
  reducers: {
    setStandAloneExams: (state, action: PayloadAction<StandAloneExam[]>) => {
      state.studyLessons = action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearStandAloneExams: (state) => {
      state.studyLessons = [];
      state.error = null;
    },
    removeStandAloneExam: (state, action: PayloadAction<string>) => {
      state.studyLessons = state.studyLessons.filter(
        (lesson) => lesson._id !== action.payload
      );
    },

    // Enhanced Step 1 Form Data Actions
    setStep1FormData: (state, action: PayloadAction<Step1FormData>) => {
      console.group("Redux: setStep1FormData");
      console.log("Payload:", action.payload);

      // Ensure all fields are present
      const { title = "", description = "" } = action.payload;

      // Update state with payload
      state.step1FormData = {
        title,
        description,
        isCompleted: !!(title && description),
      };

      console.log("Updated Step 1 Form Data:", state.step1FormData);
      console.log("Completion Status:", state.step1FormData.isCompleted);
      console.groupEnd();
    },
    updateStep1Field: (
      state,
      action: PayloadAction<{ field: keyof Step1FormData; value: string }>
    ) => {
      const { field, value } = action.payload;

      // Verbose logging
      console.group("Redux: updateStep1Field");
      console.log("Field:", field);
      console.log("Value:", value);
      console.log(
        "Current state:",
        JSON.parse(JSON.stringify(state.step1FormData))
      );

      // Type-safe update using spread operator
      state.step1FormData = {
        ...state.step1FormData,
        [field]: value,
      };

      // Check if all required fields are filled
      state.step1FormData.isCompleted = !!(
        (
          state.step1FormData.title &&
          state.step1FormData.description &&
          state.step1FormData.image
        ) // Include image in completion check
      );

      console.log(
        "Updated state:",
        JSON.parse(JSON.stringify(state.step1FormData))
      );
      console.groupEnd();
    },
    markStep1AsCompleted: (state) => {
      // Explicitly mark Step 1 as completed
      state.step1FormData.isCompleted = true;
    },
    resetStep1Completion: (state) => {
      // Reset completion status
      state.step1FormData.isCompleted = false;
    },
    clearStep1FormData: (state) => {
      state.step1FormData = {
        title: "",
        description: "",
        image: "", // Reset image field
        isCompleted: false,
      };
    },

    setPrompts: (
      state,
      action: PayloadAction<{ prompts: Prompt[]; addIds?: boolean }>
    ) => {
      const { prompts, addIds } = action.payload;

      // Ensure state.promptIds is an array, initialize if undefined
      if (!state.promptIds) {
        state.promptIds = [];
      }

      state.prompts = prompts;

      if (addIds) {
        const newIds = prompts
          .map((prompt) => prompt._id)
          .filter((id) => id != null && id !== "");

        const uniqueIds = newIds.filter((id) => !state.promptIds.includes(id));

        state.promptIds = [...state.promptIds, ...uniqueIds];
      }
    },

    // New action to add prompt IDs
    addPromptIds: (state, action: PayloadAction<string[]>) => {
      console.group("Redux: addPromptIds");
      console.log("Action payload:", action.payload);
      console.log("Current promptIds:", state.promptIds);

      // Ensure state.promptIds is an array, initialize if undefined
      if (!state.promptIds) {
        state.promptIds = [];
        console.log("Initialized promptIds array");
      }

      // Filter out null or undefined values
      const validIds = action.payload.filter((id) => id != null && id !== "");
      console.log("Valid IDs after filtering:", validIds);

      // Add new IDs, avoiding duplicates
      const newIds = validIds.filter((id) => !state.promptIds.includes(id));
      console.log("New IDs to add (no duplicates):", newIds);

      state.promptIds = [...state.promptIds, ...newIds];
      console.log("Updated promptIds:", state.promptIds);
      console.groupEnd();
    },

    // Optional: Clear prompt IDs if needed
    clearPromptIds: (state) => {
      console.group("Redux: clearPromptIds");
      console.log("Current promptIds before clearing:", state.promptIds);

      // Clear prompt IDs
      state.promptIds = [];

      console.log("Prompt IDs cleared");
      console.groupEnd();
    },

    // Question management actions
    setQuestions: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload;
    },
    addQuestion: (state, action: PayloadAction<Question>) => {
      state.questions.push(action.payload);
    },
    updateQuestion: (
      state,
      action: PayloadAction<{ id: string; question: Question }>
    ) => {
      const { id, question } = action.payload;
      const index = state.questions.findIndex((q: Question) => q.id === id);
      if (index !== -1) {
        state.questions[index] = question;
      }
    },
    removeQuestion: (state, action: PayloadAction<string>) => {
      state.questions = state.questions.filter(
        (q: Question) => q.id !== action.payload
      );
    },
    clearQuestions: (state) => {
      state.questions = [];
    },

    // Question ID management actions
    addQuestionIds: (state, action: PayloadAction<string[]>) => {
      // Ensure state.questionIds is an array, initialize if undefined
      if (!state.questionIds) {
        state.questionIds = [];
      }

      // Filter out null or undefined values
      const validIds = action.payload.filter((id) => id != null && id !== "");

      // Add new IDs, avoiding duplicates
      const newIds = validIds.filter((id) => !state.questionIds.includes(id));

      state.questionIds = [...state.questionIds, ...newIds];
    },

    clearQuestionIds: (state) => {
      state.questionIds = [];
    },

    // Question Set ID management actions
    addQuestionSetIds: (state, action: PayloadAction<string[]>) => {
      console.group("Redux: addQuestionSetIds");
      console.log("Action payload:", action.payload);
      console.log("Current questionSetIds:", state.questionSetIds);

      // Ensure state.questionSetIds is an array, initialize if undefined
      if (!state.questionSetIds) {
        state.questionSetIds = [];
        console.log("Initialized questionSetIds array");
      }

      // Filter out null or undefined values
      const validIds = action.payload.filter((id) => id != null && id !== "");
      console.log("Valid IDs after filtering:", validIds);

      // Add new IDs, avoiding duplicates
      const newIds = validIds.filter(
        (id) => !state.questionSetIds.includes(id)
      );
      console.log("New IDs to add (no duplicates):", newIds);

      state.questionSetIds = [...state.questionSetIds, ...newIds];
      console.log("Updated questionSetIds:", state.questionSetIds);
      console.groupEnd();
    },

    clearQuestionSetIds: (state) => {
      state.questionSetIds = [];
    },

    // New action to store all question set IDs for final submission
    storeAllQuestionSetIds: (state, action: PayloadAction<string[]>) => {
      console.group("Redux: storeAllQuestionSetIds");
      console.log("Current questionSetIds:", state.questionSetIds);
      console.log("New question set IDs to add:", action.payload);

      // Ensure no duplicates and only valid IDs
      const newIds = action.payload.filter(
        (id) => id != null && id !== "" && !state.questionSetIds.includes(id)
      );

      // Accumulate question set IDs
      state.questionSetIds = [...state.questionSetIds, ...newIds];

      console.log("Updated questionSetIds:", state.questionSetIds);
      console.groupEnd();
    },

    // Explanation management actions
    setExplanation: (state, action: PayloadAction<string>) => {
      state.explanation = action.payload;
    },
    clearExplanation: (state) => {
      state.explanation = "";
    },

    // Content type completion management
    addCompletedContentType: (state, action: PayloadAction<string>) => {
      const contentType = action.payload;
      if (!state.completedContentTypes.includes(contentType)) {
        state.completedContentTypes.push(contentType);
      }
    },
    clearCompletedContentTypes: (state) => {
      state.completedContentTypes = [];
    },

    // Reset all question-related states while keeping Step 1 data
    resetQuestionStates: (state) => {
      console.group("Redux: resetQuestionStates");
      console.log("Resetting question-related states");

      // Clear questions, question IDs, and question set IDs
      state.questions = [];
      state.questionIds = [];
      state.questionSetIds = [];
      state.prompts = [];
      state.promptIds = [];
      state.explanation = "";
      state.completedContentTypes = [];

      console.log("Question states reset");
      console.groupEnd();
    },
  },
});

export const {
  setStandAloneExams,
  setLoading,
  setError,
  clearStandAloneExams,
  removeStandAloneExam,
  setStep1FormData,
  updateStep1Field,
  clearStep1FormData,
  markStep1AsCompleted,
  resetStep1Completion,
  setPrompts,
  addPromptIds,
  clearPromptIds,
  setQuestions,
  addQuestion,
  updateQuestion,
  removeQuestion,
  clearQuestions,
  addQuestionIds,
  clearQuestionIds,
  addQuestionSetIds,
  clearQuestionSetIds,
  storeAllQuestionSetIds,
  setExplanation,
  clearExplanation,
  addCompletedContentType,
  clearCompletedContentTypes,
  resetQuestionStates,
} = standAloneExamSlice.actions;
export default standAloneExamSlice.reducer;

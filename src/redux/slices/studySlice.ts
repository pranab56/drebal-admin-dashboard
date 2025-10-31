import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Course {
  _id: string;
  title: string;
  description: string;
  image: string;
  accessibleTo: string;
  studyLessons: StudyLesson[]; // Replace any[] with StudyLesson[]
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  subtitle: string;
  topic: string;
}

interface Category {
  _id: string;
  name: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface StudyLesson {
  _id: string;
  course: Course;
  title: string;
  description: string;
  questionSets: QuestionSet[]; // Replace any[] with QuestionSet[]
  category: Category;
  questionSetsCount: number;
  altText: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Add a new interface for QuestionSet
interface QuestionSet {
  _id: string;
  title: string;
  questions: Question[];
  type: string;
}

// Step 1 Form Data Interface
interface Step1FormData {
  title: string;
  category: string;
  description: string;
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

interface StudyState {
  studyLessons: StudyLesson[];
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

const initialState: StudyState = {
  studyLessons: [],
  step1FormData: {
    title: "",
    category: "",
    description: "",
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

const studySlice = createSlice({
  name: "study",
  initialState,
  reducers: {
    setStudyLessons: (state, action: PayloadAction<StudyLesson[]>) => {
      state.studyLessons = action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearStudyLessons: (state) => {
      state.studyLessons = [];
      state.error = null;
    },
    removeStudyLesson: (state, action: PayloadAction<string>) => {
      state.studyLessons = state.studyLessons.filter(
        (lesson) => lesson._id !== action.payload
      );
    },

    // Step 1 Form Data Actions
    setStep1FormData: (state, action: PayloadAction<Step1FormData>) => {
      console.log("Redux: setStep1FormData called with:", action.payload);
      state.step1FormData = action.payload;
      console.log("Redux: step1FormData updated to:", state.step1FormData);
    },
    updateStep1Field: (
      state,
      action: PayloadAction<{ field: keyof Step1FormData; value: string }>
    ) => {
      const { field, value } = action.payload;
      console.log(`Redux: updateStep1Field called - ${field}: ${value}`);
      state.step1FormData[field] = value;
      console.log("Redux: step1FormData updated to:", state.step1FormData);
    },
    clearStep1FormData: (state) => {
      state.step1FormData = {
        title: "",
        category: "",
        description: "",
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
      // Ensure state.promptIds is an array, initialize if undefined
      if (!state.promptIds) {
        state.promptIds = [];
      }

      // Filter out null or undefined values
      const validIds = action.payload.filter((id) => id != null && id !== "");

      // Add new IDs, avoiding duplicates
      const newIds = validIds.filter((id) => !state.promptIds.includes(id));

      state.promptIds = [...state.promptIds, ...newIds];
    },

    // Optional: Clear prompt IDs if needed
    clearPromptIds: (state) => {
      state.promptIds = [];
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

    // Reset all question-related states while keeping Step 1 data and accumulated question set IDs
    resetQuestionStates: (state) => {
      console.group("Redux: resetQuestionStates");
      console.log("Resetting question-related states");
      console.log("Current questionSetIds before reset:", state.questionSetIds);

      // Clear questions, question IDs, prompts, and explanation
      // BUT KEEP questionSetIds to accumulate multiple question sets
      state.questions = [];
      state.questionIds = [];
      state.prompts = [];
      state.promptIds = [];
      state.explanation = "";
      state.completedContentTypes = [];

      console.log(
        "Question states reset (questionSetIds preserved):",
        state.questionSetIds
      );
      console.groupEnd();
    },
  },
});

export const {
  setStudyLessons,
  setLoading,
  setError,
  clearStudyLessons,
  removeStudyLesson,
  setStep1FormData,
  updateStep1Field,
  clearStep1FormData,
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
} = studySlice.actions;
export default studySlice.reducer;

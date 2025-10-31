import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Course {
  _id: string;
  title: string;
  description: string;
  image: string;
  accessibleTo: string;
  studyLessons: Record<string, unknown>[];
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

interface NextGenLesson {
  _id: string;
  course: Course;
  title: string;
  description: string;
  questionSets: Record<string, unknown>[];
  category: Category;
  questionSetsCount: number;
  altText: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Step 1 Form Data Interface
interface Step1FormData {
  title: string;
  subtitle: string;
  topic: string;
  description: string;
  category: string;
  image: string;
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

interface NextGenState {
  nextGenLessons: NextGenLesson[];
  step1FormData: Step1FormData;
  prompts: Prompt[];
  promptIds: string[]; // Change from latestPromptId to an array of IDs
  questions: Question[];
  questionIds: string[]; // Array to store question IDs
  questionSets: string[]; // Array to store question set IDs
  explanation: string; // Store explanation text
  completedContentTypes: string[]; // Track which content types are completed
  isLoading: boolean;
  error: string | null;
}

const initialState: NextGenState = {
  nextGenLessons: [],
  step1FormData: {
    title: "",
    subtitle: "",
    topic: "",
    description: "",
    category: "",
    image: "",
  },
  prompts: [],
  promptIds: [], // Initialize as an empty array
  questions: [],
  questionIds: [], // Initialize as an empty array
  questionSets: [], // Initialize as an empty array
  explanation: "", // Initialize explanation as empty string
  completedContentTypes: [], // Initialize as empty array
  isLoading: false,
  error: null,
};

const nextGenSlice = createSlice({
  name: "nextGen",
  initialState,
  reducers: {
    setNextGenLessons: (state, action: PayloadAction<NextGenLesson[]>) => {
      state.nextGenLessons = action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearNextGenLessons: (state) => {
      state.nextGenLessons = [];
      state.error = null;
    },
    removeNextGenLesson: (state, action: PayloadAction<string>) => {
      state.nextGenLessons = state.nextGenLessons.filter(
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
        subtitle: "",
        topic: "",
        description: "",
        category: "",
        image: "",
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
      // Ensure state.questionSets is an array, initialize if undefined
      if (!state.questionSets) {
        state.questionSets = [];
      }

      // Filter out null or undefined values
      const validIds = action.payload.filter((id) => id != null && id !== "");

      // Add new IDs, avoiding duplicates
      const newIds = validIds.filter((id) => !state.questionSets.includes(id));

      state.questionSets = [...state.questionSets, ...newIds];
    },

    clearQuestionSets: (state) => {
      state.questionSets = [];
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
  },
});

export const {
  setNextGenLessons,
  setLoading,
  setError,
  clearNextGenLessons,
  removeNextGenLesson,
  setStep1FormData,
  updateStep1Field,
  clearStep1FormData,
  setQuestions,
  addQuestion,
  updateQuestion,
  removeQuestion,
  clearQuestions,
  addQuestionIds,
  clearQuestionIds,
  addQuestionSetIds,
  clearQuestionSets,
  setExplanation,
  clearExplanation,
  addCompletedContentType,
  clearCompletedContentTypes,
} = nextGenSlice.actions;
export default nextGenSlice.reducer;

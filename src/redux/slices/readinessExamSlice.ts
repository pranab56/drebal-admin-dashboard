import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Readiness Exam Interface
interface ReadinessExam {
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

interface ReadinessExamState {
  readinessExams: ReadinessExam[];
  step1FormData: Step1FormData;
  prompts: Prompt[];
  promptIds: string[]; // Change from latestPromptId to an array of IDs
  questions: Question[];
  questionIds: string[]; // Array to store question IDs
  questionSetIds: string[]; // Array to store question set IDs
  explanation: string; // Store explanation text
  completedContentTypes: string[]; // Track which content types are completed
  currentPromptId: string | null; // Store the current prompt ID from response
  currentQuestionId: string | null; // Store the current question ID from response
  currentQuestionSetId: string | null; // Store the current question set ID from response
  isLoading: boolean;
  error: string | null;
}

const initialState: ReadinessExamState = {
  readinessExams: [],
  step1FormData: {
    title: "",
    description: "",
    isCompleted: false,
  },
  prompts: [],
  promptIds: [], // Initialize as an empty array
  questions: [],
  questionIds: [], // Initialize as an empty array
  questionSetIds: [], // Initialize as an empty array
  explanation: "", // Initialize explanation as empty string
  completedContentTypes: [], // Initialize as empty array
  currentPromptId: null, // Initialize current prompt ID as null
  currentQuestionId: null, // Initialize current question ID as null
  currentQuestionSetId: null, // Initialize current question set ID as null
  isLoading: false,
  error: null,
};

const readinessExamSlice = createSlice({
  name: "readinessExam",
  initialState,
  reducers: {
    // Update step 1 form data (title and description)
    updateStep1FormData: (
      state,
      action: PayloadAction<Partial<Step1FormData>>
    ) => {
      state.step1FormData = {
        ...state.step1FormData,
        ...action.payload,
      };
    },
    // Clear step 1 form data
    clearStep1FormData: (state) => {
      state.step1FormData = {
        title: "",
        description: "",
        isCompleted: false,
      };
    },
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    // Set current prompt ID
    setCurrentPromptId: (state, action: PayloadAction<string | null>) => {
      state.currentPromptId = action.payload;
    },
    // Add prompt ID to the array
    addPromptId: (state, action: PayloadAction<string>) => {
      if (!state.promptIds.includes(action.payload)) {
        state.promptIds.push(action.payload);
      }
    },
    // Set current question ID
    setCurrentQuestionId: (state, action: PayloadAction<string | null>) => {
      state.currentQuestionId = action.payload;
    },
    // Add question ID to the array
    addQuestionId: (state, action: PayloadAction<string>) => {
      if (!state.questionIds.includes(action.payload)) {
        state.questionIds.push(action.payload);
      }
    },
    // Set current question set ID
    setCurrentQuestionSetId: (state, action: PayloadAction<string | null>) => {
      state.currentQuestionSetId = action.payload;
    },
    // Add question set ID to the array
    addQuestionSetId: (state, action: PayloadAction<string>) => {
      if (!state.questionSetIds.includes(action.payload)) {
        state.questionSetIds.push(action.payload);
      }
    },
    // Clear all state
    clearAllState: (state) => {
      state.step1FormData = {
        title: "",
        description: "",
        isCompleted: false,
      };
      state.prompts = [];
      state.promptIds = [];
      state.questions = [];
      state.questionIds = [];
      state.questionSetIds = [];
      state.explanation = "";
      state.completedContentTypes = [];
      state.currentPromptId = null;
      state.currentQuestionId = null;
      state.currentQuestionSetId = null;
      state.isLoading = false;
      state.error = null;
    },

    // Clear state but preserve questionSetIds for adding another question set
    clearStatePreserveQuestionSets: (state) => {
      state.step1FormData = {
        title: "",
        description: "",
        isCompleted: false,
      };
      state.prompts = [];
      state.promptIds = [];
      state.questions = [];
      state.questionIds = [];
      // Preserve questionSetIds
      state.explanation = "";
      state.completedContentTypes = [];
      state.currentPromptId = null;
      state.currentQuestionId = null;
      state.currentQuestionSetId = null;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  updateStep1FormData,
  clearStep1FormData,
  setLoading,
  setError,
  setCurrentPromptId,
  addPromptId,
  setCurrentQuestionId,
  addQuestionId,
  setCurrentQuestionSetId,
  addQuestionSetId,
  clearAllState,
  clearStatePreserveQuestionSets,
} = readinessExamSlice.actions;
export default readinessExamSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  _id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  verified: boolean;
  role: string;
  address?: string;
  phone?: string;
  profile?: string;
  createdAt: string;
  updatedAt: string;
  location: {
    type: string;
    coordinates: number[];
  };
  __v?: number;
}

interface UsersState {
  users: User[];
  filteredUsers: User[];
  isLoading: boolean;
  filterRole: string | null; // null means show all, "student" means show only students
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  filteredUsers: [],
  isLoading: false,
  filterRole: "student", // Default to showing only students
  error: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
      // Always filter to show only students by default
      state.filteredUsers = action.payload.filter(
        (user) => user.role === "student"
      );
      state.filterRole = "student";
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    filterByRole: (state, action: PayloadAction<string | null>) => {
      state.filterRole = action.payload;
      if (action.payload) {
        // Filter to show only users with the specified role
        state.filteredUsers = state.users.filter(
          (user) => user.role === action.payload
        );
      } else {
        // Show all users
        state.filteredUsers = state.users;
      }
    },
    showOnlyStudents: (state) => {
      state.filterRole = "student";
      state.filteredUsers = state.users.filter(
        (user) => user.role === "student"
      );
    },
    showAllUsers: (state) => {
      state.filterRole = null;
      state.filteredUsers = state.users;
    },
    clearUsers: (state) => {
      state.users = [];
      state.filteredUsers = [];
      state.filterRole = null;
      state.error = null;
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((user) => user._id !== action.payload);
      state.filteredUsers = state.filteredUsers.filter(
        (user) => user._id !== action.payload
      );
    },
  },
});

export const {
  setUsers,
  setLoading,
  setError,
  filterByRole,
  showOnlyStudents,
  showAllUsers,
  clearUsers,
  deleteUser,
} = usersSlice.actions;
export default usersSlice.reducer;

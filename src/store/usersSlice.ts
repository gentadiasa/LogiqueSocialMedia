import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { User, UserResponse } from '../types';
import { RootState } from '.';

const API_KEY = '664818d84d6ab8b020baa1fe';
const API_URL = 'https://dummyapi.io/data/v1/';

export const fetchUsers = createAsyncThunk<
  UserResponse,
  number,
  { rejectValue: string }
>(
  'users/fetchUsers',
  async (page: number, { rejectWithValue }) => {
    console.log('FETCH USERRRR')
    try {
      const response = await axios.get(`${API_URL}/user`, {
        headers: { 'app-id': API_KEY },
        params: { page, limit: 20 },
      });
      console.log('RES FETCH USERRRR', response.data)
      return response.data;
    } catch (error) {
      let err = error as AxiosError
      console.log('ERR FETCH USERRRR', err)
      return rejectWithValue(err.message);
    }
  }
);

interface UsersState {
  data: User[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  page: number;
  total: number;
}

const initialState: UsersState = {
  data: [],
  status: 'idle',
  error: null,
  page: 0,
  total: 1,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    resetUsers(state) {
      state.data = [];
      state.status = 'idle';
      state.error = null;
      state.page = 1;
      state.total = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<UserResponse>) => {
        state.status = 'succeeded';
        state.data = [...state.data, ...action.payload.data];
        state.page += 1;
        state.total = action.payload.total;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { resetUsers } = usersSlice.actions;
export default usersSlice.reducer;

export const selectUsers = (state: RootState) => state.users.data;
export const selectUsersStatus = (state: RootState) => state.users.status;
export const selectUsersError = (state: RootState) => state.users.error;
export const selectUsersPage = (state: RootState) => state.users.page;

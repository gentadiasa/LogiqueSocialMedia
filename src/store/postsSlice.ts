import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './index';
import { Post, PostResponse } from '../types';

const API_KEY = '664818d84d6ab8b020baa1fe';
const API_URL = 'https://dummyapi.io/data/v1/';

export const fetchPosts = createAsyncThunk<
  PostResponse,
  number,
  { rejectValue: string }
>(
  'posts/fetchPosts',
  async (page, { rejectWithValue }) => {
    console.log('fetch posts')
    try {
      const response = await axios.get(`${API_URL}/post`, {
        headers: { 'app-id': API_KEY },
        params: { page, limit: 20 },
      });
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


export interface PostsState {
  data: Post[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  page: number;
  total: number;
}

const initialState: PostsState = {
  data: [],
  status: 'idle',
  error: null,
  page: 0,
  total: 1,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    resetPosts(state) {
      state.data = [];
      state.page = 0;
      state.status = 'idle';
    },
    likePost(state, action: PayloadAction<string>) {
      const post = state.data.find((post) => post.id === action.payload);
      if (post) {
        post.likes += 1;
      }
    },
    unlikePost(state, action: PayloadAction<string>) {
      const post = state.data.find((post) => post.id === action.payload);
      if (post && post.likes > 0) {
        post.likes -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<PostResponse>) => {
        state.status = 'succeeded';
        state.data = [...state.data, ...action.payload.data];
        state.page += 1;
        state.total = action.payload.total
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { resetPosts, likePost, unlikePost } = postsSlice.actions;

export default postsSlice.reducer;

export const selectPosts = (state: RootState) => state.posts.data;
export const selectPostsStatus = (state: RootState) => state.posts.status;
export const selectPostsError = (state: RootState) => state.posts.error;
export const selectPostsPage = (state: RootState) => state.posts.page;
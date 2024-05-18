import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addLikeToDB, getLikesFromDB, removeLikeFromDB } from '../utils/db';
import { Post } from '../types';

interface LikesState {
  data: Post[];
}

const initialState: LikesState = {
  data: [],
};

export const getLikes = createAsyncThunk('likes/getLikes', async () => {
  let data = await getLikesFromDB()
  return data;
});

const likesSlice = createSlice({
  name: 'likes',
  initialState,
  reducers: {
    addLike: (state, action: PayloadAction<Post>) => {
      state.data.push(action.payload);
      addLikeToDB(action.payload);
      getLikes()
    },
    removeLike: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter(like => like.id !== action.payload);
      removeLikeFromDB(action.payload)
      getLikes()
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLikes.fulfilled, (state, action) => {
        state.data = action.payload.reverse()
      })
  },
});

export const { addLike, removeLike } = likesSlice.actions;

export default likesSlice.reducer;

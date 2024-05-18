import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addFriendToDB, getFriendsFromDB, removeFriendFromDB } from '../utils/db';

interface Friend {
  id: string;
  firstName: string;
  lastName: string;
}

interface FriendsState {
  data: Friend[];
}

const initialState: FriendsState = {
  data: [],
};

export const fetchFriends = createAsyncThunk('friends/fetchFriends', async () => {
    let data = await getFriendsFromDB()
    return data;
});

const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    addFriend: (state, action: PayloadAction<Friend>) => {
      state.data.push(action.payload);
      addFriendToDB(action.payload.id, action.payload.firstName, action.payload.lastName);
    },
    removeFriend: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter(friend => friend.id !== action.payload);
      removeFriendFromDB(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.data = action.payload
      })
  },
});

export const { addFriend, removeFriend } = friendsSlice.actions;
export default friendsSlice.reducer;

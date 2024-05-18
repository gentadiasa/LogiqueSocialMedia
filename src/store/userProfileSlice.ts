import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { User, Post, UserProfile, Friend, FetchUserPostsParams, PostResponse } from '../types';
import { RootState } from '.';
import { addFriendToDB, getFriendsFromDB, getLikesFromDB, removeFriendFromDB } from '../utils/db';

const API_KEY = '664818d84d6ab8b020baa1fe';
const API_URL = 'https://dummyapi.io/data/v1';

export const fetchUserProfile = createAsyncThunk(
    'userProfile/fetchUserProfile',
    async (userId: string, { rejectWithValue }) => {
        try {
            console.log('FETCH USER PROFILE')
            const response = await axios.get(`${API_URL}/user/${userId}`, {
                headers: { 'app-id': API_KEY },
            });
            console.log('FETCH USER PROFILE RESPONSE = ', response.data)
            let data: UserProfile = {
                ...response.data,
                isFriend: false
            };
            let friends = await getFriendsFromDB()
            let include = friends.some(item => item.id === data.id)
            if (include) {
                data.isFriend = true
            }
            return data;
        } catch (error: any) {
            console.log('ERR FETCH USER PROFILE', error)
            return rejectWithValue(error.message);
        }
    }
);

export const fetchUserPosts = createAsyncThunk(
    'userProfile/fetchUserPosts',
    async ({ userId, page }: FetchUserPostsParams, { rejectWithValue }) => {
        try {
            console.log('FETCH USER POSTS')
            const response = await axios.get(`${API_URL}/user/${userId}/post`, {
                headers: { 'app-id': API_KEY },
                params: { limit: 5, page },
            });
            console.log('FETCH USER POSTS RESPONSE = ', response.data)
            let likes = await getLikesFromDB()
            let newdata = response.data.data.map((element: Post) => {
                let include = likes.some(item => item.id === element.id)
                if (include) {
                    element.likes += 1
                }
                return element
            });
            return { ...response.data, data: newdata };
        } catch (error: any) {
            console.log('ERR FETCH USER POSTS', error)
            return rejectWithValue(error.message);
        }
    }
);

export interface UserProfileState {
    user: UserProfile | null;
    posts: Post[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    postsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    page: number;
    total: number;
}

const initialState: UserProfileState = {
    user: null,
    posts: [],
    status: 'idle',
    postsStatus: 'idle',
    error: null,
    page: 0,
    total: 1,
};

const userProfileSlice = createSlice({
    name: 'userProfile',
    initialState,
    reducers: {
        resetUserProfileState(state) {
            state.user = null;
            state.posts = [];
            state.status = 'idle';
            state.postsStatus = 'idle';
            state.error = null;
            state.page = 0;
            state.total = 1;
        },
        resetUserPostsState(state) {
            state.posts = [];
            state.postsStatus = 'idle';
            state.error = null;
            state.page = 0;
            state.total = 1;
        },
        addFriend(state, action: PayloadAction<User>) {
            if (state.user && state.user.id === action.payload.id) {
                state.user.isFriend = true;
                addFriendToDB(action.payload.id, action.payload.firstName, action.payload.lastName)
            }
        },
        removeFriend(state, action: PayloadAction<string>) {
            if (state.user && state.user.id === action.payload) {
                state.user.isFriend = false;
                removeFriendFromDB(action.payload)
            }
        },
        likePost(state, action: PayloadAction<string>) {
            const post = state.posts.find((post) => post.id === action.payload);
            if (post) {
                post.likes += 1;
            }
        },
        unlikePost(state, action: PayloadAction<string>) {
            const post = state.posts.find((post) => post.id === action.payload);
            if (post && post.likes > 0) {
                post.likes -= 1;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
                state.status = 'succeeded';
                state.user = { ...action.payload };
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(fetchUserPosts.pending, (state) => {
                state.postsStatus = 'loading';
            })
            .addCase(fetchUserPosts.fulfilled, (state, action: PayloadAction<PostResponse>) => {
                state.postsStatus = 'succeeded';
                console.log('aaa', action.payload)
                state.posts = [...state.posts, ...action.payload.data];
                state.page += 1
                state.total = action.payload.total
            })
            .addCase(fetchUserPosts.rejected, (state, action) => {
                state.postsStatus = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { resetUserProfileState, addFriend, removeFriend, likePost, unlikePost, resetUserPostsState } = userProfileSlice.actions;

export const selectUserProfile = (state: RootState) => state.userProfile.user;
export const selectUserPosts = (state: RootState) => state.userProfile.posts;

export default userProfileSlice.reducer;

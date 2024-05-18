import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import usersReducer from './usersSlice';
import friendsReducer from './friendsSlice';
import postsReducer from './postsSlice';
import likesReducer from './likesSlice';
import userProfileReducer from './userProfileSlice';

const rootReducer = combineReducers({
    users: usersReducer,
    friends: friendsReducer,
    posts: postsReducer,
    likes: likesReducer,
    userProfile: userProfileReducer
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;

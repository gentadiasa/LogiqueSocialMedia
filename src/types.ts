import { PostsState } from "./store/postsSlice";

export interface Location {
    city: string;
    country: string;
}

export interface User {
    id: string;
    title: string;
    firstName: string;
    lastName: string;
    picture: string;
    email: string;
    location: Location;
}

export interface UserResponse {
    data: User[];
    total: number;
}

export interface Post {
    id: string;
    text: string;
    image: string;
    likes: number;
    tags: string[];
    owner: User;
}

export interface PostResponse {
    data: Post[];
    total: number;
}

export interface Like {
    id: string;
    text: string;
}

export interface Friend {
    id: string;
    firstName: string;
    lastName: string;
}

export interface RootState {
    friends: {
        data: Friend[];
    };
    likes: {
        data: Post[];
    };
    posts: PostsState;
}

export interface UserProfile extends User {
    isFriend: boolean;
}

export interface FetchUserPostsParams {
    userId: string;
    page: number;
}
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, RefreshControl, StyleSheet, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, selectPosts, selectPostsStatus, selectPostsError, resetPosts, likePost, unlikePost } from '../store/postsSlice';
import { RootState, AppDispatch } from '../store';
import { addLike, removeLike } from '../store/likesSlice';
import { Post } from '../types';
import PostContainer from '../components/PostContainer';
import Shimmer from 'react-native-shimmer-kit';
import { rHeight, rWidth } from '../utils/variables';

const PostsScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const posts = useSelector(selectPosts);
    const status = useSelector(selectPostsStatus);
    const error = useSelector(selectPostsError);
    const page = useSelector((state: RootState) => state.posts.page);
    const total = useSelector((state: RootState) => state.posts.total);
    const likes = useSelector((state: RootState) => state.likes.data);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchPosts(page));
        }
    }, [dispatch, page, status]);

    const handleRefresh = () => {
        setRefreshing(true);
        dispatch(resetPosts());
        dispatch(fetchPosts(1)).unwrap().then(() => setRefreshing(false));
    };

    const handleLoadMore = () => {
        console.log('stat', status, page)
        if (page >= 1 && posts.length < total && status !== 'loading') {
            dispatch(fetchPosts(page));
        }
    };

    const handleLikePost = (post: Post) => {
        dispatch(likePost(post.id));
        dispatch(addLike(post));
    };

    const handleUnlikePost = (post: Post) => {
        dispatch(unlikePost(post.id));
        dispatch(removeLike(post.id));
    };

    if (status === 'loading' && page === 0) {
        return <View style={styles.list}>
            <Shimmer width={rWidth(90)} height={rHeight(30)} />
            <View style={{ height: rHeight(3) }} />
            <Shimmer width={rWidth(90)} height={rHeight(30)} />
            <View style={{ height: rHeight(3) }} />
            <Shimmer width={rWidth(90)} height={rHeight(30)} />
        </View>
    }

    if (status === 'failed') {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={posts}
            renderItem={({ item }) => {
                let include = likes.some(i => i.id === item.id)
                return <PostContainer
                    item={item} include={include}
                    onPress={() => include ? handleUnlikePost(item) : handleLikePost(item)}
                />
            }}
            keyExtractor={(item) => item.id}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={status === 'loading' && page >= 1 ? <Shimmer width={rWidth(80)} height={rHeight(30)} /> : null}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
            contentContainerStyle={styles.list}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
    list: {
        padding: 16,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    likeButton: {
        flexDirection: 'row',
        paddingVertical: 8,
        borderRadius: 4,
    },
    shimmer: {
        width: '100%',
        height: 100,
        marginBottom: 16,
    },
});

export default PostsScreen;
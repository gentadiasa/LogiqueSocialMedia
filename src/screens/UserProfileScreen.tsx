import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, TextInput, RefreshControl, BackHandler } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { fetchUserProfile, fetchUserPosts, selectUserProfile, selectUserPosts, addFriend, removeFriend, likePost, unlikePost, resetUserProfileState, resetUserPostsState } from '../store/userProfileSlice';
import { RootState, AppDispatch } from '../store';
import { addLike, removeLike } from '../store/likesSlice';
import { Post } from '../types';
import Icon from 'react-native-vector-icons/Ionicons';
import { StackNavigation } from '../navigation/AppNavigator';
import Shimmer from 'react-native-shimmer-kit';
import { rHeight, rWidth } from '../utils/variables';

type UserProfileRouteParams = {
    UserProfile: {
        userId: string;
    };
};

type UserProfileRouteProp = RouteProp<UserProfileRouteParams, 'UserProfile'>;

const UserProfileScreen: React.FC = () => {
    const route = useRoute<UserProfileRouteProp>();
    const { userId } = route.params;
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<StackNavigation>();

    const userProfile = useSelector(selectUserProfile);
    const userPosts = useSelector(selectUserPosts);
    const likes = useSelector((state: RootState) => state.likes.data);
    const profileStatus = useSelector((state: RootState) => state.userProfile.status);
    const postsStatus = useSelector((state: RootState) => state.userProfile.postsStatus);

    const page = useSelector((state: RootState) => state.userProfile.page);
    const total = useSelector((state: RootState) => state.userProfile.total);
    const error = useSelector((state: RootState) => state.userProfile.error);

    const [searchText, setSearchText] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (profileStatus === 'idle' && page == 0) {
            dispatch(fetchUserProfile(userId));
        }
        if (postsStatus === 'idle') {
            dispatch(fetchUserPosts({ userId, page }));
        }
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                dispatch(resetUserProfileState());
                navigation.goBack();
                return true;
            };

            const subscription = BackHandler.addEventListener(
                'hardwareBackPress',
                onBackPress
            );

            return () => subscription.remove();
        }, [])
    );

    const handleRefresh = () => {
        setRefreshing(true);
        dispatch(resetUserPostsState());
        dispatch(fetchUserPosts({ userId, page: 0 })).finally(() => setRefreshing(false));
    };

    const handleAddFriend = () => {
        if (userProfile) {
            dispatch(addFriend(userProfile));
        }
    };

    const handleRemoveFriend = () => {
        dispatch(removeFriend(userId));
    };

    const handleLikePost = (post: Post) => {
        dispatch(likePost(post.id));
        dispatch(addLike(post));
    };

    const handleUnlikePost = (postId: string) => {
        dispatch(unlikePost(postId));
        dispatch(removeLike(postId));
    };

    const filteredPosts = userPosts.filter((post) =>
        post.text.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleLoadMore = () => {
        if (page >= 1 && userPosts.length < total && postsStatus !== 'loading') {
            dispatch(fetchUserPosts({ userId, page }));
        }
    };

    console.log(page, userPosts.length, total,)

    if (profileStatus === 'failed') {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {
                profileStatus === 'loading' ?
                    <View style={{ ...styles.container, alignItems: 'center' }}>
                        <Shimmer width={100} height={30} customStyle={styles.profileImage} />
                        <Shimmer width={100} height={30} />
                        <View style={{ height: rHeight(10) }} />
                        <Shimmer width={rWidth(80)} height={rHeight(30)} />
                        <View style={{ height: rHeight(2) }} />
                        <Shimmer width={rWidth(80)} height={rHeight(30)} />
                    </View>
                    : userProfile === null ? <View />
                        : <View style={styles.profileContainer}>
                            <TouchableOpacity onPress={() => {
                                dispatch(resetUserProfileState());
                                navigation.goBack()
                            }}
                                style={{ position: 'absolute', top: 10, left: 10 }}
                            >
                                <Icon name={'arrow-back'} color='black' size={20} />
                            </TouchableOpacity>
                            <Image source={{ uri: userProfile.picture }} style={styles.profileImage} />
                            <Text style={styles.profileName}>{`${userProfile.title} ${userProfile.firstName} ${userProfile.lastName}`}</Text>
                            <Text style={styles.profileEmail}>{userProfile.email}</Text>
                            <Text style={styles.profileLocation}>{`${userProfile.location.city}, ${userProfile.location.country}`}</Text>
                            {userProfile.isFriend ? (
                                <TouchableOpacity style={styles.unfriendButton} onPress={handleRemoveFriend}>
                                    <Text style={styles.unfriendButtonText}>Unfriend</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity style={styles.friendButton} onPress={handleAddFriend}>
                                    <Text style={styles.friendButtonText}>Add Friend</Text>
                                </TouchableOpacity>
                            )}
                        </View>
            }
            {
                userProfile === null ? <View />
                    : <>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search posts..."
                            value={searchText}
                            onChangeText={setSearchText}
                            placeholderTextColor={'gray'}
                        />
                        <FlatList
                            data={filteredPosts}
                            keyExtractor={(item) => item.id}
                            onEndReached={handleLoadMore}
                            renderItem={({ item }) => {
                                let include = likes.some(i => i.id === item.id)
                                return <View style={styles.postContainer}>
                                    <Text style={styles.postText}>{item.text}</Text>
                                    {item.image && <Image source={{ uri: item.image }} style={styles.postImage} />}
                                    <View style={styles.postActions}>

                                        <Text style={styles.likeButton}>{item.likes} Likes</Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                if (include) {
                                                    handleUnlikePost(item.id)
                                                } else {
                                                    handleLikePost(item)
                                                }
                                            }}
                                        >
                                            <Icon name={include ? 'heart' : 'heart-outline'} color='red' size={20} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            }}
                            ListFooterComponent={postsStatus === 'loading' && page >= 1 ? <Shimmer width={rWidth(80)} height={rHeight(30)} /> : null}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
                        />
                    </>

            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 8,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
        color: 'black'
    },
    profileEmail: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 4,
    },
    profileLocation: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 8,
    },
    friendButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: 'blue',
        borderRadius: 4,
    },
    friendButtonText: {
        color: 'white',
        fontSize: 16,
    },
    unfriendButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: 'red',
        borderRadius: 4,
    },
    unfriendButtonText: {
        color: 'white',
        fontSize: 16,
    },
    searchInput: {
        padding: 8,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 16,
        color: 'black'
    },
    postContainer: {
        marginBottom: 16,
        padding: 16,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 4,
    },
    postText: {
        fontSize: 16,
        marginBottom: 8,
        color: 'black'
    },
    postImage: {
        width: '100%',
        height: 200,
        marginBottom: 8,
    },
    postActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    likeButton: {
        color: 'blue',
    },
    unlikeButton: {
        color: 'red',
    },
    shimmer: {
        width: '100%',
        height: 100,
        marginBottom: 16,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default UserProfileScreen;

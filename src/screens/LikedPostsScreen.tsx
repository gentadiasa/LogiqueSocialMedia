import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, Post } from '../types';
import { getLikes, removeLike } from '../store/likesSlice';
import { AppDispatch } from '../store';
import PostContainer from '../components/PostContainer';
import { useIsFocused } from '@react-navigation/native';

const LikedPostsScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const likes = useSelector((state: RootState) => state.likes.data);
  const focus = useIsFocused();

  const handleUnlikePost = (postId: string) => {
    dispatch(removeLike(postId));
  };

  useEffect(() => {
    dispatch(getLikes());
  }, [dispatch, focus])

  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <Text style={{ textAlign: 'center', fontSize: 25, marginTop: 15, fontWeight: 'bold', color: 'black' }}>Post You've Liked</Text>
      {likes.length == 0 && <Text style={{ textAlign: 'center', fontSize: 15, marginTop: 15, fontWeight: 'bold', color: 'gray' }}>You haven't liked any post yet</Text>}
      <FlatList
        data={likes}
        renderItem={({ item }) => (
          <PostContainer
            item={item} include={true}
            onPress={() => handleUnlikePost(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
};

export default LikedPostsScreen;

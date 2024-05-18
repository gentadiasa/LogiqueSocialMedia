import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, RefreshControl, StyleSheet, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, selectUsers, selectUsersStatus, selectUsersError, resetUsers } from '../store/usersSlice';
import { RootState, AppDispatch } from '../store';
import { useNavigation } from '@react-navigation/native';
import { User } from '../types';
import { StackNavigation } from '../navigation/AppNavigator';
import { getLikes } from '../store/likesSlice';
import { fetchFriends } from '../store/friendsSlice';
import { rHeight, rWidth } from '../utils/variables';
import ShimmerPost from '../components/Shimmer';
import Loader from '../components/Loader';

const UsersScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector(selectUsers);
  const status = useSelector(selectUsersStatus);
  const error = useSelector(selectUsersError);
  const page = useSelector((state: RootState) => state.users.page);
  const total = useSelector((state: RootState) => state.users.total);
  const navigation = useNavigation<StackNavigation>();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers(page));
      dispatch(getLikes());
      dispatch(fetchFriends());
    }
  }, [dispatch, page, status]);

  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(resetUsers());
    dispatch(fetchUsers(0)).finally(() => setRefreshing(false));
  };

  const handleLoadMore = () => {
    if (page >= 1 && users.length < total && status !== 'loading') {
      dispatch(fetchUsers(page));
    }
  };

  const handleUserPress = (user: User) => {
    navigation.navigate('UserProfile', { userId: user.id });
  };

  if (status === 'loading' && page == 0) {
    return (
      <View style={{ ...styles.container, justifyContent: 'flex-start' }}>
        <Loader />
      </View>
    );
  }

  if (status === 'failed') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={{ textAlign: 'center', fontSize: 25, marginVertical: rHeight(2), fontWeight: 'bold', color: 'black' }}>Users</Text>
      <FlatList
        data={users}
        renderItem={({ item }) => {
          const title = item.title.charAt(0).toUpperCase() + item.title.slice(1)
          return <TouchableOpacity style={styles.userContainer} onPress={() => handleUserPress(item)}>
            <Image source={{ uri: item.picture }} style={styles.userImage} />
            <Text style={styles.userName}>{`${title}. ${item.firstName} ${item.lastName}`}</Text>
          </TouchableOpacity>
        }}
        keyExtractor={(item) => item.id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={status === 'loading' && page >= 1 && !refreshing ? <ShimmerPost /> : null}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        contentContainerStyle={styles.list}
      />
    </View>
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
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  userName: {
    fontSize: 16,
    color: 'black'
  },
  shimmer: {
    width: '100%',
    height: 80,
    marginBottom: 16,
  },
});

export default UsersScreen;

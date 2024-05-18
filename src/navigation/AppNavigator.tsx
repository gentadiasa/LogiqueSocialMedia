import React from 'react';
import { NavigationContainer, NavigationProp } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import UsersScreen from '../screens/UsersScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import PostsScreen from '../screens/PostsScreen';
import LikedPostsScreen from '../screens/LikedPostsScreen';

export type RootStackParamList = {
    Users: undefined;
    UserProfile: { userId: string };
    Posts: undefined;
    LikedPosts: undefined;
};

export type StackNavigation = NavigationProp<RootStackParamList>;

const BottomTab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

const UsersStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Users" component={UsersScreen} />
        <Stack.Screen name="UserProfile" component={UserProfileScreen} />
    </Stack.Navigator>
);

const AppNavigator = () => (
    <NavigationContainer>
        <BottomTab.Navigator screenOptions={{ headerShown: false }}>
            <BottomTab.Screen
                name="UsersTab"
                component={UsersStack}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="people-outline" color={color} size={size} />
                    ),
                }}
            />
            <BottomTab.Screen
                name="Posts"
                component={PostsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="newspaper-outline" color={color} size={size} />
                    ),
                }}
            />
            <BottomTab.Screen
                name="LikedPosts"
                component={LikedPostsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="heart-outline" color={color} size={size} />
                    ),
                }}
            />
        </BottomTab.Navigator>
    </NavigationContainer>
);

export default AppNavigator;
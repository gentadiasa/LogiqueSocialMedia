import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Post } from '../types';
import Icon from 'react-native-vector-icons/Ionicons';

interface PostContainerProps {
    item: Post;
    include: boolean;
    onPress: any;
}

const PostContainer: React.FC<PostContainerProps> = ({ item, include, onPress }) => {
    return (
        <View style={styles.postContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={{ uri: item.owner.picture }} style={styles.profileImage} />
                <Text style={styles.profileText}>{item.owner.firstName} {item.owner.lastName}</Text>
            </View>
            {item.image && <Image source={{ uri: item.image }} style={{ width: '100%', height: 200, marginBottom: 8, }} />}
            <Text style={styles.postText}>{item.text}</Text>
            <TouchableOpacity onPress={() => onPress()} style={styles.likeButton}>
                <Icon name={include ? 'heart' : 'heart-outline'} color='red' size={20} />
                <Text style={styles.likeButtonText}>{item.likes} likes</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    postContainer: {
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
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 50,
        marginBottom: 8,
        marginRight: 10,
    },
    profileText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black'
    },
    postText: {
        fontSize: 16,
        marginBottom: 8,
        color: 'black'
    },
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    likeButtonText: {
        marginLeft: 5,
        color: 'black'
    },
});

export default PostContainer;

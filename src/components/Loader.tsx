import React from 'react';
import {
    ActivityIndicator
} from 'react-native';
import { rHeight } from '../utils/variables';

const Loader: React.FC = () =>
(
    <ActivityIndicator
        size={rHeight(10)}
        color={'lightblue'}
        style={{ backgroundColor: 'white', borderRadius: 50, shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, }}
    />
);

export default Loader
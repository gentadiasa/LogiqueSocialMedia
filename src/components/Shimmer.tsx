import React from 'react';
import {
    View
} from 'react-native';
import { rHeight, rWidth } from '../utils/variables';
import Shimmer from 'react-native-shimmer-kit';

const ShimmerPost: React.FC = () => (
    <View style={{ flexDirection: 'row', marginBottom: rHeight(2) }}>
        <Shimmer width={50} height={50} borderRadius={25} customStyle={{ marginRight: 16 }} />
        <Shimmer width={rWidth(70)} height={50} borderRadius={8} />
    </View>
)

export default ShimmerPost
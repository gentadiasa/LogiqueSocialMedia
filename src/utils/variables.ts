import {
  Dimensions,
} from 'react-native';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const deviceHeightScreen = Dimensions.get('screen').height;
const deviceWidthScreen = Dimensions.get('screen').width;

const rHeight = (h: number) => {
  return deviceHeight * (h / 100);
};
const rWidth = (w: number) => {
  return deviceWidth * (w / 100);
};


export {
  deviceHeight,
  deviceWidth,
  deviceHeightScreen,
  deviceWidthScreen,
  rHeight,
  rWidth,
};

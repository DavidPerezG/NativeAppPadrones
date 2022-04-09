// Dependencies
import { Platform, Dimensions } from 'react-native';

const { OS } = Platform;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');

export {
  OS,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
};

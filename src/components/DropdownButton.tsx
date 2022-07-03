import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import fonts from '../utils/fonts';

interface IDropDownButton {
  leftText?: string;
  rightText?: string;
  children?: JSX.Element;
}

const DropdownButton = ({leftText, rightText, children}: IDropDownButton) => {
  const [isCollapsable, setIsCollapsable] = useState(true);

  useEffect(() => {}, []);

  const handleClick = () => {
    if (isCollapsable === true) {
      setIsCollapsable(false);
    } else {
      setIsCollapsable(true);
    }
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={() => handleClick()}>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text numberOfLines={1} style={styles.text}>
              {leftText?.length < 40
                ? `${leftText}`
                : `${leftText?.substring(0, 37)}...`}
            </Text>
            <Text style={styles.text}>{rightText}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <Collapsible collapsed={isCollapsable}>
        <View style={styles.childrenCard}>{children}</View>
      </Collapsible>
    </>
  );
};

export default DropdownButton;

const styles = StyleSheet.create({
  card: {
    width: Dimensions.get('window').width * 0.85,
    height: 53,
    paddingHorizontal: 15,
    borderRadius: 10,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    marginBottom: 6,
  },
  childrenCard: {
    width: Dimensions.get('window').width * 0.85,
    paddingHorizontal: 15,
    borderRadius: 10,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    marginVertical: 3,
  },
  text: {
    color: 'black',
    fontFamily: fonts.light,
  },
  row: {
    alignItems: 'center',
    height: 50,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  textLeft: {
    color: 'black',
    fontFamily: fonts.light,
    textAlign: 'right',
  },
});

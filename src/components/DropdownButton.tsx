import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import styled from 'styled-components/native';
import fonts from '../utils/fonts';

interface IDropDownButton {
  leftText?: string;
  rightText?: string;
  collapsable?: boolean;
  children?: JSX.Element;
}

const DropdownButton = ({
  leftText,
  rightText,
  collapsable,
  children,
}: IDropDownButton) => {
  const [isCollapsable, setIsCollapsable] = useState<boolean>(
    collapsable || true,
  );

  useEffect(() => {}, []);

  const handleClick = () => {
    if (collapsable === true) {
      if (isCollapsable === true) {
        setIsCollapsable(false);
      } else {
        setIsCollapsable(true);
      }
    } else {
      return;
    }
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={() => handleClick()}>
        <Card>
          <View style={styles.row}>
            <Text numberOfLines={1} style={styles.text}>
              {leftText?.length < 40
                ? `${leftText}`
                : `${leftText?.substring(0, 37)}...`}
            </Text>
            <Text style={styles.text}>{rightText}</Text>
          </View>
        </Card>
      </TouchableWithoutFeedback>
      <Collapsible collapsed={isCollapsable}>
        <View style={styles.childrenCard}>{children}</View>
      </Collapsible>
    </>
  );
};

export default DropdownButton;

const styles = StyleSheet.create({
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

const Card = styled.View`
  width: ${Dimensions.get('window').width * 0.9};
  height: 53px;
  padding-horizontal: 15px;
  border-radius: 10px;
  flex-direction: column;
  background-color: #ffffff;
  align-items: center;
  justify-content: space-between;
  elevation: 3;
  margin-bottom: 6px;
`;

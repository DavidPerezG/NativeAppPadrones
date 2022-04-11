// Internal dependencies
import React from 'react';
import {StyleSheet, Text, View, TouchableWithoutFeedback} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useDispatch} from 'react-redux';

// External dependencies
import {dispatchClearAuth} from '../store/actions/auth';

const MenuCard = props => {
  // Props
  const isBlank = Boolean(props?.isBlank);

  // Navigation
  const navigation = useNavigation();

  // Redux
  const dispatch = useDispatch();

  const handleClick = () => {
    if (props.navPage === 'login') {
      dispatchClearAuth(dispatch);

      navigation.reset({
        index: 0,
        // @ts-ignore
        routes: [{name: props.navPage}],
      });
    } else {
      // @ts-ignore
      props.navPage ? navigation.navigate(props.navPage) : false;
    }
  };

  if (isBlank) {
    return <View style={{...styles.squareStyleBlank, ...props.style}} />;
  }

  return (
    <TouchableWithoutFeedback onPress={handleClick}>
      <View style={{...styles.squareStyle, ...props.style}}>
        <FontAwesome5
          name={props.iconName}
          size={40}
          styles={styles.iconContainer}
          solid
          color={props.col}
        />
        <Text style={[styles.text, {color: props.col}]}>
          {props.nombreItem}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  squareStyle: {
    borderRadius: 5,
    width: 120,
    height: 120,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 7,
    shadowOpacity: 0.09,
    elevation: 5,
    marginHorizontal: 0,
  },
  squareStyleBlank: {
    borderRadius: 5,
    width: 115,
    height: 120,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    marginHorizontal: 0,
  },
  iconContainer: {
    margin: 5,
  },
  text: {
    textAlign: 'center',
    marginTop: 5,
    fontWeight: 'bold',
    color: '#3F3F3F',
  },
});

export default MenuCard;

import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableWithoutFeedback} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const MenuCard = props => {
  const [isBlank, blank] = useState(props.isBlank);
  const [isIconType, setIsIconType] = useState(props.enableEntypo);

  const navigation = useNavigation();

  const handleClick = () => {
    if (props.navPage === 'login') {
      global.token = '';
      navigation.reset({
        index: 0,
        routes: [{name: props.navPage}],
      });
    } else {
      props.navPage ? navigation.push(props.navPage) : false;
    }
  };

  if (isBlank) {
    return (
      <View
        handleEvent={blank}
        style={{...styles.squareStyleBlank, ...props.style}}
      />
    );
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
        <Text style={styles.text}>{props.nombreItem}</Text>
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

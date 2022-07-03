// External dependencies
import React, {useState, useEffect} from 'react';
import {ActivityIndicator, TouchableWithoutFeedback, View} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import styled from 'styled-components/native';

// Internal dependencies
import DropdownButton from '../DropdownButton';

interface ISwipeListContainer {
  data: Array<object> | undefined;
  parameterToList: string;
  onDelete: (rowKey) => void;
  onEndReached: () => void;
}

const SwipeListContainer = ({
  data,
  parameterToList,
  onDelete,
  onEndReached,
}: ISwipeListContainer) => {
  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const handleDelete = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey);
    onDelete(rowKey);
  };

  const renderFooterComponent = () => (
    <TouchableWithoutFeedback onPress={onEndReached}>
      {data ? (
        <MoreDataButton>
          <FontAwesome5 name={'plus'} size={30} solid color={'black'} />
        </MoreDataButton>
      ) : (
        <View />
      )}
    </TouchableWithoutFeedback>
  );

  return (
    <SwipeListView
      data={data}
      keyExtractor={item => item.id}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.1}
      ListFooterComponent={renderFooterComponent()}
      contentContainerStyle={{
        alignItems: 'center',
      }}
      renderHiddenItem={(data, rowMap) => (
        <RowBack>
          <BackRightBtn onPress={() => closeRow(rowMap, data.item.id)}>
            <BackRightBtnLeft>
              <FontAwesome5
                name={'backspace'}
                size={20}
                solid
                color={'white'}
              />
            </BackRightBtnLeft>
          </BackRightBtn>
          <BackRightBtn onPress={() => handleDelete(rowMap, data.item.id)}>
            <BackRightBtnRight>
              <FontAwesome5 name={'trash'} size={20} solid color={'white'} />
            </BackRightBtnRight>
          </BackRightBtn>
        </RowBack>
      )}
      leftOpenValue={75}
      rightOpenValue={-75}
      renderItem={({item, index}) => {
        return <DropdownButton leftText={item[parameterToList]} />;
      }}
    />
  );
};

const RowBack = styled.View`
  align-items: center;
  background-color: #eff4f8;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  margin: 5px;
  margin-bottom: 15px;
  border-radius: 5px;
`;

const BackRightBtn = styled.TouchableWithoutFeedback`
  align-items: flex-end;
  bottom: 0px;
  justify-content: center;
  position: absolute;
  top: 0px;
  width: 75px;
  padding-right: 17px;
`;

const BackRightBtnLeft = styled.View`
  background-color: #1aa68a;
  height: 100%;
  width: 75px;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
`;

const BackRightBtnRight = styled.View`
  background-color: #cd4c4c;
  height: 100%;
  width: 75px;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
`;

const MoreDataButton = styled.View`
  background-color: #ffffff;
  flex-direction: row;
  height: 53px;
  width: 100%;
  border-radius: 10px;
  padding: 10px;
  align-items: center;
  elevation: 2;
  margin-vertical: 5px;
`;

export default SwipeListContainer;

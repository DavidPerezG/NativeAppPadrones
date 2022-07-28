// External dependencies
import React from 'react';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import Header from '../components/Header';
import {useNavigation} from '@react-navigation/native';
// Internal dependencies
import {SCREEN_WIDTH} from '../utils/constants';
import fonts from '../utils/fonts';
import {ScrollView} from 'react-native';

const ProfileScreen = () => {
  // Redux
  // @ts-ignore
  const navigation = useNavigation();
  const user = useSelector(state => state.user);

  return (
    <Container>
      <Header
        title="Perfil"
        isGoBack
        onPressLeftButton={() =>
          navigation.reset({
            index: 0,
            routes: [
              {
                // @ts-ignore
                name: 'menu',
              },
            ],
          })
        }
      />
      <ScrollView>
        <AvatarContainer>
          <AvatarInnerContainer>
            <Avatar source={{uri: user?.foto}} />
          </AvatarInnerContainer>
        </AvatarContainer>

        <FormContainer>
          <FormItem>
            <Label>Nombre(s)</Label>

            <Value>{user?.first_name || 'Sin información'}</Value>
          </FormItem>

          <FormItem>
            <Label>Apellido Paterno</Label>

            <Value>{user?.last_name || 'Sin información'}</Value>
          </FormItem>

          <FormItem>
            <Label>Apellido Materno</Label>

            <Value>{user?.second_last_name || 'Sin información'}</Value>
          </FormItem>

          <FormItem>
            <Label>Correo electrónico</Label>

            <Value>{user?.email || 'Sin información'}</Value>
          </FormItem>

          <FormItem>
            <Label>Correo alternativo</Label>

            <Value>{user?.email_alternativo || 'Sin información'}</Value>
          </FormItem>

          <FormItem>
            <Label>Lada</Label>

            <Value>{user?.lada?.lada || 'Sin información'}</Value>
          </FormItem>

          <FormItem>
            <Label>Número de teléfono</Label>

            <Value>{user?.numero_de_celular || 'Sin información'}</Value>
          </FormItem>
        </FormContainer>
      </ScrollView>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: #eff4f8;
`;

const AvatarContainer = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
  padding-vertical: 20px;
`;

const AvatarInnerContainer = styled.View`
  border-radius: ${SCREEN_WIDTH / 2}px;
  aspect-ratio: 1;
  width: 50%;
  background-color: #fff;
  border: 1px solid #e5e5e5;
  overflow: hidden;
`;

const Avatar = styled.Image`
  flex: 1;
`;

const FormContainer = styled.View`
  padding-horizontal: 20px;
`;

const FormItem = styled.View`
  min-height: 50px;
`;

const Label = styled.Text`
  font-family: ${fonts.bold};
  font-size: 16px;
  color: #141414;
  font-weight: bold;
`;

const Value = styled.Text`
  font-family: ${fonts.regular};
  font-size: 16px;
  color: #808080;
`;

export default ProfileScreen;

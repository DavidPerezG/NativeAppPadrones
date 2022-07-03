// External dependencies
import React, {useState, useEffect} from 'react';
import {ActivityIndicator, TouchableWithoutFeedback} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import styled from 'styled-components/native';

// Internal dependencies
import BusquedaAvanzadaVehiculo from '../../components/BusquedaAvanzadaComponents/BusquedaAvanzadaVehiculo';
import fonts from '../../utils/fonts';
import BusquedaAvanzadaCiudadano from '../BusquedaAvanzadaComponents/BusquedaAvanzadaCiudadano';
import BusquedaAvanzadaEmpresa from '../BusquedaAvanzadaComponents/BusquedaAvanzadaEmpresa';
import BusquedaAvanzadaPredio from '../BusquedaAvanzadaComponents/BusquedaAvanzadaPredio';

enum AdvanceSearchTypes {
  Ciudadano = 'Ciudadano',
  Empresa = 'Empresa',
  Predio = 'Predio',
  Vehiculo = 'Vehiculo',
}

interface ISearchInput {
  placeholderText?: string;
  onSearch: (searchText: string) => void;
  advanceSearch: AdvanceSearchTypes;
  loading: boolean;
}

const SearchInput = ({placeholderText, onSearch, advanceSearch, loading}) => {
  const [searchText, setSearchText] = useState<string>();

  const handleSearch = (formData?) => {
    onSearch(searchText, formData);
  };

  return (
    <SearchContainer>
      <Input
        placeholder={placeholderText || 'Buscar...'}
        placeholderTextColor={'#C4C4C4'}
        onChangeText={text => setSearchText(text)}
      />
      <TouchableWithoutFeedback
        disabled={loading}
        onPress={() => handleSearch()}>
        <SearchButton>
          {!loading ? (
            <FontAwesome5 name={'search'} size={30} solid color={'white'} />
          ) : (
            <ActivityIndicator size="large" color="#ffffff" />
          )}
        </SearchButton>
      </TouchableWithoutFeedback>
      {advanceSearch === 'Ciudadano' ? (
        <BusquedaAvanzadaCiudadano onSearch={handleSearch} />
      ) : null}
      {advanceSearch === 'Empresa' ? (
        <BusquedaAvanzadaEmpresa onSearch={handleSearch} />
      ) : null}
      {advanceSearch === 'Predio' ? (
        <BusquedaAvanzadaPredio onSearch={handleSearch} />
      ) : null}
      {advanceSearch === 'Vehiculo' ? (
        <BusquedaAvanzadaVehiculo onSearch={handleSearch} />
      ) : null}
    </SearchContainer>
  );
};

const SearchContainer = styled.View`
  flex-direction: row;
  background-color: white;
  width: 100%;
  align-items: center;
  border-radius: 10px;
`;

const SearchButton = styled.View`
  background-color: gray;
  height: 46px;
  padding: 5px;
  padding-horizontal: 8px;
`;

const Input = styled.TextInput`
  flex: 1;
  margin-horizontal: 5px;
  font-family: ${fonts.regular};
  color: #141414;
`;

export default SearchInput;

// External dependencies
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  Modal,
  TextInput,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

// Internal dependencies
import fonts from '../../utils/fonts';

// Services

import {
  getClasesVehiculos,
  getEstadosVehiculo,
  getLineasVehiculares,
  getMarcasVehiculo,
  getServiciosVehiculo,
  getTiposVehiculo,
} from '../../services/recaudacion/vehiculos';

// Types
import {TipoVehiculo} from '../../types/tipoVehiculoInterface';
import {ServicioVehiculo} from '../../types/serviciosVehiculoInterface';
import {EstadoVehiculo} from '../../types/estadoVehiculoInterface';
import {MarcaVehiculo} from '../../types/marcaVehiculoInterface';

const BusquedaAvanzadaVehiculo = ({onSearch}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({});
  const [opened, setOpened] = useState(false);
  const [openedDos, setOpenedDos] = useState(false);
  const [openedTres, setOpenedTres] = useState(false);
  const [openedCuatro, setOpenedCuatro] = useState(false);
  const [openedCinco, setOpenedCinco] = useState(false);
  const [selectedValue, setSelectedValue] = useState(['', '', '', '', '']);
  const [lineasVehiculares, setLineasVehiculares] = useState<Array<any>>([]);
  const [marcasVehiculares, setMarcasVehiculares] = useState<
    Array<MarcaVehiculo>
  >([]);
  const [serviciosVehiculares, setServiciosVehiculares] = useState<
    Array<ServicioVehiculo>
  >([]);
  const [estadosVehiculares, setEstadosVehiculares] = useState<
    Array<EstadoVehiculo>
  >([]);
  const [tiposVehiculos, setTiposVehiculos] = useState<Array<TipoVehiculo>>([]);
  const [clasesVehiculos, setClasesVehiculos] = useState<Array<any>>();

  useEffect(() => {
    getInfo();
  }, []);

  const getInfo = async () => {
    const lineas = await getLineasVehiculares();
    setLineasVehiculares(lineas);

    const marcas = await getMarcasVehiculo();
    setMarcasVehiculares(marcas);

    const servicios = await getServiciosVehiculo();
    setServiciosVehiculares(servicios);

    const estados = await getEstadosVehiculo();
    setEstadosVehiculares(estados);

    const tipos = await getTiposVehiculo();
    setTiposVehiculos(tipos);

    const clases = await getClasesVehiculos();
    setClasesVehiculos(clases);
  };

  const convertData = array => {
    let data = array?.map(el => {
      return {
        label: el.nombre,
        value: el.id,
      };
    });
    return data;
  };

  const handleChange = (name, text) => {
    console.log(text);
    setForm({
      ...form,
      [name]: text,
    });
  };

  const handleSearch = async () => {
    setIsOpen(false);
    onSearch(form);
    setForm({});
    setSelectedValue(['', '', '', '', '']);
  };

  const handleSelectedValue = (index, newLabel) => {
    const arraySelected = selectedValue;
    arraySelected[index] = newLabel;
    setSelectedValue(arraySelected);
  };

  return (
    <>
      <TouchableWithoutFeedback
        onPress={() => {
          isOpen === false ? setIsOpen(true) : null;
        }}>
        <View style={styles.iconAvanzadoContainer}>
          <Icon name="tasks" size={30} color="white" />
        </View>
      </TouchableWithoutFeedback>
      <Modal
        visible={isOpen}
        transparent
        onRequestClose={() => {
          setIsOpen(false);
          setForm({});
        }}>
        <View style={styles.modalBack}>
          <View style={styles.modal}>
            <Text style={styles.textHeader}>Busqueda Avanzada</Text>
            <View style={styles.line} />
            <View style={styles.textInput}>
              <Text style={styles.label}>Número de Placa</Text>
              <View style={styles.textInputContainer}>
                <TextInput
                  onChangeText={text => handleChange('numero_de_placa', text)}
                  color="black"
                  placeholderTextColor="#919191"
                  style={styles.textInputStyle}
                  placeholder="Numero de Placa"
                />
              </View>
            </View>
            <View style={styles.textInput}>
              <Text style={styles.label}>Tipo de Vehículo</Text>
              <View>
                <DropDownPicker
                  style={styles.dropdownContainer}
                  itemSeparator
                  itemSeparatorStyle={styles.itemSeparator}
                  closeAfterSelecting
                  closeOnBackPressed
                  onClose={() => (opened ? setOpened(false) : setOpened(true))}
                  modalTitle="Tipos de Vehiculo"
                  items={convertData(tiposVehiculos)}
                  placeholderStyle={{color: 'gray', marginLeft: 5}}
                  placeholder={selectedValue[0] || 'Tipo'}
                  listMode="MODAL"
                  open={opened}
                  onPress={() => {
                    opened ? setOpened(false) : setOpened(true);
                  }}
                  onSelectItem={item => {
                    {
                      handleChange('tipo_de_vehiculo', item.value);
                      handleSelectedValue(0, item.label);
                    }
                  }}
                />
              </View>
            </View>
            <View style={styles.textInput}>
              <Text style={styles.label}>Línea</Text>
              <View>
                <DropDownPicker
                  style={styles.dropdownContainer}
                  itemSeparator
                  itemSeparatorStyle={styles.itemSeparator}
                  closeAfterSelecting
                  closeOnBackPressed
                  onClose={() =>
                    openedDos ? setOpenedDos(false) : setOpenedDos(true)
                  }
                  modalTitle="Lineas de Vehículo"
                  items={convertData(lineasVehiculares)}
                  placeholderStyle={{color: 'gray', marginLeft: 5}}
                  placeholder={selectedValue[1] || 'Línea'}
                  dropDownDirection="TOP"
                  listMode="MODAL"
                  open={openedDos}
                  onPress={() => {
                    openedDos ? setOpenedDos(false) : setOpenedDos(true);
                  }}
                  onSelectItem={item => {
                    {
                      handleChange('linea', item.value);
                      handleSelectedValue(1, item.label);
                    }
                  }}
                />
              </View>
            </View>
            <View style={styles.textInput}>
              <Text style={styles.label}>Clase</Text>
              <View>
                <DropDownPicker
                  style={styles.textInputContainer}
                  itemSeparator
                  itemSeparatorStyle={styles.itemSeparator}
                  closeAfterSelecting
                  closeOnBackPressed
                  onClose={() =>
                    openedCinco ? setOpenedCinco(false) : setOpenedCinco(true)
                  }
                  modalTitle="Clases de Vehículo"
                  items={convertData(clasesVehiculos)}
                  placeholderStyle={{color: 'gray', marginLeft: 5}}
                  placeholder={selectedValue[4] || 'Clase'}
                  dropDownDirection="TOP"
                  listMode="MODAL"
                  open={openedCinco}
                  onPress={() => {
                    openedCinco ? setOpenedCinco(false) : setOpenedCinco(true);
                  }}
                  onSelectItem={item => {
                    {
                      handleChange('clase_de_vehiculo', item.value);
                      handleSelectedValue(4, item.label);
                    }
                  }}
                />
              </View>
            </View>

            <View style={styles.textInput}>
              <Text style={styles.label}>Servicio</Text>
              <View>
                <DropDownPicker
                  style={styles.textInputContainer}
                  itemSeparator
                  itemSeparatorStyle={styles.itemSeparator}
                  closeAfterSelecting
                  closeOnBackPressed
                  onClose={() =>
                    openedTres ? setOpenedTres(false) : setOpenedTres(true)
                  }
                  modalTitle="Servicio de Vehículo"
                  items={convertData(serviciosVehiculares)}
                  placeholderStyle={{color: 'gray', marginLeft: 5}}
                  placeholder={selectedValue[2] || 'Servicio'}
                  dropDownDirection="TOP"
                  listMode="MODAL"
                  open={openedTres}
                  onPress={() => {
                    openedTres ? setOpenedTres(false) : setOpenedTres(true);
                  }}
                  onSelectItem={item => {
                    {
                      handleChange('servicio', item.value);
                      handleSelectedValue(2, item.label);
                    }
                  }}
                />
              </View>
            </View>
            <View style={styles.textInput}>
              <Text style={styles.label}>Estatus del Vehículo</Text>
              <View>
                <DropDownPicker
                  style={styles.textInputContainer}
                  itemSeparator
                  itemSeparatorStyle={styles.itemSeparator}
                  closeAfterSelecting
                  closeOnBackPressed
                  onClose={() =>
                    openedCuatro
                      ? setOpenedCuatro(false)
                      : setOpenedCuatro(true)
                  }
                  modalTitle="Estatus de Vehículo"
                  items={convertData(estadosVehiculares)}
                  placeholderStyle={{color: 'gray', marginLeft: 5}}
                  placeholder={selectedValue[3] || 'Estatus del Vehículo'}
                  dropDownDirection="TOP"
                  listMode="MODAL"
                  open={openedCuatro}
                  onPress={() => {
                    openedCuatro
                      ? setOpenedCuatro(false)
                      : setOpenedCuatro(true);
                  }}
                  onSelectItem={item => {
                    {
                      handleChange('estatus_del_vehiculo', item.value);
                      handleSelectedValue(3, item.label);
                    }
                  }}
                />
              </View>
            </View>
            <TouchableWithoutFeedback onPress={handleSearch}>
              <View style={styles.buttonPrint}>
                <Text style={styles.text}>Buscar</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default BusquedaAvanzadaVehiculo;

const styles = StyleSheet.create({
  text: {
    color: 'white',
    padding: 5,
    fontFamily: fonts.bold,
    textAlign: 'center',
  },
  textHeader: {
    color: 'black',
    fontFamily: fonts.bold,
    fontSize: 20,
  },
  line: {
    borderColor: 'gray',
  },
  button: {
    backgroundColor: '',
  },
  modalBack: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#00000080',
  },
  modal: {
    backgroundColor: 'white',
    width: Dimensions.get('window').width,
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 10,
  },
  line: {
    height: 1,
    width: Dimensions.get('window').width * 0.85,
    backgroundColor: 'gray',
  },
  payInfo: {
    margin: 5,
    backgroundColor: '#f0e4e4',
    width: Dimensions.get('window').width * 0.85,
    borderRadius: 10,
  },
  textInputContainer: {
    color: 'black',
    marginVertical: 0,
    width: 336,
    height: 46,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#a3a3a3',
  },
  dropdownContainer: {
    color: 'black',
    marginVertical: 0,
    width: 336,
    height: 46,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#a3a3a3',
    zIndex: 100,
  },
  textInputStyle: {
    color: 'black',
    height: '100%',
    marginLeft: 14,
    fontSize: 13,
  },
  label: {
    color: 'black',
    fontFamily: fonts.light,
    marginLeft: 17,
  },
  inputView: {
    marginVertical: 10,
    textAlign: 'left',
  },
  buttonPrint: {
    backgroundColor: '#79142A',
    width: Dimensions.get('window').width * 0.85,
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 0.6,
    marginVertical: 10,
    paddingVertical: 10,
  },
  textInput: {
    color: 'black',
    marginTop: 5,
  },
  iconAvanzadoContainer: {
    backgroundColor: '#79142A',
    height: 46,
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  itemSeparator: {
    width: '98%',
    alignSelf: 'center',
    backgroundColor: '#c4c4c4',
  },
});

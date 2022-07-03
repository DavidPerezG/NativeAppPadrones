import {DropdownAlertType} from 'react-native-dropdownalert';

export interface AlertNotification {
  type: DropdownAlertType;
  title: string;
  message: string;
}

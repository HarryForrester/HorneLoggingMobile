import React from 'react'
import {
  View,
  Text,
  TextInput,
  useColorScheme,
  TouchableOpacity,
} from 'react-native'
import styles from '../../constants/Styles'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
//import DatePicker from 'react-native-date-picker'
import DateTimePicker from '@react-native-community/datetimepicker';

interface DateProps {
  elementKey: string
  value: Date
  labelValue: string
  labelText: string
  formDateOpen: any
  toggleOpenDate: () => void
  updateDate: (date: string) => void
  handleUpdateDate: (date: Date) => void
}

const DateElement: React.FC<DateProps> = ({
  elementKey,
  value,
  labelValue,
  labelText,
  formDateOpen,
  toggleOpenDate,
  updateDate,
  handleUpdateDate,
}) => {
  const colorScheme = useColorScheme()
  const isDarkMode = colorScheme === 'dark'

  return (
    <View>
      <Text
        style={[
          styles.modalTextBold,
          isDarkMode ? styles.textInputDark : styles.textLight,
        ]}
      >
        {labelText}
      </Text>

      <TouchableOpacity
        style={[
          styles.dateButton,
          {backgroundColor: isDarkMode ? 'grey' : 'white'},
        ]}
        onPress={toggleOpenDate}
      >
        <Text
          style={[
            styles.dateButtonText,
            isDarkMode ? styles.buttonTextDark : styles.buttonTextLight,
          ]}
        >
          {`Date ${labelValue}`}
        </Text>
      </TouchableOpacity>

      {formDateOpen[elementKey] && (
       <DateTimePicker
            value={value}
            mode="date"
            display="default"
            onChange={(selectedDate: any) => {
              const updatedDateOpen = { ...formDateOpen };
              updatedDateOpen[elementKey] = false;
              updateDate(updatedDateOpen);
              handleUpdateDate(selectedDate);            } }
            onTouchCancel={() => {
              const updatedDateOpen = { ...formDateOpen };
              updatedDateOpen[elementKey] = false;
              updateDate(updatedDateOpen);
            } } // This handles Android back button to close the picker
          />
      )}
    </View>
  )
}

export default DateElement

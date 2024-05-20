import React from 'react'
import {
  View,
  Text,
  TextInput,
  useColorScheme,
  TouchableOpacity,
} from 'react-native'
import styles from '../../constants/Styles'
//import DatePicker from 'react-native-date-picker'
import DateTimePicker from '@react-native-community/datetimepicker';


interface TimeElementProps {
  labelText: string
  labelValue: string
  value: Date
  toggleTimeElement: Function
  isFormOpen: boolean
  updateTime: Function
  onCancel: any
}

const TimeElement: React.FC<TimeElementProps> = ({
  labelText,
  labelValue,
  value,
  toggleTimeElement,
  isFormOpen,
  updateTime,
  onCancel,
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
        onPress={() => toggleTimeElement()}
      >
        <Text
          style={[
            styles.dateButtonText,
            isDarkMode ? styles.buttonTextDark : styles.buttonTextLight,
          ]}
        >
          {`Time ${labelValue}`}
        </Text>
      </TouchableOpacity>
    

      {isFormOpen && (
       
        <DateTimePicker
            value={value}
            mode="time"
            display="default"
            onChange={(selectedTime) => {
              updateTime(selectedTime)
            }}
            onTouchCancel={onCancel } // This handles Android back button to close the picker
          />
      )}
    </View>
  )
}

export default TimeElement

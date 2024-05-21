import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import styles from '../../constants/Styles';

interface DateProps {
  elementKey: string;
  value: Date;
  labelValue: string;
  labelText: string;
  formDateOpen: any;
  toggleOpenDate: () => void;
  updateDate: (date: string) => void;
  handleUpdateDate: (date: Date) => void;
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
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const onDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || value;

    const updatedDateOpen = { ...formDateOpen };
    updatedDateOpen[elementKey] = false;
    updateDate(updatedDateOpen);
    handleUpdateDate(currentDate);
  };

  return (
    <View>
      <Text style={[styles.modalTextBold, isDarkMode ? styles.textInputDark : styles.textLight]}>
        {labelText}
      </Text>

      <TouchableOpacity
        style={[styles.dateButton, { backgroundColor: isDarkMode ? 'grey' : 'white' }]}
        onPress={toggleOpenDate}>
        <Text
          style={[
            styles.dateButtonText,
            isDarkMode ? styles.buttonTextDark : styles.buttonTextLight,
          ]}>
          {value.toLocaleDateString()}
        </Text>
      </TouchableOpacity>

      {formDateOpen[elementKey] && (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"
          onChange={onDateChange}
          onTouchCancel={() => {
            const updatedDateOpen = { ...formDateOpen };
            updatedDateOpen[elementKey] = false;
            updateDate(updatedDateOpen);
          }} // This handles Android back button to close the picker
        />
      )}
    </View>
  );
};

export default DateElement;

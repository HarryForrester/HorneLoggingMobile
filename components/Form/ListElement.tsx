import React from 'react'
import {
  View,
  Text,
  TextInput,
  useColorScheme,
  TouchableOpacity,
} from 'react-native'
import styles from '../../constants/Styles'
import {SelectList} from 'react-native-dropdown-select-list'

interface ListElementProps {
  label: string
  handleListChange: Function
  listData: string[]
  defaultOption: any
}

const ListElement: React.FC<ListElementProps> = ({
  label,
  handleListChange,
  listData,
  defaultOption,
}) => {
  const colorScheme = useColorScheme()
  const isDarkMode = colorScheme === 'dark'

  return (
    <View style={{alignItems: 'center'}}>
      <Text
        style={[
          styles.modalTextBold,
          isDarkMode ? styles.textInputDark : styles.textLight,
        ]}
      >
        {label}
      </Text>

      <SelectList
        setSelected={(val: any) => handleListChange(val)}
        data={listData}
        save='value'
        placeholder='Select Person'
        dropdownStyles={{backgroundColor: 'white'}}
        defaultOption={defaultOption}
        inputStyles={
          isDarkMode ? styles.buttonTextDark : styles.buttonTextLight
        }
        dropdownTextStyles={
          isDarkMode ? styles.buttonTextDark : styles.buttonTextLight
        }
        boxStyles={isDarkMode ? styles.listViewDark : styles.listViewLight}
      />
    </View>
  )
}

export default ListElement

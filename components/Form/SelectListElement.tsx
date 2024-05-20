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

interface SelectElementProps {
  label: string
  handleSelectChange: Function
  listData: string[]
  defaultOption: any
}

const SelectListElement: React.FC<SelectElementProps> = ({
  label,
  handleSelectChange,
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
      <View style={styles.selectlistWidth}>
        <SelectList
          setSelected={(val: any) => {
            handleSelectChange(val)
          }}
          defaultOption={defaultOption}
          data={listData}
          save='value'
          dropdownStyles={{height: 150, backgroundColor: 'white'}}
          inputStyles={
            isDarkMode ? styles.buttonTextDark : styles.buttonTextLight
          }
          dropdownTextStyles={
            isDarkMode ? styles.buttonTextDark : styles.buttonTextLight
          }
          boxStyles={isDarkMode ? styles.listViewDark : styles.listViewLight}
        />
      </View>
    </View>
  )
}

export default SelectListElement

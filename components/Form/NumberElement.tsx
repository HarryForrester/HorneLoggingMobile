import React from 'react'
import {View, Text, TextInput, useColorScheme} from 'react-native'
import styles from '../../constants/Styles'

interface NumberProps {
  labelText: string
  value: string
  handleNumberChange: (number: string) => void
}

const NumberElement: React.FC<NumberProps> = ({
  labelText,
  value,
  handleNumberChange,
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

      <TextInput
        style={[
          styles.modalText,
          styles.textInput,
          isDarkMode ? styles.inputDark : styles.inputLight,
        ]}
        placeholder={'Enter ' + labelText}
        onChangeText={handleNumberChange}
        placeholderTextColor={isDarkMode ? 'white' : 'grey'}
        keyboardType='numeric'
        value={value || ''}
      />
    </View>
  )
}

export default NumberElement

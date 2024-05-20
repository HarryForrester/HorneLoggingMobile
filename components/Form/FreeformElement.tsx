import React from 'react'
import {View, Text, TextInput, useColorScheme} from 'react-native'
import styles from '../../constants/Styles'

interface FreefromProps {
  labelText: string
  value: string
  handleTextChange: (text: string) => void
}

const FreeformElement: React.FC<FreefromProps> = ({
  labelText,
  value,
  handleTextChange,
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
        onChangeText={handleTextChange}
        placeholderTextColor={isDarkMode ? 'white' : 'grey'}
        value={value || ''}
      />
    </View>
  )
}

export default FreeformElement

import React from 'react'
import {
  View,
  Text,
  TextInput,
  useColorScheme,
  TouchableOpacity,
  Image,
} from 'react-native'
import styles from '../../constants/Styles'
import Sign from '../../components/SignatureComponent'

interface SignatureElementProps {
  label: string
  defaultValue: string
  handleSignatureChange: (signature: object) => void
}

const SignatureElement: React.FC<SignatureElementProps> = ({
  label,
  defaultValue,
  handleSignatureChange,
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
        {label}
      </Text>

      <Sign
        text={label}
        defaultValue={defaultValue}
        onOK={(signature: any) => handleSignatureChange(signature)}
      />
    </View>
  )
}

export default SignatureElement

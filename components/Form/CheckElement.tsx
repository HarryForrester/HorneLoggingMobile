import React from 'react'
import {View, Text, TextInput, useColorScheme} from 'react-native'
import styles from '../../constants/Styles'
import BouncyCheckbox from 'react-native-bouncy-checkbox'

interface CheckProps {
  value: any
  isChecked: any
  handleCheckChange: any
}

const CheckElement: React.FC<CheckProps> = ({
  value,
  isChecked,
  handleCheckChange,
}) => {
  const colorScheme = useColorScheme()
  const isDarkMode = colorScheme === 'dark'

  return (
    <View style={{alignItems: 'center', justifyContent: 'center'}}>
      <View style={{width: 200}}>
        <BouncyCheckbox
          size={25}
          fillColor='green'
          style={{marginTop: 10}}
          unFillColor='#FFFFFF'
          text={value}
          iconStyle={{borderColor: 'red'}}
          innerIconStyle={{borderWidth: 2}}
          textStyle={[
            {fontFamily: 'JosefinSans-Regular'},
            isDarkMode ? styles.buttonTextDark : styles.buttonTextLight,
          ]}
          isChecked={isChecked}
          onPress={handleCheckChange}
        />
      </View>
    </View>
  )
}

export default CheckElement

import React from 'react';
import { Text, View, useColorScheme } from 'react-native';
import Sign from '../../components/SignatureComponent';
import styles from '../../constants/Styles';

interface SignatureElementProps {
  label: string;
  value: string;
  handleSignatureChange: (signature: object) => void;
}

const SignatureElement: React.FC<SignatureElementProps> = ({
  label,
  value,
  handleSignatureChange,
}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <View>
      <Text style={[styles.modalTextBold, isDarkMode ? styles.textInputDark : styles.textLight]}>
        {label}
      </Text>

      <Sign
        text={label}
        value={value}
        onOK={(signature: any) => handleSignatureChange(signature)}
      />
    </View>
  );
};

export default SignatureElement;

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  useColorScheme,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../../constants/Styles';

interface ImageElementProps {
  label: string;
  image: string; // Updated the type to string since it will hold base64 data
  handleRemoveImage: () => void; // Updated type to reflect the usage
  handleImageChange: (imageBase64: any) => void; // Updated type to reflect the usage
}

const ImageElement: React.FC<ImageElementProps> = ({
  label,
  image,
  handleRemoveImage,
  handleImageChange,
}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const handleImagePick = async (sourceType: 'library' | 'camera') => {
    let result;

    if (sourceType === 'camera') {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });
    }

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageBase64 = result.assets[0].base64;
      handleImageChange(imageBase64);
    }
  };

  return (
    <View style={{ alignItems: 'center' }}>
      <Text
        style={[
          styles.modalTextBold,
          isDarkMode ? styles.textInputDark : styles.textLight,
        ]}
      >
        {label}
      </Text>
      {image ? (
        <View>
          <Image
            source={{ uri: `data:image/jpeg;base64,${image}` }}
            style={{ width: 150, height: 150 }}
          />
          <TouchableOpacity onPress={handleRemoveImage}>
            <Text
              style={[
                styles.textInput,
                isDarkMode ? styles.inputDark : styles.inputLight,
              ]}
            >
              Remove Image
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <TouchableOpacity onPress={() => handleImagePick('library')}>
            <Text
              style={[
                styles.textInput,
                isDarkMode ? styles.inputDark : styles.inputLight,
                { textAlign: 'center' },
              ]}
            >
              <Ionicons name='image' color={'black'} size={20} /> Image from library
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleImagePick('camera')}>
            <Text
              style={[
                styles.textInput,
                isDarkMode ? styles.inputDark : styles.inputLight,
                { textAlign: 'center' },
              ]}
            >
              <Ionicons name='camera' color={'black'} size={20} /> Take Photo
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ImageElement;

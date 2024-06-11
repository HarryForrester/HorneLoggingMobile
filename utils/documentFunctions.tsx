import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

const handleDocumentPress = async (uri: any) => {
  const filePath = `${FileSystem.documentDirectory}files/${uri}`;

  try {
    // Check if the file exists
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    if (!fileInfo.exists) {
      throw new Error('File does not exist');
    }

    if (Platform.OS === 'android') {
      // On Android, use Linking to open the file
      FileSystem.getContentUriAsync(filePath).then((cUri) => {
        console.log(cUri);
        IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: cUri,
          flags: 1,
        });
      });
    } else {
      // On iOS, share the file using expo-sharing
      await Sharing.shareAsync(filePath);
    }

    console.log('File opened successfully');
  } catch (error) {
    console.error('Failed to open the file:', error);
  }
};

export default handleDocumentPress;

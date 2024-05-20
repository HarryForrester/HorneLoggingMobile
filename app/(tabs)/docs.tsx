import React from 'react'
import {
  View,
  Text,
  useColorScheme,
  TouchableOpacity,
  SectionList,
} from 'react-native'
import styles from '../../constants/Styles'
//import RNFS from 'react-native-fs'
import * as FileSystem from 'expo-file-system'

import {useApp, useQuery} from '@realm/react'
import LibraryFile from '../../schemas/LibraryFile'
//import FileViewer from 'react-native-file-viewer'
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as IntentLauncher from 'expo-intent-launcher'; 
import { Platform, Linking } from 'react-native';

function DocsTab() {
  const colorScheme = useColorScheme()
  const isDarkMode = colorScheme === 'dark'
  const app = useApp()
  const _account = app.currentUser?.customData._account

  const filesCollection = useQuery(LibraryFile).filter(
    (file) => file._account === _account,
  )

  const groupedFiles = filesCollection.reduce((groups: any, file) => {
    if (!groups[file.type]) {
      groups[file.type] = []
    }
    groups[file.type].push(file)
    return groups
  }, {})

  const sections = Object.keys(groupedFiles).map((group) => ({
    title: group,
    data: groupedFiles[group],
  }))

  const handleDocumentPress = async (uri:any ) => {
    const filePath = `${FileSystem.documentDirectory}files/${uri}`;

    try {
      // Check if the file exists
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      if (!fileInfo.exists) {
        throw new Error('File does not exist');
      }

      if (Platform.OS === 'android') {
        // On Android, use Linking to open the file
        FileSystem.getContentUriAsync(filePath).then(cUri => {
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
  return (
    <View
      style={[
        styles.settingsContainer,
        isDarkMode ? styles.darkmode : styles.normal,
      ]}
    >
      <View style={{flex: 1, maxHeight: '90%'}}>
        <SectionList
          sections={sections}
          scrollEnabled={true}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => handleDocumentPress(item.uri)}>
              <View
                style={[
                  styles.listItemContainer,
                  {
                    backgroundColor:
                      colorScheme === 'dark' ? '#1b1b1b' : '#d0d8d5',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.listItemText,
                    isDarkMode ? styles.labelDark : styles.buttonTextLight,
                  ]}
                >
                  {`${item.fileName}`}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          renderSectionHeader={({section: {title}}) => (
            <View style={styles.sectionHeaderContainer}>
              <Text
                style={[
                  styles.sectionHeaderText,
                  isDarkMode ? styles.labelDark : styles.headerTextLight,
                ]}
              >
                {title}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  )
}

export default DocsTab

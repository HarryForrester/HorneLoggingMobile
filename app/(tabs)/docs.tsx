import React from 'react';
import { SectionList, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import styles from '../../constants/Styles';
//import RNFS from 'react-native-fs'
import handleDocumentPress from '@/utils/documentFunctions';
import { useApp, useQuery } from '@realm/react';
import LibraryFile from '../../schemas/LibraryFile';
//import FileViewer from 'react-native-file-viewer'

function DocsTab() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const app = useApp();
  const _account = app.currentUser?.customData._account;

  const filesCollection = useQuery(LibraryFile).filter((file) => file._account === _account);

  const groupedFiles = filesCollection.reduce((groups: any, file) => {
    if (!groups[file.type]) {
      groups[file.type] = [];
    }
    groups[file.type].push(file);
    return groups;
  }, {});

  const sections = Object.keys(groupedFiles).map((group) => ({
    title: group,
    data: groupedFiles[group],
  }));

  return (
    <View style={[styles.settingsContainer, isDarkMode ? styles.darkmode : styles.normal]}>
      <View style={{ flex: 1, maxHeight: '90%' }}>
        <SectionList
          sections={sections}
          scrollEnabled={true}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleDocumentPress(item.uri)}>
              <View
                style={[
                  styles.listItemContainer,
                  {
                    backgroundColor: colorScheme === 'dark' ? '#1b1b1b' : '#d0d8d5',
                  },
                ]}>
                <Text
                  style={[
                    styles.listItemText,
                    isDarkMode ? styles.labelDark : styles.buttonTextLight,
                  ]}>
                  {`${item.fileName}`}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionHeaderContainer}>
              <Text
                style={[
                  styles.sectionHeaderText,
                  isDarkMode ? styles.labelDark : styles.headerTextLight,
                ]}>
                {title}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

export default DocsTab;

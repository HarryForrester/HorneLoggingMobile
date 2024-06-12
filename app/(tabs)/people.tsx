import { useQuery, useUser } from '@realm/react';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  SectionList,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
//import RNFS from 'react-native-fs';
import * as FileSystem from 'expo-file-system';

import handleDocumentPress from '@/utils/documentFunctions';
import { useNavigation } from 'expo-router';
import styles from '../../constants/Styles';
import File from '../../schemas/File';
import People from '../../schemas/People';
interface Person {
  imgUrl: any;
  crew: any;
  _id: string;
  name: string;
}

interface CrewSection {
  title: string;
  data: Person[];
}

function PeopleScreen() {
  const [peopleByCrew, setPeopleByCrew] = useState<CrewSection[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<any>([]);
  const [selectedImage, setSelectedImage] = useState<any>([]);
  const [accessLevelAdmin, setAccessLevelAdmin] = useState<null | string>(null);
  const [accessLevelForeman, setAccessLevelForeman] = useState<null | string>(null);
  const [selectedFile, setSelectedFile] = useState<any>('');
  const [isLoading, setIsLoading] = useState(true); // State to track loading

  const user = useUser();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const peopleCollection = useQuery(People);

  const fileCollection = useQuery(File).filter((file) => {
    return file._account === user.customData._account;
  });

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: true });
  }, [navigation]);

  useEffect(() => {
    if (user.customData.device === JSON.stringify({ accessLevelAdmin: 'on' })) {
      setAccessLevelAdmin('on');
      setAccessLevelForeman('off');
    } else if (user.customData.device === JSON.stringify({ accessLevelForeman: 'on' })) {
      setAccessLevelForeman('on');
      setAccessLevelAdmin('off');
    } else if (user.customData.device === JSON.stringify({ accessLevelNormal: 'on' })) {
      setAccessLevelForeman('off');
      setAccessLevelAdmin('off');
    }
  }, [user]);

  /**
   * updates setPeopleByCrew if storedTimestamp is not equal to lastModified
   */
  useEffect(() => {
    const getPeople = async () => {
      try {
        const filteredPeople = peopleCollection.filter((person) => {
          return person._account === user.customData._account;
        });
        console.log(
          'filteredPeople',
          filteredPeople.map((a) => a._account),
        );
        //const currentEmail = await SInfo.getItem('currentEmai', {});
        const crews: { [crewName: string]: Person[] } = {};
        const currentCrew = user.customData.crew;

        filteredPeople.forEach((item: any) => {
          const crewName = item.crew;
          if (accessLevelAdmin === 'on' || crewName === currentCrew) {
            if (!crews.hasOwnProperty(crewName)) {
              crews[crewName] = [];
            }
            crews[crewName].push(item);
          }
        });

        const peopleByCrewList: CrewSection[] = Object.keys(crews).map((crewName) => ({
          title: crewName,
          data: crews[crewName],
        }));
        console.log(
          'peopleByCrewList',
          peopleByCrewList.map((n) => n.title),
        );
        setPeopleByCrew(peopleByCrewList);
      } catch (err) {
        console.error('Error has occurred getting people.json', err);
      } finally {
        setIsLoading(false);
      }
    };

    getPeople();
  }, [peopleCollection, user.customData._account, user.customData.crew]);

  const closeFormModal = () => {
    setModalVisible(false);
    setSelectedPerson(null);
  };

  const darkMode = isDarkMode ? styles.textInputDark : styles.labelLight;

  const handleFileSelection = async (crewMemberId: string) => {
    try {
      const filesForCrewMember = fileCollection.filter(
        (file: any) => file.owner.toString() == crewMemberId,
      );
      setSelectedFile(filesForCrewMember);
    } catch (error) {
      console.error('Failed to fetcg files for crew member', error);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#241c23" />
        <Text style={darkMode}>Loading data...</Text>
      </View>
    );
  }

  return (
    <View style={[{ backgroundColor: colorScheme === 'dark' ? '#111' : '#e7f0ed' }, { flex: 1 }]}>
      <SectionList
        style={{ marginTop: 25 }}
        sections={peopleByCrew}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={async () => {
              setSelectedPerson(item);
              handleFileSelection(item._id);
              const folderPath = `${FileSystem.documentDirectory}/files`;
              const filePath = `${folderPath}${item.imgUrl}`;
              setSelectedImage(filePath);
              setModalVisible(true);
            }}>
            <View style={styles.personContainer}>
              <Text
                style={[
                  styles.personName,
                  isDarkMode ? styles.textInputDark : styles.peopleListTextLight,
                ]}>
                {item.name}
              </Text>
              {/* Render other person details here */}
            </View>
          </TouchableOpacity>
        )}
        renderSectionHeader={({ section }) => <Text style={styles.crewTitle}>{section.title}</Text>}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 50 }} // Add some padding at the bottom to avoid overlapping with the navigation bar
      />

      <Modal visible={modalVisible} onRequestClose={closeFormModal} transparent>
        <View style={styles.formModalContainer}>
          <View
            style={[
              styles.modalHeader,
              isDarkMode ? styles.modalHeaderDark : styles.modalHeaderLight,
            ]}>
            {/* Display the person's name or any other relevant data */}
            <Text
              style={[
                styles.modalHeadingText,
                isDarkMode ? styles.textInputDark : styles.textInputLight,
              ]}>
              {selectedPerson?.name}
            </Text>
          </View>

          <View style={[styles.modalView, isDarkMode ? styles.darkmode : styles.normal]}>
            <ScrollView>
              <View style={{ padding: 10 }}>
                <View style={styles.personDetailRow}>
                  <View style={styles.personImageContainer}>
                    <Image style={styles.personImage} source={{ uri: `file://${selectedImage}` }} />
                  </View>
                </View>
                <View style={styles.personDetailRow}>
                  <Text style={[styles.personDetailLabel, darkMode]}>Role:</Text>
                  <Text style={[styles.personDetailValue, darkMode]}>{selectedPerson?.role}</Text>
                </View>
                <View style={styles.personDetailRow}>
                  <Text style={[styles.personDetailLabel, darkMode]}>Address:</Text>
                  <Text style={[styles.personDetailValue, darkMode]}>
                    {selectedPerson?.address}
                  </Text>
                </View>
                <View style={styles.personDetailRow}>
                  <Text style={[styles.personDetailLabel, darkMode]}>Phone:</Text>
                  <TouchableOpacity onPress={() => Linking.openURL(`tel:${selectedPerson?.phone}`)}>
                    <Text style={[styles.personDetailValue, darkMode]}>
                      {selectedPerson?.phone}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.personDetailRow}>
                  <Text style={[styles.personDetailLabel, darkMode]}>Alt Contact:</Text>
                  <Text style={[styles.personDetailValue, darkMode]}>
                    {selectedPerson?.contact}
                  </Text>
                </View>
                <View style={styles.personDetailRow}>
                  <Text style={[styles.personDetailLabel, darkMode]}>Alt Contact Phone:</Text>
                  <TouchableOpacity
                    onPress={() => Linking.openURL(`tel:${selectedPerson?.contactphone}`)}>
                    <Text style={[styles.personDetailValue, darkMode]}>
                      {selectedPerson?.contactphone}
                    </Text>
                  </TouchableOpacity>
                </View>

                {(accessLevelAdmin === 'on' || accessLevelForeman === 'on') && (
                  <View style={styles.personDetailRow}>
                    <Text style={[styles.personDetailLabel, darkMode]}>DOB:</Text>
                    <Text style={[styles.personDetailValue, darkMode]}>{selectedPerson?.dob}</Text>
                  </View>
                )}
                {(accessLevelAdmin === 'on' || accessLevelForeman === 'on') && (
                  <View style={styles.personDetailRow}>
                    <Text style={[styles.personDetailLabel, darkMode]}>Doctor:</Text>
                    <Text style={[styles.personDetailValue, darkMode]}>
                      {selectedPerson?.doctor}
                    </Text>
                  </View>
                )}
                {(accessLevelAdmin === 'on' || accessLevelForeman === 'on') && (
                  <View style={styles.personDetailRow}>
                    <Text style={[styles.personDetailLabel, darkMode]}>Id Type:</Text>
                    <Text style={[styles.personDetailValue, darkMode]}>
                      {selectedPerson?.idType}
                    </Text>
                  </View>
                )}
                {(accessLevelAdmin === 'on' || accessLevelForeman === 'on') && (
                  <View style={styles.personDetailRow}>
                    <Text style={[styles.personDetailLabel, darkMode]}>Medical:</Text>
                    <Text style={[styles.personDetailValue, darkMode]}>
                      {selectedPerson?.medical}
                    </Text>
                  </View>
                )}
                {(accessLevelAdmin === 'on' || accessLevelForeman === 'on') && (
                  <View style={styles.personDetailRow}>
                    <Text style={[styles.personDetailLabel, darkMode]}>Start Date:</Text>
                    <Text style={[styles.personDetailValue, darkMode]}>
                      {selectedPerson?.startDate}
                    </Text>
                  </View>
                )}

                {accessLevelAdmin === 'on' && selectedFile ? (
                  selectedFile.length > 0 ? (
                    <ScrollView>
                      <Text
                        style={[
                          styles.modalTextBold,
                          isDarkMode ? styles.buttonTextDark : styles.buttonTextLight,
                        ]}>
                        Files
                      </Text>
                      {selectedFile.map((file: any) => (
                        <TouchableOpacity
                          key={file._id}
                          onPress={() => handleDocumentPress(file.uri)}>
                          <View
                            style={[
                              styles.fileContainer,
                              {
                                backgroundColor: isDarkMode ? '#0a0a0a' : '#f9f9f9',
                              },
                            ]}>
                            <Text
                              style={[
                                styles.modalTextBold,
                                isDarkMode ? styles.buttonTextDark : styles.buttonTextLight,
                              ]}>
                              {file.type}
                            </Text>
                            <Text
                              style={[
                                styles.modalTextLink,
                                isDarkMode ? styles.buttonTextDark : styles.buttonTextLight,
                              ]}>
                              {file.fileName}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  ) : null
                ) : null}
              </View>
            </ScrollView>

            <View style={styles.buttonContainer}>
              <Pressable
                style={[
                  styles.button,
                  styles.buttonClose,
                  isDarkMode ? styles.buttonBackgroundDark : styles.buttonBackgroundLight,
                ]}
                onPress={closeFormModal}>
                <Text
                  style={[
                    styles.buttonText,
                    isDarkMode ? styles.buttonTextDark : styles.headerTextLight,
                  ]}>
                  Close
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default PeopleScreen;

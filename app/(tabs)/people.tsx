import { useQuery, useUser } from '@realm/react';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SectionList,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
//import RNFS from 'react-native-fs';
import * as FileSystem from 'expo-file-system';

import PersonInfoModal from '@/components/Modals/PersonInfoModal';
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
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [accessLevelAdmin, setAccessLevelAdmin] = useState<null | string>(null);
  const [accessLevelForeman, setAccessLevelForeman] = useState<null | string>(null);
  const [selectedFile, setSelectedFile] = useState<any>('');
  const [isLoading, setIsLoading] = useState(true); // State to track loading
  const defaultProfileImage = require('@/assets/images/defaultprofile.png');

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
  }, [accessLevelAdmin, peopleCollection, user.customData._account, user.customData.crew]);

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
      <View
        style={[
          { flex: 1, justifyContent: 'center', alignItems: 'center' },
          isDarkMode ? styles.darkmode : styles.lightBackground,
        ]}>
        <ActivityIndicator size="large" color="#241c23" />
        <Text style={darkMode}>Loading data...</Text>
      </View>
    );
  }

  return (
    <View style={[isDarkMode ? styles.darkmode : styles.lightBackground, { flex: 1 }]}>
      <SectionList
        sections={peopleByCrew}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={async () => {
              setSelectedPerson(item);
              handleFileSelection(item._id);
              const folderPath = `${FileSystem.documentDirectory}/files`;
              const filePath = `${folderPath}${item.imgUrl}`;
              if (item.imgUrl === '/img/default.jpg') {
                setSelectedImage(null);
              } else {
                setSelectedImage(filePath);
              }
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
        //contentContainerStyle={{ paddingBottom: 50 }} // Add some padding at the bottom to avoid overlapping with the navigation bar
      />
      <PersonInfoModal
        showCrewPersonModal={modalVisible}
        setCrewPersonShowModal={setModalVisible}
        selectedPerson={selectedPerson}
        selectedImage={selectedImage}
        defaultProfileImage={defaultProfileImage}
        accessLevelAdmin={accessLevelAdmin}
        accessLevelForeman={accessLevelForeman}
        selectedFile={selectedFile}
        setCrewShowModal={() => null}
      />
    </View>
  );
}

export default PeopleScreen;

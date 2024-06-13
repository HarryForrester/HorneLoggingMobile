import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

import Pdf from 'react-native-pdf';
//import RNFS from 'react-native-fs'
import * as FileSystem from 'expo-file-system';
import HazardContainer from '../../components/HazardContainer';
import styles from '../../constants/Styles';
//import FileViewer from 'react-native-file-viewer'
import * as Sharing from 'expo-sharing';
//import SInfo from 'react-native-sensitive-info'
import CrewInfoModal from '@/components/Modals/CrewInfoModal';
import HazardInfoModal from '@/components/Modals/HazardInfoModal';
import PersonInfoModal from '@/components/Modals/PersonInfoModal';
import SkidInfoModal from '@/components/Modals/SkidInfoModal';
import syncFiles from '@/services/syncFiles';
import ReactNativeZoomableView from '@openspacelabs/react-native-zoomable-view/src/ReactNativeZoomableView';
import { useApp, useQuery, useUser } from '@realm/react';
import { useNavigation } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import File from '../../schemas/File';
import GeneralHazards from '../../schemas/GeneralHazards';
import { Hazards } from '../../schemas/Hazards';
import Maps from '../../schemas/Maps';
import People from '../../schemas/People';
//import syncFiles from '../services/syncFiles'

type Point = {
  id: any;
  point: {
    x: number;
    y: number;
    originalWidth: number;
    originalHeight: number;
    pdfHeight: number;
    pdfWidth: number;
  };
  info: {
    pointName: string;
    crews: any[];
    siteHazards: HazardProps[];
    selectedDocuments: Document[];
    cutPlans: any;
  };
};

type HazardProps = {
  id: string;
  name: string;
  hazards: any[];
  title: string;
};

type Document = {
  fileName: string;
  uri: string;
};

const Marker = ({ x, y, onPress }: { x: number; y: number; onPress: () => void }) => {
  return <TouchableOpacity style={[styles.marker, { left: x, top: y }]} onPress={onPress} />;
};

const JobScreen = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [maps, setMaps] = useState<any>([]); // State to store maps
  const [generalHazardData1, setGeneralHazardData] = useState<any>([]); // State to store general hazards
  const [showPdf, setShowPdf] = useState(false); // State to show or hide pdf
  const [selectedMapId, setSelectedMapId] = useState<any>(null); // State to store selected map
  const mapsCollection = useQuery(Maps);
  const generalHazards = useQuery(GeneralHazards);
  const hazards = useQuery(Hazards);
  const app = useApp();
  const user = useUser();
  const [isLoading, setIsLoading] = useState(true); // State to track initial load
  const selectedMap = maps.find((map: any) => map._id === selectedMapId);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: true });
  }, [navigation]);

  useEffect(() => {
    const sync = async () => {
      const syncResult = await syncFiles(app.currentUser?.customData);
      if (syncResult) {
        setIsLoading(false);
      }
    };
    sync();
  }, [app.currentUser?.customData]);

  useEffect(() => {
    if (!mapsCollection) return; // Ensure mapsCollection has data

    const parsedMaps = mapsCollection
      .filter((map) => {
        return map._account === user.customData._account;
      })
      .map((map) => {
        // Parse the 'points' property of each map
        let parsedPoints = [];
        try {
          if (map.points.length > 0) {
            parsedPoints = JSON.parse(map.points);
          }
        } catch (error) {
          console.error('Error parsing points:', error);
        }

        // Convert the ObjectId to a string
        const stringId = map._id.toString();

        // Return a new map object with parsed points and stringId
        return {
          ...map,
          points: parsedPoints,
          _id: stringId, // Convert _id to string
        };
      });

    // Update the 'maps' state with the parsed data
    console.log('updated my ufuufufu', parsedMaps);
    setMaps(parsedMaps);
  }, [mapsCollection, user.customData._account]);

  const handleButtonPress = (map: any) => {
    setSelectedMapId(map._id);
    setShowPdf(true);
  };

  //used to load map
  useEffect(() => {
    if (maps.length > 0 && selectedMapId === null) {
      setSelectedMapId(maps[0]._id);
      setShowPdf(true);
    }
  }, [maps, selectedMapId]);

  useEffect(() => {
    if (!generalHazards) return;

    generalHazards
      .filter((gh) => {
        return gh._account === user.customData._account;
      })
      .map((gh: any) => {
        try {
          const filteredHazards = hazards
            .filter((hazard) => {
              return gh.hazards.includes(hazard.id);
            })
            .sort((a, b) => {
              const idA = a.id;
              const idB = b.id;

              if (idA < idB) {
                return -1;
              }
              if (idA > idB) {
                return 1;
              }
              return 0;
            });

          setGeneralHazardData(filteredHazards);
        } catch (err) {
          console.error('Error has occured while parsing General Hazards', err);
        }
      });
  }, [generalHazards, hazards, user.customData._account]);

  const statusBarStyle = 'light-content';
  const statusBarBackgroundColor = isDarkMode ? '#111' : '#0c3424';

  if (isLoading) {
    return (
      <View
        style={[
          { flex: 1, justifyContent: 'center', alignItems: 'center' },
          isDarkMode ? styles.containerDark : styles.containerLight,
        ]}>
        <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#0c3424'} />
        <Text style={isDarkMode ? styles.loadingDark : styles.loadingLight}>Loading...</Text>
      </View>
    );
  }

  const renderMapButton = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.pdfButton, { backgroundColor: isDarkMode ? 'grey' : '#0c3424' }]}
      onPress={() => handleButtonPress(item)}>
      <Text
        style={[
          isDarkMode ? styles.buttonTextDark : styles.headerTextLight,
          { fontSize: 12, fontWeight: 'bold' },
        ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={isDarkMode ? styles.darkmode : styles.lightBackground}>
      <View style={{ marginTop: 40 }}>
        <View style={[styles.buttonContainer, isDarkMode && styles.containerDark]}>
          <View style={styles.buttonRow}>
            <Text
              style={[
                styles.currentMaps,
                isDarkMode ? styles.buttonTextDark : styles.buttonTextLight,
              ]}>
              Maps
            </Text>
            {maps.length > 0 ? (
              <FlatList
                data={maps}
                renderItem={renderMapButton}
                keyExtractor={(item) => item._id}
                horizontal
                contentContainerStyle={styles.buttonContainerRow}
              />
            ) : (
              <Text style={isDarkMode ? styles.labelDark : styles.labelLight}>No Maps Found.</Text>
            )}
          </View>
        </View>
        <View>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            {showPdf && selectedMapId && (
              <ReactNativeZoomableView
                maxZoom={5}
                minZoom={1}
                zoomStep={0.5}
                initialZoom={1}
                contentHeight={1400}>
                <PDFViewer
                  uri={selectedMap.map}
                  points={selectedMap.points}
                  generalHazard={generalHazardData1}
                  isLoadingJob={isLoading}
                />
              </ReactNativeZoomableView>
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const PDFViewer = ({
  uri,
  points,
  generalHazard,
  isLoadingJob,
}: {
  uri: any;
  points: Point[];
  generalHazard: HazardProps[];
  isLoadingJob: any;
}) => {
  const [pdfPath, setPdfPath] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showCrewModal, setCrewShowModal] = useState(false);
  const [showCrewPersonModal, setCrewPersonShowModal] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<Point | null>(null);
  const [selectedFile, setSelectedFile] = useState<any>('');
  const [selectedCrewMember, setSelectedCrewMember] = useState<{
    [crewName: string]: any[];
  }>();
  const [selectedPerson, setSelectedPerson] = useState<any>(null);
  const [showHazardModal, setHazardModal] = useState(false);
  const [selectedHazards, setSelectedHazards] = useState([]);
  const [hazards, setHazards] = useState<any>(null);
  const [getCrew, setCrew] = useState<any>(null);
  const [accessLevelAdmin, setAccessLevelAdmin] = useState<any>('off');
  const [accessLevelForeman, setAccessLevelForeman] = useState<any>('off');

  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [siteHazards, setSiteHazards] = useState<any>(null);
  const [cutPlans, setCutPlans] = useState<any>(null);
  const [retryCount, setRetryCount] = useState(0);

  const currentPerson = useQuery(People);
  const filesCollection = useQuery(File);
  const hazardsCollection = useQuery(Hazards);

  const app = useApp();

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const defaultProfileImage = require('../../assets/images/defaultprofile.png');

  const maxRetryCount = 5; // Maximum number of retry attempts
  const retryInterval = 3000; // Retry every 3 seconds (adjust as needed)

  const handleLoadError = (error: any) => {
    console.log('PDF load error:', error);

    if (retryCount < maxRetryCount) {
      // If we haven't reached the maximum retry count, retry loading the PDF
      console.log('Retrying PDF load...');
      // Use a functional update to ensure the state change triggers a re-render
      setRetryCount((prevRetryCount) => prevRetryCount + 1);
    } else {
      console.log('Max retry count reached. Unable to load the PDF.');
    }
  };

  useEffect(() => {
    selectedMarker?.info.siteHazards.map((hazard) => {
      try {
        const filteredHazards = hazardsCollection
          .filter((hazard: any) => {
            return selectedMarker.info.siteHazards.includes(hazard.id);
          })
          .sort((a, b) => {
            const idA = a.id;
            const idB = b.id;

            if (idA < idB) {
              return -1;
            }
            if (idA > idB) {
              return 1;
            }
            return 0;
          });

        setSiteHazards(filteredHazards);
      } catch (err) {
        console.error('Error has occured while parsing General Hazards', err);
      }
    });
  }, [hazardsCollection, selectedMarker]);

  useEffect(() => {
    try {
      setCutPlans(selectedMarker?.info.cutPlans);
    } catch (err) {
      console.error('Error occurred while getting cut plan', err);
    }
  }, [selectedMarker]);

  useEffect(() => {
    if (retryCount < maxRetryCount) {
      // Set up a timer to trigger retries
      const retryTimer = setInterval(() => {
        console.log('Retrying PDF load...');
        // Use a functional update to ensure the state change triggers a re-render
        setRetryCount((prevRetryCount) => prevRetryCount + 1);
      }, retryInterval);

      // Clear the retry timer if the component unmounts, or when max retries are reached
      return () => {
        clearInterval(retryTimer);
      };
    }
  }, [retryCount, maxRetryCount, retryInterval]);

  useEffect(() => {
    const fetchPdf = async () => {
      const folderPath = `${FileSystem.documentDirectory}files`;
      const url = uri; // Assuming uri is defined in your scope
      const filePath = `${folderPath}${url}`;

      const checkFileExists = async () => {
        try {
          const fileInfo = await FileSystem.getInfoAsync(filePath);
          if (fileInfo.exists) {
            // If the file exists, set the PDF
            setPdfPath(filePath);
          } else {
            // Optionally, handle the case where the file doesn't exist
            console.log('File does not exist.');
          }
        } catch (error) {
          console.error('Error checking file existence:', error);
        }
      };

      // Start checking for the file's existence
      checkFileExists();

      // TODO: Fix setCrew
      try {
        const crew = (await SecureStore.getItemAsync('crew')) || '';
        setCrew(app.currentUser?.customData.crew || JSON.parse(crew));
      } catch (error) {
        console.error('Error fetching crew data:', error);
      }
    };

    fetchPdf();
  }, [app.currentUser?.customData.crew, uri]);

  const handleMarkerPress = (marker: Point) => {
    setSelectedMarker((prevMarker) => {
      if (prevMarker && prevMarker.info.pointName === marker.info.pointName) {
        setShowModal((prevShowModal) => !prevShowModal);
        return prevMarker; // Keep the previous selected marker
      } else {
        setShowModal(true);
        return marker;
      }
    });
  };

  useEffect(() => {
    if (selectedMarker) {
      setShowModal(true);
    }
  }, [selectedMarker]);

  useEffect(() => {
    if (!hazardsCollection) return; // Ensure mapsCollection has data

    const parsedMaps = hazardsCollection.map((hazard) => {
      // Parse the 'points' property of each map
      let parsedHarms = [];
      try {
        parsedHarms = JSON.parse(hazard.harms);
      } catch (error) {
        console.error('Error parsing points:', error);
      }

      // Convert the ObjectId to a string
      const stringId = hazard._id.toString();

      // Return a new map object with parsed points and stringId
      return {
        ...hazard,
        harms: parsedHarms,
        _id: stringId, // Convert _id to string
      };
    });

    // Update the 'maps' state with the parsed data
    setHazards(parsedMaps);
  }, [hazardsCollection]);

  useEffect(() => {
    const deviceString = app.currentUser?.customData.device as string | undefined;

    if (deviceString) {
      try {
        const parsedDevice = JSON.parse(deviceString);
        // Check if 'device' is an object (not null or undefined)
        if (parsedDevice && parsedDevice.accessLevelAdmin === 'on') {
          setAccessLevelAdmin('on');
          setAccessLevelForeman('off');
        } else if (parsedDevice && parsedDevice.accessLevelForeman === 'on') {
          setAccessLevelForeman('on');
          setAccessLevelAdmin('off');
        } else if (parsedDevice && parsedDevice.accessLevelNormal === 'on') {
          setAccessLevelForeman('off');
          setAccessLevelAdmin('off');
        }
      } catch (error) {
        console.error('Error parsing device JSON:', error);
      }
    }
  }, [app.currentUser?.customData.device]);

  const markers = points.map((marker, index) => {
    const { originalWidth, originalHeight } = marker.point;
    console.log('ORIGINALHEIGHT: ', originalHeight);
    console.log('ORIGINALWIDTH: ', originalWidth);
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    console.log('SCREENHEIGHT: ', screenHeight);
    console.log('SCREENWIDTH: ', screenWidth);
    const screenAspectRatio = screenWidth / screenHeight;
    const markerAspectRatio = originalWidth / originalHeight;
    let x, y;

    if (markerAspectRatio > screenAspectRatio) {
      const scaleFactor = screenWidth / originalWidth;
      console.log(scaleFactor);
      const scaledHeight = originalHeight * scaleFactor;
      const verticalMargin = (screenHeight - scaledHeight) / 2;
      x = marker.point.x * scaleFactor;
      y = marker.point.y * scaleFactor + verticalMargin;
    } else {
      const scaleFactor = screenHeight / originalHeight;
      const scaledWidth = originalWidth * scaleFactor;
      const horizontalMargin = (screenWidth - scaledWidth) / 2;
      x = marker.point.x * scaleFactor + horizontalMargin;
      y = marker.point.y * scaleFactor;
    }

    const filteredCrews =
      getCrew === 'Health and Safety' ||
      getCrew === 'Office' ||
      getCrew === 'Unassigned' ||
      marker.info.crews.includes(getCrew);

    // Render the marker only if it satisfies the crew condition
    if (
      getCrew === 'Unassigned' ||
      getCrew === 'Health and Safety' ||
      getCrew === 'Office' ||
      filteredCrews
    ) {
      return (
        <Marker
          key={index}
          x={x - 5}
          y={y + 10} //160
          onPress={() => handleMarkerPress(marker)}
        />
      );
    }
    return null;
  });

  async function handleHazardPress(hazardNames: any) {
    try {
      const data = hazards;
      if (data) {
        const filteredHazards = hazards.filter((hazard: { id: HazardProps }) =>
          hazardNames.includes(hazard.id),
        );
        setSelectedHazards(filteredHazards);
        setHazardModal(true);
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error reading data from file:', error);
    }

    return (
      <View>
        <HazardContainer hazards={selectedHazards} />
      </View>
    );
  }

  async function handleGeneralHazardPress(hazardNames: any) {
    setShowModal(false);
    setHazardModal(true);
    let parsedData: any = null;
    try {
      parsedData = hazards;
    } catch (error) {
      console.error('Error reading data from file:', error);
    }

    if (parsedData) {
      const filteredHazards = hazards.filter(
        (hazard: { id: HazardProps }) => hazard.id === hazardNames.id,
      );
      setSelectedHazards(filteredHazards);
    }
  }

  async function handleDocumentPress(uri: string) {
    const filePath = `${FileSystem.documentDirectory}/files${uri}`;

    try {
      // Check if the file exists
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      if (fileInfo.exists) {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(filePath, {
            dialogTitle: 'Open Document',
          });
          console.log('File opened successfully');
        } else {
          console.log('Sharing is not available on this device');
        }
      } else {
        console.error('File does not exist');
      }
    } catch (error) {
      console.error('Failed to open the file:', error);
    }
  }

  async function handleCutPlanFilePress(base64String: any) {
    const fileName = 'tempcutplanfile.pdf';
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    try {
      // Writing the base64 string to a file
      await FileSystem.writeAsStringAsync(filePath, base64String, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Check if the file exists and open it
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      if (fileInfo.exists) {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(filePath, {
            dialogTitle: 'Open PDF',
          });
          console.log('File opened successfully');
        } else {
          console.log('Sharing is not available on this device');
        }
      } else {
        console.log('File does not exist');
      }
    } catch (error) {
      console.error('Failed to open or remove the file:', error);
    }
  }
  const handleFileSelection = async (crewMemberId: string) => {
    try {
      const filesForCrewMember = filesCollection.filter(
        // eslint-disable-next-line eqeqeq
        (file: any) => file.owner.toString() == crewMemberId,
      );
      const crewMemberData = currentPerson.filter(
        // eslint-disable-next-line eqeqeq
        (person: any) => person._id.toString() == crewMemberId,
      );
      const folderPath = `${FileSystem.documentDirectory}/files`;
      const filePath = `${folderPath}${crewMemberData[0].imgUrl}`;
      const imageUrl = crewMemberData[0].imgUrl;
      console.log('this si the file path for the image bnro ,auy', filePath);
      if (imageUrl === '/img/default.jpg') {
        setSelectedImage(null);
      } else {
        setSelectedImage(filePath);
      }
      setSelectedPerson(crewMemberData[0]);
      setSelectedFile(filesForCrewMember);
      setCrewPersonShowModal(true);
      setCrewShowModal(false);
    } catch (error) {
      console.error('Failed to fetcg files for crew member', error);
    }
  };

  const darkMode = isDarkMode ? styles.textInputDark : styles.textLight;

  return (
    <View>
      <View
        style={[
          isDarkMode ? styles.darkmode : styles.lightBackground,
          {
            flex: 1,
            position: 'relative',
            justifyContent: 'flex-start',
            alignItems: 'center' /* , maxHeight: max */,
          },
        ]}>
        <HazardInfoModal
          showHazardModal={showHazardModal}
          selectedHazards={selectedHazards}
          showModal={showModal}
          setHazardModal={setHazardModal}
          setShowModal={setShowModal}
        />

        <CrewInfoModal
          showCrewModal={showCrewModal}
          setCrewShowModal={setCrewShowModal}
          selectedCrewMember={selectedCrewMember}
          handleFileSelection={handleFileSelection}
          setShowModal={setShowModal}
        />

        <SkidInfoModal
          showModal={showModal}
          setShowModal={setShowModal}
          selectedMarker={selectedMarker}
          accessLevelAdmin={accessLevelAdmin}
          accessLevelForeman={accessLevelForeman}
          currentPerson={currentPerson}
          setSelectedCrewMember={setSelectedCrewMember}
          setCrewShowModal={setCrewShowModal}
          cutPlans={cutPlans}
          handleCutPlanFilePress={handleCutPlanFilePress}
          siteHazards={siteHazards}
          handleHazardPress={handleHazardPress}
          generalHazard={generalHazard}
          handleGeneralHazardPress={handleGeneralHazardPress}
        />

        <PersonInfoModal
          showCrewPersonModal={showCrewPersonModal}
          setCrewPersonShowModal={setCrewPersonShowModal}
          selectedPerson={selectedPerson}
          selectedImage={selectedImage}
          defaultProfileImage={defaultProfileImage}
          accessLevelAdmin={accessLevelAdmin}
          accessLevelForeman={accessLevelForeman}
          selectedFile={selectedFile}
          setCrewShowModal={setCrewShowModal}
        />

        <View style={[styles.PDFContainer, { bottom: 120 }]}>
          {pdfPath ? ( // Check if pdf is not null or empty
            <Pdf
              source={{ uri: pdfPath }}
              scale={1}
              singlePage={true}
              onError={handleLoadError}
              style={[
                isDarkMode ? styles.darkmode : styles.lightBackground,
                {
                  width: Dimensions.get('window').width + 0,
                  height: Dimensions.get('window').height + 50,
                  top: 0,
                  left: 0,
                },
              ]}
            />
          ) : retryCount < maxRetryCount ? ( // Render a loading state if retries are still allowed
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text>Loading PDF...</Text>
            </View>
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text>Unable to load the PDF after {maxRetryCount} attempts.</Text>
            </View>
          )}

          {pdfPath && markers}
        </View>
      </View>
    </View>
  );
};

export default JobScreen;

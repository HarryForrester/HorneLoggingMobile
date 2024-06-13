import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

import PDFViewer from '@/components/PDFViewer';
import syncFiles from '@/services/syncFiles';
import ReactNativeZoomableView from '@openspacelabs/react-native-zoomable-view/src/ReactNativeZoomableView';
import { useApp, useQuery, useUser } from '@realm/react';
import { useNavigation } from 'expo-router';
import styles from '../../constants/Styles';
import GeneralHazards from '../../schemas/GeneralHazards';
import { Hazards } from '../../schemas/Hazards';
import Maps from '../../schemas/Maps';

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
                />
              </ReactNativeZoomableView>
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default JobScreen;

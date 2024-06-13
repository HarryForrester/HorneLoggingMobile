import styles from '@/constants/Styles';
import handleDocumentPress from '@/utils/documentFunctions';
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  selectedMarker: any;
  accessLevelAdmin: string;
  accessLevelForeman: string;
  currentPerson: any;
  setSelectedCrewMember: (member: any) => void;
  setCrewShowModal: (showModal: boolean) => void;
  cutPlans: any;
  handleCutPlanFilePress: (file: string) => void;
  siteHazards: any;
  handleHazardPress: (file: string) => void;
  generalHazard: any;
  handleGeneralHazardPress: (file: string) => void;
}

const SkidInfoModal: React.FC<Props> = ({
  showModal,
  setShowModal,
  selectedMarker,
  accessLevelAdmin,
  accessLevelForeman,
  currentPerson,
  setSelectedCrewMember,
  setCrewShowModal,
  cutPlans,
  handleCutPlanFilePress,
  siteHazards,
  handleHazardPress,
  generalHazard,
  handleGeneralHazardPress,
}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  async function handleCrewMemberPress(item1: {
    _id: string;
    name: string;
    role: string;
  }): Promise<void> {
    const crews: { [crewName: string]: any[] } = {};
    try {
      currentPerson.forEach((item: any) => {
        if (item.archive === 'on' || item.crew !== item1) return;

        const crewName = item.crew;
        if (!crews.hasOwnProperty(crewName)) {
          crews[crewName] = [];
        }
        crews[crewName].push(item);
      });
    } catch (error) {
      console.error('Error: ', error);
    }

    setSelectedCrewMember(crews);
    setCrewShowModal(true);
    setShowModal(false);
  }

  return (
    <Modal visible={showModal} onRequestClose={() => setShowModal(false)} transparent>
      <View style={styles.modalContainer}>
        <View
          style={[
            styles.modalHeader,
            isDarkMode ? styles.modalHeaderDark : styles.modalHeaderLight,
          ]}>
          <Text
            style={[
              styles.modalHeadingText,
              isDarkMode ? styles.buttonTextDark : styles.headerTextLight,
            ]}>
            Skid {String(selectedMarker?.info?.pointName)}
          </Text>
        </View>
        <View style={[styles.modalView, isDarkMode ? styles.darkmode : styles.lightBackground]}>
          <ScrollView>
            {(accessLevelAdmin === 'on' || accessLevelForeman === 'on') && (
              <>
                <Text
                  style={[
                    styles.modalHeadingText,
                    isDarkMode ? styles.labelDark : styles.labelLight,
                  ]}>
                  Crew:
                </Text>
                <View style={{ position: 'absolute', top: 10, left: 10 }}></View>
                <FlatList
                  scrollEnabled={false}
                  data={selectedMarker?.info.crews}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleCrewMemberPress(item)}>
                      <Text
                        style={[
                          styles.listItem,
                          isDarkMode ? styles.labelDark : styles.labelLight,
                        ]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </>
            )}

            {(accessLevelAdmin === 'on' || accessLevelForeman === 'on') && (
              <>
                <Text
                  style={[
                    styles.modalHeadingText,
                    isDarkMode ? styles.labelDark : styles.labelLight,
                  ]}>
                  Docs
                </Text>
                <FlatList
                  scrollEnabled={false}
                  data={selectedMarker?.info.selectedDocuments}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleDocumentPress(item.uri)}>
                      <Text
                        style={[
                          styles.listItem,
                          isDarkMode ? styles.labelDark : styles.labelLight,
                        ]}>{`${item.fileName}: `}</Text>
                    </TouchableOpacity>
                  )}
                />
              </>
            )}

            <Text
              style={[styles.modalHeadingText, isDarkMode ? styles.labelDark : styles.labelLight]}>
              Weekly Cut Plan
            </Text>
            <FlatList
              scrollEnabled={false}
              data={cutPlans}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleCutPlanFilePress(item.base64String)}>
                  <Text
                    style={[
                      styles.listItem,
                      isDarkMode ? styles.labelDark : styles.labelLight,
                    ]}>{`${item.fileName}: `}</Text>
                </TouchableOpacity>
              )}
            />
            <Text
              style={[styles.modalHeadingText, isDarkMode ? styles.labelDark : styles.labelLight]}>
              Skid Hazards
            </Text>
            <FlatList
              scrollEnabled={false}
              data={siteHazards}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleHazardPress(item.id)}>
                  <Text
                    style={[
                      styles.listItem,
                      isDarkMode ? styles.labelDark : styles.labelLight,
                    ]}>{`${item.id}: ${item.title}`}</Text>
                </TouchableOpacity>
              )}
            />

            <Text
              style={[styles.modalHeadingText, isDarkMode ? styles.labelDark : styles.labelLight]}>
              General Hazards
            </Text>
            <FlatList
              scrollEnabled={false}
              data={generalHazard}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleGeneralHazardPress(item)}>
                  <Text
                    style={[
                      styles.listItem,
                      isDarkMode ? styles.labelDark : styles.labelLight,
                    ]}>{`${item.id}: ${item.title}`}</Text>
                </TouchableOpacity>
              )}
            />
          </ScrollView>
          <Pressable
            style={[
              styles.button,
              styles.buttonClose,
              isDarkMode ? styles.buttonBackgroundDark : styles.buttonBackgroundLight,
            ]}
            onPress={() => setShowModal(false)}>
            <Text
              style={[
                styles.textClose,
                isDarkMode ? styles.textInputDark : styles.headerTextLight,
              ]}>
              Close
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default SkidInfoModal;
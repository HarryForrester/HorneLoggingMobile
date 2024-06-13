import styles from '@/constants/Styles';
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

interface Props {
  showCrewModal: boolean;
  setCrewShowModal: (show: boolean) => void;
  selectedCrewMember: any;
  handleFileSelection: (file: string) => void;
  setShowModal: (show: boolean) => void;
}

const CrewInfoModal: React.FC<Props> = ({
  showCrewModal,
  setCrewShowModal,
  selectedCrewMember,
  handleFileSelection,
  setShowModal,
}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <Modal
      visible={showCrewModal}
      onRequestClose={() => setCrewShowModal(false)}
      transparent
      animationType="fade">
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
            Crew Info
          </Text>
        </View>
        <View style={[styles.modalView, isDarkMode ? styles.darkmode : styles.lightBackground]}>
          {selectedCrewMember &&
            Object.entries(selectedCrewMember).map(([crewName, crewMembers]: any) => {
              if (crewName) {
                return (
                  <View key={crewName}>
                    <Text
                      style={[
                        styles.modalTextBold,
                        isDarkMode ? styles.buttonTextDark : styles.buttonTextLight,
                        { fontSize: 20 },
                      ]}>
                      Crew: {crewName}
                    </Text>
                    <FlatList
                      style={{ maxHeight: 170 }} // Adjust the maximum height as needed
                      scrollEnabled={true}
                      data={crewMembers}
                      keyExtractor={(item) => item._id}
                      renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleFileSelection(item._id)}>
                          <Text
                            style={[
                              styles.listItem,
                              isDarkMode ? styles.buttonTextDark : styles.buttonTextLight,
                            ]}>
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                );
              } else {
                return null;
              }
            })}
          <Pressable
            style={[
              styles.button,
              styles.buttonClose,
              isDarkMode ? styles.buttonBackgroundDark : styles.buttonBackgroundLight,
            ]}
            onPress={() => {
              setCrewShowModal(false);
              setShowModal(true);
            }}>
            <Text
              style={[
                styles.textClose,
                isDarkMode ? styles.buttonTextDark : styles.headerTextLight,
              ]}>
              Close
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default CrewInfoModal;

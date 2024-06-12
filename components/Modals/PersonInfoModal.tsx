import styles from '@/constants/Styles';
import handleDocumentPress from '@/utils/documentFunctions';
import {
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Int32 } from 'react-native/Libraries/Types/CodegenTypes';

interface Props {
  showCrewPersonModal: boolean;
  setCrewPersonShowModal: (show: boolean) => void;
  isDarkMode: boolean;
  selectedPerson: Person;
  selectedImage: string;
  defaultProfileImage: any;
  accessLevelAdmin: any;
  accessLevelForeman: any;
  selectedFile: any;
  setCrewShowModal: (show: boolean) => void;
}

interface Person {
  _account: Int32;
  name: string;
  crew: string;
  imgUrl: string;
  address: string;
  contact: string;
  contactphone: string;
  dob: string;
  doctor: string;
  medical: string;
  phone: string;
  role: string;
  startDate: string;
  email: string;
  archieve: string;
  idType: string;
}

const PersonInfoModal: React.FC<Props> = ({
  showCrewPersonModal,
  setCrewPersonShowModal,
  isDarkMode,
  selectedPerson,
  selectedImage,
  defaultProfileImage,
  accessLevelAdmin,
  accessLevelForeman,
  selectedFile,
  setCrewShowModal,
}) => {
  const darkMode = isDarkMode ? styles.textInputDark : styles.textLight;

  return (
    <Modal
      visible={showCrewPersonModal}
      onRequestClose={() => setCrewPersonShowModal(false)}
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
            {selectedPerson?.name}
          </Text>
        </View>
        <View style={[styles.modalView, isDarkMode ? styles.darkmode : styles.lightBackground]}>
          <ScrollView>
            <View style={{ padding: 10 }}>
              <View style={styles.personDetailRow}>
                <View style={styles.personImageContainer}>
                  <Image
                    style={styles.personImage}
                    source={
                      selectedImage ? { uri: `file://${selectedImage}` } : defaultProfileImage
                    }
                  />
                </View>
              </View>
              <View style={styles.personDetailRow}>
                <Text style={[styles.personDetailLabel, darkMode]}>Role:</Text>
                <Text style={[styles.personDetailValue, darkMode]}>
                  {selectedPerson?.role || 'N/A'}
                </Text>
              </View>
              <View style={styles.personDetailRow}>
                <Text style={[styles.personDetailLabel, darkMode]}>Address:</Text>
                <Text style={[styles.personDetailValue, darkMode]}>
                  {selectedPerson?.address || 'N/A'}
                </Text>
              </View>
              <View style={styles.personDetailRow}>
                <Text style={[styles.personDetailLabel, darkMode]}>Phone:</Text>
                <TouchableOpacity onPress={() => Linking.openURL(`tel:${selectedPerson?.phone}`)}>
                  <Text style={[styles.personDetailValue, darkMode]}>
                    {selectedPerson?.phone || 'N/A'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.personDetailRow}>
                <Text style={[styles.personDetailLabel, darkMode]}>Alt Contact:</Text>
                <Text style={[styles.personDetailValue, darkMode]}>
                  {selectedPerson?.contact || 'N/A'}
                </Text>
              </View>
              <View style={styles.personDetailRow}>
                <Text style={[styles.personDetailLabel, darkMode]}>Alt Contact Phone:</Text>
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel:${selectedPerson?.contactphone}`)}>
                  <Text style={[styles.personDetailValue, darkMode]}>
                    {selectedPerson?.contactphone || 'N/A'}
                  </Text>
                </TouchableOpacity>
              </View>

              {(accessLevelAdmin === 'on' || accessLevelForeman === 'on') && (
                <View style={styles.personDetailRow}>
                  <Text style={[styles.personDetailLabel, darkMode]}>DOB:</Text>
                  <Text style={[styles.personDetailValue, darkMode]}>
                    {selectedPerson?.dob || 'N/A'}
                  </Text>
                </View>
              )}
              {(accessLevelAdmin === 'on' || accessLevelForeman === 'on') && (
                <View style={styles.personDetailRow}>
                  <Text style={[styles.personDetailLabel, darkMode]}>Doctor:</Text>
                  <Text style={[styles.personDetailValue, darkMode]}>
                    {selectedPerson?.doctor || 'N/A'}
                  </Text>
                </View>
              )}
              {(accessLevelAdmin === 'on' || accessLevelForeman === 'on') && (
                <View style={styles.personDetailRow}>
                  <Text style={[styles.personDetailLabel, darkMode]}>Id Type:</Text>
                  <Text style={[styles.personDetailValue, darkMode]}>
                    {selectedPerson?.idType || 'N/A'}
                  </Text>
                </View>
              )}
              {(accessLevelAdmin === 'on' || accessLevelForeman === 'on') && (
                <View style={styles.personDetailRow}>
                  <Text style={[styles.personDetailLabel, darkMode]}>Medical:</Text>
                  <Text style={[styles.personDetailValue, darkMode]}>
                    {selectedPerson?.medical || 'N/A'}
                  </Text>
                </View>
              )}
              {(accessLevelAdmin === 'on' || accessLevelForeman === 'on') && (
                <View style={styles.personDetailRow}>
                  <Text style={[styles.personDetailLabel, darkMode]}>Start Date:</Text>
                  <Text style={[styles.personDetailValue, darkMode]}>
                    {selectedPerson?.startDate || 'N/A'}
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
                        <View style={styles.fileContainer}>
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
              onPress={() => {
                setCrewPersonShowModal(false);
                setCrewShowModal(true);
              }}>
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
  );
};

export default PersonInfoModal;

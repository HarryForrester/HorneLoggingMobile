import styles from '@/constants/Styles';
import { Modal, ScrollView, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import HazardContainer from '../HazardContainer';

interface Props {
  showHazardModal: boolean;
  selectedHazards: any;
  showModal: boolean;
  setHazardModal: (value: boolean) => void;
  setShowModal: (value: boolean) => void;
}

const HazardInfoModal: React.FC<Props> = ({
  showHazardModal,
  setHazardModal,
  selectedHazards,
  setShowModal,
  showModal,
}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  return (
    <Modal
      visible={showHazardModal}
      onRequestClose={() => setHazardModal(false)}
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
            Hazards
          </Text>
        </View>
        <View style={[styles.modalView, isDarkMode ? styles.darkmode : styles.lightBackground]}>
          <ScrollView>
            <HazardContainer hazards={selectedHazards} />
          </ScrollView>
          <View style={styles.closeButtonPadding}>
            <TouchableOpacity
              style={[
                styles.buttonClose,
                isDarkMode ? styles.buttonBackgroundDark : styles.buttonBackgroundLight,
              ]}
              onPress={() => {
                setShowModal(!showModal);
                setHazardModal(!showHazardModal);
              }}>
              <Text
                style={[
                  styles.textClose,
                  isDarkMode ? styles.buttonTextDark : styles.headerTextLight,
                ]}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default HazardInfoModal;

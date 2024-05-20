import TimeSheet from '@/schemas/TimeSheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useApp, useRealm } from '@realm/react';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Realm from 'realm';
import styles from '../../constants/Styles';
interface Props {
  isTimeSheetModalVisible: boolean;
  closeTimeSheetModal: any;
  people: [];
  setPeople: any;
}

const TimeSheetModal: React.FC<Props> = ({
  isTimeSheetModalVisible,
  closeTimeSheetModal,
  people,
  setPeople,
}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [date, setDate] = useState(new Date());
  const [dateOpen, setDateOpen] = useState(false);
  const [hoursValue, setHoursValue] = useState('');
  const [commentsValue, setCommentsValue] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<any>([]);
  const app = useApp();

  const [open, setOpen] = useState(false);

  const realm = useRealm();

  const onDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setDateOpen(false);
    setDate(currentDate);
  };

  /**
   * handles the submission of timesheets to realm
   */
  const handleSubmit = () => {
    console.log('handleSubmit');
    const currentDate = new Date(date);

    // Get the individual components of the date
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');

    // Format the date as "YYYY-MM-DD"
    const formattedDate = `${year}-${month}-${day}`;

    const timeSheetData = {
      name: selectedPerson,
      hours: hoursValue,
      comments: commentsValue,
    };

    handleAddTimeSheet(formattedDate, timeSheetData);
    setDate(currentDate);
    setSelectedPerson([]);
    closeTimeSheetModal();
    Alert.alert(`Submitted!`);
  };
  const handleAddTimeSheet = async (date: any, data: any) => {
    const userAccount = app.currentUser?.customData._account;
    const crew = app.currentUser?.customData.crew;

    console.log('userAccount: ' + userAccount);
    console.log('crew: ' + crew);

    try {
      if (typeof userAccount === 'number' && typeof crew === 'string') {
        realm.write(() => {
          realm.create(TimeSheet, {
            _id: new Realm.BSON.ObjectId(),
            _account: userAccount,
            date: date,
            data: JSON.stringify(data),
            crew: crew,
          });
        });
      }
    } catch (error) {
      console.error('Error sending form to database', error);
    }
  };
  return (
    <Modal visible={isTimeSheetModalVisible} onRequestClose={closeTimeSheetModal} transparent>
      <View style={styles.formModalContainer}>
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
            Time Sheet
          </Text>
        </View>
        <View style={[styles.modalView, isDarkMode ? styles.darkmode : styles.normal]}>
          {/*           <ScrollView>
           */}
          <View style={stylesheet.multiselectContainer}>
            {/* <MultipleSelectList
                setSelected={(val: React.SetStateAction<{ value: string; label: string }>) =>
                  setSelectedPerson(val)
                }
                data={people}
                save="value"
                inputStyles={isDarkMode ? styles.buttonTextDark : styles.buttonTextLight}
                dropdownTextStyles={isDarkMode ? styles.buttonTextDark : styles.buttonTextLight}
                boxStyles={{
                  ...(isDarkMode ? styles.listViewDark : styles.listViewLight),
                  backgroundColor: 'white',
                }}
                dropdownStyles={{ backgroundColor: 'white' }}
                badgeStyles={{ backgroundColor: '#0c3424' }}
                label="Selected Employees"
                placeholder="Select Employees"
                labelStyles={{ paddingBottom: 11 }}
              /> */}
            <DropDownPicker
              open={open}
              value={selectedPerson}
              items={people}
              setOpen={setOpen}
              setValue={setSelectedPerson}
              setItems={setPeople}
              multiple={true}
              min={0}
              placeholder="Select Employees"
              mode="BADGE"
            />
          </View>
          <View style={stylesheet.dateContainer}>
            <Text style={stylesheet.label}>Date:</Text>
            <TouchableOpacity
              style={[stylesheet.dateButton, { backgroundColor: isDarkMode ? 'grey' : 'white' }]}
              onPress={() => setDateOpen(true)}>
              <Text
                style={[
                  styles.dateButtonText,
                  isDarkMode ? styles.buttonTextDark : styles.buttonTextLight,
                ]}>
                {date.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          </View>
          {dateOpen && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              onChange={onDateChange}
              onTouchCancel={() => setDateOpen(false)} // This handles Android back button to close the picker
            />
          )}
          <View style={stylesheet.hoursContainer}>
            <Text style={stylesheet.label}>Hours:</Text>
            <TextInput
              style={[
                {
                  borderWidth: 1,
                  borderColor: 'gray',
                  borderRadius: 4,
                  padding: 10,
                  fontSize: 16,
                  width: '100%',
                  textAlign: 'center',
                  alignSelf: 'center',
                },
                isDarkMode ? styles.inputDark : styles.inputLight,
              ]}
              placeholder="Hours"
              placeholderTextColor={isDarkMode ? 'white' : '#241c23'}
              keyboardType="numeric"
              value={hoursValue}
              onChangeText={setHoursValue}
            />
          </View>
          <View style={stylesheet.commentsContainer}>
            <Text style={stylesheet.label}>Comments:</Text>
            <TextInput
              style={[
                {
                  borderWidth: 1,
                  borderColor: 'gray',
                  borderRadius: 4,
                  padding: 10,
                  fontSize: 16,
                  width: '100%',
                  textAlign: 'center',
                  alignSelf: 'center',
                },
                isDarkMode ? styles.inputDark : styles.inputLight,
              ]}
              placeholder="Comments"
              placeholderTextColor={isDarkMode ? 'white' : '#241c23'}
              value={commentsValue}
              onChangeText={setCommentsValue}
            />
          </View>
          {/*           </ScrollView>
           */}
          <View style={styles.buttonContainer1}>
            <Pressable
              style={[
                styles.button,
                styles.buttonClose,
                isDarkMode ? styles.buttonBackgroundDark : styles.buttonBackgroundLight,
              ]}
              onPress={closeTimeSheetModal}>
              <Text
                style={[
                  styles.textClose,
                  isDarkMode ? styles.textInputDark : styles.textInputLight,
                ]}>
                Close
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.button,
                styles.buttonClose,
                isDarkMode ? styles.buttonBackgroundDark : styles.buttonBackgroundLight,
              ]}
              onPress={handleSubmit}>
              <Text
                style={[
                  styles.textSubmit,
                  isDarkMode ? styles.textInputDark : styles.textInputLight,
                ]}>
                Submit
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const stylesheet = StyleSheet.create({
  multiselectContainer: {
    marginBottom: 10,
  },
  dateContainer: {
    width: '100%',
  },
  dateButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
    alignContent: 'center',
    alignSelf: 'center',
  },
  hoursContainer: {
    paddingTop: 10,
  },
  commentsContainer: {
    paddingTop: 10,
  },
  label: {
    fontWeight: 'bold',
  },
});

export default TimeSheetModal;

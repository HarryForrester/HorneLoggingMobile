import TimeSheet from '@/schemas/TimeSheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useApp, useRealm } from '@realm/react';
import { Formik } from 'formik';
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
import * as Yup from 'yup';
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
  const [selectedPerson, setSelectedPerson] = useState<any>([]);
  const app = useApp();
  const [open, setOpen] = useState(false);
  const realm = useRealm();

  const onDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setDateOpen(false);
    setDate(currentDate);
  };

  const handleAddTimeSheet = async (date: any, data: any) => {
    const userAccount = app.currentUser?.customData._account;
    const crew = app.currentUser?.customData.crew;

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

  const validationSchema = Yup.object().shape({
    hours: Yup.number().required('Hours are required').min(0, 'Hours must be a positive number'),
    selectedPerson: Yup.array().min(1, 'Select at least one person'),
  });

  const handleFormikSubmit =
    (handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void) => () => {
      handleSubmit();
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
        <View style={[styles.modalView, isDarkMode ? styles.darkmode : styles.lightBackground]}>
          <Formik
            initialValues={{ hours: '', comments: '', selectedPerson: [] }}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
              const formattedDate = date.toISOString().split('T')[0];
              const timeSheetData = {
                name: values.selectedPerson,
                hours: values.hours,
                comments: values.comments,
              };
              handleAddTimeSheet(formattedDate, timeSheetData);
              resetForm();
              closeTimeSheetModal();
              Alert.alert('Submitted!');
            }}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              values,
              errors,
              touched,
              resetForm,
            }) => (
              <>
                <View style={stylesheet.multiselectContainer}>
                  <DropDownPicker
                    open={open}
                    value={selectedPerson}
                    items={people}
                    setOpen={setOpen}
                    setValue={(value) => {
                      setSelectedPerson(value);
                    }}
                    onChangeValue={(value) => {
                      setFieldValue('selectedPerson', value);
                    }}
                    setItems={setPeople}
                    multiple={true}
                    min={0}
                    placeholder="Select Employees"
                    mode="BADGE"
                  />
                  {errors.selectedPerson && touched.selectedPerson ? (
                    <Text style={stylesheet.errorText}>{errors.selectedPerson}</Text>
                  ) : null}
                </View>
                <View style={stylesheet.dateContainer}>
                  <Text style={stylesheet.label}>Date:</Text>
                  <TouchableOpacity
                    style={[
                      stylesheet.dateButton,
                      { backgroundColor: isDarkMode ? 'grey' : 'white' },
                    ]}
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
                        borderColor: 'black',
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
                    onChangeText={handleChange('hours')}
                    onBlur={handleBlur('hours')}
                    value={values.hours}
                  />
                  {errors.hours && touched.hours ? (
                    <Text style={stylesheet.errorText}>{errors.hours}</Text>
                  ) : null}
                </View>
                <View style={stylesheet.commentsContainer}>
                  <Text style={stylesheet.label}>Comments:</Text>
                  <TextInput
                    style={[
                      {
                        borderWidth: 1,
                        borderColor: 'black',
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
                    onChangeText={handleChange('comments')}
                    onBlur={handleBlur('comments')}
                    value={values.comments}
                  />
                  {errors.comments && touched.comments ? (
                    <Text style={stylesheet.errorText}>{errors.comments}</Text>
                  ) : null}
                </View>
                <View style={styles.buttonContainer1}>
                  <Pressable
                    style={[
                      styles.button,
                      styles.buttonClose,
                      isDarkMode ? styles.buttonBackgroundDark : styles.buttonBackgroundLight,
                    ]}
                    onPress={() => {
                      closeTimeSheetModal();
                      setSelectedPerson([]);
                    }}>
                    <Text
                      style={[
                        styles.textClose,
                        isDarkMode ? styles.textInputDark : styles.headerBackgroundTextInputLight,
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
                    onPress={handleFormikSubmit(handleSubmit)}>
                    <Text
                      style={[
                        styles.textSubmit,
                        isDarkMode ? styles.textInputDark : styles.headerBackgroundTextInputLight,
                      ]}>
                      Submit
                    </Text>
                  </Pressable>
                </View>
              </>
            )}
          </Formik>
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
    borderWidth: 1,
    borderColor: 'black',
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default TimeSheetModal;

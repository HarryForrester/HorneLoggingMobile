import DateTimePicker from '@react-native-community/datetimepicker';
import { useApp, useQuery, useRealm, useUser } from '@realm/react';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Yup from 'yup';
import styles from '../../constants/Styles';
import { OnJobTraining } from '../../schemas/OnJobTraining';
import People from '../../schemas/People';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  const formattedDate = date.toLocaleDateString(undefined, options);
  return formattedDate.replace(/\//g, '-');
}

const AddOnJobTrainingForm = ({ modalVisible, setModalVisible }: any) => {
  const [people, setPeople] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const user = useUser();
  const app = useApp();
  const realm = useRealm();

  const peopleCollection = useQuery(People);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  useEffect(() => {
    const fetchPeopleData = async () => {
      const filteredPeopleData = peopleCollection.filter(
        (person: any) => person._account === user.customData._account,
      );
      const formattedPeopleData = filteredPeopleData.map((person: any) => ({
        value: person.name,
        key: person._id,
      }));
      setPeople(formattedPeopleData);
    };

    fetchPeopleData();
  }, [peopleCollection, user.customData._account, app.currentUser?.customData.crew]);

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
      transparent>
      <View style={modalStyles.modalContainer}>
        <View style={modalStyles.modalContent}>
          <View
            style={[
              modalStyles.modalHeader,
              isDarkMode ? styles.modalHeaderDark : styles.modalHeaderLight,
            ]}>
            <Text
              style={[
                modalStyles.modalHeaderText,
                isDarkMode ? styles.buttonTextDark : styles.headerTextLight,
              ]}>
              On-Job Training Record
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={modalStyles.closeButton}>
              <Ionicons name="close" color="white" size={30} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={modalStyles.scrollViewContent}>
            <View style={modalStyles.modalBody}>
              <Formik
                initialValues={{
                  reportType: '',
                  date: new Date(),
                  user: '',
                  trainer: '',
                  talk: '',
                  talkTime: '',
                  show: '',
                  showTime: '',
                  look: '',
                  lookTime: '',
                  confirm: '',
                  confirmTime: '',
                  competence: '',
                }}
                validationSchema={Yup.object().shape({
                  reportType: Yup.string().required('Select Report Type is required'),
                  user: Yup.string().required('Select Trainne is required'),
                  competence: Yup.string().required('Select Competence is required'),
                })}
                onSubmit={(values, { resetForm }) => {
                  console.log('on submit', values);
                  const userAccount = app.currentUser?.customData._account;

                  try {
                    if (typeof userAccount === 'number') {
                      realm.write(() => {
                        realm.create(OnJobTraining, {
                          _id: new Realm.BSON.ObjectId(),
                          _account: userAccount,
                          date: values.date,
                          reportType: values.reportType,
                          user: values.user.toString(),
                          trainer: values.trainer,
                          talk: values.talk,
                          talkTime: values.talkTime,
                          show: values.show,
                          showTime: values.showTime,
                          look: values.look,
                          lookTime: values.lookTime,
                          confirm: values.confirm,
                          confirmTime: values.confirmTime,
                          competence: values.competence,
                        });
                      });

                      resetForm();
                      setModalVisible(false);
                    }
                  } catch (error) {
                    console.error('Error submitting on job training to server', error);
                  }
                }}>
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  setFieldValue,
                  values,
                  errors,
                  touched,
                }) => (
                  <View style={modalStyles.container}>
                    <Text>Select Report Types</Text>
                    <SelectList
                      setSelected={(selectedReportType: any) =>
                        setFieldValue('reportType', selectedReportType)
                      }
                      data={[
                        { label: 'Training/Assessment', value: 'Training/Assessment' },
                        { label: 'Induction', value: 'Induction' },
                        { label: 'Post-assessment Follow Up', value: 'Post-assessment Follow Up' },
                        { label: 'On/Off Job Training', value: 'On/Off Job Training' },
                        { label: 'Moderation/Auditing', value: 'Moderation/Auditing' },
                        { label: 'Trainer Development', value: 'Trainer Development' },
                      ]}
                      placeholder="Select a Report Type"
                    />
                    {errors.reportType && touched.reportType ? (
                      <Text style={{ color: 'red', marginBottom: 10 }}>{errors.reportType}</Text>
                    ) : null}
                    <Text>Trainee:</Text>
                    <SelectList
                      setSelected={(selectedPerson: any) => {
                        console.log('selected user: ', selectedPerson);
                        setFieldValue('user', selectedPerson);
                      }}
                      data={people}
                      placeholder="Select a Trainee"
                      save="key"
                    />
                    {errors.user && touched.user ? (
                      <Text style={{ color: 'red', marginBottom: 10 }}>{errors.user}</Text>
                    ) : null}

                    <Text>Date:</Text>
                    <TouchableOpacity
                      style={modalStyles.dateButton}
                      onPress={() => setShowDatePicker(true)}>
                      <Text style={{ color: 'black' }}>{formatDate(values.date)}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                      <DateTimePicker
                        value={values.date}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                          setShowDatePicker(false);
                          if (selectedDate) {
                            setFieldValue('date', selectedDate);
                          }
                        }}
                      />
                    )}

                    <Text>Trainer:</Text>
                    <TextInput
                      onChangeText={handleChange('trainer')}
                      onBlur={handleBlur('trainer')}
                      value={values.trainer}
                      placeholder="Trainer"
                      style={modalStyles.input}
                    />
                    <Text>DISCUSSED:</Text>
                    <TextInput
                      onChangeText={handleChange('talk')}
                      onBlur={handleBlur('talk')}
                      value={values.talk}
                      placeholder="What was talked about..."
                      multiline
                      numberOfLines={4}
                      style={[modalStyles.input, modalStyles.multilineInput]}
                    />
                    <View style={modalStyles.timeTakenContainer}>
                      <Text>Time taken:</Text>
                      <TextInput
                        onChangeText={handleChange('talkTime')}
                        onBlur={handleBlur('talkTime')}
                        value={values.talkTime}
                        placeholder=""
                        style={modalStyles.input}
                      />
                    </View>
                    <Text>DEMONSTRATED:</Text>
                    <TextInput
                      onChangeText={handleChange('show')}
                      onBlur={handleBlur('show')}
                      value={values.show}
                      placeholder="What the trainee was shown..."
                      multiline
                      numberOfLines={4}
                      style={[modalStyles.input, modalStyles.multilineInput]}
                    />
                    <View style={modalStyles.timeTakenContainer}>
                      <Text>Time taken:</Text>
                      <TextInput
                        onChangeText={handleChange('showTime')}
                        onBlur={handleBlur('showTime')}
                        value={values.showTime}
                        placeholder=""
                        style={modalStyles.input}
                      />
                    </View>
                    <Text>OBSERVED:</Text>
                    <TextInput
                      onChangeText={handleChange('look')}
                      onBlur={handleBlur('look')}
                      value={values.look}
                      placeholder="What was seen..."
                      multiline
                      numberOfLines={4}
                      style={[modalStyles.input, modalStyles.multilineInput]}
                    />
                    <View style={modalStyles.timeTakenContainer}>
                      <Text>Time taken:</Text>
                      <TextInput
                        onChangeText={handleChange('lookTime')}
                        onBlur={handleBlur('lookTime')}
                        value={values.lookTime}
                        placeholder=""
                        style={modalStyles.input}
                      />
                    </View>
                    <Text>RECOMMENDATION:</Text>
                    <TextInput
                      onChangeText={handleChange('confirm')}
                      onBlur={handleBlur('confirm')}
                      value={values.confirm}
                      placeholder="Ready for assessment or more training..."
                      multiline
                      numberOfLines={4}
                      style={[modalStyles.input, modalStyles.multilineInput]}
                    />
                    <View style={modalStyles.timeTakenContainer}>
                      <Text>Time taken:</Text>
                      <TextInput
                        onChangeText={handleChange('confirmTime')}
                        onBlur={handleBlur('confirmTime')}
                        value={values.confirmTime}
                        placeholder=""
                        style={modalStyles.input}
                      />
                    </View>
                    <View style={{ paddingBottom: 20 }}>
                      <Text>Competence:</Text>
                      <SelectList
                        setSelected={(selectedCompetence: any) =>
                          setFieldValue('competence', selectedCompetence)
                        }
                        data={[
                          {
                            label: 'Constant Supervision Required',
                            value: 'Constant Supervision Required',
                          },
                          {
                            label: 'Periodic Supervision Required',
                            value: 'Periodic Supervision Required',
                          },
                          { label: 'Competent', value: 'Competent' },
                        ]}
                        placeholder="Select a Competence Type"
                      />
                      {errors.competence && touched.competence ? (
                        <Text style={{ color: 'red', marginBottom: 10 }}>{errors.competence}</Text>
                      ) : null}
                    </View>

                    <Button
                      onPress={handleSubmit}
                      title="Submit"
                      disabled={!!Object.keys(errors).length}
                    />
                  </View>
                )}
              </Formik>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  input: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
  },
  multilineInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalContent: {
    width: windowWidth * 0.9,
    height: windowHeight * 0.9, // 90% of the screen height
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    padding: 10,
    width: '100%',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    position: 'absolute',
    top: 0,
    zIndex: 1,
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBody: {
    backgroundColor: '#fff',
    padding: 20,
  },
  modalFooter: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    width: '100%',
    alignItems: 'flex-end',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  modalFooterText: {
    fontSize: 16,
    color: 'blue',
  },
  timeTakenContainer: {
    marginLeft: 'auto',
  },
  closeButton: {
    marginLeft: 'auto',
  },
  dateButton: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    borderColor: 'lightgrey',
    borderWidth: 1,
  },
  textDark: {
    color: 'black',
  },
  textLight: {
    color: 'white',
  },
});

export default AddOnJobTrainingForm;

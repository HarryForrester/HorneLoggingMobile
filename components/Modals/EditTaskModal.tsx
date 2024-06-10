import TaskStyles from '@/constants/TaskStyles';
import { Crew } from '@/schemas/Crew';
import People from '@/schemas/People';
import { findNameById } from '@/utils/findUserById';
import { useApp, useObject, useQuery, useRealm } from '@realm/react';
import { format } from 'date-fns';
import { Formik } from 'formik';
import React, { useEffect, useRef } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Task, TaskNotes } from '../../schemas/Task';
import MessagingInput from '../MessagingInput';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const EditTaskModal = ({ modalVisible, setModalVisible, task }: any) => {
  const app = useApp();
  const scrollViewRef = useRef<ScrollView>(null);

  const realm = useRealm();
  const myTask = useObject(Task, task?._id);

  const crews = useQuery(Crew);
  const people = useQuery(People);
  const currentUserId = app.currentUser?.customData._id;
  console.log('hahhaa', currentUserId);

  useEffect(() => {
    if (modalVisible) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [modalVisible]);

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
      transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <View style={modalStyles.modalContainer}>
          <View style={modalStyles.modalContent}>
            <View
              style={[
                modalStyles.modalHeader,
                { backgroundColor: getPriorityColor(task.priority) },
              ]}>
              <Text style={styles.subject}>Subject: {task.subject}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={modalStyles.closeButton}>
                <Ionicons name="close" color="white" size={30} />
              </TouchableOpacity>
            </View>

            <View style={modalStyles.modalBody}>
              <Formik
                initialValues={{
                  note: '',
                }}
                onSubmit={(values, { resetForm }) => {
                  console.log('on submit', values);
                  const userId = app.currentUser?.customData._id;

                  try {
                    if (myTask && myTask.notes) {
                      const data: TaskNotes = {
                        date: new Date(),
                        body: values.note,
                        from: userId?.toString(),
                      } as TaskNotes;
                      realm.write(() => {
                        myTask.notes.push(data);
                      });
                    }
                    resetForm();
                  } catch (error) {
                    console.error('Error submitting on job training to server', error);
                  }
                }}>
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  setFieldValue,
                  handleReset,
                  values,
                  errors,
                  touched,
                }) => (
                  <View style={modalStyles.container}>
                    <ScrollView
                      style={{ maxHeight: '85%' }}
                      ref={scrollViewRef}
                      contentContainerStyle={modalStyles.scrollViewContent}>
                      <View key={task._id.toString()} style={styles.taskContainer}>
                        <View
                          style={[TaskStyles.notesContainerOther, { padding: 8, borderRadius: 8 }]}>
                          <Text style={TaskStyles.noteFrom}>
                            From:{' '}
                            {task.from === 'Office'
                              ? 'Office'
                              : findNameById(task.from?.toString(), people, crews)}
                          </Text>
                          <Text style={TaskStyles.noteDate}>
                            Date: {format(new Date(task.date), 'MMMM do yyyy, h:mm:ss a')}
                          </Text>
                          <Text>{task.body}</Text>
                        </View>

                        {task.notes && (
                          <View style={styles.notesContainer}>
                            {task.notes.map((note: any, index: any) => (
                              <View
                                key={index}
                                style={[
                                  styles.noteContainer,
                                  note.from === 'Office'
                                    ? styles.notesContainerOther
                                    : styles.notesContainerEmployee,
                                ]}>
                                <Text style={styles.noteFrom}>
                                  From:{' '}
                                  {note.from === 'Office'
                                    ? 'Office'
                                    : findNameById(note.from, people, crews)}
                                </Text>
                                <Text style={styles.noteDate}>
                                  <Text>
                                    Date: {format(new Date(note.date), 'MMMM do yyyy, h:mm:ss a')}
                                  </Text>
                                </Text>
                                <Text>{note.body}</Text>
                              </View>
                            ))}
                          </View>
                        )}
                      </View>
                    </ScrollView>
                    <MessagingInput
                      values={values}
                      handleChange={handleChange}
                      handleSubmit={handleSubmit}
                      errors={errors}
                    />
                  </View>
                )}
              </Formik>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default EditTaskModal;

const modalStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    //paddingTop: 50,
    flex: 1,
    justifyContent: 'space-between',
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
    width: windowWidth * 0.95,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    flex: 1,
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
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBody: {
    backgroundColor: '#fff',
    paddingTop: 8,
    paddingBottom: 8,
    flex: 1,
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

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  taskContainer: {
    marginBottom: 16,
  },
  subject: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  notesContainer: {
    marginTop: 8,
  },
  noteContainer: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 8,
    width: 200,
    alignSelf: 'flex-start',
  },
  notesContainerOther: {
    alignSelf: 'flex-start',
    backgroundColor: '#b9bdba',
  },
  notesContainerEmployee: {
    alignSelf: 'flex-end',
    backgroundColor: '#accefa',
  },
  noteFrom: {
    fontWeight: 'bold',
  },
  noteDate: {
    fontStyle: 'italic',
    fontSize: 12,
    marginBottom: 4,
  },
  editButton: {
    marginTop: 8,
    backgroundColor: 'blue',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
  },
});

const getPriorityColor = (priority: any) => {
  switch (priority) {
    case 'Low':
      return 'green';
    case 'Medium':
      return 'orange';
    case 'High':
      return 'red';
    default:
      return 'black';
  }
};

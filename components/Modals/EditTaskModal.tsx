import { useApp, useObject, useRealm } from '@realm/react';
import { format } from 'date-fns';
import { Formik } from 'formik';
import React, { useRef } from 'react';
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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Task, TaskNotes } from '../../schemas/Task';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const EditTaskModal = ({ modalVisible, setModalVisible, task }: any) => {
  const app = useApp();
  const scrollViewRef = useRef<ScrollView>(null); // Ref for ScrollView

  const realm = useRealm();
  const myTask = useObject(Task, task?._id);

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
      transparent>
      <View style={modalStyles.modalContainer}>
        <View style={modalStyles.modalContent}>
          <View style={modalStyles.modalHeader}>
            <Text style={modalStyles.modalHeaderText}>Edit Task</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={modalStyles.closeButton}>
              <Ionicons name="close" color="white" size={30} />
            </TouchableOpacity>
          </View>

          <ScrollView
            ref={scrollViewRef} // Assign the ref to ScrollView
            contentContainerStyle={modalStyles.scrollViewContent}>
            <View style={modalStyles.modalBody}>
              <Formik
                initialValues={{
                  note: '',
                }}
                /* validationSchema={Yup.object().shape({
                  reportType: Yup.string().required(
                    'Select Report Type is required',
                  ),
                  user: Yup.string().required('Select Trainne is required'),
                  competence: Yup.string().required(
                    'Select Competence is required',
                  ),
                })} */
                onSubmit={(values, { resetForm }) => {
                  console.log('on suvmi', values);
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
                    setModalVisible(false);
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
                    <View key={task._id.toString()} style={styles.taskContainer}>
                      <Text style={[styles.subject, { color: getPriorityColor(task.priority) }]}>
                        Subject: {task.subject}
                      </Text>
                      <Text>Attn: {task.to}</Text>
                      <Text>Priority: {task.priority}</Text>
                      <Text>Date: {format(new Date(task.date), 'MMMM do yyyy, h:mm:ss a')}</Text>
                      <Text>From: {task.from}</Text>
                      <Text>Body: {task.body}</Text>
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
                              <Text style={styles.noteFrom}>From: {note.from}</Text>
                              <Text style={styles.noteDate}>
                                <Text>
                                  Date: {format(new Date(task.date), 'MMMM do yyyy, h:mm:ss a')}
                                </Text>
                              </Text>
                              <Text>{note.body}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                      <View style={styles.container}>
                        <Text style={styles.label}>Note</Text>
                        <TextInput
                          style={styles.input}
                          multiline
                          numberOfLines={10}
                          placeholder="Enter note"
                          value={values.note}
                          onChangeText={handleChange('note')}
                        />
                      </View>
                    </View>
                    <Button
                      onPress={() => {
                        handleSubmit();
                      }}
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

export default EditTaskModal;

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

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  taskContainer: {
    marginBottom: 16,
    //borderWidth: 1,
    //borderColor: '#ccc',
    //padding: 16,
    //borderRadius: 8,
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
    alignSelf: 'flex-start', // Align to the right if not 'Employee'
    backgroundColor: '#b9bdba',
  },
  notesContainerEmployee: {
    alignSelf: 'flex-end', // Align to the left if 'Employee'
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
    //height: 120, // Adjust height according to your preference
  },
});

// Helper function to get priority color
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

import styles from '@/constants/Styles';
import TaskStyles from '@/constants/TaskStyles';
import { useQuery, useUser } from '@realm/react';
import { format } from 'date-fns';
import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import EditTaskModal from '../../components/Modals/EditTaskModal';
import { Crew } from '../../schemas/Crew';
import People from '../../schemas/People';
import { Task } from '../../schemas/Task';
import { findNameById, findNamesByIds } from '../../utils/findUserById';
//import notifee from '@notifee/react-native';

function TasksTab() {
  const [isEditTaskModalVisible, setEditTaskModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const handleTaskEdit = (task: any) => {
    setEditTaskModalVisible(true);
    setSelectedTask(task);
  };
  const user = useUser();

  const tasks = useQuery(Task)
    .filter((task: any) => {
      return task.to.includes(user.customData._id);
    })
    .reverse();
  const crews = useQuery(Crew);
  const people = useQuery(People);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: true });
  }, [navigation]);

  return (
    <View style={isDarkMode ? styles.darkmode : styles.normal}>
      <ScrollView contentContainerStyle={TaskStyles.container}>
        {isEditTaskModalVisible && (
          <EditTaskModal
            modalVisible={isEditTaskModalVisible}
            setModalVisible={(val: boolean) => setEditTaskModalVisible(val)}
            task={selectedTask}
          />
        )}

        {tasks.map((task: any) => {
          const meme = task.notes;
          console.log('task owowo', meme);
          const latestMessage = task.notes[task.notes.length - 1];

          return (
            <View key={task._id.toString()} style={TaskStyles.taskContainer}>
              <View
                style={[
                  TaskStyles.taskSubjectContainer,
                  { backgroundColor: getPriorityColor(task.priority) },
                ]}>
                <Text style={TaskStyles.subject}>Subject: {task.subject}</Text>
              </View>
              <View
                style={{
                  paddingBottom: 16,
                  paddingLeft: 16,
                  paddingRight: 16,
                  borderRadius: 8,
                }}>
                <View style={{ paddingBottom: 8 }}>
                  <Text>Attn: {findNamesByIds(task.to, people, crews)}</Text>
                </View>
                <View style={[TaskStyles.notesContainerOther, { padding: 8, borderRadius: 8 }]}>
                  <Text style={TaskStyles.noteFrom}>
                    From:{' '}
                    {task.from === 'Office'
                      ? 'Office'
                      : findNameById(task.from?.toString(), people, crews)}
                  </Text>
                  <Text style={TaskStyles.noteDate}>
                    Date: {format(new Date(task.date), 'MMMM do yyyy, h:mm:ss a')}
                  </Text>

                  <Text style={[]}>{task.body}</Text>
                </View>

                <>
                  <ScrollView style={{ maxHeight: 200 }}>
                    {latestMessage && (
                      <View
                        style={[
                          TaskStyles.noteContainer,
                          latestMessage.from === 'Office'
                            ? TaskStyles.notesContainerOther
                            : TaskStyles.notesContainerEmployee,
                        ]}>
                        <Text style={TaskStyles.noteFrom}>
                          From:{' '}
                          {latestMessage.from === 'Office'
                            ? 'Office'
                            : findNameById(latestMessage.from, people, crews)}
                        </Text>
                        <Text style={TaskStyles.noteDate}>
                          Date: {latestMessage.date?.toDateString()}
                        </Text>
                        <Text>{latestMessage.body}</Text>
                      </View>
                    )}
                  </ScrollView>
                </>
                <TouchableOpacity
                  style={TaskStyles.editButton}
                  onPress={() => handleTaskEdit(task)}>
                  <Text style={TaskStyles.editButtonText}>Edit/Reply</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

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

export default TasksTab;

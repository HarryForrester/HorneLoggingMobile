import { useQuery, useUser } from '@realm/react';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import EditTaskModal from '../../components/Modals/EditTaskModal';
import { Crew } from '../../schemas/Crew';
import People from '../../schemas/People';
import { Task } from '../../schemas/Task';
import { findNameById, findNamesByIds } from '../../utils/findUserById';
//import notifee from '@notifee/react-native';

function TasksTab() {
  const [isEditTaskModalVisible, setEditTaskModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleTaskEdit = (task: any) => {
    setEditTaskModalVisible(true);
    setSelectedTask(task);
  };
  const user = useUser();

  const tasks = useQuery(Task).filter((task: any) => {
    return task.to.includes(user.customData._id);
  });
  const crews = useQuery(Crew);
  const people = useQuery(People);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isEditTaskModalVisible && (
        <EditTaskModal
          modalVisible={isEditTaskModalVisible}
          setModalVisible={(val: boolean) => setEditTaskModalVisible(val)}
          task={selectedTask}
        />
      )}

      {tasks.map((task) => {
        const meme = task.notes;
        console.log('task owowo', meme);
        const latestMessage = task.notes[task.notes.length - 1];

        return (
          <View key={task._id.toString()} style={styles.taskContainer}>
            <Text style={[styles.subject, { color: getPriorityColor(task.priority) }]}>
              Subject: {task.subject}
            </Text>
            <Text>Attn: {findNamesByIds(task.to, people, crews)}</Text>
            <Text>Priority: {task.priority}</Text>
            <Text>Date: {task.date}</Text>
            <Text>
              From:{' '}
              {task.from === 'Office'
                ? 'Office'
                : findNameById(task.from?.toString(), people, crews)}
            </Text>
            <Text>Body: {task.body}</Text>
            <ScrollView style={{ maxHeight: 200 }}>
              {/* {task.notes && (
              <View style={styles.notesContainer}>
                {task.notes.map((note, index) => (
                  <View
                    key={index}
                    style={[
                      styles.noteContainer,
                      note.from === 'Office'
                        ? styles.notesContainerOther
                        : styles.notesContainerEmployee,
                    ]}
                  >
                    <Text style={styles.noteFrom}>From: {note.from === "Office" ? "Office" : findNameById(note.from, people, crews)}</Text>
                    <Text style={styles.noteDate}>
                      Date: {moment(note.date).format('DD MMM hh:mm a')}
                    </Text>
                    <Text>{note.body}</Text>
                  </View>
                ))}
              </View>
            )} */}
              <View
                style={[
                  styles.noteContainer,
                  latestMessage.from === 'Office'
                    ? styles.notesContainerOther
                    : styles.notesContainerEmployee,
                ]}>
                <Text style={styles.noteFrom}>
                  From:{' '}
                  {latestMessage.from === 'Office'
                    ? 'Office'
                    : findNameById(latestMessage.from, people, crews)}
                </Text>
                <Text style={styles.noteDate}>Date: {latestMessage.date?.toDateString()}</Text>
                <Text>{latestMessage.body}</Text>
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.editButton} onPress={() => handleTaskEdit(task)}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  taskContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 16,
    borderRadius: 8,
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

export default TasksTab;

import { StyleSheet } from 'react-native';

const TaskStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 40,
    padding: 16,
  },
  taskContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    //padding: 16,
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
  taskSubjectContainer: {
    //backgroundColor: 'red',
    padding: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: 8,
  },
});

export default TaskStyles;

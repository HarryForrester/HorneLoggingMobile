import { Dimensions, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  currentMaps: {
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 5,
    marginBottom: 8,
    fontSize: 15,
  },
  pdfButton: {
    backgroundColor: 'lightgray',
    paddingVertical: 10,
    paddingHorizontal: 23,
    borderRadius: 4,
    marginRight: 8,
    marginLeft: 8,
  },
  buttonContainer: {
    //marginTop: 0,
    //marginBottom: 10,
  },
  buttonContainer1: {
    marginBottom: 16,
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  settingsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111',
    padding: 20,
  },
  containerSettingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  settingsContainerScreen: {
    //flex: 1,
    alignItems: 'center',
    width: '90%',
    justifyContent: 'center',
    //backgroundColor: '#111',
    padding: 20,
  },
  jobsContainer: {
    backgroundColor: '#111',
  },
  PDFContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    top: 0,
    left: 0,
  },
  marker: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'red',
    opacity: 0.5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  modalView: {
    backgroundColor: '#FFF',
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
    padding: 15,
    width: '80%',
    maxWidth: '80%',
    maxHeight: '80%',
  },
  button: {
    borderRadius: 15,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    marginTop: 10,
    elevation: 2,
    alignSelf: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  buttonOpen: {
    backgroundColor: '#228B22',
  },
  buttonClose: {
    alignSelf: 'center',
    padding: 10,
    borderRadius: 15,
    paddingLeft: 20,
    paddingRight: 20,
  },
  textClose: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textSubmit: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalHeadingText: {
    textAlign: 'center',
    fontSize: 20,
    paddingBottom: 5,
    fontWeight: 'bold',
  },
  modalFormSectionText: {
    textAlign: 'center',
    fontSize: 20,
    padding: 10,
    color: 'black',
    fontWeight: 'bold',
  },
  modalText: {
    textAlign: 'center',
    fontSize: 14,
    width: '60%',
    alignContent: 'center',
    alignSelf: 'center',
  },
  modalTextBold: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
  },
  crewMemberText: {
    textAlign: 'center',
    fontSize: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  formModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  buttonContainerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingLeft: 15,
    paddingRight: 15,
    width: '90%',
    maxWidth: '80%',
    maxHeight: '80%',
  },
  modalHeaderDark: {
    backgroundColor: '#1d1d1d',
  },
  modalHeaderLight: {
    backgroundColor: '#0c3424',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
  buttonContainerForms: {
    margin: 10,
    width: '100%',
    alignSelf: 'center',
  },
  FormHeadingText: {
    fontSize: 30,
  },
  dateContainer: {
    marginTop: 20,
    padding: 10,
  },
  textinputContainer: {
    marginTop: 20,
  },
  formButton: {
    marginBottom: 10,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: 150,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  settingsHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  settingsSubHeading: {
    fontSize: 18,
    color: '#0077ff',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  settingsNameText: {
    fontStyle: 'normal',
    fontSize: 16,
  },
  loginLabel: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  loginInput: {
    width: 250,
    height: 48,
    borderColor: 'gray',
    //borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  textInputContainer: {
    marginBottom: 20,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginPaddingContainer: {
    paddingTop: 40,
  },
  loginButtonContainer: {
    marginTop: 50,
    borderRadius: 20,
    padding: 10,
    paddingLeft: 50,
    paddingRight: 50,
  },
  forgotButtonContainer: {
    //marginTop: 10,
    //backgroundColor: 'lightgray',
    //borderRadius: 5,
    //padding: 5,
    //paddingLeft: 5,
    //paddingRight: 5,
    alignSelf: 'flex-end',
  },
  loginButtonText: {
    //textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    //color: 'white',
  },
  forgotPassBtn: {
    fontSize: 12,
    fontWeight: 'bold',
    //color: 'grey',
  },
  textDark: {
    color: 'white',
  },
  textLight: {
    color: '#241c23',
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginTop: 10,
    marginBottom: 10,
  },
  modalVisible: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the opacity as needed
  },
  modalHidden: {
    backgroundColor: 'transparent',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9999999, // Adjust the zIndex as needed to ensure the overlay is displayed above the modals
  },
  lightBackground: {
    backgroundColor: '#fafafa',
  },
  darkmode: {
    backgroundColor: '#111',
  },
  containerDark: {
    backgroundColor: '#111',
  },
  containerLight: {
    backgroundColor: '#fafafa',
  },
  loginContainerLight: {
    backgroundColor: '#e7f0ed',
  },
  labelDark: {
    color: '#fff',
  },
  labelLight: {
    color: '#241c23',
  },
  inputDark: {
    backgroundColor: '#3c3c3c',
    color: '#fff',
    borderColor: '#888',
  },
  inputLight: {
    backgroundColor: 'white',
    //backgroundColor: '#7fb6a3',
    color: '#241c23',
    borderColor: 'black',
  },
  buttonContainerDark: {
    backgroundColor: '#1d1d1d',
    borderColor: '#888',
  },
  buttonContainerLight: {
    backgroundColor: '#0c3424',
  },
  buttonDark: {
    color: '#fff',
  },
  buttonTextDark: {
    color: '#fff',
  },
  buttonTextLight: {
    color: '#241c23',
  },
  headerTextLight: {
    color: '#e7f0ed',
  },

  textInputDark: {
    color: '#fff',
  },
  headerBackgroundTextInputLight: {
    color: '#fafafa',
  },
  loadingLight: {
    color: '#0c3424',
  },
  loadingDark: {
    color: '#fff',
  },
  textButtonLight: {
    color: '#fafafa',
  },
  listViewDark: {
    backgroundColor: 'grey',
  },
  listViewLight: {
    backgroundColor: 'white',
  },
  textInput: {
    backgroundColor: 'lightgray',
    borderRadius: 5,
    padding: 8, // Adjust the padding to make it smaller
    marginTop: 3, // Adjust the marginTop to reduce the space above the TextInput
    marginBottom: 6, // Adjust the marginBottom to reduce the space below the TextInput
    color: 'black',
    fontSize: 14, // Adjust the fontSize to make the text smaller
  },
  closeButtonPadding: {
    marginTop: 15, // Add the desired padding value here
  },
  dateButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: 170,
    alignContent: 'center',
    alignSelf: 'center',
  },
  dateButtonText: {
    color: 'black', // Adjust the text color as per your requirement
    fontSize: 16,
  },
  buttonBackgroundDark: {
    backgroundColor: '#646464',
  },
  buttonBackgroundLight: {
    backgroundColor: '#0c3424',
  },
  listItem: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#969696',
    paddingVertical: 10,
    paddingHorizontal: 15,
    textAlign: 'center',
    fontSize: 15,
    marginBottom: 10,
    backgroundColor: '#afafaf',
  },
  fileContainer: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  modalTextLink: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  content: {
    width: '100%',
    height: '100%',
  },
  contentLogin: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 20,
  },
  containerScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoImage: {
    width: 200,
    height: 200,
  },
  formContainer: {
    width: '80%',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  logoutButton: {
    backgroundColor: 'grey',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  settingsButton: {
    marginBottom: 20,
    backgroundColor: '#0c3424',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },

  /* 
    People Tab styles
*/
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  personContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#e1e1e1',
  },
  personName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  crewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: '#0c3424',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 10,
    color: '#e7f0ed',
  },
  personDetailsContainer: {
    marginTop: 10,
  },
  personDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  personDetailLabel: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  personDetailValue: {
    flex: 1,
  },
  personImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },

  personImage: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  personSettingsImage: {
    height: 150,
    width: 150,
    borderRadius: 50,
  },
  validationError: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  selectlistWidth: {
    width: 160,
  },
  iconContainer: {
    flexDirection: 'row', // Horizontal layout to align the icon and text side by side
    alignItems: 'center', // Center vertically within the container
  },
  peopleListTextLight: {
    color: '#241c23',
  },
  activityContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },

  // Docs Screen Styles

  listItemContainer: {
    padding: 10,
    paddingHorizontal: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#5b5a59',
  },
  listItemText: {
    fontSize: 16,
    color: 'black',
  },
  sectionHeaderContainer: {
    backgroundColor: '#0c3424',
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  userInfo: {
    marginTop: 10,
    marginLeft: 20,
  },
  skidFieldContainer: {
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#e1e1e1',
  },
});

export default styles;

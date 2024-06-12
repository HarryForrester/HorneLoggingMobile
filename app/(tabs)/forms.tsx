import FormModal from '@/components/Modals/FormModal';
import { useApp, useQuery, useUser } from '@realm/react';
import { useNavigation } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableHighlight, View, useColorScheme } from 'react-native';
import AddOnJobTrainingForm from '../../components/Modals/AddOnJobTrainingForm';
import TimeSheetModal from '../../components/Modals/TimeSheetModal';
import styles from '../../constants/Styles';
import Forms from '../../schemas/Forms';
import People from '../../schemas/People';
import TimeSheetAccess from '../../schemas/TimeSheetAccess';

const FormTab = () => {
  const [isTimeSheetModalVisible, setTimeSheetVisible] = useState(false);
  const [people, setPeople] = useState<any>([]);
  const [peopleByCrew, setPeopleByCrew] = useState<
    { label: string; options: { value: string; label: string }[] }[]
  >([]);
  const [selectedPersonId, setSelectedPersonId] = useState<any>('');
  const [timesheetAccess, setTimesheetAccess] = useState<any>([]);
  const [forms, setForms] = useState<any>([]);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [selectedForm, setSelectedForm] = useState<any>({
    template: null,
    data: {},
  });
  const [trainingModalVisible, setTrainingModalVisible] = useState(false);

  //const [isLoading, setIsLoading] = useState(true); // State to track loading
  //const [isLoadingForm, setIsLoadingForm] = useState(false); // State to track loading

  const peopleCollection = useQuery(People);
  const formsCollection = useQuery(Forms);
  const timesheetAccessCollection = useQuery(TimeSheetAccess);

  const app = useApp();
  const user = useUser();

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: true });
  }, [navigation]);

  /*   useEffect(() => {
    loadSelectedForm();
  }, []); */

  /* useEffect(() => {
    const saveSelectedForm = async () => {
      try {
        if (selectedForm) {
          await SecureStore.setItemAsync('selectedForm', JSON.stringify(selectedForm));
        }
      } catch (err) {
        console.error('Error saving selectedForm to AsyncStorage:', err);
      }
    };
    saveSelectedForm();
  }, [selectedForm]);

  const loadSelectedForm = async () => {
    try {
      const storedForm = await SecureStore.getItemAsync('selectedForm');
      console.log('oi u clujt', JSON.stringify(storedForm, null, 2));
      if (storedForm) {
        //setSelectedForm(JSON.parse(storedForm));
        setSelectedForm((prevSelectedForm: any) => ({
          ...prevSelectedForm,
          data: JSON.parse(storedForm),
        }));
      }
    } catch (err) {
      console.error('Error loading selectedForm form AsyncStorage:', err);
    }
  };
 */
  useEffect(() => {
    const fm = async () => {
      try {
        const filteredForms = formsCollection
          .sorted('position')
          .filter((form) => form._account === user.customData._account)
          .map((form) => ({
            ...form,
            availableOnDeviceSerialized: JSON.parse(form.availableOnDeviceSerialized),
            sectionsSerialized: JSON.parse(form.sectionsSerialized),
          }));

        const currentEmail = app.currentUser?.profile.email;

        const filteredPerson = peopleCollection.find(
          (person) => person._account === user.customData._account && person.email === currentEmail,
        );

        if (filteredPerson) {
          setSelectedPersonId(filteredPerson._id);
        }

        setForms(filteredForms);
      } catch (error) {
        console.error('Error fetching forms:', error);
      }
    };

    fm();
  }, [peopleCollection, formsCollection, app.currentUser?.profile.email, user.customData._account]);

  useEffect(() => {
    setTimesheetAccess(
      timesheetAccessCollection.filter((timesheet) => {
        return timesheet._account === user.customData._account;
      }),
    );
  }, [timesheetAccessCollection, user.customData._account]);

  useEffect(() => {
    const fetchPeopleData = async () => {
      const filteredPeopleData = peopleCollection.filter(
        (person: any) =>
          person._account === user.customData._account &&
          person.crew === app.currentUser?.customData.crew,
      );
      const formattedPeopleData = filteredPeopleData.map((person: { name: any }) => ({
        label: person.name,
        value: person.name,
      }));
      setPeople(formattedPeopleData);
    };

    const fetchPeopleDataByCrew = async () => {
      const formattedPeopleData: {
        label: string;
        options: { value: string; label: string }[];
      }[] = [];

      // Create an object to store people by crew
      const peopleByCrew: { [crew: string]: { value: string; label: string }[] } = {};

      // Iterate through the people data and organize them by crew
      peopleCollection.forEach((person: any) => {
        const { name, _id, crew } = person;

        // If the crew doesn't exist in the peopleByCrew object, create it
        if (!peopleByCrew[crew]) {
          peopleByCrew[crew] = [];
        }

        // Add the person to the corresponding crew
        peopleByCrew[crew].push({ value: _id, label: name });
      });

      // Iterate through the organized crews and add them to formattedPeopleData
      Object.keys(peopleByCrew).forEach((crew) => {
        formattedPeopleData.push({
          label: `${crew}`,
          options: peopleByCrew[crew],
        });
      });

      setPeopleByCrew(formattedPeopleData);
    };

    fetchPeopleData();
    fetchPeopleDataByCrew();
  }, [app.currentUser?.customData.crew, peopleCollection, user.customData._account]);

  const openFormModal = async (form: any) => {
    //setIsLoadingForm(true);
    const existingFormData = await getFormDataForTemplate(form);

    console.log('form jmy vun: ', JSON.stringify(existingFormData, null, 2));
    //console.log('existingForm: ', JSON.stringify(existingFormData, null, 2));

    if (existingFormData) {
      const current = JSON.stringify(form.sectionsSerialized);
      const existing = JSON.stringify(existingFormData.sectionsSerialized);

      /* if (existing.length === current.length) {
        setSelectedForm({
          template: form,
          data: existingFormData,
        });
      } else { */
      setSelectedForm({
        template: form,
        data: existingFormData,
      });
      /*  } */
    } else {
      setSelectedForm({
        template: form,
        data: existingFormData || form,
      });
    }

    //setIsLoadingForm(false);
    setEditModalVisible(true);
  };

  const openTimeSheetModal = () => {
    setTimeSheetVisible(true);
  };

  const filteredForms = selectedPersonId
    ? forms.filter((form: any) => {
        const availableOnDevice = form.availableOnDeviceSerialized;
        return (
          availableOnDevice &&
          Object.keys(availableOnDevice).some(
            // eslint-disable-next-line eqeqeq
            (key) => key == selectedPersonId && availableOnDevice[key] === true,
          )
        );
      })
    : [];

  const filteredTimesheet = selectedPersonId
    ? timesheetAccess.filter((form: any) => {
        const availableOnDevice = JSON.parse(form.availableOnDevice);
        return (
          availableOnDevice &&
          Object.keys(availableOnDevice).some(
            // eslint-disable-next-line eqeqeq
            (key) => key == selectedPersonId && availableOnDevice[key] === true,
          )
        );
      })
    : [];

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const getFormDataForTemplate = async (formTemplate: any) => {
    try {
      const storedFormData = await SecureStore.getItemAsync(`formData_${formTemplate._id}`);

      if (storedFormData) {
        return JSON.parse(storedFormData);
      }

      return null;
    } catch (err) {
      console.error('Error loading form data from AsyncStorage:', err);
      return null;
    }
  };

  /* if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="green" />
        <Text style={isDarkMode ? styles.textInputDark : styles.textInputLight}>
          Loading data...
        </Text>
      </View>
    );
  } */
  /* if (isLoadingForm) {
    return (
      <Modal transparent animationType="slide" visible={isLoadingForm}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
            <ActivityIndicator size="large" color="green" />
            <Text>Loading data...</Text>
          </View>
        </View>
      </Modal>
    );
  } */

  return (
    <View style={[styles.content, isDarkMode ? styles.darkmode : styles.normal]}>
      <ScrollView contentContainerStyle={styles.containerScroll} style={{ maxHeight: '100%' }}>
        <View style={[isDarkMode ? styles.darkmode : styles.normal]}>
          {filteredTimesheet.length > 0 && (
            <View style={styles.buttonContainerForms}>
              <TouchableHighlight
                style={[
                  styles.formButton,
                  isDarkMode ? styles.buttonBackgroundDark : styles.buttonBackgroundLight,
                ]}
                underlayColor={isDarkMode ? '#969696' : '#e7e7e7'}
                onPress={openTimeSheetModal}>
                <Text
                  style={[
                    styles.buttonText,
                    isDarkMode ? styles.buttonTextDark : styles.headerTextLight,
                  ]}>
                  Time Sheet
                </Text>
              </TouchableHighlight>
            </View>
          )}
          <View style={styles.buttonContainerForms}>
            <TouchableHighlight
              style={[
                styles.formButton,
                isDarkMode ? styles.buttonBackgroundDark : styles.buttonBackgroundLight,
              ]}
              underlayColor={isDarkMode ? '#969696' : '#e7e7e7'}
              onPress={() => {
                setTrainingModalVisible(true);
              }}>
              <Text
                style={[
                  styles.buttonText,
                  isDarkMode ? styles.buttonTextDark : styles.headerTextLight,
                ]}>
                On-Job Training
              </Text>
            </TouchableHighlight>
          </View>
          <View>
            {filteredForms.map((form: any) => (
              <View key={form._id} style={styles.buttonContainerForms}>
                <TouchableHighlight
                  style={[
                    styles.formButton,
                    isDarkMode ? styles.buttonBackgroundDark : styles.buttonBackgroundLight,
                  ]}
                  underlayColor={isDarkMode ? '#969696' : '#e7e7e7'}
                  onPress={() => {
                    openFormModal(form);
                  }}>
                  <Text
                    style={[
                      styles.buttonText,
                      isDarkMode ? styles.buttonTextDark : styles.headerTextLight,
                    ]}>
                    {form.title}
                  </Text>
                </TouchableHighlight>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <AddOnJobTrainingForm
        modalVisible={trainingModalVisible}
        setModalVisible={setTrainingModalVisible}
      />

      <FormModal
        isEditModalVisible={isEditModalVisible}
        closeFormModal={() => setEditModalVisible(false)}
        selectedForm={selectedForm}
        setSelectedForm={setSelectedForm}
        peopleByCrew={peopleByCrew}
      />

      <TimeSheetModal
        isTimeSheetModalVisible={isTimeSheetModalVisible}
        closeTimeSheetModal={() => setTimeSheetVisible(false)}
        people={people}
        setPeople={setPeople}
      />
    </View>
  );
};

export default FormTab;

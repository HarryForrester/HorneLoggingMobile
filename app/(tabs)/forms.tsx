import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp, useQuery, useRealm, useUser } from '@realm/react';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
  useColorScheme,
} from 'react-native';
import Realm from 'realm';
import CheckElement from '../../components/Form/CheckElement';
import DateElement from '../../components/Form/DateElement';
import FreeformElement from '../../components/Form/FreeformElement';
import ImageElement from '../../components/Form/ImageElement';
import ListElement from '../../components/Form/ListElement';
import NumberElement from '../../components/Form/NumberElement';
import SelectListElement from '../../components/Form/SelectListElement';
import SignatureElement from '../../components/Form/SignatureElement';
import TimeElement from '../../components/Form/TimeElement';
import TimeSheetModal from '../../components/Modals/TimeSheetModal';
import styles from '../../constants/Styles';
import FilledForms from '../../schemas/FilledForms';
import Forms from '../../schemas/Forms';
import People from '../../schemas/People';
import TimeSheetAccess from '../../schemas/TimeSheetAccess';
const FormTab = () => {
  const [isTimeSheetModalVisible, setTimeSheetVisible] = useState(false);
  const [people, setPeople] = useState<any>([]);
  const [peopleByCrew, setPeopleByCrew] = useState<
    { label: string; options: { value: string; label: string }[] }[]
  >([]);
  const [selectedPerson, setSelectedPerson] = useState<any>([]);
  const [selectedPersonId, setSelectedPersonId] = useState<any>('');
  const [date, setDate] = useState(new Date()); // for timesheet date
  const [dateOpen, setDateOpen] = useState(false);
  const [formDateOpen, setFormDateOpen] = useState<{ [key: string]: boolean }>({});
  const [formTimeOpen, setFormTimeOpen] = useState<{ [key: string]: any }>({});
  const [hoursValue, setHoursValue] = useState('');
  const [commentsValue, setCommentsValue] = useState('');
  const [timesheetAccess, setTimesheetAccess] = useState<any>([]);
  const [forms, setForms] = useState<any>([]);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [selectedForm, setSelectedForm] = useState<any>({
    template: null,
    data: {},
  });
  const [isLoading, setIsLoading] = useState(true); // State to track loading
  const [isLoadingForm, setIsLoadingForm] = useState(false); // State to track loading

  const peopleCollection = useQuery(People);
  const formsCollection = useQuery(Forms);
  const timesheetAccessCollection = useQuery(TimeSheetAccess);

  const app = useApp();
  const user = useUser();
  const realm = useRealm();

  useEffect(() => {
    loadSelectedForm();
  }, []);

  useEffect(() => {
    saveSelectedForm();
  }, [selectedForm]);

  const loadSelectedForm = async () => {
    try {
      const storedForm = await AsyncStorage.getItem('selectedForm');

      if (storedForm) {
        setSelectedForm(JSON.parse(storedForm));
      }
    } catch (err) {
      console.error('Error loading selectedForm form AsyncStorage:', err);
    }
  };

  const saveSelectedForm = async () => {
    try {
      if (selectedForm) {
        await AsyncStorage.setItem('selectedForm', JSON.stringify(selectedForm));
      }
    } catch (err) {
      console.error('Error saving selectedForm to AsyncStorage:', err);
    }
  };

  /*  const onDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setDateOpen(false);
    setDate(currentDate);
  } */

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
      } finally {
        setIsLoading(false);
      }
    };

    fm();
  }, [peopleCollection, formsCollection]);

  useEffect(() => {
    setTimesheetAccess(
      timesheetAccessCollection.filter((timesheet) => {
        return timesheet._account === user.customData._account;
      }),
    );
  }, [timesheetAccessCollection]);

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
  }, []);

  const openFormModal = async (form: any) => {
    setIsLoadingForm(true);
    const existingFormData = await getFormDataForTemplate(form);

    console.log('form: ', form);
    console.log('existingForm: ', existingFormData);

    if (existingFormData) {
      const current = JSON.stringify(form.sectionsSerialized);
      const existing = JSON.stringify(existingFormData.sectionsSerialized);

      if (existing.length === current.length) {
        setSelectedForm({
          template: form,
          data: existingFormData || form,
        });
      } else {
        setSelectedForm({
          template: form,
          data: form,
        });
      }
    } else {
      setSelectedForm({
        template: form,
        data: existingFormData || form,
      });
    }

    setIsLoadingForm(false);
    setEditModalVisible(true);
  };

  const closeFormModal = () => {
    setEditModalVisible(false);
  };

  const resetFormModal = async () => {
    setSelectedForm({
      template: selectedForm.template,
      data: selectedForm.template,
    });
    saveFormDataForTemplate(selectedForm.template._id, selectedForm.template);
    resetItems(selectedForm);
  };

  const handleChange = (
    elementType: string,
    propertyName: string,
    sectionIndex: number,
    labelIndex: number,
    data: any,
  ) => {
    setSelectedForm((prevSelectedForm: any) => {
      const updatedForm = { ...prevSelectedForm };

      const section = updatedForm.data.sectionsSerialized[sectionIndex]; // Access sections from template property
      if (section && section.items.length > labelIndex) {
        const updatedSection = { ...section };

        const currentLabel = updatedSection.items[labelIndex];
        if (currentLabel && currentLabel.type === elementType) {
          const updatedLabel = { ...currentLabel, [propertyName]: data };

          updatedSection.items[labelIndex] = updatedLabel;
          updatedForm.data.sectionsSerialized[sectionIndex] = updatedSection; // Update sections in data property
        }
      }

      // Save form data to AsyncStorage
      saveFormDataForTemplate(updatedForm.template._id, updatedForm.data);

      return { ...updatedForm };
    });
  };

  const handleTextInputChange = (sectionIndex: number, labelIndex: number, text: string) => {
    if (selectedForm) {
      handleChange('freeform', 'value', sectionIndex, labelIndex, text);
    }
  };

  const handleNumberInputChange = (sectionIndex: number, labelIndex: number, number: string) => {
    if (selectedForm) {
      handleChange('number', 'value', sectionIndex, labelIndex, number);
    }
  };

  const handleDateInputChange = (sectionIndex: number, labelIndex: number, date: Date) => {
    if (selectedForm) {
      handleChange('date', 'value', sectionIndex, labelIndex, date);
    }
  };

  const handleTimeInputChange = (sectionIndex: number, labelIndex: number, date: any) => {
    if (selectedForm) {
      const updatedDate = new Date(date);
      updatedDate.setHours(updatedDate.getHours() + 12);
      handleChange('time', 'value', sectionIndex, labelIndex, date);
    }
  };

  const handleToggleItem = (sectionIndex: any, itemIndex: any, checked: any) => {
    if (selectedForm) {
      handleChange('check', 'checked', sectionIndex, itemIndex, !checked);
    }
  };

  const handleCrewSelectListChange = (
    sectionIndex: number,
    itemIndex: number,
    selectedPerson: any,
  ) => {
    setSelectedForm((prevSelectedForm: any) => {
      const updatedForm = { ...prevSelectedForm };

      const section = updatedForm.data.sectionsSerialized[sectionIndex]; // Access sections from template property
      if (section && section.items.length > itemIndex) {
        const updatedSection = { ...section };

        const currentLabel = updatedSection.items[itemIndex];
        if (currentLabel && currentLabel.type === 'list') {
          const key = `${updatedForm.data._id}_${sectionIndex}_${itemIndex}`;
          if (selectedPerson !== key) {
            const updatedLabel = {
              ...currentLabel,
              selectedPerson: selectedPerson,
            };
            updatedSection.items[itemIndex] = updatedLabel;
            updatedForm.data.sectionsSerialized[sectionIndex] = updatedSection; // Update sections in data property
          }
        }
      }
      saveFormDataForTemplate(updatedForm.template._id, updatedForm.data);
      return { ...updatedForm };
    });
  };

  const handleSelectListChange = (sectionIndex: number, itemIndex: number, selectedPerson: any) => {
    setSelectedForm((prevSelectedForm: any) => {
      const updatedForm = { ...prevSelectedForm };

      const section = updatedForm.data.sectionsSerialized[sectionIndex]; // Access sections from template property
      if (section && section.items.length > itemIndex) {
        const updatedSection = { ...section };

        const currentLabel = updatedSection.items[itemIndex];
        if (currentLabel && currentLabel.type === 'selectlist') {
          const key = `${updatedForm.data._id}_${sectionIndex}_${itemIndex}`;
          if (selectedPerson !== key) {
            const updatedLabel = { ...currentLabel, selected: selectedPerson };
            updatedSection.items[itemIndex] = updatedLabel;
            updatedForm.data.sectionsSerialized[sectionIndex] = updatedSection; // Update sections in data property
          }
        }
      }
      // Save form data to AsyncStorage
      saveFormDataForTemplate(updatedForm.template._id, updatedForm.data);

      return { ...updatedForm };
    });
  };

  const handleImageChange = (sectionIndex: number, itemIndex: number, image: any) => {
    handleChange('image', 'image', sectionIndex, itemIndex, image);
  };

  const handleSignatureChange = (sectionIndex: number, itemIndex: number, image: any) => {
    handleChange('signature', 'image', sectionIndex, itemIndex, image);
  };

  const renderFormElements = () => {
    if (!selectedForm.template) {
      return null;
    }
    const form = selectedForm.template;
    const formData = selectedForm.data;
    console.log('formData is this: ', JSON.stringify(formData));
    console.log('formTemp: ', JSON.stringify(form));
    return form.sectionsSerialized.map((section: any, sectionIndex: any) => {
      const sectionTitle = section.title;
      const items = section.items;

      return (
        <View key={`${form._id}_${sectionIndex}`}>
          <Text
            style={[
              styles.modalFormSectionText,
              isDarkMode ? styles.buttonTextDark : styles.buttonTextLight,
            ]}>
            {sectionTitle}
          </Text>

          {items.map((item: any, itemIndex: any) => {
            const labelText = item.label;
            const key = `${form._id}_${sectionIndex}_${itemIndex}`;
            const selected = formData.sectionsSerialized[sectionIndex].items[itemIndex];
            const selectedValue = selected.value;

            if (item.type === 'freeform') {
              return (
                <FreeformElement
                  key={key}
                  labelText={labelText}
                  value={selected.value || ''}
                  handleTextChange={(text: string) =>
                    handleTextInputChange(sectionIndex, itemIndex, text)
                  }
                />
              );
            }
            if (item.type === 'number') {
              return (
                <NumberElement
                  key={key}
                  labelText={labelText}
                  value={selected.value}
                  handleNumberChange={(text: string) =>
                    handleNumberInputChange(sectionIndex, itemIndex, text)
                  }
                />
              );
            } else if (item.type === 'check') {
              const { value } = item;
              const key = `${form._id}_${sectionIndex}_item_${itemIndex}`;
              const isChecked = selected.checked || false;

              return (
                <CheckElement
                  key={key}
                  value={value}
                  isChecked={isChecked}
                  handleCheckChange={() => handleToggleItem(sectionIndex, itemIndex, isChecked)}
                />
              );
            } else if (item.type === 'date') {
              const value = selectedValue ? new Date(selectedValue) : new Date();
              let labelValue;

              const formatDate = (date: any) => {
                const day = date.getDate();
                const month = date.getMonth() + 1;
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
              };

              if (selected.value) {
                labelValue = formatDate(value);
              } else {
                labelValue = '';
              }

              return (
                <DateElement
                  elementKey={key}
                  key={key}
                  value={value}
                  labelValue={labelValue}
                  labelText={labelText}
                  formDateOpen={formDateOpen}
                  toggleOpenDate={() =>
                    setFormDateOpen((prevDateOpen) => ({
                      ...prevDateOpen,
                      [key]: !prevDateOpen[key],
                    }))
                  }
                  updateDate={(updatedDate: any) => setFormDateOpen(updatedDate)}
                  handleUpdateDate={(selectedDate: any) =>
                    handleDateInputChange(sectionIndex, itemIndex, selectedDate)
                  }
                />
              );
            } else if (item.type === 'time') {
              const value = selectedValue ? new Date(selectedValue) : new Date();
              let labelValue;

              const formatTime12Hour = (time: any) => {
                const hours = time.getHours();
                const minutes = time.getMinutes();
                const isPM = hours >= 12;
                const formattedHours = hours % 12 || 12;
                const formattedMinutes = minutes.toString().padStart(2, '0');
                const period = isPM ? 'AM' : 'PM';
                return `${formattedHours}:${formattedMinutes} ${period}`;
              };

              if (selected.value) {
                labelValue = formatTime12Hour(value);
              } else {
                labelValue = '';
              }

              const isFormOpen = formTimeOpen[key];

              return (
                <TimeElement
                  key={key}
                  labelText={labelText}
                  labelValue={labelValue}
                  value={value}
                  toggleTimeElement={() => {
                    setFormTimeOpen((prevTimeOpen) => ({
                      ...prevTimeOpen,
                      [key]: !prevTimeOpen[key],
                    }));
                  }}
                  isFormOpen={isFormOpen}
                  updateTime={(selectedTime: Date) => {
                    const updatedTimeOpen = { ...formTimeOpen };
                    updatedTimeOpen[key] = false;
                    setFormTimeOpen(updatedTimeOpen);
                    handleTimeInputChange(sectionIndex, itemIndex, selectedTime);
                  }}
                  onCancel={() => {
                    const updatedTimeOpen = { ...formTimeOpen };
                    updatedTimeOpen[key] = false;
                    labelValue = '';
                    setFormTimeOpen(updatedTimeOpen);
                  }}
                />
              );
            } else if (item.type === 'list') {
              const { label, value } = item;
              const key = `${form._id}_${sectionIndex}_item_${itemIndex}`;
              const matchingCrew = peopleByCrew.find((crew) => crew.label === value);
              const crewOptionsLabels =
                value === 'All'
                  ? peopleByCrew.flatMap((crew) => crew.options.map((option) => option.label))
                  : matchingCrew
                    ? matchingCrew.options.map((option) => option.label)
                    : [];
              const defaultValueKey = `${form._id}_${sectionIndex}_${itemIndex}`;
              const selected = formData.sectionsSerialized[sectionIndex].items[itemIndex];

              const defaultValue = selected ? selected.selectedPerson : null; // Check if selected is defined

              const defaultOption =
                defaultValue !== null
                  ? {
                      key: defaultValueKey,
                      value: defaultValue,
                    }
                  : undefined;

              return (
                <ListElement
                  key={key}
                  label={label}
                  handleListChange={(val: object) => {
                    handleCrewSelectListChange(sectionIndex, itemIndex, val);
                  }}
                  listData={crewOptionsLabels}
                  defaultOption={defaultOption}
                />
              );
            } else if (item.type === 'selectlist') {
              const { label, items } = item;
              const key = `${form._id}_${sectionIndex}_item_${itemIndex}`;
              const defaultValueKey = `${form._id}_${sectionIndex}_${itemIndex}`;
              const selected = formData.sectionsSerialized[sectionIndex].items[itemIndex];
              const defaultValue = selected.selected;
              const defaultOption =
                defaultValue !== null
                  ? {
                      key: defaultValueKey,
                      value: defaultValue || 'Select Value',
                    }
                  : undefined;

              return (
                <SelectListElement
                  key={key}
                  label={label}
                  handleSelectChange={(val: object) => {
                    handleSelectListChange(sectionIndex, itemIndex, val);
                  }}
                  listData={items}
                  defaultOption={defaultOption}
                />
              );
            } else if (item.type === 'image') {
              const { label } = item;
              const key = `${form._id}_${sectionIndex}_item_${itemIndex}`;
              const selected = formData.sectionsSerialized[sectionIndex].items[itemIndex];
              const image = selected.image;

              const handleRemoveImage = () => {
                handleImageChange(sectionIndex, itemIndex, null);
              };

              return (
                <ImageElement
                  key={key}
                  label={label}
                  image={image}
                  handleRemoveImage={handleRemoveImage}
                  handleImageChange={(imageBase64: string) =>
                    handleImageChange(sectionIndex, itemIndex, imageBase64)
                  }
                />
              );
            } else if (item.type === 'signature') {
              const labelText = item.label;
              const key = `${form._id}_${sectionIndex}_${itemIndex}`;
              const selected = formData.sectionsSerialized[sectionIndex].items[itemIndex];
              const value = selected.image;

              return (
                <SignatureElement
                  key={key}
                  label={labelText}
                  defaultValue={value}
                  handleSignatureChange={(signature) =>
                    handleSignatureChange(sectionIndex, itemIndex, signature)
                  }
                />
              );
            } else {
              return null;
            }
          })}

          {sectionIndex < form.sectionsSerialized.length - 1 && <View style={styles.line} />}
        </View>
      );
    });
  };

  const openTimeSheetModal = () => {
    setTimeSheetVisible(true);
  };

  const closeTimeSheetModal = () => {
    setTimeSheetVisible(false);
    setHoursValue('');
    setCommentsValue('');
    setSelectedPerson([]);
    const currentDate = new Date();
    setDate(currentDate);
  };

  /*  /**
 
  const handleSubmit = () => {
    console.log('handleSubmit');
    const currentDate = new Date(date)

    // Get the individual components of the date
    const year = currentDate.getFullYear()
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0')
    const day = currentDate.getDate().toString().padStart(2, '0')

    // Format the date as "YYYY-MM-DD"
    const formattedDate = `${year}-${month}-${day}`

    const timeSheetData = {
      name: selectedPerson,
      hours: hoursValue,
      comments: commentsValue,
    }

    handleAddTimeSheet(formattedDate, timeSheetData)
    setDate(currentDate)
    setSelectedPerson([])
    closeTimeSheetModal()
    Alert.alert(`Submitted!`)
  } */

  const resetItems = (form: any) => {
    form.data.sectionsSerialized.forEach((section: any) => {
      section.items.forEach((item: any) => {
        if (item.type === 'check') {
          item.checked = false;
        }
        if (item.type === 'list') {
          item.selectedPerson = '';
        }
        if (item.type === 'selectlist') {
          item.selected = '';
        }
        if (item.type === 'number') {
          item.value = '';
        }
        if (item.type === 'freeform') {
          item.value = '';
        }
        if (item.type === 'date') {
          item.value = '';
        }
        if (item.type === 'time') {
          item.value = '';
        }
        if (item.type === 'image') {
          item.image = '';
        }
        if (item.type === 'signature') {
          item.image = '';
        }
      });
    });
  };

  const handleAddForm = async (data: any) => {
    const userAccount = app.currentUser?.customData._account;
    const crew = app.currentUser?.customData.crew;
    const name = app.currentUser?.customData.name;

    try {
      if (typeof userAccount === 'number' && typeof crew === 'string' && typeof name === 'string') {
        const newObjectId = new Realm.BSON.ObjectID(); // Generate a new ObjectId
        const formIdString = data._id.toString();

        realm.write(() => {
          realm.create(FilledForms, {
            _id: newObjectId,
            _account: userAccount,
            date: new Date(),
            user: name,
            crew: crew,
            formId: formIdString,
            data: JSON.stringify(data),
          });
        });

        Alert.alert('Submitted!', 'Form has been submitted successfully');
      }
    } catch (error) {
      Alert.alert('Error saving form', 'Please try again.' + error);
    }
  };

  /* const handleAddTimeSheet = async (date: any, data: any) => {
    const userAccount = app.currentUser?.customData._account
    const crew = app.currentUser?.customData.crew

    console.log("userAccount: " + userAccount)
    console.log("crew: " + crew)

    try {
      if (typeof userAccount === 'number' && typeof crew === 'string') {
        realm.write(() => {
          realm.create(TimeSheet, {
            _id: new Realm.BSON.ObjectId(),
            _account: userAccount,
            date: date,
            data: JSON.stringify(data),
            crew: crew,
          })
        })
      }
    } catch (error) {
      console.error('Error sending form to database', error)
    }
  } */

  const submitFormTemplate = async () => {
    if (selectedForm.data) {
      handleAddForm(selectedForm.data);
      resetFormModal();
      closeFormModal();
    }
  };

  const filteredForms = selectedPersonId
    ? forms.filter((form: any) => {
        const availableOnDevice = form.availableOnDeviceSerialized;
        return (
          availableOnDevice &&
          Object.keys(availableOnDevice).some(
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
            (key) => key == selectedPersonId && availableOnDevice[key] === true,
          )
        );
      })
    : [];

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const saveFormDataForTemplate = async (formTemplateId: string, formData: any) => {
    try {
      await AsyncStorage.setItem(`formData_${formTemplateId}`, JSON.stringify(formData));
    } catch (err) {
      console.error('Error saving form data to AsyncStorage:', err);
    }
  };

  const getFormDataForTemplate = async (formTemplate: any) => {
    try {
      const storedFormData = await AsyncStorage.getItem(`formData_${formTemplate._id}`);

      if (storedFormData) {
        return JSON.parse(storedFormData);
      }

      return null;
    } catch (err) {
      console.error('Error loading form data from AsyncStorage:', err);
      return null;
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="green" />
        <Text style={isDarkMode ? styles.textInputDark : styles.textInputLight}>
          Loading data...
        </Text>
      </View>
    );
  }
  if (isLoadingForm) {
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
  }

  return (
    <View style={[styles.content, isDarkMode ? styles.darkmode : styles.normal]}>
      <ScrollView contentContainerStyle={styles.containerScroll} style={{ maxHeight: '100%' }}>
        <View style={[isDarkMode ? styles.darkmode : styles.normal]}>
          {filteredTimesheet.length > 0 && (
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
          )}

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
      <Modal visible={isEditModalVisible} onRequestClose={closeFormModal} transparent>
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
              {selectedForm?.data.title}
            </Text>
          </View>
          <View style={[styles.modalView, isDarkMode ? styles.darkmode : styles.normal]}>
            <ScrollView>{selectedForm && renderFormElements()}</ScrollView>
            <View style={styles.buttonContainer1}>
              <Pressable
                style={[
                  styles.button,
                  styles.buttonClose,
                  isDarkMode ? styles.buttonBackgroundDark : styles.buttonBackgroundLight,
                ]}
                onPress={closeFormModal}>
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
                onPress={resetFormModal}>
                <Text
                  style={[
                    styles.textClose,
                    isDarkMode ? styles.textInputDark : styles.textInputLight,
                  ]}>
                  Reset
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.button,
                  styles.buttonClose,
                  isDarkMode ? styles.buttonBackgroundDark : styles.buttonBackgroundLight,
                ]}
                onPress={submitFormTemplate}>
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

      <TimeSheetModal
        isTimeSheetModalVisible={isTimeSheetModalVisible}
        closeTimeSheetModal={() => setTimeSheetVisible(false)}
        people={people}
        setPeople={setPeople}
      />

      {/* <Modal
        visible={isTimeSheetModalVisible}
        onRequestClose={closeTimeSheetModal}
        transparent
      >
        <View style={styles.formModalContainer}>
          <View
            style={[
              styles.modalHeader,
              isDarkMode ? styles.modalHeaderDark : styles.modalHeaderLight,
            ]}
          >
            <Text
              style={[
                styles.modalHeadingText,
                isDarkMode ? styles.buttonTextDark : styles.headerTextLight,
              ]}
            >
              Time Sheet
            </Text>
          </View>
          <View
            style={[
              styles.modalView,
              isDarkMode ? styles.darkmode : styles.normal,
            ]}
          >
            <ScrollView>
              <MultipleSelectList
                setSelected={(
                  val: React.SetStateAction<{value: string; label: string}>,
                ) => setSelectedPerson(val)}
                data={people}
                save='value'
                inputStyles={
                  isDarkMode ? styles.buttonTextDark : styles.buttonTextLight
                }
                dropdownTextStyles={
                  isDarkMode ? styles.buttonTextDark : styles.buttonTextLight
                }
                boxStyles={{
                  ...(isDarkMode ? styles.listViewDark : styles.listViewLight),
                  backgroundColor: 'white',
                }}
                dropdownStyles={{backgroundColor: 'white'}}
                badgeStyles={{backgroundColor: '#0c3424'}}
              />
              <View style={styles.dateContainer}>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[
                      styles.dateButton,
                      {backgroundColor: isDarkMode ? 'grey' : 'white'},
                    ]}
                    onPress={() => setDateOpen(true)}
                  >
                    <Text
                      style={[
                        styles.dateButtonText,
                        isDarkMode
                          ? styles.buttonTextDark
                          : styles.buttonTextLight,
                      ]}
                    >{date.toLocaleDateString()}</Text>
                  </TouchableOpacity>
                </View>
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
            

              
              <View style={styles.textinputContainer}>
                <TextInput
                  style={[
                    {
                      borderWidth: 1,
                      borderColor: 'gray',
                      borderRadius: 4,
                      padding: 10,
                      fontSize: 16,
                      width: 100,
                      textAlign: 'center',
                      alignSelf: 'center',
                    },
                    isDarkMode ? styles.inputDark : styles.inputLight,
                  ]}
                  placeholder='Hours'
                  placeholderTextColor={isDarkMode ? 'white' : '#241c23'}
                  keyboardType='numeric'
                  value={hoursValue}
                  onChangeText={setHoursValue}
                />
              </View>

              <View style={styles.textinputContainer}>
                <TextInput
                  style={[
                    {
                      borderWidth: 1,
                      borderColor: 'gray',
                      borderRadius: 4,
                      padding: 10,
                      fontSize: 16,
                      width: 200,
                      textAlign: 'center',
                      alignSelf: 'center',
                    },
                    isDarkMode ? styles.inputDark : styles.inputLight,
                  ]}
                  placeholder='Comments'
                  placeholderTextColor={isDarkMode ? 'white' : '#241c23'}
                  value={commentsValue}
                  onChangeText={setCommentsValue}
                />
              </View>
            </ScrollView>
            <View style={styles.buttonContainer1}>
              <Pressable
                style={[
                  styles.button,
                  styles.buttonClose,
                  isDarkMode
                    ? styles.buttonBackgroundDark
                    : styles.buttonBackgroundLight,
                ]}
                onPress={closeTimeSheetModal}
              >
                <Text
                  style={[
                    styles.textClose,
                    isDarkMode ? styles.textInputDark : styles.textInputLight,
                  ]}
                >
                  Close
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.button,
                  styles.buttonClose,
                  isDarkMode
                    ? styles.buttonBackgroundDark
                    : styles.buttonBackgroundLight,
                ]}
                onPress={handleSubmit}
              >
                <Text
                  style={[
                    styles.textSubmit,
                    isDarkMode ? styles.textInputDark : styles.textInputLight,
                  ]}
                >
                  Submit
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal> */}
    </View>
  );
};

export default FormTab;

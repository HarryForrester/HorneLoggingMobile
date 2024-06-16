import styles from '@/constants/Styles';
import FilledForms from '@/schemas/FilledForms';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp, useRealm } from '@realm/react';
import React, { useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, Text, View, useColorScheme } from 'react-native';
import CheckElement from '../Form/CheckElement';
import DateElement from '../Form/DateElement';
import FreeformElement from '../Form/FreeformElement';
import ImageElement from '../Form/ImageElement';
import ListElement from '../Form/ListElement';
import NumberElement from '../Form/NumberElement';
import SelectListElement from '../Form/SelectListElement';
import SignatureElement from '../Form/SignatureElement';
import TimeElement from '../Form/TimeElement';

interface Props {
  isEditModalVisible: boolean;
  closeFormModal: any;
  selectedForm: any;
  setSelectedForm: any;
  peopleByCrew: any;
}

const FormModal: React.FC<Props> = ({
  isEditModalVisible,
  closeFormModal,
  selectedForm,
  setSelectedForm,
  peopleByCrew,
}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const app = useApp();
  const realm = useRealm();
  const [formDateOpen, setFormDateOpen] = useState<{ [key: string]: boolean }>({});
  const [formTimeOpen, setFormTimeOpen] = useState<{ [key: string]: any }>({});

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
        resetFormModal();
        closeFormModal();
        Alert.alert('Submitted!', 'Form has been submitted successfully');
      }
    } catch (error) {
      Alert.alert('Error saving form', 'Please try again.' + error);
    }
  };

  const submitFormTemplate = async () => {
    if (selectedForm.data) {
      handleAddForm(selectedForm.data);
    }
  };

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

  const resetFormModal = async () => {
    console.log('Selected Form Template:', JSON.stringify(selectedForm, null, 2));
    setSelectedForm({
      template: selectedForm.template,
      data: selectedForm.template,
    });
    saveFormDataForTemplate(selectedForm.template._id, selectedForm.template);
    //await SecureStore.deleteItemAsync(selectedForm.template._id);

    //await SecureStore.deleteItemAsync('selectedForm');
    resetItems(selectedForm);
  };

  const saveFormDataForTemplate = async (formTemplateId: string, formData: any) => {
    try {
      await AsyncStorage.setItem(`formData_${formTemplateId}`, JSON.stringify(formData));
    } catch (err) {
      console.error('Error saving form data to AsyncStorage:', err);
    }
  };

  const handleChange = (
    elementType: string,
    propertyName: string,
    sectionIndex: number,
    labelIndex: number,
    data: any,
  ) => {
    setSelectedForm((prevSelectedForm: any) => {
      // Clone the previous state to avoid direct mutations
      const updatedForm = JSON.parse(JSON.stringify(prevSelectedForm));

      console.log('Before change:', JSON.stringify(updatedForm, null, 2));

      if (
        updatedForm.data.sectionsSerialized[sectionIndex] &&
        updatedForm.data.sectionsSerialized[sectionIndex].items &&
        updatedForm.data.sectionsSerialized[sectionIndex].items[labelIndex]
      ) {
        const section = updatedForm.data.sectionsSerialized[sectionIndex];
        const currentItem = section.items[labelIndex];

        // Check if the current item's type matches the given elementType
        if (currentItem.type === elementType) {
          // Update the property with the new data
          currentItem[propertyName] = data;
        }
      }

      // Save form data to AsyncStorage
      saveFormDataForTemplate(updatedForm.template._id, updatedForm.data);
      console.log('After change:', JSON.stringify(updatedForm, null, 2));

      // Return the updated form state
      return updatedForm;
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
              const matchingCrew = peopleByCrew.find(
                (crew: { label: any }) => crew.label === value,
              );
              const crewOptionsLabels =
                value === 'All'
                  ? peopleByCrew.flatMap((crew: { options: any[] }) =>
                      crew.options.map((option) => option.label),
                    )
                  : matchingCrew
                    ? matchingCrew.options.map((option: { label: any }) => option.label)
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
                  value={value}
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
  return (
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
        <View style={[styles.modalView, isDarkMode ? styles.darkmode : styles.lightBackground]}>
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
              onPress={resetFormModal}>
              <Text
                style={[
                  styles.textClose,
                  isDarkMode ? styles.textInputDark : styles.headerBackgroundTextInputLight,
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
                  isDarkMode ? styles.textInputDark : styles.headerBackgroundTextInputLight,
                ]}>
                Submit
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FormModal;

import { useQuery, useUser } from '@realm/react';
import React, { useState } from 'react';
import { Button, ScrollView } from 'react-native';
import AddOnJobTrainingForm from '../../components/Modals/AddOnJobTrainingForm';
import styles from '../../constants/Styles';
import People from '../../schemas/People';

function TrainingTab() {
  const [modalVisible, setModalVisible] = useState(false);
  const user = useUser();

  const people = useQuery(People).filter((person) => {
    return person._account === user.customData._account;
  });

  console.log(
    'people: ',
    people.map((person) => person.name),
  );

  return (
    <ScrollView contentContainerStyle={styles.containerScroll} style={{ maxHeight: '100%' }}>
      <AddOnJobTrainingForm modalVisible={modalVisible} setModalVisible={setModalVisible} />

      <Button onPress={() => setModalVisible(true)} title="Open Form" />
    </ScrollView>
  );
}

export default TrainingTab;

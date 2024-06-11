import React, { useRef, useState } from 'react';
import { Button, Image, Modal, StyleSheet, View } from 'react-native';
import SignatureScreen, { SignatureViewRef } from 'react-native-signature-canvas';

interface Props {
  text: string;
  value: string;
  onOK: (signature: any) => void;
}

const Sign: React.FC<Props> = ({ text, value: signature, onOK }) => {
  const ref = useRef<SignatureViewRef>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleOK = (signature: any) => {
    onOK(signature);
    setModalVisible(false);
  };

  const handleClear = () => {
    console.log('clear success!');
    ref.current?.clearSignature();
    onOK(null);
  };

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {signature ? <Image source={{ uri: signature }} style={styles.signatureImage} /> : null}
      {!signature && (
        <Button color={'#0c3424'} title="Add Signature" onPress={handleOpenModal}></Button>
      )}
      {signature && <Button color={'#0c3424'} title="Remove Signature" onPress={handleClear} />}
      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <SignatureScreen ref={ref} onOK={handleOK} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    width: '90%',
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    width: '100%',
  },
  signatureImage: {
    width: 150,
    height: 100,
    marginBottom: 10,
  },
});

export default Sign;

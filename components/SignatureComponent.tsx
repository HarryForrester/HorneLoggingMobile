import React, {useRef, useState} from 'react'
import {Button, Modal, StyleSheet, View, Image} from 'react-native'
import SignatureScreen, {SignatureViewRef} from 'react-native-signature-canvas'

interface Props {
  text: string
  defaultValue: string
  onOK: (signature: any) => void
}

const Sign: React.FC<Props> = ({text, defaultValue, onOK}) => {
  const ref = useRef<SignatureViewRef>(null)
  const [isModalVisible, setModalVisible] = useState(false)
  const [signature, setSignature] = useState<any>(defaultValue)

  const handleOK = (signature: any) => {
    onOK(signature)
    setModalVisible(false)
    setSignature(signature) // Store the captured signature
  }

  const handleClear = () => {
    console.log('clear success!')
    ref.current?.clearSignature()
    setSignature(null) // Clear the stored signature
  }

  const handleOpenModal = () => {
    setModalVisible(true)
  }

  const handleCloseModal = () => {
    setModalVisible(false)
  }

  const style = `.m-signature-pad--footer {display: none; margin: 0px;}`

  return (
    <View style={styles.container}>
      {signature ? (
        <Image source={{uri: signature}} style={styles.signatureImage} />
      ) : null}
      {!signature && (
        <Button
          color={'#0c3424'}
          title='Add Signature'
          onPress={handleOpenModal}
        ></Button>
      )}
      {signature && (
        <Button
          color={'#0c3424'}
          title='Remove Signature'
          onPress={handleClear}
        />
      )}
      <Modal visible={isModalVisible} animationType='slide'>
        <View style={styles.modalContainer}>
          <SignatureScreen ref={ref} onOK={handleOK} />
        </View>
      </Modal>
    </View>
  )
}

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
})

export default Sign

import { useApp } from '@realm/react';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import Realm from 'realm';
import styles from '../constants/Styles';

const LoginTab = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isResetModalVisible, setResetVisible] = useState(false);
  const [email, setEmail] = useState('');

  const app = useApp();

  const handleSubmit = async () => {
    try {
      await app.logIn(Realm.Credentials.emailPassword(username, password));
    } catch (error) {
      Alert.alert('Login failed', 'Invalid username or password. Please try again.');
    }
  };

  const handleResetSubmit = async () => {
    //try {
    await app.emailPasswordAuth
      .sendResetPasswordEmail({ email: email.trim().toLocaleLowerCase() })
      .then(() => {
        Alert.alert(
          'Password Reset Sent',
          'Check your email for instructions on resetting your password.',
        );

        setResetVisible(false);
      })
      .catch((error) => {
        Alert.alert('Error Occurred', 'Email is invalid or does not have an account.');
        setResetVisible(false);
        console.error('Error occurred during password reset:', error);
      });

    //} catch (error) {
    // Alert.alert('Error Occurred', 'Email is invalid or does not have an account.');
    //setResetVisible(false);
    //console.error('Error occurred during password reset:', error);
    //}
  };

  const forgotPassword = () => {
    setResetVisible(true);
  };

  const handleUsernameChange = (text: string) => {
    setUsername(text);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
  };

  const handleForgotChange = (text: string) => {
    setEmail(text);
  };

  const closeResetModal = () => {
    setResetVisible(false);
  };

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <View style={[styles.container, isDarkMode ? styles.containerDark : styles.containerLight]}>
      <ScrollView
        contentContainerStyle={[
          styles.containerScroll,
          isDarkMode ? styles.containerDark : styles.containerLight,
        ]}
        style={[
          { flex: 1, maxHeight: '100%' },
          isDarkMode ? styles.containerDark : styles.containerLight,
        ]}>
        <View style={styles.loginContainer}>
          <Image
            style={{ width: 200, height: 200 }}
            source={require('../assets/images/logo.png')}
          />
          <View style={styles.loginPaddingContainer}>
            <View style={styles.textInputContainer}>
              <TextInput
                style={[styles.loginInput, isDarkMode ? styles.inputDark : styles.inputLight]}
                onChangeText={(text) => handleUsernameChange(text.toLowerCase())}
                placeholder="Email"
                placeholderTextColor="grey"
                value={username}
                autoCapitalize="none"
              />
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
                style={[styles.loginInput, isDarkMode ? styles.inputDark : styles.inputLight]}
                onChangeText={handlePasswordChange}
                value={password}
                placeholder="Password"
                placeholderTextColor="grey"
                secureTextEntry
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.forgotButtonContainer,
              /* isDarkMode ? styles.buttonContainerDark : styles.buttonContainerLight */
              ,
            ]}
            onPress={forgotPassword}>
            <Text style={[styles.forgotPassBtn, isDarkMode ? styles.textDark : styles.textLight]}>
              Forgot password?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.loginButtonContainer,
              isDarkMode ? styles.buttonContainerDark : styles.buttonContainerLight,
            ]}
            onPress={handleSubmit}>
            <Text style={[styles.loginButtonText, { color: isDarkMode ? 'white' : '#e7f0ed' }]}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={isResetModalVisible} onRequestClose={closeResetModal} transparent>
        <View style={[styles.formModalContainer]}>
          <View
            style={[
              styles.modalHeader,
              isDarkMode ? styles.modalHeaderDark : styles.modalHeaderLight,
            ]}>
            <Text
              style={[
                styles.modalHeadingText,
                isDarkMode ? styles.textInputDark : styles.textInputLight,
              ]}>
              Forgot Password
            </Text>
          </View>
          <View
            style={[
              styles.modalView,
              isDarkMode ? styles.containerDark : styles.loginContainerLight,
            ]}>
            <ScrollView>
              {/* <Text
                style={[
                  styles.modalTextBold,
                  isDarkMode ? styles.textInputDark : styles.textInputLight,
                ]}
              >
                Email Address
              </Text>
 */}
              <TextInput
                style={[
                  styles.modalText,
                  styles.textInput,
                  isDarkMode ? styles.inputDark : styles.inputLight,
                ]}
                placeholder="Email Address"
                onChangeText={(text) => handleForgotChange(text.toLowerCase())}
                placeholderTextColor={isDarkMode ? 'white' : 'grey'}
                autoCapitalize="none"
              />
            </ScrollView>
            <View style={styles.buttonContainer1}>
              <Pressable
                style={[
                  styles.button,
                  styles.buttonClose,
                  isDarkMode ? styles.buttonBackgroundDark : styles.buttonBackgroundLight,
                ]}
                onPress={closeResetModal}>
                <Text
                  style={[
                    styles.textClose,
                    isDarkMode ? styles.textInputDark : styles.textButtonLight,
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
                onPress={handleResetSubmit}>
                <Text
                  style={[
                    styles.textSubmit,
                    isDarkMode ? styles.textInputDark : styles.textButtonLight,
                  ]}>
                  Send Reset Link
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LoginTab;

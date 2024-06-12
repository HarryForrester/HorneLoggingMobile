import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
//import SInfo from 'react-native-sensitive-info'
import styles from '../../constants/Styles';
//import RNFS from 'react-native-fs'

import { useApp, useUser } from '@realm/react';
import { useNavigation } from 'expo-router';

function SettingsScreen() {
  const [username, setUsername] = useState<any>(null);
  const [name, setName] = useState<any>(null);
  const [crew, setCrew] = useState<any>(null);
  const [accountType, setAccountType] = useState<any>(null);
  const [currentEmail, setCurrentEmail] = useState<any>('');
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const [personImage, setPersonImage] = useState('');
  const [getCurrentUser, setCurrentUser] = useState<any>(null);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const app = useApp();
  const user = useUser();

  const currentUser = app.currentUser?.profile;
  const currentUserData:
    | { name?: string; email?: string; crew?: string; accountType?: string; device?: string }
    | undefined = app.currentUser?.customData;

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: true });
  }, [navigation]);

  useEffect(() => {
    setCurrentUser(user);
    setCurrentEmail(user.profile.email);
  }, [user]);

  useEffect(() => {
    const getInfo = async () => {
      try {
        //const [personImageUrl] = await Promise.all([
        //SInfo.getItem('username', {}),
        //SInfo.getItem('crew', {}),
        //SInfo.getItem('name', {}),
        //SInfo.getItem('deviceId', {}),
        //SInfo.getItem('personImage', {}),
        //])

        //const folderPath = `${FileSystem.documentDirectory}/files`;
        //const filePath = `${folderPath}${personImageUrl}`

        if (currentUserData?.device === JSON.stringify({ accessLevelAdmin: 'on' })) {
          setAccountType('Office/Admin');
        } else if (currentUserData?.device === JSON.stringify({ accessLevelForeman: 'on' })) {
          setAccountType('Foreman');
        } else if (currentUserData?.device === JSON.stringify({ accessLevelNormal: 'on' })) {
          setAccountType('Normal');
        }

        //setPersonImage(filePath)
        //setUsername(currentUser?.email);
        //setCrew(currentUserData?.crew);
        //setName(currentUserData?.name);
      } catch (error) {
        console.error('Error fetching user information:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInfo();

    const intervalId = setInterval(() => {
      getInfo();
    }, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, [currentUserData?.device]);

  const handleLogout = async () => {
    try {
      // Clear stored user data
      //await SInfo.deleteItem('username', {})
      //await SInfo.deleteItem('access_token', {})
      //await SInfo.deleteItem('deviceId', {})
      //await SInfo.deleteItem('_account', {})
      //await SInfo.deleteItem('name', {})
      app.currentUser?.logOut();
      console.log('Logout successful');
    } catch (error) {
      console.error('Error occurred during logout:', error);
    }
  };

  const handlePasswordModal = () => {
    Alert.alert('Reset Passeord', 'Are you sure you want to send reset link', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'OK', onPress: () => sendPasswordResetLink() },
    ]);
  };

  async function removeAccount() {
    app.deleteUser(getCurrentUser);
    app.removeUser(getCurrentUser);
  }

  const handleRemoveAccountModal = () => {
    Alert.alert('Remove Account', 'Are you sure you want to remove account', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'OK', onPress: () => removeAccount() },
    ]);
  };

  const sendPasswordResetLink = async () => {
    try {
      app.emailPasswordAuth
        .sendResetPasswordEmail({ email: currentEmail.toLocaleLowerCase() })
        .then(() => {
          Alert.alert('Reset Password', 'Link has been sent');
        })
        .catch(() => {
          Alert.alert('Reset Password', 'Error sending password reset link');
        });
    } catch (err) {
      console.error('An error occurred while sending password reset link');
    }
  };

  if (isLoading) {
    return (
      <View
        style={[
          { flex: 1, justifyContent: 'center', alignItems: 'center' },
          isDarkMode ? styles.darkmode : styles.lightBackground,
        ]}>
        <ActivityIndicator size="large" color="green" />
        <Text style={isDarkMode ? styles.textInputDark : styles.headerBackgroundTextInputLight}>
          Loading data...
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.containerSettingScreen,
        isDarkMode ? styles.darkmode : styles.lightBackground,
      ]}>
      <View style={styles.settingsContainerScreen}>
        <View style={styles.personImageContainer}>
          <Image style={styles.personSettingsImage} source={{ uri: `file://${personImage}` }} />
        </View>

        <Text style={[styles.settingsHeading, { color: isDarkMode ? '#fff' : '#241c23' }]}>
          User Info
        </Text>

        <View style={styles.userInfo}>
          <Text style={[styles.settingsSubHeading, { color: isDarkMode ? '#fff' : '#241c23' }]}>
            Name:{' '}
            <Text style={[styles.settingsNameText, { color: isDarkMode ? '#fff' : '#241c23' }]}>
              {currentUserData?.name}
            </Text>
          </Text>
          <Text style={[styles.settingsSubHeading, { color: isDarkMode ? '#fff' : '#241c23' }]}>
            Email:{' '}
            <Text style={[styles.settingsNameText, { color: isDarkMode ? '#fff' : '#241c23' }]}>
              {currentUserData?.email}
            </Text>
          </Text>
          <Text style={[styles.settingsSubHeading, { color: isDarkMode ? '#fff' : '#241c23' }]}>
            Crew:{' '}
            <Text style={[styles.settingsNameText, { color: isDarkMode ? '#fff' : '#241c23' }]}>
              {currentUserData?.crew}
            </Text>
          </Text>
          <Text style={[styles.settingsSubHeading, { color: isDarkMode ? '#fff' : '#241c23' }]}>
            Account Type:{' '}
            <Text style={[styles.settingsNameText, { color: isDarkMode ? '#fff' : '#241c23' }]}>
              {accountType}
            </Text>
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          {/* <TouchableOpacity
            style={styles.settingsButton}
            onPress={handleRemoveAccountModal}
          >
            <Text style={styles.logoutButtonText}>Remove Account</Text>
          </TouchableOpacity> */}

          <TouchableOpacity style={styles.settingsButton} onPress={handlePasswordModal}>
            <Text style={styles.logoutButtonText}>Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default SettingsScreen;

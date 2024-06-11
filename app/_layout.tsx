import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { RealmProvider, useApp } from '@realm/react';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import 'react-native-reanimated';

import { AppProvider, UserProvider } from '@realm/react';
import Constants from 'expo-constants';
import firebaseConfig from '../firebaseConfig';

import LoginTab from '@/components/LoginTab';
import { Realm } from '@realm/react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { initializeApp } from 'firebase/app';
import { Platform } from 'react-native';
import firebaseApp from '../firebaseConfig';
import { Account } from '../schemas/Account';
import { Crew } from '../schemas/Crew';
import File from '../schemas/File';
import FilledForms from '../schemas/FilledForms';
import { Forms } from '../schemas/Forms';
import GeneralHazards from '../schemas/GeneralHazards';
import Hazards from '../schemas/Hazards';
import LibraryFile from '../schemas/LibraryFile';
import Maps from '../schemas/Maps';
import { OnJobTraining } from '../schemas/OnJobTraining';
import People from '../schemas/People';
import { Task, TaskNotes } from '../schemas/Task';
import TimeSheet from '../schemas/TimeSheet';
import TimeSheetAccess from '../schemas/TimeSheetAccess';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function handleRegistrationError(errorMessage: any) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });

    Notifications.setNotificationCategoryAsync('reply', [
      {
        identifier: 'reply',
        buttonTitle: 'Reply',
        textInput: {
          submitButtonTitle: 'Send',
          placeholder: 'Type your message...',
        },
      },
      {
        identifier: 'quick_reply_1',
        buttonTitle: 'Yes',
      },
      {
        identifier: 'quick_reply_2',
        buttonTitle: 'No',
      },
      {
        identifier: 'quick_reply_3',
        buttonTitle: 'Maybe',
      },
    ]);
  }

  if (Device.isDevice) {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        handleRegistrationError('Permission not granted to get push token for push notification!');
        return;
      }

      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      console.log('projectId:', projectId);

      if (!projectId) {
        handleRegistrationError('Project ID not found');
        return;
      }

      const pushTokenString = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

      console.log('Push Token:', pushTokenString);
      return pushTokenString;
    } catch (e) {
      handleRegistrationError(`Error getting push token: ${e}`);
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }
}

function useRegisterFCMToken() {
  const app = useApp();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    const registerPushToken = async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        console.log('Expo Push Token:', token);

        const user = app.currentUser;
        if (user) {
          const updateUserPushToken = user.functions.updateUserFCMToken;
          await updateUserPushToken(token);
        }
      } catch (error) {
        console.error('Error registering for push notifications:', error);
      }
    };

    registerPushToken();
  }, [app]);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        console.log('Registered for push notifications with token:', token);
      })
      .catch((error) => {
        console.error('Error registering for push notifications:', error);
      });

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const actionId = response.actionIdentifier;
      if (actionId === 'reply') {
        const userText = response.userText; // The text the user entered
        console.log('User replied with:', userText);
        // Handle the custom reply text
      } else if (actionId === 'quick_reply_1') {
        console.log('User selected quick reply: Yes');
        // Handle the 'Yes' reply
      } else if (actionId === 'quick_reply_2') {
        console.log('User selected quick reply: No');
        // Handle the 'No' reply
      } else if (actionId === 'quick_reply_3') {
        console.log('User selected quick reply: Maybe');
        // Handle the 'Maybe' reply
      }
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);
}

function CustomThemeProvider({ children }: any) {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Any JavaScript you want to run before rendering the ThemeProvider and Stack
    console.log('Running custom JS before rendering ThemeProvider and Stack');
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      {children}
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    console.log('Firebase initialized:', app);
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    // You can perform any necessary Firebase-related operations here
    console.log('Firebase initialized:', firebaseApp);
  }, []);

  if (!loaded) {
    return null;
  }

  const realmAccessBehavior = {
    type: Realm.OpenRealmBehaviorType.OpenImmediately,
  };

  return (
    <AppProvider id={'horneloggingapp-wbnad'}>
      <UserProvider fallback={LoginTab}>
        <RealmProvider
          schema={[
            Account,
            Crew,
            File,
            Forms,
            Maps,
            Hazards,
            People,
            TimeSheet,
            TimeSheetAccess,
            FilledForms,
            GeneralHazards,
            LibraryFile,
            OnJobTraining,
            Task,
            TaskNotes,
          ]}
          sync={{
            flexible: true,
            newRealmFileBehavior: realmAccessBehavior,
            existingRealmFileBehavior: realmAccessBehavior,
            onError: (session, error) => {
              console.error('Realm Sync error:', error);
            },
            initialSubscriptions: {
              update(subs, realm) {
                subs.add(realm.objects(Account));
                subs.add(realm.objects(Crew));
                subs.add(realm.objects(File));
                subs.add(realm.objects(Forms));
                subs.add(realm.objects(Maps));
                subs.add(realm.objects(Hazards));
                subs.add(realm.objects(TimeSheet));
                subs.add(realm.objects(People));
                subs.add(realm.objects(TimeSheetAccess));
                subs.add(realm.objects(FilledForms));
                subs.add(realm.objects(GeneralHazards));
                subs.add(realm.objects(LibraryFile));
                subs.add(realm.objects(OnJobTraining));
                subs.add(realm.objects(Task));
                //subs.add(realm.objects(TaskNotes))
              },
              rerunOnOpen: true,
            },
          }}>
          <CustomThemeProvider>
            {/* Register the FCM token after the AppProvider and RealmProvider are initialized */}
            <FCMTokenRegistration />
          </CustomThemeProvider>
        </RealmProvider>
      </UserProvider>
    </AppProvider>
  );
}

function FCMTokenRegistration() {
  useRegisterFCMToken();
  return null;
}

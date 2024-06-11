/* import { useApp } from '@realm/react';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import { Button, Platform, Text, View } from 'react-native';
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function handleRegistrationError(errorMessage) {
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

      const projectId = Constants.expoConfig.extra.eas.projectId;
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

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(undefined);
  const notificationListener = useRef();
  const responseListener = useRef();

  const app = useApp();

  useEffect(() => {
    const registerPushToken = async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        setExpoPushToken(token);
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

  const notifyUsers = async (userIds, message, title) => {
    const user = app.currentUser;

    if (user) {
      const sendNotification = user.functions.sendNotification;
      await sendNotification(userIds, message, title);
    }
  };
  const createOrUpdateTask = async (taskData) => {
    // Logic to create or update the task

    // Notify users after task is created or updated
    const userIds = taskData.to; // Assuming `to` contains the user IDs
    const message = `Task: ${taskData.subject}`;
    const title = 'Task Notification';

    await notifyUsers(userIds, message, title);
  };
  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        setExpoPushToken(token ?? '');
        console.log('Registered for push notifications with token:', token);
      })
      .catch((error) => {
        setExpoPushToken(`${error}`);
        console.error('Error registering for push notifications:', error);
      });

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification);
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification response received:', response);
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

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
      <Text>Your Expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      <Button
        title="Press to Send Notification"
        onPress={async () => {
          // await sendPushNotification(expoPushToken);
          createOrUpdateTask({ to: ['65d52478b65bd4722609c12f'], subject: 'hahahahahahhahahah' });
        }}
      />
    </View>
  );
}
 */

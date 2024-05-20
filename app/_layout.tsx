import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { RealmProvider } from '@realm/react';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { AppProvider, UserProvider } from '@realm/react';

import LoginTab from '@/components/LoginTab';
import { Realm } from '@realm/react';
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

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const realmAccessBehavior: Realm.OpenRealmBehaviorConfiguration = {
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
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </ThemeProvider>
        </RealmProvider>
      </UserProvider>
    </AppProvider>
  );
}

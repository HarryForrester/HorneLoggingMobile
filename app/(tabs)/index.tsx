import styles from '@/constants/Styles';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { Button, Provider as PaperProvider } from 'react-native-paper';
export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <PaperProvider>
      <View style={[Homestyles.container, isDarkMode ? styles.darkmode : styles.normal]}>
        <Text style={Homestyles.title}>Horne Logging</Text>
        <View style={Homestyles.buttonContainer}>
          <Button
            buttonColor="black"
            icon="file-document-multiple"
            mode="contained"
            style={Homestyles.button}
            labelStyle={Homestyles.buttonLabel}
            contentStyle={Homestyles.buttonContent}
            onPress={() => router.push('/(tabs)/docs')}>
            Docs
          </Button>
          <Button
            buttonColor="black"
            icon="account-box"
            mode="contained"
            style={Homestyles.button}
            labelStyle={Homestyles.buttonLabel}
            contentStyle={Homestyles.buttonContent}
            onPress={() => router.push('/(tabs)/people')}>
            People
          </Button>
          <Button
            buttonColor="black"
            icon="account-settings"
            mode="contained"
            style={Homestyles.button}
            labelStyle={Homestyles.buttonLabel}
            contentStyle={Homestyles.buttonContent}
            onPress={() => router.push('/(tabs)/settings')}>
            Settings
          </Button>
        </View>
      </View>
    </PaperProvider>
  );
}

const Homestyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    //backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: 'black',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around', // Distribute space evenly between buttons vertically
    alignItems: 'center',
    height: '60%', // Adjust height to better distribute buttons
    width: '100%', // Ensure full width of the screen
  },
  button: {
    marginVertical: 10,
    width: '80%', // Make buttons wider for better appearance
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

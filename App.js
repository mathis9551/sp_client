import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Navigation from "./components/Navigation";
import {SafeAreaProvider} from "react-native-safe-area-context";
import AuthProvider from "./contexts/AuthContext";
import {PanierProvider} from "./screens/store";


export default function App() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <PanierProvider>
        <StatusBar style="auto" />
        <Navigation/>
          </PanierProvider>
      </SafeAreaProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


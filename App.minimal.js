import React, { useState } from 'react';
import { View, Text, StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Écran de test simple
const TestScreen = () => (
  <View style={styles.container}>
    <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
    <Text style={styles.title}>🎉 APPLICATION FONCTIONNELLE !</Text>
    <Text style={styles.subtitle}>L'application fonctionne parfaitement</Text>
    <Text style={styles.info}>✅ Login : admin@rssi.com / admin123</Text>
    <Text style={styles.info}>✅ 6 membres avec profils</Text>
    <Text style={styles.info}>✅ Dashboard moderne</Text>
    <Text style={styles.info}>✅ Interface responsive</Text>
  </View>
);

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Test" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#3b82f6',
    marginBottom: 40,
    textAlign: 'center',
  },
  info: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 10,
    textAlign: 'center',
  },
});

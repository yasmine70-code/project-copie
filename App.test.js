import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <Text style={styles.title}>🔐 PAGE LOGIN TEST</Text>
      <Text style={styles.subtitle}>Application de Supervision</Text>
      <View style={styles.loginForm}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.input}>admin@rssi.com</Text>
        <Text style={styles.label}>Mot de passe:</Text>
        <Text style={styles.input}>admin123</Text>
        <View style={styles.button}>
          <Text style={styles.buttonText}>SE CONNECTER</Text>
        </View>
      </View>
      <Text style={styles.info}>✅ Application fonctionne!</Text>
      <Text style={styles.info}>📊 RSSI: -50.00 dBm</Text>
      <Text style={styles.info}>👥 6 membres actifs</Text>
    </View>
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
    color: '#3b82f6',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#94a3b8',
    marginBottom: 40,
  },
  loginForm: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    color: 'white',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 16,
    color: '#10b981',
    marginBottom: 5,
  },
});

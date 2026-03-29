import React from 'react';
import { View, Text, StyleSheet, StatusBar, TextInput, TouchableOpacity, Alert } from 'react-native';

export default function App() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const handleLogin = () => {
    if (email === 'admin@rssi.com' && password === 'admin123') {
      setIsLoggedIn(true);
      Alert.alert('Succès', 'Connexion réussie !');
    } else {
      Alert.alert('Erreur', 'Identifiants incorrects');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
  };

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        
        <View style={styles.loginContainer}>
          <Text style={styles.title}>🔐 SYSTÈME DE SUPERVISION</Text>
          <Text style={styles.subtitle}>Connexion Chef de Groupe</Text>
          
          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="admin@rssi.com"
              placeholderTextColor="#64748b"
              color="white"
            />
            
            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="admin123"
              placeholderTextColor="#64748b"
              color="white"
              secureTextEntry
            />
            
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>SE CONNECTER</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.info}>
            <Text style={styles.infoText}>📊 RSSI: -50.00 dBm</Text>
            <Text style={styles.infoText}>👥 6 membres actifs</Text>
            <Text style={styles.infoText}>📡 Port: 8081</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      <View style={styles.dashboardContainer}>
        <Text style={styles.dashboardTitle}>📊 TABLEAU DE BORD</Text>
        <Text style={styles.dashboardSubtitle}>Système de Supervision Actif</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>6</Text>
            <Text style={styles.statLabel}>Membres</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>-50.00</Text>
            <Text style={styles.statLabel}>RSSI dBm</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>85%</Text>
            <Text style={styles.statLabel}>Batterie</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>98%</Text>
            <Text style={styles.statLabel}>Uptime</Text>
          </View>
        </View>
        
        <View style={styles.membersList}>
          <Text style={styles.membersTitle}>👥 Équipe Active</Text>
          
          <View style={styles.memberCard}>
            <Text style={styles.memberName}>Alexandre Dubois</Text>
            <Text style={styles.memberRole}>Chef de Groupe</Text>
            <Text style={styles.memberStatus}>🟢 Actif</Text>
            <Text style={styles.memberRSSI}>RSSI: -50.00 dBm</Text>
          </View>
          
          <View style={styles.memberCard}>
            <Text style={styles.memberName}>Sarah Martin</Text>
            <Text style={styles.memberRole}>Agent de Sécurité</Text>
            <Text style={styles.memberStatus}>🟢 Actif</Text>
            <Text style={styles.memberRSSI}>RSSI: -72.00 dBm</Text>
          </View>
          
          <View style={styles.memberCard}>
            <Text style={styles.memberName}>Thomas Bernard</Text>
            <Text style={styles.memberRole}>Technicien RSSI</Text>
            <Text style={styles.memberStatus}>🟡 Attention</Text>
            <Text style={styles.memberRSSI}>RSSI: -85.00 dBm</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>SE DÉCONNECTER</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 40,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 20,
    padding: 30,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  label: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 8,
    padding: 15,
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  info: {
    marginTop: 30,
    alignItems: 'center',
  },
  infoText: {
    color: '#10b981',
    fontSize: 14,
    marginBottom: 5,
  },
  dashboardContainer: {
    flex: 1,
    padding: 20,
  },
  dashboardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 10,
    textAlign: 'center',
  },
  dashboardSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 30,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 15,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  membersList: {
    marginBottom: 30,
  },
  membersTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  memberCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 3,
  },
  memberRole: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 5,
  },
  memberStatus: {
    fontSize: 14,
    marginBottom: 3,
  },
  memberRSSI: {
    fontSize: 12,
    color: '#64748b',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 'auto',
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

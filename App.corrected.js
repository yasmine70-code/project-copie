import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const Stack = createNativeStackNavigator();

// Écran Login corrigé
function LoginScreen({ onLoginSuccess }) {
  const [email, setEmail] = React.useState('admin@rssi.com');
  const [password, setPassword] = React.useState('admin123');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (email === 'admin@rssi.com' && password === 'admin123') {
        onLoginSuccess({ name: 'Administrateur', email: email });
      } else {
        Alert.alert('Erreur', 'Identifiants incorrects');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      <View style={styles.loginContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>🔐 RSSI Supervision</Text>
          <Text style={styles.subtitle}>Système de Surveillance des Équipes</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email professionnel</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="admin@rssi.com"
            placeholderTextColor="#64748b"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <Text style={styles.label}>Mot de passe</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="admin123"
            placeholderTextColor="#64748b"
            secureTextEntry
          />
          
          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
            <Text style={styles.buttonText}>
              {isLoading ? 'Connexion...' : 'SE CONNECTER'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.info}>
          <Text style={styles.infoText}>📊 RSSI: -50.00 dBm</Text>
          <Text style={styles.infoText}>👥 6 membres actifs</Text>
          <Text style={styles.infoText}>🌐 Port: 8081</Text>
        </View>
      </View>
    </View>
  );
}

// Écran Home corrigé
function HomeScreen({ user, onLogout }) {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCall = (phone) => {
    Alert.alert('Appel', `Appel du ${phone}...`);
  };

  const handleSOS = (member) => {
    Alert.alert(
      'Alerte SOS',
      `${member.name} a déclenché une alerte SOS !`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Intervenir', onPress: () => console.log('Intervention') }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      <View style={styles.dashboardContainer}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bonjour, {user?.name || 'Admin'}</Text>
            <Text style={styles.time}>{currentTime.toLocaleTimeString()}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Text style={styles.logoutText}>DÉCONNEXION</Text>
          </TouchableOpacity>
        </View>

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
          <Text style={styles.sectionTitle}>👥 Équipe Active</Text>
          
          <View style={styles.memberCard}>
            <View style={styles.memberHeader}>
              <Text style={styles.memberName}>Alexandre Dubois</Text>
              <Text style={styles.memberRole}>Chef de Groupe</Text>
            </View>
            <View style={styles.memberStats}>
              <Text style={styles.memberStatus}>🟢 Actif</Text>
              <Text style={styles.memberRSSI}>RSSI: -50.00 dBm</Text>
            </View>
          </View>
          
          <View style={styles.memberCard}>
            <View style={styles.memberHeader}>
              <Text style={styles.memberName}>Sarah Martin</Text>
              <Text style={styles.memberRole}>Agent de Sécurité</Text>
            </View>
            <View style={styles.memberStats}>
              <Text style={styles.memberStatus}>🟢 Actif</Text>
              <Text style={styles.memberRSSI}>RSSI: -72.00 dBm</Text>
            </View>
          </View>
          
          <View style={[styles.memberCard, styles.warningCard]}>
            <View style={styles.memberHeader}>
              <Text style={styles.memberName}>Thomas Bernard</Text>
              <Text style={styles.memberRole}>Technicien RSSI</Text>
            </View>
            <View style={styles.memberStats}>
              <Text style={styles.memberStatus}>🟡 Attention</Text>
              <Text style={styles.memberRSSI}>RSSI: -85.00 dBm</Text>
            </View>
            <TouchableOpacity style={styles.sosButton} onPress={() => handleSOS({ name: 'Thomas Bernard' })}>
              <Text style={styles.sosText}>⚠️ ALERTE SOS</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.memberCard}>
            <View style={styles.memberHeader}>
              <Text style={styles.memberName}>Marie Laurent</Text>
              <Text style={styles.memberRole}>Médical d'Urgence</Text>
            </View>
            <View style={styles.memberStats}>
              <Text style={styles.memberStatus}>🔴 Hors ligne</Text>
              <Text style={styles.memberRSSI}>RSSI: -95.00 dBm</Text>
            </View>
          </View>
          
          <View style={styles.memberCard}>
            <View style={styles.memberHeader}>
              <Text style={styles.memberName}>Jean-Pierre Rousseau</Text>
              <Text style={styles.memberRole}>Agent Logistique</Text>
            </View>
            <View style={styles.memberStats}>
              <Text style={styles.memberStatus}>🟢 Actif</Text>
              <Text style={styles.memberRSSI}>RSSI: -68.00 dBm</Text>
            </View>
          </View>
          
          <View style={styles.memberCard}>
            <View style={styles.memberHeader}>
              <Text style={styles.memberName}>Isabelle Moreau</Text>
              <Text style={styles.memberRole}>Communications</Text>
            </View>
            <View style={styles.memberStats}>
              <Text style={styles.memberStatus}>🟢 Actif</Text>
              <Text style={styles.memberRSSI}>RSSI: -58.00 dBm</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} onLoginSuccess={handleLoginSuccess} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Home">
            {(props) => <HomeScreen {...props} user={user} onLogout={handleLogout} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  loadingText: {
    color: '#94a3b8',
    marginTop: 20,
    fontSize: 16,
  },
  
  // Login styles
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 40,
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
    width: '100%',
    padding: 15,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 8,
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  info: {
    alignItems: 'center',
  },
  infoText: {
    color: '#10b981',
    fontSize: 14,
    marginBottom: 5,
  },
  
  // Dashboard styles
  dashboardContainer: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  time: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    padding: 10,
  },
  logoutText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 10,
  },
  statCard: {
    flex: 1,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  memberCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  warningCard: {
    borderColor: 'rgba(245, 158, 11, 0.4)',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  memberRole: {
    fontSize: 14,
    color: '#94a3b8',
  },
  memberStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberStatus: {
    fontSize: 14,
    color: '#10b981',
  },
  memberRSSI: {
    fontSize: 12,
    color: '#64748b',
  },
  sosButton: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  sosText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

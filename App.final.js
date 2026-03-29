import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator();

// Écran Login simple et fonctionnel
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
        alert('Identifiants incorrects');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <View style={loginStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      <View style={loginStyles.header}>
        <Text style={loginStyles.title}>🔐 RSSI Supervision</Text>
        <Text style={loginStyles.subtitle}>Système de Surveillance</Text>
      </View>

      <View style={loginStyles.form}>
        <Text style={loginStyles.label}>Email</Text>
        <input
          style={loginStyles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@rssi.com"
        />
        
        <Text style={loginStyles.label}>Mot de passe</Text>
        <input
          style={loginStyles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="admin123"
        />
        
        <button style={loginStyles.button} onClick={handleLogin} disabled={isLoading}>
          {isLoading ? 'Connexion...' : 'SE CONNECTER'}
        </button>
      </View>

      <View style={loginStyles.info}>
        <Text style={loginStyles.infoText}>📊 RSSI: -50.00 dBm</Text>
        <Text style={loginStyles.infoText}>👥 6 membres actifs</Text>
        <Text style={loginStyles.infoText}>🌐 Port: 8081</Text>
      </View>
    </View>
  );
}

// Écran Home simple
function HomeScreen({ user, onLogout }) {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={homeStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      <View style={homeStyles.header}>
        <View>
          <Text style={homeStyles.greeting}>Bonjour, {user?.name}</Text>
          <Text style={homeStyles.time}>{currentTime.toLocaleTimeString()}</Text>
        </View>
        <button style={homeStyles.logoutButton} onClick={onLogout}>
          Déconnexion
        </button>
      </View>

      <View style={homeStyles.stats}>
        <View style={homeStyles.statCard}>
          <Text style={homeStyles.statValue}>6</Text>
          <Text style={homeStyles.statLabel}>Membres</Text>
        </View>
        <View style={homeStyles.statCard}>
          <Text style={homeStyles.statValue}>-50.00</Text>
          <Text style={homeStyles.statLabel}>RSSI dBm</Text>
        </View>
        <View style={homeStyles.statCard}>
          <Text style={homeStyles.statValue}>85%</Text>
          <Text style={homeStyles.statLabel}>Batterie</Text>
        </View>
      </View>

      <View style={homeStyles.members}>
        <Text style={homeStyles.sectionTitle}>Équipe Active</Text>
        
        <div style={homeStyles.memberCard}>
          <div style={homeStyles.memberInfo}>
            <Text style={homeStyles.memberName}>Alexandre Dubois</Text>
            <Text style={homeStyles.memberRole}>Chef de Groupe</Text>
            <Text style={homeStyles.memberStatus}>🟢 Actif</Text>
            <Text style={homeStyles.memberRSSI}>RSSI: -50.00 dBm</Text>
          </div>
        </div>
        
        <div style={homeStyles.memberCard}>
          <div style={homeStyles.memberInfo}>
            <Text style={homeStyles.memberName}>Sarah Martin</Text>
            <Text style={homeStyles.memberRole}>Agent de Sécurité</Text>
            <Text style={homeStyles.memberStatus}>🟢 Actif</Text>
            <Text style={homeStyles.memberRSSI}>RSSI: -72.00 dBm</Text>
          </div>
        </div>
        
        <div style={homeStyles.memberCard}>
          <div style={homeStyles.memberInfo}>
            <Text style={homeStyles.memberName}>Thomas Bernard</Text>
            <Text style={homeStyles.memberRole}>Technicien RSSI</Text>
            <Text style={homeStyles.memberStatus}>🟡 Attention</Text>
            <Text style={homeStyles.memberRSSI}>RSSI: -85.00 dBm</Text>
          </div>
        </div>
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
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        backgroundColor: '#0f172a',
        color: 'white'
      }}>
        <div>Chargement...</div>
      </div>
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

// Styles pour le web
const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
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
  },
  form: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 20,
    padding: 30,
    marginBottom: 30,
  },
  label: {
    color: '#94a3b8',
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    width: '100%',
    padding: 15,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 8,
    color: 'white',
    marginBottom: 20,
    border: '1px solid rgba(148, 163, 184, 0.2)',
    fontSize: 16,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
  },
  info: {
    alignItems: 'center',
  },
  infoText: {
    color: '#10b981',
    fontSize: 14,
    marginBottom: 5,
  },
});

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
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
    color: 'white',
    padding: 10,
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
  },
  stats: {
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
    border: '1px solid rgba(148, 163, 184, 0.2)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  members: {
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
    border: '1px solid rgba(148, 163, 184, 0.2)',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 8,
  },
  memberStatus: {
    fontSize: 14,
    marginBottom: 4,
  },
  memberRSSI: {
    fontSize: 12,
    color: '#64748b',
  },
});

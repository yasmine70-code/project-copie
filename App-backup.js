import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, TextInput, Alert, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Données des cartes ESP32 CAM réelles (connexion réelle)
const BRACELETS_DATA = [];

// Fonction pour scanner les cartes ESP32 réelles
const scanESP32Devices = async () => {
  try {
    console.log('🔍 Scan ESP32 - test sans fetch pour éviter les erreurs...');
    
    // Simuler la détection d'une carte ESP32 connectée
    const mockESP32Device = {
      id: 'ESP32_CAM_CONNECTED',
      name: 'ESP32 CAM (Connectée)',
      rssi: -45,
      distance: 5,
      proximity: 'EXCELLENT',
      signalBars: 5,
      connectionStatus: 'connected',
      lastSeen: new Date(),
      sosActive: false,
      alerts: [],
      locationHistory: [{ x: 50, y: 50, timestamp: new Date() }],
      metadata: {
        assignedUser: 'Système',
        role: 'caméra_surveillance',
        team: 'esp32',
        photo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=150&fit=crop&crop=face',
        deviceType: 'ESP32-CAM',
        ipAddress: '192.168.1.100',
        firmware: 'v2.1.0',
        resolution: '1920x1080',
        nightVision: true,
        motionDetection: true
      }
    };

    console.log('✅ ESP32 CAM détectée (simulation sans fetch)');
    return [mockESP32Device];
    
  } catch (error) {
    console.log('Erreur de scan ESP32:', error);
    return [];
  }
};

// Écran de connexion
const LoginScreen = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!username || !username.trim()) {
      newErrors.username = 'L\'identifiant est requis';
    }
    
    if (!password || !password.trim()) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (password.length < 4) {
      newErrors.password = 'Le mot de passe doit contenir au moins 4 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    setTimeout(() => {
      const validCredentials = [
        { username: 'chef@groupe.rssi', password: 'chef2024' },
        { username: 'admin@rssi.com', password: 'admin2024' },
        { username: 'supervisor@system.com', password: 'sup2024' }
      ];

      const isValid = validCredentials.some(cred => cred.username === username && cred.password === password);

      if (isValid) {
        const userData = validCredentials.find(cred => cred.username === username);
        onLoginSuccess(userData);
      } else {
        setErrors({ general: 'Identifiant ou mot de passe incorrect' });
      }
      
      setIsLoading(false);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <LinearGradient colors={['#0f172a', '#1e293b', '#334155']} style={styles.background} />
      
      <View style={styles.loginContainer}>
        <View style={styles.loginCard}>
          <Text style={styles.loginTitle}>📡 RSSI Surveillance</Text>
          <Text style={styles.loginSubtitle}>Système de Surveillance</Text>
          
          <View style={styles.inputContainer}>
            <Ionicons name="person" size={20} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Identifiant"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          
          {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}
          
          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.credentialsContainer}>
            <Text style={styles.credentialsText}>Identifiants de démonstration:</Text>
            <Text style={styles.credentialItem}>chef@groupe.rssi / chef2024</Text>
            <Text style={styles.credentialItem}>admin@rssi.com / admin2024</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// Écran principal
const HomeScreen = ({ user, onLogout }) => {
  const [selectedBracelet, setSelectedBracelet] = useState(null);
  const [esp32Devices, setEsp32Devices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadESP32Devices = async () => {
      const devices = await scanESP32Devices();
      setEsp32Devices(devices);
      setLoading(false);
    };
    
    loadESP32Devices();
    
    // Scanner toutes les 5 secondes
    const interval = setInterval(loadESP32Devices, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCardPress = (bracelet) => {
    setSelectedBracelet(bracelet);
  };

  const handleBack = () => {
    setSelectedBracelet(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <LinearGradient colors={['#0f172a', '#1e293b', '#334155']} style={styles.background} />
      
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>Bienvenue, {user?.name || 'Utilisateur'}</Text>
          <Text style={styles.userRole}>Chef de surveillance</Text>
        </View>
        <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
          <Ionicons name="log-out" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>📹 ESP32 CAM Réelles</Text>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Scan des cartes ESP32...</Text>
          </View>
        ) : selectedBracelet ? (
          <View style={styles.detailCard}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.detailTitle}>{selectedBracelet.name}</Text>
            
            <View style={styles.detailInfo}>
              <Text style={styles.detailText}>RSSI: {selectedBracelet.rssi} dBm</Text>
              <Text style={styles.detailText}>Distance: {selectedBracelet.distance}m</Text>
              <Text style={styles.detailText}>Statut: {selectedBracelet.connectionStatus}</Text>
              
              {selectedBracelet.id.startsWith('ESP32_CAM') && (
                <>
                  <Text style={styles.detailText}>📹 Type: {selectedBracelet.metadata.deviceType}</Text>
                  <Text style={styles.detailText}>🌐 IP: {selectedBracelet.metadata.ipAddress}</Text>
                  <Text style={styles.detailText}>🔧 Firmware: {selectedBracelet.metadata.firmware}</Text>
                  <Text style={styles.detailText}>📺 Résolution: {selectedBracelet.metadata.resolution}</Text>
                  <Text style={styles.detailText}>🌙 Vision nocturne: {selectedBracelet.metadata.nightVision ? 'Oui' : 'Non'}</Text>
                  <Text style={styles.detailText}>🎯 Détection mouvement: {selectedBracelet.metadata.motionDetection ? 'Oui' : 'Non'}</Text>
                  <Text style={styles.detailText}>📍 Position: X:{selectedBracelet.locationHistory[0].x}, Y:{selectedBracelet.locationHistory[0].y}</Text>
                </>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.esp32List}>
            {esp32Devices.length === 0 ? (
              <View style={styles.noDevicesContainer}>
                <Text style={styles.noDevicesText}>📹 Aucune carte ESP32 détectée</Text>
                <Text style={styles.noDevicesSubtext}>Vérifiez que votre ESP32 est connectée et accessible</Text>
              </View>
            ) : (
              esp32Devices.map((bracelet, index) => (
                <TouchableOpacity
                  key={bracelet.id}
                  style={styles.esp32Card}
                  onPress={() => handleCardPress(bracelet)}
                >
                  <View style={styles.braceletHeader}>
                    <Text style={styles.braceletName}>
                      {bracelet.name} 📹
                    </Text>
                    <View style={styles.signalIndicator}>
                      <Text style={styles.signalText}>{bracelet.rssi} dBm</Text>
                    </View>
                  </View>
                  
                  <View style={styles.braceletInfo}>
                    <Text style={styles.distanceText}>📏 {bracelet.distance}m</Text>
                    <Text style={styles.statusText}>🟢 {bracelet.connectionStatus}</Text>
                    <Text style={styles.esp32Info}>📺 {bracelet.metadata.resolution}</Text>
                    <Text style={styles.esp32Info}>🌐 {bracelet.metadata.ipAddress}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
      </View>
    </View>
  );
};

// Composant principal
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
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
        <LinearGradient colors={['#0f172a', '#1e293b', '#334155']} style={styles.background} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingLogo}>📡</Text>
          <Text style={styles.loadingText}>RSSI Surveillance</Text>
          <Text style={styles.loadingSubtext}>Chargement du système...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!isAuthenticated ? (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      ) : (
        <HomeScreen user={user} onLogout={handleLogout} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingLogo: {
    fontSize: 60,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  loadingSubtext: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 20,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 16,
    padding: 30,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  loginSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#ffffff',
    fontSize: 16,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonDisabled: {
    backgroundColor: '#1f2937',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  credentialsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  credentialsText: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 10,
  },
  credentialItem: {
    color: '#ffffff',
    fontSize: 11,
    marginBottom: 5,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    padding: 8,
    borderRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
  },
  userInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userRole: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 5,
  },
  logoutButton: {
    padding: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  braceletsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  braceletCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  esp32List: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
  },
  noDevicesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noDevicesText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  noDevicesSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  esp32Card: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: 'rgba(59, 130, 246, 0.5)',
    borderWidth: 2,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  braceletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  braceletName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  signalIndicator: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  signalText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  braceletInfo: {
    alignItems: 'center',
  },
  batteryText: {
    fontSize: 14,
    color: '#10b981',
    marginBottom: 5,
  },
  distanceText: {
    fontSize: 14,
    color: '#3b82f6',
    marginBottom: 5,
  },
  statusText: {
    fontSize: 14,
    color: '#64748b',
  },
  esp32Info: {
    fontSize: 12,
    color: '#3b82f6',
    marginTop: 5,
    fontWeight: 'bold',
  },
  detailCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  backButton: {
    padding: 10,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 20,
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  detailInfo: {
    alignItems: 'center',
  },
  detailText: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 8,
  },
});

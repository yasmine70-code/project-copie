import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Responsive design constants
const isSmallScreen = width < 400;
const isMediumScreen = width >= 400 && width < 768;
const isLargeScreen = width >= 768;

export default function LoginScreen({ navigation, onLoginSuccess, error }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    // Pré-remplir pour les tests
    setEmail('admin@rssi.com');
    setPassword('admin123');
  }, []);

  const handleLogin = async () => {
    // Validation
    if (!email || !password) {
      setLoginError('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    setLoginError('');

    try {
      // Simulation d'une requête d'authentification
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Validation des identifiants
      if (email === 'admin@rssi.com' && password === 'admin123') {
        const userData = {
          id: 1,
          name: 'Administrateur',
          email: email,
          role: 'admin',
          permissions: ['dashboard', 'members', 'settings']
        };
        
        onLoginSuccess(userData);
      } else {
        setLoginError('Email ou mot de passe incorrect');
      }
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setLoginError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const getResponsiveFontSize = (small, medium, large) => {
    if (isSmallScreen) return small;
    if (isMediumScreen) return medium;
    return large;
  };

  const getResponsivePadding = (small, medium, large) => {
    if (isSmallScreen) return small;
    if (isMediumScreen) return medium;
    return large;
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#334155']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name="shield-checkmark" 
              size={getResponsiveFontSize(60, 80, 100)} 
              color="#3b82f6" 
            />
          </View>
          <Text style={[styles.title, { fontSize: getResponsiveFontSize(24, 28, 32) }]}>
            RSSI Supervision
          </Text>
          <Text style={[styles.subtitle, { fontSize: getResponsiveFontSize(14, 16, 18) }]}>
            Système de Surveillance des Équipes
          </Text>
        </View>

        <View style={[styles.formContainer, { padding: getResponsivePadding(20, 25, 30) }]}>
          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <Ionicons name="mail" size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email professionnel"
                placeholderTextColor="#64748b"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                placeholderTextColor="#64748b"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                <Ionicons 
                  name={showPassword ? "eye-off" : "eye"} 
                  size={20} 
                  color="#64748b" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {(loginError || error) && (
            <View style={styles.errorContainer}>
              <Ionicons name="warning" size={16} color="#ef4444" />
              <Text style={styles.errorText}>{loginError || error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.loginButtonText}>Se connecter</Text>
            )}
          </TouchableOpacity>

          <View style={styles.helpContainer}>
            <TouchableOpacity style={styles.helpButton}>
              <Ionicons name="help-circle" size={16} color="#64748b" />
              <Text style={styles.helpText}>Aide à la connexion</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Ionicons name="wifi" size={16} color="#10b981" />
              <Text style={styles.infoText}>RSSI: -50.00 dBm</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="people" size={16} color="#10b981" />
              <Text style={styles.infoText}>6 membres actifs</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="server" size={16} color="#10b981" />
              <Text style={styles.infoText}>Système opérationnel</Text>
            </View>
          </View>
          
          <Text style={styles.versionText}>
            Version 1.0.0 | Port 8300
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 100,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    paddingVertical: 15,
  },
  eyeIcon: {
    padding: 5,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  loginButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonDisabled: {
    backgroundColor: '#64748b',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  helpContainer: {
    alignItems: 'center',
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  helpText: {
    color: '#64748b',
    fontSize: 14,
    marginLeft: 5,
  },
  footer: {
    alignItems: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  infoText: {
    color: '#10b981',
    fontSize: 12,
    marginLeft: 5,
  },
  versionText: {
    color: '#64748b',
    fontSize: 12,
    textAlign: 'center',
  },
});

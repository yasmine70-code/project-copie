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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Responsive design constants
const isSmallScreen = width < 400;
const isMediumScreen = width >= 400 && width < 768;
const isLargeScreen = width >= 768;

export default function LoginScreen({ navigation, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Simulation de vérification d'authentification
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          // Simuler la validation du token
          const userData = {
            id: '1',
            email: 'admin@rssi.com',
            name: 'Administrateur',
            role: 'admin',
            permissions: ['read', 'write', 'admin'],
          };
          onLoginSuccess(userData);
        }
      } catch (error) {
        console.log('No stored session found');
      }
    };

    checkAuth();
  }, [onLoginSuccess]);

  const handleLogin = async () => {
    // Validation
    const newErrors = {};
    if (!email) newErrors.email = 'Email requis';
    if (!password) newErrors.password = 'Mot de passe requis';
    if (email && !email.includes('@')) newErrors.email = 'Email invalide';
    if (password && password.length < 6) newErrors.password = 'Minimum 6 caractères';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulation de connexion
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (email === 'admin@rssi.com' && password === 'admin123') {
        const userData = {
          id: '1',
          email: email,
          name: 'Administrateur',
          role: 'admin',
          permissions: ['read', 'write', 'admin'],
        };
        
        // Sauvegarder le token
        await AsyncStorage.setItem('authToken', 'mock-jwt-token');
        
        onLoginSuccess(userData);
      } else {
        setErrors({ general: 'Email ou mot de passe incorrect' });
      }
    } catch (error) {
      setErrors({ general: 'Erreur de connexion' });
    } finally {
      setIsLoading(false);
    }
  };

  // Responsive helper
  const getResponsiveValue = (small, medium, large) => {
    if (isSmallScreen) return small;
    if (isMediumScreen) return medium;
    return large;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#0f172a',
    },
    backgroundGradient: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: getResponsiveValue(20, 24, 32),
      paddingVertical: getResponsiveValue(20, 30, 40),
      minHeight: '100%',
    },
    loginCard: {
      backgroundColor: 'rgba(30, 41, 59, 0.95)',
      borderRadius: getResponsiveValue(20, 24, 32),
      padding: getResponsiveValue(32, 40, 48),
      borderWidth: 1,
      borderColor: 'rgba(148, 163, 184, 0.2)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.5,
      shadowRadius: 40,
      elevation: 20,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: getResponsiveValue(24, 32, 40),
    },
    logo: {
      width: getResponsiveValue(120, 140, 160),
      height: getResponsiveValue(120, 140, 160),
      borderRadius: getResponsiveValue(60, 70, 80),
      backgroundColor: '#3b82f6',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: getResponsiveValue(24, 32, 40),
      shadowColor: '#3b82f6',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.6,
      shadowRadius: 40,
      elevation: 15,
    },
    logoText: {
      color: 'white',
      fontSize: getResponsiveValue(40, 50, 60),
      fontWeight: 'bold',
      textAlign: 'center',
      includeFontPadding: false,
      textAlignVertical: 'center',
      fontFamily: Platform.OS === 'web' ? 'Arial, sans-serif' : undefined,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    title: {
      fontSize: getResponsiveValue(32, 40, 48),
      fontWeight: '800',
      color: 'white',
      marginBottom: getResponsiveValue(8, 12, 16),
      textAlign: 'center',
      fontFamily: Platform.OS === 'web' ? 'Arial, sans-serif' : undefined,
    },
    subtitle: {
      fontSize: getResponsiveValue(16, 20, 24),
      color: '#94a3b8',
      textAlign: 'center',
      marginBottom: getResponsiveValue(32, 40, 48),
      fontWeight: '500',
      fontFamily: Platform.OS === 'web' ? 'Arial, sans-serif' : undefined,
    },
    formContainer: {
      marginBottom: getResponsiveValue(32, 40, 48),
    },
    inputGroup: {
      marginBottom: getResponsiveValue(20, 24, 28),
    },
    inputLabel: {
      fontSize: getResponsiveValue(16, 17, 18),
      color: '#94a3b8',
      marginBottom: getResponsiveValue(8, 12, 16),
      fontWeight: '600',
      fontFamily: Platform.OS === 'web' ? 'Arial, sans-serif' : undefined,
    },
    inputWrapper: {
      position: 'relative',
    },
    input: {
      backgroundColor: 'rgba(15, 23, 42, 0.8)',
      borderWidth: 2,
      borderColor: 'rgba(148, 163, 184, 0.3)',
      borderRadius: getResponsiveValue(16, 18, 20),
      padding: getResponsiveValue(16, 20, 24),
      fontSize: getResponsiveValue(16, 18, 20),
      color: 'white',
      marginBottom: 8,
      fontWeight: '500',
      fontFamily: Platform.OS === 'web' ? 'Arial, sans-serif' : undefined,
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    passwordInput: {
      flex: 1,
    },
    eyeButton: {
      padding: getResponsiveValue(16, 18, 20),
      marginLeft: getResponsiveValue(12, 14, 16),
      borderRadius: getResponsiveValue(12, 14, 16),
      backgroundColor: 'rgba(148, 163, 184, 0.15)',
    },
    loginButtonContainer: {
      marginBottom: getResponsiveValue(32, 40, 48),
    },
    loginButton: {
      borderRadius: getResponsiveValue(20, 24, 28),
      paddingVertical: getResponsiveValue(20, 24, 28),
      paddingHorizontal: getResponsiveValue(32, 40, 48),
      alignItems: 'center',
      shadowColor: '#3b82f6',
      shadowOffset: { width: 0, height: 15 },
      shadowOpacity: 0.5,
      shadowRadius: 30,
      elevation: 15,
    },
    loginButtonText: {
      color: 'white',
      fontSize: getResponsiveValue(18, 20, 22),
      fontWeight: 'bold',
      fontFamily: Platform.OS === 'web' ? 'Arial, sans-serif' : undefined,
    },
    errorText: {
      color: '#ef4444',
      fontSize: getResponsiveValue(14, 16, 18),
      textAlign: 'center',
      backgroundColor: 'rgba(239, 68, 68, 0.15)',
      padding: getResponsiveValue(12, 16, 20),
      borderRadius: getResponsiveValue(12, 16, 20),
      fontWeight: '600',
      marginBottom: getResponsiveValue(16, 20, 24),
      fontFamily: Platform.OS === 'web' ? 'Arial, sans-serif' : undefined,
    },
    demoContainer: {
      backgroundColor: 'rgba(30, 41, 59, 0.8)',
      borderRadius: getResponsiveValue(16, 20, 24),
      padding: getResponsiveValue(20, 24, 28),
      borderWidth: 1,
      borderColor: 'rgba(148, 163, 184, 0.3)',
    },
    demoHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: getResponsiveValue(16, 20, 24),
    },
    demoIcon: {
      width: getResponsiveValue(36, 40, 44),
      height: getResponsiveValue(36, 40, 44),
      borderRadius: getResponsiveValue(18, 20, 22),
      backgroundColor: 'rgba(59, 130, 246, 0.15)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: getResponsiveValue(16, 18, 20),
    },
    demoTitle: {
      fontSize: getResponsiveValue(16, 18, 20),
      fontWeight: '700',
      color: '#3b82f6',
      fontFamily: Platform.OS === 'web' ? 'Arial, sans-serif' : undefined,
    },
    demoContent: {
      gap: getResponsiveValue(12, 14, 16),
    },
    demoCredentialRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      padding: getResponsiveValue(12, 14, 16),
      borderRadius: getResponsiveValue(12, 14, 16),
    },
    demoLabel: {
      fontSize: getResponsiveValue(14, 16, 18),
      color: '#94a3b8',
      fontWeight: '500',
      fontFamily: Platform.OS === 'web' ? 'Arial, sans-serif' : undefined,
    },
    demoValue: {
      fontSize: getResponsiveValue(14, 16, 18),
      color: 'white',
      fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
      fontWeight: '600',
    },
  });

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" />
      
      {/* Gradient de fond premium */}
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#334155', '#475569', '#64748b', '#94a3b8']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Carte de login avec effet de verre */}
        <View style={styles.loginCard}>
          {/* Logo avec effet glow */}
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>RSSI</Text>
            </View>
            <Text style={styles.title}>Supervision</Text>
            <Text style={styles.subtitle}>Système de monitoring RSSI avancé</Text>
          </View>

          {/* Formulaire */}
          <View style={styles.formContainer}>
            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email professionnel</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="admin@rssi.com"
                  placeholderTextColor="#64748b"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Mot de passe */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mot de passe</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="•••••••••••••••••••••••••••"
                    placeholderTextColor="#64748b"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity 
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons 
                      name={showPassword ? "eye-off" : "eye"} 
                      size={getResponsiveValue(20, 24, 28)} 
                      color="#94a3b8" 
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Erreur */}
          {errors.general && (
            <Text style={styles.errorText}>{errors.general}</Text>
          )}

          {/* Bouton de connexion */}
          <View style={styles.loginButtonContainer}>
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#3b82f6', '#1d4ed8', '#1e40af', '#1e3a8a']}
                style={styles.loginButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {isLoading ? (
                  <ActivityIndicator size="large" color="white" />
                ) : (
                  <Text style={styles.loginButtonText}>Se connecter</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Informations de démo */}
          <View style={styles.demoContainer}>
            <View style={styles.demoHeader}>
              <View style={styles.demoIcon}>
                <Ionicons name="information-circle" size={getResponsiveValue(20, 24, 28)} color="#3b82f6" />
              </View>
              <Text style={styles.demoTitle}>ACCÈS DÉMO</Text>
            </View>
            
            <View style={styles.demoContent}>
              <View style={styles.demoCredentialRow}>
                <Text style={styles.demoLabel}>Email:</Text>
                <Text style={styles.demoValue}>admin@rssi.com</Text>
              </View>
              <View style={styles.demoCredentialRow}>
                <Text style={styles.demoLabel}>Mot de passe:</Text>
                <Text style={styles.demoValue}>admin123</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

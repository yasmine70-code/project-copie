import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar, 
  TextInput, 
  Alert, 
  ScrollView,
  Image,
  Dimensions,
  Animated,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Configuration du système pour le chef de groupe
const CHEF_CONFIG = {
  credentials: {
    username: 'chef@groupe.rssi',
    password: 'chef2024',
    role: 'chef_de_groupe'
  },
  system: {
    name: 'RSSI Surveillance Pro',
    version: '2.0.0',
    max_bracelets: 20,
    range: 150,
    update_interval: 5
  },
  security: {
    session_timeout: 3600, // 1 heure
    max_attempts: 3,
    lockout_time: 300 // 5 minutes
  }
};

// Données de démo pour le chef de groupe
const CHEF_GROUP_DATA = {
  name: 'Jean Dupont',
  role: 'Chef de Groupe',
  group_id: 'GRP_001',
  group_name: 'Explorateurs Forêt',
  total_members: 12,
  active_bracelets: 10,
  last_mission: 'Surveillance Forêt Nord',
  experience: 'Senior',
  certification: 'RSSI Level 2'
};

// Composant de champ de saisie sécurisé
function SecureInput({ 
  label, 
  icon, 
  value, 
  onChangeText, 
  secureTextEntry, 
  keyboardType = 'default',
  placeholder,
  error = false 
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[
        styles.inputWrapper,
        isFocused && styles.inputFocused,
        error && styles.inputError
      ]}>
        <Ionicons 
          name={icon} 
          size={20} 
          color={isFocused ? '#3b82f6' : error ? '#ef4444' : '#64748b'} 
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {secureTextEntry && (
          <TouchableOpacity 
            onPress={() => setShowPassword(!showPassword)}
            style={styles.passwordToggle}
          >
            <Ionicons 
              name={showPassword ? 'eye-off' : 'eye'} 
              size={20} 
              color="#64748b" 
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

// Composant d'indicateur de sécurité
function SecurityIndicator({ level, text }) {
  const colors = {
    high: '#22c55e',
    medium: '#f59e0b', 
    low: '#ef4444'
  };

  const icons = {
    high: 'shield-checkmark',
    medium: 'shield',
    low: 'warning'
  };

  return (
    <View style={styles.securityIndicator}>
      <Ionicons 
        name={icons[level]} 
        size={16} 
        color={colors[level]} 
      />
      <Text style={[styles.securityText, { color: colors[level] }]}>
        {text}
      </Text>
    </View>
  );
}

// Composant de statistiques du groupe
function GroupStats({ data }) {
  return (
    <View style={styles.groupStatsContainer}>
      <Text style={styles.groupStatsTitle}>📊 Statistiques du Groupe</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <View style={styles.statIcon}>
            <Ionicons name="people" size={24} color="#3b82f6" />
          </View>
          <Text style={styles.statValue}>{data.total_members}</Text>
          <Text style={styles.statLabel}>Membres</Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={styles.statIcon}>
            <Ionicons name="watch" size={24} color="#22c55e" />
          </View>
          <Text style={styles.statValue}>{data.active_bracelets}</Text>
          <Text style={styles.statLabel}>Bracelets Actifs</Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={styles.statIcon}>
            <Ionicons name="location" size={24} color="#f59e0b" />
          </View>
          <Text style={styles.statValue}>{CHEF_CONFIG.system.range}m</Text>
          <Text style={styles.statLabel}>Portée</Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={styles.statIcon}>
            <Ionicons name="timer" size={24} color="#ef4444" />
          </View>
          <Text style={styles.statValue}>{CHEF_CONFIG.system.update_interval}s</Text>
          <Text style={styles.statLabel}>Mise à Jour</Text>
        </View>
      </View>
      
      <View style={styles.groupInfo}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Groupe:</Text>
          <Text style={styles.infoValue}>{data.group_name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>ID Groupe:</Text>
          <Text style={styles.infoValue}>{data.group_id}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Dernière Mission:</Text>
          <Text style={styles.infoValue}>{data.last_mission}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Expérience:</Text>
          <Text style={styles.infoValue}>{data.experience}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Certification:</Text>
          <Text style={styles.infoValue}>{data.certification}</Text>
        </View>
      </View>
    </View>
  );
}

// Écran principal de login pour chef de groupe
function ChefLoginScreen({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [errors, setErrors] = useState({});
  const [showGroupStats, setShowGroupStats] = useState(false);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Animation d'entrée
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = 'L\'identifiant est requis';
    } else if (!username.includes('@')) {
      newErrors.username = 'Format email invalide';
    }

    if (!password.trim()) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
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

    // Simulation d'authentification
    setTimeout(() => {
      const success = username === CHEF_CONFIG.credentials.username && 
                     password === CHEF_CONFIG.credentials.password;

      if (success) {
        setLoginAttempts(0);
        onLoginSuccess({
          ...CHEF_GROUP_DATA,
          login_time: new Date(),
          session_id: `session_${Date.now()}`,
          system_info: CHEF_CONFIG.system
        });
      } else {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        
        if (newAttempts >= CHEF_CONFIG.security.max_attempts) {
          setErrors({
            general: `Trop de tentatives. Veuillez réessayer dans ${CHEF_CONFIG.security.lockout_time / 60} minutes.`
          });
        } else {
          setErrors({
            general: `Identifiant ou mot de passe incorrect. Tentative ${newAttempts}/${CHEF_CONFIG.security.max_attempts}`
          });
        }
      }
      
      setIsLoading(false);
    }, 2000);
  };

  const getSecurityLevel = () => {
    if (loginAttempts === 0) return 'high';
    if (loginAttempts < 2) return 'medium';
    return 'low';
  };

  const getSecurityText = () => {
    if (loginAttempts === 0) return 'Connexion sécurisée activée';
    if (loginAttempts < 2) return `Attention: ${loginAttempts} tentative(s) échouée(s)`;
    return `Sécurité renforcée: ${loginAttempts}/${CHEF_CONFIG.security.max_attempts} tentatives`;
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      {/* Background professionnel */}
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#334155', '#1e293b', '#0f172a']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Pattern de fond */}
      <View style={styles.patternContainer}>
        {[...Array(20)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.patternDot,
              {
                left: Math.random() * width,
                top: Math.random() * height,
                width: Math.random() * 4 + 2,
                height: Math.random() * 4 + 2,
              }
            ]}
          />
        ))}
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            styles.loginContainer,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          {/* Header avec logo */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['#3b82f6', '#2563eb', '#1d4ed8']}
                style={styles.logoGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.logo}>👑</Text>
              </LinearGradient>
            </View>
            <Text style={styles.title}>Chef de Groupe</Text>
            <Text style={styles.subtitle}>RSSI Surveillance Pro</Text>
            <Text style={styles.version}>Version {CHEF_CONFIG.system.version}</Text>
          </View>

          {/* Indicateur de sécurité */}
          <View style={styles.securityContainer}>
            <SecurityIndicator 
              level={getSecurityLevel()}
              text={getSecurityText()}
            />
          </View>

          {/* Formulaire de connexion */}
          <View style={styles.form}>
            <Text style={styles.formTitle}>🔐 Connexion Sécurisée</Text>
            
            <SecureInput
              label="Identifiant"
              icon="person"
              value={username}
              onChangeText={setUsername}
              placeholder="chef@groupe.rssi"
              error={errors.username}
              keyboardType="email-address"
            />
            
            <SecureInput
              label="Mot de passe"
              icon="lock-closed"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              error={errors.password}
              secureTextEntry={true}
            />

            {/* Message d'erreur général */}
            {errors.general && (
              <View style={styles.generalErrorContainer}>
                <Ionicons name="warning" size={20} color="#ef4444" />
                <Text style={styles.generalErrorText}>{errors.general}</Text>
              </View>
            )}

            {/* Options de connexion */}
            <View style={styles.loginOptions}>
              <TouchableOpacity style={styles.rememberMe}>
                <View style={styles.checkbox}>
                  <Ionicons name="checkmark" size={16} color="#3b82f6" />
                </View>
                <Text style={styles.rememberMeText}>Se souvenir de moi</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Mot de passe oublié?</Text>
              </TouchableOpacity>
            </View>

            {/* Bouton de connexion */}
            <TouchableOpacity 
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={isLoading ? ['#6b7280', '#4b5563'] : ['#3b82f6', '#2563eb']}
                style={styles.loginButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Connexion en cours...</Text>
                  </View>
                ) : (
                  <View style={styles.buttonContent}>
                    <Ionicons name="log-in" size={20} color="white" />
                    <Text style={styles.loginButtonText}>Se Connecter</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Informations système */}
            <View style={styles.systemInfo}>
              <Text style={styles.systemInfoTitle}>🔒 Informations de Sécurité</Text>
              <View style={styles.securityFeatures}>
                <View style={styles.securityFeature}>
                  <Ionicons name="shield-checkmark" size={16} color="#22c55e" />
                  <Text style={styles.securityFeatureText}>Chiffrement SSL/TLS</Text>
                </View>
                <View style={styles.securityFeature}>
                  <Ionicons name="timer" size={16} color="#22c55e" />
                  <Text style={styles.securityFeatureText}>Session: {CHEF_CONFIG.security.session_timeout}s</Text>
                </View>
                <View style={styles.securityFeature}>
                  <Ionicons name="lock-closed" size={16} color="#22c55e" />
                  <Text style={styles.securityFeatureText}>Max tentatives: {CHEF_CONFIG.security.max_attempts}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Bouton pour afficher les statistiques */}
          <TouchableOpacity 
            style={styles.statsToggle}
            onPress={() => setShowGroupStats(!showGroupStats)}
          >
            <Ionicons 
              name={showGroupStats ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color="#3b82f6" 
            />
            <Text style={styles.statsToggleText}>
              {showGroupStats ? 'Masquer' : 'Afficher'} les statistiques du groupe
            </Text>
          </TouchableOpacity>

          {/* Statistiques du groupe */}
          {showGroupStats && (
            <Animated.View style={styles.statsSection}>
              <GroupStats data={CHEF_GROUP_DATA} />
            </Animated.View>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              © 2024 RSSI Surveillance Pro - Système de surveillance hors-ligne
            </Text>
            <Text style={styles.footerSubtext}>
              Conçu pour les chefs de groupe professionnels
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// App principal
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
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
        <LinearGradient
          colors={['#0f172a', '#1e293b', '#334155', '#1e293b', '#0f172a']}
          style={styles.background}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingLogo}>👑</Text>
          <Text style={styles.loadingText}>Chef de Groupe</Text>
          <Text style={styles.loadingSubtext}>RSSI Surveillance Pro</Text>
          <View style={styles.loadingDots}>
            <Text style={styles.loadingDot}>•</Text>
            <Text style={styles.loadingDot}>•</Text>
            <Text style={styles.loadingDot}>•</Text>
          </View>
        </View>
      </View>
    );
  }

  if (isAuthenticated && user) {
    // Ici vous pouvez rediriger vers l'écran principal du chef de groupe
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <LinearGradient
          colors={['#0f172a', '#1e293b', '#334155', '#1e293b', '#0f172a']}
          style={styles.background}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.dashboardContainer}>
          <View style={styles.dashboardHeader}>
            <Text style={styles.dashboardTitle}>👑 Tableau de Bord Chef</Text>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Ionicons name="log-out" size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userRole}>{user.role}</Text>
            <Text style={styles.userGroup}>{user.group_name}</Text>
            <Text style={styles.userSession}>Session: {user.session_id}</Text>
          </View>
          
          <View style={styles.systemStatus}>
            <Text style={styles.statusText}>📡 Système RSSI Surveillance</Text>
            <Text style={styles.statusSubtext}>Version {user.system_info.version}</Text>
            <Text style={styles.statusSubtext}>Bracelets actifs: {user.active_bracelets}/{user.total_members}</Text>
            <Text style={styles.statusSubtext}>Portée: {user.system_info.range}m</Text>
            <Text style={styles.statusSubtext}>Mise à jour: {user.system_info.update_interval}s</Text>
          </View>
        </View>
      </View>
    );
  }

  return <ChefLoginScreen onLoginSuccess={handleLoginSuccess} />;
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
  patternContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  patternDot: {
    position: 'absolute',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 2,
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingLogo: {
    fontSize: 80,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textShadowColor: 'rgba(59, 130, 246, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 15,
  },
  loadingSubtext: {
    fontSize: 18,
    color: '#94a3b8',
    marginBottom: 30,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 8,
  },
  loadingDot: {
    fontSize: 24,
    color: '#3b82f6',
    animation: 'pulse 1.5s infinite',
  },
  
  // Main Login
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 30,
  },
  loginContainer: {
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoGradient: {
    width: 120,
    height: 120,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logo: {
    fontSize: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textShadowColor: 'rgba(59, 130, 246, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#94a3b8',
    marginBottom: 5,
  },
  version: {
    fontSize: 14,
    color: '#64748b',
    backgroundColor: 'rgba(100, 116, 139, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  
  // Security Indicator
  securityContainer: {
    marginBottom: 30,
  },
  securityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  securityText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  
  // Form
  form: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 20,
    padding: 30,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 30,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 25,
    textAlign: 'center',
  },
  
  // Input
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputFocused: {
    borderColor: 'rgba(59, 130, 246, 0.5)',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
  },
  inputError: {
    borderColor: 'rgba(239, 68, 68, 0.5)',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
  },
  passwordToggle: {
    marginLeft: 12,
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 6,
  },
  
  // General Error
  generalErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    marginBottom: 20,
  },
  generalErrorText: {
    fontSize: 14,
    color: '#ef4444',
    marginLeft: 10,
    flex: 1,
  },
  
  // Login Options
  loginOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    marginRight: 8,
  },
  rememberMeText: {
    fontSize: 14,
    color: '#94a3b8',
  },
  forgotPassword: {
    padding: 4,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#3b82f6',
    textDecorationLine: 'underline',
  },
  
  // Login Button
  loginButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 25,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 5,
  },
  loginButtonDisabled: {
    shadowColor: '#6b7280',
    shadowOpacity: 0.2,
  },
  loginButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 12,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  
  // System Info
  systemInfo: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
  },
  systemInfoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 12,
  },
  securityFeatures: {
    gap: 8,
  },
  securityFeature: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityFeatureText: {
    fontSize: 12,
    color: '#94a3b8',
    marginLeft: 8,
  },
  
  // Stats Toggle
  statsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    marginBottom: 20,
  },
  statsToggleText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
    marginLeft: 8,
  },
  
  // Group Stats
  statsSection: {
    width: '100%',
    maxWidth: 400,
  },
  groupStatsContainer: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    marginBottom: 30,
  },
  groupStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
  groupInfo: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  infoValue: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  
  // Footer
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 10,
    color: '#475569',
    textAlign: 'center',
  },
  
  // Dashboard (après connexion)
  dashboardContainer: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    marginBottom: 30,
  },
  dashboardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  logoutButton: {
    padding: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  userRole: {
    fontSize: 18,
    color: '#3b82f6',
    marginBottom: 4,
  },
  userGroup: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 4,
  },
  userSession: {
    fontSize: 12,
    color: '#64748b',
  },
  systemStatus: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  statusSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 6,
  },
});

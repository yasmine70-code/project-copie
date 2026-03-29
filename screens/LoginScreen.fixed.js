import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Responsive design constants
const isSmallScreen = width < 400;
const isMediumScreen = width >= 400 && width < 600;
const isLargeScreen = width >= 600;

export default function LoginScreen({ navigation, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedInput, setFocusedInput] = useState(null);
  
  // Animations 100% sécurisées - seulement opacity et scale
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Animation d'entrée simple et sécurisée
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    // Validation
    const newErrors = {};
    if (!email) newErrors.email = 'Email requis';
    if (!password) newErrors.password = 'Mot de passe requis';
    if (email && !email.includes('@')) newErrors.email = 'Email invalide';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulation de connexion
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (email === 'admin@rssi.com' && password === 'admin123') {
        const userData = {
          id: '1',
          email: email,
          name: 'Administrateur RSSI',
          role: 'admin',
          permissions: ['read', 'write', 'admin'],
        };
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

  const handleInputFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  const handleInputBlur = () => {
    setFocusedInput(null);
  };

  // Responsive styles
  const getResponsiveValue = (small, medium, large) => {
    if (isSmallScreen) return small;
    if (isMediumScreen) return medium;
    return large;
  };

  // Styles simples et sécurisés
  const containerStyle = {
    flex: 1,
    backgroundColor: '#0f172a',
  };

  const backgroundGradientStyle = {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  };

  const scrollContainerStyle = {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: getResponsiveValue(20, 24, 32),
    paddingVertical: getResponsiveValue(20, 30, 40),
  };

  const loginCardStyle = {
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
  };

  const logoContainerStyle = {
    alignItems: 'center',
    marginBottom: getResponsiveValue(24, 32, 40),
  };

  const logoStyle = {
    width: getResponsiveValue(100, 130, 160),
    height: getResponsiveValue(100, 130, 160),
    borderRadius: getResponsiveValue(50, 65, 80),
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: getResponsiveValue(24, 32, 40),
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.6,
    shadowRadius: 40,
    elevation: 15,
  };

  const logoTextStyle = {
    color: 'white',
    fontSize: getResponsiveValue(50, 65, 80),
    fontWeight: 'bold',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  };

  const titleStyle = {
    fontSize: getResponsiveValue(32, 40, 48),
    fontWeight: '800',
    color: 'white',
    marginBottom: getResponsiveValue(8, 12, 16),
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.2)',
  };

  const subtitleStyle = {
    fontSize: getResponsiveValue(16, 20, 24),
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: getResponsiveValue(32, 40, 48),
    fontWeight: '500',
  };

  const formContainerStyle = {
    marginBottom: getResponsiveValue(32, 40, 48),
  };

  const inputGroupStyle = {
    marginBottom: getResponsiveValue(20, 24, 28),
  };

  const inputLabelStyle = {
    fontSize: getResponsiveValue(16, 17, 18),
    color: '#94a3b8',
    marginBottom: getResponsiveValue(8, 12, 16),
    fontWeight: '600',
  };

  const inputStyle = {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderWidth: 2,
    borderColor: focusedInput === 'email' || focusedInput === 'password' ? '#3b82f6' : 'rgba(148, 163, 184, 0.3)',
    borderRadius: getResponsiveValue(16, 18, 20),
    padding: getResponsiveValue(16, 20, 24),
    fontSize: getResponsiveValue(16, 18, 20),
    color: 'white',
    marginBottom: 8,
    fontWeight: '500',
  };

  const passwordContainerStyle = {
    flexDirection: 'row',
    alignItems: 'center',
  };

  const passwordInputStyle = {
    flex: 1,
  };

  const eyeButtonStyle = {
    padding: getResponsiveValue(16, 18, 20),
    marginLeft: getResponsiveValue(12, 14, 16),
    borderRadius: getResponsiveValue(12, 14, 16),
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
  };

  const loginButtonStyle = {
    borderRadius: getResponsiveValue(20, 24, 28),
    paddingVertical: getResponsiveValue(20, 24, 28),
    paddingHorizontal: getResponsiveValue(32, 40, 48),
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 15,
  };

  const loginButtonTextStyle = {
    color: 'white',
    fontSize: getResponsiveValue(18, 20, 22),
    fontWeight: 'bold',
  };

  const errorTextStyle = {
    color: '#ef4444',
    fontSize: getResponsiveValue(14, 16, 18),
    textAlign: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    padding: getResponsiveValue(12, 16, 20),
    borderRadius: getResponsiveValue(12, 16, 20),
    fontWeight: '600',
    marginBottom: getResponsiveValue(16, 20, 24),
  };

  const demoContainerStyle = {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: getResponsiveValue(16, 20, 24),
    padding: getResponsiveValue(20, 24, 28),
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
  };

  const demoHeaderStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getResponsiveValue(16, 20, 24),
  };

  const demoIconStyle = {
    width: getResponsiveValue(36, 40, 44),
    height: getResponsiveValue(36, 40, 44),
    borderRadius: getResponsiveValue(18, 20, 22),
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: getResponsiveValue(16, 18, 20),
  };

  const demoTitleStyle = {
    fontSize: getResponsiveValue(16, 18, 20),
    fontWeight: '700',
    color: '#3b82f6',
  };

  const demoContentStyle = {
    gap: getResponsiveValue(12, 14, 16),
  };

  const demoCredentialRowStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    padding: getResponsiveValue(12, 14, 16),
    borderRadius: getResponsiveValue(12, 14, 16),
  };

  const demoLabelStyle = {
    fontSize: getResponsiveValue(14, 16, 18),
    color: '#94a3b8',
    fontWeight: '500',
  };

  const demoValueStyle = {
    fontSize: getResponsiveValue(14, 16, 18),
    color: 'white',
    fontFamily: 'monospace',
    fontWeight: '600',
  };

  const featuresContainerStyle = {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: getResponsiveValue(24, 32, 40),
  };

  const featureStyle = {
    alignItems: 'center',
  };

  const featureIconStyle = {
    width: getResponsiveValue(48, 56, 64),
    height: getResponsiveValue(48, 56, 64),
    borderRadius: getResponsiveValue(24, 28, 32),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: getResponsiveValue(12, 14, 16),
  };

  const featureTextStyle = {
    fontSize: getResponsiveValue(12, 14, 16),
    color: '#94a3b8',
    textAlign: 'center',
    fontWeight: '500',
  };

  return (
    <KeyboardAvoidingView 
      style={containerStyle}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" />
      
      {/* Gradient de fond */}
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#334155', '#475569']}
        style={backgroundGradientStyle}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView contentContainerStyle={scrollContainerStyle}>
        {/* Carte de login */}
        <Animated.View style={[
          loginCardStyle,
          {
            opacity: fadeAnim,
          }
        ]}>
          {/* Logo */}
          <View style={logoContainerStyle}>
            <Animated.View style={[
              logoStyle,
              { 
                transform: [
                  { scale: scaleAnim }
                ] 
              }
            ]}>
              <Text 
                style={logoTextStyle}
                adjustsFontSizeToFit={true}
                numberOfLines={1}
                minimumScaleFactor={0.8}
              >RSSI</Text>
            </Animated.View>
            <Text style={titleStyle}>Supervision</Text>
            <Text style={subtitleStyle}>Système de monitoring RSSI avancé</Text>
          </View>

          {/* Formulaire */}
          <View style={formContainerStyle}>
            {/* Email */}
            <View style={inputGroupStyle}>
              <Text style={inputLabelStyle}>Email professionnel</Text>
              <TextInput
                style={[
                  inputStyle, 
                  focusedInput === 'email' && { 
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.05)'
                  }
                ]}
                placeholder="admin@rssi.com"
                placeholderTextColor="#64748b"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => handleInputFocus('email')}
                onBlur={handleInputBlur}
              />
            </View>

            {/* Mot de passe */}
            <View style={inputGroupStyle}>
              <Text style={inputLabelStyle}>Mot de passe</Text>
              <View style={passwordContainerStyle}>
                <TextInput
                  style={[
                    inputStyle, 
                    passwordInputStyle, 
                    { marginBottom: 0 },
                    focusedInput === 'password' && { 
                      borderColor: '#3b82f6',
                      backgroundColor: 'rgba(59, 130, 246, 0.05)'
                    }
                  ]}
                  placeholder="•••••••••••••••••••••••••••"
                  placeholderTextColor="#64748b"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  onFocus={() => handleInputFocus('password')}
                  onBlur={handleInputBlur}
                />
                <TouchableOpacity 
                  style={eyeButtonStyle}
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

          {/* Erreur */}
          {errors.general && (
            <Text style={errorTextStyle}>{errors.general}</Text>
          )}

          {/* Bouton de connexion */}
          <TouchableOpacity 
            style={loginButtonStyle}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#3b82f6', '#1d4ed8', '#1e40af']}
              style={loginButtonStyle}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {isLoading ? (
                <ActivityIndicator size="large" color="white" />
              ) : (
                <Text style={loginButtonTextStyle}>Se connecter</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Informations de démo */}
          <View style={demoContainerStyle}>
            <View style={demoHeaderStyle}>
              <View style={demoIconStyle}>
                <Ionicons name="information-circle" size={getResponsiveValue(20, 24, 28)} color="#3b82f6" />
              </View>
              <Text style={demoTitleStyle}>ACCÈS DÉMO</Text>
            </View>
            
            <View style={demoContentStyle}>
              <View style={demoCredentialRowStyle}>
                <Text style={demoLabelStyle}>Email:</Text>
                <Text style={demoValueStyle}>admin@rssi.com</Text>
              </View>
              <View style={demoCredentialRowStyle}>
                <Text style={demoLabelStyle}>Mot de passe:</Text>
                <Text style={demoValueStyle}>admin123</Text>
              </View>
            </View>
          </View>

          {/* Fonctionnalités */}
          <View style={featuresContainerStyle}>
            <View style={featureStyle}>
              <View style={[featureIconStyle, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                <Ionicons name="shield-checkmark" size={getResponsiveValue(24, 28, 32)} color="#10b981" />
              </View>
              <Text style={featureTextStyle}>Sécurisé</Text>
            </View>
            
            <View style={featureStyle}>
              <View style={[featureIconStyle, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                <Ionicons name="speedometer" size={getResponsiveValue(24, 28, 32)} color="#10b981" />
              </View>
              <Text style={featureTextStyle}>Temps réel</Text>
            </View>
            
            <View style={featureStyle}>
              <View style={[featureIconStyle, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                <Ionicons name="analytics" size={getResponsiveValue(24, 28, 32)} color="#f59e0b" />
              </View>
              <Text style={featureTextStyle}>Analytics</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

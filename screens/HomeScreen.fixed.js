import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Responsive design constants
const isSmallScreen = width < 400;
const isMediumScreen = width >= 400 && width < 600;
const isLargeScreen = width >= 600;

export default function HomeScreen({ navigation, user, onLogout }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemStats, setSystemStats] = useState({
    activeMembers: 4,
    alerts: 1,
    batteryAvg: 51,
    signalAvg: -77,
    onlineMembers: 3,
    emergencyAlerts: 1,
    criticalMembers: 1,
    totalData: 1247,
    networkStatus: 'excellent',
    systemHealth: 98,
  });

  // Animations 100% sécurisées pour Android
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const statsAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animation d'entrée sécurisée
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 1500,
        delay: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Animation de pulse continue
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animation de shimmer
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animation des statistiques
    Animated.timing(statsAnim, {
      toValue: 1,
      duration: 2000,
      delay: 800,
      useNativeDriver: true,
    }).start();

    // Mise à jour du temps
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Simulation de mises à jour des statistiques
    const statsTimer = setInterval(() => {
      setSystemStats(prev => ({
        ...prev,
        batteryAvg: Math.max(20, Math.min(100, prev.batteryAvg + (Math.random() - 0.5) * 5)),
        signalAvg: Math.max(-120, Math.min(-30, prev.signalAvg + (Math.random() - 0.5) * 10)),
        totalData: prev.totalData + Math.floor(Math.random() * 10),
        systemHealth: Math.max(85, Math.min(100, prev.systemHealth + (Math.random() - 0.5) * 2)),
      }));
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(statsTimer);
    };
  }, []);

  const handleLogout = () => {
    onLogout();
  };

  const navigateToDashboard = () => {
    navigation.navigate('Dashboard');
  };

  // Responsive helper
  const getResponsiveValue = (small, medium, large) => {
    if (isSmallScreen) return small;
    if (isMediumScreen) return medium;
    return large;
  };

  // Styles responsives
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
    paddingHorizontal: getResponsiveValue(16, 20, 24),
    paddingVertical: getResponsiveValue(20, 24, 28),
  };

  const headerStyle = {
    marginBottom: getResponsiveValue(24, 32, 40),
  };

  const greetingStyle = {
    fontSize: getResponsiveValue(24, 28, 32),
    fontWeight: '700',
    color: 'white',
    marginBottom: getResponsiveValue(8, 12, 16),
  };

  const timeStyle = {
    fontSize: getResponsiveValue(14, 16, 18),
    color: '#94a3b8',
    marginBottom: getResponsiveValue(4, 6, 8),
  };

  const userStyle = {
    fontSize: getResponsiveValue(16, 18, 20),
    color: '#3b82f6',
    fontWeight: '600',
  };

  const statsGridStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: getResponsiveValue(24, 32, 40),
    gap: getResponsiveValue(12, 16, 20),
  };

  const statCardStyle = {
    width: getResponsiveValue(width / 2 - 24, width / 2 - 28, width / 2 - 32),
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: getResponsiveValue(16, 18, 20),
    padding: getResponsiveValue(16, 20, 24),
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  };

  const statValueStyle = {
    fontSize: getResponsiveValue(24, 28, 32),
    fontWeight: '700',
    color: 'white',
    marginBottom: getResponsiveValue(4, 6, 8),
  };

  const statLabelStyle = {
    fontSize: getResponsiveValue(12, 14, 16),
    color: '#94a3b8',
    fontWeight: '500',
  };

  const alertCardStyle = {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: getResponsiveValue(16, 18, 20),
    padding: getResponsiveValue(16, 20, 24),
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    marginBottom: getResponsiveValue(24, 32, 40),
  };

  const alertHeaderStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getResponsiveValue(12, 16, 20),
  };

  const alertTitleStyle = {
    fontSize: getResponsiveValue(16, 18, 20),
    fontWeight: '600',
    color: '#ef4444',
    marginLeft: getResponsiveValue(12, 14, 16),
  };

  const alertTextStyle = {
    fontSize: getResponsiveValue(14, 16, 18),
    color: '#f87171',
    lineHeight: getResponsiveValue(20, 24, 28),
  };

  const actionButtonStyle = {
    backgroundColor: '#3b82f6',
    borderRadius: getResponsiveValue(16, 18, 20),
    padding: getResponsiveValue(16, 20, 24),
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: getResponsiveValue(16, 20, 24),
  };

  const actionButtonTextStyle = {
    color: 'white',
    fontSize: getResponsiveValue(16, 18, 20),
    fontWeight: '600',
  };

  const logoutButtonStyle = {
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    borderRadius: getResponsiveValue(12, 14, 16),
    padding: getResponsiveValue(12, 16, 20),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
  };

  const logoutButtonTextStyle = {
    color: '#94a3b8',
    fontSize: getResponsiveValue(14, 16, 18),
    fontWeight: '500',
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={containerStyle}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      {/* Gradient de fond */}
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#334155', '#475569']}
        style={backgroundGradientStyle}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView contentContainerStyle={scrollContainerStyle}>
        {/* En-tête */}
        <Animated.View style={[headerStyle, { opacity: fadeAnim }]}>
          <Text style={greetingStyle}>
            Bonjour, {user?.name || 'Administrateur'}
          </Text>
          <Text style={timeStyle}>{formatTime(currentTime)}</Text>
          <Text style={timeStyle}>{formatDate(currentTime)}</Text>
          <Text style={userStyle}>Rôles: {user?.permissions?.join(', ') || 'Admin'}</Text>
        </Animated.View>

        {/* Grille de statistiques */}
        <Animated.View style={[statsGridStyle, { opacity: statsAnim }]}>
          <Animated.View style={[statCardStyle, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={statValueStyle}>{systemStats.activeMembers}</Text>
            <Text style={statLabelStyle}>Membres actifs</Text>
          </Animated.View>

          <Animated.View style={[statCardStyle, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={statValueStyle}>{systemStats.alerts}</Text>
            <Text style={statLabelStyle}>Alertes</Text>
          </Animated.View>

          <Animated.View style={[statCardStyle, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={statValueStyle}>{systemStats.batteryAvg}%</Text>
            <Text style={statLabelStyle}>Batterie moyenne</Text>
          </Animated.View>

          <Animated.View style={[statCardStyle, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={statValueStyle}>{systemStats.signalAvg} dBm</Text>
            <Text style={statLabelStyle}>Signal moyen</Text>
          </Animated.View>

          <Animated.View style={[statCardStyle, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={statValueStyle}>{systemStats.onlineMembers}</Text>
            <Text style={statLabelStyle}>En ligne</Text>
          </Animated.View>

          <Animated.View style={[statCardStyle, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={statValueStyle}>{systemStats.systemHealth}%</Text>
            <Text style={statLabelStyle}>Santé système</Text>
          </Animated.View>
        </Animated.View>

        {/* Alerte d'urgence */}
        {systemStats.emergencyAlerts > 0 && (
          <Animated.View style={[alertCardStyle, { opacity: glowAnim }]}>
            <View style={alertHeaderStyle}>
              <Ionicons name="warning" size={getResponsiveValue(20, 24, 28)} color="#ef4444" />
              <Text style={alertTitleStyle}>Alerte d'urgence</Text>
            </View>
            <Text style={alertTextStyle}>
              {systemStats.criticalMembers} membre(s) critique(s) détecté(s). 
              Intervention requise immédiatement.
            </Text>
          </Animated.View>
        )}

        {/* Boutons d'action */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <TouchableOpacity 
            style={actionButtonStyle}
            onPress={navigateToDashboard}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#3b82f6', '#1d4ed8', '#1e40af']}
              style={actionButtonStyle}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={actionButtonTextStyle}>Voir le tableau de bord</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={logoutButtonStyle}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text style={logoutButtonTextStyle}>Se déconnecter</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

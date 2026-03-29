import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AdvancedDashboard from '../components/AdvancedDashboard';
import ARView from '../components/ARView';
import VoiceAssistant from '../components/VoiceAssistant';

const { width, height } = Dimensions.get('window');

// Responsive design constants
const isSmallScreen = width < 400;
const isMediumScreen = width >= 400 && width < 600;
const isLargeScreen = width >= 600;

// Données de test améliorées avec IA
const MOCK_MEMBERS = [
  { 
    id: '1', 
    name: 'Alexandre Dubois', 
    rssi: -50, 
    battery: 90, 
    sos: false,
    status: 'online',
    lastSeen: 'Il y a 2 min',
    location: { latitude: 48.8566, longitude: 2.3522 },
    distance: 15,
    predictedPath: [
      { x: 100, y: 100, timestamp: Date.now() - 10000 },
      { x: 110, y: 105, timestamp: Date.now() - 5000 },
      { x: 120, y: 110, timestamp: Date.now() }
    ]
  },
  { 
    id: '2', 
    name: 'Sarah Martin', 
    rssi: -72, 
    battery: 60, 
    sos: false,
    status: 'online',
    lastSeen: 'Il y a 5 min',
    location: { latitude: 48.8566, longitude: 2.3522 },
    distance: 45,
    predictedPath: []
  },
  { 
    id: '3', 
    name: 'Thomas Bernard', 
    rssi: -85, 
    battery: 30, 
    sos: true,
    status: 'warning',
    lastSeen: 'Il y a 1 min',
    location: { latitude: 48.8566, longitude: 2.3522 },
    distance: 75,
    predictedPath: []
  },
  { 
    id: '4', 
    name: 'Marie Laurent', 
    rssi: -95, 
    battery: 15, 
    sos: false,
    status: 'offline',
    lastSeen: 'Il y a 15 min',
    location: { latitude: 48.8566, longitude: 2.3522 },
    distance: 120,
    predictedPath: []
  },
];

const MOCK_ALERTS = [
  {
    id: '1',
    type: 'SOS',
    memberId: '3',
    memberName: 'Thomas Bernard',
    message: 'Alerte SOS activée',
    severity: 'CRITICAL',
    timestamp: new Date(),
    resolved: false
  },
  {
    id: '2',
    type: 'BATTERY_LOW',
    memberId: '4',
    memberName: 'Marie Laurent',
    message: 'Batterie critique: 15%',
    severity: 'HIGH',
    timestamp: new Date(Date.now() - 300000),
    resolved: false
  }
];

export default function HomeScreen({ navigation, user, onLogout }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemStats, setSystemStats] = useState({
    activeMembers: MOCK_MEMBERS.length,
    alerts: MOCK_ALERTS.length,
    batteryAvg: Math.round(MOCK_MEMBERS.reduce((acc, m) => acc + m.battery, 0) / MOCK_MEMBERS.length),
    signalAvg: Math.round(MOCK_MEMBERS.reduce((acc, m) => acc + m.rssi, 0) / MOCK_MEMBERS.length),
    onlineMembers: MOCK_MEMBERS.filter(m => m.status === 'online').length,
    emergencyAlerts: MOCK_ALERTS.filter(a => a.type === 'SOS').length,
    criticalMembers: MOCK_MEMBERS.filter(m => m.status === 'critical').length,
    totalData: 1247,
    networkStatus: 'excellent',
    systemHealth: 98,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [showAdvancedDashboard, setShowAdvancedDashboard] = useState(false);
  const [showARView, setShowARView] = useState(false);
  const [voiceAssistantActive, setVoiceAssistantActive] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [members, setMembers] = useState(MOCK_MEMBERS);
  const [alerts, setAlerts] = useState(MOCK_ALERTS);

  // Animations 100% sécurisées pour Android
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const statsAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animation d'entrée spectaculaire
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

      // Simulation de mouvements des membres
      setMembers(prev => prev.map(member => ({
        ...member,
        rssi: Math.max(-120, Math.min(-30, member.rssi + (Math.random() - 0.5) * 10)),
        battery: Math.max(0, Math.min(100, member.battery - Math.random() * 0.5)),
        distance: Math.max(5, Math.min(200, member.distance + (Math.random() - 0.5) * 20)),
        lastSeen: member.status === 'online' ? 'Il y a quelques secondes' : member.lastSeen
      })));
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

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleVoiceCommand = (command) => {
    console.log('Commande vocale:', command);
    
    // Traiter les commandes vocales
    switch (command.type) {
      case 'LOCATE_MEMBER':
        setSelectedMember(command.memberId);
        break;
      case 'SHOW_ALL_MEMBERS':
        navigateToDashboard();
        break;
      case 'SEND_ALERT':
        // Envoyer une alerte générale
        break;
      case 'ACTIVATE_THERMAL_VIEW':
        setShowARView(true);
        break;
      case 'SHOW_3D_MAP':
        setShowAdvancedDashboard(true);
        break;
      case 'PREDICT_MOVEMENTS':
        setShowAdvancedDashboard(true);
        break;
      case 'ANALYZE_RISKS':
        setShowAdvancedDashboard(true);
        break;
      default:
        break;
    }
  };

  const handleAlertPress = (alert) => {
    console.log('Alerte sélectionnée:', alert);
    // Marquer l'alerte comme résolue
    setAlerts(prev => prev.map(a => 
      a.id === alert.id ? { ...a, resolved: true } : a
    ));
  };

  const handleARMemberSelect = (member) => {
    setSelectedMember(member.id);
    setShowARView(false);
    // Afficher les détails du membre
  };

  // Responsive helper amélioré
  const getResponsiveValue = (small, medium, large) => {
    if (isSmallScreen) return small;
    if (isMediumScreen) return medium;
    return large;
  };

  // Styles avec StyleSheet pour de meilleures performances
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
    aurora: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: height * 0.4,
      opacity: 0.3,
    },
    wave: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: height * 0.25,
      backgroundColor: 'rgba(59, 130, 246, 0.08)',
    },
    scrollContainer: {
      flexGrow: 1,
      paddingHorizontal: getResponsiveValue(16, 20, 24),
      paddingVertical: getResponsiveValue(20, 24, 28),
    },
    header: {
      marginBottom: getResponsiveValue(24, 32, 40),
    },
    greeting: {
      fontSize: getResponsiveValue(24, 28, 32),
      fontWeight: '700',
      color: 'white',
      marginBottom: getResponsiveValue(8, 12, 16),
    },
    time: {
      fontSize: getResponsiveValue(14, 16, 18),
      color: '#94a3b8',
      marginBottom: getResponsiveValue(4, 6, 8),
    },
    user: {
      fontSize: getResponsiveValue(16, 18, 20),
      color: '#3b82f6',
      fontWeight: '600',
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: getResponsiveValue(24, 32, 40),
      gap: getResponsiveValue(12, 16, 20),
    },
    statCard: {
      width: getResponsiveValue(width / 2 - 24, width / 2 - 28, width / 3 - 32),
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
      transform: [{ scale: pulseAnim }],
    },
    statValue: {
      fontSize: getResponsiveValue(24, 28, 32),
      fontWeight: '700',
      color: 'white',
      marginBottom: getResponsiveValue(4, 6, 8),
    },
    statLabel: {
      fontSize: getResponsiveValue(12, 14, 16),
      color: '#94a3b8',
      fontWeight: '500',
    },
    alertCard: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderRadius: getResponsiveValue(16, 18, 20),
      padding: getResponsiveValue(16, 20, 24),
      borderWidth: 1,
      borderColor: 'rgba(239, 68, 68, 0.3)',
      marginBottom: getResponsiveValue(24, 32, 40),
      transform: [{ scale: glowAnim }],
    },
    alertHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: getResponsiveValue(12, 16, 20),
    },
    alertTitle: {
      fontSize: getResponsiveValue(16, 18, 20),
      fontWeight: '600',
      color: '#ef4444',
      marginLeft: getResponsiveValue(12, 14, 16),
    },
    alertText: {
      fontSize: getResponsiveValue(14, 16, 18),
      color: '#f87171',
      lineHeight: getResponsiveValue(20, 24, 28),
    },
    actionButton: {
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
      transform: [{ scale: buttonScaleAnim }],
    },
    actionButtonText: {
      color: 'white',
      fontSize: getResponsiveValue(16, 18, 20),
      fontWeight: '600',
    },
    logoutButton: {
      backgroundColor: 'rgba(148, 163, 184, 0.2)',
      borderRadius: getResponsiveValue(12, 14, 16),
      padding: getResponsiveValue(12, 16, 20),
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'rgba(148, 163, 184, 0.3)',
    },
    logoutButtonText: {
      color: '#94a3b8',
      fontSize: getResponsiveValue(14, 16, 18),
      fontWeight: '500',
    },
    shimmer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: getResponsiveValue(16, 18, 20),
    },
    advancedFeatures: {
      marginBottom: getResponsiveValue(24, 32, 40),
    },
    featureButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: getResponsiveValue(12, 16, 20),
    },
    featureButton: {
      flex: 1,
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderRadius: getResponsiveValue(12, 14, 16),
      padding: getResponsiveValue(16, 20, 24),
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'rgba(16, 185, 129, 0.3)',
    },
    featureButtonActive: {
      backgroundColor: 'rgba(16, 185, 129, 0.3)',
      borderColor: '#10b981',
    },
    featureButtonText: {
      color: '#10b981',
      fontSize: getResponsiveValue(12, 14, 16),
      fontWeight: '600',
      marginTop: getResponsiveValue(8, 10, 12),
    },
    featureIcon: {
      marginBottom: getResponsiveValue(8, 10, 12),
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    modalContent: {
      flex: 1,
      margin: getResponsiveValue(20, 24, 32),
    },
    closeButton: {
      position: 'absolute',
      top: getResponsiveValue(40, 48, 56),
      right: getResponsiveValue(20, 24, 32),
      backgroundColor: 'rgba(239, 68, 68, 0.8)',
      padding: getResponsiveValue(12, 14, 16),
      borderRadius: getResponsiveValue(20, 24, 28),
      zIndex: 10,
    },
    closeButtonText: {
      color: 'white',
      fontSize: getResponsiveValue(12, 14, 16),
      fontWeight: 'bold',
    },
  });

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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      {/* Gradient de fond premium */}
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#334155', '#475569', '#64748b', '#94a3b8']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Animation d'aurore boréale */}
      <Animated.View style={styles.aurora}>
        <LinearGradient
          colors={['rgba(59, 130, 246, 0.1)', 'rgba(16, 185, 129, 0.05)', 'rgba(245, 158, 11, 0.02)', 'transparent']}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Animation de vague */}
      <Animated.View style={styles.wave} />

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* En-tête avec animation */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <Text style={styles.greeting}>
            Bonjour, {user?.name || 'Administrateur'}
          </Text>
          <Text style={styles.time}>{formatTime(currentTime)}</Text>
          <Text style={styles.time}>{formatDate(currentTime)}</Text>
          <Text style={styles.user}>Rôles: {user?.permissions?.join(', ') || 'Admin'}</Text>
        </Animated.View>

        {/* Grille de statistiques */}
        <Animated.View style={[styles.statsGrid, { opacity: statsAnim }]}>
          <View style={styles.statCard}>
            <Animated.View style={styles.shimmer} />
            <Text style={styles.statValue}>{systemStats.activeMembers}</Text>
            <Text style={styles.statLabel}>Membres actifs</Text>
          </View>

          <View style={styles.statCard}>
            <Animated.View style={styles.shimmer} />
            <Text style={styles.statValue}>{systemStats.alerts}</Text>
            <Text style={styles.statLabel}>Alertes</Text>
          </View>

          <View style={styles.statCard}>
            <Animated.View style={styles.shimmer} />
            <Text style={styles.statValue}>{systemStats.batteryAvg}%</Text>
            <Text style={styles.statLabel}>Batterie moyenne</Text>
          </View>

          <View style={styles.statCard}>
            <Animated.View style={styles.shimmer} />
            <Text style={styles.statValue}>{systemStats.signalAvg} dBm</Text>
            <Text style={styles.statLabel}>Signal moyen</Text>
          </View>

          <View style={styles.statCard}>
            <Animated.View style={styles.shimmer} />
            <Text style={styles.statValue}>{systemStats.onlineMembers}</Text>
            <Text style={styles.statLabel}>En ligne</Text>
          </View>

          <View style={styles.statCard}>
            <Animated.View style={styles.shimmer} />
            <Text style={styles.statValue}>{systemStats.systemHealth}%</Text>
            <Text style={styles.statLabel}>Santé système</Text>
          </View>
        </Animated.View>

        {/* Fonctionnalités avancées */}
        <Animated.View style={[styles.advancedFeatures, { opacity: fadeAnim }]}>
          <Text style={[styles.alertTitle, { marginBottom: 16, color: 'white' }]}>
            🚀 Fonctionnalités Avancées
          </Text>
          
          <View style={styles.featureButtons}>
            <TouchableOpacity
              style={[
                styles.featureButton,
                showAdvancedDashboard && styles.featureButtonActive
              ]}
              onPress={() => setShowAdvancedDashboard(!showAdvancedDashboard)}
            >
              <Ionicons name="analytics" size={24} color="#10b981" style={styles.featureIcon} />
              <Text style={styles.featureButtonText}>IA Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.featureButton,
                showARView && styles.featureButtonActive
              ]}
              onPress={() => setShowARView(!showARView)}
            >
              <Ionicons name="camera" size={24} color="#10b981" style={styles.featureIcon} />
              <Text style={styles.featureButtonText}>Réalité AR</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.featureButton,
                voiceAssistantActive && styles.featureButtonActive
              ]}
              onPress={() => setVoiceAssistantActive(!voiceAssistantActive)}
            >
              <Ionicons name="mic" size={24} color="#10b981" style={styles.featureIcon} />
              <Text style={styles.featureButtonText}>Assistant IA</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Alerte d'urgence */}
        {systemStats.emergencyAlerts > 0 && (
          <Animated.View style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <Ionicons name="warning" size={getResponsiveValue(20, 24, 28)} color="#ef4444" />
              <Text style={styles.alertTitle}>Alerte d'urgence</Text>
            </View>
            <Text style={styles.alertText}>
              {systemStats.criticalMembers} membre(s) critique(s) détecté(s). 
              Intervention requise immédiatement.
            </Text>
          </Animated.View>
        )}

        {/* Voice Assistant */}
        {voiceAssistantActive && (
          <VoiceAssistant
            members={members}
            onCommand={handleVoiceCommand}
            isActive={voiceAssistantActive}
            setIsActive={setVoiceAssistantActive}
          />
        )}

        {/* Boutons d'action */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={navigateToDashboard}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#3b82f6', '#1d4ed8', '#1e40af']}
              style={styles.actionButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.actionButtonText}>Voir le tableau de bord</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutButtonText}>Se déconnecter</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Modal Advanced Dashboard */}
      <Modal
        visible={showAdvancedDashboard}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowAdvancedDashboard(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <AdvancedDashboard
              members={members}
              alerts={alerts}
              onAlertPress={handleAlertPress}
            />
          </View>
        </View>
      </Modal>

      {/* Modal AR View */}
      <Modal
        visible={showARView}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ARView
              members={members}
              onClose={() => setShowARView(false)}
              onMemberSelect={handleARMemberSelect}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

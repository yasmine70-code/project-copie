import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar, 
  TextInput, 
  Alert, 
  ScrollView,
  Dimensions,
  RefreshControl,
  Animated,
  Platform,
  Vibration,
  AppState,
  BackHandler,
  KeyboardAvoidingView,
  Image,
  ImageBackground,
  ActivityIndicator,
  Modal,
  FlatList,
  Switch,
  Slider
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

// Configuration système améliorée
const SYSTEM_CONFIG = {
  // Configuration réseau améliorée
  NETWORK: {
    AP_NAME: 'RSSI_Surveillance_Pro',
    PASSWORD: 'secure123',
    CHANNEL: 6,
    MAX_CONNECTIONS: 20,
    ENCRYPTION: 'WPA2',
    BANDWIDTH: '20MHz',
    FREQUENCY: '2.4GHz',
    TRANSMISSION_POWER: '20dBm'
  },
  
  // Seuils RSSI optimisés selon environnement
  RSSI_THRESHOLDS: {
    EXCELLENT: -30,    // 5 barres - 0-10m
    VERY_GOOD: -45,    // 5 barres - 10-15m
    GOOD: -55,         // 4 barres - 15-25m
    FAIR: -70,         // 3 barres - 25-40m
    WEAK: -85,         // 2 barres - 40-60m
    VERY_WEAK: -95,    // 1 barre - 60-80m
    NONE: -105         // 0 barre - >80m
  },
  
  // Configuration des distances
  DISTANCE_RANGES: {
    EXCELLENT: { min: 0, max: 10, color: '#10b981', label: 'Excellent', bars: 5 },
    VERY_GOOD: { min: 10, max: 15, color: '#22c55e', label: 'Très Bon', bars: 5 },
    GOOD: { min: 15, max: 25, color: '#3b82f6', label: 'Bon', bars: 4 },
    FAIR: { min: 25, max: 40, color: '#f59e0b', label: 'Moyen', bars: 3 },
    WEAK: { min: 40, max: 60, color: '#fb923c', label: 'Faible', bars: 2 },
    VERY_WEAK: { min: 60, max: 80, color: '#ef4444', label: 'Très Faible', bars: 1 },
    NONE: { min: 80, max: 150, color: '#6b7280', label: 'Hors Portée', bars: 0 }
  },
  
  // Performance système
  PERFORMANCE: {
    UPDATE_INTERVAL: 3000,        // 3 secondes pour temps réel
    BATTERY_UPDATE_INTERVAL: 10000, // 10 secondes pour batterie
    RETRY_ATTEMPTS: 3,
    TIMEOUT: 5000,
    CACHE_DURATION: 30000,
    ANIMATION_DURATION: 300
  },
  
  // Sécurité
  SECURITY: {
    SESSION_TIMEOUT: 7200000,      // 2 heures
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 900000,     // 15 minutes
    ENCRYPTION_KEY: 'RSSI_2024_SECURE',
    TWO_FACTOR_AUTH: false
  },
  
  // Alertes
  ALERTS: {
    CRITICAL_BATTERY: 15,
    LOW_BATTERY: 30,
    SOS_PRIORITY: 1,
    PERIMETER_BREACH: 2,
    CONNECTION_LOST: 3,
    SIGNAL_LOST: 4,
    HEALTH_ALERT: 5
  },
  
  // Notifications
  NOTIFICATIONS: {
    ENABLED: true,
    SOUND: true,
    VIBRATION: true,
    BADGE: true,
    PRIORITY: 'high'
  },
  
  // Cartographie
  MAPPING: {
    ENABLED: true,
    AUTO_CENTER: true,
    SHOW_HISTORY: true,
    HISTORY_DURATION: 3600000, // 1 heure
    GRID_SIZE: 10
  }
};

// Données des bracelets avec informations complètes
const BRACELETS_DATA = [
  {
    id: 'BR001',
    name: 'Alpha Leader',
    macAddress: '24:6F:28:7C:1A:2B',
    firmwareVersion: '2.1.0',
    hardwareVersion: 'ESP32-D0WDQ6-V3',
    batteryLevel: 92.00,
    rssi: -35,
    lastSeen: new Date(),
    distance: 8.00,
    proximity: 'EXCELLENT',
    signalBars: 5,
    connectionStatus: 'connected',
    signalQuality: 'excellent',
    temperature: 36.50,
    heartRate: 72,
    steps: 1234,
    sosActive: false,
    locationHistory: [{ x: 50, y: 50, timestamp: new Date() }],
    alerts: [],
    health: {
      stress: 'low',
      fatigue: 'normal',
      hydration: 'good',
      oxygen: 98
    },
    metadata: {
      assignedUser: 'Jean Dupont',
      role: 'leader',
      team: 'alpha',
      certification: 'advanced',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      age: 35,
      experience: '8 ans',
      speciality: 'Navigation',
      emergencyContact: '+33612345678',
      bloodType: 'O+',
      allergies: 'Aucune'
    }
  },
  {
    id: 'BR002',
    name: 'Beta Scout',
    macAddress: '24:6F:28:7C:1B:3C',
    firmwareVersion: '2.1.0',
    hardwareVersion: 'ESP32-D0WDQ6-V3',
    batteryLevel: 78.00,
    rssi: -48,
    lastSeen: new Date(),
    distance: 18.00,
    proximity: 'GOOD',
    signalBars: 4,
    connectionStatus: 'connected',
    signalQuality: 'good',
    temperature: 36.80,
    heartRate: 68,
    steps: 987,
    sosActive: false,
    locationHistory: [{ x: 30, y: 70, timestamp: new Date() }],
    alerts: [],
    health: {
      stress: 'normal',
      fatigue: 'low',
      hydration: 'good',
      oxygen: 97
    },
    metadata: {
      assignedUser: 'Marie Martin',
      role: 'scout',
      team: 'beta',
      certification: 'intermediate',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      age: 28,
      experience: '4 ans',
      speciality: 'Reconnaissance',
      emergencyContact: '+33687654321',
      bloodType: 'A+',
      allergies: 'Pollens'
    }
  },
  {
    id: 'BR003',
    name: 'Gamma Medic',
    macAddress: '24:6F:28:7C:1A:4D',
    firmwareVersion: '2.0.1',
    hardwareVersion: 'ESP32-D0WDQ6-V3',
    batteryLevel: 45.00,
    rssi: -72,
    lastSeen: new Date(),
    distance: 35.00,
    proximity: 'FAIR',
    signalBars: 3,
    connectionStatus: 'connected',
    signalQuality: 'fair',
    temperature: 37.10,
    heartRate: 75,
    steps: 756,
    sosActive: false,
    locationHistory: [{ x: 80, y: 40, timestamp: new Date() }],
    alerts: [{ type: 'battery', level: 'warning', message: 'Batterie en dessous de 50%' }],
    health: {
      stress: 'moderate',
      fatigue: 'moderate',
      hydration: 'moderate',
      oxygen: 96
    },
    metadata: {
      assignedUser: 'Dr. Sophie Laurent',
      role: 'medic',
      team: 'gamma',
      certification: 'medical',
      photo: 'https://images.unsplash.com/photo-1559839734-5b5ea2db3b91?w=150&h=150&fit=crop&crop=face',
      age: 32,
      experience: '6 ans',
      speciality: 'Médecine d\'urgence',
      emergencyContact: '+33698765432',
      bloodType: 'B+',
      allergies: 'Pénicilline'
    }
  },
  {
    id: 'BR004',
    name: 'Delta Explorer',
    macAddress: '24:6F:28:7C:1B:5E',
    firmwareVersion: '2.1.0',
    hardwareVersion: 'ESP32-D0WDQ6-V3',
    batteryLevel: 23.00,
    rssi: -88,
    lastSeen: new Date(Date.now() - 45000),
    distance: 55.00,
    proximity: 'WEAK',
    signalBars: 2,
    connectionStatus: 'disconnected',
    signalQuality: 'weak',
    temperature: 36.20,
    heartRate: 80,
    steps: 543,
    sosActive: true,
    locationHistory: [{ x: 20, y: 20, timestamp: new Date(Date.now() - 45000) }],
    alerts: [
      { type: 'battery', level: 'critical', message: 'Batterie critique!' },
      { type: 'sos', level: 'critical', message: 'SOS activé!' },
      { type: 'connection', level: 'warning', message: 'Connexion perdue' }
    ],
    health: {
      stress: 'high',
      fatigue: 'high',
      hydration: 'low',
      oxygen: 94
    },
    metadata: {
      assignedUser: 'Pierre Bernard',
      role: 'explorer',
      team: 'delta',
      certification: 'basic',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      age: 25,
      experience: '2 ans',
      speciality: 'Exploration',
      emergencyContact: '+33611111111',
      bloodType: 'O-',
      allergies: 'Aucune'
    }
  },
  {
    id: 'BR005',
    name: 'Epsilon Tech',
    macAddress: '24:6F:28:7C:1A:6F',
    firmwareVersion: '2.1.0',
    hardwareVersion: 'ESP32-D0WDQ6-V3',
    batteryLevel: 88.00,
    rssi: -98,
    lastSeen: new Date(),
    distance: 70.00,
    proximity: 'VERY_WEAK',
    signalBars: 1,
    connectionStatus: 'connected',
    signalQuality: 'very_weak',
    temperature: 36.90,
    heartRate: 70,
    steps: 432,
    sosActive: false,
    locationHistory: [{ x: 90, y: 80, timestamp: new Date() }],
    alerts: [{ type: 'signal', level: 'warning', message: 'Signal très faible' }],
    health: {
      stress: 'low',
      fatigue: 'normal',
      hydration: 'good',
      oxygen: 99
    },
    metadata: {
      assignedUser: 'Claire Dubois',
      role: 'technician',
      team: 'epsilon',
      certification: 'technical',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      age: 30,
      experience: '5 ans',
      speciality: 'Technicien RSSI',
      emergencyContact: '+33622222222',
      bloodType: 'AB+',
      allergies: 'Latex'
    }
  }
];

// Utilitaires système améliorés
class SystemUtils {
  static calculateDistanceFromRSSI(rssi) {
    const A = -45;
    const n = 2.7;
    const environmentFactor = 1.1;
    
    if (rssi >= 0) return 0;
    
    const rawDistance = Math.pow(10, (rssi - A) / (-10 * n));
    const correctedDistance = rawDistance * environmentFactor;
    const finalDistance = Math.min(Math.max(correctedDistance, 0), 150);
    
    return Math.round(finalDistance * 100) / 100;
  }

  static getProximityFromRSSI(rssi) {
    if (rssi >= SYSTEM_CONFIG.RSSI_THRESHOLDS.EXCELLENT) return 'EXCELLENT';
    if (rssi >= SYSTEM_CONFIG.RSSI_THRESHOLDS.VERY_GOOD) return 'VERY_GOOD';
    if (rssi >= SYSTEM_CONFIG.RSSI_THRESHOLDS.GOOD) return 'GOOD';
    if (rssi >= SYSTEM_CONFIG.RSSI_THRESHOLDS.FAIR) return 'FAIR';
    if (rssi >= SYSTEM_CONFIG.RSSI_THRESHOLDS.WEAK) return 'WEAK';
    if (rssi >= SYSTEM_CONFIG.RSSI_THRESHOLDS.VERY_WEAK) return 'VERY_WEAK';
    return 'NONE';
  }

  static getSignalBarsFromRSSI(rssi) {
    const proximity = this.getProximityFromRSSI(rssi);
    return SYSTEM_CONFIG.DISTANCE_RANGES[proximity]?.bars || 0;
  }

  static getSignalQuality(rssi) {
    if (rssi >= -50) return 'excellent';
    if (rssi >= -60) return 'good';
    if (rssi >= -70) return 'fair';
    if (rssi >= -85) return 'weak';
    return 'very_weak';
  }

  static getBatteryIcon(level) {
    if (level <= 10) return 'battery-dead';
    if (level <= 30) return 'battery-low';
    if (level <= 60) return 'battery-half';
    return 'battery-full';
  }

  static getBatteryColor(level) {
    if (level <= SYSTEM_CONFIG.ALERTS.CRITICAL_BATTERY) return '#dc2626';
    if (level <= SYSTEM_CONFIG.ALERTS.LOW_BATTERY) return '#f59e0b';
    return '#10b981';
  }

  static getProximityColor(proximity) {
    return SYSTEM_CONFIG.DISTANCE_RANGES[proximity]?.color || '#6b7280';
  }

  static getProximityLabel(proximity) {
    return SYSTEM_CONFIG.DISTANCE_RANGES[proximity]?.label || 'Inconnu';
  }

  static getHealthStatus(health) {
    if (!health) return { status: 'unknown', color: '#6b7280', icon: 'help-circle' };
    
    const { stress, fatigue, hydration, oxygen } = health;
    
    if (stress === 'high' || fatigue === 'high' || hydration === 'low' || oxygen < 95) {
      return { status: 'critical', color: '#dc2626', icon: 'warning' };
    }
    
    if (stress === 'moderate' || fatigue === 'moderate' || hydration === 'moderate') {
      return { status: 'warning', color: '#f59e0b', icon: 'alert-circle' };
    }
    
    return { status: 'good', color: '#10b981', icon: 'checkmark-circle' };
  }

  static formatDuration(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  static generateHeatmapData(bracelets) {
    const heatmap = [];
    const gridSize = SYSTEM_CONFIG.MAPPING.GRID_SIZE;
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        let intensity = 0;
        
        bracelets.forEach(bracelet => {
          if (bracelet.locationHistory && bracelet.locationHistory.length > 0) {
            const location = bracelet.locationHistory[bracelet.locationHistory.length - 1];
            const distance = Math.sqrt(
              Math.pow(location.x - (i * 10), 2) + 
              Math.pow(location.y - (j * 10), 2)
            );
            
            intensity += Math.max(0, 1 - distance / 100);
          }
        });
        
        heatmap.push({ x: i, y: j, intensity: Math.min(intensity, 1) });
      }
    }
    
    return heatmap;
  }
}

// Hook personnalisé pour la gestion du temps réel
const useRealTimeUpdates = (updateInterval, callback) => {
  const intervalRef = useRef(null);
  const lastUpdateRef = useRef(Date.now());

  useEffect(() => {
    const startUpdates = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        const now = Date.now();
        if (now - lastUpdateRef.current >= updateInterval) {
          callback();
          lastUpdateRef.current = now;
        }
      }, 1000);
    };

    startUpdates();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [updateInterval, callback]);
};

// Hook personnalisé pour la gestion des alertes amélioré
const useAlertsManager = (bracelets, safetyRadius) => {
  const [alerts, setAlerts] = useState([]);
  const [alertHistory, setAlertHistory] = useState([]);
  const [alertStats, setAlertStats] = useState({
    total: 0,
    critical: 0,
    warning: 0,
    info: 0
  });

  const checkAlerts = useCallback(() => {
    const newAlerts = [];
    const currentTime = new Date();

    if (!Array.isArray(bracelets)) return;

    bracelets.forEach(bracelet => {
      if (!bracelet || !bracelet.id) return;

      // Vérification alerte SOS
      if (bracelet.sosActive) {
        newAlerts.push({
          id: `sos-${bracelet.id}`,
          type: 'sos',
          priority: SYSTEM_CONFIG.ALERTS.SOS_PRIORITY,
          message: `SOS activé sur ${bracelet.name}`,
          braceletId: bracelet.id,
          timestamp: currentTime,
          severity: 'critical',
          location: bracelet.locationHistory?.[bracelet.locationHistory.length - 1]
        });
      }

      // Vérification batterie critique
      if (typeof bracelet.batteryLevel === 'number' && bracelet.batteryLevel <= SYSTEM_CONFIG.ALERTS.CRITICAL_BATTERY) {
        newAlerts.push({
          id: `battery-critical-${bracelet.id}`,
          type: 'battery',
          priority: SYSTEM_CONFIG.ALERTS.CONNECTION_LOST,
          message: `Batterie critique sur ${bracelet.name} (${bracelet.batteryLevel.toFixed(2)}%)`,
          braceletId: bracelet.id,
          timestamp: currentTime,
          severity: 'critical'
        });
      }

      // Vérification santé
      if (bracelet.health) {
        const healthStatus = SystemUtils.getHealthStatus(bracelet.health);
        if (healthStatus.status === 'critical') {
          newAlerts.push({
            id: `health-${bracelet.id}`,
            type: 'health',
            priority: SYSTEM_CONFIG.ALERTS.HEALTH_ALERT,
            message: `Alerte santé pour ${bracelet.name}`,
            braceletId: bracelet.id,
            timestamp: currentTime,
            severity: 'critical'
          });
        }
      }

      // Vérification périmètre
      if (typeof bracelet.distance === 'number' && bracelet.distance > safetyRadius) {
        newAlerts.push({
          id: `perimeter-${bracelet.id}`,
          type: 'perimeter',
          priority: SYSTEM_CONFIG.ALERTS.PERIMETER_BREACH,
          message: `${bracelet.name} hors périmètre (${bracelet.distance.toFixed(2)}m)`,
          braceletId: bracelet.id,
          timestamp: currentTime,
          severity: 'high',
          location: bracelet.locationHistory?.[bracelet.locationHistory.length - 1]
        });
      }

      // Vérification connexion
      if (bracelet.connectionStatus === 'disconnected') {
        const timeSinceLastSeen = currentTime - (bracelet.lastSeen || currentTime);
        if (timeSinceLastSeen > 60000) {
          newAlerts.push({
            id: `connection-${bracelet.id}`,
            type: 'connection',
            priority: SYSTEM_CONFIG.ALERTS.CONNECTION_LOST,
            message: `Perte de connexion avec ${bracelet.name}`,
            braceletId: bracelet.id,
            timestamp: currentTime,
            severity: 'medium'
          });
        }
      }

      // Vérification signal
      if (typeof bracelet.signalBars === 'number' && bracelet.signalBars <= 1) {
        newAlerts.push({
          id: `signal-${bracelet.id}`,
          type: 'signal',
          priority: SYSTEM_CONFIG.ALERTS.SIGNAL_LOST,
          message: `Signal très faible pour ${bracelet.name}`,
          braceletId: bracelet.id,
          timestamp: currentTime,
          severity: 'medium'
        });
      }
    });

    setAlerts(newAlerts);
    
    // Mise à jour des statistiques
    const stats = {
      total: newAlerts.length,
      critical: newAlerts.filter(a => a.severity === 'critical').length,
      warning: newAlerts.filter(a => a.severity === 'warning').length,
      info: newAlerts.filter(a => a.severity === 'info').length
    };
    setAlertStats(stats);
    
    // Ajouter à l'historique
    if (newAlerts.length > 0) {
      setAlertHistory(prev => [...newAlerts, ...(prev || [])].slice(0, 100));
    }
  }, [bracelets, safetyRadius]);

  useEffect(() => {
    checkAlerts();
  }, [checkAlerts]);

  return { alerts, alertHistory, alertStats, checkAlerts };
};

// Composant de barres de signal amélioré
const SignalBars = React.memo(({ bars, rssi, size = 'medium', animated = true }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    if (animated && typeof bars === 'number' && bars <= 2) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          })
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    }
  }, [bars, animated]);

  const sizes = {
    small: { width: 3, height: 2, spacing: 1 },
    medium: { width: 4, height: 3, spacing: 2 },
    large: { width: 6, height: 4, spacing: 3 }
  };

  const currentSize = sizes[size] || sizes.medium;
  
  const getBarColor = (index) => {
    const colors = ['#6b7280', '#ef4444', '#fb923c', '#f59e0b', '#3b82f6', '#10b981'];
    return index <= bars ? colors[bars] : colors[0];
  };

  return (
    <View style={styles.signalBarsContainer}>
      <View style={styles.signalBars}>
        {[1, 2, 3, 4, 5].map((index) => (
          <Animated.View
            key={index}
            style={[
              styles.signalBar,
              {
                width: currentSize.width,
                height: index * currentSize.height,
                backgroundColor: getBarColor(index),
                marginRight: currentSize.spacing,
                opacity: index <= bars ? 1 : 0.3,
                transform: [
                  { scale: index <= bars && animated && bars <= 2 ? pulseAnim : 1 }
                ]
              }
            ]}
          />
        ))}
      </View>
      <Text style={styles.signalBarsText}>{typeof bars === 'number' ? `${bars}/5` : '0/5'}</Text>
    </View>
  );
});

// Composant de santé amélioré
const HealthIndicator = React.memo(({ health, size = 'medium' }) => {
  const healthStatus = SystemUtils.getHealthStatus(health);
  
  const sizes = {
    small: { icon: 16, text: 10 },
    medium: { icon: 20, text: 12 },
    large: { icon: 24, text: 14 }
  };

  const currentSize = sizes[size] || sizes.medium;

  return (
    <View style={styles.healthIndicator}>
      <Ionicons 
        name={healthStatus.icon} 
        size={currentSize.icon} 
        color={healthStatus.color} 
      />
      <Text style={[
        styles.healthText,
        { fontSize: currentSize.text, color: healthStatus.color }
      ]}>
        {healthStatus.status.toUpperCase()}
      </Text>
    </View>
  );
});

// Composant de carte bracelet amélioré
const BraceletCard = React.memo(({ bracelet, onPress, safetyRadius, showHealth = true }) => {
  const cardAnim = useRef(new Animated.Value(1)).current;
  const [expanded, setExpanded] = useState(false);
  
  const handlePressIn = () => {
    Animated.timing(cardAnim, {
      toValue: 0.95,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(cardAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handleCardPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setExpanded(!expanded);
    if (onPress) onPress(bracelet);
  };

  if (!bracelet) return null;

  const hasCriticalAlerts = Array.isArray(bracelet.alerts) && bracelet.alerts.some(alert => alert.level === 'critical');
  const hasWarnings = Array.isArray(bracelet.alerts) && bracelet.alerts.some(alert => alert.level === 'warning');
  const healthStatus = SystemUtils.getHealthStatus(bracelet.health);

  return (
    <Animated.View style={{ transform: [{ scale: cardAnim }] }}>
      <TouchableOpacity
        style={[
          styles.braceletCard,
          hasCriticalAlerts && styles.braceletCardCritical,
          hasWarnings && styles.braceletCardWarning
        ]}
        onPress={handleCardPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={[
            'rgba(30, 41, 59, 0.95)',
            'rgba(15, 23, 42, 0.95)',
            hasCriticalAlerts ? 'rgba(239, 68, 68, 0.1)' : 
            hasWarnings ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.05)'
          ]}
          style={styles.braceletCardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Header */}
          <View style={styles.braceletHeader}>
            <View style={styles.braceletInfo}>
              <View style={styles.userProfile}>
                <Image 
                  source={{ uri: bracelet.metadata?.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' }} 
                  style={styles.userPhoto}
                />
                <View style={styles.userInfo}>
                  <Text style={styles.braceletName}>{bracelet.name || 'Inconnu'}</Text>
                  <Text style={styles.braceletId}>{bracelet.id || 'N/A'}</Text>
                  <Text style={styles.braceletUser}>{bracelet.metadata?.assignedUser || 'Non assigné'}</Text>
                  <View style={styles.userDetails}>
                    <Text style={styles.userDetail}>🎂 {bracelet.metadata?.age || '?'} ans</Text>
                    <Text style={styles.userDetail}>⭐ {bracelet.metadata?.experience || '?'}</Text>
                    <Text style={styles.userDetail}>🎯 {bracelet.metadata?.speciality || 'N/A'}</Text>
                  </View>
                </View>
              </View>
            </View>
            
            <View style={styles.braceletStatus}>
              <View style={[
                styles.statusIndicator,
                { 
                  backgroundColor: bracelet.connectionStatus === 'connected' ? '#10b981' : '#ef4444'
                }
              ]} />
              <Text style={styles.statusText}>
                {bracelet.connectionStatus === 'connected' ? 'Connecté' : 'Déconnecté'}
              </Text>
            </View>
          </View>

          {/* Métriques principales */}
          <View style={styles.braceletMetrics}>
            <View style={styles.metricItem}>
              <SignalBars bars={typeof bracelet.signalBars === 'number' ? bracelet.signalBars : 0} rssi={bracelet.rssi || -100} size="small" />
              <Text style={styles.metricLabel}>Signal</Text>
              <Text style={styles.metricValue}>{typeof bracelet.distance === 'number' ? bracelet.distance.toFixed(2) : '0.00'}m</Text>
            </View>
            
            <View style={styles.metricItem}>
              <Ionicons 
                name={SystemUtils.getBatteryIcon(bracelet.batteryLevel || 0)} 
                size={20} 
                color={SystemUtils.getBatteryColor(bracelet.batteryLevel || 0)} 
              />
              <Text style={styles.metricLabel}>Batterie</Text>
              <Text style={styles.metricValue}>{typeof bracelet.batteryLevel === 'number' ? bracelet.batteryLevel.toFixed(2) : '0.00'}%</Text>
            </View>
            
            <View style={styles.metricItem}>
              <Ionicons name="heart" size={20} color="#ef4444" />
              <Text style={styles.metricLabel}>Cardiaque</Text>
              <Text style={styles.metricValue}>{typeof bracelet.heartRate === 'number' ? bracelet.heartRate : '0'} bpm</Text>
            </View>
            
            <View style={styles.metricItem}>
              <Ionicons name="thermometer" size={20} color="#f59e0b" />
              <Text style={styles.metricLabel}>Température</Text>
              <Text style={styles.metricValue}>{typeof bracelet.temperature === 'number' ? bracelet.temperature.toFixed(2) : '0.00'}°C</Text>
            </View>
          </View>

          {/* Indicateur de santé */}
          {showHealth && bracelet.health && (
            <View style={styles.healthContainer}>
              <HealthIndicator health={bracelet.health} size="small" />
              <View style={styles.healthDetails}>
                <Text style={styles.healthDetail}>Stress: {bracelet.health.stress}</Text>
                <Text style={styles.healthDetail}>Fatigue: {bracelet.health.fatigue}</Text>
                <Text style={styles.healthDetail}>Hydratation: {bracelet.health.hydration}</Text>
                <Text style={styles.healthDetail}>O₂: {bracelet.health.oxygen}%</Text>
              </View>
            </View>
          )}

          {/* Alertes */}
          {Array.isArray(bracelet.alerts) && bracelet.alerts.length > 0 && (
            <View style={styles.braceletAlerts}>
              {bracelet.alerts.slice(0, 2).map((alert, index) => (
                <View key={index} style={[
                  styles.alertBadge,
                  alert.level === 'critical' && styles.alertBadgeCritical,
                  alert.level === 'warning' && styles.alertBadgeWarning
                ]}>
                  <Ionicons 
                    name={alert.type === 'sos' ? 'warning' : 
                           alert.type === 'battery' ? 'battery-dead' :
                           alert.type === 'connection' ? 'wifi-off' :
                           alert.type === 'health' ? 'medkit' :
                           'wifi'} 
                    size={12} 
                    color="white" 
                  />
                  <Text style={styles.alertText}>{alert.message || 'Alerte sans message'}</Text>
                </View>
              ))}
              {bracelet.alerts.length > 2 && (
                <Text style={styles.moreAlertsText}>+{bracelet.alerts.length - 2} alertes</Text>
              )}
            </View>
          )}

          {/* SOS Button */}
          {bracelet.sosActive && (
            <View style={styles.sosIndicator}>
              <Ionicons name="warning" size={20} color="#ef4444" />
              <Text style={styles.sosText}>SOS ACTIF</Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
});

// Composant de tableau de bord amélioré
const Dashboard = ({ bracelets, alerts, safetyRadius, onBraceletPress, settings, onSettingsChange }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('distance');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Filtrage et tri optimisés
  const filteredAndSortedBracelets = useMemo(() => {
    let filtered = Array.isArray(bracelets) ? bracelets : [];

    // Filtrage
    if (selectedFilter !== 'all') {
      switch (selectedFilter) {
        case 'connected':
          filtered = filtered.filter(b => b.connectionStatus === 'connected');
          break;
        case 'disconnected':
          filtered = filtered.filter(b => b.connectionStatus === 'disconnected');
          break;
        case 'sos':
          filtered = filtered.filter(b => b.sosActive);
          break;
        case 'low_battery':
          filtered = filtered.filter(b => typeof b.batteryLevel === 'number' && b.batteryLevel <= SYSTEM_CONFIG.ALERTS.LOW_BATTERY);
          break;
        case 'critical':
          filtered = filtered.filter(b => Array.isArray(b.alerts) && b.alerts.some(a => a.level === 'critical'));
          break;
        case 'out_of_range':
          filtered = filtered.filter(b => typeof b.distance === 'number' && b.distance > safetyRadius);
          break;
        case 'health_issues':
          filtered = filtered.filter(b => {
            const healthStatus = SystemUtils.getHealthStatus(b.health);
            return healthStatus.status === 'critical' || healthStatus.status === 'warning';
          });
          break;
      }
    }

    // Recherche
    if (searchQuery && searchQuery.trim()) {
      filtered = filtered.filter(b => 
        (b.name && b.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (b.metadata?.assignedUser && b.metadata.assignedUser.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (b.id && b.id.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Tri
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return (a.distance || 0) - (b.distance || 0);
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'battery':
          return (b.batteryLevel || 0) - (a.batteryLevel || 0);
        case 'signal':
          return (b.signalBars || 0) - (a.signalBars || 0);
        case 'user':
          const userA = a.metadata?.assignedUser || '';
          const userB = b.metadata?.assignedUser || '';
          return userA.localeCompare(userB);
        case 'health':
          const healthA = SystemUtils.getHealthStatus(a.health);
          const healthB = SystemUtils.getHealthStatus(b.health);
          return healthA.status.localeCompare(healthB.status);
        default:
          return 0;
      }
    });
  }, [bracelets, selectedFilter, searchQuery, sortBy, safetyRadius]);

  const stats = useMemo(() => {
    const braceletsList = Array.isArray(bracelets) ? bracelets : [];
    return {
      total: braceletsList.length,
      connected: braceletsList.filter(b => b.connectionStatus === 'connected').length,
      disconnected: braceletsList.filter(b => b.connectionStatus === 'disconnected').length,
      sos: braceletsList.filter(b => b.sosActive).length,
      lowBattery: braceletsList.filter(b => typeof b.batteryLevel === 'number' && b.batteryLevel <= SYSTEM_CONFIG.ALERTS.LOW_BATTERY).length,
      criticalBattery: braceletsList.filter(b => typeof b.batteryLevel === 'number' && b.batteryLevel <= SYSTEM_CONFIG.ALERTS.CRITICAL_BATTERY).length,
      outOfRange: braceletsList.filter(b => typeof b.distance === 'number' && b.distance > safetyRadius).length,
      healthIssues: braceletsList.filter(b => {
        const healthStatus = SystemUtils.getHealthStatus(b.health);
        return healthStatus.status === 'critical' || healthStatus.status === 'warning';
      }).length,
      averageSignal: braceletsList.length > 0 ? braceletsList.reduce((acc, b) => acc + (b.signalBars || 0), 0) / braceletsList.length : 0,
      averageBattery: braceletsList.length > 0 ? braceletsList.reduce((acc, b) => acc + (b.batteryLevel || 0), 0) / braceletsList.length : 0
    };
  }, [bracelets, safetyRadius]);

  return (
    <ScrollView style={styles.dashboard} showsVerticalScrollIndicator={false}>
      {/* Statistiques améliorées */}
      <View style={styles.statsSection}>
        <View style={styles.statsHeader}>
          <Text style={styles.sectionTitle}>📊 Statistiques en Temps Réel</Text>
          <TouchableOpacity onPress={() => setShowAdvancedFilters(!showAdvancedFilters)}>
            <Ionicons name={showAdvancedFilters ? 'chevron-up' : 'chevron-down'} size={20} color="#3b82f6" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <LinearGradient colors={['#3b82f6', '#2563eb']} style={styles.statCardGradient}>
              <Text style={styles.statValue}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.statCard}>
            <LinearGradient colors={['#10b981', '#059669']} style={styles.statCardGradient}>
              <Text style={styles.statValue}>{stats.connected}</Text>
              <Text style={styles.statLabel}>Connectés</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.statCard}>
            <LinearGradient colors={['#ef4444', '#dc2626']} style={styles.statCardGradient}>
              <Text style={styles.statValue}>{stats.sos}</Text>
              <Text style={styles.statLabel}>SOS</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.statCard}>
            <LinearGradient colors={['#f59e0b', '#d97706']} style={styles.statCardGradient}>
              <Text style={styles.statValue}>{stats.lowBattery}</Text>
              <Text style={styles.statLabel}>Batterie Faible</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Statistiques avancées */}
        {showAdvancedFilters && (
          <View style={styles.advancedStats}>
            <View style={styles.advancedStatItem}>
              <Text style={styles.advancedStatLabel}>Signal Moyen:</Text>
              <Text style={styles.advancedStatValue}>{stats.averageSignal.toFixed(1)}/5</Text>
            </View>
            <View style={styles.advancedStatItem}>
              <Text style={styles.advancedStatLabel}>Batterie Moyenne:</Text>
              <Text style={styles.advancedStatValue}>{stats.averageBattery.toFixed(1)}%</Text>
            </View>
            <View style={styles.advancedStatItem}>
              <Text style={styles.advancedStatLabel}>Problèmes Santé:</Text>
              <Text style={styles.advancedStatValue}>{stats.healthIssues}</Text>
            </View>
            <View style={styles.advancedStatItem}>
              <Text style={styles.advancedStatLabel}>Hors Périmètre:</Text>
              <Text style={styles.advancedStatValue}>{stats.outOfRange}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Alertes critiques */}
      {Array.isArray(alerts) && alerts.length > 0 && (
        <View style={styles.alertsSection}>
          <Text style={styles.sectionTitle}>🚨 Alertes Actives</Text>
          {alerts.slice(0, 3).map(alert => (
            <View key={alert.id} style={[
              styles.alertItem,
              alert.severity === 'critical' && styles.alertItemCritical,
              alert.severity === 'high' && styles.alertItemHigh
            ]}>
              <Ionicons 
                name={alert.type === 'sos' ? 'warning' : alert.type === 'battery' ? 'battery-dead' : alert.type === 'health' ? 'medkit' : 'radio-outline'} 
                size={20} 
                color={alert.severity === 'critical' ? '#ffffff' : '#ef4444'} 
              />
              <Text style={[
                styles.alertMessage,
                alert.severity === 'critical' && styles.alertMessageCritical
              ]}>
                {alert.message || 'Alerte sans message'}
              </Text>
              <Text style={styles.alertTime}>
                {alert.timestamp ? alert.timestamp.toLocaleTimeString() : 'N/A'}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Panneau de configuration rapide */}
      <View style={styles.quickSettings}>
        <Text style={styles.sectionTitle}>⚙️ Configuration Rapide</Text>
        <View style={styles.settingsGrid}>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Switch
              value={settings.notifications}
              onValueChange={(value) => onSettingsChange('notifications', value)}
              trackColor={{ false: '#64748b', true: '#3b82f6' }}
              thumbColor={settings.notifications ? '#ffffff' : '#94a3b8'}
            />
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Vibration</Text>
            <Switch
              value={settings.vibration}
              onValueChange={(value) => onSettingsChange('vibration', value)}
              trackColor={{ false: '#64748b', true: '#3b82f6' }}
              thumbColor={settings.vibration ? '#ffffff' : '#94a3b8'}
            />
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Son</Text>
            <Switch
              value={settings.sound}
              onValueChange={(value) => onSettingsChange('sound', value)}
              trackColor={{ false: '#64748b', true: '#3b82f6' }}
              thumbColor={settings.sound ? '#ffffff' : '#94a3b8'}
            />
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Santé</Text>
            <Switch
              value={settings.showHealth}
              onValueChange={(value) => onSettingsChange('showHealth', value)}
              trackColor={{ false: '#64748b', true: '#3b82f6' }}
              thumbColor={settings.showHealth ? '#ffffff' : '#94a3b8'}
            />
          </View>
        </View>
        
        <View style={styles.safetyRadiusControl}>
          <Text style={styles.safetyRadiusLabel}>Périmètre: {safetyRadius}m</Text>
          <Slider
            style={styles.safetyRadiusSlider}
            minimumValue={50}
            maximumValue={150}
            value={safetyRadius}
            onValueChange={(value) => onSettingsChange('safetyRadius', Math.round(value))}
            minimumTrackTintColor="#64748b"
            maximumTrackTintColor="#3b82f6"
            thumbStyle={styles.sliderThumb}
          />
        </View>
      </View>

      {/* Filtres et recherche */}
      <View style={styles.filtersSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#64748b" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un bracelet..."
            placeholderTextColor="#64748b"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          {['all', 'connected', 'disconnected', 'sos', 'low_battery', 'critical', 'out_of_range', 'health_issues'].map(filter => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.filterButtonActive
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[
                styles.filterButtonText,
                selectedFilter === filter && styles.filterButtonTextActive
              ]}>
                {filter === 'all' && 'Tous'}
                {filter === 'connected' && 'Connectés'}
                {filter === 'disconnected' && 'Déconnectés'}
                {filter === 'sos' && 'SOS'}
                {filter === 'low_battery' && 'Batterie Faible'}
                {filter === 'critical' && 'Critiques'}
                {filter === 'out_of_range' && 'Hors Portée'}
                {filter === 'health_issues' && 'Santé'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Trier par:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['distance', 'name', 'battery', 'signal', 'user', 'health'].map(sort => (
              <TouchableOpacity
                key={sort}
                style={[
                  styles.sortButton,
                  sortBy === sort && styles.sortButtonActive
                ]}
                onPress={() => setSortBy(sort)}
              >
                <Text style={[
                  styles.sortButtonText,
                  sortBy === sort && styles.sortButtonTextActive
                ]}>
                  {sort === 'distance' && 'Distance'}
                  {sort === 'name' && 'Nom'}
                  {sort === 'battery' && 'Batterie'}
                  {sort === 'signal' && 'Signal'}
                  {sort === 'user' && 'Utilisateur'}
                  {sort === 'health' && 'Santé'}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Liste des bracelets */}
      <View style={styles.braceletsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📡 Bracelets ({filteredAndSortedBracelets.length})</Text>
        </View>
        
        <FlatList
          data={filteredAndSortedBracelets}
          renderItem={({ item }) => (
            <BraceletCard
              bracelet={item}
              onPress={onBraceletPress}
              safetyRadius={safetyRadius}
              showHealth={settings.showHealth}
            />
          )}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.braceletsList}
        />
      </View>
    </ScrollView>
  );
};

// Composant de carte de localisation
const LocationMap = React.memo(({ bracelets, safetyRadius }) => {
  const mapSize = Math.min(width - 40, 300);
  
  const renderBraceletPosition = (bracelet, index) => {
    if (!bracelet.locationHistory || bracelet.locationHistory.length === 0) return null;
    
    const location = bracelet.locationHistory[bracelet.locationHistory.length - 1];
    const x = (location.x / 100) * mapSize;
    const y = (location.y / 100) * mapSize;
    
    return (
      <View key={bracelet.id} style={[styles.braceletPosition, { left: x, top: y }]}>
        <View style={[
          styles.positionDot,
          { backgroundColor: SystemUtils.getProximityColor(bracelet.proximity) }
        ]} />
        <Text style={styles.positionLabel}>{index + 1}</Text>
      </View>
    );
  };

  return (
    <View style={styles.mapContainer}>
      <Text style={styles.mapTitle}>🗺️ Carte de Localisation</Text>
      <View style={[styles.map, { width: mapSize, height: mapSize }]}>
        {/* Grille */}
        {Array.from({ length: 10 }).map((_, i) => (
          <View key={`h-${i}`} style={[styles.gridLine, styles.gridLineHorizontal, { top: (i + 1) * (mapSize / 11) }]} />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <View key={`v-${i}`} style={[styles.gridLine, styles.gridLineVertical, { left: (i + 1) * (mapSize / 11) }]} />
        ))}
        
        {/* Périmètre de sécurité */}
        <View style={[
          styles.safetyCircle,
          {
            width: (safetyRadius / 150) * mapSize * 2,
            height: (safetyRadius / 150) * mapSize * 2,
            left: (mapSize / 2) - ((safetyRadius / 150) * mapSize),
            top: (mapSize / 2) - ((safetyRadius / 150) * mapSize)
          }
        ]} />
        
        {/* Positions des bracelets */}
        {bracelets.map((bracelet, index) => renderBraceletPosition(bracelet, index))}
      </View>
      <View style={styles.mapLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
          <Text style={styles.legendText}>Excellent</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#3b82f6' }]} />
          <Text style={styles.legendText}>Bon</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
          <Text style={styles.legendText}>Moyen</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
          <Text style={styles.legendText}>Faible</Text>
        </View>
      </View>
    </View>
  );
});

// Écran principal amélioré
const HomeScreen = ({ user, onLogout }) => {
  const [bracelets, setBracelets] = useState(BRACELETS_DATA);
  const [safetyRadius, setSafetyRadius] = useState(100);
  const [selectedBracelet, setSelectedBracelet] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [systemStatus, setSystemStatus] = useState('online');
  const [showMap, setShowMap] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    vibration: true,
    sound: true,
    showHealth: true,
    autoRefresh: true
  });
  
  const lastUpdate = useRef(Date.now());

  const { alerts, alertHistory, alertStats, checkAlerts } = useAlertsManager(bracelets, safetyRadius);

  // Mises à jour en temps réel
  const updateBraceletsData = useCallback(() => {
    try {
      setBracelets(prevBracelets => {
        if (!Array.isArray(prevBracelets)) return BRACELETS_DATA;
        
        return prevBracelets.map(bracelet => {
          if (!bracelet || !bracelet.id) return bracelet;
          
          // Simulation de variation RSSI
          const rssiVariation = (Math.random() - 0.5) * 8;
          const newRssi = Math.max(-110, Math.min(-25, (bracelet.rssi || -50) + rssiVariation));
          
          // Simulation de décharge batterie
          const batteryDrain = parseFloat((Math.random() * 0.3).toFixed(2));
          const newBattery = parseFloat(Math.max(0, (bracelet.batteryLevel || 100) - batteryDrain).toFixed(2));
          
          // Calcul des nouvelles valeurs
          const distance = SystemUtils.calculateDistanceFromRSSI(newRssi);
          const proximity = SystemUtils.getProximityFromRSSI(newRssi);
          const signalBars = SystemUtils.getSignalBarsFromRSSI(newRssi);
          const signalQuality = SystemUtils.getSignalQuality(newRssi);
          
          // Simulation de perte de connexion
          const connectionStatus = newRssi < -100 ? 'disconnected' : 'connected';
          
          // Mise à jour temps
          const lastSeen = connectionStatus === 'connected' ? new Date() : (bracelet.lastSeen || new Date());
          
          // Simulation de variations de signes vitaux
          const heartRateVariation = Math.floor((Math.random() - 0.5) * 10);
          const temperatureVariation = parseFloat(((Math.random() - 0.5) * 0.5).toFixed(2));
          
          // Simulation de variations de santé
          const stressLevels = ['low', 'normal', 'moderate', 'high'];
          const fatigueLevels = ['low', 'normal', 'moderate', 'high'];
          const hydrationLevels = ['low', 'moderate', 'good'];
          
          return {
            ...bracelet,
            rssi: newRssi,
            batteryLevel: newBattery,
            distance,
            proximity,
            signalBars,
            signalQuality,
            connectionStatus,
            lastSeen,
            heartRate: Math.max(50, Math.min(120, (bracelet.heartRate || 70) + heartRateVariation)),
            temperature: parseFloat(Math.max(35, Math.min(40, (bracelet.temperature || 36.5) + temperatureVariation)).toFixed(2)),
            steps: (bracelet.steps || 0) + Math.floor(Math.random() * 5),
            health: {
              stress: stressLevels[Math.floor(Math.random() * stressLevels.length)],
              fatigue: fatigueLevels[Math.floor(Math.random() * fatigueLevels.length)],
              hydration: hydrationLevels[Math.floor(Math.random() * hydrationLevels.length)],
              oxygen: Math.floor(Math.random() * 5) + 95
            },
            locationHistory: [
              ...(bracelet.locationHistory || []),
              {
                x: Math.random() * 100,
                y: Math.random() * 100,
                timestamp: new Date()
              }
            ].slice(-10)
          };
        });
      });
      
      lastUpdate.current = Date.now();
      checkAlerts();
    } catch (error) {
      console.error('Erreur mise à jour bracelets:', error);
    }
  }, [checkAlerts]);

  // Utiliser le hook de mises à jour en temps réel
  useRealTimeUpdates(SYSTEM_CONFIG.PERFORMANCE.UPDATE_INTERVAL, updateBraceletsData);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    updateBraceletsData();
    setTimeout(() => setRefreshing(false), 1000);
  }, [updateBraceletsData]);

  const handleBraceletPress = useCallback((bracelet) => {
    if (bracelet) {
      setSelectedBracelet(bracelet);
      if (Platform.OS !== 'web') {
        Vibration.vibrate(50);
      }
    }
  }, []);

  const handleSettingsChange = useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  // Gestion du bouton retour
  useEffect(() => {
    const backHandler = () => {
      if (selectedBracelet) {
        setSelectedBracelet(null);
        return true;
      }
      if (showMap) {
        setShowMap(false);
        return true;
      }
      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', backHandler);
    return () => BackHandler.removeEventListener('hardwareBackPress', backHandler);
  }, [selectedBracelet, showMap]);

  // Gestion du cycle de vie de l'application
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active') {
        setSystemStatus('online');
        updateBraceletsData();
      } else {
        setSystemStatus('background');
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [updateBraceletsData]);

  if (selectedBracelet) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <LinearGradient
          colors={['#0f172a', '#1e293b', '#334155']}
          style={styles.background}
        />
        
        <View style={styles.detailHeader}>
          <TouchableOpacity onPress={() => setSelectedBracelet(null)} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.detailTitle}>{selectedBracelet.name || 'Inconnu'}</Text>
          <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
            <Ionicons name="log-out" size={24} color="#ef4444" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.detailContainer}>
          <View style={styles.detailCard}>
            <Text style={styles.detailSectionTitle}>Informations Générales</Text>
            <View style={styles.detailProfile}>
              <Image 
                source={{ uri: selectedBracelet.metadata?.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' }} 
                style={styles.detailPhoto}
              />
              <View style={styles.detailProfileInfo}>
                <Text style={styles.detailName}>{selectedBracelet.metadata?.assignedUser || 'Non assigné'}</Text>
                <Text style={styles.detailRole}>{selectedBracelet.metadata?.role || 'Non défini'}</Text>
                <View style={styles.detailBadges}>
                  <View style={styles.detailBadge}>
                    <Text style={styles.detailBadgeText}>🎂 {selectedBracelet.metadata?.age || '?'} ans</Text>
                  </View>
                  <View style={styles.detailBadge}>
                    <Text style={styles.detailBadgeText}>⭐ {selectedBracelet.metadata?.experience || '?'}</Text>
                  </View>
                  <View style={styles.detailBadge}>
                    <Text style={styles.detailBadgeText}>🎯 {selectedBracelet.metadata?.speciality || 'N/A'}</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>ID Bracelet:</Text>
              <Text style={styles.detailValue}>{selectedBracelet.id || 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>MAC Address:</Text>
              <Text style={styles.detailValue}>{selectedBracelet.macAddress || 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Équipe:</Text>
              <Text style={styles.detailValue}>{selectedBracelet.metadata?.team || 'Non assignée'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Certification:</Text>
              <Text style={styles.detailValue}>{selectedBracelet.metadata?.certification || 'Non certifié'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Contact Urgence:</Text>
              <Text style={styles.detailValue}>{selectedBracelet.metadata?.emergencyContact || 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Groupe Sanguin:</Text>
              <Text style={styles.detailValue}>{selectedBracelet.metadata?.bloodType || 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Allergies:</Text>
              <Text style={styles.detailValue}>{selectedBracelet.metadata?.allergies || 'Aucune'}</Text>
            </View>
          </View>
          
          <View style={styles.detailCard}>
            <Text style={styles.detailSectionTitle}>Métriques en Temps Réel</Text>
            <View style={styles.metricsGrid}>
              <View style={styles.metricDetail}>
                <SignalBars bars={typeof selectedBracelet.signalBars === 'number' ? selectedBracelet.signalBars : 0} rssi={selectedBracelet.rssi || -100} size="large" />
                <Text style={styles.metricDetailLabel}>Signal</Text>
                <Text style={styles.metricDetailValue}>{selectedBracelet.rssi || -100} dBm</Text>
              </View>
              
              <View style={styles.metricDetail}>
                <Ionicons 
                  name={SystemUtils.getBatteryIcon(selectedBracelet.batteryLevel || 0)} 
                  size={32} 
                  color={SystemUtils.getBatteryColor(selectedBracelet.batteryLevel || 0)} 
                />
                <Text style={styles.metricDetailLabel}>Batterie</Text>
                <Text style={styles.metricDetailValue}>{typeof selectedBracelet.batteryLevel === 'number' ? selectedBracelet.batteryLevel.toFixed(2) : '0.00'}%</Text>
              </View>
              
              <View style={styles.metricDetail}>
                <Ionicons name="heart" size={32} color="#ef4444" />
                <Text style={styles.metricDetailLabel}>Cardiaque</Text>
                <Text style={styles.metricDetailValue}>{typeof selectedBracelet.heartRate === 'number' ? selectedBracelet.heartRate : '0'} bpm</Text>
              </View>
              
              <View style={styles.metricDetail}>
                <Ionicons name="thermometer" size={32} color="#f59e0b" />
                <Text style={styles.metricDetailLabel}>Température</Text>
                <Text style={styles.metricDetailValue}>{typeof selectedBracelet.temperature === 'number' ? selectedBracelet.temperature.toFixed(2) : '0.00'}°C</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.detailCard}>
            <Text style={styles.detailSectionTitle}>Santé</Text>
            {selectedBracelet.health ? (
              <View style={styles.healthGrid}>
                <View style={styles.healthItem}>
                  <Text style={styles.healthLabel}>Stress:</Text>
                  <Text style={styles.healthValue}>{selectedBracelet.health.stress}</Text>
                </View>
                <View style={styles.healthItem}>
                  <Text style={styles.healthLabel}>Fatigue:</Text>
                  <Text style={styles.healthValue}>{selectedBracelet.health.fatigue}</Text>
                </View>
                <View style={styles.healthItem}>
                  <Text style={styles.healthLabel}>Hydratation:</Text>
                  <Text style={styles.healthValue}>{selectedBracelet.health.hydration}</Text>
                </View>
                <View style={styles.healthItem}>
                  <Text style={styles.healthLabel}>Oxygène:</Text>
                  <Text style={styles.healthValue}>{selectedBracelet.health.oxygen}%</Text>
                </View>
              </View>
            ) : (
              <Text style={styles.noHealthText}>Données de santé non disponibles</Text>
            )}
          </View>
          
          <View style={styles.detailCard}>
            <Text style={styles.detailSectionTitle}>Historique des Alertes</Text>
            {Array.isArray(selectedBracelet.alerts) && selectedBracelet.alerts.length > 0 ? (
              selectedBracelet.alerts.map((alert, index) => (
                <View key={index} style={styles.alertHistoryItem}>
                  <Ionicons 
                    name={alert.type === 'sos' ? 'warning' : alert.type === 'battery' ? 'battery-dead' : alert.type === 'health' ? 'medkit' : 'wifi-off'} 
                    size={16} 
                    color="#ef4444" 
                  />
                  <Text style={styles.alertHistoryText}>{alert.message || 'Alerte sans message'}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noAlertsText}>Aucune alerte</Text>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#334155']}
        style={styles.background}
      />
      
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <Text style={styles.greeting}>Bonjour, {user?.name || 'Chef'}</Text>
            <Text style={styles.userRole}>{user?.role || 'Superviseur RSSI'}</Text>
            <Text style={styles.systemStatus}>
              Système: {systemStatus === 'online' ? '✅ En ligne' : '⚠️ Hors ligne'}
            </Text>
            <Text style={styles.lastUpdate}>
              Dernière mise à jour: {new Date(lastUpdate.current).toLocaleTimeString()}
            </Text>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              onPress={() => setShowMap(!showMap)} 
              style={styles.mapButton}
            >
              <Ionicons name="map" size={24} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
              <Ionicons name="refresh" size={24} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
              <Ionicons name="log-out" size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      {showMap ? (
        <View style={styles.mapSection}>
          <LocationMap bracelets={bracelets} safetyRadius={safetyRadius} />
        </View>
      ) : (
        <Dashboard
          bracelets={bracelets}
          alerts={alerts}
          safetyRadius={safetyRadius}
          onBraceletPress={handleBraceletPress}
          settings={settings}
          onSettingsChange={handleSettingsChange}
        />
      )}
    </View>
  );
};

// Écran de login amélioré
const LoginScreen = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [rememberMe, setRememberMe] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
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
      })
    ]).start();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!username.trim()) {
      newErrors.username = 'L\'identifiant est requis';
    }
    
    if (!password.trim()) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (password.length < 4) {
      newErrors.password = 'Le mot de passe doit contenir au moins 4 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    setTimeout(() => {
      const validCredentials = [
        { username: 'chef@groupe.rssi', password: 'chef2024' },
        { username: 'admin@rssi.com', password: 'admin2024' },
        { username: 'supervisor@system.com', password: 'sup2024' }
      ];

      const isValid = validCredentials.some(
        cred => cred.username === username && cred.password === password
      );

      if (isValid) {
        setLoginAttempts(0);
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        onLoginSuccess({
          name: 'Chef de Groupe',
          role: 'Superviseur RSSI',
          loginTime: new Date(),
          sessionId: `session_${Date.now()}`
        });
      } else {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
        
        if (newAttempts >= 5) {
          setErrors({ general: 'Trop de tentatives. Veuillez réessayer plus tard.' });
        } else {
          setErrors({ general: `Identifiant ou mot de passe incorrect. (${newAttempts}/5)` });
        }
      }
      
      setIsLoading(false);
    }, 1500);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#334155']}
        style={styles.background}
      />
      
      <ScrollView contentContainerStyle={styles.loginScrollContainer}>
        <Animated.View style={[styles.loginContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.loginHeader}>
            <View style={styles.logoContainer}>
              <LinearGradient colors={['#3b82f6', '#2563eb']} style={styles.logoGradient}>
                <Text style={styles.logo}>📡</Text>
              </LinearGradient>
            </View>
            <Text style={styles.loginTitle}>RSSI Surveillance</Text>
            <Text style={styles.loginSubtitle}>Système de Surveillance Avancé</Text>
            <Text style={styles.version}>Version 3.0 Enhanced</Text>
          </View>

          <View style={styles.loginForm}>
            <Text style={styles.formTitle}>🔐 Connexion Sécurisée</Text>
            
            <View style={styles.inputContainer}>
              <Ionicons name="person" size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Identifiant"
                placeholderTextColor="#64748b"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
            
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Mot de passe"
                placeholderTextColor="#64748b"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.passwordToggle}>
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#64748b" />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            
            <View style={styles.rememberContainer}>
              <Switch
                value={rememberMe}
                onValueChange={setRememberMe}
                trackColor={{ false: '#64748b', true: '#3b82f6' }}
                thumbColor={rememberMe ? '#ffffff' : '#94a3b8'}
              />
              <Text style={styles.rememberText}>Se souvenir de moi</Text>
            </View>
            
            {errors.general && (
              <View style={styles.generalErrorContainer}>
                <Ionicons name="warning" size={20} color="#ef4444" />
                <Text style={styles.generalErrorText}>{errors.general}</Text>
              </View>
            )}

            <TouchableOpacity 
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
              onPress={handleLogin}
              disabled={isLoading}
            >
              <LinearGradient 
                colors={isLoading ? ['#6b7280', '#4b5563'] : ['#3b82f6', '#2563eb']} 
                style={styles.loginButtonGradient}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.loginButtonText}>Se Connecter</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.loginInfo}>
            <Text style={styles.infoTitle}>🔑 Identifiants de démo:</Text>
            <Text style={styles.infoItem}>chef@groupe.rssi / chef2024</Text>
            <Text style={styles.infoItem}>admin@rssi.com / admin2024</Text>
            <Text style={styles.infoItem}>supervisor@system.com / sup2024</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// App principal amélioré
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
          <Text style={styles.loadingSubtext}>Chargement du système avancé...</Text>
          <ActivityIndicator size="large" color="#3b82f6" style={styles.loadingIndicator} />
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

// Styles améliorés
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  loadingSubtext: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 20,
  },
  loadingIndicator: {
    marginTop: 10,
  },
  
  // Login
  loginScrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 30,
  },
  loginContainer: {
    alignItems: 'center',
  },
  loginHeader: {
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
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logo: {
    fontSize: 60,
  },
  loginTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 16,
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
  
  loginForm: {
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
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
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  rememberText: {
    fontSize: 14,
    color: '#94a3b8',
    marginLeft: 10,
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: -15,
    marginBottom: 10,
  },
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
  loginButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
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
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginInfo: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 10,
  },
  infoItem: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 5,
  },
  
  // Header
  header: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 130, 246, 0.2)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 4,
  },
  systemStatus: {
    fontSize: 12,
    color: '#10b981',
    marginBottom: 4,
  },
  lastUpdate: {
    fontSize: 10,
    color: '#64748b',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 15,
  },
  mapButton: {
    padding: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 8,
  },
  refreshButton: {
    padding: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 8,
  },
  logoutButton: {
    padding: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 8,
  },
  
  // Dashboard
  dashboard: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  
  // Stats
  statsSection: {
    marginBottom: 25,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  statCardGradient: {
    padding: 15,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  
  // Advanced Stats
  advancedStats: {
    marginTop: 15,
    padding: 15,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  advancedStatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  advancedStatLabel: {
    fontSize: 14,
    color: '#94a3b8',
  },
  advancedStatValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  
  // Quick Settings
  quickSettings: {
    marginBottom: 25,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  settingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '48%',
    marginBottom: 15,
  },
  settingLabel: {
    fontSize: 14,
    color: '#e2e8f0',
  },
  safetyRadiusControl: {
    marginTop: 10,
  },
  safetyRadiusLabel: {
    fontSize: 14,
    color: '#e2e8f0',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
  safetyRadiusSlider: {
    width: '100%',
    height: 40,
  },
  sliderThumb: {
    backgroundColor: '#3b82f6',
    width: 20,
    height: 20,
  },
  
  // Alerts
  alertsSection: {
    marginBottom: 25,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    marginBottom: 8,
  },
  alertItemCritical: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: 'rgba(239, 68, 68, 0.5)',
  },
  alertItemHigh: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  alertMessage: {
    fontSize: 14,
    color: '#ef4444',
    marginLeft: 10,
    flex: 1,
  },
  alertMessageCritical: {
    color: '#ffffff',
    fontWeight: '600',
  },
  alertTime: {
    fontSize: 12,
    color: '#64748b',
  },
  
  // Filters
  filtersSection: {
    marginBottom: 25,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
  },
  filtersScroll: {
    marginBottom: 15,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.3)',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: 'rgba(59, 130, 246, 0.5)',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: '#3b82f6',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortLabel: {
    fontSize: 14,
    color: '#e2e8f0',
    marginRight: 10,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.3)',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    marginRight: 10,
  },
  sortButtonActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: 'rgba(59, 130, 246, 0.5)',
  },
  sortButtonText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  sortButtonTextActive: {
    color: '#3b82f6',
  },
  
  // Bracelets
  braceletsSection: {
    marginBottom: 20,
  },
  braceletsList: {
    paddingBottom: 20,
  },
  braceletCard: {
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  braceletCardCritical: {
    borderWidth: 2,
    borderColor: 'rgba(239, 68, 68, 0.5)',
  },
  braceletCardWarning: {
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.5)',
  },
  braceletCardGradient: {
    padding: 20,
  },
  braceletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  braceletInfo: {
    flex: 1,
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  userPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  braceletName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  braceletId: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  braceletUser: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 6,
  },
  userDetails: {
    flexDirection: 'column',
    gap: 2,
  },
  userDetail: {
    fontSize: 11,
    color: '#64748b',
    fontStyle: 'italic',
  },
  braceletStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  
  braceletMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  
  // Health
  healthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 8,
  },
  healthIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  healthDetails: {
    flex: 1,
    marginLeft: 10,
  },
  healthDetail: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 1,
  },
  
  // Signal Bars
  signalBarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  signalBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 12,
  },
  signalBar: {
    borderRadius: 1,
  },
  signalBarsText: {
    fontSize: 10,
    color: '#64748b',
  },
  
  // Alerts
  braceletAlerts: {
    marginBottom: 10,
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    marginBottom: 5,
  },
  alertBadgeCritical: {
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
    borderColor: 'rgba(239, 68, 68, 0.5)',
  },
  alertBadgeWarning: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  alertText: {
    fontSize: 10,
    color: '#ffffff',
    marginLeft: 6,
  },
  moreAlertsText: {
    fontSize: 10,
    color: '#64748b',
    fontStyle: 'italic',
  },
  
  sosIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  sosText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ef4444',
    marginLeft: 8,
  },
  
  // Map
  mapSection: {
    flex: 1,
    padding: 20,
  },
  mapContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  map: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    position: 'relative',
    overflow: 'hidden',
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: 'rgba(100, 116, 139, 0.1)',
  },
  gridLineHorizontal: {
    left: 0,
    right: 0,
    height: 1,
  },
  gridLineVertical: {
    top: 0,
    bottom: 0,
    width: 1,
  },
  safetyCircle: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 999,
    borderStyle: 'dashed',
  },
  braceletPosition: {
    position: 'absolute',
    alignItems: 'center',
  },
  positionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  positionLabel: {
    fontSize: 8,
    color: '#ffffff',
    fontWeight: 'bold',
    marginTop: 2,
  },
  mapLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  legendText: {
    fontSize: 10,
    color: '#94a3b8',
  },
  
  // Detail Screen
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 130, 246, 0.2)',
  },
  backButton: {
    padding: 8,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  detailContainer: {
    flex: 1,
    padding: 20,
  },
  detailCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  detailProfile: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(100, 116, 139, 0.2)',
  },
  detailPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    marginRight: 15,
  },
  detailProfileInfo: {
    flex: 1,
  },
  detailName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  detailRole: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 8,
  },
  detailBadges: {
    flexDirection: 'column',
    gap: 4,
  },
  detailBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    alignSelf: 'flex-start',
  },
  detailBadgeText: {
    fontSize: 11,
    color: '#3b82f6',
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: '#94a3b8',
  },
  detailValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  metricDetail: {
    alignItems: 'center',
    flex: 1,
  },
  metricDetailLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 8,
    marginBottom: 4,
  },
  metricDetailValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  
  healthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  healthItem: {
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 8,
  },
  healthLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  healthValue: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  noHealthText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  alertHistoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    marginBottom: 8,
  },
  alertHistoryText: {
    fontSize: 12,
    color: '#ef4444',
    marginLeft: 8,
    flex: 1,
  },
  noAlertsText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

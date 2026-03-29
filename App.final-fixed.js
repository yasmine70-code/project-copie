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
  Switch
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

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
  },
  
  // Approbation d'accès
  ACCESS_APPROVAL: {
    ENABLED: true,
    AUTO_APPROVE: false, // Le chef doit approuver manuellement
    APPROVAL_TIMEOUT: 300000, // 5 minutes pour approuver
    MAX_PENDING_REQUESTS: 10,
    NOTIFICATION_SOUND: true,
    NOTIFICATION_VIBRATION: true
  }
};

// Demandes d'accès en attente
const PENDING_ACCESS_REQUESTS = [
  {
    id: 'REQ001',
    name: 'Thomas Martin',
    deviceId: '24:6F:28:7C:1A:FF',
    deviceType: 'ESP32-Bracelet',
    requestTime: new Date(Date.now() - 120000), // 2 minutes ago
    rssi: -45,
    distance: 12.00,
    signalBars: 4,
    proximity: 'GOOD',
    purpose: 'Visiteur technique',
    requestedBy: 'auto-detection',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    status: 'pending'
  },
  {
    id: 'REQ002',
    name: 'Sophie Dubois',
    deviceId: '24:6F:28:7C:1B:EE',
    deviceType: 'ESP32-Bracelet',
    requestTime: new Date(Date.now() - 300000), // 5 minutes ago
    rssi: -38,
    distance: 9.00,
    signalBars: 5,
    proximity: 'EXCELLENT',
    purpose: 'Membre équipe',
    requestedBy: 'auto-detection',
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    status: 'pending'
  },
  {
    id: 'REQ003',
    name: 'Pierre Leroy',
    deviceId: '24:6F:28:7C:1C:DD',
    deviceType: 'ESP32-Bracelet',
    requestTime: new Date(Date.now() - 600000), // 10 minutes ago
    rssi: -72,
    distance: 35.00,
    signalBars: 3,
    proximity: 'FAIR',
    purpose: 'Visiteur externe',
    requestedBy: 'manual-request',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    status: 'pending'
  }
];

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
    steps: 1234,
    sosActive: false,
    locationHistory: [{ x: 50, y: 50, timestamp: new Date() }],
    alerts: [],
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
      bloodType: 'A+',
      allergies: 'Aucune'
    }
  },
  {
    id: 'BR002',
    name: 'Beta Scout',
    macAddress: '24:6F:28:7C:1B:2C',
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
    steps: 987,
    sosActive: false,
    locationHistory: [{ x: 30, y: 70, timestamp: new Date() }],
    alerts: [],
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
      bloodType: 'O+',
      allergies: 'Pollens'
    }
  },
  {
    id: 'BR003',
    name: 'Gamma Medic',
    macAddress: '24:6F:28:7C:1C:2D',
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
    steps: 756,
    sosActive: false,
    locationHistory: [{ x: 80, y: 40, timestamp: new Date() }],
    alerts: [{ type: 'battery', level: 'warning', message: 'Batterie en dessous de 50%' }],
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
      bloodType: 'AB+',
      allergies: 'Latex'
    }
  },
  {
    id: 'BR004',
    name: 'Delta Explorer',
    macAddress: '24:6F:28:7C:1D:2E',
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
    steps: 543,
    sosActive: true,
    locationHistory: [{ x: 20, y: 20, timestamp: new Date(Date.now() - 45000) }],
    alerts: [
      { type: 'battery', level: 'critical', message: 'Batterie critique!' },
      { type: 'sos', level: 'critical', message: 'SOS activé!' },
      { type: 'connection', level: 'warning', message: 'Connexion perdue' }
    ],
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
      bloodType: 'B+',
      allergies: 'Aucune'
    }
  },
  {
    id: 'BR005',
    name: 'Epsilon Tech',
    macAddress: '24:6F:28:7C:1E:2F',
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
    steps: 432,
    sosActive: false,
    locationHistory: [{ x: 90, y: 80, timestamp: new Date() }],
    alerts: [{ type: 'signal', level: 'warning', message: 'Signal très faible' }],
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
  static formatRequestTime(requestTime) {
    const now = new Date();
    const diffMs = now - requestTime;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  }

  static isRequestExpired(requestTime) {
    const now = new Date();
    const diffMs = now - requestTime;
    return diffMs > SYSTEM_CONFIG.ACCESS_APPROVAL.APPROVAL_TIMEOUT;
  }

  static calculateDistanceFromRSSI(rssi) {
    const A = -45;
    const n = 2.7;
    const environmentFactor = 1.1;
    
    if (rssi >= 0) return 0;
    
    const rawDistance = Math.pow(10, (rssi - A) / (-10 * n));
    const correctedDistance = rawDistance * environmentFactor;
    const finalDistance = Math.min(Math.max(correctedDistance, 0), 150);
    
    return parseFloat(finalDistance.toFixed(2));
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
    if (rssi >= SYSTEM_CONFIG.RSSI_THRESHOLDS.EXCELLENT) return 5;
    if (rssi >= SYSTEM_CONFIG.RSSI_THRESHOLDS.VERY_GOOD) return 5;
    if (rssi >= SYSTEM_CONFIG.RSSI_THRESHOLDS.GOOD) return 4;
    if (rssi >= SYSTEM_CONFIG.RSSI_THRESHOLDS.FAIR) return 3;
    if (rssi >= SYSTEM_CONFIG.RSSI_THRESHOLDS.WEAK) return 2;
    if (rssi >= SYSTEM_CONFIG.RSSI_THRESHOLDS.VERY_WEAK) return 1;
    return 0;
  }

  static getSignalQuality(rssi) {
    if (rssi >= SYSTEM_CONFIG.RSSI_THRESHOLDS.EXCELLENT) return 'excellent';
    if (rssi >= SYSTEM_CONFIG.RSSI_THRESHOLDS.VERY_GOOD) return 'very_good';
    if (rssi >= SYSTEM_CONFIG.RSSI_THRESHOLDS.GOOD) return 'good';
    if (rssi >= SYSTEM_CONFIG.RSSI_THRESHOLDS.FAIR) return 'fair';
    if (rssi >= SYSTEM_CONFIG.RSSI_THRESHOLDS.WEAK) return 'weak';
    if (rssi >= SYSTEM_CONFIG.RSSI_THRESHOLDS.VERY_WEAK) return 'very_weak';
    return 'none';
  }

  static getProximityColor(proximity) {
    return SYSTEM_CONFIG.DISTANCE_RANGES[proximity]?.color || '#6b7280';
  }

  static getProximityLabel(proximity) {
    return SYSTEM_CONFIG.DISTANCE_RANGES[proximity]?.label || 'Inconnu';
  }


  static formatDuration(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  static getBatteryIcon(batteryLevel) {
    if (batteryLevel > 75) return 'battery-full';
    if (batteryLevel > 50) return 'battery-three-quarters';
    if (batteryLevel > 25) return 'battery-half';
    if (batteryLevel > 10) return 'battery-quarter';
    return 'battery-dead';
  }

  static getBatteryColor(batteryLevel) {
    if (batteryLevel > 50) return '#10b981';
    if (batteryLevel > 25) return '#f59e0b';
    return '#ef4444';
  }
}

// Hook personnalisé pour les mises à jour en temps réel
const useRealTimeUpdates = (updateInterval, callback) => {
  const intervalRef = useRef(null);

  useEffect(() => {
    const startUpdates = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      intervalRef.current = setInterval(() => {
        if (callback) callback();
      }, updateInterval);
    };

    startUpdates();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [updateInterval, callback]);
};

// Hook personnalisé pour la gestion des approbations d'accès
const useAccessApprovalManager = (pendingRequests, onApprove, onReject) => {
  const [requests, setRequests] = useState(pendingRequests);
  const [notificationCount, setNotificationCount] = useState(0);

  const approveRequest = useCallback((requestId) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'approved' } : req
    ));
    setNotificationCount(prev => prev + 1);
    if (onApprove) onApprove(requestId);
    
    // Notification sonore et vibration
    if (Platform.OS !== 'web') {
      Vibration.vibrate(100);
    }
    
    Alert.alert(
      'Accès Approuvé',
      `La demande d'accès a été approuvée avec succès`,
      [{ text: 'OK' }]
    );
  }, [onApprove]);

  const rejectRequest = useCallback((requestId) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'rejected' } : req
    ));
    setNotificationCount(prev => prev + 1);
    if (onReject) onReject(requestId);
    
    // Notification sonore et vibration
    if (Platform.OS !== 'web') {
      Vibration.vibrate(200);
    }
    
    Alert.alert(
      'Accès Refusé',
      `La demande d'accès a été refusée`,
      [{ text: 'OK' }]
    );
  }, [onReject]);

  const addNewRequest = useCallback((newRequest) => {
    setRequests(prev => [...prev, newRequest]);
    setNotificationCount(prev => prev + 1);
    
    // Notification pour nouvelle demande
    if (Platform.OS !== 'web') {
      Vibration.vibrate(50);
    }
  }, []);

  // Nettoyage des demandes expirées
  useEffect(() => {
    const interval = setInterval(() => {
      setRequests(prev => prev.filter(req => 
        !SystemUtils.isRequestExpired(req.requestTime)
      ));
    }, 30000); // Vérifier toutes les 30 secondes

    return () => clearInterval(interval);
  }, []);

  return {
    requests,
    notificationCount,
    approveRequest,
    rejectRequest,
    addNewRequest,
    pendingCount: requests.filter(req => req.status === 'pending').length,
    approvedCount: requests.filter(req => req.status === 'approved').length,
    rejectedCount: requests.filter(req => req.status === 'rejected').length
  };
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
    if (!Array.isArray(bracelets)) return;
    
    const currentTime = Date.now();
    const newAlerts = [];

    bracelets.forEach(bracelet => {
      if (!bracelet || !bracelet.id) return;

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

      // Vérification périmètre
      if (typeof bracelet.distance === 'number' && bracelet.distance > safetyRadius) {
        newAlerts.push({
          id: `perimeter-${bracelet.id}`,
          type: 'perimeter',
          priority: SYSTEM_CONFIG.ALERTS.PERIMETER_BREACH,
          message: `${bracelet.name} hors périmètre (${bracelet.distance.toFixed(2)}m)`,
          braceletId: bracelet.id,
          timestamp: currentTime,
          severity: 'warning'
        });
      }

      // Vérification SOS
      if (bracelet.sosActive) {
        newAlerts.push({
          id: `sos-${bracelet.id}`,
          type: 'sos',
          priority: SYSTEM_CONFIG.ALERTS.SOS_PRIORITY,
          message: `SOS activé par ${bracelet.name}`,
          braceletId: bracelet.id,
          timestamp: currentTime,
          severity: 'critical'
        });
      }
    });

    // Mettre à jour les alertes
    setAlerts(prev => {
      const updatedAlerts = [...newAlerts];
      
      // Ajouter à l'historique
      const newHistory = updatedAlerts.filter(alert => 
        !prev.some(existingAlert => existingAlert.id === alert.id)
      );
      
      if (newHistory.length > 0) {
        setAlertHistory(prevHistory => [...newHistory, ...prevHistory].slice(-50));
      }
      
      return updatedAlerts;
    });

    // Mettre à jour les statistiques
    setAlertStats({
      total: newAlerts.length,
      critical: newAlerts.filter(a => a.severity === 'critical').length,
      warning: newAlerts.filter(a => a.severity === 'warning').length,
      info: newAlerts.filter(a => a.severity === 'info').length
    });
  }, [bracelets, safetyRadius]);

  return { alerts, alertHistory, alertStats, checkAlerts };
};

// Composant de barres de signal
const SignalBars = React.memo(({ bars, rssi, size = 'medium' }) => {
  const sizes = {
    small: { barWidth: 3, barHeight: 8, spacing: 2 },
    medium: { barWidth: 4, barHeight: 12, spacing: 3 },
    large: { barWidth: 5, barHeight: 16, spacing: 4 }
  };

  const currentSize = sizes[size] || sizes.medium;
  const barColors = ['#ef4444', '#ef4444', '#f59e0b', '#f59e0b', '#22c55e', '#22c55e'];
  const activeBars = Math.max(0, Math.min(5, typeof bars === 'number' ? bars : 0));

  return (
    <View style={styles.signalBarsContainer}>
      {[0, 1, 2, 3, 4].map(index => (
        <View
          key={index}
          style={[
            styles.signalBar,
            {
              width: currentSize.barWidth,
              height: currentSize.barHeight * (index + 1) / 5,
              backgroundColor: index < activeBars ? barColors[activeBars] : '#374151',
              marginRight: index < 4 ? currentSize.spacing : 0
            }
          ]}
        />
      ))}
    </View>
  );
});

// Composant de demande d'accès
const AccessRequestCard = React.memo(({ request, onApprove, onReject }) => {
  const cardAnim = useRef(new Animated.Value(1)).current;
  
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

  const isExpired = SystemUtils.isRequestExpired(request.requestTime);
  const timeAgo = SystemUtils.formatRequestTime(request.requestTime);

  if (!request) return null;

  return (
    <Animated.View style={{ transform: [{ scale: cardAnim }] }}>
      <View style={[
        styles.accessRequestCard,
        isExpired && styles.accessRequestCardExpired,
        request.status === 'approved' && styles.accessRequestCardApproved,
        request.status === 'rejected' && styles.accessRequestCardRejected
      ]}>
        <View style={styles.requestHeader}>
          <View style={styles.requestUserInfo}>
            <Image 
              source={{ uri: request.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' }} 
              style={styles.requestUserPhoto}
            />
            <View style={styles.requestUserInfoDetails}>
              <Text style={styles.requestUserName}>{request.name || 'Inconnu'}</Text>
              <Text style={styles.requestDeviceId}>{request.deviceId || 'N/A'}</Text>
              <Text style={styles.requestDeviceType}>{request.deviceType || 'Unknown'}</Text>
            </View>
          </View>
          
          <View style={styles.requestStatus}>
            <Text style={[
              styles.requestStatusText,
              request.status === 'approved' && styles.requestStatusApproved,
              request.status === 'rejected' && styles.requestStatusRejected,
              request.status === 'pending' && !isExpired && styles.requestStatusPending,
              isExpired && styles.requestStatusExpired
            ]}>
              {request.status === 'approved' && '✅ Approuvé'}
              {request.status === 'rejected' && '❌ Refusé'}
              {request.status === 'pending' && !isExpired && '⏳ En attente'}
              {isExpired && '⏰ Expiré'}
            </Text>
          </View>
        </View>

        <View style={styles.requestMetrics}>
          <View style={styles.requestMetric}>
            <SignalBars bars={request.signalBars || 0} rssi={request.rssi || -100} size="small" />
            <Text style={styles.requestMetricLabel}>Signal</Text>
            <Text style={styles.requestMetricValue}>{request.distance || '0.00'}m</Text>
          </View>
          
          <View style={styles.requestMetric}>
            <Ionicons name="time" size={16} color="#64748b" />
            <Text style={styles.requestMetricLabel}>Demande</Text>
            <Text style={styles.requestMetricValue}>{timeAgo}</Text>
          </View>
        </View>

        <View style={styles.requestDetails}>
          <Text style={styles.requestPurposeLabel}>Objectif:</Text>
          <Text style={styles.requestPurposeValue}>{request.purpose || 'Non spécifié'}</Text>
          <Text style={styles.requestRequestedBy}>Demandé par: {request.requestedBy || 'Inconnu'}</Text>
        </View>

        {request.status === 'pending' && !isExpired && (
          <View style={styles.requestActions}>
            <TouchableOpacity 
              style={[styles.requestButton, styles.requestButtonReject]}
              onPress={() => handlePressOut()}
              onPressIn={handlePressIn}
              onPressOut={() => onReject(request.id)}
            >
              <Text style={styles.requestButtonTextReject}>❌ Refuser</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.requestButton, styles.requestButtonApprove]}
              onPress={() => handlePressOut()}
              onPressIn={handlePressIn}
              onPressOut={() => onApprove(request.id)}
            >
              <Text style={styles.requestButtonTextApprove}>✅ Approuver</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Animated.View>
  );
});

// Composant de carte bracelet amélioré
const BraceletCard = React.memo(({ bracelet, onPress, safetyRadius }) => {
  const cardAnim = useRef(new Animated.Value(1)).current;
  const hasCriticalAlerts = Array.isArray(bracelet.alerts) && bracelet.alerts.some(alert => alert.level === 'critical');
  const hasWarnings = Array.isArray(bracelet.alerts) && bracelet.alerts.some(alert => alert.level === 'warning');
  
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
    // Haptics not available in web
    if (Platform.OS !== 'web') {
      Vibration.vibrate(50);
    }
    if (onPress) onPress(bracelet);
  };

  if (!bracelet) return null;

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
            'rgba(51, 65, 85, 0.95)',
            'rgba(71, 85, 105, 0.95)'
          ]}
          style={styles.cardGradient}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{bracelet.name || 'Inconnu'}</Text>
              <Text style={styles.cardSubtitle}>{bracelet.macAddress || 'N/A'}</Text>
            </View>
            
            <View style={styles.cardStatus}>
              <SignalBars bars={bracelet.signalBars || 0} rssi={bracelet.rssi || -100} size="small" />
              <Text style={styles.signalBarsText}>{typeof bracelet.signalBars === 'number' ? `${bracelet.signalBars}/5` : '0/5'}</Text>
            </View>
          </View>

          <View style={styles.cardMetrics}>
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
              <Ionicons name="location" size={20} color="#3b82f6" />
              <Text style={styles.metricLabel}>Distance</Text>
              <Text style={styles.metricValue}>{typeof bracelet.distance === 'number' ? bracelet.distance.toFixed(2) : '0.00'}m</Text>
            </View>

            <View style={styles.metricItem}>
              <Ionicons name="walk" size={20} color="#8b5cf6" />
              <Text style={styles.metricLabel}>Steps</Text>
              <Text style={styles.metricValue}>{typeof bracelet.steps === 'number' ? bracelet.steps : '0'}</Text>
            </View>
          </View>

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
                           'wifi'} 
                    size={12} 
                    color="white" 
                  />
                </View>
              ))}
            </View>
          )}

          <View style={styles.cardFooter}>
            <View style={styles.proximityInfo}>
              <View style={[
                styles.proximityDot,
                { backgroundColor: SystemUtils.getProximityColor(bracelet.proximity) }
              ]} />
              <Text style={styles.proximityText}>
                {SystemUtils.getProximityLabel(bracelet.proximity)}
              </Text>
            </View>
            
            <Text style={styles.lastSeen}>
              {SystemUtils.formatDuration(Date.now() - (bracelet.lastSeen?.getTime() || Date.now()))}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
});

// Composant de tableau de bord
const Dashboard = React.memo(({ 
  bracelets, 
  alerts, 
  safetyRadius, 
  onBraceletPress, 
  settings, 
  onSettingsChange 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('distance');

  // Filtrage et tri des bracelets
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
    filtered.sort((a, b) => {
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
        default:
          return 0;
      }
    });

    return filtered;
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
      averageSignal: braceletsList.length > 0 ? braceletsList.reduce((acc, b) => acc + (b.signalBars || 0), 0) / braceletsList.length : 0,
      averageBattery: braceletsList.length > 0 ? braceletsList.reduce((acc, b) => acc + (b.batteryLevel || 0), 0) / braceletsList.length : 0
    };
  }, [bracelets, safetyRadius]);

  return (
    <ScrollView style={styles.dashboard} showsVerticalScrollIndicator={false}>
      {/* Statistiques améliorées */}
      <View style={styles.statsSection}>
        <View style={styles.statsHeader}>
          <Text style={styles.statsTitle}>📊 Vue d'Ensemble</Text>
          <Text style={styles.statsSubtitle}>Système RSSI Surveillance</Text>
        </View>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="people" size={24} color="#3b82f6" />
            </View>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="wifi" size={24} color="#10b981" />
            </View>
            <Text style={styles.statValue}>{stats.connected}</Text>
            <Text style={styles.statLabel}>Connectés</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="warning" size={24} color="#ef4444" />
            </View>
            <Text style={styles.statValue}>{stats.sos}</Text>
            <Text style={styles.statLabel}>SOS</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="battery-dead" size={24} color="#f59e0b" />
            </View>
            <Text style={styles.statValue}>{stats.lowBattery}</Text>
            <Text style={styles.statLabel}>Batterie Faible</Text>
          </View>
        </View>

        {settings.showAdvancedStats && (
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
              <Text style={styles.advancedStatLabel}>Hors Périmètre:</Text>
              <Text style={styles.advancedStatValue}>{stats.outOfRange}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Alertes critiques */}
      {Array.isArray(alerts) && alerts.length > 0 && (
        <View style={styles.alertsSection}>
          <Text style={styles.sectionTitle}>🚨 Alertes Critiques</Text>
          {alerts.slice(0, 3).map(alert => (
            <View key={alert.id} style={[
              styles.alertItem,
              alert.severity === 'critical' && styles.alertItemCritical,
              alert.severity === 'high' && styles.alertItemHigh
            ]}>
              <Ionicons 
                name={alert.type === 'sos' ? 'warning' : alert.type === 'battery' ? 'battery-dead' : 'wifi-off'} 
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
                {SystemUtils.formatDuration(Date.now() - alert.timestamp)}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Configuration rapide */}
      <View style={styles.settingsSection}>
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
        </View>
        
        <View style={styles.safetyRadiusControl}>
          <Text style={styles.safetyRadiusLabel}>Périmètre: {safetyRadius}m</Text>
          <View style={styles.safetyRadiusButtons}>
            <TouchableOpacity 
              style={styles.radiusButton}
              onPress={() => onSettingsChange('safetyRadius', Math.max(50, safetyRadius - 10))}
            >
              <Text style={styles.radiusButtonText}>-10m</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.radiusButton}
              onPress={() => onSettingsChange('safetyRadius', Math.min(150, safetyRadius + 10))}
            >
              <Text style={styles.radiusButtonText}>+10m</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Recherche et filtres */}
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
          {['all', 'connected', 'disconnected', 'sos', 'low_battery', 'critical', 'out_of_range'].map(filter => (
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
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Trier par:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['distance', 'name', 'battery', 'signal', 'user'].map(sort => (
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
            />
          )}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.braceletsList}
        />
      </View>
    </ScrollView>
  );
});

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
        <View style={styles.mapGrid}>
          {[0, 25, 50, 75].map(pos => (
            <React.Fragment key={`grid-${pos}`}>
              <View style={[styles.gridLine, { left: pos, top: 0, bottom: 0, width: 1 }]} />
              <View style={[styles.gridLine, { top: pos, left: 0, right: 0, height: 1 }]} />
            </React.Fragment>
          ))}
        </View>
        
        {/* Périmètre de sécurité */}
        <View style={[
          styles.safetyCircle,
          {
            width: (safetyRadius / 150) * mapSize * 2,
            height: (safetyRadius / 150) * mapSize * 2,
            borderRadius: (safetyRadius / 150) * mapSize,
            left: mapSize / 2 - (safetyRadius / 150) * mapSize,
            top: mapSize / 2 - (safetyRadius / 150) * mapSize
          }
        ]} />
        
        {/* Positions des bracelets */}
        {bracelets.map((bracelet, index) => renderBraceletPosition(bracelet, index))}
        
        {/* Centre */}
        <View style={[styles.mapCenter, { left: mapSize / 2 - 5, top: mapSize / 2 - 5 }]} />
      </View>
      
      {/* Légende */}
      <View style={styles.mapLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
          <Text style={styles.legendText}>Excellent (0-10m)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#3b82f6' }]} />
          <Text style={styles.legendText}>Bon (15-25m)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
          <Text style={styles.legendText}>Moyen (25-40m)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
          <Text style={styles.legendText}>Faible (>40m)</Text>
        </View>
      </View>
    </View>
  );
});

// Écran de détail du bracelet
const BraceletDetailScreen = React.memo(({ bracelet, onClose, safetyRadius }) => {
  if (!bracelet) return null;

  return (
    <View style={styles.detailContainer}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.detailTitle}>Détails du Bracelet</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.detailContent} showsVerticalScrollIndicator={false}>
        {/* Informations principales */}
        <View style={styles.detailCard}>
          <View style={styles.detailHeader}>
            <Image 
              source={{ uri: bracelet.metadata?.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' }} 
              style={styles.detailPhoto}
            />
            <View style={styles.detailInfo}>
              <Text style={styles.detailName}>{bracelet.name || 'Inconnu'}</Text>
              <Text style={styles.detailId}>{bracelet.id || 'N/A'}</Text>
              <Text style={styles.detailRole}>{bracelet.metadata?.role || 'Non spécifié'}</Text>
            </View>
          </View>
          
          <View style={styles.detailBadges}>
            <View style={styles.detailBadge}>
              <Text style={styles.detailBadgeText}>{bracelet.metadata?.team || 'No Team'}</Text>
            </View>
            <View style={styles.detailBadge}>
              <Text style={styles.detailBadgeText}>{bracelet.metadata?.certification || 'No Cert'}</Text>
            </View>
          </View>
        </View>

        {/* Métriques principales */}
        <View style={styles.detailCard}>
          <Text style={styles.detailSectionTitle}>Métriques Principales</Text>
          <View style={styles.detailMetrics}>
            <View style={styles.metricDetail}>
              <SignalBars bars={bracelet.signalBars || 0} rssi={bracelet.rssi || -100} size="large" />
              <View style={styles.metricDetailInfo}>
                <Text style={styles.metricDetailLabel}>Signal</Text>
                <Text style={styles.metricDetailValue}>{typeof bracelet.signalBars === 'number' ? `${bracelet.signalBars}/5` : '0/5'}</Text>
                <Text style={styles.metricDetailSubtext}>{SystemUtils.getProximityLabel(bracelet.proximity)}</Text>
              </View>
            </View>
            
            <View style={styles.metricDetail}>
              <Ionicons 
                name={SystemUtils.getBatteryIcon(bracelet.batteryLevel || 0)} 
                size={32} 
                color={SystemUtils.getBatteryColor(bracelet.batteryLevel || 0)} 
              />
              <Text style={styles.metricDetailLabel}>Batterie</Text>
              <Text style={styles.metricDetailValue}>{typeof bracelet.batteryLevel === 'number' ? bracelet.batteryLevel.toFixed(2) : '0.00'}%</Text>
            </View>
            
            <View style={styles.metricDetail}>
              <Ionicons name="location" size={32} color="#3b82f6" />
              <Text style={styles.metricDetailLabel}>Distance</Text>
              <Text style={styles.metricDetailValue}>{typeof bracelet.distance === 'number' ? bracelet.distance.toFixed(2) : '0.00'}m</Text>
            </View>

            <View style={styles.metricDetail}>
              <Ionicons name="walk" size={32} color="#8b5cf6" />
              <Text style={styles.metricDetailLabel}>Steps</Text>
              <Text style={styles.metricDetailValue}>{typeof bracelet.steps === 'number' ? bracelet.steps : '0'}</Text>
            </View>
          </View>
        </View>
        
        {/* Informations utilisateur */}
        <View style={styles.detailCard}>
          <Text style={styles.detailSectionTitle}>Informations Utilisateur</Text>
          <View style={styles.userInfoGrid}>
            <View style={styles.userInfoItem}>
              <Text style={styles.userInfoLabel}>Nom:</Text>
              <Text style={styles.userInfoValue}>{bracelet.metadata?.assignedUser || 'Non assigné'}</Text>
            </View>
            <View style={styles.userInfoItem}>
              <Text style={styles.userInfoLabel}>Âge:</Text>
              <Text style={styles.userInfoValue}>{bracelet.metadata?.age || 'N/A'} ans</Text>
            </View>
            <View style={styles.userInfoItem}>
              <Text style={styles.userInfoLabel}>Expérience:</Text>
              <Text style={styles.userInfoValue}>{bracelet.metadata?.experience || 'N/A'}</Text>
            </View>
            <View style={styles.userInfoItem}>
              <Text style={styles.userInfoLabel}>Spécialité:</Text>
              <Text style={styles.userInfoValue}>{bracelet.metadata?.speciality || 'N/A'}</Text>
            </View>
            <View style={styles.userInfoItem}>
              <Text style={styles.userInfoLabel}>Contact:</Text>
              <Text style={styles.userInfoValue}>{bracelet.metadata?.emergencyContact || 'N/A'}</Text>
            </View>
            <View style={styles.userInfoItem}>
              <Text style={styles.userInfoLabel}>Groupe Sanguin:</Text>
              <Text style={styles.userInfoValue}>{bracelet.metadata?.bloodType || 'N/A'}</Text>
            </View>
            <View style={styles.userInfoItem}>
              <Text style={styles.userInfoLabel}>Allergies:</Text>
              <Text style={styles.userInfoValue}>{bracelet.metadata?.allergies || 'Aucune'}</Text>
            </View>
          </View>
        </View>
        
        {/* Informations techniques */}
        <View style={styles.detailCard}>
          <Text style={styles.detailSectionTitle}>Informations Techniques</Text>
          <View style={styles.techInfoGrid}>
            <View style={styles.techInfoItem}>
              <Text style={styles.techInfoLabel}>MAC Address:</Text>
              <Text style={styles.techInfoValue}>{bracelet.macAddress || 'N/A'}</Text>
            </View>
            <View style={styles.techInfoItem}>
              <Text style={styles.techInfoLabel}>Firmware:</Text>
              <Text style={styles.techInfoValue}>{bracelet.firmwareVersion || 'N/A'}</Text>
            </View>
            <View style={styles.techInfoItem}>
              <Text style={styles.techInfoLabel}>Hardware:</Text>
              <Text style={styles.techInfoValue}>{bracelet.hardwareVersion || 'N/A'}</Text>
            </View>
            <View style={styles.techInfoItem}>
              <Text style={styles.techInfoLabel}>RSSI:</Text>
              <Text style={styles.techInfoValue}>{bracelet.rssi || 'N/A'} dBm</Text>
            </View>
          </View>
        </View>
        
        {/* Historique des alertes */}
        <View style={styles.detailCard}>
          <Text style={styles.detailSectionTitle}>Historique des Alertes</Text>
          {Array.isArray(bracelet.alerts) && bracelet.alerts.length > 0 ? (
            bracelet.alerts.map((alert, index) => (
              <View key={index} style={styles.alertHistoryItem}>
                <Ionicons 
                  name={alert.type === 'sos' ? 'warning' : alert.type === 'battery' ? 'battery-dead' : 'wifi-off'} 
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
});

// Écran de connexion
const LoginScreen = React.memo(({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    
    // Simulation de délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Validation des identifiants
    const validCredentials = [
      { username: 'chef@groupe.rssi', password: 'chef2024', role: 'chef' },
      { username: 'admin@rssi.com', password: 'admin2024', role: 'admin' },
      { username: 'supervisor@system.com', password: 'sup2024', role: 'supervisor' }
    ];

    const isValid = validCredentials.some(cred => 
      cred.username === username.trim() && cred.password === password.trim()
    );

    if (isValid) {
      // Haptics not available in web
      if (Platform.OS !== 'web') {
        Vibration.vibrate(100);
      }
      
      const user = {
        username: username.trim(),
        role: validCredentials.find(cred => cred.username === username.trim())?.role || 'user',
        loginTime: new Date()
      };
      
      onLoginSuccess(user);
    } else {
      // Haptics not available in web
      if (Platform.OS !== 'web') {
        Vibration.vibrate(200);
      }
      
      setLoginAttempts(prev => prev + 1);
      
      if (loginAttempts >= SYSTEM_CONFIG.SECURITY.MAX_LOGIN_ATTEMPTS - 1) {
        Alert.alert(
          'Compte Bloqué',
          `Trop de tentatives de connexion. Veuillez réessayer dans ${Math.floor(SYSTEM_CONFIG.SECURITY.LOCKOUT_DURATION / 60000)} minutes.`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Erreur de Connexion',
          `Identifiants incorrects. Tentatives restantes: ${SYSTEM_CONFIG.SECURITY.MAX_LOGIN_ATTEMPTS - loginAttempts - 1}`,
          [{ text: 'OK' }]
        );
      }
    }

    setIsLoading(false);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.loginContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&h=1200&fit=crop' }}
        style={styles.loginBackground}
        blurRadius={5}
      >
        <LinearGradient
          colors={['rgba(15, 23, 42, 0.9)', 'rgba(30, 41, 59, 0.9)', 'rgba(51, 65, 85, 0.9)']}
          style={styles.loginOverlay}
        >
          <View style={styles.loginContent}>
            <View style={styles.loginHeader}>
              <Ionicons name="wifi" size={60} color="#3b82f6" />
              <Text style={styles.loginTitle}>RSSI Surveillance</Text>
              <Text style={styles.loginSubtitle}>Système de Surveillance Avancé</Text>
            </View>

            <View style={styles.loginForm}>
              <View style={styles.inputContainer}>
                <Ionicons name="mail" size={20} color="#64748b" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nom d'utilisateur"
                  placeholderTextColor="#64748b"
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
                  placeholderTextColor="#64748b"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.loginButtonText}>Se Connecter</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.loginInfo}>
              <Text style={styles.infoTitle}>Identifiants de Démo:</Text>
              <Text style={styles.infoText}>Chef: chef@groupe.rssi / chef2024</Text>
              <Text style={styles.infoText}>Admin: admin@rssi.com / admin2024</Text>
              <Text style={styles.infoText}>Supervisor: supervisor@system.com / sup2024</Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </KeyboardAvoidingView>
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
  const [showAccessRequests, setShowAccessRequests] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    vibration: true,
    sound: true,
    autoRefresh: true
  });
  
  const lastUpdate = useRef(Date.now());

  const { alerts, alertHistory, alertStats, checkAlerts } = useAlertsManager(bracelets, safetyRadius);
  const { 
    requests, 
    notificationCount, 
    approveRequest, 
    rejectRequest, 
    pendingCount, 
    approvedCount, 
    rejectedCount 
  } = useAccessApprovalManager(PENDING_ACCESS_REQUESTS);

  // Mises à jour en temps réel
  const updateBraceletsData = useCallback(() => {
    try {
      setBracelets(prevBracelets => {
        if (!Array.isArray(prevBracelets)) return BRACELETS_DATA;
        
        return prevBracelets.map(bracelet => {
          if (!bracelet || !bracelet.id) return bracelet;
          
          // Simulation de variations RSSI
          const rssiVariation = Math.floor((Math.random() - 0.5) * 10);
          const newRssi = Math.max(-105, Math.min(-25, (bracelet.rssi || -50) + rssiVariation));
          
          // Calcul des nouvelles métriques
          const distance = SystemUtils.calculateDistanceFromRSSI(newRssi);
          const proximity = SystemUtils.getProximityFromRSSI(newRssi);
          const signalBars = SystemUtils.getSignalBarsFromRSSI(newRssi);
          const signalQuality = SystemUtils.getSignalQuality(newRssi);
          
          // Simulation de perte de connexion
          const connectionStatus = newRssi < -100 ? 'disconnected' : 'connected';
          
          // Mise à jour temps
          const lastSeen = connectionStatus === 'connected' ? new Date() : (bracelet.lastSeen || new Date());
          
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
            steps: (bracelet.steps || 0) + Math.floor(Math.random() * 5),
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
    } catch (error) {
      console.error('Error updating bracelets data:', error);
    }
  }, []);

  // Hook pour les mises à jour en temps réel
  useRealTimeUpdates(SYSTEM_CONFIG.PERFORMANCE.UPDATE_INTERVAL, () => {
    if (settings.autoRefresh) {
      updateBraceletsData();
      checkAlerts();
    }
  });

  // Gestion du rafraîchissement manuel
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    updateBraceletsData();
    checkAlerts();
    
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, [updateBraceletsData, checkAlerts]);

  // Gestion des changements de paramètres
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
      if (showAccessRequests) {
        setShowAccessRequests(false);
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
  }, [selectedBracelet, showMap, showAccessRequests]);

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

  // Gestion de la session
  useEffect(() => {
    const sessionTimeout = setTimeout(() => {
      if (user && Date.now() - user.loginTime > SYSTEM_CONFIG.SECURITY.SESSION_TIMEOUT) {
        Alert.alert(
          'Session Expirée',
          'Votre session a expiré. Veuillez vous reconnecter.',
          [{ text: 'OK', onPress: onLogout }]
        );
      }
    }, SYSTEM_CONFIG.SECURITY.SESSION_TIMEOUT);

    return () => clearTimeout(sessionTimeout);
  }, [user, onLogout]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>RSSI Surveillance</Text>
          <Text style={styles.headerSubtitle}>
            {user?.username || 'Utilisateur'} • {user?.role || 'user'}
          </Text>
          <Text style={styles.systemStatus}>
            Système: {systemStatus === 'online' ? '✅ En ligne' : '⚠️ Hors ligne'}
          </Text>
          <Text style={styles.lastUpdate}>
            Dernière mise à jour: {new Date(lastUpdate.current).toLocaleTimeString()}
          </Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            onPress={() => setShowAccessRequests(!showAccessRequests)} 
            style={styles.accessRequestsButton}
          >
            <Ionicons name="people" size={24} color="#ffffff" />
            {pendingCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{pendingCount}</Text>
              </View>
            )}
          </TouchableOpacity>
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
      
      {showAccessRequests ? (
        <View style={styles.accessRequestsSection}>
          <View style={styles.accessRequestsHeader}>
            <Text style={styles.accessRequestsTitle}>👥 Demandes d'Accès</Text>
            <View style={styles.accessRequestsStats}>
              <View style={styles.statBadge}>
                <Text style={styles.statBadgeText}>⏳ {pendingCount}</Text>
              </View>
              <View style={styles.statBadge}>
                <Text style={styles.statBadgeText}>✅ {approvedCount}</Text>
              </View>
              <View style={styles.statBadge}>
                <Text style={styles.statBadgeText}>❌ {rejectedCount}</Text>
              </View>
            </View>
          </View>
          
          <ScrollView style={styles.requestsList} showsVerticalScrollIndicator={false}>
            {requests.map(request => (
              <AccessRequestCard
                key={request.id}
                request={request}
                onApprove={approveRequest}
                onReject={rejectRequest}
              />
            ))}
          </ScrollView>
        </View>
      ) : showMap ? (
        <View style={styles.mapSection}>
          <LocationMap bracelets={bracelets} safetyRadius={safetyRadius} />
        </View>
      ) : (
        <Dashboard
          bracelets={bracelets}
          alerts={alerts}
          safetyRadius={safetyRadius}
          onBraceletPress={setSelectedBracelet}
          settings={settings}
          onSettingsChange={handleSettingsChange}
        />
      )}

      {/* Modal de détail du bracelet */}
      <Modal
        visible={!!selectedBracelet}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedBracelet(null)}
      >
        <BraceletDetailScreen
          bracelet={selectedBracelet}
          onClose={() => setSelectedBracelet(null)}
          safetyRadius={safetyRadius}
        />
      </Modal>
    </View>
  );
});

// Composant principal
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

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
  // Styles pour les demandes d'accès
  accessRequestsButton: {
    padding: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 8,
    position: 'relative',
  },

  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },

  notificationBadgeText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
  },

  accessRequestsSection: {
    flex: 1,
    padding: 20,
  },

  accessRequestsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  accessRequestsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },

  accessRequestsStats: {
    flexDirection: 'row',
    gap: 10,
  },

  requestsList: {
    flex: 1,
  },

  accessRequestCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  accessRequestCardExpired: {
    borderColor: 'rgba(100, 116, 139, 0.3)',
    opacity: 0.7,
  },

  accessRequestCardApproved: {
    borderColor: 'rgba(16, 185, 129, 0.3)',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },

  accessRequestCardRejected: {
    borderColor: 'rgba(239, 68, 68, 0.3)',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },

  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },

  requestUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  requestUserPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    marginRight: 12,
  },

  requestUserInfoDetails: {
    flex: 1,
  },

  requestUserName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },

  requestDeviceId: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },

  requestDeviceType: {
    fontSize: 11,
    color: '#94a3b8',
    fontStyle: 'italic',
  },

  requestStatus: {
    alignItems: 'flex-end',
  },

  requestStatusText: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },

  requestStatusApproved: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    color: '#10b981',
  },

  requestStatusRejected: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    color: '#ef4444',
  },

  requestStatusPending: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    color: '#f59e0b',
  },

  requestStatusExpired: {
    backgroundColor: 'rgba(100, 116, 139, 0.2)',
    color: '#6b7280',
  },

  requestMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  requestMetric: {
    alignItems: 'center',
    flex: 1,
  },

  requestMetricLabel: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 4,
  },

  requestMetricValue: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },

  requestDetails: {
    marginBottom: 15,
  },

  requestPurposeLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
  },

  requestPurposeValue: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 8,
  },

  requestRequestedBy: {
    fontSize: 11,
    color: '#64748b',
    fontStyle: 'italic',
  },

  requestActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },

  requestButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  requestButtonReject: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },

  requestButtonApprove: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },

  requestButtonTextReject: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
  },

  requestButtonTextApprove: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
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
    backgroundColor: '#0f172a',
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 130, 246, 0.2)',
  },
  
  headerInfo: {
    flex: 1,
  },
  
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
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

  // Stats Section
  statsSection: {
    marginBottom: 25,
  },

  statsHeader: {
    marginBottom: 20,
  },

  statsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },

  statsSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },

  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    marginBottom: 20,
  },

  statCard: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  statIcon: {
    marginBottom: 12,
  },

  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },

  advancedStats: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 12,
    padding: 15,
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
    fontSize: 12,
    color: '#64748b',
  },

  advancedStatValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },

  // Alerts Section
  alertsSection: {
    marginBottom: 25,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },

  alertItem: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },

  alertItemCritical: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },

  alertItemHigh: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },

  alertMessage: {
    flex: 1,
    fontSize: 14,
    color: '#ffffff',
    marginHorizontal: 12,
  },

  alertMessageCritical: {
    color: '#ffffff',
    fontWeight: '600',
  },

  alertTime: {
    fontSize: 12,
    color: '#64748b',
  },

  // Settings Section
  settingsSection: {
    marginBottom: 25,
  },

  settingsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    marginBottom: 20,
  },

  settingItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },

  settingLabel: {
    fontSize: 14,
    color: '#ffffff',
  },

  safetyRadiusControl: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },

  safetyRadiusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 10,
  },

  safetyRadiusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
  },

  radiusButton: {
    flex: 1,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    alignItems: 'center',
  },

  radiusButtonText: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '600',
  },

  // Filters Section
  filtersSection: {
    marginBottom: 25,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },

  searchIcon: {
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#ffffff',
    paddingVertical: 12,
  },

  filtersScroll: {
    marginBottom: 15,
  },

  filterButton: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },

  filterButtonActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: 'rgba(59, 130, 246, 0.5)',
  },

  filterButtonText: {
    fontSize: 12,
    color: '#64748b',
  },

  filterButtonTextActive: {
    color: '#ffffff',
  },

  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  sortLabel: {
    fontSize: 14,
    color: '#64748b',
    marginRight: 10,
  },

  sortButton: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },

  sortButtonActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: 'rgba(59, 130, 246, 0.5)',
  },

  sortButtonText: {
    fontSize: 11,
    color: '#64748b',
  },

  sortButtonTextActive: {
    color: '#ffffff',
  },

  // Bracelets Section
  braceletsSection: {
    flex: 1,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  braceletsList: {
    paddingBottom: 20,
  },

  // Bracelet Card
  braceletCard: {
    marginBottom: 15,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  braceletCardCritical: {
    borderColor: 'rgba(239, 68, 68, 0.5)',
    shadowColor: '#ef4444',
  },

  braceletCardWarning: {
    borderColor: 'rgba(245, 158, 11, 0.5)',
    shadowColor: '#f59e0b',
  },

  cardGradient: {
    padding: 20,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },

  cardInfo: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },

  cardSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },

  cardStatus: {
    alignItems: 'flex-end',
  },

  signalBarsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 16,
    marginBottom: 4,
  },

  signalBar: {
    borderRadius: 1,
  },

  signalBarsText: {
    fontSize: 10,
    color: '#64748b',
  },

  cardMetrics: {
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

  braceletAlerts: {
    flexDirection: 'row',
    gap: 5,
    marginBottom: 15,
  },

  alertBadge: {
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  alertBadgeCritical: {
    backgroundColor: '#ef4444',
  },

  alertBadgeWarning: {
    backgroundColor: '#f59e0b',
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  proximityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  proximityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  proximityText: {
    fontSize: 12,
    color: '#64748b',
  },

  lastSeen: {
    fontSize: 10,
    color: '#64748b',
  },

  // Map Section
  mapSection: {
    flex: 1,
    padding: 20,
  },

  mapContainer: {
    flex: 1,
  },

  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },

  map: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    position: 'relative',
    marginBottom: 20,
  },

  mapGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  gridLine: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    position: 'absolute',
  },

  safetyCircle: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },

  mapCenter: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3b82f6',
    borderWidth: 2,
    borderColor: '#ffffff',
  },

  braceletPosition: {
    position: 'absolute',
    alignItems: 'center',
  },

  positionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
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
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flexBasis: '45%',
  },

  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  legendText: {
    fontSize: 11,
    color: '#64748b',
  },

  // Detail Screen
  detailContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
  },

  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 130, 246, 0.2)',
  },

  closeButton: {
    padding: 8,
  },

  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },

  placeholder: {
    width: 40,
  },

  detailContent: {
    flex: 1,
    padding: 20,
  },

  detailCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },

  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  detailPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    marginRight: 15,
  },

  detailInfo: {
    flex: 1,
  },

  detailName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },

  detailId: {
    fontSize: 14,
    color: '#64748b',
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

  statBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  statBadgeText: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '600',
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
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '600',
  },

  detailSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },

  detailMetrics: {
    gap: 20,
  },

  metricDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },

  metricDetailInfo: {
    flex: 1,
  },

  metricDetailLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },

  metricDetailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },

  metricDetailSubtext: {
    fontSize: 11,
    color: '#94a3b8',
  },

  userInfoGrid: {
    gap: 15,
  },

  userInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 130, 246, 0.1)',
  },

  userInfoLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },

  userInfoValue: {
    fontSize: 14,
    color: '#ffffff',
  },

  techInfoGrid: {
    gap: 15,
  },

  techInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 130, 246, 0.1)',
  },

  techInfoLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },

  techInfoValue: {
    fontSize: 14,
    color: '#ffffff',
    fontFamily: 'monospace',
  },

  alertHistoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 130, 246, 0.1)',
  },

  alertHistoryText: {
    flex: 1,
    fontSize: 13,
    color: '#ffffff',
  },

  noAlertsText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },

  // Login Screen
  loginContainer: {
    flex: 1,
  },

  loginBackground: {
    flex: 1,
  },

  loginOverlay: {
    flex: 1,
  },

  loginContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  loginHeader: {
    alignItems: 'center',
    marginBottom: 60,
  },

  loginTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 20,
    marginBottom: 8,
  },

  loginSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
  },

  loginForm: {
    marginBottom: 40,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },

  inputIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
    paddingVertical: 15,
  },

  loginButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 20,
  },

  loginButtonDisabled: {
    backgroundColor: '#64748b',
  },

  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },

  loginInfo: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 10,
  },

  infoText: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 5,
    fontFamily: 'monospace',
  },
});

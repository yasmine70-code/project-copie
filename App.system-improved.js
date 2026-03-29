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
  BackHandler
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Configuration système optimisée
const SYSTEM_CONFIG = {
  // Configuration réseau améliorée
  NETWORK: {
    AP_NAME: 'RSSI_Surveillance_Pro',
    PASSWORD: 'secure123',
    CHANNEL: 6,
    MAX_CONNECTIONS: 20,
    ENCRYPTION: 'WPA2',
    BANDWIDTH: '20MHz'
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
    CACHE_DURATION: 30000
  },
  
  // Sécurité
  SECURITY: {
    SESSION_TIMEOUT: 7200000,      // 2 heures
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 900000,     // 15 minutes
    ENCRYPTION_KEY: 'RSSI_2024_SECURE'
  },
  
  // Alertes
  ALERTS: {
    CRITICAL_BATTERY: 15,
    LOW_BATTERY: 30,
    SOS_PRIORITY: 1,
    PERIMETER_BREACH: 2,
    CONNECTION_LOST: 3,
    SIGNAL_LOST: 4
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
    batteryLevel: 92,
    rssi: -35,
    lastSeen: new Date(),
    distance: 8,
    proximity: 'EXCELLENT',
    signalBars: 5,
    connectionStatus: 'connected',
    signalQuality: 'excellent',
    temperature: 36.5,
    heartRate: 72,
    steps: 1234,
    sosActive: false,
    locationHistory: [],
    alerts: [],
    metadata: {
      assignedUser: 'Jean Dupont',
      role: 'leader',
      team: 'alpha',
      certification: 'advanced'
    }
  },
  {
    id: 'BR002',
    name: 'Beta Scout',
    macAddress: '24:6F:28:7C:1B:3C',
    firmwareVersion: '2.1.0',
    hardwareVersion: 'ESP32-D0WDQ6-V3',
    batteryLevel: 78,
    rssi: -48,
    lastSeen: new Date(),
    distance: 18,
    proximity: 'GOOD',
    signalBars: 4,
    connectionStatus: 'connected',
    signalQuality: 'good',
    temperature: 36.8,
    heartRate: 68,
    steps: 987,
    sosActive: false,
    locationHistory: [],
    alerts: [],
    metadata: {
      assignedUser: 'Marie Martin',
      role: 'scout',
      team: 'beta',
      certification: 'intermediate'
    }
  },
  {
    id: 'BR003',
    name: 'Gamma Medic',
    macAddress: '24:6F:28:7C:1A:4D',
    firmwareVersion: '2.0.1',
    hardwareVersion: 'ESP32-D0WDQ6-V3',
    batteryLevel: 45,
    rssi: -72,
    lastSeen: new Date(),
    distance: 35,
    proximity: 'FAIR',
    signalBars: 3,
    connectionStatus: 'connected',
    signalQuality: 'fair',
    temperature: 37.1,
    heartRate: 75,
    steps: 756,
    sosActive: false,
    locationHistory: [],
    alerts: [{ type: 'battery', level: 'warning', message: 'Batterie en dessous de 50%' }],
    metadata: {
      assignedUser: 'Dr. Sophie Laurent',
      role: 'medic',
      team: 'gamma',
      certification: 'medical'
    }
  },
  {
    id: 'BR004',
    name: 'Delta Explorer',
    macAddress: '24:6F:28:7C:1B:5E',
    firmwareVersion: '2.1.0',
    hardwareVersion: 'ESP32-D0WDQ6-V3',
    batteryLevel: 23,
    rssi: -88,
    lastSeen: new Date(Date.now() - 45000),
    distance: 55,
    proximity: 'WEAK',
    signalBars: 2,
    connectionStatus: 'disconnected',
    signalQuality: 'weak',
    temperature: 36.2,
    heartRate: 80,
    steps: 543,
    sosActive: true,
    locationHistory: [],
    alerts: [
      { type: 'battery', level: 'critical', message: 'Batterie critique!' },
      { type: 'sos', level: 'critical', message: 'SOS activé!' },
      { type: 'connection', level: 'warning', message: 'Connexion perdue' }
    ],
    metadata: {
      assignedUser: 'Pierre Bernard',
      role: 'explorer',
      team: 'delta',
      certification: 'basic'
    }
  },
  {
    id: 'BR005',
    name: 'Epsilon Tech',
    macAddress: '24:6F:28:7C:1A:6F',
    firmwareVersion: '2.1.0',
    hardwareVersion: 'ESP32-D0WDQ6-V3',
    batteryLevel: 88,
    rssi: -98,
    lastSeen: new Date(),
    distance: 70,
    proximity: 'VERY_WEAK',
    signalBars: 1,
    connectionStatus: 'connected',
    signalQuality: 'very_weak',
    temperature: 36.9,
    heartRate: 70,
    steps: 432,
    sosActive: false,
    locationHistory: [],
    alerts: [{ type: 'signal', level: 'warning', message: 'Signal très faible' }],
    metadata: {
      assignedUser: 'Claire Dubois',
      role: 'technician',
      team: 'epsilon',
      certification: 'technical'
    }
  }
];

// Utilitaires système optimisés
class SystemUtils {
  static calculateDistanceFromRSSI(rssi) {
    // Formule améliorée avec correction environnementale
    const A = -45; // RSSI à 1mètre
    const n = 2.7; // Constante de propagation optimisée
    const environmentFactor = 1.1; // Facteur de correction environnementale
    
    if (rssi >= 0) return 0;
    
    const rawDistance = Math.pow(10, (rssi - A) / (-10 * n));
    const correctedDistance = rawDistance * environmentFactor;
    
    return Math.min(Math.max(correctedDistance, 0), 150);
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
      }, 1000); // Vérification chaque seconde
    };

    startUpdates();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [updateInterval, callback]);
};

// Hook personnalisé pour la gestion des alertes
const useAlertsManager = (bracelets, safetyRadius) => {
  const [alerts, setAlerts] = useState([]);
  const [alertHistory, setAlertHistory] = useState([]);

  const checkAlerts = useCallback(() => {
    const newAlerts = [];
    const currentTime = new Date();

    bracelets.forEach(bracelet => {
      // Vérification alerte SOS
      if (bracelet.sosActive) {
        newAlerts.push({
          id: `sos-${bracelet.id}`,
          type: 'sos',
          priority: SYSTEM_CONFIG.ALERTS.SOS_PRIORITY,
          message: `SOS activé sur ${bracelet.name}`,
          braceletId: bracelet.id,
          timestamp: currentTime,
          severity: 'critical'
        });
      }

      // Vérification batterie critique
      if (bracelet.batteryLevel <= SYSTEM_CONFIG.ALERTS.CRITICAL_BATTERY) {
        newAlerts.push({
          id: `battery-critical-${bracelet.id}`,
          type: 'battery',
          priority: SYSTEM_CONFIG.ALERTS.CONNECTION_LOST,
          message: `Batterie critique sur ${bracelet.name} (${bracelet.batteryLevel}%)`,
          braceletId: bracelet.id,
          timestamp: currentTime,
          severity: 'critical'
        });
      }

      // Vérification périmètre
      if (bracelet.distance > safetyRadius) {
        newAlerts.push({
          id: `perimeter-${bracelet.id}`,
          type: 'perimeter',
          priority: SYSTEM_CONFIG.ALERTS.PERIMETER_BREACH,
          message: `${bracelet.name} hors périmètre (${Math.round(bracelet.distance)}m)`,
          braceletId: bracelet.id,
          timestamp: currentTime,
          severity: 'high'
        });
      }

      // Vérification connexion
      if (bracelet.connectionStatus === 'disconnected') {
        const timeSinceLastSeen = currentTime - bracelet.lastSeen;
        if (timeSinceLastSeen > 60000) { // 1 minute
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
      if (bracelet.signalBars <= 1) {
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
    
    // Ajouter à l'historique
    if (newAlerts.length > 0) {
      setAlertHistory(prev => [...newAlerts, ...prev].slice(0, 100));
    }
  }, [bracelets, safetyRadius]);

  useEffect(() => {
    checkAlerts();
  }, [checkAlerts]);

  return { alerts, alertHistory, checkAlerts };
};

// Composant de barres de signal optimisé
const SignalBars = React.memo(({ bars, rssi, size = 'medium' }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    if (bars <= 2) {
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
  }, [bars]);

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
                  { scale: index <= bars && bars <= 2 ? pulseAnim : 1 }
                ]
              }
            ]}
          />
        ))}
      </View>
      <Text style={styles.signalBarsText}>{bars}/5</Text>
    </View>
  );
});

// Composant de carte bracelet optimisé
const BraceletCard = React.memo(({ bracelet, onPress, safetyRadius }) => {
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

  const hasCriticalAlerts = bracelet.alerts.some(alert => alert.level === 'critical');
  const hasWarnings = bracelet.alerts.some(alert => alert.level === 'warning');

  return (
    <Animated.View style={{ transform: [{ scale: cardAnim }] }}>
      <TouchableOpacity
        style={[
          styles.braceletCard,
          hasCriticalAlerts && styles.braceletCardCritical,
          hasWarnings && styles.braceletCardWarning
        ]}
        onPress={onPress}
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
              <Text style={styles.braceletName}>{bracelet.name}</Text>
              <Text style={styles.braceletId}>{bracelet.id}</Text>
              <Text style={styles.braceletUser}>{bracelet.metadata.assignedUser}</Text>
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
              <SignalBars bars={bracelet.signalBars} rssi={bracelet.rssi} size="small" />
              <Text style={styles.metricLabel}>Signal</Text>
              <Text style={styles.metricValue}>{Math.round(bracelet.distance)}m</Text>
            </View>
            
            <View style={styles.metricItem}>
              <Ionicons 
                name={SystemUtils.getBatteryIcon(bracelet.batteryLevel)} 
                size={20} 
                color={SystemUtils.getBatteryColor(bracelet.batteryLevel)} 
              />
              <Text style={styles.metricLabel}>Batterie</Text>
              <Text style={styles.metricValue}>{bracelet.batteryLevel}%</Text>
            </View>
            
            <View style={styles.metricItem}>
              <Ionicons name="heart" size={20} color="#ef4444" />
              <Text style={styles.metricLabel}>Cardiaque</Text>
              <Text style={styles.metricValue}>{bracelet.heartRate} bpm</Text>
            </View>
            
            <View style={styles.metricItem}>
              <Ionicons name="thermometer" size={20} color="#f59e0b" />
              <Text style={styles.metricLabel}>Température</Text>
              <Text style={styles.metricValue}>{bracelet.temperature}°C</Text>
            </View>
          </View>

          {/* Alertes */}
          {bracelet.alerts.length > 0 && (
            <View style={styles.braceletAlerts}>
              {bracelet.alerts.map((alert, index) => (
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
                  <Text style={styles.alertText}>{alert.message}</Text>
                </View>
              ))}
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

// Composant de tableau de bord
const Dashboard = ({ bracelets, alerts, safetyRadius, onBraceletPress }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('distance');

  // Filtrage et tri optimisés
  const filteredAndSortedBracelets = useMemo(() => {
    let filtered = bracelets;

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
          filtered = filtered.filter(b => b.batteryLevel <= SYSTEM_CONFIG.ALERTS.LOW_BATTERY);
          break;
        case 'critical':
          filtered = filtered.filter(b => b.alerts.some(a => a.level === 'critical'));
          break;
        case 'out_of_range':
          filtered = filtered.filter(b => b.distance > safetyRadius);
          break;
      }
    }

    // Recherche
    if (searchQuery) {
      filtered = filtered.filter(b => 
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.metadata.assignedUser.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Tri
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return a.distance - b.distance;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'battery':
          return b.batteryLevel - a.batteryLevel;
        case 'signal':
          return b.signalBars - a.signalBars;
        case 'user':
          return a.metadata.assignedUser.localeCompare(b.metadata.assignedUser);
        default:
          return 0;
      }
    });
  }, [bracelets, selectedFilter, searchQuery, sortBy, safetyRadius]);

  const stats = useMemo(() => ({
    total: bracelets.length,
    connected: bracelets.filter(b => b.connectionStatus === 'connected').length,
    disconnected: bracelets.filter(b => b.connectionStatus === 'disconnected').length,
    sos: bracelets.filter(b => b.sosActive).length,
    lowBattery: bracelets.filter(b => b.batteryLevel <= SYSTEM_CONFIG.ALERTS.LOW_BATTERY).length,
    criticalBattery: bracelets.filter(b => b.batteryLevel <= SYSTEM_CONFIG.ALERTS.CRITICAL_BATTERY).length,
    outOfRange: bracelets.filter(b => b.distance > safetyRadius).length,
    averageSignal: bracelets.reduce((acc, b) => acc + b.signalBars, 0) / bracelets.length
  }), [bracelets, safetyRadius]);

  return (
    <ScrollView style={styles.dashboard} showsVerticalScrollIndicator={false}>
      {/* Statistiques */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>📊 Statistiques en Temps Réel</Text>
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
      </View>

      {/* Alertes critiques */}
      {alerts.length > 0 && (
        <View style={styles.alertsSection}>
          <Text style={styles.sectionTitle}>🚨 Alertes Actives</Text>
          {alerts.slice(0, 3).map(alert => (
            <View key={alert.id} style={[
              styles.alertItem,
              alert.severity === 'critical' && styles.alertItemCritical,
              alert.severity === 'high' && styles.alertItemHigh
            ]}>
              <Ionicons 
                name={alert.type === 'sos' ? 'warning' : alert.type === 'battery' ? 'battery-dead' : 'radio-outline'} 
                size={20} 
                color={alert.severity === 'critical' ? '#ffffff' : '#ef4444'} 
              />
              <Text style={[
                styles.alertMessage,
                alert.severity === 'critical' && styles.alertMessageCritical
              ]}>
                {alert.message}
              </Text>
              <Text style={styles.alertTime}>
                {alert.timestamp.toLocaleTimeString()}
              </Text>
            </View>
          ))}
        </View>
      )}

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
        
        {filteredAndSortedBracelets.map(bracelet => (
          <BraceletCard
            key={bracelet.id}
            bracelet={bracelet}
            onPress={() => onBraceletPress(bracelet)}
            safetyRadius={safetyRadius}
          />
        ))}
      </View>
    </ScrollView>
  );
};

// Écran principal
const HomeScreen = ({ user, onLogout }) => {
  const [bracelets, setBracelets] = useState(BRACELETS_DATA);
  const [safetyRadius, setSafetyRadius] = useState(100);
  const [selectedBracelet, setSelectedBracelet] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [systemStatus, setSystemStatus] = useState('online');
  const lastUpdate = useRef(Date.now());

  const { alerts, alertHistory, checkAlerts } = useAlertsManager(bracelets, safetyRadius);

  // Mises à jour en temps réel
  const updateBraceletsData = useCallback(() => {
    setBracelets(prevBracelets => 
      prevBracelets.map(bracelet => {
        // Simulation de variation RSSI
        const rssiVariation = (Math.random() - 0.5) * 8;
        const newRssi = Math.max(-110, Math.min(-25, bracelet.rssi + rssiVariation));
        
        // Simulation de décharge batterie
        const batteryDrain = Math.random() * 0.3;
        const newBattery = Math.max(0, bracelet.battery_level - batteryDrain);
        
        // Calcul des nouvelles valeurs
        const distance = SystemUtils.calculateDistanceFromRSSI(newRssi);
        const proximity = SystemUtils.getProximityFromRSSI(newRssi);
        const signalBars = SystemUtils.getSignalBarsFromRSSI(newRssi);
        const signalQuality = SystemUtils.getSignalQuality(newRssi);
        
        // Simulation de perte de connexion
        const connectionStatus = newRssi < -100 ? 'disconnected' : 'connected';
        
        // Mise à jour temps
        const lastSeen = connectionStatus === 'connected' ? new Date() : bracelet.lastSeen;
        
        // Simulation de variations de signes vitaux
        const heartRateVariation = Math.floor((Math.random() - 0.5) * 10);
        const temperatureVariation = (Math.random() - 0.5) * 0.5;
        
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
          heartRate: Math.max(50, Math.min(120, bracelet.heartRate + heartRateVariation)),
          temperature: Math.max(35, Math.min(40, bracelet.temperature + temperatureVariation)),
          steps: bracelet.steps + Math.floor(Math.random() * 5)
        };
      })
    );
    
    lastUpdate.current = Date.now();
    checkAlerts();
  }, [checkAlerts]);

  // Utiliser le hook de mises à jour en temps réel
  useRealTimeUpdates(SYSTEM_CONFIG.PERFORMANCE.UPDATE_INTERVAL, updateBraceletsData);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    updateBraceletsData();
    setTimeout(() => setRefreshing(false), 1000);
  }, [updateBraceletsData]);

  const handleBraceletPress = useCallback((bracelet) => {
    setSelectedBracelet(bracelet);
    // Vibration feedback
    if (Platform.OS !== 'web') {
      Vibration.vibrate(50);
    }
  }, []);

  // Gestion du bouton retour
  useEffect(() => {
    const backHandler = () => {
      if (selectedBracelet) {
        setSelectedBracelet(null);
        return true;
      }
      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', backHandler);
    return () => BackHandler.removeEventListener('hardwareBackPress', backHandler);
  }, [selectedBracelet]);

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
          <Text style={styles.detailTitle}>{selectedBracelet.name}</Text>
          <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
            <Ionicons name="log-out" size={24} color="#ef4444" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.detailContainer}>
          <View style={styles.detailCard}>
            <Text style={styles.detailSectionTitle}>Informations Générales</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>ID:</Text>
              <Text style={styles.detailValue}>{selectedBracelet.id}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>MAC:</Text>
              <Text style={styles.detailValue}>{selectedBracelet.macAddress}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Utilisateur:</Text>
              <Text style={styles.detailValue}>{selectedBracelet.metadata.assignedUser}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Rôle:</Text>
              <Text style={styles.detailValue}>{selectedBracelet.metadata.role}</Text>
            </View>
          </View>
          
          <View style={styles.detailCard}>
            <Text style={styles.detailSectionTitle}>Métriques en Temps Réel</Text>
            <View style={styles.metricsGrid}>
              <View style={styles.metricDetail}>
                <SignalBars bars={selectedBracelet.signalBars} rssi={selectedBracelet.rssi} size="large" />
                <Text style={styles.metricDetailLabel}>Signal</Text>
                <Text style={styles.metricDetailValue}>{selectedBracelet.rssi} dBm</Text>
              </View>
              
              <View style={styles.metricDetail}>
                <Ionicons 
                  name={SystemUtils.getBatteryIcon(selectedBracelet.batteryLevel)} 
                  size={32} 
                  color={SystemUtils.getBatteryColor(selectedBracelet.batteryLevel)} 
                />
                <Text style={styles.metricDetailLabel}>Batterie</Text>
                <Text style={styles.metricDetailValue}>{selectedBracelet.batteryLevel}%</Text>
              </View>
              
              <View style={styles.metricDetail}>
                <Ionicons name="heart" size={32} color="#ef4444" />
                <Text style={styles.metricDetailLabel}>Cardiaque</Text>
                <Text style={styles.metricDetailValue}>{selectedBracelet.heartRate} bpm</Text>
              </View>
              
              <View style={styles.metricDetail}>
                <Ionicons name="thermometer" size={32} color="#f59e0b" />
                <Text style={styles.metricDetailLabel}>Température</Text>
                <Text style={styles.metricDetailValue}>{selectedBracelet.temperature}°C</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.detailCard}>
            <Text style={styles.detailSectionTitle}>Historique des Alertes</Text>
            {selectedBracelet.alerts.length > 0 ? (
              selectedBracelet.alerts.map((alert, index) => (
                <View key={index} style={styles.alertHistoryItem}>
                  <Ionicons 
                    name={alert.type === 'sos' ? 'warning' : alert.type === 'battery' ? 'battery-dead' : 'wifi-off'} 
                    size={16} 
                    color="#ef4444" 
                  />
                  <Text style={styles.alertHistoryText}>{alert.message}</Text>
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
            <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
              <Ionicons name="refresh" size={24} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
              <Ionicons name="log-out" size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.safetyRadiusContainer}>
          <Text style={styles.safetyRadiusLabel}>Périmètre de sécurité: {safetyRadius}m</Text>
          <View style={styles.safetyRadiusControls}>
            <TouchableOpacity 
              style={styles.radiusButton}
              onPress={() => setSafetyRadius(Math.max(50, safetyRadius - 10))}
            >
              <Text style={styles.radiusButtonText}>-10m</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.radiusButton}
              onPress={() => setSafetyRadius(Math.min(150, safetyRadius + 10))}
            >
              <Text style={styles.radiusButtonText}>+10m</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      <Dashboard
        bracelets={bracelets}
        alerts={alerts}
        safetyRadius={safetyRadius}
        onBraceletPress={handleBraceletPress}
      />
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
        onLoginSuccess({
          name: 'Chef de Groupe',
          role: 'Superviseur RSSI',
          loginTime: new Date(),
          sessionId: `session_${Date.now()}`
        });
      } else {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        
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
            <Text style={styles.loginSubtitle}>Système de Surveillance Hors-Ligne</Text>
            <Text style={styles.version}>Version 2.0</Text>
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
                <Text style={styles.loginButtonText}>
                  {isLoading ? 'Connexion...' : 'Se Connecter'}
                </Text>
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

// App principal
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
    marginBottom: 15,
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
  safetyRadiusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  safetyRadiusLabel: {
    fontSize: 14,
    color: '#e2e8f0',
    fontWeight: '600',
  },
  safetyRadiusControls: {
    flexDirection: 'row',
    gap: 10,
  },
  radiusButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  radiusButtonText: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '600',
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
    alignItems: 'center',
    marginBottom: 15,
  },
  braceletInfo: {
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

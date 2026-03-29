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
  RefreshControl,
  Animated,
  Platform,
  Vibration
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Configuration du système selon le cahier des charges
const SYSTEM_CONFIG = {
  WiFi_AP: {
    ssid: 'RSSI_Surveillance_AP',
    password: 'secure123',
    channel: 6,
    max_connections: 10
  },
  RSSI_THRESHOLDS: {
    close: -50,      // 0-20m
    medium: -70,     // 20-50m  
    far: -85,        // 50-100m
    out_of_range: -95 // >100m
  },
  DISTANCE_ESTIMATES: {
    close: { min: 0, max: 20, color: '#22c55e', label: 'Proche' },
    medium: { min: 20, max: 50, color: '#f59e0b', label: 'Moyen' },
    far: { min: 50, max: 100, color: '#ef4444', label: 'Loin' },
    out_of_range: { min: 100, max: 150, color: '#6b7280', label: 'Hors portée' }
  },
  UPDATE_INTERVAL: 5000, // 5 secondes selon cahier des charges
  BATTERY_THRESHOLDS: {
    low: 20,
    critical: 10
  },
  SAFETY_RADIUS: 100, // 100 mètres selon cahier des charges
  MAX_RANGE: 150 // 150 mètres selon cahier des charges
};

// Données des bracelets ESP32 selon le cahier des charges
const ESP32_BRACELETS = [
  {
    id: 'ESP32_001',
    name: 'Bracelet Alpha',
    mac_address: '24:6F:28:7C:1A:2B',
    firmware_version: '1.0.0',
    battery_level: 85,
    rssi: -45,
    last_seen: new Date(),
    distance_estimate: 15,
    proximity: 'close',
    sos_active: false,
    connection_status: 'connected',
    signal_strength: 'excellent',
    hardware_info: {
      chip_id: 'ESP32-D0WDQ6-V3',
      flash_size: '4MB',
      cpu_freq: '240MHz',
      wifi_mode: 'AP_STA'
    }
  },
  {
    id: 'ESP32_002', 
    name: 'Bracelet Beta',
    mac_address: '24:6F:28:7C:1B:3C',
    firmware_version: '1.0.0',
    battery_level: 72,
    rssi: -58,
    last_seen: new Date(),
    distance_estimate: 35,
    proximity: 'medium',
    sos_active: false,
    connection_status: 'connected',
    signal_strength: 'good',
    hardware_info: {
      chip_id: 'ESP32-D0WDQ6-V3',
      flash_size: '4MB',
      cpu_freq: '240MHz',
      wifi_mode: 'AP_STA'
    }
  },
  {
    id: 'ESP32_003',
    name: 'Bracelet Gamma',
    mac_address: '24:6F:28:7C:1A:4D',
    firmware_version: '1.0.0',
    battery_level: 18,
    rssi: -88,
    last_seen: new Date(),
    distance_estimate: 95,
    proximity: 'far',
    sos_active: false,
    connection_status: 'connected',
    signal_strength: 'weak',
    hardware_info: {
      chip_id: 'ESP32-D0WDQ6-V3',
      flash_size: '4MB',
      cpu_freq: '240MHz',
      wifi_mode: 'AP_STA'
    }
  },
  {
    id: 'ESP32_004',
    name: 'Bracelet Delta',
    mac_address: '24:6F:28:7C:1B:5E',
    firmware_version: '1.0.0',
    battery_level: 45,
    rssi: -96,
    last_seen: new Date(Date.now() - 30000),
    distance_estimate: 120,
    proximity: 'out_of_range',
    sos_active: true,
    connection_status: 'disconnected',
    signal_strength: 'none',
    hardware_info: {
      chip_id: 'ESP32-D0WDQ6-V3',
      flash_size: '4MB',
      cpu_freq: '240MHz',
      wifi_mode: 'AP_STA'
    }
  },
  {
    id: 'ESP32_005',
    name: 'Bracelet Epsilon',
    mac_address: '24:6F:28:7C:1A:6F',
    firmware_version: '1.0.0',
    battery_level: 92,
    rssi: -52,
    last_seen: new Date(),
    distance_estimate: 25,
    proximity: 'close',
    sos_active: false,
    connection_status: 'connected',
    signal_strength: 'excellent',
    hardware_info: {
      chip_id: 'ESP32-D0WDQ6-V3',
      flash_size: '4MB',
      cpu_freq: '240MHz',
      wifi_mode: 'AP_STA'
    }
  }
];

// Fonctions utilitaires selon le cahier des charges
const calculateDistanceFromRSSI = (rssi) => {
  // Formule de conversion RSSI → distance approximative
  // Distance = 10^((RSSI - A) / (-10 * n))
  // A = RSSI à 1m (typiquement -40 à -50)
  // n = constante de propagation (2 à 4)
  const A = -45; // RSSI à 1mètre
  const n = 3.5; // Environnement avec obstacles (forêt)
  
  if (rssi >= 0) return 0;
  
  const distance = Math.pow(10, (rssi - A) / (-10 * n));
  return Math.min(Math.max(distance, 0), SYSTEM_CONFIG.MAX_RANGE);
};

const getProximityFromRSSI = (rssi) => {
  if (rssi >= SYSTEM_CONFIG.RSSI_THRESHOLDS.close) return 'close';
  if (rssi >= SYSTEM_CONFIG.RSSI_THRESHOLDS.medium) return 'medium';
  if (rssi >= SYSTEM_CONFIG.RSSI_THRESHOLDS.far) return 'far';
  return 'out_of_range';
};

const getSignalStrength = (rssi) => {
  if (rssi >= -50) return 'excellent';
  if (rssi >= -60) return 'good';
  if (rssi >= -70) return 'fair';
  if (rssi >= -85) return 'weak';
  return 'none';
};

const getProximityColor = (proximity) => {
  return SYSTEM_CONFIG.DISTANCE_ESTIMATES[proximity]?.color || '#6b7280';
};

const getProximityLabel = (proximity) => {
  return SYSTEM_CONFIG.DISTANCE_ESTIMATES[proximity]?.label || 'Inconnu';
};

// Composant d'indicateur de proximité selon le cahier des charges
function ProximityIndicator({ proximity, distance, rssi }) {
  const config = SYSTEM_CONFIG.DISTANCE_ESTIMATES[proximity];
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    if (proximity === 'out_of_range' || proximity === 'far') {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          })
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    }
  }, [proximity]);

  return (
    <View style={styles.proximityContainer}>
      <Animated.View 
        style={[
          styles.proximityIndicator,
          { 
            backgroundColor: config?.color,
            transform: [{ scale: pulseAnim }]
          }
        ]}
      />
      <Text style={[styles.proximityText, { color: config?.color }]}>
        {config?.label}
      </Text>
      <Text style={styles.distanceText}>
        {Math.round(distance)}m
      </Text>
      <Text style={styles.rssiText}>
        {rssi} dBm
      </Text>
    </View>
  );
}

// Composant de batterie selon le cahier des charges
function BatteryIndicator({ level }) {
  const getBatteryColor = (level) => {
    if (level <= SYSTEM_CONFIG.BATTERY_THRESHOLDS.critical) return '#ef4444';
    if (level <= SYSTEM_CONFIG.BATTERY_THRESHOLDS.low) return '#f59e0b';
    return '#22c55e';
  };

  const getBatteryIcon = (level) => {
    if (level <= 10) return 'battery-dead';
    if (level <= 30) return 'battery-low';
    if (level <= 60) return 'battery-half';
    return 'battery-full';
  };

  return (
    <View style={styles.batteryContainer}>
      <Ionicons 
        name={getBatteryIcon(level)} 
        size={20} 
        color={getBatteryColor(level)} 
      />
      <Text style={[styles.batteryText, { color: getBatteryColor(level) }]}>
        {level}%
      </Text>
    </View>
  );
}

// Écran Login selon le cahier des charges
function LoginScreen({ onLoginSuccess }) {
  const [wifiStatus, setWifiStatus] = useState('initializing');
  const [apConfig, setApConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Simulation d'initialisation du réseau WiFi AP
    setTimeout(() => {
      setWifiStatus('ready');
      setApConfig({
        ssid: SYSTEM_CONFIG.WiFi_AP.ssid,
        channel: SYSTEM_CONFIG.WiFi_AP.channel,
        max_connections: SYSTEM_CONFIG.WiFi_AP.max_connections
      });
    }, 2000);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleStartSystem = () => {
    setIsLoading(true);
    
    // Simulation de démarrage du système de surveillance
    setTimeout(() => {
      onLoginSuccess({ 
        name: 'Chef de Groupe', 
        role: 'Superviseur RSSI',
        system: 'RSSI_Surveillance_v1.0',
        ap_config: apConfig
      });
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e293b" />
      
      {/* Background technique */}
      <LinearGradient
        colors={['#1e293b', '#334155', '#475569', '#334155', '#1e293b']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <ScrollView contentContainerStyle={styles.loginScrollContainer}>
        <Animated.View style={[styles.loginContainer, { opacity: fadeAnim }]}>
          {/* Header technique */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['#3b82f6', '#2563eb', '#1d4ed8']}
                style={styles.logoGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.logo}>📡</Text>
              </LinearGradient>
            </View>
            <Text style={styles.title}>RSSI Surveillance</Text>
            <Text style={styles.subtitle}>Système de Surveillance Hors-Ligne</Text>
            
            {/* Statut WiFi AP */}
            <View style={styles.statusContainer}>
              <View style={[
                styles.statusIndicator,
                { backgroundColor: wifiStatus === 'ready' ? '#22c55e' : '#f59e0b' }
              ]} />
              <Text style={styles.statusText}>
                {wifiStatus === 'initializing' ? 'Initialisation WiFi AP...' : 'WiFi AP Prêt'}
              </Text>
            </View>

            {apConfig && (
              <View style={styles.configContainer}>
                <Text style={styles.configTitle}>Configuration Réseau:</Text>
                <Text style={styles.configItem}>SSID: {apConfig.ssid}</Text>
                <Text style={styles.configItem}>Canal: {apConfig.channel}</Text>
                <Text style={styles.configItem}>Max Connexions: {apConfig.max_connections}</Text>
                <Text style={styles.configItem}>Portée: {SYSTEM_CONFIG.MAX_RANGE}m</Text>
              </View>
            )}
          </View>

          {/* Formulaire de démarrage */}
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Démarrer la Surveillance</Text>
            
            <View style={styles.infoContainer}>
              <Text style={styles.infoTitle}>Caractéristiques du Système:</Text>
              <Text style={styles.infoItem}>✅ Fonctionnement 100% hors Internet</Text>
              <Text style={styles.infoItem}>✅ Pas de GPS requis</Text>
              <Text style={styles.infoItem}>✅ Portée: 100-150m selon environnement</Text>
              <Text style={styles.infoItem}>✅ Mise à jour toutes les 5 secondes</Text>
              <Text style={styles.infoItem}>✅ {ESP32_BRACELETS.length} bracelets ESP32 actifs</Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.startButton, isLoading && styles.startButtonDisabled]} 
              onPress={handleStartSystem}
              disabled={isLoading || wifiStatus !== 'ready'}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={isLoading ? ['#6b7280', '#4b5563'] : ['#3b82f6', '#2563eb']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? 'Démarrage...' : 'Démarrer la Surveillance'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// Écran principal de surveillance selon le cahier des charges
function HomeScreen({ user, onLogout }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [bracelets, setBracelets] = useState(ESP32_BRACELETS);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [safetyRadius, setSafetyRadius] = useState(SYSTEM_CONFIG.SAFETY_RADIUS);
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastUpdate = useRef(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulation de mise à jour RSSI toutes les 5 secondes
  useEffect(() => {
    const updateInterval = setInterval(() => {
      setBracelets(prevBracelets => 
        prevBracelets.map(bracelet => {
          // Simulation de variation RSSI
          const rssiVariation = (Math.random() - 0.5) * 10;
          const newRssi = Math.max(-100, Math.min(-30, bracelet.rssi + rssiVariation));
          
          // Simulation de décharge batterie
          const batteryDrain = Math.random() * 0.5;
          const newBattery = Math.max(0, bracelet.battery_level - batteryDrain);
          
          // Calcul distance et proximité
          const distance = calculateDistanceFromRSSI(newRssi);
          const proximity = getProximityFromRSSI(newRssi);
          const signalStrength = getSignalStrength(newRssi);
          
          // Simulation de perte de connexion
          const connectionStatus = newRssi < -95 ? 'disconnected' : 'connected';
          
          // Mise à jour temps
          const lastSeen = connectionStatus === 'connected' ? new Date() : bracelet.last_seen;
          
          return {
            ...bracelet,
            rssi: newRssi,
            battery_level: newBattery,
            distance_estimate: distance,
            proximity,
            signal_strength,
            connection_status,
            last_seen
          };
        })
      );
      
      lastUpdate.current = Date.now();
    }, SYSTEM_CONFIG.UPDATE_INTERVAL);

    return () => clearInterval(updateInterval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulation de rafraîchissement manuel
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const getFilteredBracelets = () => {
    switch (selectedFilter) {
      case 'connected':
        return bracelets.filter(b => b.connection_status === 'connected');
      case 'disconnected':
        return bracelets.filter(b => b.connection_status === 'disconnected');
      case 'sos':
        return bracelets.filter(b => b.sos_active);
      case 'low_battery':
        return bracelets.filter(b => b.battery_level <= SYSTEM_CONFIG.BATTERY_THRESHOLDS.low);
      case 'out_of_range':
        return bracelets.filter(b => b.proximity === 'out_of_range');
      default:
        return bracelets;
    }
  };

  const filteredBracelets = getFilteredBracelets();

  // Vérification des alertes selon le cahier des charges
  const checkAlerts = () => {
    const alerts = [];
    
    // Alertes de dépassement de périmètre
    const outOfRangeBracelets = bracelets.filter(b => 
      b.distance_estimate > safetyRadius
    );
    if (outOfRangeBracelets.length > 0) {
      alerts.push({
        type: 'perimeter',
        message: `${outOfRangeBracelets.length} bracelet(s) hors périmètre de sécurité`,
        severity: 'high'
      });
    }
    
    // Alertes SOS
    const sosBracelets = bracelets.filter(b => b.sos_active);
    if (sosBracelets.length > 0) {
      alerts.push({
        type: 'sos',
        message: `Alerte SOS active sur ${sosBracelets.length} bracelet(s)`,
        severity: 'critical'
      });
    }
    
    // Alertes batterie faible
    const lowBatteryBracelets = bracelets.filter(b => 
      b.battery_level <= SYSTEM_CONFIG.BATTERY_THRESHOLDS.critical
    );
    if (lowBatteryBracelets.length > 0) {
      alerts.push({
        type: 'battery',
        message: `${lowBatteryBracelets.length} bracelet(s) avec batterie critique`,
        severity: 'medium'
      });
    }
    
    // Alertes déconnexion
    const disconnectedBracelets = bracelets.filter(b => 
      b.connection_status === 'disconnected'
    );
    if (disconnectedBracelets.length > 0) {
      alerts.push({
        type: 'connection',
        message: `${disconnectedBracelets.length} bracelet(s) déconnecté(s)`,
        severity: 'medium'
      });
    }
    
    return alerts;
  };

  const alerts = checkAlerts();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e293b" />
      
      {/* Background technique */}
      <LinearGradient
        colors={['#1e293b', '#334155', '#475569', '#334155', '#1e293b']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <Animated.ScrollView
        style={styles.dashboardContainer}
        contentContainerStyle={styles.dashboardScrollContainer}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh}
            colors={['#3b82f6', '#2563eb']}
            tintColor="#3b82f6"
          />
        }
      >
        {/* Header système */}
        <View style={styles.dashboardHeader}>
          <LinearGradient
            colors={['rgba(59, 130, 246, 0.1)', 'rgba(37, 99, 235, 0.1)']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.userInfo}>
              <View style={styles.userAvatar}>
                <Ionicons name="person" size={30} color="#3b82f6" />
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.greeting}>{user?.name || 'Superviseur'}</Text>
                <Text style={styles.userRole}>{user?.role || 'RSSI Surveillance'}</Text>
                <Text style={styles.systemInfo}>Système: {user?.system}</Text>
                <Text style={styles.time}>{currentTime.toLocaleTimeString()}</Text>
                <Text style={styles.lastUpdate}>
                  Dernière mise à jour: {new Date(lastUpdate.current).toLocaleTimeString()}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
              <LinearGradient
                colors={['#ef4444', '#dc2626']}
                style={styles.logoutGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="power" size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Alertes système */}
        {alerts.length > 0 && (
          <View style={styles.alertsSection}>
            <Text style={styles.sectionTitle}>🚨 Alertes Actives</Text>
            {alerts.map((alert, index) => (
              <View key={index} style={[
                styles.alertItem,
                { 
                  backgroundColor: alert.severity === 'critical' ? 'rgba(239, 68, 68, 0.2)' :
                                   alert.severity === 'high' ? 'rgba(245, 158, 11, 0.2)' :
                                   'rgba(59, 130, 246, 0.2)',
                  borderColor: alert.severity === 'critical' ? '#ef4444' :
                               alert.severity === 'high' ? '#f59e0b' :
                               '#3b82f6'
                }
              ]}>
                <Ionicons 
                  name={alert.type === 'sos' ? 'warning' : 
                         alert.type === 'perimeter' ? 'radio-outline' :
                         alert.type === 'battery' ? 'battery-dead' :
                         'wifi-off'} 
                  size={20} 
                  color={alert.severity === 'critical' ? '#ef4444' :
                           alert.severity === 'high' ? '#f59e0b' :
                           '#3b82f6'} 
                />
                <Text style={[
                  styles.alertText,
                  { color: alert.severity === 'critical' ? '#ef4444' :
                           alert.severity === 'high' ? '#f59e0b' :
                           '#3b82f6'}
                ]}>
                  {alert.message}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Statistiques système */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>📊 État du Système</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#3b82f6', '#2563eb']}
                style={styles.statCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.statValue}>{bracelets.length}</Text>
                <Text style={styles.statLabel}>Bracelets</Text>
                <Ionicons name="watch" size={24} color="rgba(255,255,255,0.3)" style={styles.statIcon} />
              </LinearGradient>
            </View>
            
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#22c55e', '#16a34a']}
                style={styles.statCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.statValue}>{bracelets.filter(b => b.connection_status === 'connected').length}</Text>
                <Text style={styles.statLabel}>Connectés</Text>
                <Ionicons name="wifi" size={24} color="rgba(255,255,255,0.3)" style={styles.statIcon} />
              </LinearGradient>
            </View>
            
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#f59e0b', '#d97706']}
                style={styles.statCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.statValue}>{alerts.filter(a => a.severity === 'critical').length}</Text>
                <Text style={styles.statLabel}>Alertes Critiques</Text>
                <Ionicons name="warning" size={24} color="rgba(255,255,255,0.3)" style={styles.statIcon} />
              </LinearGradient>
            </View>
            
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#ef4444', '#dc2626']}
                style={styles.statCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.statValue}>{bracelets.filter(b => b.battery_level <= 20).length}</Text>
                <Text style={styles.statLabel}>Batterie Faible</Text>
                <Ionicons name="battery-low" size={24} color="rgba(255,255,255,0.3)" style={styles.statIcon} />
              </LinearGradient>
            </View>
          </View>
        </View>

        {/* Configuration du périmètre de sécurité */}
        <View style={styles.configSection}>
          <Text style={styles.sectionTitle}>⚙️ Configuration Sécurité</Text>
          <View style={styles.safetyConfig}>
            <Text style={styles.configLabel}>Rayon de Sécurité: {safetyRadius}m</Text>
            <View style={styles.radiusSlider}>
              <TouchableOpacity 
                style={styles.radiusButton}
                onPress={() => setSafetyRadius(Math.max(50, safetyRadius - 10))}
              >
                <Text style={styles.radiusButtonText}>-10m</Text>
              </TouchableOpacity>
              <View style={styles.radiusValue}>
                <Text style={styles.radiusText}>{safetyRadius}m</Text>
              </View>
              <TouchableOpacity 
                style={styles.radiusButton}
                onPress={() => setSafetyRadius(Math.min(150, safetyRadius + 10))}
              >
                <Text style={styles.radiusButtonText}>+10m</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.rangeInfo}>
              Portée maximale: {SYSTEM_CONFIG.MAX_RANGE}m | 
              Mise à jour: {SYSTEM_CONFIG.UPDATE_INTERVAL/1000}s
            </Text>
          </View>
        </View>

        {/* Filtres */}
        <View style={styles.filtersSection}>
          <Text style={styles.sectionTitle}>🔍 Filtres</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollContainer}
          >
            {['all', 'connected', 'disconnected', 'sos', 'low_battery', 'out_of_range'].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  selectedFilter === filter && styles.activeFilter
                ]}
                onPress={() => setSelectedFilter(filter)}
                activeOpacity={0.8}
              >
                {selectedFilter === filter ? (
                  <LinearGradient
                    colors={['#3b82f6', '#2563eb']}
                    style={styles.filterGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.activeFilterText}>
                      {filter === 'all' && 'Tous'}
                      {filter === 'connected' && 'Connectés'}
                      {filter === 'disconnected' && 'Déconnectés'}
                      {filter === 'sos' && 'SOS'}
                      {filter === 'low_battery' && 'Batterie Faible'}
                      {filter === 'out_of_range' && 'Hors Portée'}
                    </Text>
                  </LinearGradient>
                ) : (
                  <Text style={styles.filterText}>
                    {filter === 'all' && 'Tous'}
                    {filter === 'connected' && 'Connectés'}
                    {filter === 'disconnected' && 'Déconnectés'}
                    {filter === 'sos' && 'SOS'}
                    {filter === 'low_battery' && 'Batterie Faible'}
                    {filter === 'out_of_range' && 'Hors Portée'}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Liste des bracelets ESP32 */}
        <View style={styles.braceletsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📡 Bracelets ESP32</Text>
            <Text style={styles.braceletCount}>{filteredBracelets.length} appareils</Text>
          </View>
          
          {filteredBracelets.map((bracelet) => (
            <TouchableOpacity
              key={bracelet.id}
              style={styles.braceletCard}
              onPress={() => console.log('Détails bracelet:', bracelet.id)}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={[
                  'rgba(30, 41, 59, 0.95)', 
                  'rgba(15, 23, 42, 0.95)', 
                  'rgba(59, 130, 246, 0.05)'
                ]}
                style={styles.braceletCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.braceletHeader}>
                  <View style={styles.braceletInfo}>
                    <View style={styles.braceletTitleContainer}>
                      <Text style={styles.braceletName}>{bracelet.name}</Text>
                      <Text style={styles.braceletId}>{bracelet.id}</Text>
                    </View>
                    
                    {/* Indicateurs de connexion et signal */}
                    <View style={styles.connectionContainer}>
                      <View style={[
                        styles.connectionIndicator,
                        { 
                          backgroundColor: bracelet.connection_status === 'connected' ? '#22c55e' : '#ef4444'
                        }
                      ]} />
                      <Text style={styles.statusText}>
                        {bracelet.connection_status === 'connected' ? 'Connecté' : 'Déconnecté'}
                      </Text>
                      <Text style={styles.signalText}>
                        Signal: {bracelet.signal_strength}
                      </Text>
                    </View>
                    
                    {/* Informations matériel */}
                    <View style={styles.hardwareContainer}>
                      <Text style={styles.hardwareItem}>MAC: {bracelet.mac_address}</Text>
                      <Text style={styles.hardwareItem}>Firmware: {bracelet.firmware_version}</Text>
                      <Text style={styles.hardwareItem}>Chip: {bracelet.hardware_info.chip_id}</Text>
                    </View>
                  </View>
                  
                  {/* Indicateurs latéraux */}
                  <View style={styles.indicatorsContainer}>
                    {/* Indicateur de proximité */}
                    <ProximityIndicator 
                      proximity={bracelet.proximity}
                      distance={bracelet.distance_estimate}
                      rssi={bracelet.rssi}
                    />
                    
                    {/* Indicateur de batterie */}
                    <BatteryIndicator level={bracelet.battery_level} />
                    
                    {/* Bouton SOS */}
                    {bracelet.sos_active && (
                      <View style={styles.sosIndicator}>
                        <Ionicons name="warning" size={20} color="#ef4444" />
                        <Text style={styles.sosText}>SOS</Text>
                      </View>
                    )}
                  </View>
                </View>
                
                {/* Informations détaillées */}
                <View style={styles.detailsContainer}>
                  <View style={styles.detailsRow}>
                    <Text style={styles.detailsLabel}>RSSI:</Text>
                    <Text style={styles.detailsValue}>{bracelet.rssi} dBm</Text>
                  </View>
                  <View style={styles.detailsRow}>
                    <Text style={styles.detailsLabel}>Distance:</Text>
                    <Text style={styles.detailsValue}>{Math.round(bracelet.distance_estimate)}m</Text>
                  </View>
                  <View style={styles.detailsRow}>
                    <Text style={styles.detailsLabel}>Proximité:</Text>
                    <Text style={[
                      styles.detailsValue, 
                      { color: getProximityColor(bracelet.proximity) }
                    ]}>
                      {getProximityLabel(bracelet.proximity)}
                    </Text>
                  </View>
                  <View style={styles.detailsRow}>
                    <Text style={styles.detailsLabel}>Dernière vue:</Text>
                    <Text style={styles.detailsValue}>
                      {bracelet.last_seen.toLocaleTimeString()}
                    </Text>
                  </View>
                  <View style={styles.detailsRow}>
                    <Text style={styles.detailsLabel}>WiFi Mode:</Text>
                    <Text style={styles.detailsValue}>{bracelet.hardware_info.wifi_mode}</Text>
                  </View>
                  <View style={styles.detailsRow}>
                    <Text style={styles.detailsLabel}>CPU:</Text>
                    <Text style={styles.detailsValue}>{bracelet.hardware_info.cpu_freq}</Text>
                  </View>
                </View>
                
                {/* Actions */}
                <View style={styles.actionsContainer}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="refresh" size={16} color="#3b82f6" />
                    <Text style={styles.actionText}>Forcer Mise à Jour</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="locate" size={16} color="#3b82f6" />
                    <Text style={styles.actionText}>Calibrer Distance</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="settings" size={16} color="#3b82f6" />
                    <Text style={styles.actionText}>Configuration</Text>
                  </TouchableOpacity>
                </View>
                
                {/* Alertes spécifiques au bracelet */}
                {bracelet.distance_estimate > safetyRadius && (
                  <View style={styles.perimeterAlert}>
                    <Ionicons name="radio-outline" size={16} color="#f59e0b" />
                    <Text style={styles.perimeterAlertText}>
                      Hors périmètre de sécurité ({safetyRadius}m)
                    </Text>
                  </View>
                )}
                
                {bracelet.battery_level <= SYSTEM_CONFIG.BATTERY_THRESHOLDS.low && (
                  <View style={styles.batteryAlert}>
                    <Ionicons name="battery-low" size={16} color="#f59e0b" />
                    <Text style={styles.batteryAlertText}>
                      Niveau de batterie faible
                    </Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

// App principal selon le cahier des charges
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
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
        <StatusBar barStyle="light-content" backgroundColor="#1e293b" />
        <LinearGradient
          colors={['#1e293b', '#334155', '#475569', '#334155', '#1e293b']}
          style={styles.background}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingLogo}>📡</Text>
          <Text style={styles.loadingText}>RSSI Surveillance</Text>
          <Text style={styles.loadingSubtext}>Initialisation du système...</Text>
          <View style={styles.loadingInfo}>
            <Text style={styles.loadingInfoItem}>Configuration ESP32</Text>
            <Text style={styles.loadingInfoItem}>Initialisation WiFi AP</Text>
            <Text style={styles.loadingInfoItem}>Préparation des bracelets</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e293b" />
      <LinearGradient
        colors={['#1e293b', '#334155', '#475569', '#334155', '#1e293b']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
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
    backgroundColor: '#1e293b',
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
    fontStyle: 'italic',
    marginBottom: 20,
  },
  loadingInfo: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  loadingInfoItem: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 5,
  },
  
  // Login Styles
  loginScrollContainer: {
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
    borderWidth: 2,
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
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  statusText: {
    fontSize: 14,
    color: '#94a3b8',
  },
  configContainer: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    marginBottom: 20,
  },
  configTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  configItem: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 3,
  },
  
  form: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 20,
    padding: 35,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 25,
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 25,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 10,
  },
  infoItem: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 5,
  },
  startButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 5,
  },
  startButtonDisabled: {
    shadowColor: '#6b7280',
    shadowOpacity: 0.2,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Dashboard Styles
  dashboardContainer: {
    flex: 1,
  },
  dashboardScrollContainer: {
    padding: 20,
  },
  dashboardHeader: {
    borderRadius: 16,
    marginBottom: 25,
    overflow: 'hidden',
  },
  headerGradient: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    marginRight: 15,
  },
  userDetails: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 2,
  },
  systemInfo: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  time: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  lastUpdate: {
    fontSize: 10,
    color: '#64748b',
  },
  logoutButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  logoutGradient: {
    padding: 12,
    borderRadius: 20,
  },
  
  // Alerts Section
  alertsSection: {
    marginBottom: 25,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  alertText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 10,
    flex: 1,
  },
  
  // Stats Section
  statsSection: {
    marginBottom: 30,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  statCardGradient: {
    padding: 20,
    alignItems: 'center',
    position: 'relative',
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
    marginBottom: 4,
  },
  statIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  
  // Configuration Section
  configSection: {
    marginBottom: 30,
  },
  safetyConfig: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  configLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  radiusSlider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  radiusButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  radiusButtonText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
  },
  radiusValue: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  radiusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  rangeInfo: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
  
  // Filters Section
  filtersSection: {
    marginBottom: 30,
  },
  filterScrollContainer: {
    paddingHorizontal: 5,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    marginRight: 10,
  },
  activeFilter: {
    borderColor: 'transparent',
  },
  filterGradient: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  filterText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  
  // Bracelets Section
  braceletsSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  braceletCount: {
    fontSize: 14,
    color: '#94a3b8',
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  
  // Bracelet Cards
  braceletCard: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  braceletCardGradient: {
    padding: 20,
  },
  braceletHeader: {
    marginBottom: 15,
  },
  braceletInfo: {
    marginBottom: 15,
  },
  braceletTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  braceletName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  braceletId: {
    fontSize: 12,
    color: '#64748b',
    backgroundColor: 'rgba(100, 116, 139, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  connectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  connectionIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#94a3b8',
    marginRight: 15,
  },
  signalText: {
    fontSize: 12,
    color: '#64748b',
  },
  hardwareContainer: {
    marginBottom: 8,
  },
  hardwareItem: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 2,
  },
  indicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  // Proximity Indicator
  proximityContainer: {
    alignItems: 'center',
  },
  proximityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  proximityText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  distanceText: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 2,
  },
  rssiText: {
    fontSize: 10,
    color: '#64748b',
  },
  
  // Battery Indicator
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  
  // SOS Indicator
  sosIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  sosText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ef4444',
    marginLeft: 5,
  },
  
  // Details Container
  detailsContainer: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailsLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  detailsValue: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  
  // Actions Container
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  actionText: {
    fontSize: 10,
    color: '#3b82f6',
    marginLeft: 5,
  },
  
  // Alertes spécifiques
  perimeterAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    marginBottom: 8,
  },
  perimeterAlertText: {
    fontSize: 12,
    color: '#f59e0b',
    marginLeft: 8,
    flex: 1,
  },
  batteryAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  batteryAlertText: {
    fontSize: 12,
    color: '#f59e0b',
    marginLeft: 8,
    flex: 1,
  },
});

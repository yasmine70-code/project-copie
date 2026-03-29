import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Image,
  Animated,
  PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AdvancedAnimations, createAnimatedValues } from '../utils/advanced-animations';
import { themeManager, useTheme, createDynamicStyles, getStatusColors } from '../utils/advanced-themes';

const { width, height } = Dimensions.get('window');

// Données enrichies pour le dashboard holographique
const HOLOGRAPHIC_DATA = {
  members: [
    {
      id: '1',
      name: 'Alexandre Dubois',
      role: 'Chef de Groupe',
      avatar: 'https://picsum.photos/seed/alexandre/200/200.jpg',
      status: 'online',
      rssi: -50,
      battery: 90,
      zone: 'Zone A - Commandement',
      score: 98,
      mood: 'focused',
      activity: 'monitoring',
      lastUpdate: new Date(),
      position: { x: 100, y: 100, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      trajectory: [
        { x: 100, y: 100, z: 0, time: Date.now() - 5000 },
        { x: 110, y: 105, z: 0, time: Date.now() - 2500 },
        { x: 120, y: 110, z: 0, time: Date.now() }
      ],
      biometrics: {
        heartRate: 72,
        stress: 0.2,
        focus: 0.9,
        energy: 0.85
      },
      predictions: {
        nextPosition: { x: 130, y: 115, z: 0 },
        confidence: 0.95,
        riskLevel: 0.1,
        recommendedAction: 'continue_monitoring'
      }
    },
    // ... autres membres avec données similaires enrichies
  ],
  network: {
    totalNodes: 12,
    activeConnections: 8,
    bandwidth: 85,
    latency: 12,
    packetLoss: 0.02,
    uptime: 99.8
  },
  threats: [
    {
      id: '1',
      type: 'signal_weak',
      severity: 'medium',
      memberId: '3',
      description: 'Signal RSSI faible détecté',
      timestamp: new Date(),
      resolved: false
    },
    {
      id: '2',
      type: 'battery_low',
      severity: 'high',
      memberId: '4',
      description: 'Batterie critique',
      timestamp: new Date(Date.now() - 300000),
      resolved: false
    }
  ],
  analytics: {
    totalEvents: 1247,
    criticalEvents: 3,
    responseTime: 2.3,
    efficiency: 94.2,
    predictions: {
      nextHour: {
        signalIssues: 2,
        batteryAlerts: 1,
        zoneChanges: 5
      }
    }
  }
};

export default function HolographicDashboard({ navigation, user, onLogout }) {
  const theme = useTheme();
  const dynamicStyles = createDynamicStyles(theme);
  
  // États pour l'interface holographique
  const [selectedView, setSelectedView] = useState('overview');
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [scale, setScale] = useState(1);
  const [selectedMember, setSelectedMember] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  
  // Valeurs animées
  const animatedValues = useRef(createAnimatedValues()).current;
  
  // Références pour les animations 3D
  const dashboardRotation = useRef(new Animated.Value(0)).current;
  const memberRotation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Démarrer les animations holographiques
    AdvancedAnimations.createRotation3D(
      { x: dashboardRotation, y: memberRotation },
      8000
    );
    AdvancedAnimations.createHologram(animatedValues.hologram);
    AdvancedAnimations.createNeon(animatedValues.neon);
    AdvancedAnimations.createWave(animatedValues.wave);
    
    // Mise à jour du temps
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Simulation de données en temps réel
    const updateTimer = setInterval(() => {
      // Mettre à jour les positions et données
      HOLOGRAPHIC_DATA.members.forEach(member => {
        // Simuler le mouvement
        member.position.x += (Math.random() - 0.5) * 5;
        member.position.y += (Math.random() - 0.5) * 5;
        
        // Mettre à jour la trajectoire
        member.trajectory.push({
          x: member.position.x,
          y: member.position.y,
          z: member.position.z,
          time: Date.now()
        });
        
        // Garder seulement les 10 derniers points
        if (member.trajectory.length > 10) {
          member.trajectory.shift();
        }
        
        // Mettre à jour les biométries
        member.biometrics.heartRate = Math.floor(60 + Math.random() * 40);
        member.biometrics.stress = Math.random() * 0.5;
        member.biometrics.focus = 0.5 + Math.random() * 0.5;
        
        // Mettre à jour les prédictions
        member.predictions.nextPosition = {
          x: member.position.x + (Math.random() - 0.5) * 20,
          y: member.position.y + (Math.random() - 0.5) * 20,
          z: member.position.z
        };
        member.predictions.confidence = 0.7 + Math.random() * 0.3;
      });
    }, 2000);

    return () => {
      clearInterval(timer);
      clearInterval(updateTimer);
    };
  }, []);

  // Gestes pour l'interaction 3D
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        setRotation({
          x: rotation.x + dy * 0.5,
          y: rotation.y + dx * 0.5,
          z: rotation.z
        });
      },
      onPanResponderRelease: () => {
        // Animation de retour à la position initiale
        Animated.spring(dashboardRotation, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  const handleRefresh = () => {
    setRefreshing(true);
    AdvancedAnimations.createGlitch(animatedValues.glitch);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleMemberPress = (member) => {
    setSelectedMember(member);
    setSelectedView('member_detail');
    AdvancedAnimations.createPulse(pulseAnimation, 1.2, 500);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const renderHolographicGrid = () => (
    <Animated.View style={[styles.holographicGrid, { opacity: animatedValues.hologram }]}>
      {/* Lignes de grille holographique */}
      {Array.from({ length: 10 }, (_, i) => (
        <Animated.View
          key={`h-${i}`}
          style={[
            styles.gridLineHorizontal,
            {
              top: `${i * 10}%`,
              opacity: animatedValues.wave.interpolate({
                inputRange: [0, 1],
                outputRange: [0.1, 0.3],
              })
            }
          ]}
        />
      ))}
      {Array.from({ length: 10 }, (_, i) => (
        <Animated.View
          key={`v-${i}`}
          style={[
            styles.gridLineVertical,
            {
              left: `${i * 10}%`,
              opacity: animatedValues.wave.interpolate({
                inputRange: [0, 1],
                outputRange: [0.1, 0.3],
              })
            }
          ]}
        />
      ))}
    </Animated.View>
  );

  const renderOverview = () => (
    <View style={styles.overviewContainer}>
      {/* Statistiques principales en 3D */}
      <View style={styles.statsGrid}>
        <Animated.View
          style={[
            styles.holoCard,
            {
              transform: [
                { rotateX: rotation.x },
                { rotateY: rotation.y },
                { scale: scale }
              ]
            }
          ]}
        >
          <Text style={[styles.statValue, { color: theme.colors.success }]}>
            {HOLOGRAPHIC_DATA.members.filter(m => m.status === 'online').length}
          </Text>
          <Text style={styles.statLabel}>Actifs</Text>
          <Ionicons name="wifi" size={24} color={theme.colors.success} />
        </Animated.View>

        <Animated.View
          style={[
            styles.holoCard,
            {
              transform: [
                { rotateX: rotation.x },
                { rotateY: rotation.y },
                { scale: scale }
              ]
            }
          ]}
        >
          <Text style={[styles.statValue, { color: theme.colors.warning }]}>
            {HOLOGRAPHIC_DATA.analytics.criticalEvents}
          </Text>
          <Text style={styles.statLabel}>Alertes</Text>
          <Ionicons name="warning" size={24} color={theme.colors.warning} />
        </Animated.View>

        <Animated.View
          style={[
            styles.holoCard,
            {
              transform: [
                { rotateX: rotation.x },
                { rotateY: rotation.y },
                { scale: scale }
              ]
            }
          ]}
        >
          <Text style={[styles.statValue, { color: theme.colors.info }]}>
            {HOLOGRAPHIC_DATA.analytics.efficiency}%
          </Text>
          <Text style={styles.statLabel}>Efficacité</Text>
          <Ionicons name="analytics" size={24} color={theme.colors.info} />
        </Animated.View>

        <Animated.View
          style={[
            styles.holoCard,
            {
              transform: [
                { rotateX: rotation.x },
                { rotateY: rotation.y },
                { scale: scale }
              ]
            }
          ]}
        >
          <Text style={[styles.statValue, { color: theme.colors.neon }]}>
            {HOLOGRAPHIC_DATA.network.bandwidth}%
          </Text>
          <Text style={styles.statLabel}>Réseau</Text>
          <Ionicons name="network" size={24} color={theme.colors.neon} />
        </Animated.View>
      </View>

      {/* Visualisation 3D des membres */}
      <View style={styles.members3DContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.neon }]}>
          🌐 Positionnement 3D
        </Text>
        <View style={styles.threeDView} {...panResponder.panHandlers}>
          {HOLOGRAPHIC_DATA.members.map((member, index) => (
            <Animated.View
              key={member.id}
              style={[
                styles.member3DNode,
                {
                  left: `${member.position.x}%`,
                  top: `${member.position.y}%`,
                  transform: [
                    { rotateX: rotation.x },
                    { rotateY: rotation.y },
                    { scale: scale * (1 + member.biometrics.focus * 0.2) }
                  ]
                }
              ]}
            >
              <Image source={{ uri: member.avatar }} style={styles.member3DAvatar} />
              <View style={[
                styles.statusRing,
                { borderColor: getStatusColors(member.status, theme).border }
              ]} />
              <Text style={styles.member3DName}>{member.name}</Text>
              <Text style={styles.member3DStatus}>{member.activity}</Text>
            </Animated.View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderMemberDetail = () => {
    if (!selectedMember) return null;

    return (
      <View style={styles.memberDetailContainer}>
        <View style={styles.memberDetailHeader}>
          <Image source={{ uri: selectedMember.avatar }} style={styles.detailAvatar} />
          <View style={styles.detailInfo}>
            <Text style={[styles.detailName, { color: theme.colors.neon }]}>
              {selectedMember.name}
            </Text>
            <Text style={styles.detailRole}>{selectedMember.role}</Text>
            <Text style={styles.detailZone}>{selectedMember.zone}</Text>
          </View>
        </View>

        {/* Biométries */}
        <View style={styles.biometricsContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.neon }]}>
            🧠 Biométries
          </Text>
          <View style={styles.biometricsGrid}>
            <View style={styles.biometricItem}>
              <Ionicons name="heart" size={20} color={theme.colors.error} />
              <Text style={styles.biometricValue}>{selectedMember.biometrics.heartRate}</Text>
              <Text style={styles.biometricLabel}>BPM</Text>
            </View>
            <View style={styles.biometricItem}>
              <Ionicons name="pulse" size={20} color={theme.colors.warning} />
              <Text style={styles.biometricValue}>
                {Math.round(selectedMember.biometrics.stress * 100)}%
              </Text>
              <Text style={styles.biometricLabel}>Stress</Text>
            </View>
            <View style={styles.biometricItem}>
              <Ionicons name="eye" size={20} color={theme.colors.success} />
              <Text style={styles.biometricValue}>
                {Math.round(selectedMember.biometrics.focus * 100)}%
              </Text>
              <Text style={styles.biometricLabel}>Focus</Text>
            </View>
            <View style={styles.biometricItem}>
              <Ionicons name="battery-charging" size={20} color={theme.colors.info} />
              <Text style={styles.biometricValue}>
                {Math.round(selectedMember.biometrics.energy * 100)}%
              </Text>
              <Text style={styles.biometricLabel}>Energy</Text>
            </View>
          </View>
        </View>

        {/* Trajectoire prédite */}
        <View style={styles.trajectoryContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.neon }]}>
            🎯 Trajectoire Prédite
          </Text>
          <View style={styles.trajectoryView}>
            <Text style={styles.predictionText}>
              Position suivante: ({Math.round(selectedMember.predictions.nextPosition.x)}, 
              {Math.round(selectedMember.predictions.nextPosition.y)})
            </Text>
            <Text style={styles.confidenceText}>
              Confiance: {Math.round(selectedMember.predictions.confidence * 100)}%
            </Text>
            <Text style={styles.riskText}>
              Risque: {Math.round(selectedMember.predictions.riskLevel * 100)}%
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={dynamicStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.background.primary[0]} />
      
      {/* Background holographique */}
      <LinearGradient
        colors={theme.background.primary}
        style={dynamicStyles.backgroundGradient}
        start={theme.background.gradient.start}
        end={theme.background.gradient.end}
      />

      {/* Grille holographique */}
      {renderHolographicGrid()}

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.neon }]}>
          🌐 Tableau de Bord Holographique
        </Text>
        <Text style={styles.time}>{formatTime(currentTime)}</Text>
      </View>

      {/* Contrôles de vue */}
      <View style={styles.viewControls}>
        {['overview', 'member_detail', 'network', 'analytics'].map(view => (
          <TouchableOpacity
            key={view}
            style={[
              styles.viewButton,
              selectedView === view && styles.activeViewButton,
              { backgroundColor: selectedView === view ? theme.colors.primary : 'rgba(255, 255, 255, 0.1)' }
            ]}
            onPress={() => setSelectedView(view)}
          >
            <Text style={[
              styles.viewButtonText,
              { color: selectedView === view ? 'white' : theme.colors.neon }
            ]}>
              {view === 'overview' && '🌐 Vue'}
              {view === 'member_detail' && '👤 Membre'}
              {view === 'network' && '📡 Réseau'}
              {view === 'analytics' && '📊 Analytics'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Contenu principal */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {selectedView === 'overview' && renderOverview()}
        {selectedView === 'member_detail' && renderMemberDetail()}
      </ScrollView>

      {/* Contrôles 3D */}
      <View style={styles.controls3D}>
        <TouchableOpacity
          style={[styles.control3DButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => setScale(Math.min(scale + 0.1, 2))}
        >
          <Ionicons name="add" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.control3DButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => setScale(Math.max(scale - 0.1, 0.5))}
        >
          <Ionicons name="remove" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.control3DButton, { backgroundColor: theme.colors.info }]}
          onPress={() => setRotation({ x: 0, y: 0, z: 0 })}
        >
          <Ionicons name="refresh" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  holographicGrid: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  gridLineHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0, 255, 255, 0.2)',
  },
  gridLineVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(0, 255, 255, 0.2)',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  time: {
    fontSize: 16,
    color: '#94a3b8',
  },
  viewControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  viewButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeViewButton: {
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  overviewContainer: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 15,
  },
  holoCard: {
    width: '48%',
    backgroundColor: 'rgba(0, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.3)',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  members3DContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  threeDView: {
    height: 300,
    backgroundColor: 'rgba(0, 255, 255, 0.02)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.2)',
    position: 'relative',
    overflow: 'hidden',
  },
  member3DNode: {
    position: 'absolute',
    alignItems: 'center',
  },
  member3DAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#00ffff',
  },
  statusRing: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 30,
    borderWidth: 2,
  },
  member3DName: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 5,
  },
  member3DStatus: {
    color: '#94a3b8',
    fontSize: 8,
  },
  memberDetailContainer: {
    flex: 1,
  },
  memberDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  detailAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#00ffff',
    marginRight: 20,
  },
  detailInfo: {
    flex: 1,
  },
  detailName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detailRole: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 3,
  },
  detailZone: {
    fontSize: 14,
    color: '#64748b',
  },
  biometricsContainer: {
    marginBottom: 30,
  },
  biometricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 15,
  },
  biometricItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.2)',
  },
  biometricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 5,
  },
  biometricLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  trajectoryContainer: {
    marginBottom: 30,
  },
  trajectoryView: {
    backgroundColor: 'rgba(0, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.2)',
  },
  predictionText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  confidenceText: {
    color: '#10b981',
    fontSize: 14,
    marginBottom: 10,
  },
  riskText: {
    color: '#f59e0b',
    fontSize: 14,
  },
  controls3D: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    flexDirection: 'row',
    gap: 10,
  },
  control3DButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
});

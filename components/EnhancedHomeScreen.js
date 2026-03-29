import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  RefreshControl,
  StatusBar,
  Dimensions,
  Image,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AdvancedAnimations, createAnimatedValues, createParticles } from '../utils/advanced-animations';
import { themeManager, useTheme, createDynamicStyles, getStatusColors } from '../utils/advanced-themes';

const { width, height } = Dimensions.get('window');

// Données des membres avec informations enrichies
const ENHANCED_MEMBERS = [
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
    skills: ['Leadership', 'Strategy', 'Communication'],
    achievements: ['Expert Leader', 'Crisis Manager'],
  },
  {
    id: '2',
    name: 'Sarah Martin',
    role: 'Agent de Sécurité',
    avatar: 'https://picsum.photos/seed/sarah/200/200.jpg',
    status: 'online',
    rssi: -72,
    battery: 60,
    zone: 'Zone B - Périmètre',
    score: 85,
    mood: 'alert',
    activity: 'patrolling',
    lastUpdate: new Date(),
    skills: ['Surveillance', 'Detection', 'Analysis'],
    achievements: ['Sharp Eye', 'Quick Response'],
  },
  {
    id: '3',
    name: 'Thomas Bernard',
    role: 'Technicien RSSI',
    avatar: 'https://picsum.photos/seed/thomas/200/200.jpg',
    status: 'warning',
    rssi: -85,
    battery: 30,
    zone: 'Zone C - Technique',
    score: 72,
    mood: 'stressed',
    activity: 'maintenance',
    lastUpdate: new Date(),
    sos: true,
    skills: ['Technical', 'Problem Solving', 'Innovation'],
    achievements: ['Tech Wizard', 'Problem Solver'],
  },
  {
    id: '4',
    name: 'Marie Laurent',
    role: 'Médical d\'Urgence',
    avatar: 'https://picsum.photos/seed/marie/200/200.jpg',
    status: 'offline',
    rssi: -95,
    battery: 15,
    zone: 'Zone D - Médical',
    score: 88,
    mood: 'calm',
    activity: 'standby',
    lastUpdate: new Date(Date.now() - 900000),
    skills: ['Medical', 'Emergency', 'Care'],
    achievements: ['Life Saver', 'Cool Under Pressure'],
  },
  {
    id: '5',
    name: 'Jean-Pierre Rousseau',
    role: 'Agent Logistique',
    avatar: 'https://picsum.photos/seed/jeanpierre/200/200.jpg',
    status: 'online',
    rssi: -68,
    battery: 75,
    zone: 'Zone E - Logistique',
    score: 91,
    mood: 'organized',
    activity: 'coordinating',
    lastUpdate: new Date(),
    skills: ['Logistics', 'Planning', 'Coordination'],
    achievements: ['Master Planner', 'Efficiency Expert'],
  },
  {
    id: '6',
    name: 'Isabelle Moreau',
    role: 'Communications',
    avatar: 'https://picsum.photos/seed/isabelle/200/200.jpg',
    status: 'online',
    rssi: -58,
    battery: 88,
    zone: 'Zone F - Communications',
    score: 94,
    mood: 'connected',
    activity: 'broadcasting',
    lastUpdate: new Date(),
    skills: ['Communication', 'Media', 'Public Relations'],
    achievements: ['Voice of Authority', 'Clear Message'],
  }
];

export default function EnhancedHomeScreen({ navigation, user, onLogout }) {
  const theme = useTheme();
  const dynamicStyles = createDynamicStyles(theme);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [currentTheme, setCurrentTheme] = useState('futuristic');
  const [particles, setParticles] = useState([]);
  
  // Valeurs animées
  const animatedValues = useRef(createAnimatedValues()).current;
  const particlesArray = useRef(createParticles(15)).current;

  useEffect(() => {
    // Démarrer toutes les animations
    AdvancedAnimations.createPulse(animatedValues.pulse);
    AdvancedAnimations.createShimmer(animatedValues.shimmer);
    AdvancedAnimations.createWave(animatedValues.wave);
    AdvancedAnimations.createNeon(animatedValues.neon);
    AdvancedAnimations.createHologram(animatedValues.hologram);
    
    // Animer les particules
    const particleAnimations = AdvancedAnimations.createParticles(particlesArray);
    particleAnimations.forEach(anim => anim.start());

    // Mise à jour du temps
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Simulation de mises à jour dynamiques
    const updateTimer = setInterval(() => {
      // Mettre à jour les membres avec des données réalistes
      ENHANCED_MEMBERS.forEach(member => {
        member.rssi = Math.max(-120, Math.min(-30, member.rssi + (Math.random() - 0.5) * 10));
        member.battery = Math.max(0, Math.min(100, member.battery - Math.random() * 0.5));
        member.lastUpdate = new Date();
        
        // Changer l'humeur et l'activité occasionnellement
        if (Math.random() < 0.1) {
          const moods = ['focused', 'alert', 'calm', 'stressed', 'organized', 'connected'];
          const activities = ['monitoring', 'patrolling', 'maintenance', 'standby', 'coordinating', 'broadcasting'];
          member.mood = moods[Math.floor(Math.random() * moods.length)];
          member.activity = activities[Math.floor(Math.random() * activities.length)];
        }
      });
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(updateTimer);
    };
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    // Animation de refresh
    AdvancedAnimations.createGlitch(animatedValues.glitch);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleThemeChange = () => {
    const themes = ['futuristic', 'emergency', 'night', 'pro', 'holographic', 'matrix'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setCurrentTheme(nextTheme);
    themeManager.setTheme(nextTheme);
  };

  const handleMemberPress = (member) => {
    setSelectedMember(member);
    // Animation de sélection
    AdvancedAnimations.createGlitch(animatedValues.glitch);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getMoodEmoji = (mood) => {
    const moods = {
      focused: '🎯',
      alert: '⚠️',
      calm: '😌',
      stressed: '😰',
      organized: '📋',
      connected: '🔗'
    };
    return moods[mood] || '😊';
  };

  const getActivityIcon = (activity) => {
    const activities = {
      monitoring: '👁️',
      patrolling: '🚶',
      maintenance: '🔧',
      standby: '⏸️',
      coordinating: '🔄',
      broadcasting: '📢'
    };
    return activities[activity] || '📍';
  };

  const renderEnhancedStats = () => {
    const onlineCount = ENHANCED_MEMBERS.filter(m => m.status === 'online').length;
    const avgBattery = Math.round(ENHANCED_MEMBERS.reduce((sum, m) => sum + m.battery, 0) / ENHANCED_MEMBERS.length);
    const avgScore = Math.round(ENHANCED_MEMBERS.reduce((sum, m) => sum + m.score, 0) / ENHANCED_MEMBERS.length);
    const emergencyCount = ENHANCED_MEMBERS.filter(m => m.sos).length;

    return (
      <Animated.View style={[styles.statsContainer, { opacity: animatedValues.neon }]}>
        <Animated.View style={[styles.statCard, { transform: [{ scale: animatedValues.pulse }] }]}>
          <Animated.Text style={[styles.statValue, { color: theme.colors.success }]}>
            {onlineCount}
          </Animated.Text>
          <Text style={styles.statLabel}>Actifs</Text>
          <Ionicons name="wifi" size={20} color={theme.colors.success} />
        </Animated.View>

        <Animated.View style={[styles.statCard, { transform: [{ scale: animatedValues.pulse }] }]}>
          <Animated.Text style={[styles.statValue, { color: avgBattery > 30 ? theme.colors.success : theme.colors.warning }]}>
            {avgBattery}%
          </Animated.Text>
          <Text style={styles.statLabel}>Batterie</Text>
          <Ionicons name="battery-half" size={20} color={avgBattery > 30 ? theme.colors.success : theme.colors.warning} />
        </Animated.View>

        <Animated.View style={[styles.statCard, { transform: [{ scale: animatedValues.pulse }] }]}>
          <Animated.Text style={[styles.statValue, { color: theme.colors.info }]}>
            {avgScore}
          </Animated.Text>
          <Text style={styles.statLabel}>Score</Text>
          <Ionicons name="analytics" size={20} color={theme.colors.info} />
        </Animated.View>

        <Animated.View style={[styles.statCard, { transform: [{ scale: animatedValues.pulse }] }]}>
          <Animated.Text style={[styles.statValue, { color: emergencyCount > 0 ? theme.colors.error : theme.colors.success }]}>
            {emergencyCount}
          </Animated.Text>
          <Text style={styles.statLabel}>Alertes</Text>
          <Ionicons name="warning" size={20} color={emergencyCount > 0 ? theme.colors.error : theme.colors.success} />
        </Animated.View>
      </Animated.View>
    );
  };

  const renderEnhancedMember = (member, index) => {
    const statusColors = getStatusColors(member.status, theme);
    const delay = index * 100;

    return (
      <Animated.View
        key={member.id}
        style={[
          styles.memberCard,
          dynamicStyles.glassCard,
          {
            opacity: animatedValues.shimmer,
            transform: [
              { translateY: animatedValues.wave },
              { scale: animatedValues.pulse }
            ]
          }
        ]}
      >
        {/* Particules de fond */}
        {particlesArray.slice(0, 3).map((particle, i) => (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                opacity: particle.opacity,
                transform: [
                  { translateX: particle.translateX },
                  { translateY: particle.translateY },
                  { scale: particle.scale }
                ]
              }
            ]}
          />
        ))}

        {/* Header du membre */}
        <View style={styles.memberHeader}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: member.avatar }} style={styles.avatar} />
            <Animated.View
              style={[
                styles.statusIndicator,
                { backgroundColor: statusColors.border },
                { transform: [{ scale: animatedValues.pulse }] }
              ]}
            />
            <Text style={styles.moodEmoji}>{getMoodEmoji(member.mood)}</Text>
          </View>

          <View style={styles.memberInfo}>
            <Text style={[styles.memberName, dynamicStyles.neonText]}>{member.name}</Text>
            <Text style={styles.memberRole}>{member.role}</Text>
            <View style={styles.memberMeta}>
              <Text style={styles.memberActivity}>
                {getActivityIcon(member.activity)} {member.activity}
              </Text>
              <Text style={styles.memberZone}>{member.zone}</Text>
            </View>
          </View>

          <View style={styles.memberScore}>
            <Animated.Text style={[styles.scoreValue, { color: theme.colors.neon }]}>
              {member.score}
            </Animated.Text>
            <Text style={styles.scoreLabel}>Score</Text>
          </View>
        </View>

        {/* Barres de progression avancées */}
        <View style={styles.progressContainer}>
          <View style={styles.progressItem}>
            <View style={styles.progressHeader}>
              <Ionicons name="wifi" size={16} color={theme.colors.info} />
              <Text style={styles.progressLabel}>RSSI</Text>
              <Text style={styles.progressValue}>{member.rssi} dBm</Text>
            </View>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.max(0, Math.min(100, (member.rssi + 120) / 90 * 100))}%`,
                    backgroundColor: statusColors.background,
                  }
                ]}
              />
            </View>
          </View>

          <View style={styles.progressItem}>
            <View style={styles.progressHeader}>
              <Ionicons name="battery-half" size={16} color={theme.colors.warning} />
              <Text style={styles.progressLabel}>Batterie</Text>
              <Text style={styles.progressValue}>{Math.round(member.battery)}%</Text>
            </View>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: `${member.battery}%`,
                    backgroundColor: member.battery > 30 ? theme.colors.success : theme.colors.warning,
                  }
                ]}
              />
            </View>
          </View>
        </View>

        {/* Actions rapides */}
        <View style={styles.memberActions}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="call" size={16} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.info }]}>
            <Ionicons name="chatbubble" size={16} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.success }]}>
            <Ionicons name="location" size={16} color="white" />
          </TouchableOpacity>
          {member.sos && (
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.error }]}>
              <Ionicons name="warning" size={16} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={dynamicStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.background.primary[0]} />
      
      {/* Background animé */}
      <LinearGradient
        colors={theme.background.primary}
        style={dynamicStyles.backgroundGradient}
        start={theme.background.gradient.start}
        end={theme.background.gradient.end}
      />

      {/* Effet de scanlines pour certains thèmes */}
      {currentTheme === 'holographic' && (
        <Animated.View style={[styles.scanlines, { opacity: animatedValues.hologram }]} />
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header avec thème dynamique */}
        <Animated.View style={[styles.header, { opacity: animatedValues.neon }]}>
          <View style={styles.headerTop}>
            <Text style={[styles.greeting, dynamicStyles.neonText]}>
              Bonjour, {user?.name || 'Administrateur'}
            </Text>
            <TouchableOpacity onPress={handleThemeChange} style={styles.themeButton}>
              <Ionicons name="color-palette" size={24} color={theme.colors.neon} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.time}>{formatTime(currentTime)}</Text>
          <Text style={styles.themeInfo}>Thème: {currentTheme}</Text>
        </Animated.View>

        {/* Statistiques améliorées */}
        {renderEnhancedStats()}

        {/* Membres avec design avancé */}
        <View style={styles.membersSection}>
          <Text style={[styles.sectionTitle, dynamicStyles.neonText]}>
            🚀 Équipe Avancée
          </Text>
          {ENHANCED_MEMBERS.map((member, index) => renderEnhancedMember(member, index))}
        </View>

        {/* Contrôles flottants */}
        <View style={styles.floatingControls}>
          <TouchableOpacity
            style={[styles.floatingButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => navigation.navigate('Dashboard')}
          >
            <Ionicons name="analytics" size={24} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.floatingButton, { backgroundColor: theme.colors.error }]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  scanlines: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 255, 255, 0.03)',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
  },
  themeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  time: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 5,
  },
  themeInfo: {
    fontSize: 14,
    color: '#64748b',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 15,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  membersSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  memberCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    position: 'relative',
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#00ffff',
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: 'rgba(59, 130, 246, 0.5)',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#0f172a',
  },
  moodEmoji: {
    position: 'absolute',
    top: -5,
    right: -5,
    fontSize: 16,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 3,
  },
  memberRole: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 5,
  },
  memberMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  memberActivity: {
    fontSize: 12,
    color: '#64748b',
  },
  memberZone: {
    fontSize: 12,
    color: '#64748b',
  },
  memberScore: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  scoreLabel: {
    fontSize: 10,
    color: '#94a3b8',
  },
  progressContainer: {
    gap: 12,
    marginBottom: 15,
  },
  progressItem: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressLabel: {
    color: '#64748b',
    fontSize: 12,
    flex: 1,
  },
  progressValue: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  memberActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingControls: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    gap: 15,
  },
  floatingButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
});

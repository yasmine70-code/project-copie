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
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Données participants élégantes
const ELEGANT_PARTICIPANTS = [
  {
    id: '1',
    name: 'Alexandre Dubois',
    role: 'Directeur des Opérations',
    department: 'Management',
    avatar: 'https://picsum.photos/seed/alexandre-elegant/400/400.jpg',
    status: 'online',
    rssi: -45.00,
    battery: 88,
    zone: 'Zone A - Administration',
    phone: '+33612345678',
    age: 35,
    sos: false,
    level: 'executive',
    health: {
      heartRate: 72,
      stress: 15,
      focus: 92,
      energy: 85,
      mood: 'focused',
      activity: 'management',
      performance: 95
    },
    activities: {
      current: 'Réunion stratégique',
      duration: '45 min',
      location: 'Salle de conférence',
      next_meeting: '15:30 - Review Q4',
      projects: 12
    },
    performance: {
      efficiency: 94,
      leadership: 96,
      communication: 88,
      innovation: 85,
      rating: 4.8
    },
    contact: {
      email: 'a.dubois@company.com',
      department: 'Direction',
      reports_to: 'CEO'
    }
  },
  {
    id: '2',
    name: 'Sophie Martin',
    role: 'Responsable Technique',
    department: 'IT Infrastructure',
    avatar: 'https://picsum.photos/seed/sophie-elegant/400/400.jpg',
    status: 'online',
    rssi: -48.00,
    battery: 76,
    zone: 'Zone B - Data Center',
    phone: '+33623456789',
    age: 28,
    sos: false,
    level: 'senior',
    health: {
      heartRate: 68,
      stress: 25,
      focus: 88,
      energy: 78,
      mood: 'productive',
      activity: 'system_monitoring',
      performance: 87
    },
    activities: {
      current: 'Maintenance système',
      duration: '2h',
      location: 'Serveur principal',
      next_meeting: '16:00 - Team sync',
      projects: 8
    },
    performance: {
      efficiency: 91,
      technical_skills: 95,
      problem_solving: 89,
      teamwork: 85,
      rating: 4.6
    },
    contact: {
      email: 's.martin@company.com',
      department: 'IT',
      reports_to: 'CTO'
    }
  },
  {
    id: '3',
    name: 'Thomas Bernard',
    role: 'Chef de Projet',
    department: 'Project Management',
    avatar: 'https://picsum.photos/seed/thomas-elegant/400/400.jpg',
    status: 'warning',
    rssi: -75.00,
    battery: 32,
    zone: 'Zone C - Project Office',
    phone: '+33634567890',
    age: 32,
    sos: true,
    level: 'manager',
    health: {
      heartRate: 95,
      stress: 45,
      focus: 65,
      energy: 35,
      mood: 'stressed',
      activity: 'crisis_management',
      performance: 65
    },
    activities: {
      current: 'Gestion de crise',
      duration: '1h30',
      location: 'Client site',
      next_meeting: 'URGENT - Board meeting',
      projects: 15
    },
    performance: {
      efficiency: 78,
      project_management: 92,
      client_relations: 85,
      risk_management: 80,
      rating: 4.2
    },
    contact: {
      email: 't.bernard@company.com',
      department: 'Projects',
      reports_to: 'COO'
    }
  },
  {
    id: '4',
    name: 'Marie Laurent',
    role: 'Analyste Financière',
    department: 'Finance',
    avatar: 'https://picsum.photos/seed/marie-elegant/400/400.jpg',
    status: 'offline',
    rssi: -88.00,
    battery: 15,
    zone: 'Zone D - Finance',
    phone: '+33645678901',
    age: 30,
    sos: false,
    level: 'analyst',
    health: {
      heartRate: 65,
      stress: 20,
      focus: 85,
      energy: 40,
      mood: 'analytical',
      activity: 'report_preparation',
      performance: 82
    },
    activities: {
      current: 'Analyse Q3',
      duration: '3h',
      location: 'Bureau personnel',
      next_meeting: 'Demain 9:00 - Finance review',
      projects: 6
    },
    performance: {
      efficiency: 88,
      analytical_skills: 94,
      attention_detail: 92,
      financial_modeling: 86,
      rating: 4.7
    },
    contact: {
      email: 'm.laurent@company.com',
      department: 'Finance',
      reports_to: 'CFO'
    }
  },
  {
    id: '5',
    name: 'Jean-Pierre Rousseau',
    role: 'Développeur Senior',
    department: 'Engineering',
    avatar: 'https://picsum.photos/seed/jeanpierre-elegant/400/400.jpg',
    status: 'online',
    rssi: -52.00,
    battery: 82,
    zone: 'Zone E - Dev Lab',
    phone: '+33656789012',
    age: 27,
    sos: false,
    level: 'senior',
    health: {
      heartRate: 70,
      stress: 22,
      focus: 90,
      energy: 88,
      mood: 'creative',
      activity: 'coding',
      performance: 91
    },
    activities: {
      current: 'Développement API',
      duration: '4h',
      location: 'Poste de développement',
      next_meeting: '17:00 - Code review',
      projects: 10
    },
    performance: {
      efficiency: 89,
      coding_skills: 95,
      problem_solving: 88,
      collaboration: 85,
      rating: 4.5
    },
    contact: {
      email: 'jp.rousseau@company.com',
      department: 'Engineering',
      reports_to: 'Tech Lead'
    }
  },
  {
    id: '6',
    name: 'Isabelle Moreau',
    role: 'Responsable Marketing',
    department: 'Marketing',
    avatar: 'https://picsum.photos/seed/isabelle-elegant/400/400.jpg',
    status: 'online',
    rssi: -58.00,
    battery: 90,
    zone: 'Zone F - Marketing Hub',
    phone: '+33667890123',
    age: 31,
    sos: false,
    level: 'manager',
    health: {
      heartRate: 73,
      stress: 18,
      focus: 87,
      energy: 92,
      mood: 'enthusiastic',
      activity: 'campaign_planning',
      performance: 93
    },
    activities: {
      current: 'Planification campagne',
      duration: '2h30',
      location: 'Creative studio',
      next_meeting: '14:00 - Campaign presentation',
      projects: 9
    },
    performance: {
      efficiency: 92,
      creativity: 96,
      communication: 94,
      strategic_thinking: 88,
      rating: 4.8
    },
    contact: {
      email: 'i.moreau@company.com',
      department: 'Marketing',
      reports_to: 'CMO'
    }
  }
];

// Écran Login élégant
function LoginScreen({ onLoginSuccess }) {
  const [email, setEmail] = useState('admin@company.com');
  const [password, setPassword] = useState('admin2024');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Attention', 'Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      if (email === 'admin@company.com' && password === 'admin2024') {
        onLoginSuccess({ 
          name: 'Administrateur', 
          email: email,
          role: 'System Administrator',
          level: 'admin',
          avatar: 'https://picsum.photos/seed/admin-elegant/400/400.jpg'
        });
      } else {
        Alert.alert('Erreur d\'authentification', 'Email ou mot de passe incorrect');
      }
      setIsLoading(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1f2e" />
      
      {/* Background élégant */}
      <LinearGradient
        colors={['#1a1f2e', '#2d3748', '#4a5568', '#2d3748', '#1a1f2e']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <ScrollView contentContainerStyle={styles.loginScrollContainer}>
        <Animated.View 
          style={[
            styles.loginContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Header élégant */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['#667eea', '#764ba2', '#f093fb']}
                style={styles.logoGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.logo}>◆</Text>
              </LinearGradient>
            </View>
            <Text style={styles.title}>Enterprise Portal</Text>
            <Text style={styles.subtitle}>Système de Gestion d'Entreprise</Text>
            <View style={styles.infoBadges}>
              <View style={styles.infoBadge}>
                <Text style={styles.infoBadgeText}>Sécurisé</Text>
              </View>
              <View style={styles.infoBadge}>
                <Text style={styles.infoBadgeText}>Professionnel</Text>
              </View>
            </View>
          </View>

          {/* Formulaire élégant */}
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Connexion Sécurisée</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email professionnel</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail" size={20} color="#9ca3af" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="admin@company.com"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading}
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mot de passe</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} color="#9ca3af" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••••"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off" : "eye"} 
                    size={20} 
                    color="#9ca3af" 
                  />
                </TouchableOpacity>
              </View>
            </View>
            
            <TouchableOpacity 
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={isLoading ? ['#6b7280', '#4b5563'] : ['#667eea', '#764ba2']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.loginInfo}>
              <Text style={styles.infoText}>{ELEGANT_PARTICIPANTS.length} employés actifs</Text>
              <Text style={styles.infoText}>Système sécurisé 256-bit</Text>
              <Text style={styles.infoText}>Accès temps réel</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// Écran Home élégant
function HomeScreen({ user, onLogout }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [participants, setParticipants] = useState(ELEGANT_PARTICIPANTS);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setParticipants(prevParticipants => 
        prevParticipants.map(participant => ({
          ...participant,
          rssi: Math.max(-120, Math.min(-30, participant.rssi + (Math.random() - 0.5) * 5)),
          battery: Math.max(0, Math.min(100, participant.battery - Math.random() * 2)),
          health: {
            ...participant.health,
            heartRate: Math.floor(60 + Math.random() * 40),
            stress: Math.random() * 0.5,
            energy: Math.max(0.1, participant.health.energy - Math.random() * 0.05),
            performance: Math.max(50, Math.min(100, participant.health.performance + (Math.random() - 0.5) * 10))
          }
        }))
      );
      setRefreshing(false);
    }, 2000);
  };

  const getFilteredParticipants = () => {
    switch (selectedFilter) {
      case 'executives':
        return participants.filter(p => p.level === 'executive');
      case 'managers':
        return participants.filter(p => p.level === 'manager');
      case 'seniors':
        return participants.filter(p => p.level === 'senior');
      case 'online':
        return participants.filter(p => p.status === 'online');
      case 'warning':
        return participants.filter(p => p.status === 'warning');
      case 'offline':
        return participants.filter(p => p.status === 'offline');
      case 'alerts':
        return participants.filter(p => p.sos === true);
      default:
        return participants;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'offline': return '#64748b';
      default: return '#64748b';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'executive': return '#dc2626';
      case 'manager': return '#8b5cf6';
      case 'senior': return '#3b82f6';
      case 'analyst': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'executive': return '👔';
      case 'manager': return '💼';
      case 'senior': return '⭐';
      case 'analyst': return '📊';
      default: return '👤';
    }
  };

  const getLevelTitle = (level) => {
    switch (level) {
      case 'executive': return 'Direction';
      case 'manager': return 'Management';
      case 'senior': return 'Expert';
      case 'analyst': return 'Analyste';
      default: return 'Collaborateur';
    }
  };

  const filteredParticipants = getFilteredParticipants();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1f2e" />
      
      {/* Background élégant */}
      <LinearGradient
        colors={['#1a1f2e', '#2d3748', '#4a5568', '#2d3748', '#1a1f2e']}
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
            colors={['#667eea', '#764ba2']}
            tintColor="#667eea"
          />
        }
      >
        {/* Header élégant */}
        <View style={styles.dashboardHeader}>
          <LinearGradient
            colors={['rgba(102, 126, 234, 0.1)', 'rgba(118, 75, 162, 0.1)']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.userInfo}>
              <Image source={{ uri: user?.avatar }} style={styles.userAvatar} />
              <View style={styles.userDetails}>
                <Text style={styles.greeting}>Bonjour, {user?.name || 'Admin'}</Text>
                <Text style={styles.userRole}>{user?.role || 'System Administrator'}</Text>
                <Text style={styles.time}>{currentTime.toLocaleTimeString()}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
              <LinearGradient
                colors={['#ef4444', '#dc2626']}
                style={styles.logoutGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="log-out" size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Statistiques élégantes */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Tableau de Bord</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.statCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.statValue}>{participants.length}</Text>
                <Text style={styles.statLabel}>Total</Text>
                <Ionicons name="people" size={24} color="rgba(255,255,255,0.3)" style={styles.statIcon} />
              </LinearGradient>
            </View>
            
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.statCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.statValue}>{participants.filter(p => p.status === 'online').length}</Text>
                <Text style={styles.statLabel}>Actifs</Text>
                <Ionicons name="checkmark-circle" size={24} color="rgba(255,255,255,0.3)" style={styles.statIcon} />
              </LinearGradient>
            </View>
            
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#f59e0b', '#d97706']}
                style={styles.statCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.statValue}>{participants.filter(p => p.sos === true).length}</Text>
                <Text style={styles.statLabel}>Alertes</Text>
                <Ionicons name="warning" size={24} color="rgba(255,255,255,0.3)" style={styles.statIcon} />
              </LinearGradient>
            </View>
            
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#3b82f6', '#1d4ed8']}
                style={styles.statCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.statValue}>{Math.round(participants.reduce((sum, p) => sum + p.health.performance, 0) / participants.length)}%</Text>
                <Text style={styles.statLabel}>Performance</Text>
                <Ionicons name="trending-up" size={24} color="rgba(255,255,255,0.3)" style={styles.statIcon} />
              </LinearGradient>
            </View>
          </View>
        </View>

        {/* Filtres élégants */}
        <View style={styles.filtersSection}>
          <Text style={styles.sectionTitle}>Filtres</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollContainer}
          >
            {['all', 'executives', 'managers', 'seniors', 'online', 'warning', 'offline', 'alerts'].map((filter) => (
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
                    colors={['#667eea', '#764ba2']}
                    style={styles.filterGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.activeFilterText}>
                      {filter === 'all' && 'Tous'}
                      {filter === 'executives' && 'Direction'}
                      {filter === 'managers' && 'Management'}
                      {filter === 'seniors' && 'Experts'}
                      {filter === 'online' && 'Actifs'}
                      {filter === 'warning' && 'Attention'}
                      {filter === 'offline' && 'Hors ligne'}
                      {filter === 'alerts' && 'Alertes'}
                    </Text>
                  </LinearGradient>
                ) : (
                  <Text style={styles.filterText}>
                    {filter === 'all' && 'Tous'}
                    {filter === 'executives' && 'Direction'}
                    {filter === 'managers' && 'Management'}
                    {filter === 'seniors' && 'Experts'}
                    {filter === 'online' && 'Actifs'}
                    {filter === 'warning' && 'Attention'}
                    {filter === 'offline' && 'Hors ligne'}
                    {filter === 'alerts' && 'Alertes'}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Liste des participants élégants */}
        <View style={styles.participantsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Équipe</Text>
            <Text style={styles.participantCount}>{filteredParticipants.length} membres</Text>
          </View>
          
          {filteredParticipants.map((participant) => (
            <TouchableOpacity
              key={participant.id}
              style={styles.participantCard}
              onPress={() => console.log('Détails participant:', participant.id)}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['rgba(45, 55, 72, 0.95)', 'rgba(26, 32, 44, 0.95)', 'rgba(102, 126, 234, 0.05)']}
                style={styles.participantCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.participantHeader}>
                  <View style={styles.avatarContainer}>
                    <Image source={{ uri: participant.avatar }} style={styles.participantAvatar} />
                    <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(participant.status) }]} />
                    <View style={[styles.levelBadge, { backgroundColor: getLevelColor(participant.level) }]}>
                      <Text style={styles.levelBadgeText}>{getLevelIcon(participant.level)}</Text>
                    </View>
                  </View>
                  <View style={styles.participantInfo}>
                    <Text style={styles.participantName}>{participant.name}</Text>
                    <Text style={styles.participantRole}>{participant.role}</Text>
                    <Text style={styles.participantDepartment}>{participant.department}</Text>
                    <Text style={styles.participantLevel}>{getLevelTitle(participant.level)}</Text>
                    <View style={styles.participantStatus}>
                      <View style={[styles.statusDot, { backgroundColor: getStatusColor(participant.status) }]} />
                      <Text style={[styles.statusText, { color: getStatusColor(participant.status) }]}>
                        {participant.status === 'online' ? 'Actif' : 
                         participant.status === 'warning' ? 'Attention' : 'Hors ligne'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.participantStats}>
                    <Text style={styles.participantRSSI}>{participant.rssi.toFixed(2)} dBm</Text>
                    <View style={styles.batteryContainer}>
                      <Text style={styles.participantBattery}>{participant.battery}%</Text>
                      <View style={[styles.batteryBar, { width: `${participant.battery}%` }]} />
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
                  </View>
                </View>
                
                {/* Santé et Performance */}
                <View style={styles.healthContainer}>
                  <View style={styles.healthItem}>
                    <LinearGradient
                      colors={['#ef4444', '#dc2626']}
                      style={styles.healthIcon}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Ionicons name="heart" size={16} color="white" />
                    </LinearGradient>
                    <Text style={styles.healthValue}>{participant.health.heartRate}</Text>
                    <Text style={styles.healthLabel}>Rythme</Text>
                  </View>
                  <View style={styles.healthItem}>
                    <LinearGradient
                      colors={['#f59e0b', '#d97706']}
                      style={styles.healthIcon}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Ionicons name="battery-charging" size={16} color="white" />
                    </LinearGradient>
                    <Text style={styles.healthValue}>{Math.round(participant.health.energy * 100)}%</Text>
                    <Text style={styles.healthLabel}>Énergie</Text>
                  </View>
                  <View style={styles.healthItem}>
                    <LinearGradient
                      colors={['#3b82f6', '#1d4ed8']}
                      style={styles.healthIcon}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Ionicons name="trending-up" size={16} color="white" />
                    </LinearGradient>
                    <Text style={styles.healthValue}>{Math.round(participant.health.performance)}%</Text>
                    <Text style={styles.healthLabel}>Performance</Text>
                  </View>
                  <View style={styles.healthItem}>
                    <LinearGradient
                      colors={['#10b981', '#059669']}
                      style={styles.healthIcon}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Ionicons name="happy" size={16} color="white" />
                    </LinearGradient>
                    <Text style={styles.healthValue}>{participant.health.mood}</Text>
                    <Text style={styles.healthLabel}>Humeur</Text>
                  </View>
                </View>
                
                {/* Activités */}
                <View style={styles.activitiesContainer}>
                  <Text style={styles.activitiesTitle}>Activité Actuelle</Text>
                  <View style={styles.activitiesInfo}>
                    <Text style={styles.currentActivity}>{participant.activities.current}</Text>
                    <Text style={styles.activityDuration}>⏱️ {participant.activities.duration}</Text>
                    <Text style={styles.activityLocation}>📍 {participant.activities.location}</Text>
                    <Text style={styles.nextMeeting}>👤 {participant.activities.next_meeting}</Text>
                    <Text style={styles.projectCount}>📊 {participant.activities.projects} projets</Text>
                  </View>
                </View>
                
                {/* Performance */}
                <View style={styles.performanceContainer}>
                  <Text style={styles.performanceTitle}>Performance</Text>
                  <View style={styles.performanceInfo}>
                    <Text style={styles.performanceItem}>⚡ Efficacité: {participant.performance.efficiency}%</Text>
                    <Text style={styles.performanceItem}>🎯 Spécialité: {Object.keys(participant.performance).filter(key => key !== 'rating')[0]}</Text>
                    <Text style={styles.performanceItem}>⭐ Évaluation: {participant.performance.rating}/5</Text>
                  </View>
                </View>
                
                {/* Contact */}
                <View style={styles.contactContainer}>
                  <Text style={styles.contactTitle}>Contact</Text>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactItem}>📧 {participant.contact.email}</Text>
                    <Text style={styles.contactItem}>🏢 {participant.contact.department}</Text>
                    <Text style={styles.contactItem}>👤 {participant.contact.reports_to}</Text>
                  </View>
                </View>
                
                {participant.sos && (
                  <TouchableOpacity style={styles.alertButton}>
                    <LinearGradient
                      colors={['#ef4444', '#dc2626', '#b91c1c']}
                      style={styles.alertGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Ionicons name="warning" size={20} color="white" />
                      <Text style={styles.alertText}>Alerte Requise</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

// App principal élégant
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
        <StatusBar barStyle="light-content" backgroundColor="#1a1f2e" />
        <LinearGradient
          colors={['#1a1f2e', '#2d3748', '#4a5568', '#2d3748', '#1a1f2e']}
          style={styles.background}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingLogo}>◆</Text>
          <Text style={styles.loadingText}>Enterprise Portal</Text>
          <Text style={styles.loadingSubtext}>Chargement du système...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1f2e" />
      <LinearGradient
        colors={['#1a1f2e', '#2d3748', '#4a5568', '#2d3748', '#1a1f2e']}
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
    backgroundColor: '#1a1f2e',
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
    color: '#667eea',
  },
  loadingText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textShadowColor: 'rgba(102, 126, 234, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 15,
  },
  loadingSubtext: {
    fontSize: 18,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  
  // Login Styles Élégants
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
    width: 100,
    height: 100,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(102, 126, 234, 0.3)',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logo: {
    fontSize: 50,
    color: '#ffffff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textShadowColor: 'rgba(102, 126, 234, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    marginBottom: 20,
  },
  infoBadges: {
    flexDirection: 'row',
    gap: 10,
  },
  infoBadge: {
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.3)',
  },
  infoBadgeText: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
  },
  
  // Formulaire Élégant
  form: {
    width: '100%',
    maxWidth: 450,
    backgroundColor: 'rgba(45, 55, 72, 0.95)',
    borderRadius: 20,
    padding: 35,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.2)',
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
  inputGroup: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 8,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 32, 44, 0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.2)',
  },
  inputIcon: {
    padding: 15,
  },
  input: {
    flex: 1,
    padding: 15,
    color: '#ffffff',
    fontSize: 16,
    borderRadius: 12,
  },
  eyeIcon: {
    padding: 15,
  },
  loginButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 5,
  },
  loginButtonDisabled: {
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
  loginInfo: {
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  
  // Dashboard Styles Élégants
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
    borderWidth: 2,
    borderColor: 'rgba(102, 126, 234, 0.3)',
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
    color: '#9ca3af',
    marginBottom: 2,
  },
  time: {
    fontSize: 12,
    color: '#6b7280',
  },
  logoutButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  logoutGradient: {
    padding: 12,
    borderRadius: 20,
  },
  
  // Stats Section Élégante
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
  
  // Filters Section Élégante
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
    borderColor: 'rgba(102, 126, 234, 0.2)',
    backgroundColor: 'rgba(45, 55, 72, 0.9)',
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
    color: '#9ca3af',
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  
  // Participants Section Élégante
  participantsSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  participantCount: {
    fontSize: 14,
    color: '#9ca3af',
    backgroundColor: 'rgba(45, 55, 72, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  
  // Participant Cards Élégantes
  participantCard: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  participantCardGradient: {
    padding: 20,
  },
  participantHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  participantAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'rgba(102, 126, 234, 0.3)',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#1a1f2e',
  },
  levelBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1a1f2e',
  },
  levelBadgeText: {
    fontSize: 12,
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 3,
  },
  participantRole: {
    fontSize: 14,
    color: '#667eea',
    marginBottom: 2,
  },
  participantDepartment: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 2,
  },
  participantLevel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  participantStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  participantStats: {
    alignItems: 'flex-end',
    gap: 4,
  },
  participantRSSI: {
    fontSize: 11,
    color: '#6b7280',
  },
  batteryContainer: {
    alignItems: 'flex-end',
  },
  participantBattery: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 2,
  },
  batteryBar: {
    height: 3,
    backgroundColor: '#667eea',
    borderRadius: 2,
    minWidth: 20,
  },
  
  // Health Container Élégant
  healthContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 10,
  },
  healthItem: {
    alignItems: 'center',
    flex: 1,
  },
  healthIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  healthValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  healthLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  
  // Activities Container Élégant
  activitiesContainer: {
    marginBottom: 15,
  },
  activitiesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  activitiesInfo: {
    backgroundColor: 'rgba(45, 55, 72, 0.6)',
    borderRadius: 12,
    padding: 12,
  },
  currentActivity: {
    fontSize: 13,
    color: '#10b981',
    marginBottom: 2,
  },
  activityDuration: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  activityLocation: {
    fontSize: 12,
    color: '#3b82f6',
    marginBottom: 2,
  },
  nextMeeting: {
    fontSize: 12,
    color: '#8b5cf6',
    marginBottom: 2,
  },
  projectCount: {
    fontSize: 12,
    color: '#f59e0b',
  },
  
  // Performance Container Élégant
  performanceContainer: {
    marginBottom: 15,
  },
  performanceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  performanceInfo: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.2)',
  },
  performanceItem: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 2,
  },
  
  // Contact Container Élégant
  contactContainer: {
    marginBottom: 15,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  contactInfo: {
    backgroundColor: 'rgba(45, 55, 72, 0.6)',
    borderRadius: 12,
    padding: 12,
  },
  contactItem: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 2,
  },
  
  // Alert Button Élégant
  alertButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  alertGradient: {
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  alertText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

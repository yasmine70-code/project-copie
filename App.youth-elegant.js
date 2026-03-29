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

// Données jeunes élégantes
const YOUTH_PARTICIPANTS = [
  {
    id: '1',
    name: 'Alexandre Martin',
    role: 'Étudiant Secondaire',
    department: 'Programme Éducatif',
    avatar: 'https://picsum.photos/seed/alex-youth/400/400.jpg',
    status: 'online',
    rssi: -45.00,
    battery: 88,
    zone: 'Zone A - Études',
    phone: '+33612345678',
    parent: 'Pierre Martin',
    age: 14,
    sos: false,
    level: 'adolescent',
    health: {
      heartRate: 78,
      stress: 18,
      focus: 85,
      energy: 82,
      mood: 'concentré',
      activity: 'études',
      performance: 88
    },
    activities: {
      current: 'Cours de mathématiques',
      duration: '45 min',
      location: 'Salle d\'étude',
      next_activity: '15:30 - Sports',
      subjects: ['Maths', 'Physique', 'Histoire']
    },
    education: {
      grade_level: '3ème',
      average_grade: 15.2,
      attendance: 95,
      behavior: 'Excellent',
      special_needs: 'Aucun'
    },
    contact: {
      parent_phone: '+33612345678',
      emergency_contact: 'Marie Martin',
      medical_info: 'Aucun traitement'
    }
  },
  {
    id: '2',
    name: 'Emma Dubois',
    role: 'Étudiante Collège',
    department: 'Programme Éducatif',
    avatar: 'https://picsum.photos/seed/emma-youth/400/400.jpg',
    status: 'online',
    rssi: -48.00,
    battery: 76,
    zone: 'Zone B - Arts',
    phone: '+33623456789',
    parent: 'Sophie Dubois',
    age: 11,
    sos: false,
    level: 'enfant',
    health: {
      heartRate: 82,
      stress: 15,
      focus: 88,
      energy: 90,
      mood: 'créative',
      activity: 'arts plastiques',
      performance: 92
    },
    activities: {
      current: 'Atelier dessin',
      duration: '1h',
      location: 'Salle d\'arts',
      next_activity: '14:00 - Français',
      subjects: ['Arts', 'Français', 'Sciences']
    },
    education: {
      grade_level: '6ème',
      average_grade: 16.8,
      attendance: 98,
      behavior: 'Très bon',
      special_needs: 'Aucun'
    },
    contact: {
      parent_phone: '+33623456789',
      emergency_contact: 'Jean Dubois',
      medical_info: 'Allergie aux arachides'
    }
  },
  {
    id: '3',
    name: 'Lucas Bernard',
    role: 'Moniteur Animation',
    department: 'Équipe Animation',
    avatar: 'https://picsum.photos/seed/lucas-youth/400/400.jpg',
    status: 'warning',
    rssi: -75.00,
    battery: 32,
    zone: 'Zone C - Animation',
    phone: '+33634567890',
    age: 22,
    sos: true,
    level: 'staff',
    health: {
      heartRate: 95,
      stress: 42,
      focus: 65,
      energy: 35,
      mood: 'fatigué',
      activity: 'supervision',
      performance: 68
    },
    activities: {
      current: 'Supervision groupe',
      duration: '3h',
      location: 'Salle polyvalente',
      next_activity: '16:00 - Pause',
      subjects: ['Animation', 'Sports', 'Éducation']
    },
    education: {
      grade_level: 'Bac+2',
      average_grade: 14.5,
      attendance: 100,
      behavior: 'Professionnel',
      special_needs: 'Aucun'
    },
    contact: {
      parent_phone: '+33634567890',
      emergency_contact: 'Claire Bernard',
      medical_info: 'Aucun'
    }
  },
  {
    id: '4',
    name: 'Chloé Laurent',
    role: 'Étudiante Primaire',
    department: 'Programme Éducatif',
    avatar: 'https://picsum.photos/seed/chloe-youth/400/400.jpg',
    status: 'offline',
    rssi: -88.00,
    battery: 15,
    zone: 'Zone D - Repos',
    phone: '+33645678901',
    parent: 'Michel Laurent',
    age: 8,
    sos: false,
    level: 'enfant',
    health: {
      heartRate: 85,
      stress: 22,
      focus: 70,
      energy: 40,
      mood: 'calme',
      activity: 'lecture',
      performance: 85
    },
    activities: {
      current: 'Temps de lecture',
      duration: '30 min',
      location: 'Bibliothèque',
      next_activity: '14:30 - Jeux éducatifs',
      subjects: ['Lecture', 'Calcul', 'Découverte']
    },
    education: {
      grade_level: 'CE2',
      average_grade: 17.2,
      attendance: 97,
      behavior: 'Excellent',
      special_needs: 'Aucun'
    },
    contact: {
      parent_phone: '+33645678901',
      emergency_contact: 'Isabelle Laurent',
      medical_info: 'Asthme léger'
    }
  },
  {
    id: '5',
    name: 'Thomas Rousseau',
    role: 'Étudiant Lycée',
    department: 'Programme Éducatif',
    avatar: 'https://picsum.photos/seed/thomas-youth/400/400.jpg',
    status: 'online',
    rssi: -52.00,
    battery: 82,
    zone: 'Zone E - Sciences',
    phone: '+33656789012',
    parent: 'François Rousseau',
    age: 17,
    sos: false,
    level: 'adolescent',
    health: {
      heartRate: 72,
      stress: 20,
      focus: 90,
      energy: 88,
      mood: 'motivé',
      activity: 'laboratoire',
      performance: 94
    },
    activities: {
      current: 'TP Chimie',
      duration: '2h',
      location: 'Labo sciences',
      next_activity: '15:00 - Philosophie',
      subjects: ['Chimie', 'Maths', 'Anglais']
    },
    education: {
      grade_level: 'Terminale',
      average_grade: 16.5,
      attendance: 96,
      behavior: 'Excellent',
      special_needs: 'Aucun'
    },
    contact: {
      parent_phone: '+33656789012',
      emergency_contact: 'Catherine Rousseau',
      medical_info: 'Aucun'
    }
  },
  {
    id: '6',
    name: 'Léa Moreau',
    role: 'Étudiante Collège',
    department: 'Programme Éducatif',
    avatar: 'https://picsum.photos/seed/lea-youth/400/400.jpg',
    status: 'online',
    rssi: -58.00,
    battery: 90,
    zone: 'Zone F - Multimédia',
    phone: '+33667890123',
    parent: 'David Moreau',
    age: 13,
    sos: false,
    level: 'adolescent',
    health: {
      heartRate: 75,
      stress: 16,
      focus: 87,
      energy: 92,
      mood: 'enthousiaste',
      activity: 'informatique',
      performance: 91
    },
    activities: {
      current: 'Atelier programmation',
      duration: '1h30',
      location: 'Salle informatique',
      next_activity: '14:45 - EPS',
      subjects: ['Informatique', 'Anglais', 'Espagnol']
    },
    education: {
      grade_level: '4ème',
      average_grade: 15.8,
      attendance: 99,
      behavior: 'Très bon',
      special_needs: 'Aucun'
    },
    contact: {
      parent_phone: '+33667890123',
      emergency_contact: 'Hélène Moreau',
      medical_info: 'Aucun'
    }
  }
];

// Écran Login élégant
function LoginScreen({ onLoginSuccess }) {
  const [email, setEmail] = useState('centre@education.com');
  const [password, setPassword] = useState('centre2024');
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
      if (email === 'centre@education.com' && password === 'centre2024') {
        onLoginSuccess({ 
          name: 'Responsable Centre', 
          email: email,
          role: 'Coordinateur Éducatif',
          level: 'admin',
          avatar: 'https://picsum.photos/seed/coordinator-youth/400/400.jpg'
        });
      } else {
        Alert.alert('Erreur d\'authentification', 'Email ou mot de passe incorrect');
      }
      setIsLoading(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2d3748" />
      
      {/* Background élégant */}
      <LinearGradient
        colors={['#2d3748', '#4a5568', '#718096', '#4a5568', '#2d3748']}
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
                colors={['#4299e1', '#3182ce', '#2c5282']}
                style={styles.logoGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.logo}>◆</Text>
              </LinearGradient>
            </View>
            <Text style={styles.title}>Centre Éducatif</Text>
            <Text style={styles.subtitle}>Plateforme de Suivi Éducatif</Text>
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
                <Ionicons name="mail" size={20} color="#a0aec0" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="centre@education.com"
                  placeholderTextColor="#a0aec0"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading}
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mot de passe</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} color="#a0aec0" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••••"
                  placeholderTextColor="#a0aec0"
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
                    color="#a0aec0" 
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
                colors={isLoading ? ['#718096', '#4a5568'] : ['#4299e1', '#3182ce']}
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
              <Text style={styles.infoText}>{YOUTH_PARTICIPANTS.length} participants</Text>
              <Text style={styles.infoText}>Système sécurisé 256-bit</Text>
              <Text style={styles.infoText}>Suivi en temps réel</Text>
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
  const [participants, setParticipants] = useState(YOUTH_PARTICIPANTS);
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
      case 'enfants':
        return participants.filter(p => p.level === 'enfant');
      case 'ados':
        return participants.filter(p => p.level === 'adolescent');
      case 'staff':
        return participants.filter(p => p.level === 'staff');
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
      case 'online': return '#48bb78';
      case 'warning': return '#ed8936';
      case 'offline': return '#718096';
      default: return '#718096';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'staff': return '#e53e3e';
      case 'adolescent': return '#805ad5';
      case 'enfant': return '#3182ce';
      default: return '#718096';
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'staff': return '👔';
      case 'adolescent': return '👤';
      case 'enfant': return '👶';
      default: return '👤';
    }
  };

  const getLevelTitle = (level) => {
    switch (level) {
      case 'staff': return 'Personnel';
      case 'adolescent': return 'Adolescent';
      case 'enfant': return 'Enfant';
      default: return 'Participant';
    }
  };

  const filteredParticipants = getFilteredParticipants();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2d3748" />
      
      {/* Background élégant */}
      <LinearGradient
        colors={['#2d3748', '#4a5568', '#718096', '#4a5568', '#2d3748']}
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
            colors={['#4299e1', '#3182ce']}
            tintColor="#4299e1"
          />
        }
      >
        {/* Header élégant */}
        <View style={styles.dashboardHeader}>
          <LinearGradient
            colors={['rgba(66, 153, 225, 0.1)', 'rgba(49, 130, 206, 0.1)']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.userInfo}>
              <Image source={{ uri: user?.avatar }} style={styles.userAvatar} />
              <View style={styles.userDetails}>
                <Text style={styles.greeting}>Bonjour, {user?.name || 'Admin'}</Text>
                <Text style={styles.userRole}>{user?.role || 'Coordinateur Éducatif'}</Text>
                <Text style={styles.time}>{currentTime.toLocaleTimeString()}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
              <LinearGradient
                colors={['#e53e3e', '#c53030']}
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
                colors={['#4299e1', '#3182ce']}
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
                colors={['#48bb78', '#38a169']}
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
                colors={['#ed8936', '#dd6b20']}
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
                colors={['#805ad5', '#6b46c1']}
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
            {['all', 'enfants', 'ados', 'staff', 'online', 'warning', 'offline', 'alerts'].map((filter) => (
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
                    colors={['#4299e1', '#3182ce']}
                    style={styles.filterGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.activeFilterText}>
                      {filter === 'all' && 'Tous'}
                      {filter === 'enfants' && 'Enfants'}
                      {filter === 'ados' && 'Adolescents'}
                      {filter === 'staff' && 'Personnel'}
                      {filter === 'online' && 'Actifs'}
                      {filter === 'warning' && 'Attention'}
                      {filter === 'offline' && 'Hors ligne'}
                      {filter === 'alerts' && 'Alertes'}
                    </Text>
                  </LinearGradient>
                ) : (
                  <Text style={styles.filterText}>
                    {filter === 'all' && 'Tous'}
                    {filter === 'enfants' && 'Enfants'}
                    {filter === 'ados' && 'Adolescents'}
                    {filter === 'staff' && 'Personnel'}
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
            <Text style={styles.sectionTitle}>Participants</Text>
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
                colors={['rgba(74, 85, 104, 0.95)', 'rgba(45, 55, 72, 0.95)', 'rgba(66, 153, 225, 0.05)']}
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
                    <Text style={styles.participantLevel}>{getLevelTitle(participant.level)} - {participant.age} ans</Text>
                    {participant.parent && (
                      <Text style={styles.participantParent}>Parent: {participant.parent}</Text>
                    )}
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
                    <Ionicons name="chevron-forward" size={16} color="#a0aec0" />
                  </View>
                </View>
                
                {/* Santé et Performance */}
                <View style={styles.healthContainer}>
                  <View style={styles.healthItem}>
                    <LinearGradient
                      colors={['#e53e3e', '#c53030']}
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
                      colors={['#ed8936', '#dd6b20']}
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
                      colors={['#805ad5', '#6b46c1']}
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
                      colors={['#48bb78', '#38a169']}
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
                    <Text style={styles.nextActivity}>👤 Prochaine: {participant.activities.next_activity}</Text>
                    <Text style={styles.subjectsList}>📚 Matières: {participant.activities.subjects.join(', ')}</Text>
                  </View>
                </View>
                
                {/* Éducation */}
                <View style={styles.educationContainer}>
                  <Text style={styles.educationTitle}>Scolarité</Text>
                  <View style={styles.educationInfo}>
                    <Text style={styles.educationItem}>🎓 Niveau: {participant.education.grade_level}</Text>
                    <Text style={styles.educationItem}>📊 Moyenne: {participant.education.average_grade}/20</Text>
                    <Text style={styles.educationItem}>📅 Assiduité: {participant.education.attendance}%</Text>
                    <Text style={styles.educationItem}>⭐ Comportement: {participant.education.behavior}</Text>
                  </View>
                </View>
                
                {/* Contact */}
                <View style={styles.contactContainer}>
                  <Text style={styles.contactTitle}>Contact</Text>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactItem}>📞 Parent: {participant.contact.parent_phone}</Text>
                    <Text style={styles.contactItem}>🆘 Urgence: {participant.contact.emergency_contact}</Text>
                    <Text style={styles.contactItem}>🏥 Médical: {participant.contact.medical_info}</Text>
                  </View>
                </View>
                
                {participant.sos && (
                  <TouchableOpacity style={styles.alertButton}>
                    <LinearGradient
                      colors={['#e53e3e', '#c53030', '#9c2624']}
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
        <StatusBar barStyle="light-content" backgroundColor="#2d3748" />
        <LinearGradient
          colors={['#2d3748', '#4a5568', '#718096', '#4a5568', '#2d3748']}
          style={styles.background}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingLogo}>◆</Text>
          <Text style={styles.loadingText}>Centre Éducatif</Text>
          <Text style={styles.loadingSubtext}>Chargement du système...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2d3748" />
      <LinearGradient
        colors={['#2d3748', '#4a5568', '#718096', '#4a5568', '#2d3748']}
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
    backgroundColor: '#2d3748',
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
    color: '#4299e1',
  },
  loadingText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textShadowColor: 'rgba(66, 153, 225, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 15,
  },
  loadingSubtext: {
    fontSize: 18,
    color: '#a0aec0',
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
    borderColor: 'rgba(66, 153, 225, 0.3)',
    shadowColor: '#4299e1',
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
    textShadowColor: 'rgba(66, 153, 225, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#a0aec0',
    marginBottom: 20,
  },
  infoBadges: {
    flexDirection: 'row',
    gap: 10,
  },
  infoBadge: {
    backgroundColor: 'rgba(66, 153, 225, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(66, 153, 225, 0.3)',
  },
  infoBadgeText: {
    fontSize: 12,
    color: '#a0aec0',
    fontWeight: '600',
  },
  
  // Formulaire Élégant
  form: {
    width: '100%',
    maxWidth: 450,
    backgroundColor: 'rgba(74, 85, 104, 0.95)',
    borderRadius: 20,
    padding: 35,
    borderWidth: 1,
    borderColor: 'rgba(66, 153, 225, 0.2)',
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
    color: '#a0aec0',
    marginBottom: 8,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 55, 72, 0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(66, 153, 225, 0.2)',
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
    shadowColor: '#4299e1',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 5,
  },
  loginButtonDisabled: {
    shadowColor: '#718096',
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
    color: '#a0aec0',
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
    borderColor: 'rgba(66, 153, 225, 0.3)',
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
    color: '#a0aec0',
    marginBottom: 2,
  },
  time: {
    fontSize: 12,
    color: '#718096',
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
    borderColor: 'rgba(66, 153, 225, 0.2)',
    backgroundColor: 'rgba(74, 85, 104, 0.9)',
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
    color: '#a0aec0',
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
    color: '#a0aec0',
    backgroundColor: 'rgba(74, 85, 104, 0.9)',
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
    borderColor: 'rgba(66, 153, 225, 0.3)',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#2d3748',
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
    borderColor: '#2d3748',
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
    color: '#4299e1',
    marginBottom: 2,
  },
  participantDepartment: {
    fontSize: 12,
    color: '#a0aec0',
    marginBottom: 2,
  },
  participantLevel: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 2,
  },
  participantParent: {
    fontSize: 12,
    color: '#805ad5',
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
    color: '#718096',
  },
  batteryContainer: {
    alignItems: 'flex-end',
  },
  participantBattery: {
    fontSize: 11,
    color: '#718096',
    marginBottom: 2,
  },
  batteryBar: {
    height: 3,
    backgroundColor: '#4299e1',
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
    backgroundColor: 'rgba(74, 85, 104, 0.6)',
    borderRadius: 12,
    padding: 12,
  },
  currentActivity: {
    fontSize: 13,
    color: '#48bb78',
    marginBottom: 2,
  },
  activityDuration: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 2,
  },
  activityLocation: {
    fontSize: 12,
    color: '#4299e1',
    marginBottom: 2,
  },
  nextActivity: {
    fontSize: 12,
    color: '#805ad5',
    marginBottom: 2,
  },
  subjectsList: {
    fontSize: 12,
    color: '#ed8936',
  },
  
  // Education Container Élégant
  educationContainer: {
    marginBottom: 15,
  },
  educationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  educationInfo: {
    backgroundColor: 'rgba(66, 153, 225, 0.1)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(66, 153, 225, 0.2)',
  },
  educationItem: {
    fontSize: 12,
    color: '#a0aec0',
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
    backgroundColor: 'rgba(74, 85, 104, 0.6)',
    borderRadius: 12,
    padding: 12,
  },
  contactItem: {
    fontSize: 12,
    color: '#a0aec0',
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

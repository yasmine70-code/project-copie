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
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Données adaptées pour camping avec enfants et adultes
const CAMPING_PARTICIPANTS = [
  {
    id: '1',
    name: 'Lucas Martin',
    role: 'Enfant - Groupe 7-10 ans',
    department: 'Activités Enfants',
    avatar: 'https://picsum.photos/seed/lucas-camping/400/400.jpg',
    status: 'online',
    rssi: -45.00,
    battery: 85,
    zone: 'Zone Aire de Jeux',
    phone: '+33612345678',
    parent: 'Pierre Martin',
    age: 8,
    sos: false,
    level: 'enfant',
    health: {
      heartRate: 95,
      stress: 15,
      focus: 80,
      energy: 95,
      mood: 'joyeux',
      activity: 'joue'
    },
    activities: {
      favorites: ['Piscine', 'Jeux de société', 'Animation'],
      current: 'Piscine',
      duration: '45 min',
      safety: 'zone sécurisée'
    },
    emergency: {
      allergies: 'Aucune',
      medical: 'Aucun traitement',
      contact_parent: '+33612345678',
      groupe_sang: 'O+'
    }
  },
  {
    id: '2',
    name: 'Emma Dubois',
    role: 'Enfant - Groupe 11-14 ans',
    department: 'Activités Ados',
    avatar: 'https://picsum.photos/seed/emma-camping/400/400.jpg',
    status: 'online',
    rssi: -52.00,
    battery: 72,
    zone: 'Zone Sports',
    phone: '+33623456789',
    parent: 'Marie Dubois',
    age: 12,
    sos: false,
    level: 'ado',
    health: {
      heartRate: 88,
      stress: 25,
      focus: 75,
      energy: 88,
      mood: 'enthousiaste',
      activity: 'sport'
    },
    activities: {
      favorites: ['Tennis', 'Natation', 'Volley'],
      current: 'Tennis',
      duration: '30 min',
      safety: 'avec moniteur'
    },
    emergency: {
      allergies: 'Arachides',
      medical: 'Ventoline si besoin',
      contact_parent: '+33623456789',
      groupe_sang: 'A+'
    }
  },
  {
    id: '3',
    name: 'Thomas Petit',
    role: 'Adulte - Responsable Sécurité',
    department: 'Équipe Animation',
    avatar: 'https://picsum.photos/seed/thomas-camping/400/400.jpg',
    status: 'online',
    rssi: -48.00,
    battery: 90,
    zone: 'Zone Accueil',
    phone: '+33634567890',
    age: 35,
    sos: false,
    level: 'staff',
    health: {
      heartRate: 72,
      stress: 30,
      focus: 90,
      energy: 85,
      mood: 'professionnel',
      activity: 'surveillance'
    },
    activities: {
      favorites: ['Randonnée', 'Pêche', 'Animation'],
      current: 'Surveillance',
      duration: '4h',
      safety: 'poste fixe'
    },
    emergency: {
      allergies: 'Aucune',
      medical: 'Aucun',
      contact_parent: '+33634567890',
      groupe_sang: 'O+'
    }
  },
  {
    id: '4',
    name: 'Chloé Laurent',
    role: 'Enfant - Groupe 5-7 ans',
    department: 'Petits Enfants',
    avatar: 'https://picsum.photos/seed/chloe-camping/400/400.jpg',
    status: 'warning',
    rssi: -78.00,
    battery: 35,
    zone: 'Zone Mini-Club',
    phone: '+33645678901',
    parent: 'Sophie Laurent',
    age: 6,
    sos: true,
    level: 'petit',
    health: {
      heartRate: 110,
      stress: 45,
      focus: 60,
      energy: 40,
      mood: 'fatigué',
      activity: 'repos'
    },
    activities: {
      favorites: ['Dessin', 'Contes', 'Jeu d\'eau'],
      current: 'Dessin',
      duration: '20 min',
      safety: 'avec animatrice'
    },
    emergency: {
      allergies: 'Gluten',
      medical: 'Aucun',
      contact_parent: '+33645678901',
      groupe_sang: 'B+'
    }
  },
  {
    id: '5',
    name: 'Marc Rousseau',
    role: 'Adulte - Moniteur Sport',
    department: 'Équipe Sport',
    avatar: 'https://picsum.photos/seed/marc-camping/400/400.jpg',
    status: 'online',
    rssi: -55.00,
    battery: 78,
    zone: 'Zone Terrain de Sport',
    phone: '+33656789012',
    age: 28,
    sos: false,
    level: 'staff',
    health: {
      heartRate: 75,
      stress: 20,
      focus: 95,
      energy: 92,
      mood: 'dynamique',
      activity: 'encadrement'
    },
    activities: {
      favorites: ['Football', 'Basketball', 'Athlétisme'],
      current: 'Football enfants',
      duration: '1h',
      safety: 'terrain sécurisé'
    },
    emergency: {
      allergies: 'Aucune',
      medical: 'Aucun',
      contact_parent: '+33656789012',
      groupe_sang: 'A+'
    }
  },
  {
    id: '6',
    name: 'Léa Bernard',
    role: 'Enfant - Groupe 15-18 ans',
    department: 'Jeunes Adultes',
    avatar: 'https://picsum.photos/seed/lea-camping/400/400.jpg',
    status: 'offline',
    rssi: -92.00,
    battery: 20,
    zone: 'Zone Adolescents',
    phone: '+33667890123',
    parent: 'Jean Bernard',
    age: 16,
    sos: false,
    level: 'ado',
    health: {
      heartRate: 68,
      stress: 35,
      focus: 70,
      energy: 25,
      mood: 'calme',
      activity: 'lecture'
    },
    activities: {
      favorites: ['Musique', 'Lecture', 'Photo'],
      current: 'Lecture',
      duration: '1h30',
      safety: 'zone repos'
    },
    emergency: {
      allergies: 'Pollen',
      medical: 'Antihistaminique',
      contact_parent: '+33667890123',
      groupe_sang: 'AB+'
    }
  }
];

// Écran Login adapté camping
function LoginScreen({ onLoginSuccess }) {
  const [email, setEmail] = useState('camping@rssi.com');
  const [password, setPassword] = useState('camping2024');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('⚠️ Attention', 'Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      if (email === 'camping@rssi.com' && password === 'camping2024') {
        onLoginSuccess({ 
          name: 'Responsable Camping', 
          email: email,
          role: 'directeur-camping',
          level: 'staff',
          avatar: 'https://picsum.photos/seed/camping-director/400/400.jpg'
        });
      } else {
        Alert.alert('❌ Erreur d\'Authentification', 'Email ou mot de passe incorrect');
      }
      setIsLoading(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a4d0a" />
      
      {/* Background camping */}
      <LinearGradient
        colors={['#0a4d0a', '#1a7a1a', '#2d5a2d']}
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
          {/* Header Camping */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['#22c55e', '#16a34a', '#15803d']}
                style={styles.logoGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.logo}>🏕️</Text>
              </LinearGradient>
            </View>
            <Text style={styles.title}>CAMPING SUPERVISION</Text>
            <Text style={styles.subtitle}>Système de Surveillance des Vacanciers</Text>
            <View style={styles.badges}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>👨‍👩‍👧‍👦 Familles</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>🛡️ Sécurité</Text>
              </View>
            </View>
          </View>

          {/* Formulaire Camping */}
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>🔐 ACCÈS RESPONSABLE</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email du Camping</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail" size={20} color="#6b7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="camping@rssi.com"
                  placeholderTextColor="#6b7280"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading}
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mot de Passe Sécurisé</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} color="#6b7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="•••••••••"
                  placeholderTextColor="#6b7280"
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
                    color="#6b7280" 
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
                colors={isLoading ? ['#6b7280', '#4b5563'] : ['#22c55e', '#16a34a']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {isLoading ? (
                  <Text style={styles.buttonText}>🔄 CONNEXION...</Text>
                ) : (
                  <Text style={styles.buttonText}>🏕️ ACCÉDER AU CAMPING</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.campingInfo}>
              <Text style={styles.campingText}>🏕️ {CAMPING_PARTICIPANTS.length} vacanciers surveillés</Text>
              <Text style={styles.campingText}>👶 {CAMPING_PARTICIPANTS.filter(p => p.level === 'enfant' || p.level === 'petit').length} enfants</Text>
              <Text style={styles.campingText}>🧑 {CAMPING_PARTICIPANTS.filter(p => p.level === 'ado').length} adolescents</Text>
              <Text style={styles.campingText}>👨‍💼 {CAMPING_PARTICIPANTS.filter(p => p.level === 'staff').length} staff</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// Écran Home adapté camping
function HomeScreen({ user, onLogout }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [participants, setParticipants] = useState(CAMPING_PARTICIPANTS);
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
            heartRate: Math.floor(50 + Math.random() * 60),
            stress: Math.random() * 0.5,
            energy: Math.max(0.1, participant.health.energy - Math.random() * 0.05)
          }
        }))
      );
      setRefreshing(false);
    }, 2000);
  };

  const getFilteredParticipants = () => {
    switch (selectedFilter) {
      case 'enfants':
        return participants.filter(p => p.level === 'enfant' || p.level === 'petit');
      case 'ados':
        return participants.filter(p => p.level === 'ado');
      case 'staff':
        return participants.filter(p => p.level === 'staff');
      case 'online':
        return participants.filter(p => p.status === 'online');
      case 'warning':
        return participants.filter(p => p.status === 'warning');
      case 'offline':
        return participants.filter(p => p.status === 'offline');
      case 'sos':
        return participants.filter(p => p.sos === true);
      default:
        return participants;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#22c55e';
      case 'warning': return '#f59e0b';
      case 'offline': return '#64748b';
      default: return '#64748b';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'staff': return '#dc2626';
      case 'ado': return '#3b82f6';
      case 'enfant': return '#10b981';
      case 'petit': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'staff': return '👨‍💼';
      case 'ado': return '🧑';
      case 'enfant': return '👶';
      case 'petit': return '🍼';
      default: return '👤';
    }
  };

  const getAgeGroup = (age) => {
    if (age <= 7) return 'Petit (5-7 ans)';
    if (age <= 10) return 'Enfant (8-10 ans)';
    if (age <= 14) return 'Ado pré-teen (11-14 ans)';
    if (age <= 18) return 'Ado (15-18 ans)';
    return 'Adulte';
  };

  const filteredParticipants = getFilteredParticipants();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a4d0a" />
      
      {/* Background camping */}
      <LinearGradient
        colors={['#0a4d0a', '#1a7a1a', '#2d5a2d']}
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
            colors={['#22c55e', '#16a34a']}
            tintColor="#22c55e"
          />
        }
      >
        {/* Header Camping */}
        <View style={styles.dashboardHeader}>
          <LinearGradient
            colors={['rgba(34, 197, 94, 0.1)', 'rgba(22, 163, 74, 0.1)']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.userInfo}>
              <Image source={{ uri: user?.avatar }} style={styles.userAvatar} />
              <View style={styles.userDetails}>
                <Text style={styles.greeting}>Bonjour, {user?.name || 'Directeur'}</Text>
                <Text style={styles.userRole}>{user?.role || 'Responsable Camping'}</Text>
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

        {/* Statistiques Camping */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>📊 SURVEILLANCE DU CAMPING</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#22c55e', '#16a34a']}
                style={styles.statCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.statValue}>{participants.length}</Text>
                <Text style={styles.statLabel}>Total Vacanciers</Text>
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
                <Text style={styles.statValue}>{participants.filter(p => p.level === 'enfant' || p.level === 'petit').length}</Text>
                <Text style={styles.statLabel}>Enfants</Text>
                <Ionicons name="happy" size={24} color="rgba(255,255,255,0.3)" style={styles.statIcon} />
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
                <Text style={styles.statValue}>{participants.filter(p => p.status === 'online').length}</Text>
                <Text style={styles.statLabel}>Actifs</Text>
                <Ionicons name="checkmark-circle" size={24} color="rgba(255,255,255,0.3)" style={styles.statIcon} />
              </LinearGradient>
            </View>
          </View>
        </View>

        {/* Filtres Camping */}
        <View style={styles.filtersSection}>
          <Text style={styles.sectionTitle}>🔍 FILTRES PAR CATÉGORIE</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollContainer}
          >
            {['all', 'enfants', 'ados', 'staff', 'online', 'warning', 'offline', 'sos'].map((filter) => (
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
                    colors={['#22c55e', '#16a34a']}
                    style={styles.filterGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.activeFilterText}>
                      {filter === 'all' && '🏕️ Tous'}
                      {filter === 'enfants' && '👶 Enfants'}
                      {filter === 'ados' && '🧑 Ados'}
                      {filter === 'staff' && '👨‍💼 Staff'}
                      {filter === 'online' && '✅ Actifs'}
                      {filter === 'warning' && '⚠️ Attention'}
                      {filter === 'offline' && '❌ Hors ligne'}
                      {filter === 'sos' && '🚨 SOS'}
                    </Text>
                  </LinearGradient>
                ) : (
                  <Text style={styles.filterText}>
                    {filter === 'all' && '🏕️ Tous'}
                    {filter === 'enfants' && '👶 Enfants'}
                    {filter === 'ados' && '🧑 Ados'}
                    {filter === 'staff' && '👨‍💼 Staff'}
                    {filter === 'online' && '✅ Actifs'}
                    {filter === 'warning' && '⚠️ Attention'}
                    {filter === 'offline' && '❌ Hors ligne'}
                    {filter === 'sos' && '🚨 SOS'}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Liste des participants camping */}
        <View style={styles.participantsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>👥 VACANCIERS DU CAMPING</Text>
            <Text style={styles.participantCount}>{filteredParticipants.length} personnes</Text>
          </View>
          
          {filteredParticipants.map((participant) => (
            <TouchableOpacity
              key={participant.id}
              style={styles.participantCard}
              onPress={() => console.log('Détails participant:', participant.id)}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['rgba(30, 41, 59, 0.9)', 'rgba(15, 23, 42, 0.9)']}
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
                    <Text style={styles.participantAge}>🎂 {participant.age} ans - {getAgeGroup(participant.age)}</Text>
                    {participant.parent && (
                      <Text style={styles.participantParent}>👨‍👩‍👧‍👦 Parent: {participant.parent}</Text>
                    )}
                    <View style={styles.participantStatus}>
                      <View style={[styles.statusDot, { backgroundColor: getStatusColor(participant.status) }]} />
                      <Text style={[styles.statusText, { color: getStatusColor(participant.status) }]}>
                        {participant.status === 'online' ? '🟢 Actif' : 
                         participant.status === 'warning' ? '🟡 Attention' : '🔴 Hors ligne'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.participantStats}>
                    <Text style={styles.participantRSSI}>{participant.rssi.toFixed(2)} dBm</Text>
                    <View style={styles.batteryContainer}>
                      <Text style={styles.participantBattery}>{participant.battery}%</Text>
                      <View style={[styles.batteryBar, { width: `${participant.battery}%` }]} />
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#6b7280" />
                  </View>
                </View>
                
                {/* Santé et Activité */}
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
                    <Text style={styles.healthLabel}>BPM</Text>
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
                      colors={['#22c55e', '#16a34a']}
                      style={styles.healthIcon}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Ionicons name="happy" size={16} color="white" />
                    </LinearGradient>
                    <Text style={styles.healthValue}>{participant.health.mood}</Text>
                    <Text style={styles.healthLabel}>Humeur</Text>
                  </View>
                  <View style={styles.healthItem}>
                    <LinearGradient
                      colors={['#3b82f6', '#1d4ed8']}
                      style={styles.healthIcon}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Ionicons name="play" size={16} color="white" />
                    </LinearGradient>
                    <Text style={styles.healthValue}>{participant.health.activity}</Text>
                    <Text style={styles.healthLabel}>Activité</Text>
                  </View>
                </View>
                
                {/* Activités */}
                <View style={styles.activitiesContainer}>
                  <Text style={styles.activitiesTitle}>🎯 ACTIVITÉS</Text>
                  <View style={styles.activitiesInfo}>
                    <Text style={styles.currentActivity}>📍 Actuel: {participant.activities.current}</Text>
                    <Text style={styles.activityDuration}>⏱️ {participant.activities.duration}</Text>
                    <Text style={styles.activitySafety}>🛡️ {participant.activities.safety}</Text>
                  </View>
                  <View style={styles.favoritesActivities}>
                    <Text style={styles.favoritesTitle}>❤️ Préférées:</Text>
                    <View style={styles.favoritesList}>
                      {participant.activities.favorites.map((fav, index) => (
                        <Text key={index} style={styles.favoriteItem}>{fav}</Text>
                      ))}
                    </View>
                  </View>
                </View>
                
                {/* Informations médicales d'urgence */}
                <View style={styles.emergencyContainer}>
                  <Text style={styles.emergencyTitle}>🚨 INFORMATIONS MÉDICALES</Text>
                  <View style={styles.emergencyInfo}>
                    <Text style={styles.emergencyItem}>🏥 Allergies: {participant.emergency.allergies}</Text>
                    <Text style={styles.emergencyItem}>💊 Traitement: {participant.emergency.medical}</Text>
                    <Text style={styles.emergencyItem}>📞 Parent: {participant.emergency.contact_parent}</Text>
                    <Text style={styles.emergencyItem}>🩸 Groupe: {participant.emergency.groupe_sang}</Text>
                  </View>
                </View>
                
                {participant.sos && (
                  <TouchableOpacity style={styles.sosButton}>
                    <LinearGradient
                      colors={['#ef4444', '#dc2626']}
                      style={styles.sosGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Ionicons name="warning" size={20} color="white" />
                      <Text style={styles.sosText}>🚨 ALERTE PARENTALE IMMÉDIATE</Text>
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

// App principal camping
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
        <StatusBar barStyle="light-content" backgroundColor="#0a4d0a" />
        <LinearGradient
          colors={['#0a4d0a', '#1a7a1a', '#2d5a2d']}
          style={styles.background}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingLogo}>🏕️</Text>
          <Text style={styles.loadingText}>CAMPING SUPERVISION</Text>
          <Text style={styles.loadingSubtext}>Chargement du système de surveillance...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a4d0a" />
      <LinearGradient
        colors={['#0a4d0a', '#1a7a1a', '#2d5a2d']}
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
    backgroundColor: '#0a4d0a',
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
    fontSize: 60,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 10,
    textShadowColor: 'rgba(34, 197, 94, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  loadingSubtext: {
    fontSize: 16,
    color: '#94a3b8',
  },
  
  // Login Styles Camping
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
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logo: {
    fontSize: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textShadowColor: 'rgba(34, 197, 94, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 20,
  },
  badges: {
    flexDirection: 'row',
    gap: 10,
  },
  badge: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.4)',
  },
  badgeText: {
    fontSize: 12,
    color: '#22c55e',
    fontWeight: '600',
  },
  
  // Formulaire Camping
  form: {
    width: '100%',
    maxWidth: 450,
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 24,
    padding: 35,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 8,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  inputIcon: {
    padding: 15,
  },
  input: {
    flex: 1,
    padding: 15,
    color: '#ffffff',
    fontSize: 16,
    borderRadius: 16,
  },
  eyeIcon: {
    padding: 15,
  },
  loginButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#22c55e',
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
    borderRadius: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  campingInfo: {
    alignItems: 'center',
    gap: 8,
  },
  campingText: {
    fontSize: 12,
    color: '#6b7280',
  },
  
  // Dashboard Styles Camping
  dashboardContainer: {
    flex: 1,
  },
  dashboardScrollContainer: {
    padding: 20,
  },
  dashboardHeader: {
    borderRadius: 20,
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
    borderColor: 'rgba(255, 255, 255, 0.3)',
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
  
  // Stats Section
  statsSection: {
    marginBottom: 30,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 5,
  },
  statIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
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
    borderColor: 'rgba(148, 163, 184, 0.2)',
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
  
  // Participants Section
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
    color: '#6b7280',
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  
  // Participant Cards Camping
  participantCard: {
    borderRadius: 20,
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
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#0a4d0a',
  },
  levelBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0a4d0a',
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
    color: '#22c55e',
    marginBottom: 3,
  },
  participantAge: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  participantParent: {
    fontSize: 12,
    color: '#3b82f6',
    marginBottom: 5,
  },
  participantStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  participantStats: {
    alignItems: 'flex-end',
    gap: 5,
  },
  participantRSSI: {
    fontSize: 12,
    color: '#6b7280',
  },
  batteryContainer: {
    alignItems: 'flex-end',
  },
  participantBattery: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  batteryBar: {
    height: 3,
    backgroundColor: '#22c55e',
    borderRadius: 2,
    minWidth: 20,
  },
  
  // Health Container
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  healthLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  
  // Activities Container
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
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  currentActivity: {
    fontSize: 12,
    color: '#22c55e',
    marginBottom: 2,
  },
  activityDuration: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  activitySafety: {
    fontSize: 12,
    color: '#3b82f6',
  },
  favoritesActivities: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 12,
    padding: 12,
  },
  favoritesTitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 5,
  },
  favoritesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  favoriteItem: {
    fontSize: 10,
    color: '#ffffff',
    backgroundColor: 'rgba(34, 197, 94, 0.3)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  
  // Emergency Container
  emergencyContainer: {
    marginBottom: 10,
  },
  emergencyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  emergencyInfo: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  emergencyItem: {
    fontSize: 12,
    color: '#ef4444',
    marginBottom: 2,
  },
  
  // SOS Button
  sosButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  sosGradient: {
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  sosText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

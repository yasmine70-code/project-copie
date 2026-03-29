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

// Données magiques corrigées pour camping forêt nuit
const MAGICAL_PARTICIPANTS = [
  {
    id: '1',
    name: 'Lucas l\'Éclaireur',
    role: 'Chef des Petits Loups',
    department: 'Aventure Enfantine',
    avatar: 'https://picsum.photos/seed/lucas-magical/400/400.jpg',
    status: 'online',
    rssi: -42.00,
    battery: 88,
    zone: 'Clairière Magique',
    phone: '+33612345678',
    parent: 'Pierre le Gardien',
    age: 8,
    sos: false,
    level: 'petit-loup',
    magic_level: 'novice',
    health: {
      heartRate: 92,
      stress: 10,
      focus: 85,
      energy: 98,
      mood: 'aventureux',
      activity: 'exploration',
      magic_power: 15
    },
    activities: {
      favorites: ['Chasse aux trésors', 'Contes d\'étoiles', 'Feu de camp'],
      current: 'Exploration nocturne',
      duration: '30 min',
      safety: 'avec guide magique',
      discovered_treasures: 3
    },
    magical: {
      spirit_animal: 'Hibou',
      constellation: 'Petite Ourse',
      element: 'Terre',
      spell_known: 'Lumière des étoiles'
    },
    emergency: {
      allergies: 'Aucune',
      medical: 'Aucun traitement magique',
      contact_parent: '+33612345678',
      groupe_sang: 'O+',
      emergency_potion: 'Potion de courage'
    }
  },
  {
    id: '2',
    name: 'Emma la Fée',
    role: 'Princesse des Crépuscules',
    department: 'Royaume des Rêves',
    avatar: 'https://picsum.photos/seed/emma-magical/400/400.jpg',
    status: 'online',
    rssi: -48.00,
    battery: 76,
    zone: 'Jardin des Fées',
    phone: '+33623456789',
    parent: 'Marie la Reine',
    age: 12,
    sos: false,
    level: 'fee-apprentie',
    magic_level: 'apprenti',
    health: {
      heartRate: 85,
      stress: 20,
      focus: 78,
      energy: 92,
      mood: 'enchantée',
      activity: 'magie élémentaire',
      magic_power: 35
    },
    activities: {
      favorites: ['Danse lunaire', 'Potions magiques', 'Communication animaux'],
      current: 'Création de potions',
      duration: '45 min',
      safety: 'sous protection fée',
      discovered_treasures: 7
    },
    magical: {
      spirit_animal: 'Papillon Lunaire',
      constellation: 'Vénus',
      element: 'Air',
      spell_known: 'Souffle de vent'
    },
    emergency: {
      allergies: 'Pollen de lune',
      medical: 'Élixir de sérénité',
      contact_parent: '+33623456789',
      groupe_sang: 'A+',
      emergency_potion: 'Potion de guérison'
    }
  },
  {
    id: '3',
    name: 'Thomas le Gardien',
    role: 'Protecteur de la Forêt',
    department: 'Ordre des Gardiens',
    avatar: 'https://picsum.photos/seed/thomas-magical/400/400.jpg',
    status: 'online',
    rssi: -38.00,
    battery: 95,
    zone: 'Arbre Ancien',
    phone: '+33634567890',
    age: 35,
    sos: false,
    level: 'gardien-ancien',
    magic_level: 'maître',
    health: {
      heartRate: 68,
      stress: 25,
      focus: 92,
      energy: 88,
      mood: 'sage',
      activity: 'méditation forestière',
      magic_power: 85
    },
    activities: {
      favorites: ['Protection magique', 'Communication arbres', 'Rituels lunaires'],
      current: 'Protection du camp',
      duration: 'Toute la nuit',
      safety: 'barrière magique',
      discovered_treasures: 42
    },
    magical: {
      spirit_animal: 'Loup Alpha',
      constellation: 'Orion',
      element: 'Terre',
      spell_known: 'Bouclier forestier'
    },
    emergency: {
      allergies: 'Aucune',
      medical: 'Sève d\'arbre sacré',
      contact_parent: '+33634567890',
      groupe_sang: 'O+',
      emergency_potion: 'Élixir de vie'
    }
  },
  {
    id: '4',
    name: 'Chloé l\'Étoile',
    role: 'Petite Muse Nocturne',
    department: 'Constellation des Rêves',
    avatar: 'https://picsum.photos/seed/chloe-magical/400/400.jpg',
    status: 'warning',
    rssi: -75.00,
    battery: 32,
    zone: 'Berceau d\'Étoiles',
    phone: '+33645678901',
    parent: 'Sophie la Gardienne',
    age: 6,
    sos: true,
    level: 'etoile-enfant',
    magic_level: 'débutant',
    health: {
      heartRate: 105,
      stress: 40,
      focus: 65,
      energy: 35,
      mood: 'fatiguée',
      activity: 'conte nocturne',
      magic_power: 8
    },
    activities: {
      favorites: ['Compter les étoiles', 'Chanson des cristaux', 'Rêver éveillé'],
      current: 'Écoute des étoiles',
      duration: '20 min',
      safety: 'dans les bras de Morphée',
      discovered_treasures: 1
    },
    magical: {
      spirit_animal: 'Luciole',
      constellation: 'Pléiades',
      element: 'Lumière',
      spell_known: 'Scintillement doux'
    },
    emergency: {
      allergies: 'Lune trop pleine',
      medical: 'Berceuse des anges',
      contact_parent: '+33645678901',
      groupe_sang: 'B+',
      emergency_potion: 'Potion de sommeil'
    }
  },
  {
    id: '5',
    name: 'Marc l\'Explorateur',
    role: 'Maître des Sentiers',
    department: 'Guilde des Aventuriers',
    avatar: 'https://picsum.photos/seed/marc-magical/400/400.jpg',
    status: 'online',
    rssi: -44.00,
    battery: 82,
    zone: 'Sentier Mystérieux',
    phone: '+33656789012',
    age: 28,
    sos: false,
    level: 'explorateur-chevalier',
    magic_level: 'intermédiaire',
    health: {
      heartRate: 74,
      stress: 18,
      focus: 88,
      energy: 94,
      mood: 'courageux',
      activity: 'cartographie magique',
      magic_power: 45
    },
    activities: {
      favorites: ['Cartes anciennes', 'Découvertes secrètes', 'Guides stellaires'],
      current: 'Création de carte magique',
      duration: '2h',
      safety: 'boussole enchantée',
      discovered_treasures: 28
    },
    magical: {
      spirit_animal: 'Renard des étoiles',
      constellation: 'Grande Ourse',
      element: 'Feu',
      spell_known: 'Éclaireur nocturne'
    },
    emergency: {
      allergies: 'Aucune',
      medical: 'Élixir d\'aventure',
      contact_parent: '+33656789012',
      groupe_sang: 'A+',
      emergency_potion: 'Potion de force'
    }
  },
  {
    id: '6',
    name: 'Léa la Sorcière',
    role: 'Apprentie Sorcière Lunaire',
    department: 'Cercle des Sorciers',
    avatar: 'https://picsum.photos/seed/lea-magical/400/400.jpg',
    status: 'offline',
    rssi: -88.00,
    battery: 18,
    zone: 'Tour des Étoiles',
    phone: '+33667890123',
    parent: 'Jean le Magicien',
    age: 16,
    sos: false,
    level: 'sorciere-ado',
    magic_level: 'avancé',
    health: {
      heartRate: 71,
      stress: 30,
      focus: 72,
      energy: 28,
      mood: 'mystérieuse',
      activity: 'lecture de grimoires',
      magic_power: 65
    },
    activities: {
      favorites: ['Sortilèges avancés', 'Alchimie lunaire', 'Divination'],
      current: 'Méditation sous les étoiles',
      duration: '1h45',
      safety: 'cercle de protection',
      discovered_treasures: 15
    },
    magical: {
      spirit_animal: 'Chouette des nuits',
      constellation: 'Cassiopée',
      element: 'Eau',
      spell_known: 'Vision nocturne'
    },
    emergency: {
      allergies: 'Poussière d\'étoiles',
      medical: 'Philtre de clarté',
      contact_parent: '+33667890123',
      groupe_sang: 'AB+',
      emergency_potion: 'Potion de sagesse'
    }
  }
];

// Composant d'étoiles animées corrigé
function StarField({ animated }) {
  const [stars, setStars] = React.useState([]);
  
  React.useEffect(() => {
    const generatedStars = [...Array(30)].map(() => ({
      id: Math.random().toString(),
      x: Math.random() * width,
      y: Math.random() * height * 0.6,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.8 + 0.2,
    }));
    setStars(generatedStars);
  }, []);

  return (
    <View style={styles.starField}>
      {stars.map((star) => (
        <View
          key={star.id}
          style={[
            styles.star,
            {
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
            }
          ]}
        />
      ))}
    </View>
  );
}

// Composant de lune animée corrigé
function AnimatedMoon({ phase }) {
  const moonGlow = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(moonGlow, {
          toValue: 0.8,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(moonGlow, {
          toValue: 0.3,
          duration: 3000,
          useNativeDriver: true,
        })
      ])
    );
    glowAnimation.start();
    return () => glowAnimation.stop();
  }, []);

  return (
    <Animated.View style={[styles.moonContainer, { opacity: moonGlow }]}>
      <View style={styles.moon}>
        <View style={styles.moonCrater1} />
        <View style={styles.moonCrater2} />
        <View style={styles.moonCrater3} />
      </View>
      <Animated.View 
        style={[
          styles.moonGlow,
          { opacity: Animated.add(0.2, moonGlow) }
        ]} 
      />
    </Animated.View>
  );
}

// Écran Login magique corrigé
function LoginScreen({ onLoginSuccess }) {
  const [email, setEmail] = useState('foret@magie.com');
  const [password, setPassword] = useState('etoile2024');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('✨ Attention', 'La magie nécessite des mots secrets complets');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      if (email === 'foret@magie.com' && password === 'etoile2024') {
        onLoginSuccess({ 
          name: 'Gardien de la Forêt Magique', 
          email: email,
          role: 'maître-des-étoiles',
          level: 'archimage',
          avatar: 'https://picsum.photos/seed/guardian-magical/400/400.jpg'
        });
      } else {
        Alert.alert('🌙 Sortilège Échoué', 'Les mots secrets ne correspondent pas à la magie de la forêt');
      }
      setIsLoading(false);
    }, 2500);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1f" />
      
      {/* Background magique avec étoiles */}
      <LinearGradient
        colors={['#0a0f1f', '#1a1f3f', '#2d2f5f']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <StarField animated={true} />
      <AnimatedMoon phase="full" />
      
      {/* Feux de camp simplifiés */}
      <View style={styles.campfireContainer}>
        <View style={styles.campfire}>
          <View style={styles.flame1} />
          <View style={styles.flame2} />
          <View style={styles.flame3} />
        </View>
      </View>

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
          {/* Header Magique */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['#9333ea', '#7c3aed', '#6d28d9']}
                style={styles.logoGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.logo}>🌲</Text>
              </LinearGradient>
            </View>
            <Text style={styles.title}>FORÊT MAGIQUE</Text>
            <Text style={styles.subtitle}>Portail de Surveillance Nocturne</Text>
            <View style={styles.magicalBadges}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>🌙 Nuit Étoilée</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>✨ Magie Ancienne</Text>
              </View>
            </View>
          </View>

          {/* Formulaire Magique */}
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>🔮 PORTAIL MYSTIQUE</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>📜 Parchemin Secret</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail" size={20} color="#a78bfa" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="foret@magie.com"
                  placeholderTextColor="#a78bfa"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading}
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>🗝️ Clé Lunaire</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} color="#a78bfa" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="•••••••••"
                  placeholderTextColor="#a78bfa"
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
                    color="#a78bfa" 
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
                colors={isLoading ? ['#6b7280', '#4b5563'] : ['#9333ea', '#7c3aed', '#6d28d9']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? '🌙 OUVERTURE DU PORTAIL...' : '✨ ENTRER DANS LA FORÊT'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.magicalInfo}>
              <Text style={styles.magicalText}>🌲 {MAGICAL_PARTICIPANTS.length} âmes dans la forêt</Text>
              <Text style={styles.magicalText}>✨ {MAGICAL_PARTICIPANTS.filter(p => p.magic_level !== 'débutant').length} magiciens actifs</Text>
              <Text style={styles.magicalText}>🌙 Protection lunaire activée</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// Écran Home magique corrigé
function HomeScreen({ user, onLogout }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [participants, setParticipants] = useState(MAGICAL_PARTICIPANTS);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const scrollY = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
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
            energy: Math.max(0.1, participant.health.energy - Math.random() * 0.05),
            magic_power: Math.max(0, Math.min(100, participant.health.magic_power + (Math.random() - 0.5) * 10))
          }
        }))
      );
      setRefreshing(false);
    }, 2000);
  };

  const getFilteredParticipants = () => {
    switch (selectedFilter) {
      case 'enfants':
        return participants.filter(p => p.level === 'petit-loup' || p.level === 'etoile-enfant');
      case 'apprentis':
        return participants.filter(p => p.level === 'fee-apprentie' || p.level === 'sorciere-ado');
      case 'maitres':
        return participants.filter(p => p.level === 'gardien-ancien' || p.level === 'explorateur-chevalier');
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
      case 'online': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'offline': return '#64748b';
      default: return '#64748b';
    }
  };

  const getMagicColor = (level) => {
    switch (level) {
      case 'archimage': return '#dc2626';
      case 'maître': return '#9333ea';
      case 'intermédiaire': return '#3b82f6';
      case 'apprenti': return '#10b981';
      case 'novice': return '#f59e0b';
      case 'débutant': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getMagicIcon = (level) => {
    switch (level) {
      case 'archimage': return '🧙‍♂️';
      case 'maître': return '🔮';
      case 'intermédiaire': return '⭐';
      case 'apprenti': return '🌟';
      case 'novice': return '✨';
      case 'débutant': return '💫';
      default: return '👤';
    }
  };

  const getMagicTitle = (level) => {
    switch (level) {
      case 'archimage': return 'Archimage';
      case 'maître': return 'Maître Magicien';
      case 'intermédiaire': return 'Magicien Confirmé';
      case 'apprenti': return 'Apprenti Magicien';
      case 'novice': return 'Novice';
      case 'débutant': return 'Débutant';
      default: return 'Mystérieux';
    }
  };

  const filteredParticipants = getFilteredParticipants();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1f" />
      
      {/* Background magique */}
      <LinearGradient
        colors={['#0a0f1f', '#1a1f3f', '#2d2f5f']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <StarField animated={true} />
      <AnimatedMoon phase="full" />
      
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
            colors={['#9333ea', '#7c3aed', '#6d28d9']}
            tintColor="#9333ea"
          />
        }
      >
        {/* Header Magique */}
        <View style={styles.dashboardHeader}>
          <LinearGradient
            colors={['rgba(147, 51, 234, 0.1)', 'rgba(124, 58, 237, 0.1)', 'rgba(109, 40, 217, 0.1)']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.userInfo}>
              <Image source={{ uri: user?.avatar }} style={styles.userAvatar} />
              <View style={styles.userDetails}>
                <Text style={styles.greeting}>Bonsoir, {user?.name || 'Gardien'}</Text>
                <Text style={styles.userRole}>{user?.role || 'Maître des Étoiles'}</Text>
                <Text style={styles.time}>🌙 {currentTime.toLocaleTimeString()}</Text>
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

        {/* Statistiques Magiques */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>📊 ROYAUME MAGIQUE</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#9333ea', '#7c3aed', '#6d28d9']}
                style={styles.statCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.statValue}>{participants.length}</Text>
                <Text style={styles.statLabel}>Âmes Magiques</Text>
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
                <Text style={styles.statValue}>{participants.filter(p => p.age <= 12).length}</Text>
                <Text style={styles.statLabel}>Petits Mages</Text>
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
                <Text style={styles.statLabel}>Appels Magiques</Text>
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
                <Text style={styles.statValue}>{Math.round(participants.reduce((sum, p) => sum + p.health.magic_power, 0) / participants.length)}%</Text>
                <Text style={styles.statLabel}>Puissance Totale</Text>
                <Ionicons name="flash" size={24} color="rgba(255,255,255,0.3)" style={styles.statIcon} />
              </LinearGradient>
            </View>
          </View>
        </View>

        {/* Filtres Magiques */}
        <View style={styles.filtersSection}>
          <Text style={styles.sectionTitle}>🔍 FILTRES ENCHANTÉS</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollContainer}
          >
            {['all', 'enfants', 'apprentis', 'maitres', 'online', 'warning', 'offline', 'sos'].map((filter) => (
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
                    colors={['#9333ea', '#7c3aed', '#6d28d9']}
                    style={styles.filterGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.activeFilterText}>
                      {filter === 'all' && '🌲 Tous'}
                      {filter === 'enfants' && '👶 Enfants'}
                      {filter === 'apprentis' && '🌟 Apprentis'}
                      {filter === 'maitres' && '🧙‍♂️ Maîtres'}
                      {filter === 'online' && '✅ Actifs'}
                      {filter === 'warning' && '⚠️ Attention'}
                      {filter === 'offline' && '❌ Endormis'}
                      {filter === 'sos' && '🚨 SOS'}
                    </Text>
                  </LinearGradient>
                ) : (
                  <Text style={styles.filterText}>
                    {filter === 'all' && '🌲 Tous'}
                    {filter === 'enfants' && '👶 Enfants'}
                    {filter === 'apprentis' && '🌟 Apprentis'}
                    {filter === 'maitres' && '🧙‍♂️ Maîtres'}
                    {filter === 'online' && '✅ Actifs'}
                    {filter === 'warning' && '⚠️ Attention'}
                    {filter === 'offline' && '❌ Endormis'}
                    {filter === 'sos' && '🚨 SOS'}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Liste des participants magiques */}
        <View style={styles.participantsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>✨ HABITANTS DE LA FORÊT</Text>
            <Text style={styles.participantCount}>{filteredParticipants.length} âmes</Text>
          </View>
          
          {filteredParticipants.map((participant) => (
            <TouchableOpacity
              key={participant.id}
              style={styles.participantCard}
              onPress={() => console.log('Profil magique:', participant.id)}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['rgba(30, 41, 59, 0.95)', 'rgba(15, 23, 42, 0.95)', 'rgba(109, 40, 217, 0.1)']}
                style={styles.participantCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.participantHeader}>
                  <View style={styles.avatarContainer}>
                    <Image source={{ uri: participant.avatar }} style={styles.participantAvatar} />
                    <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(participant.status) }]} />
                    <View style={[styles.magicBadge, { backgroundColor: getMagicColor(participant.magic_level) }]}>
                      <Text style={styles.magicBadgeText}>{getMagicIcon(participant.magic_level)}</Text>
                    </View>
                    {/* Aura magique simplifiée */}
                    {participant.sos && (
                      <View style={[styles.magicAura, { borderColor: getMagicColor(participant.magic_level) }]} />
                    )}
                  </View>
                  <View style={styles.participantInfo}>
                    <Text style={styles.participantName}>{participant.name}</Text>
                    <Text style={styles.participantRole}>{participant.role}</Text>
                    <Text style={styles.participantMagic}>🎓 {getMagicTitle(participant.magic_level)}</Text>
                    <Text style={styles.participantAge}>🎂 {participant.age} ans</Text>
                    {participant.parent && (
                      <Text style={styles.participantParent}>👨‍👩‍👧‍👦 Gardien: {participant.parent}</Text>
                    )}
                    <View style={styles.participantStatus}>
                      <View style={[styles.statusDot, { backgroundColor: getStatusColor(participant.status) }]} />
                      <Text style={[styles.statusText, { color: getStatusColor(participant.status) }]}>
                        {participant.status === 'online' ? '🟢 Actif' : 
                         participant.status === 'warning' ? '🟡 Fatigué' : '🔴 Endormi'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.participantStats}>
                    <Text style={styles.participantRSSI}>{participant.rssi.toFixed(2)} dBm</Text>
                    <View style={styles.batteryContainer}>
                      <Text style={styles.participantBattery}>{participant.battery}%</Text>
                      <View style={[styles.batteryBar, { width: `${participant.battery}%` }]} />
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#a78bfa" />
                  </View>
                </View>
                
                {/* Santé et Magie */}
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
                    <Text style={styles.healthLabel}>Cœur</Text>
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
                      colors={['#9333ea', '#7c3aed']}
                      style={styles.healthIcon}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Ionicons name="sparkles" size={16} color="white" />
                    </LinearGradient>
                    <Text style={styles.healthValue}>{Math.round(participant.health.magic_power)}%</Text>
                    <Text style={styles.healthLabel}>Magie</Text>
                  </View>
                  <View style={styles.healthItem}>
                    <LinearGradient
                      colors={['#3b82f6', '#1d4ed8']}
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
                
                {/* Activités Magiques */}
                <View style={styles.activitiesContainer}>
                  <Text style={styles.activitiesTitle}>🎯 AVENTURES MAGIQUES</Text>
                  <View style={styles.activitiesInfo}>
                    <Text style={styles.currentActivity}>📍 Actuel: {participant.activities.current}</Text>
                    <Text style={styles.activityDuration}>⏱️ {participant.activities.duration}</Text>
                    <Text style={styles.activitySafety}>🛡️ {participant.activities.safety}</Text>
                    <Text style={styles.discoveredTreasures}>💎 Trésors: {participant.activities.discovered_treasures}</Text>
                  </View>
                  <View style={styles.favoritesActivities}>
                    <Text style={styles.favoritesTitle}>❤️ Sortilèges Préférés:</Text>
                    <View style={styles.favoritesList}>
                      {participant.activities.favorites.map((fav, index) => (
                        <Text key={index} style={styles.favoriteItem}>{fav}</Text>
                      ))}
                    </View>
                  </View>
                </View>
                
                {/* Informations Magiques */}
                <View style={styles.magicalContainer}>
                  <Text style={styles.magicalTitle}>🔮 DONNÉES MAGIQUES</Text>
                  <View style={styles.magicalInfo}>
                    <Text style={styles.magicalItem}>🦮 Animal Spirit: {participant.magical.spirit_animal}</Text>
                    <Text style={styles.magicalItem}>⭐ Constellation: {participant.magical.constellation}</Text>
                    <Text style={styles.magicalItem}>🌍 Élément: {participant.magical.element}</Text>
                    <Text style={styles.magicalItem}>📜 Sort: {participant.magical.spell_known}</Text>
                  </View>
                </View>
                
                {/* Informations médicales magiques */}
                <View style={styles.emergencyContainer}>
                  <Text style={styles.emergencyTitle}>🚨 POTIONS D'URGENCE</Text>
                  <View style={styles.emergencyInfo}>
                    <Text style={styles.emergencyItem}>🌿 Allergies: {participant.emergency.allergies}</Text>
                    <Text style={styles.emergencyItem}>🧪 Traitement: {participant.emergency.medical}</Text>
                    <Text style={styles.emergencyItem}>📞 Gardien: {participant.emergency.contact_parent}</Text>
                    <Text style={styles.emergencyItem}>🩸 Groupe: {participant.emergency.groupe_sang}</Text>
                    <Text style={styles.emergencyItem}>⚗️ Potion: {participant.emergency.emergency_potion}</Text>
                  </View>
                </View>
                
                {participant.sos && (
                  <TouchableOpacity style={styles.sosButton}>
                    <LinearGradient
                      colors={['#ef4444', '#dc2626', '#b91c1c']}
                      style={styles.sosGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Ionicons name="warning" size={20} color="white" />
                      <Text style={styles.sosText}>🚨 APPEL MAGIQUE URGENT</Text>
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

// App principal magique corrigé
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
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
        <StatusBar barStyle="light-content" backgroundColor="#0a0f1f" />
        <LinearGradient
          colors={['#0a0f1f', '#1a1f3f', '#2d2f5f']}
          style={styles.background}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <StarField animated={true} />
        <AnimatedMoon phase="full" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingLogo}>🌲</Text>
          <Text style={styles.loadingText}>FORÊT MAGIQUE</Text>
          <Text style={styles.loadingSubtext}>Réveil des esprits forestiers...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1f" />
      <LinearGradient
        colors={['#0a0f1f', '#1a1f3f', '#2d2f5f']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <StarField animated={true} />
      <AnimatedMoon phase="full" />
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
    backgroundColor: '#0a0f1f',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  
  // Étoiles animées corrigées
  starField: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.6,
  },
  star: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    borderRadius: 50,
  },
  
  // Lune animée corrigée
  moonContainer: {
    position: 'absolute',
    top: 60,
    right: 40,
    width: 80,
    height: 80,
  },
  moon: {
    width: 60,
    height: 60,
    backgroundColor: '#fbbf24',
    borderRadius: 30,
    position: 'absolute',
    top: 10,
    left: 10,
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 15,
  },
  moonCrater1: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: '#f59e0b',
    borderRadius: 4,
    top: 15,
    left: 20,
  },
  moonCrater2: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: '#f59e0b',
    borderRadius: 3,
    top: 30,
    left: 35,
  },
  moonCrater3: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: '#f59e0b',
    borderRadius: 5,
    top: 40,
    left: 15,
  },
  moonGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    backgroundColor: '#fbbf24',
    borderRadius: 50,
    top: -10,
    left: -10,
    opacity: 0.2,
  },
  
  // Feu de camp simplifié
  campfireContainer: {
    position: 'absolute',
    bottom: 100,
    left: 40,
    width: 60,
    height: 80,
  },
  campfire: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    width: 40,
    height: 60,
  },
  flame1: {
    position: 'absolute',
    width: 20,
    height: 40,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    bottom: 0,
    left: 10,
    opacity: 0.8,
  },
  flame2: {
    position: 'absolute',
    width: 15,
    height: 30,
    backgroundColor: '#f59e0b',
    borderRadius: 8,
    bottom: 10,
    left: 5,
    opacity: 0.9,
  },
  flame3: {
    position: 'absolute',
    width: 12,
    height: 25,
    backgroundColor: '#fbbf24',
    borderRadius: 6,
    bottom: 15,
    left: 20,
    opacity: 0.7,
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
    color: '#9333ea',
    marginBottom: 10,
    textShadowColor: 'rgba(147, 51, 234, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 15,
  },
  loadingSubtext: {
    fontSize: 18,
    color: '#a78bfa',
    fontStyle: 'italic',
  },
  
  // Login Styles Magiques corrigés
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
    borderWidth: 4,
    borderColor: 'rgba(147, 51, 234, 0.4)',
    shadowColor: '#9333ea',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.5,
    shadowRadius: 25,
    elevation: 15,
  },
  logo: {
    fontSize: 60,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textShadowColor: 'rgba(147, 51, 234, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 15,
  },
  subtitle: {
    fontSize: 18,
    color: '#a78bfa',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  magicalBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  badge: {
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(147, 51, 234, 0.4)',
  },
  badgeText: {
    fontSize: 12,
    color: '#a78bfa',
    fontWeight: '600',
  },
  
  // Formulaire Magique corrigé
  form: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 28,
    padding: 40,
    borderWidth: 2,
    borderColor: 'rgba(147, 51, 234, 0.3)',
    shadowColor: '#9333ea',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 25,
    textAlign: 'center',
    textShadowColor: 'rgba(147, 51, 234, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  inputGroup: {
    marginBottom: 28,
  },
  inputLabel: {
    fontSize: 16,
    color: '#a78bfa',
    marginBottom: 10,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'rgba(147, 51, 234, 0.3)',
  },
  inputIcon: {
    padding: 18,
  },
  input: {
    flex: 1,
    padding: 18,
    color: '#ffffff',
    fontSize: 16,
    borderRadius: 18,
  },
  eyeIcon: {
    padding: 18,
  },
  loginButton: {
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 25,
    shadowColor: '#9333ea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  loginButtonDisabled: {
    shadowColor: '#6b7280',
    shadowOpacity: 0.2,
  },
  buttonGradient: {
    paddingVertical: 20,
    alignItems: 'center',
    borderRadius: 18,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  magicalInfo: {
    alignItems: 'center',
    gap: 10,
  },
  magicalText: {
    fontSize: 14,
    color: '#a78bfa',
    fontStyle: 'italic',
  },
  
  // Dashboard Styles Magiques corrigés
  dashboardContainer: {
    flex: 1,
  },
  dashboardScrollContainer: {
    padding: 20,
  },
  dashboardHeader: {
    borderRadius: 24,
    marginBottom: 30,
    overflow: 'hidden',
  },
  headerGradient: {
    padding: 25,
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
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: 'rgba(147, 51, 234, 0.4)',
    marginRight: 18,
  },
  userDetails: {
    flex: 1,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 3,
  },
  userRole: {
    fontSize: 16,
    color: '#a78bfa',
    marginBottom: 3,
  },
  time: {
    fontSize: 14,
    color: '#6b7280',
  },
  logoutButton: {
    borderRadius: 22,
    overflow: 'hidden',
  },
  logoutGradient: {
    padding: 15,
    borderRadius: 22,
  },
  
  // Stats Section corrigée
  statsSection: {
    marginBottom: 35,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  statCard: {
    flex: 1,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#9333ea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  statCardGradient: {
    padding: 22,
    alignItems: 'center',
    position: 'relative',
  },
  statValue: {
    fontSize: 30,
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
    top: 18,
    right: 18,
  },
  
  // Filters Section corrigée
  filtersSection: {
    marginBottom: 35,
  },
  filterScrollContainer: {
    paddingHorizontal: 5,
  },
  filterButton: {
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'rgba(147, 51, 234, 0.3)',
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    marginRight: 12,
  },
  activeFilter: {
    borderColor: 'transparent',
  },
  filterGradient: {
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 22,
  },
  filterText: {
    fontSize: 14,
    color: '#a78bfa',
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  
  // Participants Section corrigée
  participantsSection: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  participantCount: {
    fontSize: 14,
    color: '#a78bfa',
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  
  // Participant Cards Magiques corrigées
  participantCard: {
    borderRadius: 24,
    marginBottom: 25,
    overflow: 'hidden',
    shadowColor: '#9333ea',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 10,
  },
  participantCardGradient: {
    padding: 25,
  },
  participantHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 18,
  },
  participantAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: 'rgba(147, 51, 234, 0.4)',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 3,
    right: 3,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 3,
    borderColor: '#0a0f1f',
  },
  magicBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0a0f1f',
  },
  magicBadgeText: {
    fontSize: 14,
  },
  magicAura: {
    position: 'absolute',
    top: -15,
    left: -15,
    right: -15,
    bottom: -15,
    borderRadius: 50,
    borderWidth: 3,
    borderStyle: 'dashed',
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  participantRole: {
    fontSize: 16,
    color: '#9333ea',
    marginBottom: 4,
  },
  participantMagic: {
    fontSize: 14,
    color: '#a78bfa',
    marginBottom: 3,
  },
  participantAge: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 3,
  },
  participantParent: {
    fontSize: 13,
    color: '#3b82f6',
    marginBottom: 6,
  },
  participantStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  participantStats: {
    alignItems: 'flex-end',
    gap: 6,
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
    marginBottom: 3,
  },
  batteryBar: {
    height: 3,
    backgroundColor: '#9333ea',
    borderRadius: 2,
    minWidth: 25,
  },
  
  // Health Container corrigé
  healthContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  healthItem: {
    alignItems: 'center',
    flex: 1,
  },
  healthIcon: {
    width: 45,
    height: 45,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  healthValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 3,
  },
  healthLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  
  // Activities Container corrigé
  activitiesContainer: {
    marginBottom: 20,
  },
  activitiesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  activitiesInfo: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 14,
    padding: 15,
    marginBottom: 12,
  },
  currentActivity: {
    fontSize: 13,
    color: '#10b981',
    marginBottom: 3,
  },
  activityDuration: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 3,
  },
  activitySafety: {
    fontSize: 13,
    color: '#3b82f6',
    marginBottom: 3,
  },
  discoveredTreasures: {
    fontSize: 13,
    color: '#f59e0b',
  },
  favoritesActivities: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 14,
    padding: 15,
  },
  favoritesTitle: {
    fontSize: 13,
    color: '#a78bfa',
    marginBottom: 8,
  },
  favoritesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  favoriteItem: {
    fontSize: 11,
    color: '#ffffff',
    backgroundColor: 'rgba(147, 51, 234, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  
  // Magical Container corrigé
  magicalContainer: {
    marginBottom: 20,
  },
  magicalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  magicalInfo: {
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
    borderRadius: 14,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(147, 51, 234, 0.3)',
  },
  magicalItem: {
    fontSize: 13,
    color: '#a78bfa',
    marginBottom: 3,
  },
  
  // Emergency Container corrigé
  emergencyContainer: {
    marginBottom: 15,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  emergencyInfo: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 14,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  emergencyItem: {
    fontSize: 13,
    color: '#ef4444',
    marginBottom: 2,
  },
  
  // SOS Button corrigé
  sosButton: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  sosGradient: {
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  sosText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

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

// Données des membres avec design expert
const EXPERT_MEMBERS = [
  {
    id: '1',
    name: 'Alexandre Dubois',
    role: 'Chef de Groupe',
    department: 'Direction Stratégique',
    avatar: 'https://picsum.photos/seed/alexandre-expert/400/400.jpg',
    status: 'online',
    rssi: -50.00,
    battery: 90,
    zone: 'Zone Alpha - Commandement',
    phone: '+33612345678',
    email: 'alexandre.dubois@rssi.com',
    sos: false,
    level: 'expert',
    rank: 5,
    health: {
      heartRate: 72,
      stress: 20,
      focus: 90,
      energy: 85,
      mood: 'focused',
      productivity: 95
    },
    stats: {
      missions: 127,
      success: 98,
      rating: 4.9,
      experience: 8.5
    },
    skills: [
      { name: 'Leadership', level: 95, icon: '👑', color: '#8b5cf6' },
      { name: 'Stratégie', level: 90, icon: '🎯', color: '#3b82f6' },
      { name: 'Communication', level: 88, icon: '📢', color: '#10b981' },
      { name: 'Analyse', level: 92, icon: '📊', color: '#f59e0b' },
      { name: 'Innovation', level: 85, icon: '💡', color: '#ef4444' }
    ]
  },
  {
    id: '2',
    name: 'Sarah Martin',
    role: 'Agent de Sécurité Spécialisée',
    department: 'Sécurité Avancée',
    avatar: 'https://picsum.photos/seed/sarah-expert/400/400.jpg',
    status: 'online',
    rssi: -72.00,
    battery: 60,
    zone: 'Zone Beta - Périmètre Sécurisé',
    phone: '+33623456789',
    email: 'sarah.martin@rssi.com',
    sos: false,
    level: 'senior',
    rank: 4,
    health: {
      heartRate: 85,
      stress: 40,
      focus: 80,
      energy: 75,
      mood: 'alert',
      productivity: 88
    },
    stats: {
      missions: 89,
      success: 96,
      rating: 4.7,
      experience: 6.2
    },
    skills: [
      { name: 'Sécurité', level: 95, icon: '🛡️', color: '#ef4444' },
      { name: 'Détection', level: 88, icon: '🔍', color: '#f59e0b' },
      { name: 'Combat', level: 82, icon: '⚔️', color: '#dc2626' },
      { name: 'Tactique', level: 90, icon: '🎖️', color: '#7c3aed' },
      { name: 'Équipement', level: 85, icon: '⚙️', color: '#6b7280' }
    ]
  },
  {
    id: '3',
    name: 'Thomas Bernard',
    role: 'Ingénieur RSSI Expert',
    department: 'Technologie & Innovation',
    avatar: 'https://picsum.photos/seed/thomas-expert/400/400.jpg',
    status: 'warning',
    rssi: -85.00,
    battery: 30,
    zone: 'Zone Gamma - Laboratoire Tech',
    phone: '+33634567890',
    email: 'thomas.bernard@rssi.com',
    sos: true,
    level: 'expert',
    rank: 5,
    health: {
      heartRate: 95,
      stress: 60,
      focus: 70,
      energy: 40,
      mood: 'stressed',
      productivity: 65
    },
    stats: {
      missions: 156,
      success: 94,
      rating: 4.8,
      experience: 9.1
    },
    skills: [
      { name: 'Réseaux', level: 96, icon: '🌐', color: '#0ea5e9' },
      { name: 'RSSI', level: 98, icon: '📡', color: '#06b6d4' },
      { name: 'IoT', level: 92, icon: '📱', color: '#10b981' },
      { name: 'Cryptographie', level: 88, icon: '🔐', color: '#6366f1' },
      { name: 'IA', level: 85, icon: '🤖', color: '#8b5cf6' }
    ]
  },
  {
    id: '4',
    name: 'Marie Laurent',
    role: 'Médecin Chef d\'Urgence',
    department: 'Santé & Médecine',
    avatar: 'https://picsum.photos/seed/marie-expert/400/400.jpg',
    status: 'offline',
    rssi: -95.00,
    battery: 15,
    zone: 'Zone Delta - Centre Médical',
    phone: '+33645678901',
    email: 'marie.laurent@rssi.com',
    sos: false,
    level: 'master',
    rank: 6,
    health: {
      heartRate: 68,
      stress: 10,
      focus: 60,
      energy: 30,
      mood: 'calm',
      productivity: 78
    },
    stats: {
      missions: 203,
      success: 99,
      rating: 4.9,
      experience: 12.3
    },
    skills: [
      { name: 'Médecine', level: 98, icon: '⚕️', color: '#dc2626' },
      { name: 'Urgences', level: 96, icon: '🚑', color: '#ef4444' },
      { name: 'Chirurgie', level: 90, icon: '🔪', color: '#991b1b' },
      { name: 'Diagnostic', level: 94, icon: '🔬', color: '#7c2d12' },
      { name: 'Télé-médecine', level: 85, icon: '📹', color: '#1e40af' }
    ]
  },
  {
    id: '5',
    name: 'Jean-Pierre Rousseau',
    role: 'Directeur Logistique',
    department: 'Opérations & Supply Chain',
    avatar: 'https://picsum.photos/seed/jeanpierre-expert/400/400.jpg',
    status: 'online',
    rssi: -68.00,
    battery: 75,
    zone: 'Zone Epsilon - Hub Logistique',
    phone: '+33656789012',
    email: 'jeanpierre.rousseau@rssi.com',
    sos: false,
    level: 'senior',
    rank: 4,
    health: {
      heartRate: 70,
      stress: 20,
      focus: 85,
      energy: 80,
      mood: 'organized',
      productivity: 92
    },
    stats: {
      missions: 178,
      success: 97,
      rating: 4.7,
      experience: 7.8
    },
    skills: [
      { name: 'Logistique', level: 94, icon: '📦', color: '#059669' },
      { name: 'Coordination', level: 90, icon: '🔄', color: '#0891b2' },
      { name: 'Planification', level: 88, icon: '📅', color: '#1e40af' },
      { name: 'Gestion', level: 86, icon: '📊', color: '#7c3aed' },
      { name: 'Transport', level: 92, icon: '🚚', color: '#ea580c' }
    ]
  },
  {
    id: '6',
    name: 'Isabelle Moreau',
    role: 'Directrice Communications',
    department: 'Communication & Médias',
    avatar: 'https://picsum.photos/seed/isabelle-expert/400/400.jpg',
    status: 'online',
    rssi: -58.00,
    battery: 88,
    zone: 'Zone Zeta - Centre de Communications',
    phone: '+33667890123',
    email: 'isabelle.moreau@rssi.com',
    sos: false,
    level: 'expert',
    rank: 5,
    health: {
      heartRate: 75,
      stress: 15,
      focus: 90,
      energy: 90,
      mood: 'connected',
      productivity: 96
    },
    stats: {
      missions: 134,
      success: 98,
      rating: 4.8,
      experience: 8.2
    },
    skills: [
      { name: 'Communication', level: 98, icon: '📢', color: '#dc2626' },
      { name: 'Médias', level: 92, icon: '📺', color: '#ea580c' },
      { name: 'Relations Publiques', level: 88, icon: '🤝', color: '#0891b2' },
      { name: 'Stratégie', level: 90, icon: '🎯', color: '#7c3aed' },
      { name: 'Créativité', level: 94, icon: '🎨', color: '#db2777' }
    ]
  }
];

// Écran Login avec design expert
function LoginScreen({ onLoginSuccess }) {
  const [email, setEmail] = useState('admin@rssi.com');
  const [password, setPassword] = useState('admin123');
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
      if (email === 'admin@rssi.com' && password === 'admin123') {
        onLoginSuccess({ 
          name: 'Administrateur Principal', 
          email: email,
          role: 'super-admin',
          level: 'master',
          avatar: 'https://picsum.photos/seed/admin-expert/400/400.jpg'
        });
      } else {
        Alert.alert('❌ Erreur d\'Authentification', 'Email ou mot de passe incorrect');
      }
      setIsLoading(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      
      {/* Background animé */}
      <LinearGradient
        colors={['#0a0a0a', '#1a1a2e', '#16213e']}
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
          {/* Header Premium */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['#3b82f6', '#8b5cf6', '#ec4899']}
                style={styles.logoGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.logo}>🛡️</Text>
              </LinearGradient>
            </View>
            <Text style={styles.title}>RSSI SUPERVISION</Text>
            <Text style={styles.subtitle}>Système de Surveillance Avancée v3.0</Text>
            <View style={styles.badges}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>🔐 SÉCURISÉ</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>⚡ PERFORMANCE</Text>
              </View>
            </View>
          </View>

          {/* Formulaire Premium */}
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>🔐 IDENTIFICATION</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Professionnel</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail" size={20} color="#6b7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="admin@rssi.com"
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
                colors={isLoading ? ['#6b7280', '#4b5563'] : ['#3b82f6', '#8b5cf6']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {isLoading ? (
                  <Text style={styles.buttonText}>🔄 AUTHENTIFICATION...</Text>
                ) : (
                  <Text style={styles.buttonText}>🚀 SE CONNECTER</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.securityInfo}>
              <Text style={styles.securityText}>🔒 Connexion sécurisée 256-bit</Text>
              <Text style={styles.securityText}>🛡️ Protection anti-intrusion</Text>
              <Text style={styles.securityText}>📊 Accès aux données en temps réel</Text>
            </View>
          </View>

          {/* Stats Premium */}
          <View style={styles.statsFooter}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>6</Text>
              <Text style={styles.statLabel}>Experts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>98%</Text>
              <Text style={styles.statLabel}>Uptime</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>-50</Text>
              <Text style={styles.statLabel}>RSSI dBm</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>24/7</Text>
              <Text style={styles.statLabel}>Monitoring</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// Écran Home avec design expert
function HomeScreen({ user, onLogout }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [members, setMembers] = useState(EXPERT_MEMBERS);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedMember, setSelectedMember] = useState(null);
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
      setMembers(prevMembers => 
        prevMembers.map(member => ({
          ...member,
          rssi: Math.max(-120, Math.min(-30, member.rssi + (Math.random() - 0.5) * 5)),
          battery: Math.max(0, Math.min(100, member.battery - Math.random() * 2)),
          health: {
            ...member.health,
            heartRate: Math.floor(60 + Math.random() * 40),
            stress: Math.random() * 0.5,
            energy: Math.max(0.1, member.health.energy - Math.random() * 0.05),
            productivity: Math.max(50, Math.min(100, member.health.productivity + (Math.random() - 0.5) * 10))
          }
        }))
      );
      setRefreshing(false);
    }, 2000);
  };

  const getFilteredMembers = () => {
    switch (selectedFilter) {
      case 'online':
        return members.filter(m => m.status === 'online');
      case 'warning':
        return members.filter(m => m.status === 'warning');
      case 'offline':
        return members.filter(m => m.status === 'offline');
      case 'sos':
        return members.filter(m => m.sos === true);
      case 'expert':
        return members.filter(m => m.level === 'expert' || m.level === 'master');
      default:
        return members;
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
      case 'master': return '#dc2626';
      case 'expert': return '#8b5cf6';
      case 'senior': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'master': return '🏆';
      case 'expert': return '⭐';
      case 'senior': return '🥈';
      default: return '🥉';
    }
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const filteredMembers = getFilteredMembers();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      
      {/* Background premium */}
      <LinearGradient
        colors={['#0a0a0a', '#1a1a2e', '#16213e']}
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
            colors={['#3b82f6', '#8b5cf6']}
            tintColor="#3b82f6"
          />
        }
      >
        {/* Header Premium avec animation */}
        <Animated.View style={[styles.dashboardHeader, { opacity: headerOpacity }]}>
          <LinearGradient
            colors={['rgba(59, 130, 246, 0.1)', 'rgba(139, 92, 246, 0.1)']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.userInfo}>
              <Image source={{ uri: user?.avatar }} style={styles.userAvatar} />
              <View style={styles.userDetails}>
                <Text style={styles.greeting}>Bonjour, {user?.name || 'Admin'}</Text>
                <Text style={styles.userRole}>{user?.role || 'Super Administrateur'}</Text>
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
        </Animated.View>

        {/* Statistiques Premium */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>📊 TABLEAU DE BORD EXPERT</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#3b82f6', '#1d4ed8']}
                style={styles.statCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.statValue}>{members.length}</Text>
                <Text style={styles.statLabel}>Opérateurs</Text>
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
                <Text style={styles.statValue}>{members.filter(m => m.status === 'online').length}</Text>
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
                <Text style={styles.statValue}>{members.filter(m => m.sos === true).length}</Text>
                <Text style={styles.statLabel}>Alertes</Text>
                <Ionicons name="warning" size={24} color="rgba(255,255,255,0.3)" style={styles.statIcon} />
              </LinearGradient>
            </View>
            
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#8b5cf6', '#7c3aed']}
                style={styles.statCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.statValue}>-50.00</Text>
                <Text style={styles.statLabel}>RSSI dBm</Text>
                <Ionicons name="wifi" size={24} color="rgba(255,255,255,0.3)" style={styles.statIcon} />
              </LinearGradient>
            </View>
          </View>
        </View>

        {/* Filtres Premium */}
        <View style={styles.filtersSection}>
          <Text style={styles.sectionTitle}>🔍 FILTRES INTELLIGENTS</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollContainer}
          >
            {['all', 'online', 'warning', 'offline', 'sos', 'expert'].map((filter) => (
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
                    colors={['#3b82f6', '#8b5cf6']}
                    style={styles.filterGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.activeFilterText}>
                      {filter === 'all' && '🌐 Tous'}
                      {filter === 'online' && '✅ Actifs'}
                      {filter === 'warning' && '⚠️ Attention'}
                      {filter === 'offline' && '❌ Hors ligne'}
                      {filter === 'sos' && '🚨 SOS'}
                      {filter === 'expert' && '⭐ Experts'}
                    </Text>
                  </LinearGradient>
                ) : (
                  <Text style={styles.filterText}>
                    {filter === 'all' && '🌐 Tous'}
                    {filter === 'online' && '✅ Actifs'}
                    {filter === 'warning' && '⚠️ Attention'}
                    {filter === 'offline' && '❌ Hors ligne'}
                    {filter === 'sos' && '🚨 SOS'}
                    {filter === 'expert' && '⭐ Experts'}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Liste des membres Premium */}
        <View style={styles.membersSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>👥 ÉLITE D'OPÉRATEURS</Text>
            <Text style={styles.memberCount}>{filteredMembers.length} membres</Text>
          </View>
          
          {filteredMembers.map((member, index) => (
            <TouchableOpacity
              key={member.id}
              style={styles.memberCard}
              onPress={() => setSelectedMember(member)}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['rgba(30, 41, 59, 0.9)', 'rgba(15, 23, 42, 0.9)']}
                style={styles.memberCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.memberHeader}>
                  <View style={styles.avatarContainer}>
                    <Image source={{ uri: member.avatar }} style={styles.memberAvatar} />
                    <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(member.status) }]} />
                    <View style={[styles.levelBadge, { backgroundColor: getLevelColor(member.level) }]}>
                      <Text style={styles.levelBadgeText}>{getLevelIcon(member.level)}</Text>
                    </View>
                  </View>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberRole}>{member.role}</Text>
                    <Text style={styles.memberDepartment}>{member.department}</Text>
                    <View style={styles.memberStatus}>
                      <View style={[styles.statusDot, { backgroundColor: getStatusColor(member.status) }]} />
                      <Text style={[styles.statusText, { color: getStatusColor(member.status) }]}>
                        {member.status === 'online' ? '🟢 Actif' : 
                         member.status === 'warning' ? '🟡 Attention' : '🔴 Hors ligne'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.memberStats}>
                    <Text style={styles.memberRSSI}>{member.rssi.toFixed(2)} dBm</Text>
                    <View style={styles.batteryContainer}>
                      <Text style={styles.memberBattery}>{member.battery}%</Text>
                      <View style={[styles.batteryBar, { width: `${member.battery}%` }]} />
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#6b7280" />
                  </View>
                </View>
                
                {/* Biométrie Premium */}
                <View style={styles.bioContainer}>
                  <View style={styles.bioItem}>
                    <LinearGradient
                      colors={['#ef4444', '#dc2626']}
                      style={styles.bioIcon}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Ionicons name="heart" size={16} color="white" />
                    </LinearGradient>
                    <Text style={styles.bioValue}>{member.health.heartRate}</Text>
                    <Text style={styles.bioLabel}>BPM</Text>
                  </View>
                  <View style={styles.bioItem}>
                    <LinearGradient
                      colors={['#f59e0b', '#d97706']}
                      style={styles.bioIcon}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Ionicons name="pulse" size={16} color="white" />
                    </LinearGradient>
                    <Text style={styles.bioValue}>{Math.round(member.health.stress * 100)}%</Text>
                    <Text style={styles.bioLabel}>Stress</Text>
                  </View>
                  <View style={styles.bioItem}>
                    <LinearGradient
                      colors={['#3b82f6', '#1d4ed8']}
                      style={styles.bioIcon}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Ionicons name="eye" size={16} color="white" />
                    </LinearGradient>
                    <Text style={styles.bioValue}>{Math.round(member.health.focus * 100)}%</Text>
                    <Text style={styles.bioLabel}>Focus</Text>
                  </View>
                  <View style={styles.bioItem}>
                    <LinearGradient
                      colors={['#10b981', '#059669']}
                      style={styles.bioIcon}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Ionicons name="battery-charging" size={16} color="white" />
                    </LinearGradient>
                    <Text style={styles.bioValue}>{Math.round(member.health.energy * 100)}%</Text>
                    <Text style={styles.bioLabel}>Énergie</Text>
                  </View>
                  <View style={styles.bioItem}>
                    <LinearGradient
                      colors={['#8b5cf6', '#7c3aed']}
                      style={styles.bioIcon}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Ionicons name="trending-up" size={16} color="white" />
                    </LinearGradient>
                    <Text style={styles.bioValue}>{Math.round(member.health.productivity)}%</Text>
                    <Text style={styles.bioLabel}>Productivité</Text>
                  </View>
                </View>
                
                {/* Compétences principales */}
                <View style={styles.skillsPreview}>
                  <Text style={styles.skillsTitle}>🎯 Compétences Principales</Text>
                  <View style={styles.skillsList}>
                    {member.skills.slice(0, 3).map((skill, skillIndex) => (
                      <View key={skillIndex} style={styles.skillItem}>
                        <Text style={styles.skillIcon}>{skill.icon}</Text>
                        <Text style={styles.skillName}>{skill.name}</Text>
                        <View style={styles.skillLevel}>
                          <Text style={styles.skillLevelText}>{skill.level}%</Text>
                          <View style={[styles.skillBar, { width: `${skill.level}%`, backgroundColor: skill.color }]} />
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
                
                {member.sos && (
                  <TouchableOpacity style={styles.sosButton}>
                    <LinearGradient
                      colors={['#ef4444', '#dc2626']}
                      style={styles.sosGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Ionicons name="warning" size={20} color="white" />
                      <Text style={styles.sosText}>🚨 ALERTE SOS IMMÉDIATE</Text>
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

// App principal avec design expert
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
        <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
        <LinearGradient
          colors={['#0a0a0a', '#1a1a2e', '#16213e']}
          style={styles.background}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingLogo}>🛡️</Text>
          <Text style={styles.loadingText}>RSSI SUPERVISION</Text>
          <Text style={styles.loadingSubtext}>Chargement du système expert...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <LinearGradient
        colors={['#0a0a0a', '#1a1a2e', '#16213e']}
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
    backgroundColor: '#0a0a0a',
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
    color: '#3b82f6',
    marginBottom: 10,
    textShadowColor: 'rgba(59, 130, 246, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  loadingSubtext: {
    fontSize: 16,
    color: '#94a3b8',
  },
  
  // Login Styles Expert
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
    shadowColor: '#3b82f6',
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
    textShadowColor: 'rgba(59, 130, 246, 0.5)',
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
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.4)',
  },
  badgeText: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '600',
  },
  
  // Formulaire Expert
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
  securityInfo: {
    alignItems: 'center',
    gap: 8,
  },
  securityText: {
    fontSize: 12,
    color: '#6b7280',
  },
  
  // Stats Footer
  statsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 450,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  
  // Dashboard Styles Expert
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
  
  // Members Section
  membersSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  memberCount: {
    fontSize: 14,
    color: '#6b7280',
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  
  // Member Cards Expert
  memberCard: {
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  memberCardGradient: {
    padding: 20,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  memberAvatar: {
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
    borderColor: '#0a0a0a',
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
    borderColor: '#0a0a0a',
  },
  levelBadgeText: {
    fontSize: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 3,
  },
  memberRole: {
    fontSize: 14,
    color: '#3b82f6',
    marginBottom: 3,
  },
  memberDepartment: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 5,
  },
  memberStatus: {
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
  memberStats: {
    alignItems: 'flex-end',
    gap: 5,
  },
  memberRSSI: {
    fontSize: 12,
    color: '#6b7280',
  },
  batteryContainer: {
    alignItems: 'flex-end',
  },
  memberBattery: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  batteryBar: {
    height: 3,
    backgroundColor: '#10b981',
    borderRadius: 2,
    minWidth: 20,
  },
  
  // Bio Container
  bioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 10,
  },
  bioItem: {
    alignItems: 'center',
    flex: 1,
  },
  bioIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  bioValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  bioLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  
  // Skills Preview
  skillsPreview: {
    marginBottom: 10,
  },
  skillsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  skillsList: {
    gap: 8,
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 12,
    padding: 8,
  },
  skillIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  skillName: {
    fontSize: 12,
    color: '#ffffff',
    flex: 1,
  },
  skillLevel: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  skillLevelText: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 2,
  },
  skillBar: {
    height: 3,
    borderRadius: 2,
    minWidth: 30,
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

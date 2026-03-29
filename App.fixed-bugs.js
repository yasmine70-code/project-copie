import React, { useState, useEffect } from 'react';
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
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Données des membres simplifiées et stables
const STABLE_MEMBERS = [
  {
    id: '1',
    name: 'Alexandre Dubois',
    role: 'Chef de Groupe',
    avatar: 'https://picsum.photos/seed/alexandre/200/200.jpg',
    status: 'online',
    rssi: -50.00,
    battery: 90,
    zone: 'Zone A',
    phone: '+33612345678',
    sos: false,
    health: {
      heartRate: 72,
      stress: 20,
      focus: 90,
      energy: 85
    }
  },
  {
    id: '2',
    name: 'Sarah Martin',
    role: 'Agent de Sécurité',
    avatar: 'https://picsum.photos/seed/sarah/200/200.jpg',
    status: 'online',
    rssi: -72.00,
    battery: 60,
    zone: 'Zone B',
    phone: '+33623456789',
    sos: false,
    health: {
      heartRate: 85,
      stress: 40,
      focus: 80,
      energy: 75
    }
  },
  {
    id: '3',
    name: 'Thomas Bernard',
    role: 'Technicien RSSI',
    avatar: 'https://picsum.photos/seed/thomas/200/200.jpg',
    status: 'warning',
    rssi: -85.00,
    battery: 30,
    zone: 'Zone C',
    phone: '+33634567890',
    sos: true,
    health: {
      heartRate: 95,
      stress: 60,
      focus: 70,
      energy: 40
    }
  },
  {
    id: '4',
    name: 'Marie Laurent',
    role: 'Médical d\'Urgence',
    avatar: 'https://picsum.photos/seed/marie/200/200.jpg',
    status: 'offline',
    rssi: -95.00,
    battery: 15,
    zone: 'Zone D',
    phone: '+33645678901',
    sos: false,
    health: {
      heartRate: 68,
      stress: 10,
      focus: 60,
      energy: 30
    }
  },
  {
    id: '5',
    name: 'Jean-Pierre Rousseau',
    role: 'Agent Logistique',
    avatar: 'https://picsum.photos/seed/jeanpierre/200/200.jpg',
    status: 'online',
    rssi: -68.00,
    battery: 75,
    zone: 'Zone E',
    phone: '+33656789012',
    sos: false,
    health: {
      heartRate: 70,
      stress: 20,
      focus: 85,
      energy: 80
    }
  },
  {
    id: '6',
    name: 'Isabelle Moreau',
    role: 'Communications',
    avatar: 'https://picsum.photos/seed/isabelle/200/200.jpg',
    status: 'online',
    rssi: -58.00,
    battery: 88,
    zone: 'Zone F',
    phone: '+33667890123',
    sos: false,
    health: {
      heartRate: 75,
      stress: 15,
      focus: 90,
      energy: 90
    }
  }
];

// Écran Login corrigé
function LoginScreen({ onLoginSuccess }) {
  const [email, setEmail] = useState('admin@rssi.com');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    
    // Validation simple
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      setIsLoading(false);
      return;
    }

    // Simulation de connexion
    setTimeout(() => {
      if (email === 'admin@rssi.com' && password === 'admin123') {
        onLoginSuccess({ 
          name: 'Administrateur', 
          email: email,
          role: 'admin'
        });
      } else {
        Alert.alert('Erreur', 'Email ou mot de passe incorrect');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      <ScrollView contentContainerStyle={styles.loginScrollContainer}>
        <View style={styles.loginContainer}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>🛡️</Text>
            </View>
            <Text style={styles.title}>RSSI SUPERVISION</Text>
            <Text style={styles.subtitle}>Système de Surveillance des Équipes</Text>
            <View style={styles.versionBadge}>
              <Text style={styles.versionText}>v2.0.1</Text>
            </View>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Email professionnel</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="admin@rssi.com"
              placeholderTextColor="#64748b"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
            
            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="admin123"
              placeholderTextColor="#64748b"
              secureTextEntry
              editable={!isLoading}
            />
            
            <TouchableOpacity 
              style={[styles.button, isLoading && styles.buttonDisabled]} 
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Connexion...' : 'SE CONNECTER'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.info}>
            <Text style={styles.infoText}>📊 RSSI: -50.00 dBm</Text>
            <Text style={styles.infoText}>👥 6 membres actifs</Text>
            <Text style={styles.infoText}>🌐 Port: 8083</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// Écran Home corrigé
function HomeScreen({ user, onLogout }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [members, setMembers] = useState(STABLE_MEMBERS);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      // Simuler la mise à jour des données
      setMembers(prevMembers => 
        prevMembers.map(member => ({
          ...member,
          rssi: Math.max(-120, Math.min(-30, member.rssi + (Math.random() - 0.5) * 5)),
          battery: Math.max(0, Math.min(100, member.battery - Math.random() * 2)),
          lastSeen: new Date(),
          health: {
            ...member.health,
            heartRate: Math.floor(60 + Math.random() * 40),
            stress: Math.random() * 0.5,
            energy: Math.max(0.1, member.health.energy - Math.random() * 0.05)
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

  const getStatusText = (status) => {
    switch (status) {
      case 'online': return 'Actif';
      case 'warning': return 'Attention';
      case 'offline': return 'Hors ligne';
      default: return 'Inconnu';
    }
  };

  const handleMemberPress = (member) => {
    setSelectedMember(member);
    Alert.alert(
      `Profil de ${member.name}`,
      `Voir le profil détaillé de ${member.name} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Voir profil', onPress: () => console.log('Navigation vers profil:', member.id) }
      ]
    );
  };

  const handleSOS = (member) => {
    Alert.alert(
      'Alerte SOS',
      `${member.name} a déclenché une alerte SOS !`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Intervenir', onPress: () => console.log('Intervention SOS pour:', member.id) }
      ]
    );
  };

  const filteredMembers = getFilteredMembers();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      <ScrollView
        style={styles.dashboardContainer}
        contentContainerStyle={styles.dashboardScrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.dashboardHeader}>
          <View>
            <Text style={styles.greeting}>Bonjour, {user?.name || 'Admin'}</Text>
            <Text style={styles.time}>{currentTime.toLocaleTimeString()}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Ionicons name="log-out" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Statistiques */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{members.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{members.filter(m => m.status === 'online').length}</Text>
            <Text style={styles.statLabel}>Actifs</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{members.filter(m => m.sos === true).length}</Text>
            <Text style={styles.statLabel}>Alertes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>-50.00</Text>
            <Text style={styles.statLabel}>RSSI moy</Text>
          </View>
        </View>

        {/* Filtres */}
        <View style={styles.filtersContainer}>
          <Text style={styles.sectionTitle}>🔍 Filtres</Text>
          <View style={styles.filterButtons}>
            {['all', 'online', 'warning', 'offline', 'sos'].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  selectedFilter === filter && styles.activeFilter
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text style={[
                  styles.filterText,
                  selectedFilter === filter && styles.activeFilterText
                ]}>
                  {filter === 'all' && 'Tous'}
                  {filter === 'online' && 'Actifs'}
                  {filter === 'warning' && 'Attention'}
                  {filter === 'offline' && 'Hors ligne'}
                  {filter === 'sos' && 'SOS'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Liste des membres */}
        <View style={styles.membersList}>
          <Text style={styles.sectionTitle}>👥 Équipe ({filteredMembers.length})</Text>
          
          {filteredMembers.map((member) => (
            <TouchableOpacity
              key={member.id}
              style={styles.memberCard}
              onPress={() => handleMemberPress(member)}
              activeOpacity={0.8}
            >
              <View style={styles.memberHeader}>
                <View style={styles.avatarContainer}>
                  <Image source={{ uri: member.avatar }} style={styles.memberAvatar} />
                  <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(member.status) }]} />
                </View>
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberRole}>{member.role}</Text>
                  <View style={styles.memberStatus}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(member.status) }]} />
                    <Text style={[styles.statusText, { color: getStatusColor(member.status) }]}>
                      {getStatusText(member.status)}
                    </Text>
                  </View>
                </View>
                <View style={styles.memberStats}>
                  <Text style={styles.memberRSSI}>{member.rssi.toFixed(2)} dBm</Text>
                  <Text style={styles.memberBattery}>{member.battery}%</Text>
                  <Ionicons name="chevron-forward" size={16} color="#64748b" />
                </View>
              </View>
              
              <View style={styles.memberBio}>
                <View style={styles.bioItem}>
                  <Ionicons name="heart" size={16} color="#ef4444" />
                  <Text style={styles.bioValue}>{member.health.heartRate}</Text>
                </View>
                <View style={styles.bioItem}>
                  <Ionicons name="pulse" size={16} color="#f59e0b" />
                  <Text style={styles.bioValue}>{Math.round(member.health.stress * 100)}%</Text>
                </View>
                <View style={styles.bioItem}>
                  <Ionicons name="battery-charging" size={16} color="#10b981" />
                  <Text style={styles.bioValue}>{Math.round(member.health.energy * 100)}%</Text>
                </View>
                <View style={styles.bioItem}>
                  <Ionicons name="location" size={16} color="#3b82f6" />
                  <Text style={styles.bioValue}>{member.zone}</Text>
                </View>
              </View>
              
              {member.sos && (
                <TouchableOpacity 
                  style={styles.sosButton} 
                  onPress={() => handleSOS(member)}
                >
                  <Ionicons name="warning" size={16} color="white" />
                  <Text style={styles.sosText}>ALERTE SOS</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// App principal corrigé
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simuler le chargement initial
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLoginSuccess = (userData) => {
    try {
      setIsAuthenticated(true);
      setUser(userData);
      setError(null);
    } catch (err) {
      console.error('Erreur login:', err);
      setError('Erreur lors de la connexion');
    }
  };

  const handleLogout = () => {
    try {
      setIsAuthenticated(false);
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Erreur logout:', err);
      setError('Erreur lors de la déconnexion');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>🛡️ RSSI SUPERVISION</Text>
          <Text style={styles.loadingSubtext}>Chargement...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌ {error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              setLoading(true);
              setTimeout(() => setLoading(false), 1000);
            }}
          >
            <Text style={styles.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#3b82f6',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  loadingSubtext: {
    color: '#94a3b8',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Login Styles
  loginScrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  loginContainer: {
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  logo: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 15,
  },
  versionBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.4)',
  },
  versionText: {
    color: '#8b5cf6',
    fontSize: 12,
    fontWeight: '600',
  },
  form: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 20,
    padding: 30,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: 15,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 12,
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#64748b',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  info: {
    alignItems: 'center',
  },
  infoText: {
    color: '#10b981',
    fontSize: 14,
    marginBottom: 5,
  },
  
  // Dashboard Styles
  dashboardContainer: {
    flex: 1,
  },
  dashboardScrollContainer: {
    padding: 20,
  },
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  time: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    padding: 10,
    borderRadius: 20,
  },
  
  // Stats
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  
  // Filters
  filtersContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  activeFilter: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: 'rgba(59, 130, 246, 0.4)',
  },
  filterText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#3b82f6',
  },
  
  // Members List
  membersList: {
    marginBottom: 20,
  },
  memberCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#0f172a',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  memberRole: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 4,
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
  },
  memberRSSI: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  memberBattery: {
    fontSize: 12,
    color: '#64748b',
  },
  memberBio: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  bioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bioValue: {
    fontSize: 12,
    color: '#94a3b8',
    marginLeft: 4,
  },
  sosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    borderRadius: 8,
    padding: 8,
  },
  sosText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

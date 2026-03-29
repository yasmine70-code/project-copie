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
  RefreshControl,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { MEMBERS_PROFILES, getMembersByStatus, getMembersWithSOS } from './data/members-profiles';

const { width, height } = Dimensions.get('window');

// Écran Login
function LoginScreen({ onLoginSuccess }) {
  const [email, setEmail] = React.useState('admin@rssi.com');
  const [password, setPassword] = React.useState('admin123');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (email === 'admin@rssi.com' && password === 'admin123') {
        onLoginSuccess({ name: 'Administrateur', email: email });
      } else {
        Alert.alert('Erreur', 'Identifiants incorrects');
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
            />
            
            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="admin123"
              placeholderTextColor="#64748b"
              secureTextEntry
            />
            
            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
              <Text style={styles.buttonText}>
                {isLoading ? 'Connexion...' : 'SE CONNECTER'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.info}>
            <Text style={styles.infoText}>📊 RSSI: -50.00 dBm</Text>
            <Text style={styles.infoText}>👥 6 membres actifs</Text>
            <Text style={styles.infoText}>🌐 Port: 8800</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// Écran Home avec profils
function HomeScreen({ user, onLogout }) {
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [refreshing, setRefreshing] = React.useState(false);
  const [members, setMembers] = React.useState(MEMBERS_PROFILES);
  const [selectedFilter, setSelectedFilter] = React.useState('all');

  React.useEffect(() => {
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
        return getMembersByStatus('online');
      case 'warning':
        return getMembersByStatus('warning');
      case 'offline':
        return getMembersByStatus('offline');
      case 'sos':
        return getMembersWithSOS();
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
            <Text style={styles.greeting}>Bonjour, {user?.name}</Text>
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
            <Text style={styles.statValue}>{getMembersByStatus('online').length}</Text>
            <Text style={styles.statLabel}>Actifs</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{getMembersWithSOS().length}</Text>
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
            >
              <View style={styles.memberHeader}>
                <Image source={{ uri: member.avatar }} style={styles.memberAvatar} />
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
                  <Text style={styles.bioValue}>{member.zone.split(' - ')[0]}</Text>
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

// App principal
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
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
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>🛡️ RSSI SUPERVISION</Text>
          <Text style={styles.loadingSubtext}>Chargement...</Text>
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
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
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

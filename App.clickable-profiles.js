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
            <Text style={styles.infoText}>🌐 Port: 8081</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// Écran Home avec profils cliquables
function HomeScreen({ user, onLogout, navigation }) {
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
    // Navigation vers le profil détaillé
    navigation.navigate('MemberProfile', { memberId: member.id });
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

        {/* Liste des membres avec profils cliquables */}
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

// Écran Profil Détaillé
function MemberProfileScreen({ route, navigation }) {
  const { memberId } = route.params;
  const [member, setMember] = React.useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('overview');

  React.useEffect(() => {
    const memberData = MEMBERS_PROFILES.find(m => m.id === memberId);
    setMember(memberData);
  }, [memberId]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      if (member) {
        setMember({
          ...member,
          lastSeen: new Date(),
          health: {
            ...member.health,
            heartRate: Math.floor(60 + Math.random() * 40),
            stress: Math.random() * 0.5,
            energy: Math.max(0.1, member.health.energy - Math.random() * 0.05)
          }
        });
      }
      setRefreshing(false);
    }, 2000);
  };

  const handleCall = () => {
    Alert.alert('Appel', `Appeler ${member?.phone} ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Appeler', onPress: () => console.log('Appel') }
    ]);
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

  if (!member) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <Text style={styles.loadingText}>Chargement du profil...</Text>
      </View>
    );
  }

  const renderOverview = () => (
    <View style={styles.overviewContainer}>
      {/* Carte de statut */}
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <View style={styles.statusIndicator}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(member.status) }]} />
            <Text style={[styles.statusText, { color: getStatusColor(member.status) }]}>
              {getStatusText(member.status)}
            </Text>
          </View>
          <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
            <Ionicons name="refresh" size={20} color="#3b82f6" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.statusGrid}>
          <View style={styles.statusItem}>
            <Text style={styles.statusValue}>{member.rssi.toFixed(2)}</Text>
            <Text style={styles.statusLabel}>RSSI dBm</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusValue}>{member.battery}%</Text>
            <Text style={styles.statusLabel}>Batterie</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusValue}>{member.zone.split(' - ')[0]}</Text>
            <Text style={styles.statusLabel}>Zone</Text>
          </View>
        </View>
      </View>

      {/* Biométrie */}
      <View style={styles.bioCard}>
        <Text style={styles.cardTitle}>📊 Biométrie</Text>
        <View style={styles.bioGrid}>
          <View style={styles.bioItem}>
            <Ionicons name="heart" size={20} color="#ef4444" />
            <Text style={styles.bioValue}>{member.health.heartRate}</Text>
            <Text style={styles.bioLabel}>BPM</Text>
          </View>
          <View style={styles.bioItem}>
            <Ionicons name="pulse" size={20} color="#f59e0b" />
            <Text style={styles.bioValue}>{Math.round(member.health.stress * 100)}%</Text>
            <Text style={styles.bioLabel}>Stress</Text>
          </View>
          <View style={styles.bioItem}>
            <Ionicons name="eye" size={20} color="#3b82f6" />
            <Text style={styles.bioValue}>{Math.round(member.health.focus * 100)}%</Text>
            <Text style={styles.bioLabel}>Focus</Text>
          </View>
          <View style={styles.bioItem}>
            <Ionicons name="battery-charging" size={20} color="#10b981" />
            <Text style={styles.bioValue}>{Math.round(member.health.energy * 100)}%</Text>
            <Text style={styles.bioLabel}>Énergie</Text>
          </View>
        </View>
      </View>

      {/* Informations personnelles */}
      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>👤 Informations Personnelles</Text>
        <View style={styles.infoList}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Âge</Text>
            <Text style={styles.infoValue}>{member.age} ans</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Date de naissance</Text>
            <Text style={styles.infoValue}>{new Date(member.birthDate).toLocaleDateString('fr-FR')}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{member.email}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Téléphone</Text>
            <Text style={styles.infoValue}>{member.phone}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Adresse</Text>
            <Text style={styles.infoValue}>{member.address}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderSkills = () => (
    <View style={styles.skillsContainer}>
      <Text style={styles.cardTitle}>🎯 Compétences</Text>
      {member.skills.map((skill, index) => (
        <View key={index} style={styles.skillItem}>
          <View style={styles.skillHeader}>
            <Text style={styles.skillIcon}>{skill.icon}</Text>
            <Text style={styles.skillName}>{skill.name}</Text>
            <Text style={styles.skillLevel}>{skill.level}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[styles.progressFill, { width: `${skill.level}%` }]} 
            />
          </View>
        </View>
      ))}
    </View>
  );

  const renderHistory = () => (
    <View style={styles.historyContainer}>
      <Text style={styles.cardTitle}>📈 Historique</Text>
      <View style={styles.historyGrid}>
        <View style={styles.historyItem}>
          <Text style={styles.historyValue}>{member.history.missions}</Text>
          <Text style={styles.historyLabel}>Missions</Text>
        </View>
        <View style={styles.historyItem}>
          <Text style={styles.historyValue}>{member.history.interventions}</Text>
          <Text style={styles.historyLabel}>Interventions</Text>
        </View>
        <View style={styles.historyItem}>
          <Text style={styles.historyValue}>{member.history.awards}</Text>
          <Text style={styles.historyLabel}>Récompenses</Text>
        </View>
        <View style={styles.historyItem}>
          <Text style={styles.historyValue}>{member.history.rating}</Text>
          <Text style={styles.historyLabel}>Note</Text>
        </View>
      </View>
      
      <View style={styles.joinDateCard}>
        <Text style={styles.joinDateLabel}>Date d'arrivée</Text>
        <Text style={styles.joinDateValue}>
          {new Date(member.history.joinDate).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </Text>
      </View>
    </View>
  );

  const renderEquipment = () => (
    <View style={styles.equipmentContainer}>
      <Text style={styles.cardTitle}>🔧 Équipement</Text>
      <View style={styles.equipmentCard}>
        <View style={styles.equipmentItem}>
          <Text style={styles.equipmentLabel}>Appareil</Text>
          <Text style={styles.equipmentValue}>{member.equipment.device}</Text>
        </View>
        <View style={styles.equipmentItem}>
          <Text style={styles.equipmentLabel}>Modèle</Text>
          <Text style={styles.equipmentValue}>{member.equipment.deviceModel}</Text>
        </View>
        <View style={styles.equipmentItem}>
          <Text style={styles.equipmentLabel}>Numéro de série</Text>
          <Text style={styles.equipmentValue}>{member.equipment.serialNumber}</Text>
        </View>
        <View style={styles.equipmentItem}>
          <Text style={styles.equipmentLabel}>Firmware</Text>
          <Text style={styles.equipmentValue}>{member.equipment.firmware}</Text>
        </View>
        <View style={styles.equipmentItem}>
          <Text style={styles.equipmentLabel}>Dernière mise à jour</Text>
          <Text style={styles.equipmentValue}>
            {new Date(member.equipment.lastUpdate).toLocaleString('fr-FR')}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      {/* Header avec photo de couverture */}
      <View style={styles.headerContainer}>
        <Image source={{ uri: member.coverPhoto }} style={styles.coverPhoto} />
        <View style={styles.headerOverlay}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
                <Ionicons name="call" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Avatar et informations principales */}
      <View style={styles.profileHeader}>
        <Image source={{ uri: member.avatar }} style={styles.avatar} />
        <View style={styles.profileInfo}>
          <Text style={styles.memberName}>{member.name}</Text>
          <Text style={styles.memberRole}>{member.role}</Text>
          <Text style={styles.memberDepartment}>{member.department}</Text>
        </View>
        {member.sos && (
          <TouchableOpacity style={styles.sosButton}>
            <Ionicons name="warning" size={16} color="white" />
            <Text style={styles.sosText}>SOS</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Onglets */}
      <View style={styles.tabsContainer}>
        {['overview', 'skills', 'history', 'equipment'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab === 'overview' && '📊 Vue d\'ensemble'}
              {tab === 'skills' && '🎯 Compétences'}
              {tab === 'history' && '📈 Historique'}
              {tab === 'equipment' && '🔧 Équipement'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Contenu selon l'onglet actif */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'skills' && renderSkills()}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'equipment' && renderEquipment()}
      </ScrollView>
    </View>
  );
}

// App principal avec navigation
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

  // Navigation simple sans React Navigation
  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // État de navigation
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedMember, setSelectedMember] = useState(null);

  if (currentScreen === 'profile' && selectedMember) {
    return (
      <MemberProfileScreen 
        route={{ params: { memberId: selectedMember } }}
        navigation={{ 
          goBack: () => setCurrentScreen('home'),
          navigate: (screen, params) => {
            if (screen === 'MemberProfile') {
              setSelectedMember(params.memberId);
              setCurrentScreen('profile');
            }
          }
        }}
      />
    );
  }

  return (
    <HomeScreen 
      user={user} 
      onLogout={handleLogout} 
      navigation={{ 
        navigate: (screen, params) => {
          if (screen === 'MemberProfile') {
            setSelectedMember(params.memberId);
            setCurrentScreen('profile');
          }
        }
      }} 
    />
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
  
  // Profile Screen Styles
  headerContainer: {
    position: 'relative',
    height: 200,
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop: 50,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: -50,
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#0f172a',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 20,
  },
  memberName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 16,
    color: '#3b82f6',
    marginBottom: 4,
  },
  memberDepartment: {
    fontSize: 14,
    color: '#94a3b8',
  },
  
  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  activeTab: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: 'rgba(59, 130, 246, 0.4)',
  },
  tabText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#3b82f6',
  },
  
  // Content
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  
  // Profile Cards
  overviewContainer: {
    gap: 20,
  },
  statusCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  refreshButton: {
    padding: 8,
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusItem: {
    alignItems: 'center',
  },
  statusValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  statusLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  
  bioCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  bioGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bioItem: {
    alignItems: 'center',
  },
  bioValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 4,
  },
  bioLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  
  infoCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  infoList: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.1)',
  },
  infoLabel: {
    fontSize: 14,
    color: '#94a3b8',
  },
  infoValue: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  
  // Skills
  skillsContainer: {
    gap: 16,
  },
  skillItem: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  skillIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  skillName: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
    flex: 1,
  },
  skillLevel: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 3,
  },
  
  // History
  historyContainer: {
    gap: 16,
  },
  historyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  historyItem: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  historyValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  historyLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  joinDateCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  joinDateLabel: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 4,
  },
  joinDateValue: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  
  // Equipment
  equipmentContainer: {
    gap: 16,
  },
  equipmentCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    gap: 12,
  },
  equipmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.1)',
  },
  equipmentLabel: {
    fontSize: 14,
    color: '#94a3b8',
  },
  equipmentValue: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
});

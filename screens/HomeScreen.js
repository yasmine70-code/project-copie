import React, { useState, useEffect } from 'react';
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
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Données des membres corrigées
const MEMBERS_DATA = [
  {
    id: '1',
    name: 'Alexandre Dubois',
    role: 'Chef de Groupe',
    avatar: 'https://picsum.photos/seed/alexandre/200/200.jpg',
    status: 'online',
    rssi: -50.00,
    battery: 90,
    zone: 'Zone A - Commandement',
    lastSeen: new Date(),
    phone: '+33612345678',
    sos: false
  },
  {
    id: '2',
    name: 'Sarah Martin',
    role: 'Agent de Sécurité',
    avatar: 'https://picsum.photos/seed/sarah/200/200.jpg',
    status: 'online',
    rssi: -72.00,
    battery: 60,
    zone: 'Zone B - Périmètre Avancé',
    lastSeen: new Date(),
    phone: '+33623456789',
    sos: false
  },
  {
    id: '3',
    name: 'Thomas Bernard',
    role: 'Technicien RSSI',
    avatar: 'https://picsum.photos/seed/thomas/200/200.jpg',
    status: 'warning',
    rssi: -85.00,
    battery: 30,
    zone: 'Zone C - Laboratoire',
    lastSeen: new Date(Date.now() - 300000),
    phone: '+33634567890',
    sos: true
  },
  {
    id: '4',
    name: 'Marie Laurent',
    role: 'Médical d\'Urgence',
    avatar: 'https://picsum.photos/seed/marie/200/200.jpg',
    status: 'offline',
    rssi: -95.00,
    battery: 15,
    zone: 'Zone D - Centre Médical',
    lastSeen: new Date(Date.now() - 600000),
    phone: '+33645678901',
    sos: false
  },
  {
    id: '5',
    name: 'Jean-Pierre Rousseau',
    role: 'Agent Logistique',
    avatar: 'https://picsum.photos/seed/jeanpierre/200/200.jpg',
    status: 'online',
    rssi: -68.00,
    battery: 75,
    zone: 'Zone E - Hub Logistique',
    lastSeen: new Date(),
    phone: '+33656789012',
    sos: false
  },
  {
    id: '6',
    name: 'Isabelle Moreau',
    role: 'Communications',
    avatar: 'https://picsum.photos/seed/isabelle/200/200.jpg',
    status: 'online',
    rssi: -58.00,
    battery: 88,
    zone: 'Zone F - Centre de Communication',
    lastSeen: new Date(),
    phone: '+33667890123',
    sos: false
  }
];

export default function HomeScreen({ navigation, user, onLogout }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [members, setMembers] = useState(MEMBERS_DATA);
  const [systemStats, setSystemStats] = useState({
    onlineCount: 0,
    avgRSSI: 0,
    avgBattery: 0,
    sosCount: 0
  });

  useEffect(() => {
    // Mise à jour du temps
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Mise à jour des statistiques
    updateStats();

    // Simulation de données en temps réel
    const dataTimer = setInterval(() => {
      updateRealTimeData();
    }, 10000);

    return () => {
      clearInterval(timer);
      clearInterval(dataTimer);
    };
  }, []);

  const updateStats = () => {
    const onlineCount = members.filter(m => m.status === 'online').length;
    const avgRSSI = members.reduce((sum, m) => sum + m.rssi, 0) / members.length;
    const avgBattery = members.reduce((sum, m) => sum + m.battery, 0) / members.length;
    const sosCount = members.filter(m => m.sos).length;

    setSystemStats({
      onlineCount,
      avgRSSI: avgRSSI.toFixed(2),
      avgBattery: avgBattery.toFixed(0),
      sosCount
    });
  };

  const updateRealTimeData = () => {
    setMembers(prevMembers => 
      prevMembers.map(member => ({
        ...member,
        rssi: Math.max(-120, Math.min(-30, member.rssi + (Math.random() - 0.5) * 5)),
        battery: Math.max(0, Math.min(100, member.battery - Math.random() * 2)),
        lastSeen: new Date()
      }))
    );
  };

  const handleRefresh = () => {
    setRefreshing(true);
    updateRealTimeData();
    updateStats();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getStatusColor = (member) => {
    if (member.sos) return '#ef4444';
    if (member.status === 'online') return '#10b981';
    if (member.status === 'warning') return '#f59e0b';
    return '#64748b';
  };

  const getStatusText = (member) => {
    if (member.sos) return 'SOS';
    if (member.status === 'online') return 'Actif';
    if (member.status === 'warning') return 'Attention';
    return 'Hors ligne';
  };

  const handleCall = (phone) => {
    Alert.alert('Appel', `Appel du ${phone}...`);
  };

  const handleSOS = (member) => {
    Alert.alert(
      'Alerte SOS',
      `${member.name} a déclenché une alerte SOS !`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Intervenir', onPress: () => console.log('Intervention') }
      ]
    );
  };

  const renderMemberCard = (member) => (
    <View key={member.id} style={styles.memberCard}>
      <View style={styles.memberHeader}>
        <Image source={{ uri: member.avatar }} style={styles.memberAvatar} />
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{member.name}</Text>
          <Text style={styles.memberRole}>{member.role}</Text>
          <View style={styles.memberStatus}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(member) }]} />
            <Text style={[styles.statusText, { color: getStatusColor(member) }]}>
              {getStatusText(member)}
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.memberAction}
          onPress={() => navigation.navigate('Dashboard', { selectedMember: member })}
        >
          <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.memberStats}>
        <View style={styles.memberStat}>
          <Ionicons name="wifi" size={16} color="#64748b" />
          <Text style={styles.memberStatText}>{member.rssi.toFixed(2)} dBm</Text>
        </View>
        <View style={styles.memberStat}>
          <Ionicons name="battery-half" size={16} color="#64748b" />
          <Text style={styles.memberStatText}>{Math.round(member.battery)}%</Text>
        </View>
        <View style={styles.memberStat}>
          <Ionicons name="location" size={16} color="#64748b" />
          <Text style={styles.memberStatText}>{member.zone}</Text>
        </View>
      </View>

      {member.sos && (
        <TouchableOpacity 
          style={styles.sosButton}
          onPress={() => handleSOS(member)}
        >
          <Ionicons name="warning" size={16} color="white" />
          <Text style={styles.sosButtonText}>ALERTE SOS</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#334155']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Bonjour, {user?.name || 'Admin'}</Text>
              <Text style={styles.time}>{formatTime(currentTime)}</Text>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
              <Ionicons name="log-out" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="people" size={24} color="#10b981" />
            <Text style={styles.statValue}>{systemStats.onlineCount}</Text>
            <Text style={styles.statLabel}>En ligne</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="wifi" size={24} color="#3b82f6" />
            <Text style={styles.statValue}>{systemStats.avgRSSI}</Text>
            <Text style={styles.statLabel}>RSSI moyen</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="battery-charging" size={24} color="#f59e0b" />
            <Text style={styles.statValue}>{systemStats.avgBattery}%</Text>
            <Text style={styles.statLabel}>Batterie</Text>
          </View>
          
          {systemStats.sosCount > 0 && (
            <View style={[styles.statCard, styles.sosCard]}>
              <Ionicons name="warning" size={24} color="#ef4444" />
              <Text style={styles.statValue}>{systemStats.sosCount}</Text>
              <Text style={styles.statLabel}>Alertes</Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Actions Rapides</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('Dashboard')}
            >
              <Ionicons name="grid" size={24} color="#3b82f6" />
              <Text style={styles.quickActionText}>Dashboard</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <Ionicons name="map" size={24} color="#10b981" />
              <Text style={styles.quickActionText}>Carte</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <Ionicons name="notifications" size={24} color="#f59e0b" />
              <Text style={styles.quickActionText}>Alertes</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <Ionicons name="settings" size={24} color="#8b5cf6" />
              <Text style={styles.quickActionText}>Paramètres</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Members List */}
        <View style={styles.membersContainer}>
          <View style={styles.membersHeader}>
            <Text style={styles.sectionTitle}>Équipe Active</Text>
            <Text style={styles.membersCount}>{members.length} membres</Text>
          </View>
          
          {members.map(member => renderMemberCard(member))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  time: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    padding: 10,
    borderRadius: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 10,
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
  sosCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
  quickActionsContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  quickActionText: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 8,
    textAlign: 'center',
  },
  membersContainer: {
    marginBottom: 30,
  },
  membersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  membersCount: {
    fontSize: 14,
    color: '#94a3b8',
  },
  memberCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  memberAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: 'rgba(59, 130, 246, 0.5)',
  },
  memberInfo: {
    flex: 1,
    marginLeft: 15,
  },
  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 8,
  },
  memberStatus: {
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
    fontSize: 12,
    fontWeight: '600',
  },
  memberAction: {
    padding: 10,
  },
  memberStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  memberStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberStatText: {
    fontSize: 12,
    color: '#94a3b8',
    marginLeft: 8,
  },
  sosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    borderRadius: 8,
    padding: 10,
  },
  sosButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

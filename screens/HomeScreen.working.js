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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Données simplifiées des membres
const SIMPLE_MEMBERS = [
  {
    id: '1',
    name: 'Alexandre Dubois',
    role: 'Chef de Groupe',
    avatar: 'https://picsum.photos/seed/alexandre/200/200.jpg',
    rssi: -50,
    battery: 90,
    online: true,
    zone: 'Zone A'
  },
  {
    id: '2',
    name: 'Sarah Martin',
    role: 'Agent de Sécurité',
    avatar: 'https://picsum.photos/seed/sarah/200/200.jpg',
    rssi: -72,
    battery: 60,
    online: true,
    zone: 'Zone B'
  },
  {
    id: '3',
    name: 'Thomas Bernard',
    role: 'Technicien RSSI',
    avatar: 'https://picsum.photos/seed/thomas/200/200.jpg',
    rssi: -85,
    battery: 30,
    online: true,
    sos: true,
    zone: 'Zone C'
  }
];

export default function HomeScreen({ navigation, user, onLogout }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemStats, setSystemStats] = useState({
    activeMembers: SIMPLE_MEMBERS.length,
    alerts: 1,
    batteryAvg: Math.round(SIMPLE_MEMBERS.reduce((sum, m) => sum + m.battery, 0) / SIMPLE_MEMBERS.length),
    signalAvg: Math.round(SIMPLE_MEMBERS.reduce((sum, m) => sum + m.rssi, 0) / SIMPLE_MEMBERS.length),
    onlineMembers: SIMPLE_MEMBERS.filter(m => m.online).length,
    emergencyAlerts: SIMPLE_MEMBERS.filter(m => m.sos).length,
    criticalMembers: SIMPLE_MEMBERS.filter(m => m.battery < 30).length,
    systemHealth: 98,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [members, setMembers] = useState(SIMPLE_MEMBERS);

  useEffect(() => {
    // Mise à jour du temps
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Simulation de mises à jour des statistiques
    const statsTimer = setInterval(() => {
      setSystemStats(prev => ({
        ...prev,
        batteryAvg: Math.max(20, Math.min(100, prev.batteryAvg + (Math.random() - 0.5) * 5)),
        signalAvg: Math.max(-120, Math.min(-30, prev.signalAvg + (Math.random() - 0.5) * 10)),
      }));
      
      // Mettre à jour les membres
      setMembers(prevMembers => 
        prevMembers.map(member => ({
          ...member,
          rssi: Math.max(-120, Math.min(-30, member.rssi + (Math.random() - 0.5) * 10)),
          battery: Math.max(0, Math.min(100, member.battery - Math.random() * 0.5)),
        }))
      );
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(statsTimer);
    };
  }, []);

  const handleLogout = () => {
    onLogout();
  };

  const navigateToDashboard = () => {
    navigation.navigate('Dashboard');
  };

  const handleRefresh = () => {
    setRefreshing(true);
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

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (member) => {
    if (member.sos) return '#ef4444';
    if (!member.online) return '#64748b';
    if (member.battery < 20) return '#f59e0b';
    if (member.rssi < -80) return '#f59e0b';
    return '#10b981';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      {/* Gradient de fond */}
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#334155', '#475569']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* En-tête */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Bonjour, {user?.name || 'Administrateur'}
          </Text>
          <Text style={styles.time}>{formatTime(currentTime)}</Text>
          <Text style={styles.time}>{formatDate(currentTime)}</Text>
          <Text style={styles.user}>Rôles: {user?.permissions?.join(', ') || 'Admin'}</Text>
        </View>

        {/* Grille de statistiques */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{systemStats.activeMembers}</Text>
            <Text style={styles.statLabel}>Membres actifs</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{systemStats.alerts}</Text>
            <Text style={styles.statLabel}>Alertes</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{systemStats.batteryAvg}%</Text>
            <Text style={styles.statLabel}>Batterie moyenne</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{systemStats.signalAvg} dBm</Text>
            <Text style={styles.statLabel}>Signal moyen</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{systemStats.onlineMembers}</Text>
            <Text style={styles.statLabel}>En ligne</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{systemStats.systemHealth}%</Text>
            <Text style={styles.statLabel}>Santé système</Text>
          </View>
        </View>

        {/* Membres principaux */}
        <View style={styles.topMembersContainer}>
          <Text style={styles.sectionTitle}>👥 Équipe Principale</Text>
          {members.map((member) => (
            <View key={member.id} style={styles.memberCard}>
              <View style={styles.memberHeader}>
                <Image source={{ uri: member.avatar }} style={styles.memberAvatar} />
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberRole}>{member.role}</Text>
                  <View style={styles.memberStatus}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(member) }]} />
                    <Text style={styles.statusText}>
                      {member.sos ? 'SOS' : member.online ? 'Actif' : 'Hors ligne'}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.memberAction}>
                  <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                </TouchableOpacity>
              </View>
              <View style={styles.memberStats}>
                <View style={styles.memberStat}>
                  <Ionicons name="wifi" size={16} color="#64748b" />
                  <Text style={styles.memberStatText}>{member.rssi} dBm</Text>
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
            </View>
          ))}
        </View>

        {/* Alerte d'urgence */}
        {systemStats.emergencyAlerts > 0 && (
          <View style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <Ionicons name="warning" size={24} color="#ef4444" />
              <Text style={styles.alertTitle}>Alerte d'urgence</Text>
            </View>
            <Text style={styles.alertText}>
              {systemStats.criticalMembers} membre(s) critique(s) détecté(s). 
              Intervention requise immédiatement.
            </Text>
          </View>
        )}

        {/* Boutons d'action */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={navigateToDashboard}
          >
            <LinearGradient
              colors={['#3b82f6', '#1d4ed8', '#1e40af']}
              style={styles.actionButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.actionButtonText}>Voir le tableau de bord</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Se déconnecter</Text>
          </TouchableOpacity>
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
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 30,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  time: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 4,
  },
  user: {
    fontSize: 18,
    color: '#3b82f6',
    fontWeight: '600',
  },
  statsGrid: {
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
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
    textAlign: 'center',
  },
  topMembersContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
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
    marginRight: 15,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 3,
  },
  memberRole: {
    fontSize: 14,
    color: '#94a3b8',
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
    color: '#94a3b8',
  },
  memberAction: {
    padding: 8,
  },
  memberStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  memberStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  memberStatText: {
    fontSize: 12,
    color: '#64748b',
  },
  alertCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    marginBottom: 30,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ef4444',
    marginLeft: 12,
  },
  alertText: {
    fontSize: 16,
    color: '#f87171',
    lineHeight: 24,
  },
  actionButtons: {
    marginBottom: 30,
  },
  actionButton: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    paddingVertical: 20,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  logoutButtonText: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: '500',
  },
});

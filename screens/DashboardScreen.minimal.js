import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StatusBar,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const SIMPLE_MEMBERS = [
  {
    id: '1',
    name: 'Alexandre Dubois',
    role: 'Chef de Groupe',
    rssi: -50,
    battery: 90,
    online: true,
    sos: false,
    zone: 'Zone A - Poste de Commandement',
    phone: '+33612345678'
  },
  {
    id: '2',
    name: 'Sarah Martin',
    role: 'Agent de Sécurité',
    rssi: -72,
    battery: 60,
    online: true,
    sos: false,
    zone: 'Zone B - Périmètre Nord',
    phone: '+33623456789'
  },
  {
    id: '3',
    name: 'Thomas Bernard',
    role: 'Technicien RSSI',
    rssi: -85,
    battery: 30,
    online: true,
    sos: true,
    zone: 'Zone C - Poste Technique',
    phone: '+33634567890'
  },
  {
    id: '4',
    name: 'Marie Laurent',
    role: 'Médical d\'Urgence',
    rssi: -95,
    battery: 15,
    online: false,
    sos: false,
    zone: 'Zone D - Poste Médical',
    phone: '+33645678901'
  },
  {
    id: '5',
    name: 'Jean-Pierre Rousseau',
    role: 'Agent Logistique',
    rssi: -68,
    battery: 75,
    online: true,
    sos: false,
    zone: 'Zone E - Centre Logistique',
    phone: '+33656789012'
  },
  {
    id: '6',
    name: 'Isabelle Moreau',
    role: 'Communications',
    rssi: -58,
    battery: 88,
    online: true,
    sos: false,
    zone: 'Zone F - Centre de Communications',
    phone: '+33667890123'
  }
];

export default function DashboardScreen({ navigation, user, onLogout }) {
  const [members, setMembers] = useState(SIMPLE_MEMBERS);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const getStatusColor = (member) => {
    if (member.sos) return '#ef4444';
    if (!member.online) return '#64748b';
    if (member.battery < 20) return '#f59e0b';
    if (member.rssi < -80) return '#f59e0b';
    return '#10b981';
  };

  const getStatusIcon = (member) => {
    if (member.sos) return 'warning';
    if (!member.online) return 'radio-off';
    if (member.battery < 20) return 'battery-dead';
    if (member.rssi < -80) return 'wifi';
    return 'checkmark-circle';
  };

  const renderMemberItem = ({ item }) => (
    <View style={styles.memberCard}>
      <View style={styles.memberHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={24} color="#3b82f6" />
          </View>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(item) }]} />
        </View>
        
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{item.name}</Text>
          <Text style={styles.memberRole}>{item.role}</Text>
          <View style={styles.locationInfo}>
            <Ionicons name="location" size={14} color="#64748b" />
            <Text style={styles.locationText}>{item.zone}</Text>
          </View>
        </View>

        <View style={styles.statusContainer}>
          <Ionicons 
            name={getStatusIcon(item)} 
            size={20} 
            color={getStatusColor(item)} 
          />
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressItem}>
          <View style={styles.progressHeader}>
            <Ionicons name="wifi" size={16} color="#64748b" />
            <Text style={styles.progressLabel}>RSSI</Text>
            <Text style={styles.progressValue}>{item.rssi} dBm</Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${Math.max(0, Math.min(100, (item.rssi + 120) / 90 * 100))}%`,
                  backgroundColor: getStatusColor(item)
                }
              ]} 
            />
          </View>
        </View>

        <View style={styles.progressItem}>
          <View style={styles.progressHeader}>
            <Ionicons name="battery-half" size={16} color="#64748b" />
            <Text style={styles.progressLabel}>Batterie</Text>
            <Text style={styles.progressValue}>{Math.round(item.battery)}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${item.battery}%`,
                  backgroundColor: item.battery > 30 ? '#10b981' : '#f59e0b'
                }
              ]} 
            />
          </View>
        </View>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="call" size={16} color="#3b82f6" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="chatbubble" size={16} color="#3b82f6" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="warning" size={16} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Membres de l'Équipe</Text>
        <Text style={styles.headerSubtitle}>
          {members.length} membres actifs
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{members.filter(m => m.online).length}</Text>
          <Text style={styles.statLabel}>En ligne</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{members.filter(m => m.battery < 30).length}</Text>
          <Text style={styles.statLabel}>Batterie faible</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{members.filter(m => m.sos).length}</Text>
          <Text style={styles.statLabel}>Alertes SOS</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{Math.round(members.reduce((sum, m) => sum + m.battery, 0) / members.length)}%</Text>
          <Text style={styles.statLabel}>Batterie moyenne</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#334155']}
        style={styles.backgroundGradient}
      />

      {renderHeader()}

      <FlatList
        data={members}
        renderItem={renderMemberItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
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
  headerContainer: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  statItem: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  memberCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
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
    marginBottom: 3,
  },
  memberRole: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 5,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: '#64748b',
    fontSize: 12,
    marginLeft: 4,
  },
  statusContainer: {
    alignItems: 'center',
  },
  progressContainer: {
    gap: 12,
    marginBottom: 15,
  },
  progressItem: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressLabel: {
    color: '#64748b',
    fontSize: 12,
    flex: 1,
  },
  progressValue: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  quickActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
});

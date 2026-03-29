import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
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
    sos: false,
    zone: 'Zone A - Poste de Commandement',
    phone: '+33612345678'
  },
  {
    id: '2',
    name: 'Sarah Martin',
    role: 'Agent de Sécurité',
    avatar: 'https://picsum.photos/seed/sarah/200/200.jpg',
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
    avatar: 'https://picsum.photos/seed/thomas/200/200.jpg',
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
    avatar: 'https://picsum.photos/seed/marie/200/200.jpg',
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
    avatar: 'https://picsum.photos/seed/jeanpierre/200/200.jpg',
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
    avatar: 'https://picsum.photos/seed/isabelle/200/200.jpg',
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
  const [filteredMembers, setFilteredMembers] = useState(SIMPLE_MEMBERS);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Simuler les mises à jour en temps réel
    const interval = setInterval(() => {
      setMembers(prevMembers => 
        prevMembers.map(member => ({
          ...member,
          rssi: Math.max(-120, Math.min(-30, member.rssi + (Math.random() - 0.5) * 10)),
          battery: Math.max(0, Math.min(100, member.battery - Math.random() * 0.5)),
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Filtrer les membres selon le filtre sélectionné
    switch (selectedFilter) {
      case 'online':
        setFilteredMembers(members.filter(m => m.online));
        break;
      case 'lowBattery':
        setFilteredMembers(members.filter(m => m.battery < 30));
        break;
      case 'weakSignal':
        setFilteredMembers(members.filter(m => m.rssi < -80));
        break;
      case 'sos':
        setFilteredMembers(members.filter(m => m.sos));
        break;
      default:
        setFilteredMembers(members);
    }
  }, [selectedFilter, members]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleCall = (phoneNumber) => {
    console.log('Appel:', phoneNumber);
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
      {/* Avatar et statut */}
      <View style={styles.memberHeader}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
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

      {/* Barres de progression */}
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

      {/* Actions rapides */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionButton} onPress={() => handleCall(item.phone)}>
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

  const renderFilterButton = (filter, label, icon, count) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.activeFilter
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Ionicons name={icon} size={20} color={selectedFilter === filter ? 'white' : '#94a3b8'} />
      <Text style={[
        styles.filterText,
        selectedFilter === filter && styles.activeFilterText
      ]}>
        {label}
      </Text>
      {count > 0 && (
        <View style={styles.filterBadge}>
          <Text style={styles.filterBadgeText}>{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Membres de l'Équipe</Text>
        <Text style={styles.headerSubtitle}>
          {filteredMembers.length} membre{filteredMembers.length > 1 ? 's' : ''} actif{filteredMembers.length > 1 ? 's' : ''}
        </Text>
      </View>

      {/* Filtres */}
      <View style={styles.filtersContainer}>
        {renderFilterButton('all', 'Tous', 'people', members.length)}
        {renderFilterButton('online', 'En ligne', 'wifi', members.filter(m => m.online).length)}
        {renderFilterButton('lowBattery', 'Batterie faible', 'battery-dead', members.filter(m => m.battery < 30).length)}
        {renderFilterButton('weakSignal', 'Signal faible', 'wifi-outline', members.filter(m => m.rssi < -80).length)}
        {renderFilterButton('sos', 'SOS', 'warning', members.filter(m => m.sos).length)}
      </View>

      {/* Statistiques */}
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
      
      {/* Background */}
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#334155']}
        style={styles.backgroundGradient}
      />

      {/* Header */}
      {renderHeader()}

      {/* Liste des membres */}
      <FlatList
        data={filteredMembers}
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
  filtersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    position: 'relative',
  },
  activeFilter: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  filterText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  activeFilterText: {
    color: 'white',
  },
  filterBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
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

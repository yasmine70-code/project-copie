import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StatusBar,
  TouchableOpacity,
  Modal,
  Dimensions,
  RefreshControl,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import MemberProfile from '../components/MemberProfile';
import { MEMBERS_DATA, getOnlineMembers, getMembersWithLowBattery, getMembersWithWeakSignal, getMembersWithSOS } from '../data/members';

const { width, height } = Dimensions.get('window');

export default function DashboardScreen({ navigation, user, onLogout }) {
  const [members, setMembers] = useState(MEMBERS_DATA);
  const [filteredMembers, setFilteredMembers] = useState(MEMBERS_DATA);
  const [selectedMember, setSelectedMember] = useState(null);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Simuler les mises à jour en temps réel
    const interval = setInterval(() => {
      setMembers(prevMembers => 
        prevMembers.map(member => ({
          ...member,
          currentStatus: {
            ...member.currentStatus,
            rssi: Math.max(-120, Math.min(-30, member.currentStatus.rssi + (Math.random() - 0.5) * 10)),
            battery: Math.max(0, Math.min(100, member.currentStatus.battery - Math.random() * 0.5)),
            lastSeen: new Date()
          }
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Filtrer les membres selon le filtre sélectionné
    switch (selectedFilter) {
      case 'online':
        setFilteredMembers(getOnlineMembers());
        break;
      case 'lowBattery':
        setFilteredMembers(getMembersWithLowBattery());
        break;
      case 'weakSignal':
        setFilteredMembers(getMembersWithWeakSignal());
        break;
      case 'sos':
        setFilteredMembers(getMembersWithSOS());
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

  const handleMemberPress = (member) => {
    setSelectedMember(member);
    setProfileModalVisible(true);
  };

  const handleCall = (phoneNumber) => {
    // Implémenter l'appel téléphonique
    console.log('Appel:', phoneNumber);
  };

  const handleMessage = (member) => {
    // Implémenter l'envoi de message
    console.log('Message à:', member.name);
  };

  const handleEmergency = (member) => {
    // Implémenter l'alerte d'urgence
    console.log('Alerte d\'urgence pour:', member.name);
  };

  const getStatusColor = (status) => {
    if (status.sos) return '#ef4444';
    if (!status.online) return '#64748b';
    if (status.battery < 20) return '#f59e0b';
    if (status.rssi < -80) return '#f59e0b';
    return '#10b981';
  };

  const getStatusIcon = (status) => {
    if (status.sos) return 'warning';
    if (!status.online) return 'radio-off';
    if (status.battery < 20) return 'battery-dead';
    if (status.rssi < -80) return 'wifi';
    return 'checkmark-circle';
  };

  const renderMemberItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.memberCard}
      onPress={() => handleMemberPress(item)}
    >
      {/* Avatar et statut */}
      <View style={styles.memberHeader}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.currentStatus) }]} />
        </View>
        
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{item.name}</Text>
          <Text style={styles.memberRole}>{item.role}</Text>
          <View style={styles.locationInfo}>
            <Ionicons name="location" size={14} color="#64748b" />
            <Text style={styles.locationText}>{item.location.zone}</Text>
          </View>
        </View>

        <View style={styles.statusContainer}>
          <Ionicons 
            name={getStatusIcon(item.currentStatus)} 
            size={20} 
            color={getStatusColor(item.currentStatus)} 
          />
        </View>
      </View>

      {/* Barres de progression */}
      <View style={styles.progressContainer}>
        <View style={styles.progressItem}>
          <View style={styles.progressHeader}>
            <Ionicons name="wifi" size={16} color="#64748b" />
            <Text style={styles.progressLabel}>RSSI</Text>
            <Text style={styles.progressValue}>{item.currentStatus.rssi} dBm</Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${Math.max(0, Math.min(100, (item.currentStatus.rssi + 120) / 90 * 100))}%`,
                  backgroundColor: getStatusColor(item.currentStatus)
                }
              ]} 
            />
          </View>
        </View>

        <View style={styles.progressItem}>
          <View style={styles.progressHeader}>
            <Ionicons name="battery-half" size={16} color="#64748b" />
            <Text style={styles.progressLabel}>Batterie</Text>
            <Text style={styles.progressValue}>{Math.round(item.currentStatus.battery)}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${item.currentStatus.battery}%`,
                  backgroundColor: item.currentStatus.battery > 30 ? '#10b981' : '#f59e0b'
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
        <TouchableOpacity style={styles.quickActionButton} onPress={() => handleMessage(item)}>
          <Ionicons name="chatbubble" size={16} color="#3b82f6" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton} onPress={() => handleEmergency(item)}>
          <Ionicons name="warning" size={16} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
        {renderFilterButton('online', 'En ligne', 'wifi', getOnlineMembers().length)}
        {renderFilterButton('lowBattery', 'Batterie faible', 'battery-dead', getMembersWithLowBattery().length)}
        {renderFilterButton('weakSignal', 'Signal faible', 'wifi-outline', getMembersWithWeakSignal().length)}
        {renderFilterButton('sos', 'SOS', 'warning', getMembersWithSOS().length)}
      </View>

      {/* Statistiques */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{getOnlineMembers().length}</Text>
          <Text style={styles.statLabel}>En ligne</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{getMembersWithLowBattery().length}</Text>
          <Text style={styles.statLabel}>Batterie faible</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{getMembersWithSOS().length}</Text>
          <Text style={styles.statLabel}>Alertes SOS</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{Math.round(members.reduce((sum, m) => sum + m.currentStatus.battery, 0) / members.length)}%</Text>
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

      {/* Modal de profil */}
      <Modal
        visible={profileModalVisible}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        {selectedMember && (
          <MemberProfile
            memberId={selectedMember.id}
            onClose={() => {
              setProfileModalVisible(false);
              setSelectedMember(null);
            }}
            onCall={handleCall}
            handleMessage={handleMessage}
            onEmergency={handleEmergency}
          />
        )}
      </Modal>
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

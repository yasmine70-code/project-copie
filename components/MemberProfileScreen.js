import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  Animated,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { MEMBERS_PROFILES, getMemberById } from '../data/members-profiles';

const { width, height } = Dimensions.get('window');

export default function MemberProfileScreen({ route, navigation }) {
  const { memberId } = route.params;
  const [member, setMember] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);
  
  // Animations
  const scrollY = new Animated.Value(0);
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    const memberData = getMemberById(memberId);
    setMember(memberData);
  }, [memberId]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      // Simuler la mise à jour des données
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
    }, 2000);
  };

  const handleCall = () => {
    Alert.alert('Appel', `Appeler ${member?.phone} ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Appeler', onPress: () => console.log('Appel') }
    ]);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Profil de ${member?.name} - ${member?.role}\nRSSI: ${member?.rssi} dBm\nStatut: ${member?.status}`,
        url: `rssi://member/${memberId}`
      });
    } catch (error) {
      console.error('Erreur partage:', error);
    }
  };

  const handleSOS = () => {
    Alert.alert(
      'Alerte SOS',
      `${member?.name} a besoin d'aide immédiate !`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Intervenir', onPress: () => console.log('Intervention SOS') }
      ]
    );
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

  const renderOverview = () => (
    <View style={styles.overviewContainer}>
      {/* Carte de statut */}
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <View style={styles.statusIndicator}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(member?.status) }]} />
            <Text style={[styles.statusText, { color: getStatusColor(member?.status) }]}>
              {getStatusText(member?.status)}
            </Text>
          </View>
          <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
            <Ionicons name="refresh" size={20} color="#3b82f6" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.statusGrid}>
          <View style={styles.statusItem}>
            <Text style={styles.statusValue}>{member?.rssi?.toFixed(2)}</Text>
            <Text style={styles.statusLabel}>RSSI dBm</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusValue}>{member?.battery}%</Text>
            <Text style={styles.statusLabel}>Batterie</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusValue}>{member?.zone?.split(' - ')[0]}</Text>
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
            <Text style={styles.bioValue}>{member?.health?.heartRate}</Text>
            <Text style={styles.bioLabel}>BPM</Text>
          </View>
          <View style={styles.bioItem}>
            <Ionicons name="pulse" size={20} color="#f59e0b" />
            <Text style={styles.bioValue}>{Math.round(member?.health?.stress * 100)}%</Text>
            <Text style={styles.bioLabel}>Stress</Text>
          </View>
          <View style={styles.bioItem}>
            <Ionicons name="eye" size={20} color="#3b82f6" />
            <Text style={styles.bioValue}>{Math.round(member?.health?.focus * 100)}%</Text>
            <Text style={styles.bioLabel}>Focus</Text>
          </View>
          <View style={styles.bioItem}>
            <Ionicons name="battery-charging" size={20} color="#10b981" />
            <Text style={styles.bioValue}>{Math.round(member?.health?.energy * 100)}%</Text>
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
            <Text style={styles.infoValue}>{member?.age} ans</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Date de naissance</Text>
            <Text style={styles.infoValue}>{new Date(member?.birthDate).toLocaleDateString('fr-FR')}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{member?.email}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Téléphone</Text>
            <Text style={styles.infoValue}>{member?.phone}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Adresse</Text>
            <Text style={styles.infoValue}>{member?.address}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderSkills = () => (
    <View style={styles.skillsContainer}>
      <Text style={styles.cardTitle}>🎯 Compétences</Text>
      {member?.skills?.map((skill, index) => (
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
          <Text style={styles.historyValue}>{member?.history?.missions}</Text>
          <Text style={styles.historyLabel}>Missions</Text>
        </View>
        <View style={styles.historyItem}>
          <Text style={styles.historyValue}>{member?.history?.interventions}</Text>
          <Text style={styles.historyLabel}>Interventions</Text>
        </View>
        <View style={styles.historyItem}>
          <Text style={styles.historyValue}>{member?.history?.awards}</Text>
          <Text style={styles.historyLabel}>Récompenses</Text>
        </View>
        <View style={styles.historyItem}>
          <Text style={styles.historyValue}>{member?.history?.rating}</Text>
          <Text style={styles.historyLabel}>Note</Text>
        </View>
      </View>
      
      <View style={styles.joinDateCard}>
        <Text style={styles.joinDateLabel}>Date d'arrivée</Text>
        <Text style={styles.joinDateValue}>
          {new Date(member?.history?.joinDate).toLocaleDateString('fr-FR', {
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
          <Text style={styles.equipmentValue}>{member?.equipment?.device}</Text>
        </View>
        <View style={styles.equipmentItem}>
          <Text style={styles.equipmentLabel}>Modèle</Text>
          <Text style={styles.equipmentValue}>{member?.equipment?.deviceModel}</Text>
        </View>
        <View style={styles.equipmentItem}>
          <Text style={styles.equipmentLabel}>Numéro de série</Text>
          <Text style={styles.equipmentValue}>{member?.equipment?.serialNumber}</Text>
        </View>
        <View style={styles.equipmentItem}>
          <Text style={styles.equipmentLabel}>Firmware</Text>
          <Text style={styles.equipmentValue}>{member?.equipment?.firmware}</Text>
        </View>
        <View style={styles.equipmentItem}>
          <Text style={styles.equipmentLabel}>Dernière mise à jour</Text>
          <Text style={styles.equipmentValue}>
            {new Date(member?.equipment?.lastUpdate).toLocaleString('fr-FR')}
          </Text>
        </View>
      </View>
    </View>
  );

  if (!member) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <Text style={styles.loadingText}>Chargement du profil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      {/* Header avec photo de couverture */}
      <View style={styles.headerContainer}>
        <Image source={{ uri: member.coverPhoto }} style={styles.coverPhoto} />
        <Animated.View style={[styles.headerOverlay, { opacity: headerOpacity }]}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                <Ionicons name="share-outline" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
                <Ionicons name="call" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
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
          <TouchableOpacity style={styles.sosButton} onPress={handleSOS}>
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
              {tab === 'overview' && '📊'}
              {tab === 'skills' && '🎯'}
              {tab === 'history' && '📈'}
              {tab === 'equipment' && '🔧'}
              {' '}
              {tab === 'overview' && 'Vue d\'ensemble'}
              {tab === 'skills' && 'Compétences'}
              {tab === 'history' && 'Historique'}
              {tab === 'equipment' && 'Équipement'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Contenu selon l'onglet actif */}
      <Animated.ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        refreshControl={
          <View style={styles.refreshControl}>
            <TouchableOpacity onPress={handleRefresh}>
              <Ionicons name="refresh" size={20} color="#3b82f6" />
            </TouchableOpacity>
          </View>
        }
      >
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'skills' && renderSkills()}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'equipment' && renderEquipment()}
      </Animated.ScrollView>
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
    backgroundColor: '#0f172a',
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: 16,
  },
  
  // Header
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
  
  // Profile Header
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
  sosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  sosText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
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
  refreshControl: {
    alignSelf: 'center',
    padding: 10,
  },
  
  // Cards
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
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
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
  
  // Bio Card
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
  
  // Info Card
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

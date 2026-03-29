import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { MEMBERS_DATA, updateMemberStatus } from '../data/members';

const { width, height } = Dimensions.get('window');

export default function MemberProfile({ memberId, onClose, onCall, onMessage, onEmergency }) {
  const [member, setMember] = useState(MEMBERS_DATA.find(m => m.id === memberId));
  const [activeTab, setActiveTab] = useState('info');

  if (!member) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Membre non trouvé</Text>
      </View>
    );
  }

  const handleCall = () => {
    Alert.alert(
      'Appeler',
      `Appeler ${member.name} au ${member.phone}?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Appeler', onPress: () => onCall?.(member.phone) }
      ]
    );
  };

  const handleMessage = () => {
    onMessage?.(member);
  };

  const handleEmergency = () => {
    Alert.alert(
      'Alerte d\'Urgence',
      `Envoyer une alerte d\'urgence à ${member.name}?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Envoyer', onPress: () => onEmergency?.(member) }
      ]
    );
  };

  const handleShare = async () => {
    try {
      const shareContent = `Profil RSSI - ${member.name}\n` +
        `Rôle: ${member.role}\n` +
        `Département: ${member.department}\n` +
        `Téléphone: ${member.phone}\n` +
        `Email: ${member.email}\n` +
        `Zone: ${member.location.zone}`;
      
      await Share.share({
        message: shareContent,
        title: `Profil - ${member.name}`
      });
    } catch (error) {
      console.error('Erreur partage:', error);
    }
  };

  const getStatusColor = (status) => {
    if (status.sos) return '#ef4444';
    if (!status.online) return '#64748b';
    if (status.battery < 20) return '#f59e0b';
    if (status.rssi < -80) return '#f59e0b';
    return '#10b981';
  };

  const getStatusText = (status) => {
    if (status.sos) return 'SOS ACTIF';
    if (!status.online) return 'HORS LIGNE';
    if (status.battery < 20) return 'BATTERIE FAIBLE';
    if (status.rssi < -80) return 'SIGNAL FAIBLE';
    return 'ACTIF';
  };

  const renderInfoTab = () => (
    <View style={styles.tabContent}>
      {/* Informations personnelles */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations Personnelles</Text>
        <View style={styles.infoRow}>
          <Ionicons name="mail" size={20} color="#94a3b8" />
          <Text style={styles.infoText}>{member.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="call" size={20} color="#94a3b8" />
          <Text style={styles.infoText}>{member.phone}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="briefcase" size={20} color="#94a3b8" />
          <Text style={styles.infoText}>{member.role}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="business" size={20} color="#94a3b8" />
          <Text style={styles.infoText}>{member.department}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="calendar" size={20} color="#94a3b8" />
          <Text style={styles.infoText}>Depuis le {new Date(member.joinDate).toLocaleDateString('fr-FR')}</Text>
        </View>
      </View>

      {/* Localisation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Localisation Actuelle</Text>
        <View style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <Ionicons name="location" size={24} color="#3b82f6" />
            <Text style={styles.locationZone}>{member.location.zone}</Text>
          </View>
          <Text style={styles.locationCoords}>
            {member.location.latitude.toFixed(4)}, {member.location.longitude.toFixed(4)}
          </Text>
        </View>
      </View>

      {/* Contact d'urgence */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact d'Urgence</Text>
        <View style={styles.emergencyContact}>
          <View style={styles.emergencyInfo}>
            <Text style={styles.emergencyName}>{member.emergencyContact.name}</Text>
            <Text style={styles.emergencyRelation}>{member.emergencyContact.relation}</Text>
            <Text style={styles.emergencyPhone}>{member.emergencyContact.phone}</Text>
          </View>
          <TouchableOpacity style={styles.emergencyCallButton}>
            <Ionicons name="call" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderSkillsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Biographie</Text>
        <Text style={styles.bioText}>{member.bio}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Compétences</Text>
        <View style={styles.skillsContainer}>
          {member.skills.map((skill, index) => (
            <View key={index} style={styles.skillTag}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Certifications</Text>
        {member.certifications.map((cert, index) => (
          <View key={index} style={styles.certificationItem}>
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            <Text style={styles.certificationText}>{cert}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderHealthTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations Médicales</Text>
        <View style={styles.healthGrid}>
          <View style={styles.healthItem}>
            <Text style={styles.healthLabel}>Groupe Sanguin</Text>
            <Text style={styles.healthValue}>{member.healthInfo.bloodType}</Text>
          </View>
          <View style={styles.healthItem}>
            <Text style={styles.healthLabel}>Allergies</Text>
            <Text style={styles.healthValue}>{member.healthInfo.allergies}</Text>
          </View>
          <View style={styles.healthItem}>
            <Text style={styles.healthLabel}>Médicaments</Text>
            <Text style={styles.healthValue}>{member.healthInfo.medications}</Text>
          </View>
        </View>
        <View style={styles.emergencyNotes}>
          <Text style={styles.emergencyNotesTitle}>Notes d'Urgence</Text>
          <Text style={styles.emergencyNotesText}>{member.healthInfo.emergencyNotes}</Text>
        </View>
      </View>
    </View>
  );

  const renderStatusTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statut en Temps Réel</Text>
        
        {/* Status principal */}
        <View style={[styles.statusCard, { borderColor: getStatusColor(member.currentStatus) }]}>
          <View style={styles.statusHeader}>
            <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(member.currentStatus) }]} />
            <Text style={[styles.statusText, { color: getStatusColor(member.currentStatus) }]}>
              {getStatusText(member.currentStatus)}
            </Text>
          </View>
          
          <View style={styles.statusDetails}>
            <View style={styles.statusItem}>
              <Ionicons name="wifi" size={20} color="#94a3b8" />
              <Text style={styles.statusLabel}>RSSI</Text>
              <Text style={styles.statusValue}>{member.currentStatus.rssi} dBm</Text>
            </View>
            
            <View style={styles.statusItem}>
              <Ionicons name="battery-half" size={20} color="#94a3b8" />
              <Text style={styles.statusLabel}>Batterie</Text>
              <Text style={styles.statusValue}>{member.currentStatus.battery}%</Text>
            </View>
            
            <View style={styles.statusItem}>
              <Ionicons name="phone-portrait" size={20} color="#94a3b8" />
              <Text style={styles.statusLabel}>Appareil</Text>
              <Text style={styles.statusValue}>{member.currentStatus.device}</Text>
            </View>
            
            <View style={styles.statusItem}>
              <Ionicons name="time" size={20} color="#94a3b8" />
              <Text style={styles.statusLabel}>Dernière vue</Text>
              <Text style={styles.statusValue}>
                {new Date(member.currentStatus.lastSeen).toLocaleTimeString('fr-FR')}
              </Text>
            </View>
          </View>
        </View>

        {/* Historique récent */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Historique Récent</Text>
          <View style={styles.historyItem}>
            <Text style={styles.historyTime}>14:32</Text>
            <Text style={styles.historyEvent}>Détection de mouvement</Text>
          </View>
          <View style={styles.historyItem}>
            <Text style={styles.historyTime}>14:25</Text>
            <Text style={styles.historyEvent}>Changement de zone</Text>
          </View>
          <View style={styles.historyItem}>
            <Text style={styles.historyTime}>14:15</Text>
            <Text style={styles.historyEvent}>Connexion établie</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      {/* Header avec photo de profil */}
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#334155']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: member.profilePhoto }} style={styles.profilePhoto} />
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(member.currentStatus) }]} />
            </View>
            <Text style={styles.memberName}>{member.name}</Text>
            <Text style={styles.memberRole}>{member.role}</Text>
          </View>
          
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Ionicons name="share-social" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Actions rapides */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
          <Ionicons name="call" size={24} color="white" />
          <Text style={styles.actionText}>Appeler</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleMessage}>
          <Ionicons name="chatbubble" size={24} color="white" />
          <Text style={styles.actionText}>Message</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionButton, styles.emergencyButton]} onPress={handleEmergency}>
          <Ionicons name="warning" size={24} color="white" />
          <Text style={styles.actionText}>Urgence</Text>
        </TouchableOpacity>
      </View>

      {/* Onglets */}
      <View style={styles.tabsContainer}>
        {['info', 'skills', 'health', 'status'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab === 'info' && 'Infos'}
              {tab === 'skills' && 'Compétences'}
              {tab === 'health' && 'Santé'}
              {tab === 'status' && 'Statut'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Contenu de l'onglet */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'info' && renderInfoTab()}
        {activeTab === 'skills' && renderSkillsTab()}
        {activeTab === 'health' && renderHealthTab()}
        {activeTab === 'status' && renderStatusTab()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  headerGradient: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    flex: 1,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'rgba(59, 130, 246, 0.5)',
  },
  statusDot: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#0f172a',
  },
  memberName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  memberRole: {
    fontSize: 16,
    color: '#94a3b8',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 15,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  emergencyButton: {
    backgroundColor: '#ef4444',
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#3b82f6',
  },
  tabText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#3b82f6',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tabContent: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 15,
  },
  infoText: {
    flex: 1,
    color: '#94a3b8',
    fontSize: 16,
  },
  locationCard: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationZone: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  locationCoords: {
    color: '#64748b',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  emergencyContact: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  emergencyInfo: {
    flex: 1,
  },
  emergencyName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 3,
  },
  emergencyRelation: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 3,
  },
  emergencyPhone: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
  emergencyCallButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bioText: {
    color: '#94a3b8',
    fontSize: 16,
    lineHeight: 24,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  skillTag: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  skillText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },
  certificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  certificationText: {
    color: '#94a3b8',
    fontSize: 16,
  },
  healthGrid: {
    gap: 15,
    marginBottom: 20,
  },
  healthItem: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  healthLabel: {
    color: '#64748b',
    fontSize: 14,
    marginBottom: 5,
  },
  healthValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emergencyNotes: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  emergencyNotesTitle: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  emergencyNotesText: {
    color: '#f87171',
    fontSize: 14,
    lineHeight: 20,
  },
  statusCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 20,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusDetails: {
    gap: 15,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  statusLabel: {
    color: '#64748b',
    fontSize: 14,
    width: 80,
  },
  statusValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  historySection: {
    marginTop: 20,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.1)',
  },
  historyTime: {
    color: '#64748b',
    fontSize: 14,
    width: 60,
  },
  historyEvent: {
    color: '#94a3b8',
    fontSize: 16,
    flex: 1,
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
});

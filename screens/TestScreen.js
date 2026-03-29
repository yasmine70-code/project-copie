import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function TestScreen({ navigation, user, onLogout }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    onLogout();
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#334155', '#475569']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Bonjour, {user?.name || 'Administrateur'}
          </Text>
          <Text style={styles.time}>{formatTime(currentTime)}</Text>
          <Text style={styles.user}>Connecté avec succès !</Text>
        </View>

        {/* Message de succès */}
        <View style={styles.successCard}>
          <Ionicons name="checkmark-circle" size={60} color="#10b981" />
          <Text style={styles.successTitle}>🎉 CONNEXION RÉUSSIE !</Text>
          <Text style={styles.successSubtitle}>
            L'application fonctionne parfaitement
          </Text>
        </View>

        {/* Informations utilisateur */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>👤 Informations Utilisateur</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nom:</Text>
            <Text style={styles.infoValue}>{user?.name || 'Administrateur'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{user?.email || 'admin@rssi.com'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Rôle:</Text>
            <Text style={styles.infoValue}>{user?.role || 'Admin'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Permissions:</Text>
            <Text style={styles.infoValue}>{user?.permissions?.join(', ') || 'Lecture, Écriture, Admin'}</Text>
          </View>
        </View>

        {/* Fonctionnalités disponibles */}
        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>🚀 Fonctionnalités Disponibles</Text>
          <View style={styles.featureItem}>
            <Ionicons name="people" size={24} color="#3b82f6" />
            <Text style={styles.featureText}>6 membres avec profils complets</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="camera" size={24} color="#3b82f6" />
            <Text style={styles.featureText}>Photos de profil uniques</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="analytics" size={24} color="#3b82f6" />
            <Text style={styles.featureText}>Dashboard moderne</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="wifi" size={24} color="#3b82f6" />
            <Text style={styles.featureText}>Monitoring RSSI temps réel</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="warning" size={24} color="#3b82f6" />
            <Text style={styles.featureText}>Alertes et notifications</Text>
          </View>
        </View>

        {/* Prochaines étapes */}
        <View style={styles.nextStepsCard}>
          <Text style={styles.nextStepsTitle}>🎯 Prochaines Étapes</Text>
          <Text style={styles.nextStepsText}>
            Maintenant que l'application fonctionne, nous pouvons ajouter :
          </Text>
          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>1.</Text>
            <Text style={styles.stepText}>Home Screen avec équipe principale</Text>
          </View>
          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>2.</Text>
            <Text style={styles.stepText}>Dashboard avec profils détaillés</Text>
          </View>
          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>3.</Text>
            <Text style={styles.stepText}>Photos et avatars des membres</Text>
          </View>
          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>4.</Text>
            <Text style={styles.stepText}>Actions rapides (appeler, message, SOS)</Text>
          </View>
        </View>

        {/* Bouton de déconnexion */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color="white" />
          <Text style={styles.logoutButtonText}>Se déconnecter</Text>
        </TouchableOpacity>
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
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  time: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 8,
    textAlign: 'center',
  },
  user: {
    fontSize: 18,
    color: '#10b981',
    fontWeight: '600',
    textAlign: 'center',
  },
  successCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginBottom: 30,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10b981',
    marginTop: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.1)',
  },
  infoLabel: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  featuresCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#94a3b8',
    marginLeft: 12,
    flex: 1,
  },
  nextStepsCard: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    marginBottom: 20,
  },
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 10,
  },
  nextStepsText: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 15,
    lineHeight: 20,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginRight: 10,
    width: 20,
  },
  stepText: {
    fontSize: 14,
    color: '#94a3b8',
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    marginBottom: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar, 
  TextInput, 
  Alert, 
  Animated, 
  Dimensions,
  ScrollView
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [email, setEmail] = useState('admin@rssi.com');
  const [password, setPassword] = useState('admin123');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Animations
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    // Animation d'entrée
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();

    // Animation de pulse continue
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    // Mise à jour du temps
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = () => {
    if (email === 'admin@rssi.com' && password === 'admin123') {
      const userData = {
        name: 'Administrateur',
        email: email,
        role: 'admin',
        avatar: 'https://picsum.photos/seed/admin/200/200.jpg'
      };
      setUser(userData);
      setIsLoggedIn(true);
      Alert.alert('✅ Succès', 'Connexion réussie !');
    } else {
      Alert.alert('❌ Erreur', 'Email ou mot de passe incorrect');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setEmail('admin@rssi.com');
    setPassword('admin123');
  };

  if (!isLoggedIn) {
    return (
      <View style={expertStyles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0a0e1a" />
        
        {/* Background animé */}
        <View style={expertStyles.backgroundPattern} />
        
        <ScrollView 
          contentContainerStyle={expertStyles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            style={[
              expertStyles.loginContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {/* Header avec logo animé */}
            <View style={expertStyles.header}>
              <Animated.View style={[expertStyles.logoContainer, { transform: [{ scale: pulseAnim }] }]}>
                <View style={expertStyles.logo}>
                  <Text style={expertStyles.logoText}>🛡️</Text>
                </View>
              </Animated.View>
              <Text style={expertStyles.brandTitle}>RSSI PRO</Text>
              <Text style={expertStyles.brandSubtitle}>Système de Surveillance Avancé</Text>
              <View style={expertStyles.versionBadge}>
                <Text style={expertStyles.versionText}>v2.0.1</Text>
              </View>
            </View>
            
            {/* Formulaire de connexion */}
            <View style={expertStyles.formCard}>
              <View style={expertStyles.formHeader}>
                <Text style={expertStyles.formTitle}>Connexion Sécurisée</Text>
                <View style={expertStyles.securityIndicator}>
                  <Text style={expertStyles.securityText}>🔒 HTTPS</Text>
                </View>
              </View>
              
              <View style={expertStyles.inputGroup}>
                <Text style={expertStyles.inputLabel}>Email professionnel</Text>
                <View style={expertStyles.inputContainer}>
                  <Text style={expertStyles.inputIcon}>📧</Text>
                  <TextInput
                    style={expertStyles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="admin@rssi.com"
                    placeholderTextColor="#64748b"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>
              
              <View style={expertStyles.inputGroup}>
                <Text style={expertStyles.inputLabel}>Mot de passe</Text>
                <View style={expertStyles.inputContainer}>
                  <Text style={expertStyles.inputIcon}>🔐</Text>
                  <TextInput
                    style={expertStyles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    placeholderTextColor="#64748b"
                    secureTextEntry
                  />
                </View>
              </View>
              
              <TouchableOpacity style={expertStyles.loginButton} onPress={handleLogin}>
                <Text style={expertStyles.loginButtonText}>SE CONNECTER</Text>
                <Text style={expertStyles.loginButtonIcon}>→</Text>
              </TouchableOpacity>
              
              <View style={expertStyles.formFooter}>
                <TouchableOpacity style={expertStyles.helpLink}>
                  <Text style={expertStyles.helpText}>🔐 Mot de passe oublié ?</Text>
                </TouchableOpacity>
                <TouchableOpacity style={expertStyles.helpLink}>
                  <Text style={expertStyles.helpText}>📞 Support technique</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Informations système */}
            <View style={expertStyles.systemInfo}>
              <View style={expertStyles.infoCard}>
                <Text style={expertStyles.infoTitle}>📊 État du Système</Text>
                <View style={expertStyles.infoGrid}>
                  <View style={expertStyles.infoItem}>
                    <Text style={expertStyles.infoValue}>-50.00</Text>
                    <Text style={expertStyles.infoLabel}>RSSI dBm</Text>
                  </View>
                  <View style={expertStyles.infoItem}>
                    <Text style={expertStyles.infoValue}>6</Text>
                    <Text style={expertStyles.infoLabel}>Membres</Text>
                  </View>
                  <View style={expertStyles.infoItem}>
                    <Text style={expertStyles.infoValue}>98%</Text>
                    <Text style={expertStyles.infoLabel}>Uptime</Text>
                  </View>
                  <View style={expertStyles.infoItem}>
                    <Text style={expertStyles.infoValue}>8081</Text>
                    <Text style={expertStyles.infoLabel}>Port</Text>
                  </View>
                </View>
              </View>
              
              <View style={expertStyles.statusBar}>
                <View style={expertStyles.statusItem}>
                  <View style={[expertStyles.statusDot, { backgroundColor: '#10b981' }]} />
                  <Text style={expertStyles.statusText}>Serveur actif</Text>
                </View>
                <View style={expertStyles.statusItem}>
                  <View style={[expertStyles.statusDot, { backgroundColor: '#3b82f6' }]} />
                  <Text style={expertStyles.statusText}>Base de données connectée</Text>
                </View>
                <View style={expertStyles.statusItem}>
                  <View style={[expertStyles.statusDot, { backgroundColor: '#f59e0b' }]} />
                  <Text style={expertStyles.statusText}>2 alertes en attente</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={expertStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0e1a" />
      
      {/* Background animé */}
      <View style={expertStyles.backgroundPattern} />
      
      <ScrollView 
        contentContainerStyle={expertStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            expertStyles.dashboardContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Header du dashboard */}
          <View style={expertStyles.dashboardHeader}>
            <View style={expertStyles.userSection}>
              <View style={expertStyles.avatar}>
                <Text style={expertStyles.avatarText}>A</Text>
              </View>
              <View style={expertStyles.userInfo}>
                <Text style={expertStyles.userName}>{user?.name}</Text>
                <Text style={expertStyles.userRole}>Administrateur système</Text>
              </View>
            </View>
            
            <View style={expertStyles.headerActions}>
              <TouchableOpacity style={expertStyles.notificationButton}>
                <Text style={expertStyles.notificationIcon}>🔔</Text>
                <View style={expertStyles.notificationBadge}>
                  <Text style={expertStyles.badgeText}>2</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={expertStyles.logoutButton} onPress={handleLogout}>
                <Text style={expertStyles.logoutIcon}>🚪</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Carte de temps */}
          <View style={expertStyles.timeCard}>
            <Text style={expertStyles.currentTime}>{currentTime.toLocaleTimeString()}</Text>
            <Text style={expertStyles.currentDate}>{currentTime.toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</Text>
            <Animated.View style={[expertStyles.pulseDot, { transform: [{ scale: pulseAnim }] }]} />
          </View>
          
          {/* Statistiques principales */}
          <View style={expertStyles.statsSection}>
            <Text style={expertStyles.sectionTitle}>📊 Vue d'ensemble</Text>
            <View style={expertStyles.statsGrid}>
              <Animated.View style={[expertStyles.statCard, { transform: [{ scale: pulseAnim }] }]}>
                <View style={expertStyles.statIcon}>
                  <Text style={expertStyles.iconText}>👥</Text>
                </View>
                <Text style={expertStyles.statValue}>6</Text>
                <Text style={expertStyles.statLabel}>Membres actifs</Text>
                <View style={expertStyles.statProgress}>
                  <View style={[expertStyles.progressBar, { width: '75%' }]} />
                </View>
              </Animated.View>
              
              <Animated.View style={[expertStyles.statCard, { transform: [{ scale: pulseAnim }] }]}>
                <View style={expertStyles.statIcon}>
                  <Text style={expertStyles.iconText}>📡</Text>
                </View>
                <Text style={expertStyles.statValue}>-50.00</Text>
                <Text style={expertStyles.statLabel}>RSSI moyen</Text>
                <View style={expertStyles.statProgress}>
                  <View style={[expertStyles.progressBar, { width: '85%', backgroundColor: '#3b82f6' }]} />
                </View>
              </Animated.View>
              
              <Animated.View style={[expertStyles.statCard, { transform: [{ scale: pulseAnim }] }]}>
                <View style={expertStyles.statIcon}>
                  <Text style={expertStyles.iconText}>🔋</Text>
                </View>
                <Text style={expertStyles.statValue}>85%</Text>
                <Text style={expertStyles.statLabel}>Batterie</Text>
                <View style={expertStyles.statProgress}>
                  <View style={[expertStyles.progressBar, { width: '85%', backgroundColor: '#10b981' }]} />
                </View>
              </Animated.View>
              
              <Animated.View style={[expertStyles.statCard, { transform: [{ scale: pulseAnim }] }]}>
                <View style={expertStyles.statIcon}>
                  <Text style={expertStyles.iconText}>⚡</Text>
                </View>
                <Text style={expertStyles.statValue}>98%</Text>
                <Text style={expertStyles.statLabel}>Performance</Text>
                <View style={expertStyles.statProgress}>
                  <View style={[expertStyles.progressBar, { width: '98%', backgroundColor: '#8b5cf6' }]} />
                </View>
              </Animated.View>
            </View>
          </View>
          
          {/* Équipe active */}
          <View style={expertStyles.teamSection}>
            <View style={expertStyles.sectionHeader}>
              <Text style={expertStyles.sectionTitle}>👥 Équipe Active</Text>
              <TouchableOpacity style={expertStyles.viewAllButton}>
                <Text style={expertStyles.viewAllText}>Voir tout →</Text>
              </TouchableOpacity>
            </View>
            
            <View style={expertStyles.teamGrid}>
              <View style={expertStyles.memberCard}>
                <View style={expertStyles.memberHeader}>
                  <View style={[expertStyles.memberAvatar, { backgroundColor: '#3b82f6' }]}>
                    <Text style={expertStyles.memberInitial}>AD</Text>
                  </View>
                  <View style={expertStyles.memberInfo}>
                    <Text style={expertStyles.memberName}>Alexandre Dubois</Text>
                    <Text style={expertStyles.memberRole}>Chef de Groupe</Text>
                  </View>
                  <View style={expertStyles.memberStatus}>
                    <View style={[expertStyles.statusDot, { backgroundColor: '#10b981' }]} />
                    <Text style={expertStyles.statusText}>Actif</Text>
                  </View>
                </View>
                <View style={expertStyles.memberStats}>
                  <View style={expertStyles.memberStat}>
                    <Text style={expertStyles.memberStatValue}>-50.00</Text>
                    <Text style={expertStyles.memberStatLabel}>RSSI</Text>
                  </View>
                  <View style={expertStyles.memberStat}>
                    <Text style={expertStyles.memberStatValue}>90%</Text>
                    <Text style={expertStyles.memberStatLabel}>Batterie</Text>
                  </View>
                  <View style={expertStyles.memberStat}>
                    <Text style={expertStyles.memberStatValue}>A</Text>
                    <Text style={expertStyles.memberStatLabel}>Zone</Text>
                  </View>
                </View>
              </View>
              
              <View style={expertStyles.memberCard}>
                <View style={expertStyles.memberHeader}>
                  <View style={[expertStyles.memberAvatar, { backgroundColor: '#8b5cf6' }]}>
                    <Text style={expertStyles.memberInitial}>SM</Text>
                  </View>
                  <View style={expertStyles.memberInfo}>
                    <Text style={expertStyles.memberName}>Sarah Martin</Text>
                    <Text style={expertStyles.memberRole}>Agent de Sécurité</Text>
                  </View>
                  <View style={expertStyles.memberStatus}>
                    <View style={[expertStyles.statusDot, { backgroundColor: '#10b981' }]} />
                    <Text style={expertStyles.statusText}>Actif</Text>
                  </View>
                </View>
                <View style={expertStyles.memberStats}>
                  <View style={expertStyles.memberStat}>
                    <Text style={expertStyles.memberStatValue}>-72.00</Text>
                    <Text style={expertStyles.memberStatLabel}>RSSI</Text>
                  </View>
                  <View style={expertStyles.memberStat}>
                    <Text style={expertStyles.memberStatValue}>60%</Text>
                    <Text style={expertStyles.memberStatLabel}>Batterie</Text>
                  </View>
                  <View style={expertStyles.memberStat}>
                    <Text style={expertStyles.memberStatValue}>B</Text>
                    <Text style={expertStyles.memberStatLabel}>Zone</Text>
                  </View>
                </View>
              </View>
              
              <View style={[expertStyles.memberCard, expertStyles.warningCard]}>
                <View style={expertStyles.memberHeader}>
                  <View style={[expertStyles.memberAvatar, { backgroundColor: '#f59e0b' }]}>
                    <Text style={expertStyles.memberInitial}>TB</Text>
                  </View>
                  <View style={expertStyles.memberInfo}>
                    <Text style={expertStyles.memberName}>Thomas Bernard</Text>
                    <Text style={expertStyles.memberRole}>Technicien RSSI</Text>
                  </View>
                  <View style={expertStyles.memberStatus}>
                    <View style={[expertStyles.statusDot, { backgroundColor: '#f59e0b' }]} />
                    <Text style={expertStyles.statusText}>Attention</Text>
                  </View>
                </View>
                <View style={expertStyles.memberStats}>
                  <View style={expertStyles.memberStat}>
                    <Text style={expertStyles.memberStatValue}>-85.00</Text>
                    <Text style={expertStyles.memberStatLabel}>RSSI</Text>
                  </View>
                  <View style={expertStyles.memberStat}>
                    <Text style={expertStyles.memberStatValue}>30%</Text>
                    <Text style={expertStyles.memberStatLabel}>Batterie</Text>
                  </View>
                  <View style={expertStyles.memberStat}>
                    <Text style={expertStyles.memberStatValue}>C</Text>
                    <Text style={expertStyles.memberStatLabel}>Zone</Text>
                  </View>
                </View>
                <View style={expertStyles.alertBadge}>
                  <Text style={expertStyles.alertText}>⚠️ Batterie faible</Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Actions rapides */}
          <View style={expertStyles.actionsSection}>
            <Text style={expertStyles.sectionTitle}>⚡ Actions Rapides</Text>
            <View style={expertStyles.actionsGrid}>
              <TouchableOpacity style={expertStyles.actionButton}>
                <Text style={expertStyles.actionIcon}>🗺️</Text>
                <Text style={expertStyles.actionText}>Carte</Text>
              </TouchableOpacity>
              <TouchableOpacity style={expertStyles.actionButton}>
                <Text style={expertStyles.actionIcon}>📊</Text>
                <Text style={expertStyles.actionText}>Rapports</Text>
              </TouchableOpacity>
              <TouchableOpacity style={expertStyles.actionButton}>
                <Text style={expertStyles.actionIcon}>⚙️</Text>
                <Text style={expertStyles.actionText}>Paramètres</Text>
              </TouchableOpacity>
              <TouchableOpacity style={expertStyles.actionButton}>
                <Text style={expertStyles.actionIcon}>📢</Text>
                <Text style={expertStyles.actionText}>Alertes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const expertStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e1a',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f3a 50%, #0f172a 100%)',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  
  // Login Styles
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: height,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 25,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  logoText: {
    fontSize: 40,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: 2,
  },
  brandSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
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
  
  formCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 24,
    padding: 32,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 20,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  securityIndicator: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  securityText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '600',
  },
  
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
    paddingHorizontal: 16,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    paddingVertical: 16,
  },
  
  loginButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    borderRadius: 16,
    paddingVertical: 18,
    marginTop: 8,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  loginButtonIcon: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  formFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  helpLink: {
    flex: 1,
    alignItems: 'center',
  },
  helpText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
  },
  
  // System Info
  systemInfo: {
    width: '100%',
    maxWidth: 400,
  },
  infoCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  
  statusBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  
  // Dashboard Styles
  dashboardContainer: {
    flex: 1,
  },
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: '#94a3b8',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    position: 'relative',
    marginRight: 16,
  },
  notificationIcon: {
    fontSize: 24,
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 8,
  },
  logoutIcon: {
    fontSize: 20,
  },
  
  timeCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    position: 'relative',
  },
  currentTime: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  currentDate: {
    fontSize: 16,
    color: '#94a3b8',
  },
  pulseDot: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
  },
  
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  
  // Stats Section
  statsSection: {
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconText: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 12,
  },
  statProgress: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
  
  // Team Section
  teamSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.4)',
  },
  viewAllText: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '600',
  },
  
  teamGrid: {
    gap: 16,
  },
  memberCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  warningCard: {
    borderColor: 'rgba(245, 158, 11, 0.4)',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberInitial: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 14,
    color: '#94a3b8',
  },
  memberStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  memberStat: {
    alignItems: 'center',
  },
  memberStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  memberStatLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  alertBadge: {
    marginTop: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    alignSelf: 'flex-start',
  },
  alertText: {
    color: '#f59e0b',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Actions Section
  actionsSection: {
    marginBottom: 32,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
});

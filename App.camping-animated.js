import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Données participants camping ordinaires
const CAMPING_PARTICIPANTS = [
  {
    id: '1',
    name: 'Alexandre Martin',
    role: 'Responsable Famille',
    department: 'Camping A',
    avatar: 'https://picsum.photos/seed/alex-camping/400/400.jpg',
    status: 'online',
    rssi: -45.00,
    battery: 88,
    zone: 'Emplacement A-12',
    phone: '+33612345678',
    family: 'Martin - 4 personnes',
    age: 35,
    sos: false,
    level: 'adulte',
    health: {
      heartRate: 72,
      stress: 15,
      focus: 92,
      energy: 85,
      mood: 'détendu',
      activity: 'repos',
      performance: 95
    },
    activities: {
      current: 'Installation tente',
      duration: '30 min',
      location: 'Emplacement familial',
      next_activity: '16:00 - Piscine',
      equipment: ['Tente 4p', 'Réfrigérateur', 'Chaises'],
      vehicle: 'Citroën Berlingo - AB-123-CD'
    },
    camping_info: {
      arrival_date: '2024-07-15',
      departure_date: '2024-07-22',
      spot_number: 'A-12',
      spot_type: 'Familial',
      services: ['Électricité', 'Eau', 'WC'],
      special_needs: 'Aucun'
    },
    contact: {
      emergency_contact: 'Marie Martin',
      medical_info: 'Aucun traitement',
      allergies: 'Aucune'
    }
  },
  {
    id: '2',
    name: 'Emma Dubois',
    role: 'Étudiante',
    department: 'Camping B',
    avatar: 'https://picsum.photos/seed/emma-camping/400/400.jpg',
    status: 'online',
    rssi: -48.00,
    battery: 76,
    zone: 'Emplacement B-08',
    phone: '+33623456789',
    family: 'Dubois - 3 personnes',
    age: 22,
    sos: false,
    level: 'adulte',
    health: {
      heartRate: 68,
      stress: 25,
      focus: 88,
      energy: 78,
      mood: 'active',
      activity: 'randonnée',
      performance: 87
    },
    activities: {
      current: 'Randonnée sentier 3',
      duration: '2h',
      location: 'Forêt du camping',
      next_activity: '18:00 - Barbecue collectif',
      equipment: ['Sac à dos', 'Bouteille eau', 'Carte'],
      vehicle: 'Peugeot 208 - DE-456-FG'
    },
    camping_info: {
      arrival_date: '2024-07-10',
      departure_date: '2024-07-17',
      spot_number: 'B-08',
      spot_type: 'Individuel',
      services: ['Électricité', 'Eau'],
      special_needs: 'Aucun'
    },
    contact: {
      emergency_contact: 'Jean Dubois',
      medical_info: 'Aucun traitement',
      allergies: 'Pollen'
    }
  },
  {
    id: '3',
    name: 'Lucas Bernard',
    role: 'Moniteur Animation',
    department: 'Équipe Animation',
    avatar: 'https://picsum.photos/seed/lucas-camping/400/400.jpg',
    status: 'warning',
    rssi: -75.00,
    battery: 32,
    zone: 'Zone Animation',
    phone: '+33634567890',
    family: 'Staff',
    age: 28,
    sos: true,
    level: 'staff',
    health: {
      heartRate: 95,
      stress: 42,
      focus: 65,
      energy: 35,
      mood: 'fatigué',
      activity: 'supervision',
      performance: 68
    },
    activities: {
      current: 'Animation enfants 6-12 ans',
      duration: '3h',
      location: 'Aire de jeux',
      next_activity: '19:00 - Soirée camping',
      equipment: ['Matériel jeux', 'Kit premier secours'],
      vehicle: 'Vélo électrique'
    },
    camping_info: {
      arrival_date: '2024-06-01',
      departure_date: '2024-09-30',
      spot_number: 'STAFF-01',
      spot_type: 'Staff',
      services: ['Logement staff', 'Repas'],
      special_needs: 'Aucun'
    },
    contact: {
      emergency_contact: 'Direction camping',
      medical_info: 'Aucun traitement',
      allergies: 'Aucune'
    }
  },
  {
    id: '4',
    name: 'Chloé Laurent',
    role: 'Adolescente',
    department: 'Camping C',
    avatar: 'https://picsum.photos/seed/chloe-camping/400/400.jpg',
    status: 'offline',
    rssi: -88.00,
    battery: 15,
    zone: 'Emplacement C-15',
    phone: '+33645678901',
    family: 'Laurent - 5 personnes',
    age: 14,
    sos: false,
    level: 'adolescent',
    health: {
      heartRate: 85,
      stress: 22,
      focus: 70,
      energy: 40,
      mood: 'calme',
      activity: 'lecture',
      performance: 85
    },
    activities: {
      current: 'Lecture au club house',
      duration: '1h',
      location: 'Club house',
      next_activity: '15:00 - Sports collectifs',
      equipment: ['Livre', 'Casque audio'],
      vehicle: 'Aucun'
    },
    camping_info: {
      arrival_date: '2024-07-12',
      departure_date: '2024-07-19',
      spot_number: 'C-15',
      spot_type: 'Familial',
      services: ['Électricité', 'Eau', 'WC', 'Douche'],
      special_needs: 'Aucun'
    },
    contact: {
      emergency_contact: 'Michel Laurent',
      medical_info: 'Aucun traitement',
      allergies: 'Aucune'
    }
  },
  {
    id: '5',
    name: 'Thomas Rousseau',
    role: 'Retraité',
    department: 'Camping D',
    avatar: 'https://picsum.photos/seed/thomas-camping/400/400.jpg',
    status: 'online',
    rssi: -52.00,
    battery: 82,
    zone: 'Emplacement D-03',
    phone: '+33656789012',
    family: 'Rousseau - 2 personnes',
    age: 67,
    sos: false,
    level: 'senior',
    health: {
      heartRate: 74,
      stress: 18,
      focus: 90,
      energy: 88,
      mood: 'content',
      activity: 'pêche',
      performance: 91
    },
    activities: {
      current: 'Pêche au lac',
      duration: '2h30',
      location: 'Lac du camping',
      next_activity: '17:30 - Apéritif',
      equipment: ['Canne à pêche', 'Chaise pliante'],
      vehicle: 'Renault Kangoo - GH-789-IJ'
    },
    camping_info: {
      arrival_date: '2024-07-08',
      departure_date: '2024-07-25',
      spot_number: 'D-03',
      spot_type: 'Confort',
      services: ['Électricité', 'Eau', 'WC', 'Douche', 'Cuisine'],
      special_needs: 'Mobilité réduite'
    },
    contact: {
      emergency_contact: 'Catherine Rousseau',
      medical_info: 'Hypertension contrôlée',
      allergies: 'Aucune'
    }
  },
  {
    id: '6',
    name: 'Léa Moreau',
    role: 'Enfant',
    department: 'Camping E',
    avatar: 'https://picsum.photos/seed/lea-camping/400/400.jpg',
    status: 'online',
    rssi: -58.00,
    battery: 90,
    zone: 'Aire de jeux',
    phone: '+33667890123',
    family: 'Moreau - 3 personnes',
    age: 8,
    sos: false,
    level: 'enfant',
    health: {
      heartRate: 75,
      stress: 16,
      focus: 87,
      energy: 92,
      mood: 'joyeux',
      activity: 'jeux',
      performance: 91
    },
    activities: {
      current: 'Jeux de société avec autres enfants',
      duration: '45 min',
      location: 'Aire de jeux couverte',
      next_activity: '16:30 - Goûter',
      equipment: ['Jouets', 'Vélos'],
      vehicle: 'Aucun'
    },
    camping_info: {
      arrival_date: '2024-07-14',
      departure_date: '2024-07-21',
      spot_number: 'E-07',
      spot_type: 'Familial',
      services: ['Électricité', 'Eau', 'WC'],
      special_needs: 'Aucun'
    },
    contact: {
      emergency_contact: 'David Moreau',
      medical_info: 'Aucun traitement',
      allergies: 'Aucune'
    }
  }
];

// Composant d'ondes animées
function AnimatedWaves() {
  const waveAnim1 = useRef(new Animated.Value(0)).current;
  const waveAnim2 = useRef(new Animated.Value(0)).current;
  const waveAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const waveAnimation1 = Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim1, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim1, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        })
      ])
    );
    
    const waveAnimation2 = Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim2, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim2, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        })
      ]);
    
    const waveAnimation3 = Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim3, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim3, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
        })
      ]);
    
    waveAnimation1.start();
    waveAnimation2.start();
    waveAnimation3.start();
    
    return () => {
      waveAnimation1.stop();
      waveAnimation2.stop();
      waveAnimation3.stop();
    };
  }, []);

  return (
    <View style={styles.wavesContainer}>
      <Animated.View
        style={[
          styles.wave,
          {
            height: waveAnim1.interpolate({
              inputRange: [0, 1],
              outputRange: [60, 80],
            }),
            opacity: waveAnim1.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.1, 0.3, 0.1],
            }),
          }
        ]}
      />
      <Animated.View
        style={[
          styles.wave,
          {
            height: waveAnim2.interpolate({
              inputRange: [0, 1],
              outputRange: [40, 60],
            }),
            opacity: waveAnim2.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.1, 0.2, 0.1],
            }),
          }
        ]}
      />
      <Animated.View
        style={[
          styles.wave,
          {
            height: waveAnim3.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 50],
            }),
            opacity: waveAnim3.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.05, 0.15, 0.05],
            }),
          }
        ]}
      />
    </View>
  );
}

// Composant de particules flottantes
function FloatingParticles() {
  const particles = useRef([...Array(15)].map(() => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 4 + 2,
    speed: Math.random() * 2 + 1,
    opacity: Math.random() * 0.5 + 0.1,
  }))).current;

  const animatedValues = useRef(
    particles.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const animations = particles.map((particle, index) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValues[index], {
            toValue: 1,
            duration: particle.speed * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValues[index], {
            toValue: 0,
            duration: particle.speed * 2000,
            useNativeDriver: true,
          })
        ])
      );
    });

    animations.forEach(anim => anim.start());

    return () => {
      animations.forEach(anim => anim.stop());
    };
  }, []);

  return (
    <View style={styles.particlesContainer}>
      {particles.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              left: particle.x,
              top: animatedValues[index].interpolate({
                inputRange: [0, 1],
                outputRange: [particle.y, particle.y - 100],
              }),
              width: particle.size,
              height: particle.size,
              opacity: animatedValues[index].interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, particle.opacity, 0],
              }),
              backgroundColor: '#22c55e',
              borderRadius: particle.size / 2,
            }
          ]}
        />
      ))}
    </View>
  );
}

// Écran Login camping avec animations améliorées
function LoginScreen({ onLoginSuccess }) {
  const [email, setEmail] = useState('camping@supervision.com');
  const [password, setPassword] = useState('camping2024');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animation de démarrage
    const startAnimation = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ]);

    // Animation de pulse continue
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      ])
    );

    startAnimation.start();
    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, []);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Attention', 'Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    
    // Animation de chargement
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 200,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      if (email === 'camping@supervision.com' && password === 'camping2024') {
        onLoginSuccess({ 
          name: 'Responsable Supervision', 
          email: email,
          role: 'Coordinateur Camping',
          level: 'admin',
          avatar: 'https://picsum.photos/seed/coordinator-camping/400/400.jpg'
        });
      } else {
        // Animation d'erreur
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: -0.1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0.1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          })
        ]).start();
        
        Alert.alert('Erreur d\'authentification', 'Email ou mot de passe incorrect');
      }
      
      // Animation de retour à la normale
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
      
      setIsLoading(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a2e" />
      
      {/* Background camping élégant avec animations */}
      <LinearGradient
        colors={['#1e3a2e', '#2d4a3d', '#3d5a4d', '#2d4a3d', '#1e3a2e']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Animations de fond */}
      <AnimatedWaves />
      <FloatingParticles />
      
      <ScrollView contentContainerStyle={styles.loginScrollContainer}>
        <Animated.View 
          style={[
            styles.loginContainer,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim },
                { rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                })}
              ]
            }
          ]}
        >
          {/* Header camping avec animations */}
          <View style={styles.header}>
            <Animated.View style={[
              styles.logoContainer,
              {
                transform: [
                  {
                    scale: Animated.add(1, Animated.multiply(
                      Animated.sin(rotateAnim),
                      0.05
                    ))
                  }
                ]
              }
            ]}>
              <LinearGradient
                colors={['#22c55e', '#16a34a', '#15803d']}
                style={styles.logoGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Animated.Text style={[
                  styles.logo,
                  {
                    transform: [
                      {
                        rotate: rotateAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '-360deg'],
                        })
                      }
                    ]
                  }
                ]}>🏕️</Animated.Text>
              </LinearGradient>
            </Animated.View>
            
            <Animated.Text style={[
              styles.title,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  })}
                ]
              }
            ]}>Supervision Camping</Animated.Text>
            
            <Animated.Text style={[
              styles.subtitle,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  })}
                ]
              }
            ]}>Système de Suivi des Vacanciers</Animated.Text>
            
            <Animated.View style={[
              styles.infoBadges,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  })}
                ]
              }
            ]}>
              <Animated.View style={[
                styles.infoBadge,
                {
                  transform: [
                    {
                      scale: Animated.add(1, Animated.multiply(
                        Animated.sin(rotateAnim),
                        0.1
                      ))
                    }
                  ]
                }
              ]}>
                <Text style={styles.infoBadgeText}>Sécurisé</Text>
              </Animated.View>
              <Animated.View style={[
                styles.infoBadge,
                {
                  transform: [
                    {
                      scale: Animated.add(1, Animated.multiply(
                        Animated.cos(rotateAnim),
                        0.1
                      ))
                    }
                  ]
                }
              ]}>
                <Text style={styles.infoBadgeText}>Professionnel</Text>
              </Animated.View>
            </Animated.View>
          </View>

          {/* Formulaire camping avec animations */}
          <Animated.View style={[
            styles.form,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                })}
              ]
            }
          ]}>
            <Animated.Text style={[
              styles.sectionTitle,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [15, 0],
                  })}
                ]
              }
            ]}>Connexion Sécurisée</Animated.Text>
            
            <Animated.View style={[
              styles.inputGroup,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, 0],
                  })}
                ]
              }
            ]}>
              <Text style={styles.inputLabel}>Email du camping</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail" size={20} color="#a1a1aa" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="camping@supervision.com"
                  placeholderTextColor="#a1a1aa"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading}
                />
              </View>
            </Animated.View>
            
            <Animated.View style={[
              styles.inputGroup,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, 0],
                  })}
                ]
              }
            ]}>
              <Text style={styles.inputLabel}>Mot de passe</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} color="#a1a1aa" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="•••••••••••"
                  placeholderTextColor="#a1a1aa"
                  secureTextEntry={!showPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off" : "eye"} 
                    size={20} 
                    color="#a1a1aa" 
                  />
                </TouchableOpacity>
              </View>
            </Animated.View>
            
            <TouchableOpacity 
              style={[
                styles.loginButton, 
                isLoading && styles.loginButtonDisabled
              ]} 
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={isLoading ? ['#6b7280', '#4b5563'] : ['#22c55e', '#16a34a']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <Animated.View style={[
              styles.loginInfo,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, 0],
                  })}
                ]
              }
            ]}>
              <Text style={styles.infoText}>{CAMPING_PARTICIPANTS.length} vacanciers</Text>
              <Text style={styles.infoText}>Système sécurisé 256-bit</Text>
              <Text style={styles.infoText}>Suivi en temps réel</Text>
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// Écran Home camping avec animations améliorées
function HomeScreen({ user, onLogout }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [participants, setParticipants] = useState(CAMPING_PARTICIPANTS);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Animations pour le header
  const headerScale = useRef(new Animated.Value(1)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    
    // Animation de rafraîchissement
    Animated.sequence([
      Animated.timing(headerScale, {
        toValue: 0.95,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(headerScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();

    setTimeout(() => {
      setParticipants(prevParticipants => 
        prevParticipants.map(participant => ({
          ...participant,
          rssi: Math.max(-120, Math.min(-30, participant.rssi + (Math.random() - 0.5) * 5)),
          battery: Math.max(0, Math.min(100, participant.battery - Math.random() * 2)),
          health: {
            ...participant.health,
            heartRate: Math.floor(60 + Math.random() * 40),
            stress: Math.random() * 0.5,
            energy: Math.max(0.1, participant.health.energy - Math.random() * 0.05),
            performance: Math.max(50, Math.min(100, participant.health.performance + (Math.random() - 0.5) * 10))
          }
        }))
      );
      setRefreshing(false);
    }, 2000);
  };

  const getFilteredParticipants = () => {
    switch (selectedFilter) {
      case 'enfants':
        return participants.filter(p => p.level === 'enfant');
      case 'ados':
        return participants.filter(p => p.level === 'adolescent');
      case 'adultes':
        return participants.filter(p => p.level === 'adulte');
      case 'seniors':
        return participants.filter(p => p.level === 'senior');
      case 'staff':
        return participants.filter(p => p.level === 'staff');
      case 'online':
        return participants.filter(p => p.status === 'online');
      case 'warning':
        return participants.filter(p => p.status === 'warning');
      case 'offline':
        return participants.filter(p => p.status === 'offline');
      case 'alerts':
        return participants.filter(p => p.sos === true);
      default:
        return participants;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#22c55e';
      case 'warning': return '#f59e0b';
      case 'offline': return '#64748b';
      default: return '#64748b';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'staff': return '#dc2626';
      case 'senior': return '#8b5cf6';
      case 'adulte': return '#3b82f6';
      case 'adolescent': return '#f59e0b';
      case 'enfant': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'staff': return '👔';
      case 'senior': return '👴';
      case 'adulte': return '👤';
      case 'adolescent': return '🧑';
      case 'enfant': return '👶';
      default: return '👤';
    }
  };

  const getLevelTitle = (level) => {
    switch (level) {
      case 'staff': return 'Personnel';
      case 'senior': return 'Senior';
      case 'adulte': return 'Adulte';
      case 'adolescent': return 'Adolescent';
      case 'enfant': return 'Enfant';
      default: return 'Participant';
    }
  };

  const filteredParticipants = getFilteredParticipants();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a2e" />
      
      {/* Background camping élégant avec animations */}
      <LinearGradient
        colors={['#1e3a2e', '#2d4a3d', '#3d5a4d', '#2d4a3d', '#1e3a2e']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Animations de fond */}
      <AnimatedWaves />
      <FloatingParticles />
      
      <Animated.ScrollView
        style={styles.dashboardContainer}
        contentContainerStyle={styles.dashboardScrollContainer}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh}
            colors={['#22c55e', '#16a34a']}
            tintColor="#22c55e"
          />
        }
      >
        {/* Header camping avec animations */}
        <Animated.View 
          style={[
            styles.dashboardHeader,
            {
              transform: [
                { scale: headerScale },
                { opacity: headerOpacity }
              ]
            }
          ]}
        >
          <LinearGradient
            colors={['rgba(34, 197, 94, 0.1)', 'rgba(22, 163, 74, 0.1)']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.userInfo}>
              <Image source={{ uri: user?.avatar }} style={styles.userAvatar} />
              <View style={styles.userDetails}>
                <Text style={styles.greeting}>Bonjour, {user?.name || 'Admin'}</Text>
                <Text style={styles.userRole}>{user?.role || 'Coordinateur Camping'}</Text>
                <Text style={styles.time}>{currentTime.toLocaleTimeString()}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
              <LinearGradient
                colors={['#ef4444', '#dc2626']}
                style={styles.logoutGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="log-out" size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        {/* Statistiques camping avec animations */}
        <Animated.View style={[
          styles.statsSection,
          {
            opacity: scrollY.interpolate({
              inputRange: [0, 100],
              outputRange: [1, 1],
              extrapolate: 'clamp'
            })
          }
        ]}>
          <Text style={styles.sectionTitle}>Tableau de Bord</Text>
          <View style={styles.statsGrid}>
            <Animated.View style={[
              styles.statCard,
              {
                transform: [
                  {
                    scale: scrollY.interpolate({
                      inputRange: [0, 100],
                      outputRange: [0.95, 1],
                      extrapolate: 'clamp'
                    })
                  }
                ]
              }
            ]}>
              <LinearGradient
                colors={['#22c55e', '#16a34a']}
                style={styles.statCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.statValue}>{participants.length}</Text>
                <Text style={styles.statLabel}>Total</Text>
                <Ionicons name="people" size={24} color="rgba(255,255,255,0.3)" style={styles.statIcon} />
              </LinearGradient>
            </Animated.View>
            
            <Animated.View style={[
              styles.statCard,
              {
                transform: [
                  {
                    scale: scrollY.interpolate({
                      inputRange: [0, 100],
                      outputRange: [0.95, 1],
                      extrapolate: 'clamp'
                    })
                  }
                ]
              }
            ]}>
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.statCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.statValue}>{participants.filter(p => p.status === 'online').length}</Text>
                <Text style={styles.statLabel}>Actifs</Text>
                <Ionicons name="checkmark-circle" size={24} color="rgba(255,255,255,0.3)" style={styles.statIcon} />
              </LinearGradient>
            </Animated.View>
            
            <Animated.View style={[
              styles.statCard,
              {
                transform: [
                  {
                    scale: scrollY.interpolate({
                      inputRange: [0, 100],
                      outputRange: [0.95, 1],
                      extrapolate: 'clamp'
                    })
                  }
                ]
              }
            ]}>
              <LinearGradient
                colors={['#f59e0b', '#d97706']}
                style={styles.statCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.statValue}>{participants.filter(p => p.sos === true).length}</Text>
                <Text style={styles.statLabel}>Alertes</Text>
                <Ionicons name="warning" size={24} color="rgba(255,255,255,0.3)" style={styles.statIcon} />
              </LinearGradient>
            </Animated.View>
            
            <Animated.View style={[
              styles.statCard,
              {
                transform: [
                  {
                    scale: scrollY.interpolate({
                      inputRange: [0, 100],
                      outputRange: [0.95, 1],
                      extrapolate: 'clamp'
                    })
                  }
                ]
              }
            ]}>
              <LinearGradient
                colors={['#3b82f6', '#1d4ed8']}
                style={styles.statCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.statValue}>{Math.round(participants.reduce((sum, p) => sum + p.health.performance, 0) / participants.length)}%</Text>
                <Text style={styles.statLabel}>Bien-être</Text>
                <Ionicons name="heart" size={24} color="rgba(255,255,255,0.3)" style={styles.statIcon} />
              </LinearGradient>
            </Animated.View>
          </View>
        </Animated.View>

        {/* Filtres camping avec animations */}
        <View style={styles.filtersSection}>
          <Text style={styles.sectionTitle}>Filtres</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollContainer}
          >
            {['all', 'enfants', 'ados', 'adultes', 'seniors', 'staff', 'online', 'warning', 'offline', 'alerts'].map((filter, index) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  selectedFilter === filter && styles.activeFilter
                ]}
                onPress={() => setSelectedFilter(filter)}
                activeOpacity={0.8}
              >
                {selectedFilter === filter ? (
                  <LinearGradient
                    colors={['#22c55e', '#16a34a']}
                    style={styles.filterGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.activeFilterText}>
                      {filter === 'all' && 'Tous'}
                      {filter === 'enfants' && 'Enfants'}
                      {filter === 'ados' && 'Adolescents'}
                      {filter === 'adultes' && 'Adultes'}
                      {filter === 'seniors' && 'Seniors'}
                      {filter === 'staff' && 'Personnel'}
                      {filter === 'online' && 'Actifs'}
                      {filter === 'warning' && 'Attention'}
                      {filter === 'offline' && 'Hors ligne'}
                      {filter === 'alerts' && 'Alertes'}
                    </Text>
                  </LinearGradient>
                ) : (
                  <Text style={styles.filterText}>
                    {filter === 'all' && 'Tous'}
                    {filter === 'enfants' && 'Enfants'}
                    {filter === 'ados' && 'Adolescents'}
                    {filter === 'adultes' && 'Adultes'}
                    {filter === 'seniors' && 'Seniors'}
                    {filter === 'staff' && 'Personnel'}
                    {filter === 'online' && 'Actifs'}
                    {filter === 'warning' && 'Attention'}
                    {filter === 'offline' && 'Hors ligne'}
                    {filter === 'alerts' && 'Alertes'}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Liste des participants camping avec animations */}
        <View style={styles.participantsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Vacanciers</Text>
            <Text style={styles.participantCount}>{filteredParticipants.length} personnes</Text>
          </View>
          
          {filteredParticipants.map((participant, index) => (
            <Animated.View
              key={participant.id}
              style={[
                styles.participantCard,
                {
                  opacity: scrollY.interpolate({
                    inputRange: [0, 200],
                    outputRange: [0, 1],
                    extrapolate: 'clamp'
                  }),
                  transform: [
                    {
                      translateY: scrollY.interpolate({
                        inputRange: [0, 200],
                        outputRange: [50, 0],
                        extrapolate: 'clamp'
                      })
                  }
                ]
              }
              ]}
            >
              <TouchableOpacity
                style={styles.participantCardContent}
                onPress={() => console.log('Détails participant:', participant.id)}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['rgba(45, 74, 61, 0.95)', 'rgba(30, 58, 46, 0.95)', 'rgba(34, 197, 94, 0.05)']}
                  style={styles.participantCardGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.participantHeader}>
                    <View style={styles.avatarContainer}>
                      <Image source={{ uri: participant.avatar }} style={styles.participantAvatar} />
                      <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(participant.status) }]} />
                      <View style={[styles.levelBadge, { backgroundColor: getLevelColor(participant.level) }]}>
                        <Text style={styles.levelBadgeText}>{getLevelIcon(participant.level)}</Text>
                      </View>
                      {/* Aura animée pour les alertes */}
                      {participant.sos && (
                        <Animated.View
                          style={[
                            styles.alertAura,
                            {
                              borderColor: getStatusColor('warning'),
                              opacity: Animated.add(0.3, Animated.multiply(
                                Animated.sin(new Animated.Value(0).setValue(Date.now() / 1000)),
                                0.5
                              ))
                            }
                          ]}
                        />
                      )}
                    </View>
                    <View style={styles.participantInfo}>
                      <Text style={styles.participantName}>{participant.name}</Text>
                      <Text style={styles.participantRole}>{participant.role}</Text>
                      <Text style={styles.participantDepartment}>{participant.department}</Text>
                      <Text style={styles.participantLevel}>{getLevelTitle(participant.level)} - {participant.age} ans</Text>
                      <Text style={styles.participantFamily}>Famille: {participant.family}</Text>
                      <View style={styles.participantStatus}>
                        <View style={[styles.statusDot, { backgroundColor: getStatusColor(participant.status) }]} />
                        <Text style={[styles.statusText, { color: getStatusColor(participant.status) }]}>
                          {participant.status === 'online' ? 'Actif' : 
                           participant.status === 'warning' ? 'Attention' : 'Hors ligne'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.participantStats}>
                      <Text style={styles.participantRSSI}>{participant.rssi.toFixed(2)} dBm</Text>
                      <View style={styles.batteryContainer}>
                        <Text style={styles.participantBattery}>{participant.battery}%</Text>
                        <View style={[styles.batteryBar, { width: `${participant.battery}%` }]} />
                      </View>
                      <Ionicons name="chevron-forward" size={16} color="#a1a1aa" />
                    </View>
                  </View>
                  
                  {/* Santé et Bien-être avec animations */}
                  <View style={styles.healthContainer}>
                    <Animated.View style={[
                      styles.healthItem,
                      {
                        transform: [
                          {
                            scale: scrollY.interpolate({
                              inputRange: [0, 200],
                              outputRange: [0.8, 1],
                              extrapolate: 'clamp'
                            })
                          }
                        ]
                      }
                    ]}>
                      <LinearGradient
                        colors={['#ef4444', '#dc2626']}
                        style={styles.healthIcon}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Ionicons name="heart" size={16} color="white" />
                      </LinearGradient>
                      <Text style={styles.healthValue}>{participant.health.heartRate}</Text>
                      <Text style={styles.healthLabel}>Rythme</Text>
                    </Animated.View>
                    
                    <Animated.View style={[
                      styles.healthItem,
                      {
                        transform: [
                          {
                            scale: scrollY.interpolate({
                              inputRange: [0, 200],
                              outputRange: [0.8, 1],
                              extrapolate: 'clamp'
                            })
                          }
                        ]
                      }
                    ]}>
                      <LinearGradient
                        colors={['#f59e0b', '#d97706']}
                        style={styles.healthIcon}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Ionicons name="battery-charging" size={16} color="white" />
                      </LinearGradient>
                      <Text style={styles.healthValue}>{Math.round(participant.health.energy * 100)}%</Text>
                      <Text style={styles.healthLabel}>Énergie</Text>
                    </Animated.View>
                    
                    <Animated.View style={[
                      styles.healthItem,
                      {
                        transform: [
                          {
                            scale: scrollY.interpolate({
                              inputRange: [0, 200],
                              outputRange: [0.8, 1],
                              extrapolate: 'clamp'
                            })
                          }
                        ]
                      }
                    ]}>
                      <LinearGradient
                        colors={['#3b82f6', '#1d4ed8']}
                        style={styles.healthIcon}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Ionicons name="trending-up" size={16} color="white" />
                      </LinearGradient>
                      <Text style={styles.healthValue}>{Math.round(participant.health.performance)}%</Text>
                      <Text style={styles.healthLabel}>Bien-être</Text>
                    </Animated.View>
                    
                    <Animated.View style={[
                      styles.healthItem,
                      {
                        transform: [
                          {
                            scale: scrollY.interpolate({
                              inputRange: [0, 200],
                              outputRange: [0.8, 1],
                              extrapolate: 'clamp'
                            })
                          }
                        ]
                      }
                    ]}>
                      <LinearGradient
                        colors={['#10b981', '#059669']}
                        style={styles.healthIcon}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Ionicons name="happy" size={16} color="white" />
                      </LinearGradient>
                      <Text style={styles.healthValue}>{participant.health.mood}</Text>
                      <Text style={styles.healthLabel}>Humeur</Text>
                    </Animated.View>
                  </View>
                  
                  {/* Activités */}
                  <View style={styles.activitiesContainer}>
                    <Text style={styles.activitiesTitle}>Activité Actuelle</Text>
                    <View style={styles.activitiesInfo}>
                      <Text style={styles.currentActivity}>{participant.activities.current}</Text>
                      <Text style={styles.activityDuration}>⏱️ {participant.activities.duration}</Text>
                      <Text style={styles.activityLocation}>📍 {participant.activities.location}</Text>
                      <Text style={styles.nextActivity}>👤 Prochaine: {participant.activities.next_activity}</Text>
                      <Text style={styles.equipmentList}>🎒 Équipement: {participant.activities.equipment.join(', ')}</Text>
                      <Text style={styles.vehicleInfo}>🚗 Véhicule: {participant.activities.vehicle}</Text>
                    </View>
                  </View>
                  
                  {/* Informations Camping */}
                  <View style={styles.campingContainer}>
                    <Text style={styles.campingTitle}>Informations Camping</Text>
                    <View style={styles.campingInfo}>
                      <Text style={styles.campingItem}>📍 Emplacement: {participant.camping_info.spot_number}</Text>
                      <Text style={styles.campingItem}>🏕️ Type: {participant.camping_info.spot_type}</Text>
                      <Text style={styles.campingItem}>📅 Arrivée: {participant.camping_info.arrival_date}</Text>
                      <Text style={styles.campingItem}>📅 Départ: {participant.camping_info.departure_date}</Text>
                      <Text style={styles.campingItem}>🛠️ Services: {participant.camping_info.services.join(', ')}</Text>
                      {participant.camping_info.special_needs !== 'Aucun' && (
                        <Text style={styles.campingItem}>♿ Besoins: {participant.camping_info.special_needs}</Text>
                      )}
                    </View>
                  </View>
                  
                  {/* Contact */}
                  <View style={styles.contactContainer}>
                    <Text style={styles.contactTitle}>Contact</Text>
                    <View style={styles.contactInfo}>
                      <Text style={styles.contactItem}>📞 Contact: {participant.phone}</Text>
                      <Text style={styles.contactItem}>🆘 Urgence: {participant.contact.emergency_contact}</Text>
                      <Text style={styles.contactItem}>🏥 Médical: {participant.contact.medical_info}</Text>
                      <Text style={styles.contactItem}>⚠️ Allergies: {participant.contact.allergies}</Text>
                    </View>
                  </View>
                  
                  {participant.sos && (
                    <Animated.View style={[
                      styles.alertButton,
                      {
                        transform: [
                          {
                            scale: scrollY.interpolate({
                              inputRange: [0, 200],
                              outputRange: [0.95, 1],
                              extrapolate: 'clamp'
                            })
                          }
                        ]
                      }
                    ]}>
                      <TouchableOpacity style={styles.alertButtonContent}>
                        <LinearGradient
                          colors={['#ef4444', '#dc2626', '#b91c1c']}
                          style={styles.alertGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        >
                          <Ionicons name="warning" size={20} color="white" />
                          <Text style={styles.alertText}>Alerte Requise</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </Animated.View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

// App principal camping avec animations
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
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
        <StatusBar barStyle="light-content" backgroundColor="#1e3a2e" />
        <LinearGradient
          colors={['#1e3a2e', '#2d4a3d', '#3d5a4d', '#2d4a3d', '#1e3a2e']}
          style={styles.background}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        {/* Animations de fond pendant le chargement */}
        <AnimatedWaves />
        <FloatingParticles />
        
        <View style={styles.loadingContainer}>
          <Animated.Text style={[
            styles.loadingLogo,
            {
              transform: [
                {
                  scale: new Animated.Value(0).interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                    extrapolate: 'clamp'
                  })
                }
              ]
            }
          ]}>🏕️</Animated.Text>
          <Animated.Text style={[
            styles.loadingText,
            {
              opacity: new Animated.Value(0).interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
                extrapolate: 'clamp'
              })
            }
          ]}>Supervision Camping</Animated.Text>
          <Animated.Text style={[
            styles.loadingSubtext,
            {
              opacity: new Animated.Value(0).interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
                extrapolate: 'clamp'
              })
            }
          ]}>Chargement du système...</Animated.Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a2e" />
      <LinearGradient
        colors={['#1e3a2e', '#2d4a3d', '#3d5a4d', '#2d4a3d', '#1e3a2e']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Animations de fond */}
      <AnimatedWaves />
      <FloatingParticles />
      
      {!isAuthenticated ? (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      ) : (
        <HomeScreen user={user} onLogout={handleLogout} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e3a2e',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  
  // Animations de fond
  wavesContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  wave: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: 50,
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
    borderRadius: 50,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingLogo: {
    fontSize: 80,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textShadowColor: 'rgba(34, 197, 94, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 15,
  },
  loadingSubtext: {
    fontSize: 18,
    color: '#a1a1aa',
    fontStyle: 'italic',
  },
  
  // Login Styles Camping avec animations
  loginScrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 30,
  },
  loginContainer: {
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoGradient: {
    width: 100,
    height: 100,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(34, 197, 94, 0.3)',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logo: {
    fontSize: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textShadowColor: 'rgba(34, 197, 94, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#a1a1aa',
    marginBottom: 20,
  },
  infoBadges: {
    flexDirection: 'row',
    gap: 10,
  },
  infoBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  infoBadgeText: {
    fontSize: 12,
    color: '#a1a1aa',
    fontWeight: '600',
  },
  
  // Formulaire Camping avec animations
  form: {
    width: '100%',
    maxWidth: 450,
    backgroundColor: 'rgba(45, 74, 61, 0.95)',
    borderRadius: 20,
    padding: 35,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 25,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 14,
    color: '#a1a1aa',
    marginBottom: 8,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 58, 46, 0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.2)',
  },
  inputIcon: {
    padding: 15,
  },
  input: {
    flex: 1,
    padding: 15,
    color: '#ffffff',
    fontSize: 16,
    borderRadius: 12,
  },
  eyeIcon: {
    padding: 15,
  },
  loginButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 5,
  },
  loginButtonDisabled: {
    shadowColor: '#6b7280',
    shadowOpacity: 0.2,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginInfo: {
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#a1a1aa',
  },
  
  // Dashboard Styles Camping avec animations
  dashboardContainer: {
    flex: 1,
  },
  dashboardScrollContainer: {
    padding: 20,
  },
  dashboardHeader: {
    borderRadius: 16,
    marginBottom: 25,
    overflow: 'hidden',
  },
  headerGradient: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(34, 197, 94, 0.3)',
    marginRight: 15,
  },
  userDetails: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 14,
    color: '#a1a1aa',
    marginBottom: 2,
  },
  time: {
    fontSize: 12,
    color: '#71717a',
  },
  logoutButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  logoutGradient: {
    padding: 12,
    borderRadius: 20,
  },
  
  // Stats Section Camping avec animations
  statsSection: {
    marginBottom: 30,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  statCardGradient: {
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  statIcon: {
    position: 'absolute,
    top: 15,
    right: 15,
  },
  
  // Filters Section Camping
  filtersSection: {
    marginBottom: 30,
  },
  filterScrollContainer: {
    paddingHorizontal: 5,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.2)',
    backgroundColor: 'rgba(45, 74, 61, 0.9)',
    marginRight: 10,
  },
  activeFilter: {
    borderColor: 'transparent',
  },
  filterGradient: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  filterText: {
    fontSize: 14,
    color: '#a1a1aa',
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  
  // Participants Section Camping avec animations
  participantsSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  participantCount: {
    fontSize: 14,
    color: '#a1a1aa',
    backgroundColor: 'rgba(45, 74, 61, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  
  // Participant Cards Camping avec animations
  participantCard: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  participantCardContent: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  participantCardGradient: {
    padding: 20,
  },
  participantHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  participantAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#1e3a2e',
  },
  levelBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1e3a2e',
  },
  levelBadgeText: {
    fontSize: 12,
  },
  alertAura: {
    position: 'absolute',
    top: -15,
    left: -15,
    right: -15,
    bottom: -15,
    borderRadius: 50,
    borderWidth: 3,
    borderStyle: 'dashed',
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 3,
  },
  participantRole: {
    fontSize: 14,
    color: '#22c55e',
    marginBottom: 2,
  },
  participantDepartment: {
    fontSize: 12,
    color: '#a1a1aa',
    marginBottom: 2,
  },
  participantLevel: {
    fontSize: 12,
    color: '#71717a',
    marginBottom: 2,
  },
  participantFamily: {
    fontSize: 12,
    color: '#8b5cf6',
    marginBottom: 4,
  },
  participantStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  participantStats: {
    alignItems: 'flex-end',
    gap: 4,
  },
  participantRSSI: {
    fontSize: 11,
    color: '#71717a',
  },
  batteryContainer: {
    alignItems: 'flex-end',
  },
  participantBattery: {
    fontSize: 11,
    color: '#71717a',
    marginBottom: 2,
  },
  batteryBar: {
    height: 3,
    backgroundColor: '#22c55e',
    borderRadius: 2,
    minWidth: 20,
  },
  
  // Health Container Camping avec animations
  healthContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 10,
  },
  healthItem: {
    alignItems: 'center',
    flex: 1,
  },
  healthIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  healthValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  healthLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  
  // Activities Container Camping
  activitiesContainer: {
    marginBottom: 15,
  },
  activitiesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  activitiesInfo: {
    backgroundColor: 'rgba(45, 74, 61, 0.6)',
    borderRadius: 12,
    padding: 12,
  },
  currentActivity: {
    fontSize: 13,
    color: '#22c55e',
    marginBottom: 2,
  },
  activityDuration: {
    fontSize: 12,
    color: '#71717a',
    marginBottom: 2,
  },
  activityLocation: {
    fontSize: 12,
    color: '#3b82f6',
    marginBottom: 2,
  },
  nextActivity: {
    fontSize: 12,
    color: '#8b5cf6',
    marginBottom: 2,
  },
  equipmentList: {
    fontSize: 12,
    color: '#f59e0b',
    marginBottom: 2,
  },
  vehicleInfo: {
    fontSize: 12,
    color: '#64748b',
  },
  
  // Camping Container
  campingContainer: {
    marginBottom: 15,
  },
  campingTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  campingInfo: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.2)',
  },
  campingItem: {
    fontSize: 12,
    color: '#a1a1aa',
    marginBottom: 2,
  },
  
  // Contact Container Camping
  contactContainer: {
    marginBottom: 15,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  contactInfo: {
    backgroundColor: 'rgba(45, 74, 61, 0.6)',
    borderRadius: 12,
    padding: 12,
  },
  contactItem: {
    fontSize: 12,
    color: '#a1a1aa',
    marginBottom: 2,
  },
  
  // Alert Button Camping avec animations
  alertButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  alertButtonContent: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  alertGradient: {
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  alertText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

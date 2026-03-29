// Données complètes des membres avec profils indépendants
export const MEMBERS_PROFILES = [
  {
    id: '1',
    name: 'Alexandre Dubois',
    firstName: 'Alexandre',
    lastName: 'Dubois',
    role: 'Chef de Groupe',
    department: 'Direction',
    avatar: 'https://picsum.photos/seed/alexandre-dubois/400/400.jpg',
    coverPhoto: 'https://picsum.photos/seed/alexandre-cover/800/300.jpg',
    status: 'online',
    rssi: -50.00,
    battery: 90,
    zone: 'Zone A - Commandement',
    coordinates: { lat: 48.8566, lng: 2.3522 },
    lastSeen: new Date(),
    phone: '+33612345678',
    email: 'alexandre.dubois@rssi.com',
    sos: false,
    
    // Informations personnelles
    age: 42,
    birthDate: '1982-03-15',
    address: '15 Rue de la République, 75001 Paris',
    emergencyContact: {
      name: 'Marie Dubois',
      phone: '+33687654321',
      relation: 'Épouse'
    },
    
    // Compétences et certifications
    skills: [
      { name: 'Leadership', level: 95, icon: '👑' },
      { name: 'Stratégie', level: 90, icon: '🎯' },
      { name: 'Communication', level: 85, icon: '📢' },
      { name: 'Gestion de crise', level: 88, icon: '🚨' },
      { name: 'Planification', level: 92, icon: '📋' }
    ],
    certifications: [
      'PMP - Project Management Professional',
      'ITIL Foundation',
      'Scrum Master',
      'Certification en Sécurité'
    ],
    
    // Santé et biométrie
    health: {
      heartRate: 72,
      bloodPressure: '120/80',
      temperature: 36.5,
      oxygenLevel: 98,
      stress: 0.2,
      focus: 0.9,
      energy: 0.85,
      mood: 'focused',
      sleepHours: 7.5,
      steps: 8432,
      calories: 2150
    },
    
    // Équipement
    equipment: {
      device: 'Bracelet RSSI Pro',
      deviceModel: 'RSSI-2024-X1',
      serialNumber: 'RSSI-AD-001',
      firmware: 'v2.1.0',
      lastUpdate: new Date()
    },
    
    // Historique
    history: {
      missions: 127,
      interventions: 23,
      awards: 5,
      rating: 4.8,
      joinDate: '2018-06-01'
    },
    
    // Préférences
    preferences: {
      language: 'fr',
      theme: 'dark',
      notifications: true,
      locationSharing: true,
      emergencyAlerts: true
    }
  },
  
  {
    id: '2',
    name: 'Sarah Martin',
    firstName: 'Sarah',
    lastName: 'Martin',
    role: 'Agent de Sécurité',
    department: 'Sécurité',
    avatar: 'https://picsum.photos/seed/sarah-martin/400/400.jpg',
    coverPhoto: 'https://picsum.photos/seed/sarah-cover/800/300.jpg',
    status: 'online',
    rssi: -72.00,
    battery: 60,
    zone: 'Zone B - Périmètre Avancé',
    coordinates: { lat: 48.8599, lng: 2.3470 },
    lastSeen: new Date(),
    phone: '+33623456789',
    email: 'sarah.martin@rssi.com',
    sos: false,
    
    // Informations personnelles
    age: 35,
    birthDate: '1989-07-22',
    address: '23 Avenue des Champs-Élysées, 75008 Paris',
    emergencyContact: {
      name: 'Pierre Martin',
      phone: '+33698765432',
      relation: 'Frère'
    },
    
    // Compétences et certifications
    skills: [
      { name: 'Sécurité', level: 95, icon: '🛡️' },
      { name: 'Détection', level: 88, icon: '🔍' },
      { name: 'Combat', level: 82, icon: '⚔️' },
      { name: 'Premiers secours', level: 90, icon: '🏥' },
      { name: 'Patrouille', level: 94, icon: '🚶‍♀️' }
    ],
    certifications: [
      'Agent de Sécurité Certifié',
      'Premiers Secours CPR/AED',
      'Détection de Menaces',
      'Gestion de Foules'
    ],
    
    // Santé et biométrie
    health: {
      heartRate: 85,
      bloodPressure: '125/82',
      temperature: 36.8,
      oxygenLevel: 97,
      stress: 0.4,
      focus: 0.8,
      energy: 0.75,
      mood: 'alert',
      sleepHours: 6.8,
      steps: 12456,
      calories: 2890
    },
    
    // Équipement
    equipment: {
      device: 'Bracelet RSSI Pro',
      deviceModel: 'RSSI-2024-X2',
      serialNumber: 'RSSI-SM-002',
      firmware: 'v2.1.0',
      lastUpdate: new Date()
    },
    
    // Historique
    history: {
      missions: 89,
      interventions: 45,
      awards: 3,
      rating: 4.6,
      joinDate: '2020-03-15'
    },
    
    // Préférences
    preferences: {
      language: 'fr',
      theme: 'dark',
      notifications: true,
      locationSharing: true,
      emergencyAlerts: true
    }
  },
  
  {
    id: '3',
    name: 'Thomas Bernard',
    firstName: 'Thomas',
    lastName: 'Bernard',
    role: 'Technicien RSSI',
    department: 'Technique',
    avatar: 'https://picsum.photos/seed/thomas-bernard/400/400.jpg',
    coverPhoto: 'https://picsum.photos/seed/thomas-cover/800/300.jpg',
    status: 'warning',
    rssi: -85.00,
    battery: 30,
    zone: 'Zone C - Laboratoire',
    coordinates: { lat: 48.8584, lng: 2.2945 },
    lastSeen: new Date(Date.now() - 300000),
    phone: '+33634567890',
    email: 'thomas.bernard@rssi.com',
    sos: true,
    
    // Informations personnelles
    age: 38,
    birthDate: '1986-11-08',
    address: '42 Rue de la Tour Eiffel, 75007 Paris',
    emergencyContact: {
      name: 'Sophie Bernard',
      phone: '+33676543210',
      relation: 'Sœur'
    },
    
    // Compétences et certifications
    skills: [
      { name: 'Réseaux', level: 92, icon: '🌐' },
      { name: 'RSSI', level: 95, icon: '📡' },
      { name: 'Dépannage', level: 88, icon: '🔧' },
      { name: 'Programmation', level: 85, icon: '💻' },
      { name: 'Maintenance', level: 90, icon: '⚙️' }
    ],
    certifications: [
      'Cisco CCNA',
      'CompTIA Network+',
      'RSSI Specialist',
      'IT Support Specialist'
    ],
    
    // Santé et biométrie
    health: {
      heartRate: 95,
      bloodPressure: '135/88',
      temperature: 37.2,
      oxygenLevel: 96,
      stress: 0.6,
      focus: 0.7,
      energy: 0.4,
      mood: 'stressed',
      sleepHours: 5.5,
      steps: 6234,
      calories: 1920
    },
    
    // Équipement
    equipment: {
      device: 'Bracelet RSSI Pro',
      deviceModel: 'RSSI-2024-X1',
      serialNumber: 'RSSI-TB-003',
      firmware: 'v2.0.8',
      lastUpdate: new Date(Date.now() - 7200000)
    },
    
    // Historique
    history: {
      missions: 156,
      interventions: 67,
      awards: 4,
      rating: 4.7,
      joinDate: '2019-09-10'
    },
    
    // Préférences
    preferences: {
      language: 'fr',
      theme: 'dark',
      notifications: true,
      locationSharing: true,
      emergencyAlerts: true
    }
  },
  
  {
    id: '4',
    name: 'Marie Laurent',
    firstName: 'Marie',
    lastName: 'Laurent',
    role: 'Médical d\'Urgence',
    department: 'Médical',
    avatar: 'https://picsum.photos/seed/marie-laurent/400/400.jpg',
    coverPhoto: 'https://picsum.photos/seed/marie-cover/800/300.jpg',
    status: 'offline',
    rssi: -95.00,
    battery: 15,
    zone: 'Zone D - Centre Médical',
    coordinates: { lat: 48.8606, lng: 2.3376 },
    lastSeen: new Date(Date.now() - 600000),
    phone: '+33645678901',
    email: 'marie.laurent@rssi.com',
    sos: false,
    
    // Informations personnelles
    age: 41,
    birthDate: '1983-05-18',
    address: '8 Rue du Faubourg Saint-Honoré, 75008 Paris',
    emergencyContact: {
      name: 'Dr. Laurent',
      phone: '+33654321098',
      relation: 'Époux'
    },
    
    // Compétences et certifications
    skills: [
      { name: 'Médecine', level: 96, icon: '⚕️' },
      { name: 'Urgences', level: 94, icon: '🚑' },
      { name: 'Diagnostic', level: 92, icon: '🔬' },
      { name: 'Thérapie', level: 88, icon: '💊' },
      { name: 'Réanimation', level: 90, icon: '💓' }
    ],
    certifications: [
      'Médecin Urgentiste',
      'ACLS - Advanced Cardiac Life Support',
      'ATLS - Advanced Trauma Life Support',
      'Certification en Réanimation'
    ],
    
    // Santé et biométrie
    health: {
      heartRate: 68,
      bloodPressure: '118/78',
      temperature: 36.4,
      oxygenLevel: 99,
      stress: 0.1,
      focus: 0.6,
      energy: 0.3,
      mood: 'calm',
      sleepHours: 8.2,
      steps: 4123,
      calories: 1780
    },
    
    // Équipement
    equipment: {
      device: 'Bracelet RSSI Pro',
      deviceModel: 'RSSI-2024-X2',
      serialNumber: 'RSSI-ML-004',
      firmware: 'v2.1.0',
      lastUpdate: new Date(Date.now() - 3600000)
    },
    
    // Historique
    history: {
      missions: 203,
      interventions: 156,
      awards: 7,
      rating: 4.9,
      joinDate: '2017-12-01'
    },
    
    // Préférences
    preferences: {
      language: 'fr',
      theme: 'dark',
      notifications: true,
      locationSharing: false,
      emergencyAlerts: true
    }
  },
  
  {
    id: '5',
    name: 'Jean-Pierre Rousseau',
    firstName: 'Jean-Pierre',
    lastName: 'Rousseau',
    role: 'Agent Logistique',
    department: 'Logistique',
    avatar: 'https://picsum.photos/seed/jeanpierre-rousseau/400/400.jpg',
    coverPhoto: 'https://picsum.photos/seed/jeanpierre-cover/800/300.jpg',
    status: 'online',
    rssi: -68.00,
    battery: 75,
    zone: 'Zone E - Hub Logistique',
    coordinates: { lat: 48.8738, lng: 2.2950 },
    lastSeen: new Date(),
    phone: '+33656789012',
    email: 'jeanpierre.rousseau@rssi.com',
    sos: false,
    
    // Informations personnelles
    age: 45,
    birthDate: '1979-09-30',
    address: '67 Avenue de la Grande Armée, 75017 Paris',
    emergencyContact: {
      name: 'Catherine Rousseau',
      phone: '+33643210987',
      relation: 'Épouse'
    },
    
    // Compétences et certifications
    skills: [
      { name: 'Logistique', level: 94, icon: '📦' },
      { name: 'Coordination', level: 90, icon: '🔄' },
      { name: 'Planification', level: 88, icon: '📅' },
      { name: 'Gestion', level: 86, icon: '📊' },
      { name: 'Transport', level: 92, icon: '🚚' }
    ],
    certifications: [
      'Logistics Manager',
      'Supply Chain Management',
      'Transportation Specialist',
      'Inventory Management'
    ],
    
    // Santé et biométrie
    health: {
      heartRate: 70,
      bloodPressure: '122/80',
      temperature: 36.6,
      oxygenLevel: 98,
      stress: 0.2,
      focus: 0.85,
      energy: 0.8,
      mood: 'organized',
      sleepHours: 7.0,
      steps: 10234,
      calories: 2450
    },
    
    // Équipement
    equipment: {
      device: 'Bracelet RSSI Pro',
      deviceModel: 'RSSI-2024-X1',
      serialNumber: 'RSSI-JR-005',
      firmware: 'v2.1.0',
      lastUpdate: new Date()
    },
    
    // Historique
    history: {
      missions: 178,
      interventions: 34,
      awards: 6,
      rating: 4.7,
      joinDate: '2018-08-15'
    },
    
    // Préférences
    preferences: {
      language: 'fr',
      theme: 'dark',
      notifications: true,
      locationSharing: true,
      emergencyAlerts: true
    }
  },
  
  {
    id: '6',
    name: 'Isabelle Moreau',
    firstName: 'Isabelle',
    lastName: 'Moreau',
    role: 'Communications',
    department: 'Communication',
    avatar: 'https://picsum.photos/seed/isabelle-moreau/400/400.jpg',
    coverPhoto: 'https://picsum.photos/seed/isabelle-cover/800/300.jpg',
    status: 'online',
    rssi: -58.00,
    battery: 88,
    zone: 'Zone F - Centre de Communication',
    coordinates: { lat: 48.8566, lng: 2.3522 },
    lastSeen: new Date(),
    phone: '+33667890123',
    email: 'isabelle.moreau@rssi.com',
    sos: false,
    
    // Informations personnelles
    age: 33,
    birthDate: '1991-02-14',
    address: '101 Rue de Rivoli, 75004 Paris',
    emergencyContact: {
      name: 'Luc Moreau',
      phone: '+33632109876',
      relation: 'Frère'
    },
    
    // Compétences et certifications
    skills: [
      { name: 'Communication', level: 96, icon: '📢' },
      { name: 'Radio', level: 94, icon: '📻' },
      { name: 'Traduction', level: 88, icon: '🌍' },
      { name: 'Rédaction', level: 90, icon: '✍️' },
      { name: 'Médias', level: 85, icon: '📺' }
    ],
    certifications: [
      'Communications Specialist',
      'Radio Operator License',
      'Translation Certificate',
      'Media Relations Professional'
    ],
    
    // Santé et biométrie
    health: {
      heartRate: 75,
      bloodPressure: '120/82',
      temperature: 36.7,
      oxygenLevel: 98,
      stress: 0.15,
      focus: 0.9,
      energy: 0.9,
      mood: 'connected',
      sleepHours: 7.8,
      steps: 7890,
      calories: 2120
    },
    
    // Équipement
    equipment: {
      device: 'Bracelet RSSI Pro',
      deviceModel: 'RSSI-2024-X2',
      serialNumber: 'RSSI-IM-006',
      firmware: 'v2.1.0',
      lastUpdate: new Date()
    },
    
    // Historique
    history: {
      missions: 134,
      interventions: 28,
      awards: 5,
      rating: 4.8,
      joinDate: '2019-11-20'
    },
    
    // Préférences
    preferences: {
      language: 'fr',
      theme: 'dark',
      notifications: true,
      locationSharing: true,
      emergencyAlerts: true
    }
  }
];

// Fonctions utilitaires
export const getMemberById = (id) => {
  return MEMBERS_PROFILES.find(member => member.id === id);
};

export const getMembersByStatus = (status) => {
  return MEMBERS_PROFILES.filter(member => member.status === status);
};

export const getMembersByZone = (zone) => {
  return MEMBERS_PROFILES.filter(member => member.zone === zone);
};

export const getMembersWithSOS = () => {
  return MEMBERS_PROFILES.filter(member => member.sos === true);
};

export const updateMemberStatus = (id, status) => {
  const member = getMemberById(id);
  if (member) {
    member.status = status;
    member.lastSeen = new Date();
  }
  return member;
};

export default MEMBERS_PROFILES;

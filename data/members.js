// Données complètes des membres avec profils et photos
export const MEMBERS_DATA = [
  {
    id: '1',
    name: 'Alexandre Dubois',
    email: 'alexandre.dubois@rssi.com',
    phone: '+33612345678',
    role: 'Chef de Groupe',
    department: 'Sécurité',
    avatar: 'https://picsum.photos/seed/alexandre/200/200.jpg',
    profilePhoto: 'https://picsum.photos/seed/alexandre-profile/400/400.jpg',
    bio: 'Chef de groupe expérimenté avec 10 ans dans la sécurité événementielle. Spécialiste en gestion de crise et coordination d\'équipes.',
    skills: ['Gestion de crise', 'Coordination', 'Sécurité événementielle', 'Communication'],
    certifications: ['Certifié RSSI Level 3', 'Secouriste professionnel', 'Gestionnaire de risques'],
    joinDate: '2020-03-15',
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      zone: 'Zone A - Poste de Commandement'
    },
    currentStatus: {
      online: true,
      rssi: -50,
      battery: 90,
      lastSeen: new Date(),
      device: 'iPhone 14 Pro',
      signalStrength: 'Excellent'
    },
    emergencyContact: {
      name: 'Marie Dubois',
      phone: '+33687654321',
      relation: 'Épouse'
    },
    healthInfo: {
      bloodType: 'O+',
      allergies: 'Aucune',
      medications: 'Aucun',
      emergencyNotes: 'Aucune condition médicale particulière'
    }
  },
  {
    id: '2',
    name: 'Sarah Martin',
    email: 'sarah.martin@rssi.com',
    phone: '+33623456789',
    role: 'Agent de Sécurité',
    department: 'Surveillance',
    avatar: 'https://picsum.photos/seed/sarah/200/200.jpg',
    profilePhoto: 'https://picsum.photos/seed/sarah-profile/400/400.jpg',
    bio: 'Agent de sécurité spécialisée en surveillance périmétrique. Expert en détection d\'anomalies et systèmes de monitoring.',
    skills: ['Surveillance', 'Détection d\'anomalies', 'Systems de monitoring', 'Analyse comportementale'],
    certifications: ['Certifié RSSI Level 2', 'Technicien en surveillance', 'Analyse comportementale'],
    joinDate: '2021-06-20',
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      zone: 'Zone B - Périmètre Nord'
    },
    currentStatus: {
      online: true,
      rssi: -72,
      battery: 60,
      lastSeen: new Date(),
      device: 'Samsung Galaxy S23',
      signalStrength: 'Bon'
    },
    emergencyContact: {
      name: 'Pierre Martin',
      phone: '+33698765432',
      relation: 'Frère'
    },
    healthInfo: {
      bloodType: 'A+',
      allergies: 'Arachides',
      medications: 'Antihistaminique (si nécessaire)',
      emergencyNotes: 'Allergie sévère aux arachides - EpiPen disponible'
    }
  },
  {
    id: '3',
    name: 'Thomas Bernard',
    email: 'thomas.bernard@rssi.com',
    phone: '+33634567890',
    role: 'Technicien RSSI',
    department: 'Technique',
    avatar: 'https://picsum.photos/seed/thomas/200/200.jpg',
    profilePhoto: 'https://picsum.photos/seed/thomas-profile/400/400.jpg',
    bio: 'Technicien spécialisé dans les systèmes RSSI et les équipements de communication. Responsable de la maintenance et du dépannage.',
    skills: ['Technique RSSI', 'Maintenance', 'Dépannage', 'Réseaux de communication'],
    certifications: ['Certifié RSSI Level 3', 'Technicien réseaux', 'Maintenance avancée'],
    joinDate: '2019-11-10',
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      zone: 'Zone C - Poste Technique'
    },
    currentStatus: {
      online: true,
      rssi: -85,
      battery: 30,
      lastSeen: new Date(),
      device: 'iPhone 13',
      signalStrength: 'Faible',
      sos: true
    },
    emergencyContact: {
      name: 'Sophie Bernard',
      phone: '+33609876543',
      relation: 'Compagne'
    },
    healthInfo: {
      bloodType: 'B+',
      allergies: 'Pollen',
      medications: 'Antihistaminique saisonnier',
      emergencyNotes: 'Asthme léger - Inhalateur disponible'
    }
  },
  {
    id: '4',
    name: 'Marie Laurent',
    email: 'marie.laurent@rssi.com',
    phone: '+33645678901',
    role: 'Médical d\'Urgence',
    department: 'Santé',
    avatar: 'https://picsum.photos/seed/marie/200/200.jpg',
    profilePhoto: 'https://picsum.photos/seed/marie-profile/400/400.jpg',
    bio: 'Infirmière d\'urgence certifiée, spécialisée en intervention rapide et premiers secours. Expérience en situations de crise.',
    skills: ['Soins d\'urgence', 'Premiers secours', 'Évaluation médicale', 'Gestion traumatologie'],
    certifications: ['Infirmière diplômée', 'Secouriste professionnel', 'ATLS', 'BLS'],
    joinDate: '2022-01-15',
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      zone: 'Zone D - Poste Médical'
    },
    currentStatus: {
      online: false,
      rssi: -95,
      battery: 15,
      lastSeen: new Date(Date.now() - 900000), // 15 minutes ago
      device: 'iPad Pro',
      signalStrength: 'Très faible'
    },
    emergencyContact: {
      name: 'Dr. Laurent',
      phone: '+33612345678',
      relation: 'Époux'
    },
    healthInfo: {
      bloodType: 'AB+',
      allergies: 'Aucune',
      medications: 'Vitamine D',
      emergencyNotes: 'Personnel médical - Équipement de protection toujours disponible'
    }
  },
  {
    id: '5',
    name: 'Jean-Pierre Rousseau',
    email: 'jeanpierre.rousseau@rssi.com',
    phone: '+33656789012',
    role: 'Agent Logistique',
    department: 'Logistique',
    avatar: 'https://picsum.photos/seed/jeanpierre/200/200.jpg',
    profilePhoto: 'https://picsum.photos/seed/jeanpierre-profile/400/400.jpg',
    bio: 'Responsable de la logistique et de la coordination des ressources. Gestion des stocks et approvisionnement des équipes.',
    skills: ['Logistique', 'Gestion des stocks', 'Coordination', 'Planification'],
    certifications: ['Certifié RSSI Level 2', 'Gestionnaire logistique', 'Planification opérationnelle'],
    joinDate: '2020-09-01',
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      zone: 'Zone E - Centre Logistique'
    },
    currentStatus: {
      online: true,
      rssi: -68,
      battery: 75,
      lastSeen: new Date(),
      device: 'OnePlus 11',
      signalStrength: 'Excellent'
    },
    emergencyContact: {
      name: 'Claire Rousseau',
      phone: '+33623456789',
      relation: 'Sœur'
    },
    healthInfo: {
      bloodType: 'O-',
      allergies: 'Aucune',
      medications: 'Aucun',
      emergencyNotes: 'Donneur universel - Carte de donneur sur lui'
    }
  },
  {
    id: '6',
    name: 'Isabelle Moreau',
    email: 'isabelle.moreau@rssi.com',
    phone: '+33667890123',
    role: 'Communications',
    department: 'Communication',
    avatar: 'https://picsum.photos/seed/isabelle/200/200.jpg',
    profilePhoto: 'https://picsum.photos/seed/isabelle-profile/400/400.jpg',
    bio: 'Responsable des communications internes et externes. Gestion des alertes et coordination avec les services externes.',
    skills: ['Communication', 'Gestion des alertes', 'Coordination', 'Relations publiques'],
    certifications: ['Certifié RSSI Level 2', 'Communication de crise', 'Relations médias'],
    joinDate: '2021-03-25',
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      zone: 'Zone F - Centre de Communications'
    },
    currentStatus: {
      online: true,
      rssi: -58,
      battery: 88,
      lastSeen: new Date(),
      device: 'Google Pixel 7',
      signalStrength: 'Excellent'
    },
    emergencyContact: {
      name: 'Marc Moreau',
      phone: '+33634567890',
      relation: 'Mari'
    },
    healthInfo: {
      bloodType: 'A+',
      allergies: 'Aucune',
      medications: 'Aucun',
      emergencyNotes: 'Aucune condition médicale particulière'
    }
  }
];

// Fonctions utilitaires pour les données des membres
export const getMemberById = (id) => {
  return MEMBERS_DATA.find(member => member.id === id);
};

export const getMembersByRole = (role) => {
  return MEMBERS_DATA.filter(member => member.role.includes(role));
};

export const getOnlineMembers = () => {
  return MEMBERS_DATA.filter(member => member.currentStatus.online);
};

export const getMembersInZone = (zone) => {
  return MEMBERS_DATA.filter(member => member.location.zone.includes(zone));
};

export const getMembersWithLowBattery = (threshold = 30) => {
  return MEMBERS_DATA.filter(member => member.currentStatus.battery < threshold);
};

export const getMembersWithWeakSignal = (threshold = -80) => {
  return MEMBERS_DATA.filter(member => member.currentStatus.rssi < threshold);
};

export const getMembersWithSOS = () => {
  return MEMBERS_DATA.filter(member => member.currentStatus.sos);
};

export const updateMemberStatus = (id, statusUpdate) => {
  const member = getMemberById(id);
  if (member) {
    Object.assign(member.currentStatus, statusUpdate);
    member.currentStatus.lastSeen = new Date();
  }
  return member;
};

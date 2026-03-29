const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const { initializeDatabase } = require('./database/database');
const { authenticateToken } = require('./middleware/auth');
const memberRoutes = require('./routes/members');
const alertRoutes = require('./routes/alerts');

// Initialisation
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes API
app.use('/api/members', authenticateToken, memberRoutes);
app.use('/api/alerts', authenticateToken, alertRoutes);

// Route de santé
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Gestion des connexions WebSocket
const connectedClients = new Map();

io.on('connection', (socket) => {
  console.log(`Client connecté: ${socket.id}`);
  
  // Stocker le client
  connectedClients.set(socket.id, {
    socket,
    connectedAt: new Date(),
    lastPing: new Date()
  });

  // Envoyer les membres actifs au nouveau client
  socket.emit('initial-data', {
    members: getActiveMembers(),
    alerts: getActiveAlerts()
  });

  // Gérer les mises à jour de position RSSI
  socket.on('rssi-update', (data) => {
    try {
      const { memberId, rssi, battery, location, timestamp } = data;
      
      // Valider les données
      if (!memberId || rssi === undefined || battery === undefined) {
        socket.emit('error', { message: 'Données RSSI invalides' });
        return;
      }

      // Mettre à jour en base de données
      updateMemberRSSI(memberId, {
        rssi,
        battery,
        location,
        timestamp: timestamp || new Date()
      });

      // Calculer l'environnement et la distance
      const environment = calculateEnvironment(rssi);
      const distance = calculateDistance(rssi);
      const isOutOfPerimeter = rssi <= -95;
      const isCritical = rssi <= -95 || battery < 20;

      // Diffuser à tous les clients connectés
      const updateData = {
        memberId,
        rssi,
        battery,
        environment,
        distance,
        isOutOfPerimeter,
        isCritical,
        location,
        timestamp: new Date()
      };

      io.emit('member-update', updateData);

      // Vérifier les alertes
      checkAndTriggerAlerts(memberId, updateData, io);

    } catch (error) {
      console.error('Erreur lors de la mise à jour RSSI:', error);
      socket.emit('error', { message: 'Erreur serveur' });
    }
  });

  // Gérer les alertes SOS
  socket.on('sos-alert', (data) => {
    try {
      const { memberId, location, timestamp } = data;
      
      if (!memberId) {
        socket.emit('error', { message: 'ID membre requis pour SOS' });
        return;
      }

      const sosData = {
        id: generateId(),
        memberId,
        type: 'SOS',
        location,
        timestamp: timestamp || new Date(),
        resolved: false
      };

      // Sauvegarder l'alerte
      saveAlert(sosData);

      // Diffuser l'alerte à tous les clients
      io.emit('sos-alert', sosData);

      console.log(`🚨 ALERTE SOS: Membre ${memberId}`);

    } catch (error) {
      console.error('Erreur lors de l\'alerte SOS:', error);
      socket.emit('error', { message: 'Erreur lors de l\'alerte SOS' });
    }
  });

  // Gérer le ping pour maintenir la connexion
  socket.on('ping', () => {
    const client = connectedClients.get(socket.id);
    if (client) {
      client.lastPing = new Date();
    }
    socket.emit('pong');
  });

  // Gestion de déconnexion
  socket.on('disconnect', () => {
    console.log(`Client déconnecté: ${socket.id}`);
    connectedClients.delete(socket.id);
  });
});

// Fonctions utilitaires
function calculateEnvironment(rssi) {
  if (rssi >= -55) {
    return {
      type: 'Espace ouvert',
      range: '100-150m',
      color: '#10b981',
      icon: '☀️'
    };
  } else if (rssi >= -75) {
    return {
      type: 'Semi-obstrué',
      range: '50-100m',
      color: '#f59e0b',
      icon: '⛅'
    };
  } else if (rssi >= -95) {
    return {
      type: 'Fortement obstrué',
      range: '20-50m',
      color: '#ef4444',
      icon: '🏢'
    };
  } else {
    return {
      type: 'Hors portée',
      range: '>150m',
      color: '#991b1b',
      icon: '❌'
    };
  }
}

function calculateDistance(rssi) {
  const txPower = -59; // RSSI à 1 mètre
  const n = 2; // facteur environnement
  
  return Math.pow(10, (txPower - rssi) / (10 * n)).toFixed(2);
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Nettoyage des connexions inactives
setInterval(() => {
  const now = new Date();
  connectedClients.forEach((client, socketId) => {
    if (now - client.lastPing > 30000) { // 30 secondes
      console.log(`Déconnexion du client inactif: ${socketId}`);
      client.socket.disconnect();
      connectedClients.delete(socketId);
    }
  });
}, 10000);

// Initialisation de la base de données
initializeDatabase()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`🚀 Serveur RSSI Surveillance démarré sur le port ${PORT}`);
      console.log(`📊 Dashboard: http://localhost:${PORT}`);
      console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
    process.exit(1);
  });

module.exports = { app, io };

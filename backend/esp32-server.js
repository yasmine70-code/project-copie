const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.ESP32_PORT || 3001;
const UPLOAD_DIR = path.join(__dirname, 'uploads', 'esp32-cam');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const app = express();
const server = http.createServer(app);

// ✅ FIX 1 : pingInterval et pingTimeout ajoutés
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  },
  transports: ['websocket', 'polling'],
  pingInterval: 10000,
  pingTimeout: 30000,
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(UPLOAD_DIR));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const memberDir = path.join(UPLOAD_DIR, req.body.memberId || 'unknown');
    if (!fs.existsSync(memberDir)) {
      fs.mkdirSync(memberDir, { recursive: true });
    }
    cb(null, memberDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `capture_${timestamp}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées'));
    }
  }
});

const connectedDevices = new Map();
const deviceData = new Map();

// ✅ FIX 2 : fonctions utilitaires RSSI
function rssiToDistance(rssi) {
  if (!rssi) return null;
  const txPower = -40;
  const n = 2.5;
  return parseFloat(Math.pow(10, (txPower - rssi) / (10 * n)).toFixed(1));
}

function rssiToZone(rssi) {
  if (!rssi) return 'inconnu';
  if (rssi >= -60) return 'proche';
  if (rssi >= -75) return 'moyen';
  return 'loin';
}

function broadcastMembersUpdate() {
  const now = new Date();
  const members = Array.from(connectedDevices.values()).map(device => ({
    id: device.deviceId,
    name: device.name || device.memberId,
    rssi: device.rssi,
    battery: device.battery,
    distance: device.distance,
    zone: device.zone,
    connected: (now - device.lastSeen) < 30000,
    lastSeen: device.lastSeen,
    sos: device.sos || false
  }));
  io.emit('members-update', members);
}

// Routes
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'ESP32 CAM Server',
    timestamp: new Date().toISOString(),
    connectedDevices: connectedDevices.size,
    uptime: process.uptime()
  });
});

// ✅ FIX 3 : route /api/members pour ton frontend React Native
app.get('/api/members', (req, res) => {
  const now = new Date();
  const members = Array.from(connectedDevices.values()).map(device => ({
    id: device.deviceId,
    name: device.name || device.memberId,
    rssi: device.rssi,
    battery: device.battery,
    distance: device.distance,
    zone: device.zone,
    connected: (now - device.lastSeen) < 30000,
    lastSeen: device.lastSeen,
    sos: device.sos || false
  }));
  res.json(members);
});

app.get('/devices', (req, res) => {
  const devices = Array.from(connectedDevices.entries()).map(([socketId, device]) => ({
    socketId,
    deviceId: device.deviceId,
    memberId: device.memberId,
    name: device.name,
    rssi: device.rssi,
    battery: device.battery,
    distance: device.distance,
    zone: device.zone,
    connectedAt: device.connectedAt,
    lastSeen: device.lastSeen,
    status: device.status
  }));
  res.json({ devices });
});

app.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    const { memberId, deviceId, timestamp, rssi, battery } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: 'Aucune image fournie' });
    }
    const imageData = {
      memberId: memberId || 'unknown',
      deviceId: deviceId || 'unknown',
      imagePath: `/uploads/${memberId || 'unknown'}/${req.file.filename}`,
      timestamp: timestamp || new Date().toISOString(),
      rssi: rssi ? parseFloat(rssi) : null,
      battery: battery ? parseInt(battery) : null,
      filename: req.file.filename,
      size: req.file.size
    };
    io.emit('new-image', imageData);
    console.log(`📸 Image reçue: ${req.file.filename} de ${deviceId}`);
    res.json({ success: true, imagePath: imageData.imagePath, id: uuidv4() });
  } catch (error) {
    console.error('Erreur image:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/sensor-data', async (req, res) => {
  try {
    const { deviceId, memberId, rssi, battery, timestamp } = req.body;
    const sensorData = {
      deviceId,
      memberId: memberId || 'unknown',
      rssi: rssi ? parseFloat(rssi) : null,
      battery: battery ? parseInt(battery) : null,
      distance: rssiToDistance(rssi),
      zone: rssiToZone(rssi),
      timestamp: timestamp || new Date().toISOString()
    };
    deviceData.set(deviceId, sensorData);
    io.emit('sensor-update', sensorData);
    console.log(`📡 sensor-data REST de ${deviceId}: RSSI=${rssi}`);
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur sensor-data REST:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// WebSocket
io.on('connection', (socket) => {
  console.log(`🔌 Connexion établie: ${socket.id}`);

  socket.on('register-device', (data) => {
    const { deviceId, memberId, deviceType, name } = data;
    connectedDevices.set(socket.id, {
      deviceId,
      memberId: memberId || 'unknown',
      name: name || memberId || 'unknown',
      deviceType: deviceType || 'ESP32_CAM',
      rssi: null,
      battery: null,
      distance: null,
      zone: 'inconnu',
      sos: false,
      connectedAt: new Date(),
      lastSeen: new Date(),
      status: 'active'
    });
    console.log(`📱 Dispositif enregistré: ${deviceId} (${deviceType})`);
    socket.emit('device-registered', {
      success: true,
      deviceId,
      serverTime: new Date().toISOString()
    });
    socket.broadcast.emit('device-connected', { deviceId, deviceType });
    broadcastMembersUpdate();
  });

  socket.on('sensor-data', async (data) => {
    try {
      const device = connectedDevices.get(socket.id);
      if (!device) {
        socket.emit('error', { message: 'Dispositif non enregistré' });
        return;
      }
      // ✅ Mise à jour lastSeen + calcul distance/zone
      device.lastSeen = new Date();
      device.rssi = data.rssi;
      device.battery = data.battery;
      device.name = data.name || device.name;
      device.distance = rssiToDistance(data.rssi);
      device.zone = rssiToZone(data.rssi);

      const enrichedData = {
        ...data,
        deviceId: device.deviceId,
        memberId: device.memberId,
        distance: device.distance,
        zone: device.zone,
        timestamp: data.timestamp || new Date().toISOString()
      };

      socket.broadcast.emit('real-time-data', enrichedData);
      io.emit('sensor-update', enrichedData);

      console.log(`📡 ${device.deviceId}: RSSI=${data.rssi} dBm | ~${device.distance}m | ${device.zone} | Battery=${data.battery}%`);
      broadcastMembersUpdate();

    } catch (error) {
      console.error('Erreur sensor-data:', error);
    }
  });

  socket.on('sos', (data) => {
    const device = connectedDevices.get(socket.id);
    if (device) {
      device.sos = true;
      console.log(`🚨 SOS de ${device.deviceId} !`);
      io.emit('sos-alert', {
        deviceId: device.deviceId,
        memberId: device.memberId,
        name: device.name,
        timestamp: new Date().toISOString()
      });
      broadcastMembersUpdate();
    }
  });

  socket.on('video-frame', (data) => {
    const device = connectedDevices.get(socket.id);
    if (!device) return;
    socket.broadcast.emit('video-stream', {
      ...data,
      deviceId: device.deviceId,
      memberId: device.memberId,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('ping', () => {
    const device = connectedDevices.get(socket.id);
    if (device) device.lastSeen = new Date();
    socket.emit('pong', { timestamp: new Date().toISOString() });
  });

  socket.on('disconnect', () => {
    const device = connectedDevices.get(socket.id);
    if (device) {
      console.log(`📱 Dispositif déconnecté: ${device.deviceId}`);
      socket.broadcast.emit('device-disconnected', { deviceId: device.deviceId });
      connectedDevices.delete(socket.id);
      broadcastMembersUpdate();
    }
  });
});

// ✅ FIX 4 : timeout 5 minutes au lieu de 1 minute
setInterval(() => {
  const now = new Date();
  connectedDevices.forEach((device, socketId) => {
    if (now - device.lastSeen > 300000) {
      console.log(`🗑️ Nettoyage dispositif inactif: ${device.deviceId}`);
      io.sockets.sockets.get(socketId)?.disconnect();
      connectedDevices.delete(socketId);
    }
  });
}, 30000);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur ESP32 CAM démarré sur le port ${PORT}`);
  console.log(`📸 Upload endpoint: http://localhost:${PORT}/upload-image`);
  console.log(`📡 Sensor endpoint: http://localhost:${PORT}/sensor-data`);
  console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
  console.log(`📊 Members API: http://localhost:${PORT}/api/members`);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Erreur non capturée:', error);
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ Rejet non géré:', reason);
});

module.exports = { app, io };
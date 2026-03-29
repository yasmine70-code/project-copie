# Améliorations Temps Réel & WebSocket

## 🚀 Optimisations WebSocket

### 1. **Connection Management**
```javascript
// Gestion avancée des connexions
class ConnectionManager {
  constructor() {
    this.connections = new Map();
    this.rooms = new Map();
    this.heartbeatInterval = null;
  }

  // Heartbeat pour maintenir les connexions
  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.connections.forEach((socket, id) => {
        if (socket.connected) {
          socket.emit('ping');
          socket.lastPing = Date.now();
        } else {
          this.disconnect(id);
        }
      });
    }, 30000);
  }

  // Gestion des rooms pour le multicast
  joinRoom(socket, room) {
    if (!this.rooms.has(room)) {
      this.rooms.set(room, new Set());
    }
    this.rooms.get(room).add(socket.id);
    socket.join(room);
  }

  leaveRoom(socket, room) {
    if (this.rooms.has(room)) {
      this.rooms.get(room).delete(socket.id);
      if (this.rooms.get(room).size === 0) {
        this.rooms.delete(room);
      }
    }
    socket.leave(room);
  }

  // Broadcast optimisé
  broadcastToRoom(room, event, data) {
    if (this.rooms.has(room)) {
      this.io.to(room).emit(event, data);
    }
  }
}
```

### 2. **Event Types Structurés**
```javascript
// Types d'événements standardisés
const EVENT_TYPES = {
  // Membres
  MEMBER_CONNECTED: 'member:connected',
  MEMBER_DISCONNECTED: 'member:disconnected',
  MEMBER_LOCATION_UPDATE: 'member:location',
  MEMBER_BATTERY_UPDATE: 'member:battery',
  MEMBER_RSSI_UPDATE: 'member:rssi',
  
  // Alertes
  ALERT_CREATED: 'alert:created',
  ALERT_ACKNOWLEDGED: 'alert:acknowledged',
  ALERT_RESOLVED: 'alert:resolved',
  
  // Système
  SYSTEM_STATUS: 'system:status',
  SYSTEM_MAINTENANCE: 'system:maintenance',
  
  // Analytics
  ANALYTICS_UPDATE: 'analytics:update',
  PERFORMANCE_METRICS: 'performance:metrics'
};

// Validation des événements
function validateEvent(eventType, data) {
  const schemas = {
    [EVENT_TYPES.MEMBER_RSSI_UPDATE]: {
      required: ['memberId', 'rssi', 'timestamp'],
      properties: {
        memberId: { type: 'string' },
        rssi: { type: 'number', min: -100, max: 0 },
        timestamp: { type: 'number' }
      }
    },
    // ... autres schémas
  };
  
  return validate(data, schemas[eventType]);
}
```

### 3. **Data Compression**
```javascript
// Compression des données WebSocket
const zlib = require('zlib');

function compressData(data) {
  const json = JSON.stringify(data);
  return zlib.gzipSync(json).toString('base64');
}

function decompressData(compressed) {
  const buffer = Buffer.from(compressed, 'base64');
  const decompressed = zlib.gunzipSync(buffer);
  return JSON.parse(decompressed.toString());
}

// Utilisation dans les émissions
socket.emit(EVENT_TYPES.MEMBER_RSSI_UPDATE, compressData({
  memberId: '123',
  rssi: -50,
  timestamp: Date.now()
}));
```

## 📱 Client WebSocket Optimisé

### React Hook pour WebSocket
```javascript
// hooks/useWebSocket.js
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

export const useWebSocket = (url, options = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(url, {
      transports: ['websocket'],
      upgrade: false,
      rememberUpgrade: false,
      ...options
    });

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      setError(null);
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
    });

    socketRef.current.on('error', (err) => {
      setError(err);
    });

    socketRef.current.on('message', (data) => {
      setLastMessage(data);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [url]);

  const emit = (event, data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  };

  const subscribe = (event, callback) => {
    socketRef.current?.on(event, callback);
    return () => socketRef.current?.off(event, callback);
  };

  return {
    isConnected,
    lastMessage,
    error,
    emit,
    subscribe
  };
};
```

## 🔄 Sync Strategy

### 1. **Conflict Resolution**
```javascript
// Gestion des conflits de synchronisation
class SyncManager {
  constructor() {
    this.pendingUpdates = new Map();
    this.conflictResolver = new ConflictResolver();
  }

  async syncUpdate(data) {
    const localVersion = this.getLocalVersion(data.id);
    const serverVersion = await this.getServerVersion(data.id);

    if (localVersion > serverVersion) {
      // Le client est plus récent
      await this.pushToServer(data);
    } else if (serverVersion > localVersion) {
      // Le serveur est plus récent
      const serverData = await this.pullFromServer(data.id);
      this.updateLocalData(serverData);
    } else {
      // Conflit - résolution nécessaire
      const resolved = await this.conflictResolver.resolve(data, serverData);
      await this.applyResolution(resolved);
    }
  }
}
```

### 2. **Offline Support**
```javascript
// Support hors ligne avec queue
class OfflineQueue {
  constructor() {
    this.queue = [];
    this.isOnline = navigator.onLine;
  }

  add(action) {
    this.queue.push({
      ...action,
      timestamp: Date.now(),
      id: this.generateId()
    });
    
    if (this.isOnline) {
      this.processQueue();
    }
  }

  async processQueue() {
    while (this.queue.length > 0 && this.isOnline) {
      const action = this.queue.shift();
      try {
        await this.executeAction(action);
      } catch (error) {
        // Remettre en queue en cas d'échec
        this.queue.unshift(action);
        break;
      }
    }
  }
}
```

## 📊 Performance Monitoring

### WebSocket Metrics
```javascript
// Monitoring des performances WebSocket
class WebSocketMetrics {
  constructor() {
    this.metrics = {
      connections: 0,
      messagesPerSecond: 0,
      latency: [],
      errors: 0,
      reconnections: 0
    };
  }

  recordConnection() {
    this.metrics.connections++;
  }

  recordMessage(size) {
    this.metrics.messagesPerSecond++;
    this.metrics.bandwidth = (this.metrics.bandwidth || 0) + size;
  }

  recordLatency(latency) {
    this.metrics.latency.push(latency);
    if (this.metrics.latency.length > 100) {
      this.metrics.latency.shift();
    }
  }

  getAverageLatency() {
    return this.metrics.latency.reduce((a, b) => a + b, 0) / this.metrics.latency.length;
  }
}
```

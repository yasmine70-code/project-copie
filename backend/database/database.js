const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'surveillance.db');

let db;

// Initialisation de la base de données
function initializeDatabase() {
  return new Promise((resolve, reject) => {
    // Créer le répertoire data s'il n'existe pas
    const fs = require('fs');
    const dataDir = path.dirname(DB_PATH);
    
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Erreur de connexion à la base de données:', err);
        reject(err);
      } else {
        console.log('✅ Connecté à la base de données SQLite');
        createTables()
          .then(() => resolve())
          .catch(reject);
      }
    });
  });
}

// Création des tables
function createTables() {
  return new Promise((resolve, reject) => {
    const queries = [
      // Table des membres
      `CREATE TABLE IF NOT EXISTS members (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        rssi INTEGER,
        battery INTEGER,
        location TEXT,
        last_seen DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Table des alertes
      `CREATE TABLE IF NOT EXISTS alerts (
        id TEXT PRIMARY KEY,
        member_id TEXT NOT NULL,
        type TEXT NOT NULL,
        message TEXT,
        location TEXT,
        resolved BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        resolved_at DATETIME,
        FOREIGN KEY (member_id) REFERENCES members (id)
      )`,
      
      // Table des historiques de positions
      `CREATE TABLE IF NOT EXISTS position_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        member_id TEXT NOT NULL,
        rssi INTEGER NOT NULL,
        battery INTEGER NOT NULL,
        location TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (member_id) REFERENCES members (id)
      )`
    ];

    let completed = 0;
    const total = queries.length;

    queries.forEach((query, index) => {
      db.run(query, (err) => {
        if (err) {
          console.error(`Erreur création table ${index}:`, err);
          reject(err);
        } else {
          completed++;
          if (completed === total) {
            console.log('✅ Tables créées avec succès');
            resolve();
          }
        }
      });
    });
  });
}

// Fonctions pour les membres
function getActiveMembers() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT m.*, 
             MAX(ph.timestamp) as last_position_time
      FROM members m
      LEFT JOIN position_history ph ON m.id = ph.member_id
      WHERE m.last_seen > datetime('now', '-5 minutes')
      GROUP BY m.id
      ORDER BY m.name
    `;
    
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function updateMemberRSSI(memberId, data) {
  return new Promise((resolve, reject) => {
    const { rssi, battery, location, timestamp } = data;
    
    // Mettre à jour le membre
    const updateQuery = `
      UPDATE members 
      SET rssi = ?, battery = ?, location = ?, last_seen = ?
      WHERE id = ?
    `;
    
    db.run(updateQuery, [rssi, battery, location, timestamp, memberId], (err) => {
      if (err) {
        reject(err);
      } else {
        // Ajouter à l'historique
        const historyQuery = `
          INSERT INTO position_history (member_id, rssi, battery, location, timestamp)
          VALUES (?, ?, ?, ?, ?)
        `;
        
        db.run(historyQuery, [memberId, rssi, battery, location, timestamp], (historyErr) => {
          if (historyErr) {
            reject(historyErr);
          } else {
            resolve();
          }
        });
      }
    });
  });
}

function addMember(memberData) {
  return new Promise((resolve, reject) => {
    const { id, name } = memberData;
    const query = `
      INSERT INTO members (id, name, created_at)
      VALUES (?, ?, ?)
    `;
    
    db.run(query, [id, name, new Date()], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id, name, created_at: new Date() });
      }
    });
  });
}

// Fonctions pour les alertes
function getActiveAlerts() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT a.*, m.name as member_name
      FROM alerts a
      JOIN members m ON a.member_id = m.id
      WHERE a.resolved = FALSE
      ORDER BY a.created_at DESC
    `;
    
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function saveAlert(alertData) {
  return new Promise((resolve, reject) => {
    const { id, memberId, type, message, location, timestamp } = alertData;
    const query = `
      INSERT INTO alerts (id, member_id, type, message, location, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    db.run(query, [id, memberId, type, message, location, timestamp], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id, ...alertData });
      }
    });
  });
}

function resolveAlert(alertId) {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE alerts 
      SET resolved = TRUE, resolved_at = ?
      WHERE id = ?
    `;
    
    db.run(query, [new Date(), alertId], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: alertId, resolved: true });
      }
    });
  });
}

// Fonctions utilitaires
function getPositionHistory(memberId, limit = 100) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM position_history
      WHERE member_id = ?
      ORDER BY timestamp DESC
      LIMIT ?
    `;
    
    db.all(query, [memberId, limit], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Export des fonctions
module.exports = {
  initializeDatabase,
  getActiveMembers,
  updateMemberRSSI,
  addMember,
  getActiveAlerts,
  saveAlert,
  resolveAlert,
  getPositionHistory,
  db: () => db
};

const express = require('express');
const { getActiveAlerts, saveAlert, resolveAlert } = require('../database/database');

const router = express.Router();

// GET - Récupérer toutes les alertes actives
router.get('/', async (req, res) => {
  try {
    const { resolved = 'false' } = req.query;
    
    const query = resolved === 'true' 
      ? `SELECT a.*, m.name as member_name
         FROM alerts a
         JOIN members m ON a.member_id = m.id
         ORDER BY a.created_at DESC`
      : `SELECT a.*, m.name as member_name
         FROM alerts a
         JOIN members m ON a.member_id = m.id
         WHERE a.resolved = FALSE
         ORDER BY a.created_at DESC`;
    
    const { db } = require('../database/database');
    
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error('Erreur récupération alertes:', err);
        res.status(500).json({
          success: false,
          message: 'Erreur serveur'
        });
      } else {
        res.json({
          success: true,
          data: rows,
          count: rows.length
        });
      }
    });
  } catch (error) {
    console.error('Erreur récupération alertes:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// GET - Récupérer une alerte spécifique
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT a.*, m.name as member_name
      FROM alerts a
      JOIN members m ON a.member_id = m.id
      WHERE a.id = ?
    `;
    
    const { db } = require('../database/database');
    
    db.get(query, [id], (err, row) => {
      if (err) {
        console.error('Erreur récupération alerte:', err);
        res.status(500).json({
          success: false,
          message: 'Erreur serveur'
        });
      } else if (!row) {
        res.status(404).json({
          success: false,
          message: 'Alerte non trouvée'
        });
      } else {
        res.json({
          success: true,
          data: row
        });
      }
    });
  } catch (error) {
    console.error('Erreur récupération alerte:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// POST - Créer une nouvelle alerte
router.post('/', async (req, res) => {
  try {
    const { memberId, type, message, location } = req.body;
    
    // Validation
    if (!memberId || !type) {
      return res.status(400).json({
        success: false,
        message: 'memberId et type sont requis'
      });
    }
    
    const alertData = {
      id: generateId(),
      memberId,
      type: type.toUpperCase(),
      message: message || `Alerte ${type} pour le membre ${memberId}`,
      location: location || null,
      timestamp: new Date()
    };
    
    const alert = await saveAlert(alertData);
    
    res.status(201).json({
      success: true,
      data: alert,
      message: 'Alerte créée avec succès'
    });
  } catch (error) {
    console.error('Erreur création alerte:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// POST - Créer une alerte SOS
router.post('/sos', async (req, res) => {
  try {
    const { memberId, location } = req.body;
    
    if (!memberId) {
      return res.status(400).json({
        success: false,
        message: 'memberId est requis pour une alerte SOS'
      });
    }
    
    const sosData = {
      id: generateId(),
      memberId,
      type: 'SOS',
      message: `🚨 ALERTE SOS - Membre ${memberId} a besoin d'aide!`,
      location: location || null,
      timestamp: new Date()
    };
    
    const alert = await saveAlert(sosData);
    
    res.status(201).json({
      success: true,
      data: alert,
      message: 'Alerte SOS créée avec succès'
    });
  } catch (error) {
    console.error('Erreur création alerte SOS:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// PUT - Résoudre une alerte
router.put('/:id/resolve', async (req, res) => {
  try {
    const { id } = req.params;
    const { resolution } = req.body;
    
    const resolved = await resolveAlert(id);
    
    if (!resolved) {
      return res.status(404).json({
        success: false,
        message: 'Alerte non trouvée'
      });
    }
    
    res.json({
      success: true,
      data: resolved,
      message: 'Alerte résolue avec succès'
    });
  } catch (error) {
    console.error('Erreur résolution alerte:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// GET - Statistiques des alertes
router.get('/stats', async (req, res) => {
  try {
    const { period = '24h' } = req.query;
    
    let timeFilter = '';
    switch (period) {
      case '1h':
        timeFilter = "AND created_at > datetime('now', '-1 hour')";
        break;
      case '24h':
        timeFilter = "AND created_at > datetime('now', '-1 day')";
        break;
      case '7d':
        timeFilter = "AND created_at > datetime('now', '-7 days')";
        break;
      case '30d':
        timeFilter = "AND created_at > datetime('now', '-30 days')";
        break;
    }
    
    const queries = {
      total: `SELECT COUNT(*) as count FROM alerts WHERE 1=1 ${timeFilter}`,
      sos: `SELECT COUNT(*) as count FROM alerts WHERE type='SOS' ${timeFilter}`,
      perimeter: `SELECT COUNT(*) as count FROM alerts WHERE type='PERIMETER' ${timeFilter}`,
      resolved: `SELECT COUNT(*) as count FROM alerts WHERE resolved=TRUE ${timeFilter}`,
      pending: `SELECT COUNT(*) as count FROM alerts WHERE resolved=FALSE ${timeFilter}`
    };
    
    const { db } = require('../database/database');
    const stats = {};
    
    for (const [key, query] of Object.entries(queries)) {
      await new Promise((resolve, reject) => {
        db.get(query, [], (err, row) => {
          if (err) {
            reject(err);
          } else {
            stats[key] = row.count;
            resolve();
          }
        });
      });
    }
    
    res.json({
      success: true,
      data: {
        ...stats,
        period,
        generated_at: new Date()
      }
    });
  } catch (error) {
    console.error('Erreur statistiques alertes:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// Fonction utilitaire
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

module.exports = router;

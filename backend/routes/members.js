const express = require('express');
const { db } = require('../database/database');
const { generateId } = require('../utils/helpers');

const router = express.Router();

// GET - Récupérer tous les membres actifs
router.get('/', async (req, res) => {
  try {
    const { getActiveMembers } = require('../database/database');
    const members = await getActiveMembers();
    
    res.json({
      success: true,
      data: members,
      count: members.length
    });
  } catch (error) {
    console.error('Erreur récupération membres:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// GET - Récupérer un membre spécifique
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT m.*, 
             (SELECT rssi FROM position_history 
              WHERE member_id = m.id 
              ORDER BY timestamp DESC LIMIT 1) as current_rssi,
             (SELECT battery FROM position_history 
              WHERE member_id = m.id 
              ORDER BY timestamp DESC LIMIT 1) as current_battery
      FROM members m
      WHERE m.id = ?
    `;
    
    db.get(query, [id], (err, row) => {
      if (err) {
        console.error('Erreur récupération membre:', err);
        res.status(500).json({
          success: false,
          message: 'Erreur serveur'
        });
      } else if (!row) {
        res.status(404).json({
          success: false,
          message: 'Membre non trouvé'
        });
      } else {
        res.json({
          success: true,
          data: row
        });
      }
    });
  } catch (error) {
    console.error('Erreur récupération membre:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// POST - Ajouter un nouveau membre
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Le nom du membre est requis'
      });
    }
    
    const { addMember } = require('../database/database');
    const memberId = generateId();
    
    const member = await addMember({
      id: memberId,
      name: name.trim()
    });
    
    res.status(201).json({
      success: true,
      data: member,
      message: 'Membre ajouté avec succès'
    });
  } catch (error) {
    console.error('Erreur ajout membre:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// PUT - Mettre à jour un membre
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rssi, battery, location } = req.body;
    
    // Validation
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Le nom du membre est requis'
      });
    }
    
    const { updateMemberRSSI } = require('../database/database');
    
    if (rssi !== undefined || battery !== undefined) {
      await updateMemberRSSI(id, {
        rssi: rssi || null,
        battery: battery || null,
        location: location || null,
        timestamp: new Date()
      });
    }
    
    // Mettre à jour le nom si différent
    if (name.trim()) {
      const updateNameQuery = `
        UPDATE members 
        SET name = ?
        WHERE id = ?
      `;
      
      db.run(updateNameQuery, [name.trim(), id]);
    }
    
    res.json({
      success: true,
      message: 'Membre mis à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur mise à jour membre:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// DELETE - Supprimer un membre
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      DELETE FROM members 
      WHERE id = ?
    `;
    
    db.run(query, [id], function(err) {
      if (err) {
        console.error('Erreur suppression membre:', err);
        res.status(500).json({
          success: false,
          message: 'Erreur serveur'
        });
      } else if (this.changes === 0) {
        res.status(404).json({
          success: false,
          message: 'Membre non trouvé'
        });
      } else {
        res.json({
          success: true,
          message: 'Membre supprimé avec succès'
        });
      }
    });
  } catch (error) {
    console.error('Erreur suppression membre:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// GET - Historique de position d'un membre
router.get('/:id/history', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 100 } = req.query;
    
    const { getPositionHistory } = require('../database/database');
    const history = await getPositionHistory(id, parseInt(limit));
    
    res.json({
      success: true,
      data: history,
      count: history.length
    });
  } catch (error) {
    console.error('Erreur historique position:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

module.exports = router;

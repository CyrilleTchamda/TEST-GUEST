// Import du controller
const commandeController = require('../controllers/commande.controller')

// Router Express
const router = require('express').Router()


// ─── Routes des commandes ───────────────────────────────────────────

// Tableau de bord (doit être AVANT /:id pour éviter le conflit de route)
router.get('/dashboard', commandeController.getDashboard)

// Récupérer toutes les commandes
router.get('/', commandeController.getAllCommandes)

// Récupérer une commande par ID
router.get('/:id', commandeController.getOneCommande)

// Créer une nouvelle commande
router.post('/', commandeController.createCommande)

// Mettre à jour le statut uniquement
router.put('/:id/statut', commandeController.updateStatut)

// Mettre à jour une commande complète
router.put('/:id', commandeController.updateCommande)

// Supprimer une commande
router.delete('/:id', commandeController.deleteCommande)


module.exports = router

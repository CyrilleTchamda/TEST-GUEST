const db = require('../models')

// Référence au modèle Commande
const Commande = db.commande


// ─────────────────────────────────────────────
// 1. Créer une commande
// POST /api/commandes
// ─────────────────────────────────────────────

const createCommande = async (req, res) => {

    const { client, produit, quantite, prixUnitaire, statut } = req.body

    // Validation des champs obligatoires
    if (!client || !produit || !quantite || !prixUnitaire) {
        return res.status(400).json({ message: 'Tous les champs sont obligatoires.' })
    }

    if (quantite <= 0) {
        return res.status(400).json({ message: 'La quantité doit être supérieure à zéro.' })
    }

    if (prixUnitaire <= 0) {
        return res.status(400).json({ message: 'Le prix unitaire doit être supérieur à zéro.' })
    }

    // Calcul automatique du montant total
    const montantTotal = quantite * prixUnitaire

    // Génération de la référence unique : CMD-XXX
    const count = await Commande.count()
    const reference = `CMD-${String(count + 1).padStart(3, '0')}`

    const nouvelleCommande = await Commande.create({
        reference,
        client,
        produit,
        quantite,
        prixUnitaire,
        montantTotal,
        statut: statut || 'En attente'
    })

    res.status(201).json(nouvelleCommande)
}


// ─────────────────────────────────────────────
// 2. Récupérer toutes les commandes
// GET /api/commandes
// ─────────────────────────────────────────────

const getAllCommandes = async (req, res) => {

    const commandes = await Commande.findAll({
        order: [['createdAt', 'DESC']]
    })

    res.status(200).json(commandes)
}


// ─────────────────────────────────────────────
// 3. Récupérer une commande par son ID
// GET /api/commandes/:id
// ─────────────────────────────────────────────

const getOneCommande = async (req, res) => {

    const id = req.params.id

    const commande = await Commande.findOne({ where: { id: id } })

    if (!commande) {
        return res.status(404).json({ message: 'Commande introuvable.' })
    }

    res.status(200).json(commande)
}


// ─────────────────────────────────────────────
// 4. Mettre à jour le statut d'une commande
// PUT /api/commandes/:id/statut
// ─────────────────────────────────────────────

const updateStatut = async (req, res) => {

    const id = req.params.id
    const { statut } = req.body

    const statutsValides = ['En attente', 'Confirmée', 'Livrée', 'Annulée']

    if (!statut || !statutsValides.includes(statut)) {
        return res.status(400).json({ message: `Statut invalide. Valeurs acceptées : ${statutsValides.join(', ')}` })
    }

    const commande = await Commande.findOne({ where: { id: id } })

    if (!commande) {
        return res.status(404).json({ message: 'Commande introuvable.' })
    }

    await Commande.update({ statut }, { where: { id: id } })

    const commandeMiseAJour = await Commande.findOne({ where: { id: id } })

    res.status(200).json(commandeMiseAJour)
}


// ─────────────────────────────────────────────
// 5. Modifier une commande complète
// PUT /api/commandes/:id
// ─────────────────────────────────────────────

const updateCommande = async (req, res) => {

    const id = req.params.id
    const { client, produit, quantite, prixUnitaire, statut } = req.body

    if (!client || !produit || !quantite || !prixUnitaire) {
        return res.status(400).json({ message: 'Tous les champs sont obligatoires.' })
    }

    if (quantite <= 0) {
        return res.status(400).json({ message: 'La quantité doit être supérieure à zéro.' })
    }

    if (prixUnitaire <= 0) {
        return res.status(400).json({ message: 'Le prix unitaire doit être supérieur à zéro.' })
    }

    const montantTotal = quantite * prixUnitaire

    const commande = await Commande.findOne({ where: { id: id } })

    if (!commande) {
        return res.status(404).json({ message: 'Commande introuvable.' })
    }

    await Commande.update(
        { client, produit, quantite, prixUnitaire, montantTotal, statut },
        { where: { id: id } }
    )

    const commandeMiseAJour = await Commande.findOne({ where: { id: id } })

    res.status(200).json(commandeMiseAJour)
}


// ─────────────────────────────────────────────
// 6. Supprimer une commande
// DELETE /api/commandes/:id
// ─────────────────────────────────────────────

const deleteCommande = async (req, res) => {

    const id = req.params.id

    const commande = await Commande.findOne({ where: { id: id } })

    if (!commande) {
        return res.status(404).json({ message: 'Commande introuvable.' })
    }

    await Commande.destroy({ where: { id: id } })

    res.status(200).json({ message: 'Commande supprimée avec succès.' })
}


// ─────────────────────────────────────────────
// 7. Tableau de bord — indicateurs KPI
// GET /api/commandes/dashboard
// ─────────────────────────────────────────────

const getDashboard = async (req, res) => {

    const { Op } = require('sequelize')

    const total = await Commande.count()
    const enAttente = await Commande.count({ where: { statut: 'En attente' } })
    const confirmees = await Commande.count({ where: { statut: 'Confirmée' } })
    const livrees = await Commande.count({ where: { statut: 'Livrée' } })
    const annulees = await Commande.count({ where: { statut: 'Annulée' } })

    // Chiffre d'affaires = somme des montants hors commandes annulées
    const commandesNonAnnulees = await Commande.findAll({
        where: { statut: { [Op.ne]: 'Annulée' } }
    })

    const chiffreAffaires = commandesNonAnnulees.reduce((sum, cmd) => sum + cmd.montantTotal, 0)

    res.status(200).json({
        total,
        enAttente,
        confirmees,
        livrees,
        annulees,
        chiffreAffaires
    })
}


module.exports = {
    createCommande,
    getAllCommandes,
    getOneCommande,
    updateStatut,
    updateCommande,
    deleteCommande,
    getDashboard
}

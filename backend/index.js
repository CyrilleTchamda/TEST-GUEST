const express = require('express')
const cors = require('cors')

const app = express()


// ─── Middlewares ───────────────────────────────────────────────────────

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))


// ─── Routes ───────────────────────────────────────────────────────────

// Commandes
const routerCommande = require('./routes/commande.routes')
app.use('/api/commandes', routerCommande)

// Route de test (sanity check)
app.get('/', (req, res) => {
    res.json({ message: '✅ API Guest Markets opérationnelle.' })
})


// ─── Données initiales ─────────────────────────────────────────────────

// Insertion des 4 commandes de démo au démarrage si la table est vide
const db = require('./models')

const seedData = async () => {
    const count = await db.commande.count()
    if (count === 0) {
        await db.commande.bulkCreate([
            {
                reference: 'CMD-001',
                client: 'Jean Dupont',
                produit: 'Ordinateur portable',
                quantite: 1,
                prixUnitaire: 350000,
                montantTotal: 350000,
                statut: 'Confirmée'
            },
            {
                reference: 'CMD-002',
                client: 'Sarah Mbarga',
                produit: 'Téléphone',
                quantite: 2,
                prixUnitaire: 125000,
                montantTotal: 250000,
                statut: 'En attente'
            },
            {
                reference: 'CMD-003',
                client: 'Paul Ndom',
                produit: 'Écran 24 pouces',
                quantite: 3,
                prixUnitaire: 85000,
                montantTotal: 255000,
                statut: 'Livrée'
            },
            {
                reference: 'CMD-004',
                client: 'Aline Fotso',
                produit: 'Clavier sans fil',
                quantite: 4,
                prixUnitaire: 18000,
                montantTotal: 72000,
                statut: 'Annulée'
            }
        ])
        console.log('✅ Données initiales insérées (4 commandes de démo).')
    }
}

// Lancer le seed après que Sequelize a synchronisé les tables
db.sequelize.sync({ force: false }).then(() => {
    seedData()
})


// ─── Serveur ───────────────────────────────────────────────────────────

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`🚀 Serveur Guest Markets démarré sur le port ${PORT}`)
})

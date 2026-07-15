const dbConfig = require('../config/dbConfig.js')

const { Sequelize, DataTypes } = require('sequelize')

// Initialisation de la connexion Sequelize avec MySQL
const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: false,

        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
)

// Test de connexion à la base de données
sequelize.authenticate()
.then(() => {
    console.log('✅ Connexion MySQL établie.')
})
.catch(err => {
    console.log('❌ Erreur de connexion : ' + err)
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

// Enregistrement du modèle Commande
db.commande = require('./commande.model.js')(sequelize, DataTypes)

// Synchronisation des tables (force: false = ne supprime pas les données existantes)
db.sequelize.sync({ force: false })
.then(() => {
    console.log('✅ Tables synchronisées avec MySQL.')
})

module.exports = db

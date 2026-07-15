const dbConfig = require('../config/dbConfig.js');

const {Sequelize, DataTypes} = require('sequelize');

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

sequelize.authenticate()
.then(() => {
    console.log('connected..')
})
.catch(err => {
    console.log('Error'+ err)
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.categorie = require ('./categorie.model.js')(sequelize, DataTypes)
db.actu = require ('./actu.model.js')(sequelize, DataTypes)
db.user = require ('./user.model.js')(sequelize, DataTypes)

db.sequelize.sync({ force: false })
.then(() => {
    console.log('yes re-sync done!')
})



// 1 to Many Relation

db.categorie.hasMany(db.actu, {
    foreignKey: 'categorie_id',
    as: 'actu'
})

db.actu.belongsTo(db.categorie, {
    foreignKey: 'categorie_id',
    as: 'categorie'
})



module.exports = db
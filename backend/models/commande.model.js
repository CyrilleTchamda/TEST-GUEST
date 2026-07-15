module.exports = (sequelize, DataTypes) => {

    const Commande = sequelize.define("commande", {

        // Identifiant métier (ex: CMD-001)
        reference: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },

        // Nom du client
        client: {
            type: DataTypes.STRING,
            allowNull: false
        },

        // Produit commandé
        produit: {
            type: DataTypes.STRING,
            allowNull: false
        },

        // Quantité commandée
        quantite: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },

        // Prix unitaire en FCFA
        prixUnitaire: {
            type: DataTypes.FLOAT,
            allowNull: false
        },

        // Montant total = quantite x prixUnitaire (calculé automatiquement)
        montantTotal: {
            type: DataTypes.FLOAT,
            allowNull: false
        },

        // Statut : En attente | Confirmée | Livrée | Annulée
        statut: {
            type: DataTypes.ENUM('En attente', 'Confirmée', 'Livrée', 'Annulée'),
            allowNull: false,
            defaultValue: 'En attente'
        }

    })

    return Commande
}

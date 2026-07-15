module.exports = (sequelize, DataTypes) => {

    const Categorie = sequelize.define("categorie", {
        label: {
            type: DataTypes.STRING,
            allowNull: false
        },
        best: {
            type: DataTypes.STRING,
        },
    })
    return Categorie
}
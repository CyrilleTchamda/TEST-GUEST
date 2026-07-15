module.exports = (sequelize, DataTypes) => {

    const Actu = sequelize.define("actu", {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        subtitle: {
            type: DataTypes.STRING,
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
        },
    })
    return Actu
}
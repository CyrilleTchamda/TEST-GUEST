const db = require('../models')

// create main Model
const User = db.user


// main work

// 1. create user

const addUser = async (req, res) => {

    let info = {
        name: req.body.name,
        pwd: req.body.pwd,
    }

    const user = await User.create(info)
    res.status(200).send(user)
    console.log(user)
}



// 2. get all user

const getAllUsers = async (req, res) => {

    let user = await User.findAll({})
    res.status(200).send(user)

}



// 3. get single user

const getOneUser = async (req, res) => {

    let id = req.params.id
    let user = await User.findOne({ where: { id: id }})
    res.status(200).send(user)

}



// 4. update User

const updateUser = async (req, res) => {

    let id = req.params.id

    const user = await User.update(req.body, { where: { id: id }})

    res.status(200).send(user)

}





// 5. delete User by id

const deleteUser = async (req, res) => {

    let id = req.params.id
    
    await User.destroy({ where: { id: id }} )

    res.status(200).send('User is deleted !')

}







module.exports = {
    addUser,
    getAllUsers,
    getOneUser,
    updateUser,
    deleteUser,
}
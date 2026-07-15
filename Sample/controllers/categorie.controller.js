const db = require('../models')

// create main Model
const Categorie = db.categorie


// main work

// 1. create categorie

const addCategorie = async (req, res) => {

    let info = {
        label: req.body.label,
        best: req.body.best,
    }

    const categorie = await Categorie.create(info)
    res.status(200).send(categorie)
    console.log(categorie)
}



// 2. get all categorie

const getAllCategories = async (req, res) => {

    let categorie = await Categorie.findAll({})
    res.status(200).send(categorie)

}



// 3. get single categorie

const getOneCategorie = async (req, res) => {

    let id = req.params.id
    let categorie = await Categorie.findOne({ where: { id: id }})
    res.status(200).send(categorie)

}



// 4. update Categorie

const updateCategorie = async (req, res) => {

    let id = req.params.id

    const categorie = await Categorie.update(req.body, { where: { id: id }})

    res.status(200).send(categorie)

}





// 5. delete Categorie by id

const deleteCategorie = async (req, res) => {

    let id = req.params.id
    
    await Categorie.destroy({ where: { id: id }} )

    res.status(200).send('Categorie is deleted !')

}







module.exports = {
    addCategorie,
    getAllCategories,
    getOneCategorie,
    updateCategorie,
    deleteCategorie,
}
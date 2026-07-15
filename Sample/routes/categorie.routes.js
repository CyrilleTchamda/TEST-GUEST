// import controllers
const categorieController = require('../controllers/categorie.controller')


// router
const router = require('express').Router()


// use routers
router.post('/', categorieController.addCategorie)
router.get('/', categorieController.getAllCategories)
router.get('/:id', categorieController.getOneCategorie)
router.put('/:id', categorieController.updateCategorie)
router.delete('/:id', categorieController.deleteCategorie)



module.exports = router
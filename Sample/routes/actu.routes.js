// import controllers
const actuController = require('../controllers/actu.controller')


// router
const router = require('express').Router()


// use routers
router.post('/:id', actuController.upload, actuController.addActu)
router.get('/', actuController.getAllActus)
router.get('/:id', actuController.getOneActu)
router.put('/:id', actuController.upload, actuController.updateActu)
router.delete('/:id', actuController.deleteActu)



module.exports = router
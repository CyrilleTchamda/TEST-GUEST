// import controllers
const userController = require('../controllers/user.controller')


// router
const router = require('express').Router()


// use routers
router.post('/', userController.addUser)
router.get('/', userController.getAllUsers)
router.get('/:id', userController.getOneUser)
router.put('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser)



module.exports = router
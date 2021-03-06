const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')

router.post('/', userController.registration)
router.post('/login', userController.login)
router.get('/:id', userController.getOne)
router.put('/:id', userController.update)

module.exports = router
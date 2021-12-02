const { Router } = require('express');
const { authMiddleware } = require('../controllers/UserController');
const router = Router();

const UserController = require('../controllers/UserController')

router.post('/auth/register', UserController.register)
router.put('/user/update', authMiddleware, UserController.updateAccount)
router.post('/user/deposit', authMiddleware, UserController.deposit)
router.post('/user/withdraw', authMiddleware, UserController.withdraw)
router.get('/user', authMiddleware, UserController.account)
router.get('/user/statement', authMiddleware, UserController.statement)
router.get('/user/statement/date', authMiddleware, UserController.statementData)
router.delete('/user/delete', authMiddleware, UserController.deleteAccount)

module.exports = router;

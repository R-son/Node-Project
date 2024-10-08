const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/update/:id', userController.updateUser)


//Connection management
router.post('/login', userController.Login);
router.post('/register', userController.Register);

module.exports = router;
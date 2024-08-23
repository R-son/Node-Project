const express = require('express');
const router = express.Router();
const carsController = require('../controllers/carsController');

router.get('/', carsController.getAllCars);
router.get('/:id', carsController.getCarById);
router.post('/add', carsController.addCar);
router.delete('/delete/:id', carsController.deleteCarById);

module.exports = router;


const db = require('../database/database');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix);
    }
});

const formatDateForDB = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const upload = multer({ storage: storage }).single('img');

exports.addCar = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error('Failed to upload image:', err);
            return res.status(500).json({ error: 'Failed to upload image' });
        }

        try {
            const { name, engine, doors, seats, price } = req.body;
            const img = req.file ? req.file.path : null;
            const date = new Date();
            const currDate = formatDateForDB(date);

            const conn = await db.pool.getConnection();
            const result = await conn.query('SELECT * FROM Cars WHERE name = ?', [name]);

            if (result.length > 0) {
                conn.release();
                return res.status(400).json({ message: 'This model already exists' });
            }

            const car = await conn.query('INSERT INTO Cars (name, engine, doors, seats, price, img, `creation-date`, `last-updated`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
                [name, engine, doors, seats, price, img, currDate, currDate]);

            const insertID = car.insertId.toString();
            conn.release();
            res.status(200).json({ id: insertID });
        } catch (err) {
            console.error('Failed to add car:', err);
            res.status(500).send('Something went wrong, couldn\'t add the car');
        }
    });
};

exports.getAllCars = async (req, res) => {
    try {
        const rows = await db.pool.query('SELECT * FROM Cars'); 
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
    }
}

exports.getCarById = async (req, res) => {
    try {
        const { id } = req.params;
        const car = await db.pool.query('SELECT * FROM Cars WHERE id = ?', [id]);
        res.status(200).json(car[0]);
    } catch (err) {
        console.error(err);
    }
}

exports.updateCar = async (req, res) => {
    try {
        const {name, engine, doors, seats, price} = req.body;
        const {id} = req.params;
        const conn = db.pool.getConnection();
        const date = new Date();
        const currDate = date.toISOString();
        const result = await conn.query("UPDATE Users SET name = ?, engine = ?, doors = ?, seats = ?, price = ?, last-updated = ? WHERE id = ?", [name, engine, doors, seats, price, id]);
        if (result.affectedRows > 0) {
            res.sendStatus(200);
        } else {
            res.status(402).send('This model does not exist');
        }
    } catch {
        console.error('Error updating car:', err);
        res.status(500).send('Internal Server Error');
    }
}

exports.deleteCarById = async (req, res) => {
    const carId = req.params.id;

    if (!carId)
        return res.status(400).json({ error: 'Car ID is required' });

    try {
        const conn = await db.pool.getConnection();
        const result = await conn.query('DELETE FROM Cars WHERE id = ?', [carId]);

        conn.release();
        if (result.affectedRows > 0)
            res.status(200).json({ message: 'Car successfully deleted' });
        else
            res.status(404).json({ error: 'Car not found' });
    } catch (err) {
        console.error('Failed to delete car:', err);
        res.status(500).json({ error: 'Failed to delete car' });
    }
};
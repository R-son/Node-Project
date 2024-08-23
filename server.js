const express = require('express');
const db = require('./database/database');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const userRoute = require('./routes/userRoute');
const carRoute = require('./routes/carRoute');
const path = require('path');
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.get('/uploads/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, 'uploads', filename);

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            return res.status(404).send('File not found');
        }

        res.sendFile(filePath);
    });
});

app.use('/api/users', userRoute);
app.use('/api/cars', carRoute);

app.listen(db.PORT, () => {console.log(`Serveur launched on port ${db.PORT}`)});
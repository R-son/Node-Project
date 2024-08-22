const express = require('express');
const db = require('./database/database');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const userRoute = require('./routes/userRoute');

app.use(bodyParser.json());
app.use(cors());
app.use('/api/users', userRoute);
app.use('/api/cars', carRoute);

app.listen(3001, () => {console.log('Serveur ouvert au port 3001')});
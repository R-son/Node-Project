const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../database/database');

exports.getAllUsers = async (req, res) => {
    try {
        const rows = await db.pool.query('SELECT * FROM Users'); 
        res.status(200).json(rows);
    }
    catch (err) {
        console.error(err);
    }
}

exports.getUserById = async (req, res) => {
    try {
        const user = await db.pool.query('SELECT * FROM Users WHERE id = ?', [id]);
        res.json(user);
        res.status(200).json(user);
    }
    catch (err) {
        console.error(err);
    }
}

exports.Register = async (req, res) => {
    try {
        const {username, email, password} = req.body;
        const conn = await db.pool.getConnection();
        const result = await conn.query('SELECT * FROM Users WHERE email = ?', [email]);
        console.log(result);
        if (result[0])
            return res.status(401).send('This email is already associated to another account');
        const hashedPwd = await bcrypt.hash(password, 10);
        await conn.query(
            "INSERT INTO Users (name, email, password) VALUES (?, ?, ?)",
            [username, email, hashedPwd]
        );
        conn.release();
        const token = jwt.sign({email}, process.env.API_KEY, { expiresIn: '1h'});
        res.status(200).json({token});
    } catch (err) {
        console.error('Failed to add user:', err);
        res.status(500).send('Internal Server Error');
    }
};

exports.Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const conn = await db.pool.getConnection();
        const result = await conn.query('SELECT * FROM Users WHERE email = ?', [email]);
        conn.release();

        if (result.length === 0) return res.status(401).json({ error: 'This account does not exist' });
        const user = result[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Wrong password' });

        const token = jwt.sign({ email: user.email, role: user.role }, process.env.API_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error('Failed to login user:', err);
        res.status(500).send('An error occurred during connection. Try again later.');
    }
};

exports.updateUser = async (req, res) => {
    let conn;
    try {
        const { username, email } = req.body;
        const { id } = req.params;
        conn = await db.pool.getConnection();
        const result = await conn.query("UPDATE Users SET username = ?, email = ? WHERE id = ?", [username, email, id]);
        if (result.affectedRows > 0) {
            res.sendStatus(200);
        } else {
            res.status(404).send('User not found');
        }
        conn.end();
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).send('Internal Server Error');
    }
}

exports.deleteUser = async (req, res) => {
    let conn;
    try {
        const { id } = req.params;
        conn = await pool.getConnection();
        const result = await conn.query("DELETE FROM Users WHERE id = ?", [id]);
        if (result.affectedRows > 0) {
            res.sendStatus(200);
        } else {
            res.status(404).send('User not found');
        }
        conn.end();
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Internal Server Error');
    }
}
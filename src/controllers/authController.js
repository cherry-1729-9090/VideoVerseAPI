const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { userDb } = require('../config/database');

exports.signup = async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        userDb.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function (err) {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Error saving to database');
            }

            const userId = this.lastID;
            const accessToken = jwt.sign({ userId, username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

            res.status(200).json({
                message: 'User created successfully',
                userId,
                accessToken
            });
        });
    } catch (error) {
        console.error('Error in signup:', error);
        res.status(500).send('Error in signup process');
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        userDb.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Error querying database');
            }

            if (!row) {
                return res.status(400).send('User not found');
            }

            if (await bcrypt.compare(password, row.password)) {
                const accessToken = jwt.sign({ userId: row.id, username: row.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

                userDb.run('UPDATE users SET accessToken = ? WHERE id = ?', [accessToken, row.id], (err) => {
                    if (err) {
                        console.error('Database error:', err);
                        return res.status(500).send('Error updating database');
                    }
                });

                return res.status(200).json({ accessToken });
            } else {
                return res.status(400).send('Invalid password');
            }
        });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).send('Error in login process');
    }
};

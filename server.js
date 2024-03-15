const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

const db = new sqlite3.Database('./student_management_system.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the student management system database.');
});

db.run(`CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    familyName TEXT NOT NULL,
    dob DATE NOT NULL
)`);

app.get('/students', (req, res) => {
    db.all('SELECT * FROM students', [], (err, rows) => {
        if (err) {
            return console.error(err.message);
        }
        res.json(rows);
    });
});

app.post('/students', (req, res) => {
    const { firstName, familyName, dob } = req.body;
    const sql = 'INSERT INTO students (firstName, familyName, dob) VALUES (?, ?, ?)';
    
    db.run(sql, [firstName, familyName, dob], function(err) {
        if (err) {
            return console.error(err.message);
        }
        res.status(201).json({ id: this.lastID });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

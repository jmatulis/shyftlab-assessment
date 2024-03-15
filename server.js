const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const db = new sqlite3.Database('./student_management_system.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
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
            throw err;
        }
        res.json(rows);
    });
});

app.post('/students', (req, res) => {
    const { firstName, familyName, dob } = req.body;
    if (!validateDOB(dob)) {
        return res.status(400).send('Student must be at least 10 years old.');
    }

    db.run('INSERT INTO students (firstName, familyName, dob) VALUES (?, ?, ?)', [firstName, familyName, dob], function(err) {
        if (err) {
            console.error(err.message);
            return res.status(500).send('An error occurred.');
        }
        res.status(201).json({ id: this.lastID });
    });
});

function validateDOB(dob) {
    const dobDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const m = today.getMonth() - dobDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
        age--;
    }
    return age >= 10;
}

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

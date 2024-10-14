// app.js

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3307;

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Enable CORS
const cors = require('cors');
app.use(cors());

// Middleware to parse JSON request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create connection to the MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: '', // Replace with your MySQL password
    database: 'bank_db', // Replace with your MySQL database name
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.log('Error connecting to the database', err);
        return;
    }
    console.log('Connected to MySQL database.');
});



// Create an API endpoints to handle form submissions

// API for createaccount
app.post('/createaccount', (req, res) => {
    const { fname, lname, dob, gender, email, phone, address, account_type } = req.body;

    // Validate required fields
    if (!fname || !lname || !dob || !gender || !email || !phone || !address || !account_type) {
        return res.status(400).json({ message: 'Please fill in all required fields.' });
    }


    const check = `
        SELECT COUNT(*) FROM accounts WHERE (first_name, last_name, dob, gender, email, phone, address, account_type) LIKE ${req.body}
    `;
    db.query(check, [fname, lname, dob, gender, email, phone, address, account_type], (err, result) => {
        if(err){
            console.error('Error while checking for data:', err);
            return res.status(500).json({message: 'Account already exists.'})
        }
        else{
            // SQL query to insert the form data into the database
            const query = `
                INSERT INTO accounts (first_name, last_name, dob, gender, email, phone, address, account_type)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
        
            // Execute the query
            db.query(query, [fname, lname, dob, gender, email, phone, address, account_type], (err, result) => {
                if (err) {
                    console.error('Error inserting data into database:', err);
                    return res.status(500).json({ message: 'Error creating account.' });
                }
                res.status(201).json({ message: 'Account created successfully!' });
            });
        }
    });
});



app.get('', (req, res) => {

});


const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to get book data
app.get('/data', (req, res) => {
    const dataPath = path.join(__dirname, 'public', './database/data.json');
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading data file');
        } else {
            res.send(data);
        }
    });
});

// Endpoint to save book data
app.post('/data', (req, res) => {
    const dataPath = path.join(__dirname, 'public', './database/data.json');
    const newData = req.body;
    fs.writeFile(dataPath, JSON.stringify(newData, null, 2), 'utf8', (err) => {
        if (err) {
            res.status(500).send('Error saving data');
        } else {
            res.send('Data saved successfully');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

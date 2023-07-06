const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// HTML Routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// API Routes
app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) throw err;
    let notes = JSON.parse(data);
    res.json(notes);
  });
});

app.post('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) throw err;
    let notes = JSON.parse(data);
    let newNote = req.body;
    newNote.id = uuidv4(); // Generate a unique ID for the new note
    notes.push(newNote);
    fs.writeFile('./db/db.json', JSON.stringify(notes, null, 2), err => {
      if (err) throw err;
      res.json(newNote);
    });
  });
});

// Delete route (to be implemented)
// app.delete('/api/notes/:id', (req, res) => {
//  Your code here
// });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

// HTML Routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Delete route
  app.delete('/api/notes/:id', (req, res) => {
    // The id of the note to delete is in the URL, we get it using req.params.id
    const noteId = req.params.id;
    
    // Read the db.json file
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) throw err;
      
      // Parse the file contents into a JavaScript array
      let notes = JSON.parse(data);
      
      // Filter out the note with the given id
      const filteredNotes = notes.filter(note => note.id !== noteId);
      
      // Write the filtered notes back to db.json
      fs.writeFile('./db/db.json', JSON.stringify(filteredNotes, null, 2), err => {
        if (err) throw err;
        
        // Send a success response back to the client
        res.json({message: "Note deleted successfully"});
      });
    });
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

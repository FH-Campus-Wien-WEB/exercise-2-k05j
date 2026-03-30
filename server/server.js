const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { parseMovies } = require('./movie-model.js');

const app = express();

// Parse urlencoded bodies
app.use(bodyParser.json()); 

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));

let movies = []  // parse the movies once at the start of the server, we can use this array to serve the movie data to the client

// Configure a 'get' endpoint for all movies..
app.get('/movies', async function (req, res) {
  try {
    if (!movies || movies.length === 0) {
      movies = await parseMovies()
    }
    res.status(200).send(movies)
  } catch (err) {
    console.error(err)
    res.status(500).send("Error retrieving movies")
  }
})

// Configure a 'get' endpoint for a specific movie
app.get('/movies/:imdbID', async function (req, res) {
  if (!movies || movies.length === 0) {
    movies = await parseMovies()
  }
  const movie = movies.find(m => m.imdbID === req.params.imdbID)
  if (movie) {
    res.status(200).send(movie)
  } else {
    res.sendStatus(404)
  }
})

/* Task 3.1 and 3.2.
   - Add a new PUT endpoint
   - Check whether the movie sent by the client already exists 
     and continue as described in the assignment */

app.listen(3000)

console.log("Server now listening on http://localhost:3000/")


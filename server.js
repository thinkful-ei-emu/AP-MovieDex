const express = require("express");
const morgan = require("morgan");
const helmet = require('helmet');
const cors = require('cors');
const array = require("./movies-data-small");
require("dotenv").config();

const server = express();

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))

server.use(helmet());
server.use(cors());

server.use(function validateBearerToken(req, res, next) {
    const authToken = req.get('Authorization');
    const apiToken = process.env.API_TOKEN;

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({error: 'Unauthorized request'});
    }
    next();
});

server.use((error, req, res, next) => {
  let response
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' }}
  } else {
    response = { error }
  }
  res.status(500).json(response)
})

const PORT = process.env.PORT || 8000

function handleGetMovies(req, res) {
  let movies = [...array];

  const { genre, country, avg_vote } = req.query;

  if (genre) {
    movies = movies.filter(movie => {
      return movie.genre.toLowerCase().includes(genre.toLowerCase());
    });

  }

  if (country) {
    movies = movies.filter(movie => {
      return movie.country.toLowerCase().includes(country.toLowerCase());
    });
  }

  if (avg_vote) {


    movies = movies.filter(movie => {
      return Number(movie.avg_vote) >= Number(avg_vote);
    });
  }

  if (movies === []) {
    return res.status(404).json("Please enter a valid country");
  }

  res.status(200).json(movies);
}

server.get("/movie", handleGetMovies);

const PORT = process.env.PORT || 8000

server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

require('dotenv').config()
const fetch = require("node-fetch");
const express = require("express");
const router = express.Router()
const auth = require("../auth");
const { route } = require('./movie');
const apiKey = process.env.MOVIE_API;
const User = require("../models/user")
const Review = require("../models/review")
const mongoose = require('mongoose')

router.get('/', auth, async (req, res) => {
    const username = req.session.username;
    try{
        const titles = ['The Shawshank Redemption', 'The Godfather', 'Breaking Bad','The Lord of the Rings: The Return of the King', 'Attack on titan', 'Death Note', 'Friends', 'Forrest Gump'];
        const final_response = [];
      
        for (let i = 0; i < 8; i++) {
          const apiUrl = `http://www.omdbapi.com/?t=${titles[i]}&apikey=${apiKey}`;
          const response = await fetch(apiUrl);
          const movieData = await response.json();
          final_response.push(movieData);
        }
      
        const title = "Top Movies, Series & Anime";
        res.render("rate.ejs", { username, final_response, title });
    }catch(err){
        const errorMessage = err.toString().replace(apiKey, 'API_KEY_HIDDEN');
        res.render('error.ejs',{err:errorMessage,username})
    }
});
  

router.post('/search', auth,async (req, res) => {
    const username = req.session.username;
    try{
        const title = `Showing Results For "${req.body.search}"`;
        const movieTitle = req.body.search;
        const apiUrl = `http://www.omdbapi.com/?s=${movieTitle}&apikey=${apiKey}`;
    
        const response = await fetch(apiUrl);
        const data = await response.json();
    
        const final_response = data.Response === 'True' ? data.Search : [];
        // console.log(final_response)
        res.render('rate.ejs',{final_response,username,title});
    }catch(err){
        const errorMessage = err.toString().replace(apiKey, 'API_KEY_HIDDEN');
        res.render('error.ejs',{err:errorMessage,username})
    }
});

router.get("/myratings",auth,async (req,res)=>{
    const username = req.session.username;
    try{
        const user = await User.findOne({ username }).populate('rating');
        const reviews = user.rating;
        const final_response = [];
        
        for (let review of reviews) {
          const imdb_id = review.movie;
          const apiUrl = `http://www.omdbapi.com/?i=${imdb_id}&apikey=${apiKey}`;
          const response = await fetch(apiUrl);
          const movieData = await response.json();
          final_response.push(movieData);
        }
        
        res.render('myratings.ejs', { final_response });
    }catch(err){
        const errorMessage = err.toString().replace(apiKey, 'API_KEY_HIDDEN');
        res.render('error.ejs',{err:errorMessage,username})
    }
})

router.get('/mywatchlist',auth, async (req,res)=>{
    const username = req.session.username;
    try{
        const final_response = [];
        const user = await User.findOne({username});
        const watchlist = user.watchlist
        for (let watch of watchlist) {
          const apiUrl = `http://www.omdbapi.com/?i=${watch}&apikey=${apiKey}`;
          const response = await fetch(apiUrl);
          const movieData = await response.json();
          final_response.push(movieData);
        }
        res.render('watchlist.ejs',{final_response})
    }catch(err){
        const errorMessage = err.toString().replace(apiKey, 'API_KEY_HIDDEN');
        res.render('error.ejs',{err:errorMessage,username})
    }
})

router.put('/mywatchlist/:id',async (req,res)=>{
    const username = req.session.username;
    const user_id = req.session.user_id;
    const {id} = req.params;
    try{
        const user = await User.findOneAndUpdate(
            { _id: user_id },
            { $pull: { watchlist: id } },
            { new: true }
          );
      
          res.redirect("/rate/mywatchlist")
    }catch(err){
        const errorMessage = err.toString().replace(apiKey, 'API_KEY_HIDDEN');
        res.render('error.ejs',{err:errorMessage,username})
    }
})

module.exports = router;

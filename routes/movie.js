require('dotenv').config()
const fetch = require("node-fetch");
const express = require("express");
const router = express.Router()
const auth = require("../auth")
const Review = require('../models/review')
const User = require('../models/user')
const apiKey = process.env.MOVIE_API;
const multer = require('multer');
const { storage } = require("../cloudinary/index");
const { cloudinary } = require("../cloudinary/index");
const upload = multer({ storage });
const Photos = require("../models/photos");


router.get('/:id',auth,async (req,res)=>{
    const username = req.session.username;
    try{
        const imdb_id = req.params.id;
        const apiUrl = `http://www.omdbapi.com/?i=${imdb_id}&apikey=${apiKey}`;
        const response = await fetch(apiUrl);
        const movieData = await response.json();
        // console.log(movieData)
        const reviews = await Review.find({movie:imdb_id}).populate('author')
        res.render('movie.ejs',{username,movieData,reviews,message:req.flash('message')})
    }catch(err){
        const errorMessage = err.toString().replace(apiKey, 'API_KEY_HIDDEN');
        res.render('error.ejs',{err:errorMessage,username})
    }
})

router.post('/review/:id',auth, async (req,res)=>{
    const username = req.session.username
    try{
        const {body , rating} = req.body;
        const author = req.session.user_id;
        const movie = req.params.id;

        const check = await Review.findOne({author,movie});
        if(check){
            req.flash("message","You Have already rated this!");
            res.redirect(`/movie/${movie}`);
        }else{
            req.flash("message","Review Added");
            const review = new Review({body , rating , author , movie})
            const user = await User.findOne({username});
            await user.rating.push(review);
            await review.save();
            await user.save()
            res.redirect(`/movie/${movie}`);
        }
    }catch(err){
        const errorMessage = err.toString().replace(apiKey, 'API_KEY_HIDDEN');
        res.render("error.ejs",{err:errorMessage,username})
    }
})

router.delete('/review/:id/:id2',auth,async(req,res)=>{
    try{
        const {id,id2}=req.params
        await Review.findByIdAndDelete(id2)
        req.flash("message","Review & Rating Deleted successfully!")
        res.redirect(`/movie/${id}`);
    }catch(err){
        const errorMessage = err.toString().replace(apiKey, 'API_KEY_HIDDEN');
        res.render("error.ejs",{err:errorMessage})
    }
})

router.post('/:id/watchlist', auth, async (req, res) => {
    try{
        const { id } = req.params;
        const user = await User.findOne({ username: req.session.username });
        if (!user.watchlist.includes(id)) {
            req.flash("message", "Added To Watchlist");
            user.watchlist.push(id);
            await user.save();
        } else {
            req.flash("message", "Already in Watchlist");
        }
        res.redirect(`/movie/${id}`);
    }catch(err){
        const errorMessage = err.toString().replace(apiKey, 'API_KEY_HIDDEN');
        res.render("error.ejs",{err:errorMessage});
    }

});

router.get("/:id/photos",auth,async(req,res)=>{
    const username = req.session.username;
    try{
        const imdb_id = req.params.id;
        const apiUrl = `http://www.omdbapi.com/?i=${imdb_id}&apikey=${apiKey}`;
        const response = await fetch(apiUrl);
        const movieData = await response.json();
        const photos = await Photos.find({movie:req.params.id})
        res.render("photos.ejs",{username,movieData,photos})
    }catch(err){
        const errorMessage = err.toString().replace(apiKey, 'API_KEY_HIDDEN');
        res.render("error.ejs",{err:errorMessage});
    }
})

router.post("/:id/photos",auth,upload.single('image'),async(req,res)=>{
    const username = req.session.username;
    const {id} = req.params;
    try{
        const file = req.file;
        if (!file) {
          res.status(400).render('error',{err:"NO FILE UPLOADED",username});
          return;
        }
        if (file.error) {
          console.error(file.error);
          res.status(500).render("error",{err:file.error.message,username})
          return;
        }
      
        console.log(`File uploaded to Cloudinary with URL: ${file.path}`,req.file);
        const photo = await new Photos({movie:id,image:req.file.path,uploader:username,date:Date.now(),filename:req.file.filename});
        await photo.save();
        res.redirect(`/movie/${id}/photos`)
    }catch(err){
        res.render("error.ejs",{err,username})
    }
})

router.delete('/delete/:id', async(req,res)=>{
    const username = req.session.username;
    try{
        const photo = await Photos.findOne({_id:req.params.id});
        const movie = photo.movie;
        await cloudinary.uploader.destroy(photo.filename);
        await Photos.findByIdAndDelete({_id:req.params.id});
        res.redirect(`/movie/${movie}/photos`)
    }catch(err){
        res.render("error.ejs",{err,username})
    }
})

module.exports = router;
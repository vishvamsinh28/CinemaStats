require('dotenv').config()
const express = require('express');
const router = express.Router();
const auth = require('../auth')
const mapToken = process.env.MAP_API;
const Map = require('../models/mapLocation')
const validator = require('validator');

router.get('/', auth ,async(req, res) => {
    const username = req.session.username;
    try{
        const locations = await Map.find({});
        const locname = locations.map(location => location.name);
        const l = locations.map(loc => [loc.longitude, loc.latitude]);
        res.render('map',{mapToken,username,locname,l});
    }catch(err){
        res.render('error',{username})
    }
});

router.get('/add',auth,(req,res)=>{
    const username = req.session.username;
    try{
        res.render('addMap')
    }catch(err){
        res.render('error',{err,username})
    }
})

router.post('/add', auth, async (req, res) => {
    const username = req.session.username;
    try {
      const { name, latitude, longitude } = req.body;
      if (!validator.isLatLong(`${latitude},${longitude}`)) {
        res.render('error', { err: 'Invalid input', username });
      } else {
        const existingMap = await Map.findOne({ latitude, longitude });
        if (existingMap) {
          res.render('error', { err: 'A map object with the same latitude and longitude already exists', username });
        } else {
          const map = await new Map({ name, latitude, longitude });
          await map.save();
          res.redirect('/map');
        }
      }
    } catch (err) {
      res.render('error', { err, username });
    }
  });
  

router.get('/delete',auth,(req,res)=>{
    const username = req.session.username;
    try{
        res.render('delMap')
    }catch(err){
        res.render('error',{err,username})
    }
})

router.delete('/delete', auth, async (req, res) => {
    const username = req.session.username;
    try {
      const { latitude, longitude } = req.body;
      if (!validator.isLatLong(`${latitude},${longitude}`)) {
        res.render('error', { err: 'Invalid input', username });
        return;
      }
      const map = await Map.findOneAndDelete({ latitude, longitude });
      if (!map) {
        res.render('error', { err: 'No location found with coordinates', username });
        return;
      }
      res.redirect('/map');
    } catch (err) {
      res.render('error', { err, username });
    }
  });
  


module.exports = router;

const express = require('express');
const router = express.Router();
const patientModel = require('../models/schemaModel').patient;
const insuranceModel = require('../models/schemaModel').insurance;
const mongoose = require('mongoose');

const db = mongoose.connection;

router.post('/add', async (req, res) => {
  try {
      // Extracting the data from the form
      const { name, dob, gender, contact, address, uniqueid, coverageAmount } = req.body;

      await patientModel.collection.insertOne({ name, dob, gender, contact, address, uniqueid });
      await insuranceModel.collection.insertOne({ uniqueid, coverageAmount });   
      res.redirect('/'); 
  } catch (error) {
      console.error('Error adding patient:', error);
      res.status(500).send('Internal Server Error');
  }
});
  
router.post('/update', async (req, res) => {
    try {
        const { contact, address, uniqueid, coverageAmount } = req.body;
        const patientUpdateResult = await patientModel.collection.findOneAndUpdate(
            { uniqueid },
            { $set: {contact, address } },
            { returnDocument: 'after' }
        );

        const insuranceUpdateResult = await insuranceModel.collection.findOneAndUpdate(
            { uniqueid },
            { $set: { coverageAmount } },
            { returnDocument: 'after' }
        );

        if (patientUpdateResult && insuranceUpdateResult) {
            res.redirect('/');
        } else {
            console.log('Patient or insurance record not found for update');
            res.status(404).send('Patient or insurance record not found for update');
        }
    } catch (error) {
        console.error('Error updating patient details:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/delete', async (req, res) => {
    try {
        const uniqueid = req.body.uniqueid;
        const deletionResult = await patientModel.collection.deleteOne({ uniqueid });

        if (deletionResult.deletedCount === 1) {
            res.json({ success: true, message: 'Patient deleted successfully' });
        } else {
            res.json({ success: false, message: 'Patient not found or already deleted' });
        }
    } catch (error) {
        console.error('Error deleting patient:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

router.get('/retrievePatient', async (req, res) => {
    try {
        const uniqueid = req.query.uniqueid;
        const patient = await patientModel.collection.findOne({ uniqueid });
        const insurance = await insuranceModel.collection.findOne({ uniqueid });

        if (patient && insurance) {
            res.render('retrievePatient', { patient, insurance });
        } else {
            res.render('patientNotFound'); 
        }
    } catch (error) {
        console.error('Error retrieving patient:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/filterByCity', async (req, res) => {
    try {
        // Prompt user for city name
        const cityName = req.query.cityName || req.body.cityName;
        if (!cityName) {
            return res.status(400).json({ success: false, message: 'City name is required' });
        }

        const patientsInCity = await patientModel.collection.find({ address: { $regex: new RegExp(cityName, 'i') } }).toArray();

        res.render('filteredPatients', { patients: patientsInCity, cityName });
    } catch (error) {
        console.error('Error filtering patients by city:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


module.exports = router;
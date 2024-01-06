const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/patientInsurance');

app.set("view engine","ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('./public'));

//Routes
const patientRoutes = require('./routes/patientRoutes');

app.use('/patient', patientRoutes);

app.get('/', (req, res) => {
  res.render('homepage');
});

app.get('/addNewPatient', (req, res) => {
  res.render('addNewPatient');
});

app.get('/updatePatient', (req, res) => {
  res.render('updatePatient');
});

app.get('/retrievePatient', (req, res) => {
  res.render('retrievePatient');
});

app.listen(PORT, ()=>{
  console.log(`Server is running on port ${PORT}`);
});
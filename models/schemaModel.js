const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: String,
  dob: Date,
  gender: String,
  contact: String,
  address: String,
  uniqueid: Number
});

const insuranceSchema = new mongoose.Schema({
  uniqueid: Number,
  coverageAmount: Number
});

exports.patient = mongoose.model('patient', patientSchema);
exports.insurance = mongoose.model('insurance', insuranceSchema);


const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: String, required: true },       
  mileage: { type: Number, required: true },
  condition: { type: String, required: true },
  image: { type: String, required: true },
  exteriorColor: { type: String, required: true },
  interiorColor: { type: String, required: true },
  engine: { type: String, required: true },
  horsepower: { type: Number, required: true },
  doors: { type: Number, required: true },
});

module.exports = mongoose.model('Car', carSchema);

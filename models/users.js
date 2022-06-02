const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  phone_no: {
    type: Number,
    required: true,
    length: 10,
    unique: true
  },
  isAdmin: {type: Boolean, default: false}
});

const User = mongoose.model('User',userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    phone_no: Joi.string().length(10).required()
  };
  return Joi.validate(user, schema);
}

function validateUserName(user) {
  const schema = {
    name: Joi.string().min(5).max(50).required()
  };
  return Joi.validate(user, schema);
}

exports.User = User; 
exports.validate = validateUser;
exports.validateUserName = validateUserName;
const { User } = require('../models/users');
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
// Add middleware in post method : auth
router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
      let user = await User.findOne({$or:[{email: req.body.emailOrPhone},{phone_no: parseInt(req.body.emailOrPhone)|0}]}); //, {phone_no: parseInt(req.body.emailOrPhone)}
      if(!user) return res.status(400).send('Invalid Email or Password.');
    
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid Email or Password.');
    //const token = user.generateAuthToken();
    //res.send(token);
    res.send(_.pick(user, ["_id", "name", "email", "phone_no", "isAdmin"]));
  });
  function validate(req) {
    const schema = {
        password: Joi.string().min(5).max(255).required(),
        emailOrPhone : Joi.string().required()
    };
    return Joi.validate(req, schema);
  }

module.exports = router;
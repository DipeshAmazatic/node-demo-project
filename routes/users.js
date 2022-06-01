const {User, validate, validateUserName} = require('../models/users');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('../config/custom.json');
const express = require('express');
const router = express.Router();

// router.get('/me', async (req, res) => {
//   console.log(req.body);
//   console.log(req.params);
//   //const user = await User.findOne({email: req.body.email})//.select('~password');//exclude password property
//   res.send('user');
// });

router.get('/', async (req, res) => {
  const users = await User.find();
  res.send(users);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({$or:[{email: req.body.email},{phone_no: req.body.phone_no}]});
    if(user) return res.status(400).send('User Already registered...');    
    user = new User(
      _.pick(req.body, ["password", "name", "email", "phone_no"])
    );
    const salt = await bcrypt.genSalt(15);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    /*  generate a token */
    const payload = {
      user : { id : user.id}
    } 
    jwt.sign(
        payload, 
        config['jwtSecret'], 
        {expiresIn: 360000}, 
        (err, token) =>{
          if(err) throw err;
          res.header('x-auth-token', token).status(201).json({token: token, userInfo: _.pick(user, ["_id", "name", "email", "phone_no"])});
        });
  });

router.patch('/:id', async (req, res) => {
    const { error } = validateUserName(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findById(req.params.id);
    if (!user) return res.status(400).send('Invalid User.');
    user = await User.findByIdAndUpdate(req.params.id, {name : req.body.name});
    if (!user) return res.status(404).send('The user with the given ID was not exists.');
    res.send(_.pick(user, ["_id", "name", "email", "phone_no"]));
  });

router.delete('/:id', async (req, res) => {
    try{
      let user = await User.findByIdAndRemove(req.params.id);
      if(!user) return res.status(404).send('The User with the given ID was not exists!');
      return res.status(200).json({message: 'User deleted successfully...', userInfo: _.pick(user, ["_id", "name", "email", "phone_no"])});
    }
    catch(err){
      res.status(404).send('The User with the given ID was not exists!');
    }
  });

router.get('/:id', async (req, res) => {
    try{
      let user = await User.findById(req.params.id);
      if(!user) return res.status(404).send('The User with the given ID was not exists!');
      return res.status(200).json({userInfo: _.pick(user, ["_id", "name", "email", "phone_no"])});
    }
    catch(err){
      res.status(401).send('The User with the given ID was not found!');
    }
  });
module.exports = router;
const jwt = require('jsonwebtoken');
const config = require('../config/custom.json');

module.exports = function(req, res, next){
    //get token from header
    const token = req.header('x-auth-token');
    //check if not token
    if(!token) return res.status(401).send('No token, authorization denied.');
    //verify token
    try{
        const decode = jwt.verify(token, config['jwtSecret']);
        req.user = decode.user;
        next();
    } catch(err){
        res.status(401).send('Token is not valid');
    }
}
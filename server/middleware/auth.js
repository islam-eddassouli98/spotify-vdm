const jwt = require('jsonwebtoken');

//Middleware per vedere se l'utente è loggato
module.exports = (req,res,next) => {
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Access denied. No token provided');
    jwt.verify(token, process.env.JWT_SECRET, (err, validToken) => {
        if(err) 
        { return res.status(400).send('Invalid token'); }else{
            req.user = validToken;
        next();
        }
        
    });
}
const jwt = require('jsonwebtoken');

//Middleware per vedere se l'utente è loggato ed è admin
module.exports = (req,res,next) => {
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Access denied. No token provided');
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err){
            return res.status(400).send('Invalid token');
        } else{
            if(!decoded.isAdmin) return res.status(403).send('Access denied. You are not an admin');
        }

        req.user = decoded;
        next();
    });
}
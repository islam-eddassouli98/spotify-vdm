const mongoose = require('mongoose');

//Middleware per vedere se l'id è valido
module.exports = (req,res,next) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).send('Invalid ID');
    
    next();
}
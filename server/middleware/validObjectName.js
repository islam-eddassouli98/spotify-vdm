const mongoose = require('mongoose');
//Middleware per vedere se il name è valido
module.exports = (req,res,next) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.name)) return res.status(404).send('Invalid Name');
    
    next();
}
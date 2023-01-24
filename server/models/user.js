const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({

    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    id: {type: String, required: true, unique: true},
    images: {type: String, required: true},
    items: {type: Array, required: true},
    mongoitems: {type: Array, required: true}

});


const validate = (user) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        id: Joi.string().required(),
        images: Joi.string().required(),
        items: Joi.array(),
        mongoitems: Joi.array()
    });
    return schema.validate(user);
}

const User = mongoose.model('user', userSchema);

module.exports = {User, validate};
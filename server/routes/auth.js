const router = require('express').Router();
const {User, validate} = require('../models/user');
const bcrypt = require('bcrypt');

router.post("/", async (req, res) => {
    //Validazione
    const user = await User.findOne({ email:req.body.email });
    if(!user) return res.status(400).send("Invalid email or password");
    //Confronto password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send("Invalid email or password");
    //Creazione e assegnazione Token
    const token = user.generateAuthToken();
    const id = user._id;
    const name = user.name;
    const email = user.email;
    res.status(200).send({data:token,message:"User logged in successfully",id:id,name:name,email:email});
});

module.exports = router;
const router = require('express').Router();
const {User, validate} = require('../models/user');
const bcrypt = require('bcrypt');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const validObjectId = require('../middleware/validObjectId');
const validObjectName = require('../middleware/validObjectName');

//Creazione nuova utenza
router.post('/', async (req,res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne
    ({ email
    :req.body.email });
    if(user) return res.status(200).send({data:user,message:"User already registered"});

    user = new User({
        name: req.body.name,
        email: req.body.email,
        id: req.body.id,
        images: req.body.images,
        items:req.body.items,
    });
    await user.save();
    res.status(200).send({data:user,message:"User created successfully"});
});

//Aggiorn mongoitems
router.post('/mongoitems/:id', [validObjectId], async (req,res) => {
    // Extract the new playlist object from the request body
    const newPlaylist = req.body;

    // Use the findByIdAndUpdate method to update the user's mongoitems field
    // by pushing the new playlist object
    const user = await User.findByIdAndUpdate(
        req.params.id,
        { $push: { mongoitems: newPlaylist } },
        { new: true }
    );

    if(!user) return res.status(404).send("The user with the given ID was not found.");
    res.status(200).send({data:user,message:"User updated successfully"});
});

//Aggiorna mongoitems aggiungendo un object in playlist
router.post('/mongoitems/:id/:name', [validObjectId], async (req,res) => {
    // Extract the new playlist object from the request body
    const newPlaylist = req.body;
    
    // Use the findByIdAndUpdate method to update the user's mongoitems field
    // by pushing the new playlist object
    const user
    = await User.findOneAndUpdate(
        { _id: req.params.id, "mongoitems.name": req.params.name },
        { $push: { "mongoitems.$.playlist": newPlaylist } },
        { new: true }
    );   
    if(!user) return res.status(404).send("The user with the given ID was not found.");
    res.status(200).send({data:user,message:"User updated successfully"});
});


//Rimuovi object da playlist in mongoitems
router.delete('/mongoitems/:id/:name/', [validObjectId], async (req,res) => {
    // Extract the new playlist object from the request body
    const newPlaylist = req.body;

    // Use the findByIdAndUpdate method to update the user's mongoitems field
    // by pushing the new playlist object
    const user
    = await User.findOneAndUpdate(
        { _id: req.params.id, "mongoitems.name": req.params.name },
        { $pull: { "mongoitems.$.playlist": newPlaylist } },
        { new: true }
    );
    if(!user) return res.status(404).send("The user with the given ID was not found.");
    res.status(200).send({data:user,message:"User updated successfully"});
});


//Rimuovi playlist da mongoitems
router.delete('/del/mongoitems/:id/:name', [validObjectId], async (req,res) => {
    // Extract the new playlist object from the request body
    const newPlaylist = req.body;

    // Use the findByIdAndUpdate method to update the user's mongoitems field
    // by pushing the new playlist object
    const user
    = await User.findOneAndUpdate(
        { _id: req.params.id, "mongoitems.name": req.params.name },
        { $pull: { "mongoitems": {name:req.params.name} } },
        { new: true }
    );
    if(!user) return res.status(404).send("The user with the given ID was not found.");
    res.status(200).send({data:user,message:"User updated successfully"});
});




//aggiorna tutta l'utente
router.post('/update/:id', [validObjectId], async (req,res) => {
    
    const user = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req
        .body },
        { new: true }
    );
    if(!user) return res.status(404).send("The user with the given ID was not found.");
    res.status(200).send({data:user,message:"User updated successfully"});
});







//Ritorna tutti gli utenti
router.get('/', admin, async (req,res) => {
    const users = await User.find().select('-password -__v');
    res.status(200).send({data:users,message:"Users retrieved successfully"});
});

//Ritorna tutti gli utenti per email
router.get('/email/:email', async (req,res) => {
    const users = await User.find({email:req.params.email}).select('-password -__v');
    res.status(200).send({data:users,message:"Users retrieved successfully"});
});


//Modifica utente
router.put('/:id', [validObjectId, auth] , async (req,res) => {
    const user
    = await User.findByIdAndUpdate(
        req.params.id,
		{ $set: req.body },
		{ new: true }
    ).select('-password -__v');
    if(!user) return res.status(404).send('User not found');
    res.status(200).send({data:user,message:"User updated successfully"});        
    });

    //Elimina utente
    router.delete('/:id', [validObjectId, auth], async (req,res) => {
        await User.findByIdAndRemove(req.params.id);
        res.status(200).send({data:null,message:"User deleted successfully"});
    });

module.exports = router;
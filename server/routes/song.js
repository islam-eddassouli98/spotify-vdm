const router = require('express').Router();
const { User } = require('../models/user');
const { Song , validate } = require('../models/song');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validObjectId = require('../middleware/validObjectId');

//Creazione nuova canzone
router.post("/", admin, async (req, res) => {
	const { error } = validate(req.body);
	if (error) res.status(400).send({ message: error.details[0].message });
	const song = await Song(req.body).save();
	res.status(201).send({ data: song, message: "Song created successfully" });
});
//Ritorna tutte le canzoni
router.get('/', async (req,res) => {
    const songs = await Song.find().select();
    res.status(200).send({data:songs,message:"Songs retrieved successfully"});
})

//Aggiorna canzone
router.put('/:id', [validObjectId, auth], async (req,res) => {
    const song = await Song.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
    ).select();
    if(!song) return res.status(404).send('Song not found');
    res.status(200).send({data:song,message:"Song updated successfully"});
});

//Elimina canzone
router.delete('/:id', [validObjectId, admin], async (req,res) => {
    await Song.findByIdAndRemove(req.params.id);
    res.status(200).send({data:null,message:"Song deleted successfully"});
});

//like canzone

router.put("/like/:id", [validObjectId, auth], async (req, res) => {
    const song = await Song.findById(req.params.id);
    if(!song) return res.status(404).send("Song not found");
    const user
    = await User.findById(req.user._id);
    const index = user.likedSongs.indexOf(song._id);
    if(index == -1) {
        user.likedSongs.push(song._id);
        resMessage = "Song liked successfully";
    }else{
        user.likedSongs.splice(index,1);
        resMessage="Removed like from song";
    }
    await user.save();
    res.status(200).send({data:user,message:resMessage});
});

//Ritorna tutti i like delle canzoni

router.get("/like", auth, async (req, res) => {
    const user = await User.findById(req.user._id).populate("likedSongs");
    const songs = await Song.find({_id: {$in: user.likedSongs}});
    res.status(200).send({data:songs,message:"Liked songs retrieved successfully"});
});

module.exports = router;
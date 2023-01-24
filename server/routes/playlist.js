const router = require('express').Router();
const {Playlist, validate} = require('../models/playlist');
const {Song} = require('../models/song');
const {User} = require('../models/user');
const auth = require('../middleware/auth');
const validObjectId = require('../middleware/validObjectId');
const Joi = require('joi');



//Creazione nuova playlist
router.post("/", auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) res.status(400).send({ message: error.details[0].message });
    const user = await User.findById(req.user._id);
    const playlist = await Playlist({...req.body,user:user._id}).save();
    user.playlists.push(playlist._id);
    await user.save();
    res.status(201).send({ data: playlist, message: "Playlist created successfully" });
});


//Aggiorna playlist
router.put('/edit/:id', [validObjectId, auth], async (req,res) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        desc: Joi.string().allow(""),
        img: Joi.string().allow(""),
    });
    const { error } = schema.validate(req.body);
    if (error) res.status(400).send({ message: error.details[0].message });
    const playlist = await Playlist.findById(req.params.id);
    if(!playlist) return res.status(404).send('Playlist not found');
    if(playlist.user != req.user._id) return res.status(403).send("You don't have permission to edit this playlist");
    playlist.name = req.body.name;
    playlist.desc = req.body.desc;
    playlist.img = req.body.img;
    await playlist.save();
    res.status(200).send({data:playlist,message:"Playlist updated successfully"});
});


//Add song to playlist
router.put("/add-song", auth, async (req, res) => {
	const schema = Joi.object({
		playlistId: Joi.string().required(),
		songId: Joi.string().required(),
	});
	const { error } = schema.validate(req.body);
	if (error) return res.status(400).send({ message: error.details[0].message });

	const user = await User.findById(req.user._id);
	const playlist = await Playlist.findById(req.body.playlistId);
	if (!user._id.equals(playlist.user))
		return res.status(403).send({ message: "User don't have access to add!" });

	if (playlist.songs.indexOf(req.body.songId) === -1) {
		playlist.songs.push(req.body.songId);
	}
	await playlist.save();
	res.status(200).send({ data: playlist, message: "Added to playlist" });
});

//Remove song from playlist
router.put("/remove-song", auth, async (req, res) => {
	const schema = Joi.object({
		playlistId: Joi.string().required(),
		songId: Joi.string().required(),
	});
	const { error } = schema.validate(req.body);
	if (error) return res.status(400).send({ message: error.details[0].message });

	const user = await User.findById(req.user._id);
	const playlist = await Playlist.findById(req.body.playlistId);
	if (!user._id.equals(playlist.user))
		return res
			.status(403)
			.send({ message: "User don't have access to Remove!" });

	const index = playlist.songs.indexOf(req.body.songId);
	playlist.songs.splice(index, 1);
	await playlist.save();
	res.status(200).send({ data: playlist, message: "Removed from playlist" });
});


//Prendi playlist random
router.get("/random", async (req, res) => {
    const playlists = await Playlist.aggregate([{ $sample: { size: 10 } }]);
    res.status(200).send({ data: playlists, message: "Random playlists" });
});

//Trovare playlist by id
router.get("/:id", [validObjectId,auth], async (req, res) => {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).send("Playlist not found");
    res.status(200).send({ data: playlist, message: "Playlist found" });

    const songs = await Song.find({_id:{$in:playlist.songs}});
    res.status(200).send({ data: songs, message: "Songs found" });
});

//Trovare playlist by user
router.get("/user/:id", validObjectId, async (req, res) => {
    const playlists = await Playlist.find({user:req.params.id});
    if (!playlists) return res.status(404).send("Playlist not found");
    res.status(200).send({ data: playlists, message: "Playlist found" });
});

//Trovare tutte le playlist
router.get("/", async (req, res) => {
    const playlists = await Playlist.find();
    res.status(200).send({ data: playlists, message: "All playlists" });
});

//delete playlist by id 
router.delete("/:id", [validObjectId, auth], async (req, res) => {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).send("Playlist not found");
    if(playlist.user != req.user._id) return res.status(403).send("You don't have permission to delete this playlist");
    await playlist.remove();
    res.status(200).send({ data: playlist, message: "Playlist deleted" });
    const index = user.playlists.indexOf(playlist._id);
    user.platlists.splice(index,1);
    await user.save();
    await playlist.remove();
    res.status(200).send({ data: playlist, message: "Playlist deleted" });
});






module.exports = router;

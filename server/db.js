const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

module.exports = async () => {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology:true
    }
    try{
        await mongoose.connect(process.env.MONGO_URI,connectionParams);
        console.log('Connected to database');
    }catch(err){
        console.error(`Error connecting to the database. \n${err}`);
    }

    }
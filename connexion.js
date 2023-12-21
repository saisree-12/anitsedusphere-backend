const mongoose = require('mongoose')

require('dotenv').config()

const url = `${process.env.MONGO_URL}`
const connexion = mongoose.connect(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("MONGODB CONNEXION ESTABLISHED");
})

module.exports = connexion
const mongoose = require('mongoose')

const dbConfig = async function() {
    try {
        await mongoose.connect(process.env.dbUrl)
        console.log("mongo connected")
    }
    catch (err) {
        console.log(err, "error connecting to atlas")
    }
}

module.exports = dbConfig

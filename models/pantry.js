const mongoose = require("mongoose")

const pantrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    Inventory: [new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    })]

})

module.exports = mongoose.model("Pantry", pantrySchema)

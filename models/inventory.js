const mongoose = require("mongoose")

const inventorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model("Inventory", inventorySchema)
module.exports.schema = inventorySchema
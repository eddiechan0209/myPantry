const express = require("express")
const router = express.Router()
const Inventory = require("../models/inventory")

// Get all
router.get("/", async (req,res) =>{
    try{
        const inventories = await Inventory.find()
        res.json(inventories)
    } catch(err){
        res.status(500).json({messsage: err.message})
    }
})

// Get one
router.get("/:id", getInventory, (req,res) => {
    res.send(res.inventory.name)
})
// Create one
router.post("/", async (req, res) => {
    const inventory = new Inventory({
        id: req.body.id,
        name: req.body.name,
        amount: req.body.amount
    })
    try{
        const newInventory = await inventory.save()
        res.status(201).json(newInventory)
    } catch(err){
        res.status(400).json({message: err.message})
    }

})
// Update One
router.patch("/", (req, res) => {

})
// Delete One
router.delete("/:id", (req, res) => {
})

async function getInventory(req, res, next){
    let inventory
    try{
        inventory = await Inventory.findById(req.params.id)
        if(inventory == null){
            return res.status(404).json({message: "Cannot find inventory."})
        }
    } catch(err){
        return res.status(500).json({message: err.message})
    }

    res.inventory = inventory
    next()
}

module.exports = router
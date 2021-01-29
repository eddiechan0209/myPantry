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
    res.json(res.inventory)
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
router.patch("/:id", getInventory, async (req, res) => {
    if(req.body.name != null) {
        res.inventory.name = req.body.name
    }
    if(req.body.amount != null) {
        res.inventory.amount = req.body.amount
    }
    try{
        const updatedInventory = await res.inventory.save()
        res.json(updatedInventory)
    } catch (err){
        res.status(400).json({message: err.message})
    }
})
// Delete One
router.delete("/:id", getInventory, async (req, res) => {
    try{
        await res.inventory.remove()
        res.json({message: "Deleted inventory"})
    } catch(err){
        res.status(500).json({message: err.nessage})
    }
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
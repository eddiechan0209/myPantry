const express = require("express")
const router = express.Router()
const Pantry = require("../models/pantry")

// Get all
router.get("/", async (req, res) => {
    try {
        const pantries = await Pantry.find()
        res.json(pantries)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Get one
router.get("/:id", getPantry, (req, res) => {
    res.json(res.inventory)
})

// Create one
router.post("/", async (req, res) => {
    const pantry = new Pantry({
        id: req.body.id,
        name: req.body.name,
        address: req.body.address,
        inventory: req.body.inventory

    })

    console.log(req.body.inventory)
    try {
        const newPantry = await pantry.save()
        res.status(201).json(newPantry)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }

})
// Update One
router.patch("/:id", getPantry, async (req, res) => {
    if (req.body.name != null) {
        res.pantry.name = req.body.name
    }
    if (req.body.address != null) {
        res.pantry.address = req.body.address
    }
    if (req.body.inventory != null){
        res.pantry.inventory = req.body.inventory
    }
    try {
        const updatedInventory = await res.pantry.save()
        res.json(updatedInventory)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Delete One
router.delete("/:id", getPantry, async (req, res) => {
    try {
        await res.pantry.remove()
        res.json({ message: "Deleted Pantry: " + req.id })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getPantry(req, res, next) {
    let pantry
    try {
        pantry = await Pantry.findById(req.params.id)
        if (pantry == null) {
            return res.status(404).json({ message: "Cannot find pantry." })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.pantry = pantry
    next()
}

module.exports = router
const express = require('express');
const router = express.Router();
const Pantry = require('../models/pantry');

// Get all
router.get('/', async (req, res) => {
	console.log('in get all');
	try {
		const pantries = await Pantry.find();
		res.json(pantries);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Get one
router.get('/:id', getPantry, (req, res) => {
	console.log('in get one');
	res.send(res.pantry);
});

// Create one
router.post('/', async (req, res) => {
	console.log('in create one');
	const pantry = new Pantry({
		name: req.body.name,
		address: req.body.address,
		inventory: req.body.inventory,
		// inventory: [
		// 	{ name: req.body.inventory.name, quantity: req.body.inventory.quantity },
		// ],
	});
	// console.log(pantry);
	try {
		const newPantry = await pantry.save();
		res.status(201).json(newPantry);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

// Update one item in inventory
function updateOneItem(pantry, item) {
	const { itemID, name, quantity } = item;
	let itemIndex = pantry.inventory.findIndex((p) => p.itemID == itemID);
	if (itemIndex > -1) {
		//item exists in the inventory, update the quantity
		let newItem = pantry.inventory[itemIndex];
		newItem.quantity = quantity;
		pantry.inventory[itemIndex] = newItem;
	} else {
		//item does not exists in inventory, add new item
		pantry.inventory.push({ itemID, name, quantity });
	}
}

// Update One
router.patch('/:id', getPantry, async (req, res) => {
	console.log('in update one');
	// console.log(typeof res);
	if (req.body.name != null) {
		res.pantry.name = req.body.name;
	}
	if (req.body.address != null) {
		res.pantry.address = req.body.address;
	}
	if (req.body.inventory != null) {
		req.body.inventory.forEach((item) => {
			console.log(item);
			updateOneItem(res.pantry, item);
		});
	}
	try {
		const updatedInventory = await res.pantry.save();
		res.json(updatedInventory);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

// Delete One
router.delete('/:id', getPantry, async (req, res) => {
	console.log('in delete one');
	try {
		await res.pantry.remove();
		res.json({ message: 'Deleted Pantry: ' + req.id });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// middleware to get the pantry (all functions with /:id as param)
async function getPantry(req, res, next) {
	let pantry;
	try {
		pantry = await Pantry.findById(req.params.id);
		if (pantry == null) {
			return res.status(404).json({ message: 'Cannot find pantry.' });
		}
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}

	res.pantry = pantry;
	// successfully completed getPantry, continue on the rest of software
	next();
}

module.exports = router;

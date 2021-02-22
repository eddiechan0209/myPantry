const mongoose = require('mongoose');

const pantrySchema = new mongoose.Schema(
	{
		name: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		address: {
			type: String,
			required: true,
		},
		active: {
			type: Boolean,
			default: true,
		},
		modifiedOn: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true }
);

const inventorySchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Pantry',
		},
		products: [
			{
				productId: Number,
				quantity: Number,
				name: String,
				price: Number,
			},
		],
		active: {
			type: Boolean,
			default: true,
		},
		modifiedOn: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Inventory', inventorySchema);
module.exports.schema = inventorySchema;

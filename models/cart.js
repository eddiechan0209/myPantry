const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		address: {
			type: String,
			required: true,
		},
		pickupTime: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
			required: true,
		},
		inventory: [
			{
				itemID: {
					type: Number,
					required: true,
				},
				name: {
					type: String,
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
				},
				modifiedOn: {
					type: Date,
					default: Date.now,
				},
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);

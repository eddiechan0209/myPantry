const mongoose = require('mongoose');

const pantrySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		address: {
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
		orders: [
			{
				name: {
					type: String, 
					required: true,
				},
				orderInventory: [
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
			}
		]
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Pantry', pantrySchema);

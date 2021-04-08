import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Button,
	TextInput,
	Modal,
	Alert,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import firebase from 'firebase';
import env from '../ip.json';

const SERVER_URL = 'http:/' + env.myIP + ':3000/';

class PantryDashboardScreen extends Component {
	state = {
		// exclusive to pantries
		pantryKey: null,
		pantryDic: null,
		pantryID: null,
		pantryName: null,
		pantryInfo: {},
		modalPantryEditInventory: false,

		// exclusive to consumers
		cartID: '',
		cartInfo: {},
		cartInventory: [],
		userName: null,
		modalConsumerAddItem: false,
		modalConsumerViewCart: false,

		// used by both to edit inventory/cart
		itemID: null,
		itemName: null,
		itemQuantity: null,
	};

	componentDidMount = () => {
		// Getting dictionary and key properties from what was given in last page
		// Dic is a dictionary with keys and pantry objects
		// Using key to get the pantry that we are currently looking at
		const dic = this.props.navigation.getParam('pantryDic', null);
		const key = this.props.navigation.getParam('pantryKey', null);

		// Setting the state to the values that we just got
		this.setState(
			{
				pantryKey: key,
				pantryDic: dic,
				pantryID: dic[key].pantryID,
				pantryName: dic[key].pantryName,
			},
			() => {
				this.getPantryInventory();
			}
		);

		const currUser = firebase.auth().currentUser;
		// Accessing firebase database using uid (user id) to get id of the cart and
		// if a cart is found then setting the state property of
		// 	cartID to the value we found in the firebase directory
		firebase
			.database()
			.ref('/consumer')
			.once('value')
			.then((snapshot) => {
				// check every consumer uid with currentUser uid
				for (const uid in snapshot.val()) {
					if (uid === currUser.uid) {
						this.setState({
							cartID: snapshot.val()[uid].cartID,
							userName:
								snapshot.val()[uid].first_name +
								' ' +
								snapshot.val()[uid].last_name,
						});
					}
				}
			});
	};

	// ----------------------------- PANTRY FUNCTIONS -----------------------------
	// updates state's pantryInfo (and therefore display)
	getPantryInventory = async () => {
		// Sending request by building the url
		// The request is handled in pantry route file
		return fetch(SERVER_URL + 'pantries/' + this.state.pantryID)
			.then((response) => {
				if (response.status >= 200 || response.status <= 299) {
					return response.json();
				} else {
					console.log(
						'error in getPantryInventory() statuscode: ' + response.status
					);
				}
			})
			.then((responseJson) => {
				// Setting the property of pantry info to the response
				this.setState(
					{
						pantryInfo: responseJson,
					},
					() => this.forceUpdate()
				);
			})
			.catch((error) => {
				console.error(error);
				console.error('error in getPantryInventory()');
			});
	};

	// update's pantry's inventory
	updateInventory = async () => {
		// Creating an an entry that will have the new item and item quantity
		const patchEntry = {
			method: 'PATCH',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				inventory: [
					{
						itemID: this.state.itemID,
						name: this.state.itemName,
						quantity: parseInt(this.state.itemQuantity),
					},
				],
			}),
		};

		// Using the entry that we just created to send a request
		return fetch(SERVER_URL + 'pantries/' + this.state.pantryID, patchEntry)
			.then((response) => {
				if (response.status >= 200 && response.status <= 299) {
					return response.json();
				} else {
					console.log('error in UPDATE. statuscode: ' + response.status);
				}
			})
			.then((responseJson) => {
				// Running get pantry inventory so that the pantry is updated with
				// the new item in the request that sent
				this.getPantryInventory();
				// Setting the item properties in state to null as the item has been
				// updated so we want the values to reset
				this.setState({
					itemID: null,
					itemName: null,
					itemQuantity: null,
					modalPantryEditInventory: false,
				});
			})
			.catch((error) => {
				console.error(error);
				console.error('error in updateInventory()');
			});
	};
	// ----------------------------- END OF PANTRY FUNCTIONS -----------------------------

	// ----------------------------- CONSUMER FUNCTIONS -----------------------------
	// update's state's cartInfo (and therefore display)
	getCart = async () => {
		// Making a request using the state cartID that will get the cart info as a response
		return fetch(SERVER_URL + 'cart/' + this.state.cartID)
			.then((response) => {
				// Returning the response if no errors or else printing error message
				if (response.status >= 200 || response.status <= 299) {
					return response.json();
				} else {
					console.log('error in getCart(). Statuscode: ' + response.status);
				}
			})
			.then((responseJson) => {
				// Setting the state to the response
				this.setState(
					{
						cartInfo: responseJson,
					},
					() => this.forceUpdate()
				);
			})
			.catch((error) => {
				console.error(error);
				console.error('error in getCart()');
			});
	};

	// update's consumer's cart
	updateCart = async () => {
		// Setting a default name variable
		let name = 'Unknown';

		// Finding the name of the item that is being added to the cart
		this.state.pantryInfo.inventory.forEach((item) => {
			// State.itemID is the id of the item that the user is trying to add
			if (item.itemID == this.state.itemID) {
				name = item.name;
			}
		});

		// Creating a patch entry that will have the new inventory that the
		// 	cart should have
		const patchEntry = {
			method: 'PATCH',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				inventory: [
					{
						itemID: this.state.itemID,
						name: name,
						quantity: parseInt(this.state.itemQuantity),
					},
				],
			}),
		};

		// Making a request to the server using the new patch entry that we just created
		return fetch(SERVER_URL + 'cart/' + this.state.cartID, patchEntry)
			.then((response) => {
				if (response.status >= 200 && response.status <= 299) {
					// Returning response as json object if no errors
					return response.json();
				} else {
					// Printing error message if there was an error
					console.log('error in updateCart(). statuscode: ' + response.status);
				}
			})
			.then((responseJson) => {
				// Updating the pantry inventory and the cart to have the
				// 	new information after request was made and changes were made
				// 	to server
				this.getPantryInventory();
				this.getCart();

				// Resetting the state item properties
				this.setState({
					itemID: null,
					itemName: null,
					itemQuantity: null,
				});
			})
			.catch((error) => {
				console.error(error);
				console.error('error in updateCart()');
			});
	};

	// reduces Pantry inventory according to consumer's cart
	// consumer's cart becomes empty after order
	placeOrder = async () => {
		// Creating temporary empty arrays to store inventory and order info
		const inventoryUpdate = [];
		const orderUpdate = [];

		// Looping through the current cart inventory item by item
		this.state.cartInfo.inventory.forEach((item) => {
			let quantity = 0;

			// We have the cart item quantity, but need the pantry item quantity
			// We can improve this later by adjusting our model

			// Updating the temporary arrays orderUpdate and inventoryUpdate to have
			// 	the new items with the correct quantities
			this.state.pantryInfo.inventory.forEach((item2) => {
				if (item.itemID == item2.itemID) {
					// When item is found in pantry inventory we need to remove
					// 	the quantity that was in the order
					quantity = item2.quantity - item.quantity;
					inventoryUpdate.push({
						itemID: item2.itemID,
						name: item2.itemName,
						quantity: quantity,
					});

					orderUpdate.push({
						itemID: item2.itemID,
						name: item2.name,
						quantity: item.quantity,
					});
				}
			});
		});

		// console.log('inventoryUpdate: ' + JSON.stringify(inventoryUpdate));

		// Creating a patch entry that has the information for the new order and
		// 	the inventory
		const patchEntry = {
			method: 'PATCH',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				inventory: inventoryUpdate,
				order: {
					name: this.state.userName,
					orderInventory: orderUpdate,
				},
			}),
		};

		// Sending the request with the new patchEntry we created
		return fetch(SERVER_URL + 'pantries/' + this.state.pantryID, patchEntry)
			.then((response) => {
				if (response.status >= 200 && response.status <= 299) {
					return response.json();
				} else {
					console.log('error in placeOrder(). statusCode: ' + response.status);
				}
			})
			.then((responseJson) => {
				// Updating the pantry information and the cart information
				this.getPantryInventory();
				this.getCart();

				// Clearing what was currently in the cart
				this.clearCart();

				// Resetting state item properties
				this.setState({
					itemID: null,
					itemName: null,
					itemQuantity: null,
				});
				this.forceUpdate();
			})
			.catch((error) => {
				console.error(error);
				console.error('error in placeOrder()');
			});
	};

	// Clears consumer cart
	clearCart = async () => {
		// Creating a new patch entry that has an empty inventory
		const patchEntry = {
			method: 'PATCH',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				inventory: [],
			}),
		};

		// Making the request with new patch entry
		return fetch(
			SERVER_URL + 'cart/' + this.state.cartID + '/clear',
			patchEntry
		)
			.then((response) => {
				// After request then we update the cart to have the new server information
				this.updateCart();
			})
			.catch((error) => {
				console.error(error);
				console.error('error in clearCart()');
			});
	};

	// Shows back button for consumers (pantries don't need this)
	// clears cart upon leaving
	goBack = () => {
		if (this.state.cartID) {
			return (
				<View style={styles.backPage}>
					<AntDesign
						name='left'
						size={24}
						color='black'
						position='absolute'
						onPress={() => this.backAlert()}
					/>
				</View>
			);
		}
	};

	backAlert = () => {
		{
			Alert.alert(
				'Warning',
				'Navigating to the Dashboard will clear your cart',
				[
					{
						text: 'OK',
						onPress: () => {
							this.clearCart();
							this.props.navigation.navigate('DashboardScreen');
						},
					},
					{ text: 'Cancel', onPress: () => console.log('CANCEL Pressed') },
				]
			);
		}
	};

	// ----------------------------- END OF CONSUMER FUNCTIONS -----------------------------

	// We have four modals:
	// 1) Pantry: edit inventory
	// 2) Consumer: add items to cart and place an order
	// 3) Consumer: cart view and item removal
	toggleModalVisibility = (num) => {
		if (num == 1) {
			this.setState((prevState) => ({
				modalPantryEditInventory: !prevState.modalPantryEditInventory,
			}));
		} else if (num == 2) {
			this.setState((prevState) => ({
				modalConsumerAddItem: !prevState.modalConsumerAddItem,
			}));
		} else {
			this.setState((prevState) => ({
				modalConsumerViewCart: !prevState.modalConsumerViewCart,
			}));
		}
	};

	// controls pantry view or consumer view
	footer = () => {
		// user on page is consumer
		if (this.state.cartID) {
			return (
				<View style={styles.footerButtons}>
					<Button
						title='Add Item'
						onPress={() => this.toggleModalVisibility(2)}
					/>
					<Button
						title='View Cart'
						onPress={() => this.toggleModalVisibility(3)}
					/>
					<Button
						title='Place Order'
						onPress={() => {
							this.getCart();
							if (
								this.state.cartInfo.inventory == null ||
								this.state.cartInfo.inventory.length == 0
							) {
								this.createError(
									'Cart Empty: Add Items before placing orders. '
								);
							} else {
								this.placeOrder();
								Alert.alert('Order Placed', '', [
									{ text: 'OK', onPress: () => console.log('Order Placed') },
								]);
							}
						}}
					/>
				</View>
			);
		}
		// user is a pantry
		else {
			return (
				<View style={styles.footerButtons}>
					<Button
						title='Edit Inventory'
						onPress={() => this.toggleModalVisibility(1)}
					/>
					<Button
						title='View Orders'
						onPress={() => {
							this.getPantryInventory();
							this.props.navigation.navigate('PantryOrderScreen', {
								pantryInfo: this.state.pantryInfo,
								pantryDic: this.state.pantryDic,
								pantryKey: this.state.pantryKey,
							});
						}}
					/>
					<Button title='Sign Out' onPress={() => firebase.auth().signOut()} />
				</View>
			);
		}
	};

	createError(errorString) {
		Alert.alert('Error', errorString, [
			{ text: 'OK', onPress: () => console.log('OK Pressed') },
		]);
	}

	render() {
		return (
			<View style={styles.container}>
				<Modal
					animationType='slide'
					transparent={true}
					visible={this.state.modalPantryEditInventory}
					onRequestClose={() => {
						Alert.alert('Modal has been closed.');
					}}
				>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<View style={styles.back}>
								<AntDesign
									name='left'
									size={24}
									color='black'
									position='absolute'
									onPress={() => {
										this.toggleModalVisibility(1);
										this.forceUpdate();
									}}
								/>
							</View>
							<TextInput
								value={this.state.itemID}
								onChangeText={(itemID) => this.setState({ itemID })}
								placeholder={'Item ID'}
								style={styles.input}
							/>
							<TextInput
								value={this.state.itemName}
								onChangeText={(itemName) => this.setState({ itemName })}
								placeholder={'Item Name'}
								style={styles.input}
							/>
							<TextInput
								value={this.state.itemQuantity}
								onChangeText={(itemQuantity) => this.setState({ itemQuantity })}
								placeholder={'Item Quantity'}
								style={styles.input}
							/>

							<Button
								title='Update'
								onPress={() => {
									if (this.state.itemID < 0 || this.state.itemID == null) {
										this.createError('Invalid ItemID');
									} else if (
										this.state.itemQuantity <= 0 ||
										this.state.itemQuantity == null
									) {
										this.createError('Invalid Quantity');
									} else {
										// Updating if passed error checks
										this.updateInventory();
									}
								}}
							/>
						</View>
					</View>
				</Modal>

				<Modal
					animationType='slide'
					transparent={true}
					visible={this.state.modalConsumerAddItem}
					onRequestClose={() => {
						Alert.alert('Modal has been closed.');
					}}
				>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<View style={styles.back}>
								<AntDesign
									name='left'
									size={24}
									color='black'
									position='absolute'
									onPress={() => {
										this.toggleModalVisibility(2);
									}}
								/>
							</View>
							<TextInput
								value={this.state.itemID}
								onChangeText={(itemID) => this.setState({ itemID })}
								placeholder={'Item ID'}
								style={styles.input}
							/>
							<TextInput
								value={this.state.itemQuantity}
								onChangeText={(itemQuantity) => this.setState({ itemQuantity })}
								placeholder={'Amount'}
								style={styles.input}
							/>

							<Button
								title='Add'
								onPress={() => {
									// Looking in the pantry inventory for the given itemID
									var inventoryItem = this.state.pantryInfo.inventory.find(
										({ itemID }) => itemID == this.state.itemID
									);

									// Creating cart item quantity that will represent the cart quantity
									var cartItemQuantity = this.state.itemQuantity;

									// Adding to the cart item quantity variable if the item already exists in the cart

									// Getting current cart values so state has them store
									this.getCart();

									if (
										this.state.cartInfo.inventory != null &&
										this.state.cartInfo.inventory.find(
											({ itemID }) => itemID == this.state.itemID
										) != null
									) {
										// Have to use subtract or else will do string concat if we use +
										cartItemQuantity -= -this.state.cartInfo.inventory.find(
											({ itemID }) => itemID == this.state.itemID
										).quantity;
									}

									if (inventoryItem == null) {
										this.createError('Invalid ItemID');
									} else if (this.state.itemQuantity <= 0) {
										this.createError('Invalid Quantity');
									} else if (inventoryItem.quantity < cartItemQuantity) {
										this.createError('Requested Quantity too large');
									} else {
										// Updating if passed error checks
										this.updateCart();
										Alert.alert(inventoryItem.name + ' added to cart', '', [
											{
												text: 'OK',
												onPress: () => console.log('added to cart Placed'),
											},
										]);
									}
								}}
							/>
						</View>
					</View>
				</Modal>

				<Modal
					animationType='slide'
					transparent={true}
					visible={this.state.modalConsumerViewCart}
					onRequestClose={() => {
						Alert.alert('Modal has been closed.');
					}}
				>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<View style={styles.back}>
								<AntDesign
									name='left'
									size={24}
									color='black'
									position='absolute'
									onPress={() => {
										this.toggleModalVisibility(3);
									}}
								/>
							</View>
							<View>
								<Text>Cart: </Text>
							</View>
							<View style={styles.boxes}>
								{this.state.cartInfo === {} ? (
									<Text>Getting cart...</Text>
								) : this.state.cartInfo.inventory === (null || undefined) ? (
									<Text></Text>
								) : (
									Object.values(this.state.cartInfo.inventory).map(
										(json, i) => {
											return (
												<View style={styles.box} key={i}>
													<View style={styles.inner}>
														<Text>
															{'\n'}
															{json.name}
															{', '}
															{json.quantity}
															{/* Replace X with an image when possible */}
														</Text>
														<Button
															title='   X  '
															onPress={() => {
																this.state.itemName = json.name;
																this.state.itemQuantity = -json.quantity;
																this.state.itemID = json.itemID;
																this.updateCart();
															}}
														/>
													</View>
												</View>
											);
										}
									)
								)}
							</View>
						</View>
					</View>
				</Modal>

				<View style={styles.header}>
					{this.goBack()}

					<View style={styles.title}>
						<Text style={styles.titleText}>{this.state.pantryName}</Text>
					</View>
				</View>

				<View style={styles.boxes}>
					{this.state.pantryInfo === {} ? (
						<Text></Text>
					) : this.state.pantryInfo.inventory === (null || undefined) ? (
						<Text>Error: Inventory doesn't exist</Text>
					) : (
						Object.values(this.state.pantryInfo.inventory).map((json, i) => {
							return (
								<View style={styles.box} key={i}>
									<View style={styles.inner}>
										<View>
											<Text key={json.itemID}>id: {json.itemID}</Text>
										</View>
										<Text>
											{'\n'}
											{json.name}
											{': '}
											{json.quantity}
										</Text>
									</View>
								</View>
							);
						})
					)}
				</View>

				<View style={styles.footer}>{this.footer()}</View>
			</View>
		);
	}
}
export default PantryDashboardScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		width: '100%',
		height: '15%',
		justifyContent: 'center',
		textAlign: 'center',
		alignItems: 'center',
	},
	boxes: {
		width: '100%',
		height: '75%',
		// padding: 5,
		flexDirection: 'row',
		flexWrap: 'wrap',
		// backgroundColor: '#eee',
	},
	box: {
		width: '33%',
		height: '33%',
		padding: 5,
		// backgroundColor: 'orange',
		alignItems: 'center',
		justifyContent: 'center',
	},
	inner: {
		// backgroundColor: 'gray',
		alignItems: 'center',
		justifyContent: 'center',
	},
	footer: {
		width: '100%',
		height: '10%',
		bottom: 20,
	},
	footerButtons: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	errorText: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center',
	},
	backPage: {
		...StyleSheet.absoluteFillObject,
		alignSelf: 'flex-end',
		marginTop: 50,
		marginLeft: 20,
		// position: 'absolute',
	},
	title: {
		marginTop: 30,
	},
	titleText: {
		fontSize: 30,
	},
	back: {
		...StyleSheet.absoluteFillObject,
		alignSelf: 'flex-end',
		marginTop: 10,
		marginLeft: 5,
	},
	modal: {
		position: 'absolute',
		top: '50%',
		left: '50%',
	},
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22,
	},
	modalView: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
});

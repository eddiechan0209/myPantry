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
const SERVER_URL = 'http:/10.0.0.85:3000/';
const Pantry = require('../models/pantry');
import firebase from 'firebase';
import showMessage from 'react-native-flash-message';

class PantryDashboardScreen extends Component {
	state = {
		pantryKey: null,
		pantryDic: null,
		pantryID: null, //formerly dbID
		pantryName: null,
		pantryAddress: null,
		pantryNumber: null,
		pantryEmail: null,
		pantryInfo: {},
		inventoryString: '',
		modal1Visible: false,
		modal2Visible: false,
		modal3Visible: false,
		modal4Visible: false,
		itemID: null,
		itemName: null,
		itemQuantity: null,
		cartID: '',
		cartInfo: {},
		cartInventory: [],
		userName: null,
	};

	// updates state's pantryInfo and inventory
	getEntry = async () => {
		console.log('id: ' + this.state.pantryID);
		console.log(SERVER_URL + 'pantries/' + this.state.pantryID);
		return fetch(SERVER_URL + 'pantries/' + this.state.pantryID)
			.then((response) => {
				if (response.status >= 200 || response.status <= 299) {
					// console.log('Working');
					return response.json();
				} else {
					console.log('error in GET. statuscode: ' + response.status);
				}
			})
			.then((responseJson) => {
				console.log('reponse :' + JSON.stringify(responseJson));

				this.state.pantryInfo = responseJson;
				// console.log(JSON.stringify(this.state.pantryInfo));
				this.state.pantryInfo.inventory.forEach((item) => {
					this.state.inventory.push(item);
				});

				// console.log(
				// 	'Inventory info: ' +
				// 		JSON.stringify(this.state.pantryInfo.inventory)
				// );
				this.forceUpdate();
				//console.log(responseJson);
			})
			.catch((error) => {
				console.error(error);
				console.error('^ is the error, in GET');
			});
	};

	// update's state's cartInfo
	getCart = async () => {
		return fetch(SERVER_URL + 'cart/' + this.state.cartID)
			.then((response) => {
				if (response.status >= 200 || response.status <= 299) {
					// console.log('Working');
					return response.json();
				} else {
					console.log('error in getCart(). Statuscode: ' + response.status);
				}
			})
			.then((responseJson) => {
				console.log('cart inventory:' + JSON.stringify(responseJson.inventory));

				this.state.cartInfo = responseJson;

				// this.state.cartInfo.inventory.forEach((item) => {
				// 	this.state.cartInventory.push(item);
				// });

				this.forceUpdate();
				//console.log(responseJson);
			})
			.catch((error) => {
				console.error(error);
				console.error('^ is the error, in GET');
			});
	};

	// update's pantry's inventory
	updateInventory = async () => {
		console.log(
			'input: ' + this.state.itemName + ' ' + this.state.itemQuantity
		);
		console.log('pantryID: ' + this.state.pantryID);
		// Adding the values that were inputted to the existing inventory list
		// pantryEntry.inventory.push({
		// 	itemID: 6,
		// 	name: this.state.itemName,
		// 	quantity: parseInt(this.state.itemQuantity),
		// });

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

		console.log(patchEntry);

		return fetch(SERVER_URL + 'pantries/' + this.state.pantryID, patchEntry)
			.then((response) => {
				if (response.status >= 200 && response.status <= 299) {
					return response.json();
				} else {
					console.log('error in UPDATE. statuscode: ' + response.status);
				}

				// console.log(this.state);
			})
			.then((responseJson) => {
				// console.log('reponseJson :' + JSON.stringify(responseJson));
				this.getEntry();
				this.setState({
					itemID: null,
					itemName: null,
					itemQuantity: null,
					modal1Visible: false,
				});
			})
			.catch((error) => {
				console.error(error);
				console.error('^ is the error, in UPDATE');
			});
	};

	// update's consumer's cart
	updateCart = async () => {
		let name = 'Unknown';

		this.state.pantryInfo.inventory.forEach((item) => {
			if (item.itemID == this.state.itemID) {
				name = item.name;
			}
		});

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

		return fetch(SERVER_URL + 'cart/' + this.state.cartID, patchEntry)
			.then((response) => {
				if (response.status >= 200 && response.status <= 299) {
					return response.json();
				} else {
					console.log('error in updateCart(). statuscode: ' + response.status);
				}
			})
			.then((responseJson) => {
				// console.log('reponseJson :' + JSON.stringify(responseJson));
				console.log('why not getting getCart');
				this.getEntry();
				this.getCart();
				this.setState({
					itemID: null,
					itemName: null,
					itemQuantity: null,
				});
				console.log('why not getting getCart');
			})
			.catch((error) => {
				console.error(error);
				console.error('^ is the error, in updateCart()');
			});
	};

	componentDidMount = () => {
		console.log('---componentDidMount()---');
		const dic = this.props.navigation.getParam('pantryDic', null);
		const key = this.props.navigation.getParam('pantryKey', null);

		const currUser = firebase.auth().currentUser;
		firebase
			.database()
			.ref('/consumer')
			.once('value')
			.then((snapshot) => {
				for (const uid in snapshot.val()) {
					if (uid === currUser.uid) {
						this.setState({ 
							cartID: snapshot.val()[uid].cartID, 
							userName: snapshot.val()[uid].first_name + " " + snapshot.val()[uid].last_name,
						});
					}
				}
				console.log('cart ID: ' + this.state.cartID);
			});

		this.setState(
			{
				pantryKey: key,
				pantryDic: dic,
				pantryID: dic[key].pantryID, //formerly dbID
				pantryName: dic[key].pantryName,
				pantryAddress: dic[key].address,
				pantryNumber: dic[key].phone,
				pantryEmail: dic[key].email,
			},
			() => (
				// console.log(this.state),
				this.getEntry(), console.log('----------------------')
			)
		);

		this.state.inventory = [];

		// console.log('PantryInventoryScreen pantryID: ' + this.state.pantryID);
		// console.log('PantryInventoryScreen key: ' + this.state.pantryKey);
		// console.log('PantryInventoryScreen Dic: ' + this.state.pantryDic);
	};

	// We have two modals:
	// 1) Pantry view, where they can edit their inventory or sign out
	// 2) Consumer view, where they can edit their cart and place an order
	// 3) Cart View, allow users to view their cart
	// 4) Order View, allow pantries to view orders
	toggleModalVisibility = (num) => {
		if (num == 1) {
			this.setState((prevState) => ({
				modal1Visible: !prevState.modal1Visible,
			}));
		} else if (num == 2) {
			this.setState((prevState) => ({
				modal2Visible: !prevState.modal2Visible,
			}));
		} else if (num == 3) {
			this.setState((prevState) => ({
				modal3Visible: !prevState.modal3Visible,
			}));
		} else {
			this.setState((prevState) => ({
				modal4Visible: !prevState.modal4Visible,
			}));
		}
	};

	// controls pantry view or consumer view
	footer = () => {
		// user on page is consumer
		if (this.state.cartID) {
			return (
				<View
					style={{
						flex: 1,
						flexDirection: 'row',
						justifyContent: 'space-around',
					}}
				>
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
							if (this.state.cartInfo.inventory == null || 
								this.state.cartInfo.inventory.length == 0){
									this.createError("Cart Empty: Add Items before placing orders. ");
							}else {
								this.placeOrder();
								Alert.alert('Order Placed', '', [
									{ text: 'OK', onPress: () => console.log('Order Placed') },
								]);
							}
						}}
					/>
				</View>
			);
		} else {
			return (
				<View
				style={{
					flex: 1,
					flexDirection: 'row',
					justifyContent: 'space-around',
				}}
				>
					<Button
						title='Edit Inventory'
						onPress={() => this.toggleModalVisibility(1)}
					/>
					<Button
						title='View Orders'
						onPress={() => {
							this.getEntry()
							this.props.navigation.navigate('PantryOrderScreen', {
								pantryInfo: this.state.pantryInfo,
								pantryDic: this.state.pantryDic,
								pantryKey: this.state.pantryKey,
							});
							this.toggleModalVisibility(4);
						}}
					/>
					<Button title='Sign Out' onPress={() => firebase.auth().signOut()} />
				</View>
			);
		}
	};

	// reduces Pantry inventory according to consumer's cart
	// consumer's cart becomes empty after order
	placeOrder = async () => {
		const inventoryUpdate = [];
		const orderUpdate = [];

		this.state.cartInfo.inventory.forEach((item) => {
			let quantity = 0;

			// We have the cart item quantity, but need the pantry item quantity
			// We can improve this later by adjusting our model
			this.state.pantryInfo.inventory.forEach((item2) => {
				console.log('1: ' + item.itemID + ' 2: ' + item2.itemID);
				if (item.itemID == item2.itemID) {
					quantity = item2.quantity - item.quantity;
					console.log('quantity: ' + quantity);

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

		console.log('inventoryUpdate: ' + JSON.stringify(inventoryUpdate));

		const patchEntry = {
			method: 'PATCH',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				inventory: inventoryUpdate,
				order: {
					name: 'Name',
					orderInventory: orderUpdate,
				},
			}),
		};

		console.log(patchEntry);

		return fetch(SERVER_URL + 'pantries/' + this.state.pantryID, patchEntry)
			.then((response) => {
				if (response.status >= 200 && response.status <= 299) {
					return response.json();
				} else {
					console.log('error in placeOrder(). statusCode: ' + response.status);
				}
			})
			.then((responseJson) => {
				// console.log('reponseJson :' + JSON.stringify(responseJson));
				this.getEntry();
				this.getCart();
				this.clearCart();
				this.setState({
					itemID: null,
					itemName: null,
					itemQuantity: null,
				});
				console.log('why not getting getCart');
				this.forceUpdate();
			})
			.catch((error) => {
				console.error(error);
				console.error('^ is the error, in updateCart()');
			});
	};

	// Clears consumer cart
	clearCart = async () => {
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

		return (
			fetch(SERVER_URL + 'cart/' + this.state.cartID + '/clear', patchEntry)
				// .then((response) => {
				// 	if (response.status >= 200 && response.status <= 299) {
				// 		return response.json();
				// 	} else {
				// 		console.log('error in updateCart(). statuscode: ' + response.status);
				// 	}
				// })
				.then((something) => {
					this.updateCart();
				})
				.catch((error) => {
					console.error(error);
					console.error('^ is the error, in clearCart()');
				})
		);
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
					visible={this.state.modal1Visible}
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
										console.log('forceupdate?');
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

							<Button title='Update' onPress={() => this.updateInventory()} />
						</View>
					</View>
				</Modal>

				<Modal
					animationType='slide'
					transparent={true}
					visible={this.state.modal2Visible}
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

							{/* <View>
								<Text>Added {this.state.itemName} to Cart</Text>
							</View> */}

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
					visible={this.state.modal3Visible}
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
									<Text>Cart Empty</Text>
								) : (
									Object.values(this.state.cartInfo.inventory).map((json) => {
										return (
											<View style={styles.box}>
												<View style={styles.inner}>
													<Text key={json.name}>
														{'\n'}
														{json.name}
														{', '}
														{json.quantity}
														{/* Replace X with an image when possible */}
														<Button
															title='   X  '
															onPress={() => {
																this.state.itemName = json.name;
																this.state.itemQuantity = -json.quantity;
																this.state.itemID = json.itemID;
																this.updateCart();
															}}
														/>
													</Text>
												</View>
											</View>
										);
									})
								)}
							</View>
						</View>
					</View>
				</Modal>

				<Modal
					animationType='slide'
					transparent={true}
					visible={this.state.modal4Visible}
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
										this.toggleModalVisibility(4);
									}}
								/>
							</View>
							<View>
								<Text>Orders: </Text>
							</View>
							<View style={styles.boxes}>
								{this.state.pantryInfo === {} ? (
									<Text>Getting Orders...</Text>
								) : this.state.pantryInfo.orders === (null || undefined) ? (
									<Text>No Orders</Text>
								) : (
									Object.values(this.state.pantryInfo.orders).map((order) => {
										return (
											<View>
												<Text>{order.name};</Text>
												{Object.values(order.orderInventory).map((json) => {
													return (
														<View style={styles.box}>
															<View style={styles.inner}>
																<Text key={json.name}>
																	{'\n'}
																	{json.name}
																	{', '}
																	{json.quantity}
																	{/* Replace X with an image when possible */}
																</Text>
															</View>
														</View>
													);
												})}
											</View>
										);
									})
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
						<Text>Getting inventory...</Text>
					) : this.state.pantryInfo.inventory === (null || undefined) ? (
						<Text>Inventory doesn't exist</Text>
					) : (
						Object.values(this.state.pantryInfo.inventory).map((json) => {
							return (
								<View style={styles.box}>
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
		// backgroundColor: 'gray',
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
	// info: {
	// 	...StyleSheet.absoluteFillObject,
	// 	alignSelf: 'flex-end',
	// 	marginTop: 50,
	// 	marginLeft: 20,
	// 	// position: 'absolute',
	// },
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
		// position: 'absolute',
	},
	modal: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		// transform: translate(-50%, -50%);
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
	buttonText: {
		fontSize: 20,
		color: 'black',
		justifyContent: 'center',
		textAlign: 'center',
	},
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22,
	},
	openButton: {
		backgroundColor: '#F194FF',
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
	modalText: {
		marginBottom: 15,
		textAlign: 'center',
	},
	back: {
		...StyleSheet.absoluteFillObject,
		alignSelf: 'flex-end',
		marginTop: 10,
		marginLeft: 5,
		// position: 'absolute',
	},
});

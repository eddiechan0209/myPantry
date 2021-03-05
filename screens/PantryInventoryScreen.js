import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Button,
	FlatList,
	TextInput,
	ViewComponent,
	Modal,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
const SERVER_URL = 'http:/10.0.0.85:3000/';
const Pantry = require('../models/pantry');
const Cart = require('../models/cart');
import firebase from 'firebase';

class PantryInventoryScreen extends Component {
	state = {
		pantryKey: null,
		pantryDic: null,
		pantryID: null, //formerly dbID
		pantryName: null,
		pantryAddress: null,
		pantryNumber: null,
		pantryEmail: null,
		inventoryInfo: {},
		inventoryString: '',
		cartID: '', // Hardcoding for now until a cart is created with each user
		cartItem: null,
		cartQuantity: null,
		inventory: [],
		itemID: null,
		itemName: null,
		itemQuantity: null,
		modalVisible: false,
		cartInfo: {},
		cartInventory: [],

	};

	addToCart = async () => {
		console.log(
			'input: ' + this.state.itemName + ' ' + this.state.itemQuantity
		);

		// Adding the values for the item that the user wants to add
		const cartEntry = {
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
						quantity: this.state.itemQuantity,
					},
				],
			}),
		};

		// Running update and then updating the values

		// Possible error to check for could be if Pantry is trying to add to existing item
		// like if the pantry is trying to add more apples and not replace total with the given
		// number
		return fetch(SERVER_URL + 'cart/' + this.state.cartID, cartEntry)
			.then((response) => {
				if (response.status >= 200 && response.status <= 299) {
					return response.json();
				} else {
					console.log('error in UPDATE. statuscode: ' + response.status);
				}
			})
			.then((responseJson) => {
				// console.log('in second then');
				// console.log('reponse :' + JSON.stringify(responseJson));
				console.log(responseJson);
			})
			.catch((error) => {
				console.error(error);
				console.error('^ is the error, in UPDATE');
			});
	};

	toggleModalVisibility = () => {
		this.setState((prevState) => ({
			modalVisible: !prevState.modalVisible,
		}));
	};

	getEntry = async () => {
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
				//console.log('reponse :' + JSON.stringify(responseJson));

				this.state.inventoryInfo = responseJson;

				this.state.inventoryInfo.inventory.forEach((item) => {
					this.state.inventory.push(item);
				});
				

				console.log(
					'Inventory info: ' +
						JSON.stringify(this.state.inventoryInfo.inventory)
				);
				this.forceUpdate();
				//console.log(responseJson);
			})
			.catch((error) => {
				console.error(error);
				console.error('^ is the error, in GET');
			});
	};

	getCart = async () => {
		return fetch(SERVER_URL + 'cart/' + this.state.cartID)
			.then((response) => {
				if (response.status >= 200 || response.status <= 299) {
					console.log('Working');
					return response.json();
				} else {
					console.log('error in GET. statuscode: ' + response.status);
				}
			})
			.then((responseJson) => {
				//console.log('reponse :' + JSON.stringify(responseJson));

				this.state.cartInfo = responseJson;

				this.state.cartInfo.inventory.forEach((item) => {
					this.state.cartInventory.push(item);
				});
				

				this.forceUpdate();
				//console.log(responseJson);
			})
			.catch((error) => {
				console.error(error);
				console.error('^ is the error, in GET');
			});
	};

	componentDidMount = () => {
		console.log('---componentDidMount()---');
		const dic = this.props.navigation.getParam('pantryDic', null);
		const key = this.props.navigation.getParam('pantryKey', null);

		const currUser = firebase.auth().currentUser;
		this.setState(
			{
				pantryKey: key,
				pantryDic: dic,
				pantryID: dic[key].dbID, //formerly dbID
				pantryName: dic[key].pantryName,
				pantryAddress: dic[key].address,
				pantryNumber: dic[key].phone,
				pantryEmail: dic[key].email,
				cartID: this.state.cartID,
			},
			() => (
				// console.log(this.state),
				this.getEntry(), console.log('----------------------')
			)
		);
		this.state.inventory = [];
		this.state.cartInventory = [];

		// console.log('PantryInventoryScreen pantryID: ' + this.state.pantryID);
		// console.log('PantryInventoryScreen key: ' + this.state.pantryKey);
		// console.log('PantryInventoryScreen Dic: ' + this.state.pantryDic);
	};

	render() {
		return (
			<View style={styles.container}>
				<Modal
					animationType='slide'
					transparent={true}
					visible={this.state.modalVisible}
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
									onPress={() => this.toggleModalVisibility()}
								/>
							</View>
							<Text>
								Cart Display
								{this.state.cartInventory.map((item) => (
									<View
										style={
											(styles.boxes,
											{
												flex: 1,
												flexDirection: 'row',
												justifyContent: 'space-around',
											})
										}
									>

										<Text style={styles.bodyText} key= {item.name}>
											{item.name}: {item.quantity}
											
										</Text>

									</View>
								))}
							</Text>
						</View>
					</View>
				</Modal>

				<View style={styles.header}>
					<View style={styles.backPage}>
						<AntDesign
							name='left'
							size={24}
							color='black'
							position='absolute'
							onPress={() => this.props.navigation.navigate('DashboardScreen')}
						/>
					</View>

					<View style={styles.title}>
						<Text style={styles.titleText}>{this.state.pantryName}</Text>
					</View>
				</View>

				<View style={styles.boxes}>
					<View
						style={
							(styles.boxes,
							{ flex: 1, flexDirection: 'column', justifyContent: 'center' })
						}
					>
						{this.state.inventory.map((item) => (
							<View
								style={
									(styles.boxes,
									{
										flex: 1,
										flexDirection: 'row',
										justifyContent: 'space-around',
									})
								}
							>

								<Text style={styles.bodyText} key= {item.name}>
									{item.name}: {item.quantity}
									
								</Text>

								<TextInput
									style={styles.bodyText}
									onChangeText={(itemQuantity) =>
										this.setState({ itemQuantity })
									}
									placeholder={'Item Quantity '}
									style={styles.input}
									keyboardType={'numeric'}
								/>

								<Button
									style={styles.bodyText}
									title='Add'
									onPress={() => {
										this.state.itemName = item.name;
										this.addToCart();
										this.getCart();
									}}
								></Button>

							</View>
						))}
					</View>
				</View>
				<View style={styles.footer}>
					<Button
						title='See Cart'
						onPress={() => {

							this.toggleModalVisibility();

						}}
					></Button>
				</View>
			</View>
		);
	}
}
export default PantryInventoryScreen;

const styles = StyleSheet.create({
	// container: {
	// 	flex: 1,
	// 	justifyContent: 'center',
	// 	alignItems: 'center',
	// },
	// input: {
	// 	width: 200,
	// 	height: 44,
	// 	padding: 10,
	// 	borderWidth: 1,
	// 	borderColor: 'black',
	// 	marginBottom: 10,
	// },
	// bodyText: {
	// 	fontSize: 15,
	// 	color: 'black',
	// 	justifyContent: 'center',
	// 	textAlign: 'center',
	// },
	// headerText: {
	// 	fontSize: 20,
	// 	color: 'black',
	// 	justifyContent: 'center',
	// 	textAlign: 'center',
	// },
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
	bodyText: {
		fontSize: 20,
		//width: '100%',
		//height: '15%',
		//justifyContent: 'center',
		//textAlign: 'center',
		//alignItems: 'center',
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
	input: {
		width: 100,
		height: 44,
		borderWidth: 1,
		borderColor: 'black',
		marginBottom: 10,
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
	cart: {},
});

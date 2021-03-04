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
	TouchableOpacity,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
const SERVER_URL = 'http:/192.168.1.70:3000/';
const Pantry = require('../models/pantry');
import firebase from 'firebase';

class PantryDashboardScreen extends Component {
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
		modalVisible: false,
		itemID: null,
		itemName: null,
		itemQuantity: null,
	};

	getEntry = async () => {
		console.log('id: ' + this.state.pantryID);
		console.log(SERVER_URL + 'pantries/' + this.state.pantryID);
		return fetch(SERVER_URL + 'pantries/' + this.state.pantryID)
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

				this.state.inventoryInfo = responseJson;
				console.log(JSON.stringify(this.state.inventoryInfo));
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
			})
			.then((responseJson) => {
				console.log('in second then');
				// console.log('reponse :' + JSON.stringify(responseJson));
				console.log(responseJson);
				this.setState({
					// itemID: null,
					// itemName: null,
					// itemQuantity: null,
					modalView: false,
				});
				// console.log(this.state);
			})
			.catch((error) => {
				console.error(error);
				console.error('^ is the error, in UPDATE');
			});
	};

	componentDidMount = () => {
		console.log('---componentDidMount()---');
		const dic = this.props.navigation.getParam('pantryDic', null);
		const key = this.props.navigation.getParam('pantryKey', null);
		console.log('dic: ' + dic);
		console.log('key: ' + key);
		this.setState(
			{
				pantryKey: key,
				pantryDic: dic,
				pantryID: dic[key].pantryID, //formerly dbID
				pantryName: dic[key].pantryName,
				pantryAddress: dic[key].address,
				pantryNumber: dic[key].phone,
				pantryEmail: dic[key].email,
				inventoryInfo: {},
				inventoryString: '',
				inventory: [],
				modalVisible: false,
				itemID: null,
				itemName: null,
				itemQuantity: null,
			},
			() => (
				console.log(this.state),
				this.getEntry(),
				console.log('----------------------')
			)
		);

		this.state.inventory = [];

		// console.log('PantryInventoryScreen pantryID: ' + this.state.pantryID);
		// console.log('PantryInventoryScreen key: ' + this.state.pantryKey);
		// console.log('PantryInventoryScreen Dic: ' + this.state.pantryDic);
	};

	toggleModalVisibility = () => {
		this.setState((prevState) => ({
			modalVisible: !prevState.modalVisible,
		}));
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
					{this.state.inventoryInfo === {} ? (
						<Text>Getting inventory...</Text>
					) : this.state.inventoryInfo.inventory === (null || undefined) ? (
						<Text>Inventory doesn't exist</Text>
					) : (
						Object.values(this.state.inventoryInfo.inventory).map((json) => {
							return (
								<View style={styles.box}>
									<View style={styles.inner}>
										<Text>
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

				<View style={styles.footer}>
					<View>
						<Button
							title='Edit Inventory'
							onPress={() => {
								this.toggleModalVisibility();
								this.setState({
									itemID: null,
									itemName: null,
									itemQuantity: null,
								});
							}}
						/>
					</View>
					<Button title='Sign Out' onPress={() => firebase.auth().signOut()} />
				</View>
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

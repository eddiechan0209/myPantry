import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
const SERVER_URL = 'http://192.168.1.70:3000/pantries';
const Pantry = require('../models/pantry');

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
	};

	getEntry = async () => {
		console.log('id: ' + this.state.pantryID);
		return fetch(SERVER_URL + '/' + this.state.pantryID)
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
				this.state.inventorySting = '';
				this.state.inventoryInfo.inventory.forEach((item) => {
					let currentItemName = JSON.stringify(item.name);
					let currentItemQuantitiy = JSON.stringify(item.quantity);
					this.state.inventoryString +=
						currentItemName + ': ' + currentItemQuantitiy + ' \n ';
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
				pantryID: dic[key].dbID, //formerly dbID
				pantryName: dic[key].pantryName,
				pantryAddress: dic[key].address,
				pantryNumber: dic[key].phone,
				pantryEmail: dic[key].email,
				inventoryInfo: {},
				inventoryString: '',
			},
			() => (
				console.log(this.state),
				this.getEntry(),
				console.log('----------------------')
			)
		);
		// console.log('PantryInventoryScreen pantryID: ' + this.state.pantryID);
		// console.log('PantryInventoryScreen key: ' + this.state.pantryKey);
		// console.log('PantryInventoryScreen Dic: ' + this.state.pantryDic);
	};

	yes = () => {};

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<View style={styles.back}>
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
					{/* {Object.entries(this.state.inventoryInfo).map((tuple) => {
								return <Text>{tuple[0]}</Text>;
							})} */}

					{/* <View style={styles.box}>
						<View style={styles.inner}>
							<Text>Inner</Text>
						</View>
					</View>
					<View style={styles.box}>
						<View style={styles.inner}>
							<Text>Inner</Text>
						</View>
					</View>
					<View style={styles.box}>
						<View style={styles.inner}>
							<Text>Inner</Text>
						</View>
					</View> */}
				</View>
			</View>

			// <View style={styles.container}>
			// 	<Text style={styles.headerText}> Inventory: </Text>

			// 	<Text style={styles.bodyText}>{this.state.inventoryString}</Text>
			// 	<Button
			// 		title='Back'
			// 		onPress={() => this.props.navigation.navigate('PantryScreen')}
			// 	/>
			// </View>
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
	boxes: {
		width: '100%',
		height: '85%',
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
	back: {
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
});

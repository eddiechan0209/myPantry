import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';
const SERVER_URL = 'http://192.168.1.70:3000/pantries';
const Pantry = require('../models/pantry');

class PantryInventoryScreen extends Component {
	state = {
		// dbID: this.props.navigation.getParam('dbID', 'notpantry'),
		dbID: '603d9af0aa03bb51e77bfb90', // Hardcoding to this pantry for now
		inventoryInfo: {},
		inventoryString: '',
	};

	getEntry = async () => {
		console.log('id: ' + this.state.dbID);
		return fetch(SERVER_URL + '/' + this.state.dbID)
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

	componentDidMount() {
		{
			this.getEntry();
		}
		console.log('mounted');
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.headerText}> Inventory: </Text>

				<Text style={styles.bodyText}>{this.state.inventoryString}</Text>
				<Button
					title='Back'
					onPress={() => this.props.navigation.navigate('PantryScreen')}
				/>
			</View>
		);
	}
}
export default PantryInventoryScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	input: {
		width: 200,
		height: 44,
		padding: 10,
		borderWidth: 1,
		borderColor: 'black',
		marginBottom: 10,
	},
	bodyText: {
		fontSize: 15,
		color: 'black',
		justifyContent: 'center',
		textAlign: 'center',
	},
	headerText: {
		fontSize: 20,
		color: 'black',
		justifyContent: 'center',
		textAlign: 'center',
	},
});

import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';
const SERVER_URL = 'http://192.168.1.70:3000/pantries';
const Pantry = require('../models/pantry');
import { AntDesign } from '@expo/vector-icons';

// empty db
const postEntry = {
	method: 'POST',
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
	body: JSON.stringify({
		name: 'Great Pantry',
		address: 'Some address',
		inventory: [],
	}),
};

// patch db
const patchEntry = {
	method: 'PATCH',
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},

	body: JSON.stringify({
		inventory: [
			{ itemID: 1, name: 'Lentils', quantity: 6 },
			{ itemID: 2, name: 'Collard Greens', quantity: 20 },
			{ itemID: 3, name: 'Canned Tomatoes', quantity: 100 },
		],
	}),
};

class PantryScreen extends Component {
	postEntry = async () => {
		let a = fetch(SERVER_URL, postEntry)
			.then((response) => {
				if (response.status >= 200 || response.status <= 299) {
					return response.json();
				} else {
					console.log('error in POST. statuscode: ' + response.status);
				}
			})
			.then((responseJson) => {
				this.state.dbID = responseJson._id;
				console.log('postEntry() successful.');
				console.log('id: ' + this.state.dbID);
			})
			.catch((error) => {
				console.error(error);
				console.error('^ is the error, in POST');
			});
		console.log(a);
		return a;
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
				console.log('reponse :' + JSON.stringify(responseJson));
				console.log(responseJson);
			})
			.catch((error) => {
				console.error(error);
				console.error('^ is the error, in GET');
			});
	};

	updateEntry = async () => {
		console.log('id: ' + this.state.dbID);
		console.log('in updateentry');
		return fetch(SERVER_URL + '/' + this.state.dbID, patchEntry)
			.then((response) => {
				console.log('in first then');
				console.log(response.status);
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
			})
			.catch((error) => {
				console.error(error);
				console.error('^ is the error, in UPDATE');
			});
	};

	state = {
		// dbID: this.props.navigation.getParam('dbID', 'notpantry'),
		dbID: '60408f1488efa2a04f88532b',
	};

	render() {
		//console.log('bitch' + this.props.navigation.getParam('dbID', 'notPantry'));
		//console.log(this.state.dbID);
		//console.log('in pantryscreen');
		//console.log(JSON.stringify(pantryExample));
		return (
			<View style={styles.container}>
				<Text>
					PantryScreen
					{SERVER_URL}
				</Text>

				<Button title='postEntry' onPress={() => this.postEntry()} />
				<Button title='getEntry' onPress={() => this.getEntry()} />
				<Button title='updateEntry' onPress={() => this.updateEntry()} />
				<Button
					title='Add Inventory'
					onPress={() =>
						this.props.navigation.navigate('InputPantryInfoScreen')
					}
				/>

				<Button
					title='View Inventory'
					onPress={() =>
						this.props.navigation.navigate('PantryInventoryScreen')
					}
				/>
				<View style={styles.back}>
					<AntDesign
						name='left'
						size={24}
						color='black'
						position='absolute'
						onPress={() => this.props.navigation.navigate('LoginScreen')}
					/>
				</View>

				{/* <Text>{this.state.numCarrots}</Text> */}
			</View>
		);
	}
}
export default PantryScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
});

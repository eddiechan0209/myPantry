import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';
const SERVER_URL = 'http://192.168.1.70:3000/pantries';
const Pantry = require('../models/pantry');

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
		name: 'Add celery',
		address: 'New Addy',
		inventory: [
			{ itemID: 1, name: 'celery', quantity: 100 },
			{ itemID: 2, name: 'carrot', quantity: 3 },
			{ itemID: 3, name: 'corn', quantity: 2 },
			{ itemID: 4, name: 'fruit', quantity: 4 },
		],
	}),
};

class PantryScreen extends Component {
	postEntry = async () => {
		return fetch(SERVER_URL, postEntry)
			.then((response) => {
				if (response.status >= 200 || response.status <= 299) {
					return response.json();
				} else {
					console.log('error in POST. statuscode: ' + response.status);
				}
			})
			.then((responseJson) => {
				// this.state.dbID = responseJson._id;
				// console.log('postEntry() successful.');
				// console.log('id: ' + this.state.dbID);
			})
			.catch((error) => {
				console.error(error);
				console.error('^ is the error, in POST');
			});
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
		dbID: '6033670df94993f43908e153',
	};

	render() {
		//console.log('bitch' + this.props.navigation.getParam('dbID', 'notPantry'));
		//console.log(this.state.dbID);
		//console.log('in pantryscreen');
		//console.log(JSON.stringify(pantryExample));
		return (
			<View style={styles.container}>
				<Text>PantryScreen</Text>
				
				<Button title='postEntry' onPress={() => this.postEntry()} />
				<Button title='getEntry' onPress={() => this.getEntry()} />
				<Button title='updateEntry' onPress={() => this.updateEntry()} />
				<Button title='Add Inventory' onPress={() => this.props.navigation.navigate('InputPantryInfoScreen')} />
				
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

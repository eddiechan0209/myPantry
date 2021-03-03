import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';
import firebase from 'firebase';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';

const SERVER_URL = 'http:/10.0.0.85:3000/pantries';

const pantryEntry = {
	method: 'PATCH',
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
	body: JSON.stringify({
		inventory: [],
	}),
};
// Need to set inventory to empty array or push will not work
pantryEntry.inventory = [];

class InputPantryInfoScreen extends Component {
	addValuesToPantry = async () => {
		console.log(
			'input: ' + this.state.itemName + ' ' + this.state.itemQuantity
		);
		// Adding the values that were inputted to the existing inventory list
		// pantryEntry.inventory.push({
		// 	itemID: 6,
		// 	name: this.state.itemName,
		// 	quantity: parseInt(this.state.itemQuantity),
		// });

		const pantryEntry = {
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

		console.log(pantryEntry);
		this.state.dbID = this.props.navigation.getParam('pantryID', null);
		console.log('id: ' + this.state.dbID);
		console.log('in updateentry');
		
		// Running update and then updating the values

		// Possible error to check for could be if Pantry is trying to add to existing item
		// like if the pantry is trying to add more apples and not replace total with the given
		// number

		return fetch(SERVER_URL + '/' + this.state.dbID, pantryEntry)
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
			})
			.catch((error) => {
				console.error(error);
				console.error('^ is the error, in UPDATE');
			});
	};

	state = {
		dbID: '',
		itemID: '',
		itemName: '',
		itemQuantity: '',
	};
	render() {
		return (
			<View style={styles.container}>
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

				<Button title='Add Values' onPress={() => this.addValuesToPantry()} />

				<Button title='Sign out' onPress={() => firebase.auth().signOut()} />
				<Button
					title='Back to Pantry View'
					onPress={() => {
						console.log('dashboard pressed');
						console.log(this.props.navigation.getParam('dbID', 'notPantry'));
						console.log('dashboard pressed after');
						this.props.navigation.navigate('DashboardScreen');
					}}
				/>
			</View>
		);
	}
}
export default InputPantryInfoScreen;

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
});

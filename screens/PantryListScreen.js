import React, { Component } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import firebase from 'firebase';

class PantryListScreen extends Component {
	seePantries() {
		firebase
			.database()
			.ref('users/')
			.on('value', (snapshot) => {
				const pantries = snapshot.val();
				console.log('pantries ' + pantries);
			});
	}

	render() {
		return (
			<View style={styles.container}>
				<Text>PantryListScreen</Text>
				<Button
					title={'See Pantries'}
					style={styles.input}
					onPress={() => this.seePantries()}
				/>
			</View>
		);
	}
}
export default PantryListScreen;

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

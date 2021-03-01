import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Button,
	TouchableOpacity,
	FlatList,
} from 'react-native';
import firebase from 'firebase';
import { firebaseConfig } from '../config';
// const db = firebase.initializeApp(firebaseConfig).database();

class PantryListScreen extends Component {
	// componentDidMount() {
	// 	firebase
	// 		.database()
	// 		.ref('/pantry')
	// 		.on('value', (querySnapShot) => {
	// 			let data = querySnapShot.val() ? querySnapShot.val() : {};
	// 			let todoItems = { ...data };
	// 			this.setState({
	// 				todos: todoItems,
	// 			});
	// 		});
	// }

	seePantries = () => {
		console.log('seePantry()');
		const pantryKeys = [];
		firebase
			.database()
			.ref('/pantry')
			.on('value', (snapshot) => {
				this.state.pantryDic = snapshot.val();
				for (key in snapshot.val()) {
					pantryKeys.push(key);
				}
				this.state.pantryKeys = pantryKeys;
			});
		console.log('---------');
		this.forceUpdate();
	};

	openPantryPage = () => {};

	state = { pantryDic: '', pantryKeys: [] };
	render() {
		return (
			<View style={styles.container}>
				<Text>PantryListScreen</Text>
				<Button
					title={'See Pantries'}
					style={styles.input}
					onPress={() => this.seePantries()}
				/>
				<Text style={styles.names}>
					Pantries:
					{this.state.pantryKeys.map((key) => {
						return (
							<Text>
								{'\n\n'}
								<TouchableOpacity onPress={() => this.openPantryPage(key)}>
									<Text>{this.state.pantryDic[key].pantryName}</Text>
								</TouchableOpacity>
							</Text>
						);
					})}
				</Text>
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
	names: {
		justifyContent: 'center',
		fontSize: 15,
		marginTop: 10,
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

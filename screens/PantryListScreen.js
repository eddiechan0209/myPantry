import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Button,
	TouchableOpacity,
	ScrollView,
} from 'react-native';
import firebase from 'firebase';
import {
	createBottomTabNavigator,
	createStackNavigator,
} from 'react-navigation';

class PantryListScreen extends Component {
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
		console.log(pantryKeys);
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
					style={styles.button}
					title={'See Pantries'}
					style={styles.input}
					onPress={() => this.seePantries()}
				/>

				{/* <View style={styles.names}> */}
				{/* Pantries: */}
				<ScrollView>
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
				</ScrollView>
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

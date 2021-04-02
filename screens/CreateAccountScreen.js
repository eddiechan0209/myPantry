import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import firebase from 'firebase';
import env from '../app.json';

const SERVER_URL = 'http:/' + env.myIP + ':3000/';

class CreateAccountScreen extends Component {
	/*
		Description: send a POST request to our REST server using the /pantries route. Our server will
		handle this request so that mongoose stores this entry into the database. We will store the reference ID to
		this entry in firebase under pantryID. We will also write the rest of user information to firebase.

		Parameters: UserCredential json object (https://firebase.google.com/docs/reference/js/firebase.auth#usercredential)
		This object is created by firebase's signInWithCredential()
	*/
	createMongoPantry = async (result) => {
		// this is the second argument to fetch() which customizes the HTTP request
		const pantry = {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name: this.state.pantryName,
				address: this.state.address,
				inventory: [],
				orders: [],
			}),
		};

		fetch(SERVER_URL + 'pantries', pantry)
			// the .then() chain handles the response from fetch()
			// fetch() is an inherently asynchronous operation, which returns a Promise. If the promise
			// is fulfilled, .then() will be carried out, otherwise .catch() will be called.
			// Read more about Promises here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
			.then((response) => response.json())
			.then((responseJson) => {
				this.state.pantryID = responseJson._id;

				firebase
					.database()
					.ref('/' + this.state.userType + '/' + result.user.uid)
					.set({
						email: this.state.emailaddress,
						first_name: this.state.firstname,
						last_name: this.state.lastname,
						pantryName: this.state.pantryName,
						address: this.state.address,
						phone: this.state.phone,
						pantryID: this.state.pantryID,
						created_at: Date.now(),
					});
				console.log('successfully created new pantry');
			})
			.catch((error) => {
				console.error(error);
				console.error('error in createMongoPantry()');
			});
	};

	/*
		Description: send a POST request to our REST server using the /cart route. Our server will
		handle this request so that mongoose stores this entry into the database. We will store the reference ID to
		this entry in firebase under cartID. We will also write the rest of user information to firebase.

		Parameters: UserCredential json object (https://firebase.google.com/docs/reference/js/firebase.auth#usercredential)
		This object is created by firebase's signInWithCredential()
	*/
	createMongoCart = async (result) => {
		const cart = {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				// change model?
				name: 'dummy',
				address: 'dummy',
				pickupTime: 'dummy',
				phone: 'dummy',
				inventory: [],
			}),
		};

		fetch(SERVER_URL + 'cart', cart)
			.then((response) => response.json())
			.then((responseJson) => {
				this.state.cartID = responseJson._id;

				firebase
					.database()
					.ref('/' + this.state.userType + '/' + result.user.uid)
					.set({
						email: this.state.emailaddress,
						first_name: this.state.firstname,
						last_name: this.state.lastname,
						cartID: this.state.cartID,
					});
				console.log('successfully created new user cart');
			})
			.catch((error) => {
				console.error(error);
				console.error('error in createMongoCart()');
			});
	};

	/*
		Description: Create new user and sign them in. The observer will notice a change in sign-in state
		and LoadingScreen will handle which screen to navigate to.

		Note: onAuthStateChanged() on LoadingScreen "Adds an observer for changes to the user's sign-in state" 
		(read more at https://firebase.google.com/docs/reference/js/firebase.auth.Auth#onauthstatechanged)
	*/
	writeUserData = () => {
		firebase
			.auth()
			.createUserWithEmailAndPassword(
				this.state.emailaddress,
				this.state.password
			)
			.then(() => {
				var credential = firebase.auth.EmailAuthProvider.credential(
					this.state.emailaddress,
					this.state.password
				);
				firebase
					.auth()
					.signInWithCredential(credential)
					.then((result) => {
						this.state.uid = result.user.uid;
						if (this.state.userType == 'pantry') {
							this.createMongoPantry(result);
						} else {
							this.createMongoCart(result);
						}
					});
			})
			.catch((error) => {
				console.log('error in writeUserData()');
				console.log(error.message);
				this.state.error = error.message;
				this.forceUpdate();
			});
	};

	renderConsumerInfoPrompt = () => {
		// userType will be passed during navigation (consumer is just default)
		const userType = this.props.navigation.getParam('userType', 'consumer');
		return (
			<View>
				<TextInput
					value={this.state.firstname}
					onChangeText={(firstname) => this.setState({ firstname })}
					placeholder={'Enter first name'}
					style={styles.input}
				/>
				<TextInput
					value={this.state.lastname}
					onChangeText={(lastname) => this.setState({ lastname })}
					placeholder={'Enter last name'}
					style={styles.input}
				/>
				<TextInput
					value={this.state.emailaddress}
					onChangeText={(emailaddress) => this.setState({ emailaddress })}
					placeholder={'Enter email address'}
					style={styles.input}
				/>
				<TextInput
					value={this.state.password}
					onChangeText={(password) => this.setState({ password })}
					placeholder={'Create password'}
					secureTextEntry={true}
					style={styles.input}
				/>
			</View>
		);
	};

	renderPantryInfoPrompt = () => {
		if (this.state.userType == 'pantry') {
			return (
				<View>
					<TextInput
						value={this.state.pantryName}
						onChangeText={(pantryName) => this.setState({ pantryName })}
						placeholder={'Enter pantry name'}
						style={styles.input}
					/>
					<TextInput
						value={this.state.address}
						onChangeText={(address) => this.setState({ address })}
						placeholder={'Enter pantry address'}
						style={styles.input}
					/>
					<TextInput
						value={this.state.phone}
						onChangeText={(phone) => this.setState({ phone })}
						placeholder={'Enter pantry phone number'}
						style={styles.input}
					/>
				</View>
			);
		}
	};

	state = {
		// userType will either be "pantry" or "consumer"
		userType: this.props.navigation.getParam('userType', 'consumer'),
		firstname: '',
		lastname: '',
		emailaddress: '',
		password: '',
		pantryName: '',
		address: '',
		phone: '',
		error: '',
		pantryID: '',
		cartID: '',
	};

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.back}>
					<AntDesign
						name='left'
						size={24}
						color='black'
						position='absolute'
						onPress={() => this.props.navigation.navigate('LoginScreen')}
					/>
				</View>
				{this.renderConsumerInfoPrompt()}
				{this.renderPantryInfoPrompt()}
				<View>
					<Text>{this.state.error}</Text>
				</View>
				<Button
					title={'Enter'}
					style={styles.input}
					onPress={() => this.writeUserData()}
				/>
			</View>
		);
	}
}
export default CreateAccountScreen;

const styles = StyleSheet.create({
	// container: {
	//     flex: 1,
	//     alignItems: 'center',
	//     justifyContent: 'center'
	// },
	text: {
		justifyContent: 'flex-start',
		marginTop: 100,
		position: 'absolute',
		top: 0,
	},
	sign: {
		justifyContent: 'flex-end',
		marginBottom: 100,
		position: 'absolute',
		bottom: 0,
	},
	buttonText: {
		fontSize: 20,
		color: 'black',
		justifyContent: 'center',
		textAlign: 'center',
	},
	back: {
		...StyleSheet.absoluteFillObject,
		alignSelf: 'flex-end',
		marginTop: 50,
		marginLeft: 15,
		// position: 'absolute',
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#ecf0f1',
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

import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import firebase from 'firebase';

class CreateAccountScreen extends Component {
	writeUserData = () => {
		console.log('above authent ' + this.state.firstname);
		firebase
			.auth()
			.createUserWithEmailAndPassword(
				this.state.emailaddress,
				this.state.password
			)
			.then(() => {
				console.log('Signup successful.');
				// var actionCodeSettings = {
				//     url: 'mypantry-924e1.firebaseapp.com',
				//     iOS: {
				//       bundleId: 'com.example.ios'
				//     },
				//     android: {
				//       packageName: 'com.example.android',
				//       installApp: true,
				//       minimumVersion: '12'
				//     },
				//     handleCodeInApp: true,
				//     // When multiple custom dynamic link domains are defined, specify which
				//     // one to use.
				//     dynamicLinkDomain: "example.page.link"
				// };

				// link = firebase.auth().sendSignInLinkToEmail(this.state.emailaddress, actionCodeSettings);
				var credential = firebase.auth.EmailAuthProvider.credential(
					this.state.emailaddress,
					this.state.password
				);
				firebase
					.auth()
					.signInWithCredential(credential)
					.then((result) => {
						console.log('user signed in');
						if (this.state.userType == 'pantry') {
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
									created_at: Date.now(),
								});
						} else {
							firebase
								.database()
								.ref('/' + this.state.userType + '/' + result.user.uid)
								.set({
									email: this.state.emailaddress,
									first_name: this.state.firstname,
									last_name: this.state.lastname,
								});
						}

						// else{
						//     firebase
						//     .database()
						//     .ref("/emailUsers/" + result.user.uid).update({
						//         last_logged_in: Date.now()
						//     })
						// }
					});
			})
			.catch((error) => {
				console.log('in error section');
				console.log(error.code);
				console.log(error.message);
			});

		// if (!this.isUserEqual(googleUser, firebaseUser)) {
		//     firebase.database().ref("emailUsers/" + this.state.emailaddress).set({
		//         first_name: this.state.firstname,
		//         last_name: this.state.lastname,
		//         email: this.state.emailaddress,
		//         password : this.state.password,
		//         created_at: Date.now()
		//     })
		// }
	};

	renderUserInfoPrompt = () => {
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

	onLogin = () => {
		const {
			userType,
			firstname,
			lastname,
			emailaddress,
			password,
		} = this.state;
		console.log('on login');
		this.writeUserData();
		// Alert.alert('Credentials', `${firstname} + ${lastname} + ${emailaddress} + ${password}`);
	};

	state = {
		userType: this.props.navigation.getParam('userType', 'consumer'),
		firstname: '',
		lastname: '',
		emailaddress: '',
		password: '',
		pantryName: '',
		address: '',
		phone: '',
	};

	render() {
		// console.log("render:" + JSON.stringify(this.state));
		return (
			<View style={styles.container}>
				<View style={styles.back}>
					<AntDesign
						name="left"
						size={24}
						color="black"
						position="absolute"
						onPress={() => this.props.navigation.navigate('LoginScreen')}
					/>
				</View>
				{this.renderUserInfoPrompt()}
				{this.renderPantryInfoPrompt()}
				<Button
					title={'Enter'}
					style={styles.input}
					onPress={() => {
						this.onLogin();
						this.props.navigation.navigate('DashboardScreen');
					}}
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

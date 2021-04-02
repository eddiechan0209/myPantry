import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Image,
	Alert,
	Modal,
	TextInput,
	Button,
} from 'react-native';
import * as Google from 'expo-google-app-auth';
import firebase from 'firebase';
import logo from '../images/MyPantryLogo.png';
import { AntDesign } from '@expo/vector-icons';

import { TouchableOpacity } from 'react-native-gesture-handler';
class LoginScreen extends Component {
	/*
		This needs to be updated. Ignore for now
	*/
	googleSignIn = (googleUser) => {
		// We need to register an Observer on Firebase Auth to make sure auth is initialized.
		var unsubscribe = firebase.auth().onAuthStateChanged(
			function (firebaseUser) {
				unsubscribe();
				// Check if we are already signed-in Firebase with the correct user.
				if (!this.isUserEqual(googleUser, firebaseUser)) {
					// Build Firebase credential with the Google ID token.
					var credential = firebase.auth.GoogleAuthProvider.credential(
						googleUser.idToken,
						googleUser.accessToken
					);

					// Sign in with credential from the Google user.
					firebase
						.auth()
						.signInWithCredential(credential)
						.then(function (result) {
							if (result.additionalUserInfo.isNewUser) {
								firebase
									.database()
									.ref('/googleUsers/' + result.user.uid)
									.set({
										gmail: result.user.email,
										profile_picture: result.additionalUserInfo.profile.picture,
										locale: result.additionalUserInfo.profile.locale,
										first_name: result.additionalUserInfo.profile.given_name,
										last_name: result.additionalUserInfo.profile.family_name,
										created_at: Date.now(),
									})
									.then(function (snapshot) {});
							} else {
								firebase
									.database()
									.ref('/googleUsers/' + result.user.uid)
									.update({
										last_logged_in: Date.now(),
									});
							}
						})
						.catch((error) => {
							console.log('error in googleSignIn(): ' + error.message);
						});
				} else {
					console.log('User already signed-in Firebase.');
				}
			}.bind(this)
		);
	};

	/*
		Description: sign in user with email (and not Google)
	*/
	emailSignIn = () => {
		var credential = firebase.auth.EmailAuthProvider.credential(
			this.state.emailaddress,
			this.state.password
		);
		firebase
			.auth()
			.signInWithCredential(credential)
			.then((result) => {
				// should not need navigation anyways
				this.props.navigation.navigate('DashboardScreen');
			})
			.catch((error) => {
				this.state.error = error.message;
				this.forceUpdate();
			});
	};

	renderSignIn = () => {
		return (
			<View>
				<TextInput
					value={this.state.emailaddress}
					onChangeText={(emailaddress) => this.setState({ emailaddress })}
					placeholder={'Enter email address'}
					style={styles.input}
				/>
				<TextInput
					value={this.state.password}
					onChangeText={(password) => this.setState({ password })}
					placeholder={'Enter password'}
					secureTextEntry={true}
					style={styles.input}
				/>
				<Button
					title={'Enter'}
					style={styles.input}
					onPress={() => {
						this.emailSignIn();
						this.forceUpdate();
					}}
				/>
			</View>
		);
	};

	isUserEqual = (googleUser, firebaseUser) => {
		if (firebaseUser) {
			var providerData = firebaseUser.providerData;
			for (var i = 0; i < providerData.length; i++) {
				if (
					providerData[i].providerId ===
						firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
					providerData[i].uid === googleUser.getBasicProfile().getId()
				) {
					// We don't need to reauth the Firebase connection.
					return true;
				}
			}
		}
		return false;
	};

	/*
		Description: "Prompts the user to log into Google and grants your app permission to access some 
		of their Google data, as specified by the scopes." (https://docs.expo.io/versions/latest/sdk/google/#loginasync)
	*/
	signInWithGoogleAsync = async () => {
		try {
			const result = await Google.logInAsync({
				behavior: 'web',
				// androidClientId: YOUR_CLIENT_ID_HERE,
				iosClientId:
					'741826228014-6v6pvpap9is4iak9n4ala7p4l1ltt08c.apps.googleusercontent.com',
				scopes: ['profile', 'email'],
			});

			if (result.type === 'success') {
				this.googleSignIn(result);
				return result.accessToken;
			} else {
				return { cancelled: true };
			}
		} catch (e) {
			return { error: true };
		}
	};

	/*
		Description: there are 3 modals (modals are like popups):
			Modal 1: user clicked "Create Account" and is prompted to identify the type of user they are "pantry" or consumer
			Modal 2: user clicked "Sign In" and is prompted to identify the method to sign in (email or with Google)
			Modal 3: user wants to sign in with email, and is prompted text boxes for email and password

		I dont really like these modals and know there's better components we can use.
	*/
	toggleModalVisibility = (num) => {
		if (num == 1) {
			this.setState((prevState) => ({
				modal1Visible: !prevState.modal1Visible,
			}));
		} else if (num == 2) {
			this.setState((prevState) => ({
				modal2Visible: !prevState.modal2Visible,
			}));
		} else {
			this.setState((prevState) => ({
				modal3Visible: !prevState.modal3Visible,
				modal2Visible: false,
			}));
		}
	};

	state = {
		modal1Visible: false,
		modal2Visible: false,
		modal3Visible: false,
		emailaddress: '',
		password: '',
		error: '',
	};

	render() {
		return (
			<View style={styles.container}>
				{/* Modal for Create Account*/}
				<Modal
					animationType='slide'
					transparent={true}
					visible={this.state.modal1Visible}
					onRequestClose={() => {
						Alert.alert('Modal has been closed.');
					}}
				>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<View style={styles.back}>
								<AntDesign
									name='left'
									size={24}
									color='black'
									position='absolute'
									onPress={() => this.toggleModalVisibility(1)}
								/>
							</View>
							<Text style={styles.modalText}>I am a...</Text>
							<TouchableOpacity
								style={styles.createSignInButton}
								onPress={() =>
									this.props.navigation.navigate('CreateAccountScreen', {
										userType: 'pantry',
									})
								}
							>
								<Text style={styles.modalText}>PANTRY</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.createSignInButton}
								onPress={() =>
									this.props.navigation.navigate('CreateAccountScreen', {
										userType: 'consumer',
									})
								}
							>
								<Text style={styles.modalText}>CONSUMER</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>

				{/* Modal for Sign in */}
				<Modal
					animationType='slide'
					transparent={true}
					visible={this.state.modal2Visible}
					onRequestClose={() => {
						Alert.alert('Modal has been closed.');
					}}
				>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<View style={styles.back}>
								<AntDesign
									name='left'
									size={24}
									color='black'
									position='absolute'
									onPress={() => this.toggleModalVisibility(2)}
								/>
							</View>
							<Text style={styles.modalText}>Sign in with...</Text>
							<TouchableOpacity
								style={styles.createSignInButton}
								onPress={() => this.toggleModalVisibility(3)}
							>
								{/* onPress={() => this.renderSignIn()}> */}
								<Text style={styles.modalText}>EMAIL</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.createSignInButton}
								onPress={() => this.signInWithGoogleAsync()}
							>
								<Text style={styles.modalText}>GOOGLE</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>

				{/* Modal for email prompt */}
				<Modal
					animationType='slide'
					transparent={true}
					visible={this.state.modal3Visible}
					onRequestClose={() => {
						Alert.alert('Modal has been closed.');
					}}
				>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<View style={styles.back}>
								<AntDesign
									name='left'
									size={24}
									color='black'
									position='absolute'
									onPress={() => {
										this.toggleModalVisibility(3);
										this.state.error = '';
									}}
								/>
							</View>

							<View>
								<TextInput
									value={this.state.emailaddress}
									onChangeText={(emailaddress) =>
										this.setState({ emailaddress })
									}
									placeholder={'Enter email address'}
									style={styles.input}
								/>
								<TextInput
									value={this.state.password}
									onChangeText={(password) => this.setState({ password })}
									placeholder={'Enter password'}
									secureTextEntry={true}
									style={styles.input}
								/>
								<View>
									<Text>{this.state.error}</Text>
								</View>

								<Button
									title={'Enter'}
									style={styles.input}
									onPress={() => this.emailSignIn()}
								/>
							</View>
						</View>
					</View>
				</Modal>

				{/* Logo */}
				<View>
					<Image style={styles.logo} source={logo} />
				</View>

				{/* Two buttons: Create Account and Sign In */}
				<View style={styles.sign}>
					<TouchableOpacity
						style={styles.createAccountButton}
						onPress={() => this.toggleModalVisibility(1)}
					>
						<Text style={styles.buttonText}>CREATE ACCOUNT</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.createSignInButton}
						onPress={() => this.toggleModalVisibility(2)}
					>
						<Text style={styles.buttonText}>SIGN IN</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}
export default LoginScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	sign: {
		justifyContent: 'flex-end',
		marginBottom: 100,
		position: 'absolute',
		bottom: 0,
	},
	createAccountButton: {
		elevation: 8,
		borderRadius: 40, // how curvy the button is
		paddingVertical: 10,
		paddingHorizontal: 12,
		marginBottom: 5, //space between buttons
	},
	createSignInButton: {
		elevation: 8,
		borderRadius: 40,
		paddingVertical: 10,
		paddingHorizontal: 12,
		marginTop: 5,
	},
	buttonText: {
		fontSize: 20,
		color: 'black',
		justifyContent: 'center',
		textAlign: 'center',
	},
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22,
	},
	modalView: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	openButton: {
		backgroundColor: '#F194FF',
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
	modalText: {
		marginBottom: 15,
		textAlign: 'center',
	},
	back: {
		...StyleSheet.absoluteFillObject,
		alignSelf: 'flex-end',
		marginTop: 10,
		marginLeft: 5,
		// position: 'absolute',
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

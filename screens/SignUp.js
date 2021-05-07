import React from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import firebase from 'firebase';

class SignUp extends React.Component {
	state = {
		first_password: '',
		second_password: '',
		emailaddress: '',
		username: '',
		error: '',
	};

	/*
		Description: Create new user and sign them in. The observer will notice a change in sign-in state
		and LoadingScreen will handle which screen to navigate to.

		Note: onAuthStateChanged() on LoadingScreen "Adds an observer for changes to the user's sign-in state" 
		(read more at https://firebase.google.com/docs/reference/js/firebase.auth.Auth#onauthstatechanged)
	*/
	writeUserData = () => {
		if (this.state.first_password == this.state.second_password) {
			firebase
				.auth()
				.createUserWithEmailAndPassword(
					this.state.emailaddress,
					this.state.first_password
				)
				.then(() => {
					var credential = firebase.auth.EmailAuthProvider.credential(
						this.state.emailaddress,
						this.state.first_password
					);
					firebase
						.auth()
						.signInWithCredential(credential)
						.then((result) => {
							this.props.navigation.navigate('Home');
						});
				})
				.catch((error) => {
					console.log('error in writeUserData()');
					console.log(error.message);
					this.state.error = error.message;
					this.forceUpdate();
				});
		} else {
			this.state.error = 'Passwords do not match.';
			this.forceUpdate();
		}
	};

	render() {
		//const userType = this.props.navigation.getParam('userType', 'consumer');
		return (
			<View>
				<View
					style={{ justifyContent: 'center', padding: 20, alignItems: 'left' }}
				>
					<View style={{ height: 20 }} />
					<Text>Email Address</Text>
					<TextInput
						placeholder={'Enter email address'}
						value={this.state.emailaddress}
						onChangeText={(emailaddress) => this.setState({ emailaddress })}
						style={styles.input}
					/>

					<View style={{ height: 20 }} />
					<Text>Username</Text>

					<TextInput
						placeholder={'Enter username'}
						value={this.state.username}
						onChangeText={(username) => this.setState({ username })}
						style={styles.input}
					/>

					<View style={{ height: 20 }} />
					<Text>Password</Text>

					<TextInput
						placeholder={'Password'}
						value={this.state.first_password}
						onChangeText={(first_password) => this.setState({ first_password })}
						secureTextEntry={true}
						style={styles.input}
					/>

					<View style={{ height: 20 }} />
					<Text>Confirm Password</Text>

					<TextInput
						placeholder={'Confirm password'}
						value={this.state.second_password}
						onChangeText={(second_password) =>
							this.setState({ second_password })
						}
						secureTextEntry={true}
						style={styles.input}
					/>
					<View>
						<Text style={styles.error}>{this.state.error}</Text>
					</View>
				</View>
				<Pressable
					style={styles.button}
					title={'Sign-Up'}
					onPress={() => this.writeUserData()}
				>
					<Text style={styles.buttonText}>Sign-up</Text>
				</Pressable>
			</View>
		);
	}
}

export default SignUp;

const styles = StyleSheet.create({
	input: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'white',
		alignSelf: 'stretch',
		height: 30,
	},
	error: {
		color: 'red',
	},
	button: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 12,
		paddingHorizontal: 32,
		borderRadius: 35,
		elevation: 3,
		backgroundColor: '#9ac791',
	},
	buttonText: {
		color: 'white',
	},
});

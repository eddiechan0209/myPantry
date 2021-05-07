import React from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import * as Google from 'expo-google-app-auth';
import firebase from 'firebase';
import { AntDesign } from '@expo/vector-icons';

class Login extends React.Component {
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
				this.props.navigation.navigate('Home');
			})
			.catch((error) => {
				this.setState({ error: error.message });
				this.forceUpdate();
			});
	};

	state = {
		emailaddress: '',
		password: '',
		error: '',
	};

	render() {
		return (
			<View>
				<View
					style={{ justifyContent: 'center', padding: 20, alignItems: 'left' }}
				>
					<View style={{ height: 20 }} />
					<Text>Email Address</Text>
					<TextInput
						value={this.state.emailaddress}
						onChangeText={(emailaddress) => this.setState({ emailaddress })}
						placeholder={'Enter email address'}
						style={styles.input}
					/>
					<View style={{ height: 20 }} />
					<Text>Password</Text>

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
				</View>
				<Pressable
					style={styles.button}
					title={'Login'}
					onPress={() => this.emailSignIn()}
				>
					<Text style={styles.buttonText}>Login</Text>
				</Pressable>
			</View>
		);
	}
}

export default Login;

const styles = StyleSheet.create({
	input: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'white',
		alignSelf: 'stretch',
		height: 30,
		borderRadius: 5,
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

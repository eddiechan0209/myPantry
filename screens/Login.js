import React from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import * as Google from 'expo-google-app-auth';
import firebase from 'firebase';
import logo from '../images/MyPantryLogo.png';
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
				this.props.navigation.navigate('DashboardScreen');
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
			<View
				style={{ justifyContent: 'center', padding: 20, alignItems: 'left' }}
			>
				<View style={{ height: 20 }} />
				<Text>Email Address</Text>
				<TextInput
					value={this.state.emailaddress}
					onChangeText={(emailaddress) => this.setState({ emailaddress })}
					placeholder={'Enter email address'}
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: 'white',
						alignSelf: 'stretch',
						height: 30,
					}}
				/>
				<View style={{ height: 20 }} />
				<Text>Password</Text>

				<TextInput
					value={this.state.password}
					onChangeText={(password) => this.setState({ password })}
					placeholder={'Enter password'}
					secureTextEntry={true}
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: 'white',
						alignSelf: 'stretch',
						height: 30,
					}}
				/>
				<Button
					title={'Login'}
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						height: 100,
						backgroundColor: (154, 199, 145),
					}}
					onPress={() => this.emailSignIn()}
				>
					Login
				</Button>
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
	},
});

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

class SignUp extends React.Component {
	render() {
		//const userType = this.props.navigation.getParam('userType', 'consumer');
		return (
			<View>
				<TextInput placeholder={'Enter first name'} style={styles.input} />
				<TextInput placeholder={'Enter last name'} style={styles.input} />
				<TextInput placeholder={'Enter email address'} style={styles.input} />
				<TextInput
					placeholder={'Create password'}
					secureTextEntry={true}
					style={styles.input}
				/>
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
});

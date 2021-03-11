import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import firebase from 'firebase';

class LoadingScreen extends Component {
	componentDidMount() {
		this.checkIfLoggedIn();
	}

	checkIfLoggedIn = () => {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				var isPantry = false;
				firebase
					.database()
					.ref('/pantry')
					.once('value')
					.then((snapshot) => {
						for (const uid in snapshot.val()) {
							if (uid == user.uid) {
								this.props.navigation.navigate('PantryDashboardScreen', {
									pantryKey: uid,
									pantryDic: snapshot.val(),
								});
								isPantry = true;
							}
						}
						if (!isPantry) {
							this.props.navigation.navigate('DashboardScreen');
						}
					});
			} else {
				this.props.navigation.navigate('LoginScreen');
			}
		});
	};

	render() {
		return (
			<View style={styles.container}>
				<ActivityIndicator size='large' />
			</View>
		);
	}
}
export default LoadingScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
});

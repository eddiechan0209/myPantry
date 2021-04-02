import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import firebase from 'firebase';

class LoadingScreen extends Component {
	componentDidMount() {
		this.checkIfLoggedIn();
	}
	/*
		Description: Navigates to PantryDashBoardScreen, DashboardScreen, or LoginScreen based on what
		type of user is logged in or if a user is even logged in. If the user is logged in they are either:
			1. a pantry, so navigate to PantryDashboardScreen
			2. a consumer, so navigate to DashboardScreen
		Otherwise, the user is not logged in, so navigate to LoginScreen
	*/
	checkIfLoggedIn = () => {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				var isPantry = false;
				firebase
					.database()
					.ref('/pantry')
					.once('value')
					.then((snapshot) => {
						// snapshot is the data read from the /pantry database location.
						// if the user UID exists in this data, then the user is a pantry
						for (const uid in snapshot.val()) {
							if (uid == user.uid) {
								this.props.navigation.navigate('PantryDashboardScreen', {
									pantryKey: uid,
									pantryDic: snapshot.val(),
								});
								isPantry = true;
							}
						}
						// otherwise, they are a consumer
						if (!isPantry) {
							this.props.navigation.navigate('DashboardScreen');
						}
					});
				// no user is logged in, so navigate to LoginScreen
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

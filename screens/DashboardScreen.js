import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Button,
	ScrollView,
	TouchableOpacity,
	ActivityIndicator,
} from 'react-native';

import AppLoading from 'expo-app-loading';
import firebase from 'firebase';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import FlashMessage from 'react-native-flash-message';

class DashboardScreen extends Component {
	// MAP CODE REFERENCE: https://snack.expo.io/@professorxii/expo-map-and-location-example

	// State variables being used to store information that is being used by the screen
	state = {
		// Information needed for map 
		mapRegion: null,
		hasLocationPermissions: false,
		locationResult: null,

		// Information about the pantries 
		pantryKeys: [],
		pantryDic: null,

		// Information about the status of the screen 
		isReady: false,
	};

	// When the screen loads (mounts) we run seePantries and getLocationAsync 
	// 	so that we can get all the pantry information and the location of the device
	componentDidMount = () => {
		this.seePantries();
		this.getLocationAsync();
	};

	// Function that sets the map region variable in the state to the given map 
	// 	region whenever there is a change to the current map region (user moves around the map)
	handleMapRegionChange = (mapRegion) => {
		this.setState({ mapRegion });
	};

	// Getting the location of the device 
	async getLocationAsync() {
		// Checking if the device has location permissions on
		let { status } = await Permissions.askAsync(Permissions.LOCATION);
		
		// If the status is not granted then we set the location result to an error message
		if (status !== 'granted') {
			this.setState({
				locationResult: 'Permission to access location was denied',
			});
		} else {
			// If the status is granted then we set the location permissions to true in state
			this.setState({ hasLocationPermissions: true });
		}

		// Getting the current location and setting the location result to the result of the function
		let location = await Location.getCurrentPositionAsync({});
		this.setState({ locationResult: JSON.stringify(location) });

		// Center the map on the location we just fetched.
		this.setState({
			mapRegion: {
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
				latitudeDelta: 0.0922,
				longitudeDelta: 0.0421,
			},
		});
	}

	// Function that will go through firebase database and find all pantries and push 
	// them to the pantry dictionary
	seePantries = async () => {
		const pantryKeys = [];
		// Accessing firebase database 
		firebase
			.database()
			.ref('/pantry')
			.once('value')
			.then((snapshot) => {
				// Dictionary that has all pantry keys and values
				this.state.pantryDic = snapshot.val();
				
				// Adding each key to the pantryKeys variable 
				for (const key in this.state.pantryDic) {
					pantryKeys.push(key);
				}
				this.state.pantryKeys = pantryKeys;

				// Updating screen 
				this.forceUpdate();
			});
	};

	// Functoin that is used to go to pantry dashboard screen
	openPantryPage = (key) => {
		// Navigating to another screen and sending the information (key and dic)
		// 	of the pantry that was selected
		this.props.navigation.navigate('PantryDashboardScreen', {
			pantryKey: key,
			pantryDic: this.state.pantryDic,
		});
	};

	render() {
		if (!this.state.isReady) {
			return (
				<AppLoading
					startAsync={(this.seePantries, this.getLocationAsync)}
					onFinish={() => (this.state.isReady = true)}
					onError={console.warn}
				/>
			);
		}
		return (
			<View style={styles.container}>
				{/* <Text style={styles.paragraph}>Pan, zoom, and tap on the map!</Text> */}
				<View style={styles.map}>
					{this.state.locationResult === null ? (
						// <Text>Finding your current location...</Text>
						<ActivityIndicator size='large' />
					) : this.state.hasLocationPermissions === false ? (
						<Text>Location permissions are not granted.</Text>
					) : this.state.mapRegion === null ? (
						<Text>Map region doesn't exist.</Text>
					) : (
						<MapView
							style={{ alignSelf: 'stretch', height: 200 }}
							region={this.state.mapRegion}
							// missing paranthesis and parameter... Is this right?
							// onRegionChange={this.handleMapRegionChange}
						/>
					)}
				</View>

				<View style={styles.list}>
					<ScrollView>
						{this.state.pantryKeys.map((key) => {
							return (
								<Text key={key} style={styles.pantryText}>
									{'\n\n'}
									<TouchableOpacity onPress={() => this.openPantryPage(key)}>
										<Text style={styles.pantryText}>
											{this.state.pantryDic[key].pantryName}
										</Text>
									</TouchableOpacity>
								</Text>
							);
						})}
					</ScrollView>
				</View>

				<View style={styles.button}>
					<Button title='Sign out' onPress={() => firebase.auth().signOut()} />
				</View>
				<FlashMessage position='top' />
			</View>
		);
	}
}
export default DashboardScreen;

const styles = StyleSheet.create({
	container: {
		// flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		// flexDirection: 'column',
		flex: 1,
		width: '100%',
		height: '100%',
		// padding: 5,
	},
	map: {
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: '35%',
		flexDirection: 'column',
		// backgroundColor: 'green',
	},
	list: {
		width: '100%',
		height: '50%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	pantryText: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	button: {
		position: 'absolute',
		bottom: 35,
	},
});

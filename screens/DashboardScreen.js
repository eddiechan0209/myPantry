import React, { Component, useState, useEffect } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Button,
	ScrollView,
	TouchableOpacity,
	UseState,
} from 'react-native';

import { Asset } from 'expo-asset';
import AppLoading from 'expo-app-loading';
import firebase from 'firebase';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';

class DashboardScreen extends Component {
	// MAP CODE REFERENCE: https://snack.expo.io/@professorxii/expo-map-and-location-example

	state = {
		mapRegion: null,
		hasLocationPermissions: false,
		locationResult: null,
		pantryKeys: [],
		pantryDic: null,
		isReady: false,
	};

	componentDidMount = () => {
		this.seePantries();
		this.getLocationAsync();
	};

	handleMapRegionChange = (mapRegion) => {
		this.setState({ mapRegion });
	};

	async getLocationAsync() {
		let { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status !== 'granted') {
			this.setState({
				locationResult: 'Permission to access location was denied',
			});
		} else {
			this.setState({ hasLocationPermissions: true });
		}

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
			pantryKeys: this.state.pantryKeys,
			pantryDic: this.state.pantryDic,
		});
	}

	// handleClickPantries = () => {
	// 	this.props.navigation.navigate('PantryListScreen');
	// };

	seePantries = async () => {
		// console.log('seePantry()');
		const pantryKeys = [];
		firebase
			.database()
			.ref('/pantry')
			.once('value')
			.then((snapshot) => {
				this.state.pantryDic = snapshot.val();
				// console.log('snapshot: ' + this.state.pantryDic);
				for (const key in this.state.pantryDic) {
					pantryKeys.push(key);
				}
				this.state.pantryKeys = pantryKeys;
			});
		// console.log(pantryKeys);
		// console.log('---------');
		this.forceUpdate();
	};

	openPantryPage = (key) => {
		const id = this.state.pantryDic[key].dbID;
		console.log('DashboardScreen id: ' + id);
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
						<Text>Finding your current location...</Text>
					) : this.state.hasLocationPermissions === false ? (
						<Text>Location permissions are not granted.</Text>
					) : this.state.mapRegion === null ? (
						<Text>Map region doesn't exist.</Text>
					) : (
						<MapView
							style={{ alignSelf: 'stretch', height: 200 }}
							region={this.state.mapRegion}
							// missing paranthesis and parameter... Is this right?
							onRegionChange={this.handleMapRegionChange}
						/>
					)}
				</View>

				<View style={styles.list}>
					<ScrollView>
						{this.state.pantryKeys.map((key) => {
							return (
								<Text key={key}>
									{'\n\n'}
									<TouchableOpacity onPress={() => this.openPantryPage(key)}>
										<Text>{this.state.pantryDic[key].pantryName}</Text>
									</TouchableOpacity>
								</Text>
							);
						})}
					</ScrollView>
				</View>

				<View style={styles.button}>
					<Button title='Sign out' onPress={() => firebase.auth().signOut()} />
				</View>
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
		// position: 'absolute',
		// top: 0,
		// left: 0,
		// right: 0,
		// bottom: 200,
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
		// backgroundColor: 'yellow',
		// position: 'absolute',
	},
	button: {
		position: 'absolute',
		bottom: 35,
		// backgroundColor: 'orange',
	},
});

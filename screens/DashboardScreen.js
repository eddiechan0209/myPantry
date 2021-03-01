import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import firebase from 'firebase';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';

class DashboardScreen extends Component {
	// MAP CODE TAKEN FROM https://snack.expo.io/@professorxii/expo-map-and-location-example

	state = {
		mapRegion: null,
		hasLocationPermissions: false,
		locationResult: null,
	};

	componentDidMount = () => {
		this.getLocationAsync();
	};

	handleMapRegionChange = (mapRegion) => {
		// console.log(mapRegion);
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
		});
	}

	handleClickPantries = () => {
		// console.log(JSON.stringify(this.state.locationResult));
		this.props.navigation.navigate('PantryListScreen');
	};

	state = {
		dbID: this.props.navigation.getParam('dbID', ''),
	};

	render() {
		return (
			<View style={styles.container}>
				{/* <Text>DashboardScreen</Text> */}
				{/* <Text style={styles.paragraph}>Pan, zoom, and tap on the map!</Text> */}

				{this.state.locationResult === null ? (
					<Text>Finding your current location...</Text>
				) : this.state.hasLocationPermissions === false ? (
					<Text>Location permissions are not granted.</Text>
				) : this.state.mapRegion === null ? (
					<Text>Map region doesn't exist.</Text>
				) : (
					<MapView
						style={{ alignSelf: 'stretch', height: 400 }}
						region={this.state.mapRegion}
						// missing paranthesis and parameter... Is this right?
						onRegionChange={this.handleMapRegionChange}
					/>
				)}

				{/* <Text>Location: {this.state.locationResult}</Text> */}
				<Button
					title='Find Closest Pantries'
					onPress={() => this.handleClickPantries()}
				/>

				<Button
					title='Pantry Inventory Playground'
					onPress={() => {
						console.log('dashboard pressed');
						console.log(this.props.navigation.getParam('dbID', 'notPantry'));
						console.log('dashboard pressed after');
						this.props.navigation.navigate('PantryScreen');
					}}
				/>
				<Button title='Sign out' onPress={() => firebase.auth().signOut()} />
			</View>
		);
	}
}
export default DashboardScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
});

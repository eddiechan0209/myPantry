import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, LogBox } from 'react-native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import LoadingScreen from './screens/LoadingScreen';
import CreateAccountScreen from './screens/CreateAccountScreen';
import PantryDashboardScreen from './screens/PantryDashboardScreen';
import PantryOrderScreen from './screens/PantryOrderScreen';

import firebase from 'firebase';
import { firebaseConfig } from './config';
if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
} else {
	firebase.app(); // if already initialized, use that one
}

export default function App() {
	return <AppNavigator />;
}

const AppSwitchNavigator = createSwitchNavigator({
	LoadingScreen: LoadingScreen,
	LoginScreen: LoginScreen,
	DashboardScreen: DashboardScreen,
	CreateAccountScreen: CreateAccountScreen,
	PantryDashboardScreen: PantryDashboardScreen,
	PantryOrderScreen: PantryOrderScreen,
});

const AppNavigator = createAppContainer(AppSwitchNavigator);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import Header from './Header';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import DashboardScreen from './screens/DashboardScreen';

const Tab = createMaterialTopTabNavigator();

function MyTabs() {
	return (
		<Tab.Navigator
			initialRouteName='Login'
			tabBar={(props) => <Header {...props} />}
			// activeTintColor='#577a3b'
			// inactiveTintColor='#f2f2f2'
		>
			<Tab.Screen name='Login' component={Login} />
			<Tab.Screen name='Sign-Up' component={SignUp} />
		</Tab.Navigator>
	);
}

const BottomTabs = createMaterialBottomTabNavigator();

function MyBottomTabs() {
	return (
		<BottomTabs.Navigator>
			<BottomTabs.Screen name='Login' component={MyTabs} />
			<BottomTabs.Screen name='Home' component={DashboardScreen} />
		</BottomTabs.Navigator>
	);
}

export default function App() {
	return (
		<View style={styles.container}>
			<NavigationContainer>
				<MyBottomTabs />
			</NavigationContainer>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// backgroundColor: '#e0e0e0',
		backgroundColor: '#e0e0e0',
		flexDirection: 'column',
	},
	childContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	header: {
		// backgroundColor: 'cyan',
		width: '100%',
	},
});

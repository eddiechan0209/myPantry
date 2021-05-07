import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Header from './Header';
import Login from './screens/Login';
import SignUp from './screens/SignUp';

const Tab = createMaterialTopTabNavigator();

function MyTabs() {
	return (
		<Tab.Navigator
			initialRouteName='Login'
			tabBar={Header}
			activeTintColor='#577a3b'
			inactiveTintColor='#f2f2f2'
		>
			<Tab.Screen name='Login' component={Login} />
			<Tab.Screen name='Sign-Up' component={SignUp} />
		</Tab.Navigator>
	);
}

export default function App() {
	return (
		<NavigationContainer>
			<MyTabs />
		</NavigationContainer>
	);
}

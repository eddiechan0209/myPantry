import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import Header from './Header';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import DashboardScreen from './screens/DashboardScreen';

import firebase from 'firebase';
import { firebaseConfig } from './config';
if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
} else {
	firebase.app(); // if already initialized, use that one
}

/*
	Helpful Links for Navigation:
	https://reactnavigation.org/docs/tab-based-navigation/
	https://reactnavigation.org/docs/nesting-navigators/
	https://reactnavigation.org/docs/material-bottom-tab-navigator note: TopTab navigation is the sameish
	Example: https://snack.expo.io/?platform=android&name=&dependencies=%40expo%2Fvector-icons%40*%2C%40react-native-community%2Fmasked-view%40*%2C%40react-navigation%2Fbottom-tabs%40%5E5.8.0%2C%40react-navigation%2Fdrawer%40%5E5.9.0%2C%40react-navigation%2Fmaterial-bottom-tabs%40%5E5.2.16%2C%40react-navigation%2Fmaterial-top-tabs%40%5E5.2.16%2C%40react-navigation%2Fnative%40%5E5.7.3%2C%40react-navigation%2Fstack%40%5E5.9.0%2Creact-native-paper%40%5E4.0.1%2Creact-native-reanimated%40*%2Creact-native-safe-area-context%40*%2Creact-native-gesture-handler%40*%2Creact-native-screens%40*%2Creact-native-tab-view%40%5E2.15.1&hideQueryParams=true&sourceUrl=https%3A%2F%2Freactnavigation.org%2Fexamples%2F5.x%2Fcustom-tab-bar.js
	Example: https://dev.to/codekagei/react-native-custom-tab-component-reactnative-navigation-1d39
*/

/*
	LoginComp()
	functional componenet which contains the login/signup tabs
*/
const LoginTabs = createMaterialTopTabNavigator();

function LoginComp() {
	return (
		<LoginTabs.Navigator
			initialRouteName='Login'
			tabBar={(props) => <Header {...props} />}
			// activeTintColor='#577a3b'
			// inactiveTintColor='#f2f2f2'
		>
			<LoginTabs.Screen name='Login' component={Login} />
			<LoginTabs.Screen name='Sign-Up' component={SignUp} />
		</LoginTabs.Navigator>
	);
}

/*
	MainNavigation()
	functional componenet which acts as the main navigation, including other types of navigation
*/
const BottomTabs = createMaterialBottomTabNavigator();

function MainNavigation() {
	return (
		<BottomTabs.Navigator barStyle={{ backgroundColor: '#577a3b' }}>
			<BottomTabs.Screen name='Login' component={LoginComp} />
			<BottomTabs.Screen name='Home' component={DashboardScreen} />
		</BottomTabs.Navigator>
	);
}

export default function App() {
	return (
		<View style={styles.container}>
			<NavigationContainer>
				<MainNavigation />
			</NavigationContainer>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// backgroundColor: '#e0e0e0',
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

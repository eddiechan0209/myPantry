import React from 'react';
import { StyleSheet, View } from 'react-native';
import Navigation from './index';

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

// export default function App() {
// 	return <AppNavigator />;
// }

// const AppSwitchNavigator = createSwitchNavigator({
// 	LoadingScreen: LoadingScreen,
// 	LoginScreen: LoginScreen,
// 	DashboardScreen: DashboardScreen,
// 	CreateAccountScreen: CreateAccountScreen,
// 	PantryDashboardScreen: PantryDashboardScreen,
// 	PantryOrderScreen: PantryOrderScreen,
// });

// const AppNavigator = createAppContainer(AppSwitchNavigator);

export default function App() {
	return (
		<View style={styles.container}>
			<Navigation />
		</View>
	);
}

// const DrawerNav = createDrawerNavigator(
// 	{
// 		Home: AppSwitchNavigator,
// 	},
// 	{
// 		contentComponent: Navigation,
// 	}
// );

// const AppContainer = createAppContainer(DrawerNav);
// export default class App extends Component {
// 	render() {
// 		return (
// 			<View style={styles.container}>
// 				<AppContainer />
// 			</View>
// 		);
// 	}
// }

const styles = StyleSheet.create({
	container: {
		flex: 1,
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

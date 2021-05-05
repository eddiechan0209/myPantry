import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// move to this

// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

// import { NavigationContainer } from '@react-navigation/native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';

import Header from './Header';
import Login from './screens/Login';
import SignUp from './screens/SignUp';

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

const LoginTabNavigator = createMaterialTopTabNavigator(
	{
		Login: {
			screen: Login,
		},
		SignUp: {
			screen: SignUp,
		},
	},
	{
		tabBarComponent: Header,
		tabBarOptions: {
			activeTintColor: '#577a3b',
			inactiveTintColor: '#f2f2f2',
		},
		initialRouteName: 'Login',
	}
);

// const Tab = createMaterialBottomTabNavigator();

// function MyTabs() {
// 	return (
// 		<Tab.Navigator>
// 			<Tab.Screen name='Home' component={PantryDashboardScreen} />
// 			<Tab.Screen name='Settings' component={DashboardScreen} />
// 		</Tab.Navigator>
// 	);
// }

// const Tab = createMaterialBottomTabNavigator();

// function MyTabs() {
// 	return (
// 		<Tab.Navigator>
// 			<Tab.Screen name='Home' component={PantryDashboardScreen} />
// 			<Tab.Screen name='Settings' component={DashboardScreen} />
// 		</Tab.Navigator>
// 	);
// }

// function MyTabs() {
// 	return (
// 		<NavigationContainer>
// 			<Tab.Navigator
// 				screenOptions={({ route }) => ({
// 					tabBarIcon: ({ focused, color, size }) => {
// 						let iconName;

// 						if (route.name === 'Home') {
// 							iconName = focused
// 								? 'ios-information-circle'
// 								: 'ios-information-circle-outline';
// 						} else if (route.name === 'Settings') {
// 							iconName = focused ? 'ios-list-box' : 'ios-list';
// 						}

// 						// You can return any component that you like here!
// 						return <Ionicons name={iconName} size={size} color={color} />;
// 					},
// 				})}
// 				tabBarOptions={{
// 					activeTintColor: 'tomato',
// 					inactiveTintColor: 'gray',
// 				}}
// 			>
// 				<Tab.Screen name='Home' component={HomeScreen} />
// 				<Tab.Screen name='Settings' component={SettingsScreen} />
// 			</Tab.Navigator>
// 		</NavigationContainer>
// 	);
// }

const Navigation = createAppContainer(LoginTabNavigator);

export default Navigation;

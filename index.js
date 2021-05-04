import { createAppContainer } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import Header from './Header';
import Login from './screens/Login';
import SignUp from './screens/SignUp';

const TabNavigator = createMaterialTopTabNavigator(
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
			activeTintColor: 'black',
			inactiveTintColor: '#f2f2f2',
		},
		initialRouteName: 'Login',
	}
);

const Navigation = createAppContainer(TabNavigator);

export default Navigation;

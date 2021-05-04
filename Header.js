import React from 'react';

import {
	View,
	Text,
	StyleSheet,
	TouchableWithoutFeedback,
	Image,
} from 'react-native';
import logo from './images/logo.png';

const Header = (props) => {
	const {
		navigationState,
		navigation,
		activeTintColor,
		inactiveTintColor,
	} = props;
	const activeTabIndex = navigation.state.index;

	return (
		<View style={styles.containerHeader}>
			<View style={styles.logoWrapper}>
				<Image style={styles.logo} source={logo} />
			</View>

			<View style={styles.tabContainer}>
				{navigationState.routes.map((route, index) => {
					const isRouteActive = index === activeTabIndex;
					const tintColor = isRouteActive ? activeTintColor : inactiveTintColor;

					return (
						<TouchableWithoutFeedback
							onPress={() => navigation.navigate(route.routeName)}
							key={route.routeName}
						>
							<View style={styles.centerLines}>
								<Text
									style={{
										fontSize: 17,
										textTransform: 'uppercase',
										fontWeight: `${isRouteActive ? 'bold' : 'normal'}`,
									}}
								>
									{route.routeName}
								</Text>
								<View
									style={{
										justifyContent: 'center',
										flex: 1,
										width: '200%',
										borderRadius: 50,
										backgroundColor: `${tintColor}`,
									}}
								></View>
							</View>
						</TouchableWithoutFeedback>
					);
				})}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	containerHeader: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#f2f2f2',
		height: '33%',
		borderRadius: 30,
	},
	// textContainer: {
	// 	marginVertical: 30,
	// 	paddingTop: 30,
	// },
	logo: {
		resizeMode: 'contain',
		height: '75%',
	},
	logoWrapper: {
		paddingTop: 50,
	},
	tabContainer: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		paddingHorizontal: 10,
		alignItems: 'center',
		height: 40,
		paddingBottom: 15,
	},
	centerLines: {
		justifyContent: 'space-evenly',
		alignItems: 'center',
	},
	rectangle: {},
});
export default Header;

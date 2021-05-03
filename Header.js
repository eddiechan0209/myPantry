import React from 'react';

import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';

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
			<View style={styles.textContainer}>
				<Text style={styles.logo}>MyPantry</Text>
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
							<View>
								<Text
									style={{
										fontSize: 17,
										textTransform: 'uppercase',
										color: `${tintColor}`,
										fontWeight: `${isRouteActive ? 'bold' : 'normal'}`,
									}}
								>
									{route.routeName}
								</Text>
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
		borderRadius: 15,
	},
	textContainer: {
		marginVertical: 30,
		paddingTop: 30,
	},
	logo: {
		color: 'green',
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
});
export default Header;

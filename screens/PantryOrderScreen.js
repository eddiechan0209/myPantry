import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

class PantryOrderScreen extends Component {
	_isMounted = false;
	state = { pantryInfo: {}, pantryDic: null, pantryKey: null };

	// Setting state variables to information that was given in the last screen 
	componentDidMount = () => {
		this._isMounted = true;
		if (this._isMounted) {
			this.setState({
				// this.props.navigation.getParam gives you any variables that were 
				// 	given after you navigated from the last screen
				pantryInfo: this.props.navigation.getParam('pantryInfo', null),
				pantryDic: this.props.navigation.getParam('pantryDic', null),
				pantryKey: this.props.navigation.getParam('pantryKey', null),
			});
		}
	};

	// Setting isMounted variable to false after we leave the screen
	// ismMounted used to save the state of the screen
	componentWillUnmount() {
		this._isMounted = false;
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<View style={styles.backPage}>
						<AntDesign
							name='left'
							size={24}
							color='black'
							position='absolute'
							onPress={() => {
								this.props.navigation.navigate('PantryDashboardScreen', {
									pantryKey: this.state.pantryKey,
									pantryDic: this.state.pantryDic,
								});
							}}
						/>
					</View>
					<View style={styles.title}>
						<Text style={styles.titleText}>Orders:</Text>
					</View>
				</View>

				<View style={styles.boxes}>
					{this.state.pantryInfo === {} ? (
						<Text>Getting Orders...</Text>
					) : this.state.pantryInfo.orders === (null || undefined) ? (
						<Text>No Orders</Text>
					) : (
						Object.values(this.state.pantryInfo.orders).map((order) => {
							return (
								<View>
									<View style={styles.box}>
										<View style={styles.inner}>
											<Text key={order.name} style={styles.bold}>
												{order.name}:
											</Text>
											{Object.values(order.orderInventory).map((json) => {
												return (
													<Text key={json.name}>
														{json.name}
														{', '}
														{json.quantity}
														{/* Replace X with an image when possible */}
													</Text>
												);
											})}
										</View>
									</View>
								</View>
							);
						})
					)}
				</View>
			</View>
		);
	}
}
export default PantryOrderScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	bold: { fontWeight: 'bold' },
	header: {
		width: '100%',
		height: '15%',
		justifyContent: 'center',
		textAlign: 'center',
		alignItems: 'center',
	},
	boxes: {
		width: '100%',
		height: '75%',
		// padding: 5,
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	box: {
		width: '100%',
		height: '33%',
		padding: 5,
		alignItems: 'center',
		justifyContent: 'center',
	},
	inner: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	backPage: {
		...StyleSheet.absoluteFillObject,
		alignSelf: 'flex-end',
		marginTop: 50,
		marginLeft: 20,
	},
	title: {
		marginTop: 30,
	},
	titleText: {
		fontSize: 30,
	},
});

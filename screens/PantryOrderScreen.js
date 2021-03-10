import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

class PantryOrderScreen extends Component {
	state = { pantryInfo: {}, pantryDic: null, pantryKey: null };

	componentDidMount = () => {
		console.log('---componentDidMount()---');
		console.log(this.props.navigation.getParam('pantryInfo', null));
		this.setState({
			pantryInfo: this.props.navigation.getParam('pantryInfo', null),
			pantryDic: this.props.navigation.getParam('pantryDic', null),
			pantryKey: this.props.navigation.getParam('pantryKey', null),
		});
	};

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
											<Text style={fontWeight: 'bold'}>{order.name}:</Text>
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
		// alignItems: 'center',
		// justifyContent: 'center',
	},
	// container: {
	// 	flex: 1,
	// },
	header: {
		width: '100%',
		height: '15%',
		justifyContent: 'center',
		textAlign: 'center',
		alignItems: 'center',
		// backgroundColor: 'gray',
	},
	boxes: {
		width: '100%',
		height: '75%',
		// padding: 5,
		flexDirection: 'row',
		flexWrap: 'wrap',
		// backgroundColor: '#eee',
	},
	box: {
		width: '100%',
		height: '33%',
		padding: 5,
		// backgroundColor: 'orange',
		alignItems: 'center',
		justifyContent: 'center',
	},
	inner: {
		// backgroundColor: 'gray',
		alignItems: 'center',
		justifyContent: 'center',
	},
	footer: {
		width: '100%',
		height: '10%',
		bottom: 20,
	},
	backPage: {
		...StyleSheet.absoluteFillObject,
		alignSelf: 'flex-end',
		marginTop: 50,
		marginLeft: 20,
		// position: 'absolute',
	},
	title: {
		marginTop: 30,
	},
	titleText: {
		fontSize: 30,
	},
});

import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

class PantryOrderScreen extends Component {

   

    state = {pantryInfo: null}

    componentDidMount = () => {
		console.log('---componentDidMount()---');
        console.log(this.props.navigation.getParam('pantryInfo', null));
        this.setState({pantryInfo: this.props.navigation.getParam('pantryInfo', null)})
    }

	render() {
		return (
			<View>
						<View>
							<View style={styles.backPage}>
								<AntDesign
									name='left'
									size={24}
									color='black'
									position='absolute'
									onPress={() => {
										this.toggleModalVisibility(4);
									}}
								/>
							</View>
							<View>
								<Text>Orders: </Text>
							</View>
							<View style={styles.row}>
								{this.state.pantryInfo === {} ? (
									<Text>Getting Orders...</Text>
								) : this.state.pantryInfo.orders === (null || undefined) ? (
									<Text>No Orders</Text>
								) : (
									Object.values(this.state.pantryInfo.orders).map((order) => {
										return (
											<View>
												<Text>{order.name};</Text>
												{Object.values(order.orderInventory).map((json) => {
													return (
														<View style={styles.box}>
															<View style={styles.inner}>
																<Text key={json.name}>
																	{'\n'}
																	{json.name}
																	{', '}
																	{json.quantity}
																	{/* Replace X with an image when possible */}
																</Text>
															</View>
														</View>
													);
												})}
											</View>
										);
									})
								)}
							</View>
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
    container: {
		flex: 1,
	},
	header: {
		width: '100%',
		height: '15%',
		justifyContent: 'center',
		textAlign: 'center',
		alignItems: 'center',
		// backgroundColor: 'gray',
	},
	// boxes: {
	// 	width: '100%',
	// 	height: '75%',
	// 	// padding: 5,
	// 	flexDirection: 'row',
	// 	flexWrap: 'wrap',
	// 	// backgroundColor: '#eee',
	// },
	// box: {
	// 	width: '33%',
	// 	height: '33%',
	// 	padding: 5,
	// 	// backgroundColor: 'orange',
	// 	alignItems: 'center',
	// 	justifyContent: 'center',
	// },
	// inner: {
	// 	// backgroundColor: 'gray',
	// 	alignItems: 'center',
	// 	justifyContent: 'center',
	// },
	// footer: {
	// 	width: '100%',
	// 	height: '10%',
	// 	bottom: 20,
	// },
    backPage: {
		...StyleSheet.absoluteFillObject,
		alignSelf: 'flex-end',
		marginTop: 50,
		marginLeft: 20,
		// position: 'absolute',
	},
});

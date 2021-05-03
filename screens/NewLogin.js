import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Header from './components/Header';

export default function App() {
	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Header />
			</View>
			<View style={styles.childContainer}>
				<Text style={{ fontSize: 30 }}>I am badass 🐐🐐🐐</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#eef',
		flexDirection: 'column',
	},
	childContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: 100,
	},
	header: {
		backgroundColor: 'cyan',
		width: '100%',
		height: '15%',
	},
});

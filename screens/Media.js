import React from 'react';
import { View, Text } from 'react-native';

class Media extends React.Component {
	render() {
		return (
			<View
				style={{ justifyContent: 'center', alignItems: 'center', height: 400 }}
			>
				<Text>I am the Media Screen</Text>
			</View>
		);
	}
}

export default Media;

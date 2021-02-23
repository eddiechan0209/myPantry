import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';
import firebase from 'firebase';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';

class InputPantryInfoScreen extends Component {

    addValuesToPantry(){
        // NEED TO ADD THE VALUES IN STATE TO THE PANTRY IF NOT EMPTY 

    }

    state = {
        dbID: '6033670df94993f43908e153',   
        itemName: '',
        itemQuantity: '',
    };
	render() {
		return (
			<View style={styles.container}>
				<TextInput
                    value={this.state.itemName}
                    onChangeText={(itemName) => this.setState({ itemName })}
                    placeholder={'Item Name'}
                    style={styles.input}
                />
                <TextInput
                    value={this.state.itemQuantity}
                    onChangeText={(itemQuantity) => this.setState({ itemQuantity })}
                    placeholder={'Item Quantity'}
                    style={styles.input}
                />

                <Button title='Add Values' onPress={() => this.addValuesToPantry()}/> 
                    

				<Button title='Sign out' onPress={() => firebase.auth().signOut()} />
				<Button
					title='Back to Pantry View'
					onPress={() => {
						console.log('dashboard pressed');
						console.log(this.props.navigation.getParam('dbID', 'notPantry'));
						console.log('dashboard pressed after');
						this.props.navigation.navigate('PantryScreen', {
							dbID: this.props.navigation.getParam('dbID', 'notPantry'),
						});
					}}
				/>
			</View>
		);
	}
}
export default InputPantryInfoScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
    input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
});

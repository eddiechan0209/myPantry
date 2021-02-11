import React, { Component, useState, useEffect } from "react";
import { 
    View,
    Text,
    StyleSheet,
    Button
} from "react-native";
import firebase from "firebase";
import * as Permissions from 'expo-permissions'
import * as Location from 'expo-location'
import MapView, { Marker, Callout, CalloutSubview } from 'react-native-maps'

class DashboardScreen extends Component {
    
    // Need to access locations of pantries from firebase
    
    state = {
        mapRegion: null,
        hasLocationPermissions: false,
        locationResult: null
      };
    
    componentDidMount = () => {
        this.getLocationAsync();
    }
    
    handleMapRegionChange = (mapRegion) =>{
        console.log(mapRegion);
        this.setState({ mapRegion });
    }

    async getLocationAsync (){
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
          this.setState({
            locationResult: 'Permission to access location was denied',
          });
        } else {
          this.setState({ hasLocationPermissions: true });
        }
    
    let location = await Location.getCurrentPositionAsync({});
    this.setState({ locationResult: JSON.stringify(location) });
    
    // Center the map on the location we just fetched.
        this.setState({mapRegion: { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }});
    }

    handleClickPantries = () => {
        // Test to see if a marker can be created on button press
        <MapView.Marker
            coordinate={{latitude: 37.785834,
                longitude: -122.406417,}}
            title={"marker.title"}
            description={"desss"}
        />
        console.log(this.state.locationResult)
    }

    render() {
        return (
            
            <View style={styles.container}>
                <Text>DashboardScreen</Text>
                <Text style={styles.paragraph}>
                Pan, zoom, and tap on the map!
                </Text>

                {
                this.state.locationResult === null ?
                <Text>Finding your current location...</Text> :
                this.state.hasLocationPermissions === false ?
                    <Text>Location permissions are not granted.</Text> :
                    this.state.mapRegion === null ?
                    <Text>Map region doesn't exist.</Text> :
                    <MapView
                    style={{ alignSelf: 'stretch', height: 400 }}
                    region={this.state.mapRegion}
                    onRegionChange={this.handleMapRegionChange}                 
                    >   
                        <Marker coordinate={{ latitude: 37.78583399999998, longitude:-122.40641700000003 }} />
                    </MapView>
                    
                }
                
                <Text>
                Location: {this.state.locationResult}
                </Text>
                <Button title="Find Closest Pantries" onPress={()=> this.handleClickPantries()}/>
                <Button title="Sign out" onPress={() => firebase.auth().signOut()}/>
            </View>
        );
    }
}
export default DashboardScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
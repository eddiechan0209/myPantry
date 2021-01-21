import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Button
} from "react-native";
import * as Google from 'expo-google-app-auth';

class LoginScreen extends Component {

    signInWithGoogleAsync = async () =>{
        try {
            const result = await Google.logInAsync({
                behavior:'web',
                // androidClientId: YOUR_CLIENT_ID_HERE,
                iosClientId: '741826228014-6v6pvpap9is4iak9n4ala7p4l1ltt08c.apps.googleusercontent.com',
                scopes: ['profile', 'email'],
            });

            if (result.type === 'success') {
            return result.accessToken;
            } else {
            return { cancelled: true };
            }
        } catch (e) {
            return { error: true };
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Button
                title="Sign in with Google"
                onPress={() => this.signInWithGoogleAsync()}
                />
                {/* <Button
                title="Sign in with Google"
                onPress={() => alert("uh oh")}
                /> */}
            </View>
        );
    }
}
export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
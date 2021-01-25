import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    Image
} from "react-native";

class CreateAccountScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>I am a...</Text>

                {/* <View style={styles.sign}>
                    <TouchableOpacity 
                        style={styles.createAccountButton}
                        onPress={() => this.props.navigation.navigate('CreateAccountScreen')}>
                            <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.createSignInButton}
                        onPress={() => this.signInWithGoogleAsync()}>
                            <Text style={styles.buttonText}>SIGN IN</Text>
                    </TouchableOpacity>
                </View> */}
            </View>
        );
    }
}
export default CreateAccountScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    sign: {
        justifyContent: 'flex-end',
        marginBottom: 100,
        position: 'absolute',
        bottom:0
    },
    createAccountButton: {
        elevation: 8,
        // backgroundColor: "green",
        borderRadius: 40,               // how curvy the button is
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginBottom: 5               //space between buttons
    },
    createSignInButton: {
        elevation: 8,
        // backgroundColor: "#FFFFFF",
        borderRadius: 40,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginTop: 5            
    },
    buttonText: {
        fontSize: 20,
        color: "black",
        justifyContent: 'center',
        textAlign: 'center'

    }
});
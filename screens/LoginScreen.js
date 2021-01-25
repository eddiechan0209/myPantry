import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    Image,
} from "react-native";
import * as Google from 'expo-google-app-auth';
import firebase from "firebase"
import logo from './images/MyPantryLogo.png';
import moveToBottom from '..//utils/moveToBottom';
import { TouchableOpacity } from "react-native-gesture-handler";

class LoginScreen extends Component {

    onSignIn = googleUser =>{
        console.log('Google Auth Response', googleUser);
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser){
          unsubscribe();
          // Check if we are already signed-in Firebase with the correct user.
          if (!this.isUserEqual(googleUser, firebaseUser)) {
            // Build Firebase credential with the Google ID token.
            var credential = firebase.auth.GoogleAuthProvider.credential(
                googleUser.idToken,
                googleUser.accessToken
                );
      
            // Sign in with credential from the Google user.
            firebase.auth().signInWithCredential(credential).then(function(result){
                console.log("user signed in");
                if(result.additionalUserInfo.isNewUser){           
                    firebase
                    .database()
                    .ref("/users/" + result.user.uid)
                    .set({
                        gmail: result.user.email,
                        profile_picture: result.additionalUserInfo.profile.picture,
                        locale: result.additionalUserInfo.profile.locale,
                        first_name: result.additionalUserInfo.profile.given_name,
                        last_name: result.additionalUserInfo.profile.family_name,
                        created_at: Date.now()

                    })
                    .then(function(snapshot){

                    });
                }
                else{
                    firebase
                    .database()
                    .ref("/users/" + result.user.uid).update({
                        last_logged_in: Date.now()
                    })
                }

            })
            .catch((error) => {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              // ...
            });
          } else {
            console.log('User already signed-in Firebase.');
          }
        }.bind(this)
        );
    }

    isUserEqual = (googleUser, firebaseUser) =>{
        if (firebaseUser) {
          var providerData = firebaseUser.providerData;
          for (var i = 0; i < providerData.length; i++) {
            if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                providerData[i].uid === googleUser.getBasicProfile().getId()) {
              // We don't need to reauth the Firebase connection.
              return true;
            }
          }
        }
        return false;
    }
      
    signInWithGoogleAsync = async () =>{
        try {
            const result = await Google.logInAsync({
                behavior:'web',
                // androidClientId: YOUR_CLIENT_ID_HERE,
                iosClientId: '741826228014-6v6pvpap9is4iak9n4ala7p4l1ltt08c.apps.googleusercontent.com',
                scopes: ['profile', 'email'],
            });

            if (result.type === 'success') {
                this.onSignIn(result);
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
                <View>
                    <Image
                    style={styles.logo}
                    source={logo}
                    />
                </View>
                <View style={styles.sign}>
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
                </View>
            </View>
        );
    }
}
export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo:{
        
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
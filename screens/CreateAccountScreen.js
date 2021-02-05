import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    Alert,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import SignUpButton from "./utils/SignUpButtons";
import { AntDesign } from '@expo/vector-icons';
import firebase from "firebase";


class CreateAccountScreen extends Component {   

    // onSignIn = () =>{
    //     var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser){
    //       unsubscribe();
    //       // Check if we are already signed-in Firebase with the correct user.
    //       if (signed in with email in firebase) {
    //         // Build Firebase credential with the Google ID token.
    //         var credential = firebase.auth.GoogleAuthProvider.credential(
    //             googleUser.idToken,
    //             googleUser.accessToken
    //             );
      
    //         // Sign in with credential from the Google user.
    //         firebase.auth().signInWithCredential(credential).then(function(result){
    //             console.log("user signed in");
    //             if(result.additionalUserInfo.isNewUser){           
    //                 firebase
    //                 .database()
    //                 .ref("/users/" + result.user.uid)
    //                 .set({
    //                     email: result.user.email,
    //                     profile_picture: result.additionalUserInfo.profile.picture,
    //                     locale: result.additionalUserInfo.profile.locale,
    //                     first_name: result.additionalUserInfo.profile.given_name,
    //                     last_name: result.additionalUserInfo.profile.family_name,
    //                     created_at: Date.now()

    //                 })
    //                 .then(function(snapshot){

    //                 });
    //             }
    //             else{
    //                 firebase
    //                 .database()
    //                 .ref("/users/" + result.user.uid).update({
    //                     last_logged_in: Date.now()
    //                 })
    //             }

    //         })
    //         .catch((error) => {
    //           // Handle Errors here.
    //           var errorCode = error.code;
    //           var errorMessage = error.message;
    //           // The email of the user's account used.
    //           var email = error.email;
    //           // The firebase.auth.AuthCredential type that was used.
    //           var credential = error.credential;
    //           // ...
    //         });
    //       } else {
    //         console.log('User already signed-in Firebase.');
    //       }
    //     }.bind(this)
    //     );
    // }

    renderUserInfoPrompt = () => {
        // userType will be passed during navigation (consumer is just default)
        const userType =  this.props.navigation.getParam('userType', 'consumer')
        if(userType == "consumer"){
            console.log("consumer line")
            return(
                <View style={styles.container}>
                    <TextInput
                    value={this.state.firstname}
                    onChangeText={(firstname) => this.setState({ firstname })}
                    placeholder={'Enter first name'}
                    style={styles.input}
                    />
                    <TextInput
                    value={this.state.lastname}
                    onChangeText={(lastname) => this.setState({ lastname })}
                    placeholder={'Enter last name'}
                    style={styles.input}
                    />
                    <TextInput
                    value={this.state.emailaddress}
                    onChangeText={(emailaddress) => this.setState({ emailaddress })}
                    placeholder={'Enter email address'}
                    style={styles.input}
                    />
                    <TextInput
                    value={this.state.password}
                    onChangeText={(password) => this.setState({ password })}
                    placeholder={'Create password'}
                    secureTextEntry={true}
                    style={styles.input}
                    />
                    
                    <Button
                    title={'Enter'}
                    style={styles.input}
                    onPress={this.onLogin.bind(this)}
                    />
                </View>
            )
        }
        else{
            console.log("pantry line")
        }
    }

    onLogin = () => {
        const {firstname, lastname, emailaddress, password } = this.state;
    
        Alert.alert('Credentials', `${firstname} + ${lastname} + ${emailaddress} + ${password}`);
      }
    
    state = {firstname: "", lastname: "", emailaddress: "", password: ""};

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.back}>
                    <AntDesign name="left" size={24} color="black" position="absolute"
                    onPress={() => this.props.navigation.navigate('LoginScreen')}/>
                </View>

                {this.renderUserInfoPrompt() }
            </View>
        );
    }
}
export default CreateAccountScreen;

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     alignItems: 'center',
    //     justifyContent: 'center'
    // },
    text: {
        justifyContent: 'flex-start',
        marginTop: 100,
        position: 'absolute',
        top:0,
    },
    sign: {
        justifyContent: 'flex-end',
        marginBottom: 100,
        position: 'absolute',
        bottom:0
    },
    buttonText: {
        fontSize: 20,
        color: "black",
        justifyContent: 'center',
        textAlign: 'center'

    },
    back:{
        ...StyleSheet.absoluteFillObject,
        alignSelf: 'flex-end',
        marginTop: 50,
        marginLeft: 15,
        // position: 'absolute',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
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
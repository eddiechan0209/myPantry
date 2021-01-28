import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

class CreateAccountScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>I am a...</Text>

                <View>
                    <TouchableOpacity 
                        style={styles.createAccountButton}
                        onPress={() => this.props.navigation.navigate('CreateAccountScreen')}>
                            <Text style={styles.buttonText}>PANTRY</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.createAccountButton}
                        onPress={() => this.props.navigation.navigate('CreateAccountScreen')}>
                            <Text style={styles.buttonText}>CONSUMER</Text>
                    </TouchableOpacity>
                </View>
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

    }
});
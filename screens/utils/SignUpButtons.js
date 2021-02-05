import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

class SignUpButton extends React.Component {

  toggleInit = () => {
    this.setState({user_type: "init"});
  };

  togglePantry = () => {
    this.setState({user_type: "pantry"});
  };

  toggleConsumer = () => {
    this.setState({user_type: "consumer"});
  };

  state = {user_type: "init"};
  
  render() {
    if(this.state.user_type == "init"){
      return (
        <View style={styles.container}>
          <TouchableOpacity 
              onPress={this.togglePantry}>
              <Text>Pantry</Text>
          </TouchableOpacity>
          <TouchableOpacity 
              onPress={this.toggleConsumer}>
              <Text>Consumer</Text>
          </TouchableOpacity>
          <Text>Main Page</Text>
        </View>
      );
    }
    else if (this.state.user_type == "pantry"){
      return (
        <View style={styles.container}>
          <TouchableOpacity 
              onPress={this.toggleInit}>
              <Text>{"<----"}</Text>
          </TouchableOpacity>
          <Text>pantry Page</Text>
        </View>
      );
    }
    else if (this.state.user_type == "consumer"){
      return (
        <View style={styles.container}>
          <TouchableOpacity 
              onPress={this.toggleInit}>
              <Text>{"<----"}</Text>
          </TouchableOpacity>
          <Text>consumder page</Text>
        </View>
      );
    } 
    else{
      console.log("error")
    }
  }
}

export default SignUpButton;

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
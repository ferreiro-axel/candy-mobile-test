
import React,{ Component} from 'react';
import { StyleSheet, Text, View,StatusBar } from 'react-native';
import { Appbar,Button } from 'react-native-paper';
import firebase from 'firebase';
import * as Google from 'expo-google-app-auth';
import 'firebase/firestore';
import CandyList from './components/CList';
import { YellowBox } from 'react-native';
import _ from 'lodash';
import { StackNavigator } from 'react-navigation';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

const firebaseConfig = {
  //your firebaseConfig
  };

const AndroidClient="71554593645-a6cn0hdn11pbnu8muqr0fe1gogem16mc.apps.googleusercontent.com";

async function signInWithGoogleAsync(){
  try {
    const result = await Google.logInAsync({
      androidClientId: AndroidClient,
      androidStandaloneAppClientId:'71554593645-7gvgpn6f3nnoke50uc88in3kv26vj238.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
    });

    if (result.type === 'success') {
      var credential = firebase.auth.GoogleAuthProvider.credential(result.idToken, result.accessToken);
         firebase.auth().signInWithCredential(credential).then(function(result){
           console.log(result);
        });
    } else {
      return { cancelled: true };
    }
  } catch (e) {
    return { error: true };
  }
}

firebase.initializeApp(firebaseConfig);

export default class App extends Component {
  state = {
    user:null,
    candy_name:'',
    candies:[],
    currentView:''
  }

  componentWillMount(){
    firebase.auth().onAuthStateChanged(
      user=>{
          if(user){
            this.setState({user})
            this.getCandy()
          }else{
            this.setState({user:null})
            }
        }
    )
  }

  handleChange = name => (e, { newValue } = {}) => {
    const value = newValue || e.target.value;
    const errors = {
      ...this.state.errors,
      username: '',
    };
    this.setState({ [name]: value, errors });
  }

  getCandy=()=>{
    console.log('hi!')
    var db=firebase.firestore();
    db.collection('candies').get().then((querySnapshot) => {
      var x=[];
      querySnapshot.forEach((doc) => {
          x.push(doc.data())
      });
      this.setState({candies:x})
      console.log(this.state.candies)
    });
  }

  handleLogOut () {
    firebase.auth().signOut()
      .then(result=>console.log('desconectado'))
      .catch(err=>console.log(err.message))
  }

  render() {
    return(
      <View style={{ flex: 1, marginTop: StatusBar.currentHeight }}>
        <Appbar>
          {this.state.user!=null?<Appbar.Action icon="account" />:<Appbar.Action icon="account-alert" onPress={signInWithGoogleAsync.bind(this)} />}
        </Appbar>
        <CandyList candies={this.state.candies}/>
      </View>
    );
  }
}

import React,{ Component} from 'react';
import { List } from 'react-native-paper';
import { View,Text } from 'react-native';

class CandyList extends Component {

  render(){
    return(
        <View>
            {this.props.candies.map((i,p)=>{
                    return <List.Item key={p} title={i.name}/>
            })}
        </View>
      );
    }
}

export default CandyList;

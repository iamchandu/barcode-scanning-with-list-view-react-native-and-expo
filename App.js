import React from 'react';
import { StyleSheet, Text, View,ScrollView, Alert, Vibration } from 'react-native';
import { ListItem, List } from 'react-native-elements';
import { BarCodeScanner, Permissions } from 'expo';

export default class App extends React.Component {
  state = {
    hasCameraPermission: null,
    barcodesListShow : [],
    barcodesList : []
  };

  async componentWillMount() {
    const { status } =await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasCameraPermission:status==='granted'});
 }

  render() {
    return (
      <View style={styles.container}>
          <View>
              {this.state.hasCameraPermission === null ?
              <Text>Requesting for camera permission</Text> :
              this.state.hasCameraPermission === false ?
                  <Text>Camera permission is not granted</Text> :
                  <BarCodeScanner
                      onBarCodeRead={this._handleBarCodeRead}
                      style={{ height: 200 }}
                  />
              }
          </View>
          <ScrollView>
            <List>
            { this.state.barcodesListShow.map((item) => (
            <ListItem
                key={item.data}
                title={item.data}
                onPress ={()=> this._delete(item)}
                leftIcon={{name: 'barcode-scan',type:'material-community',color:'#000'}}
                subtitle={item.type}
                rightIcon={{name: 'close-box-outline',type:'material-community',color:'#000'}}
            />
            )) }
          </List>
          </ScrollView>
      </View>
    );
  }
  _handleBarCodeRead = data => {
    Vibration.vibrate(100);
      let st = true;
      for(let i=0;i<this.state.barcodesList.length;i++){
        if(this.state.barcodesList[i].data == data.data){
            st=false;
        }
      }
      if(st){
        this.state.barcodesList.push(data);
        this.setState({barcodesListShow : this.state.barcodesList});
      }else{
          console.log('alerdy scanned.');
      }
  };

  _delete = (data) => {
    Alert.alert(
        'Info',
        'Do you want to deleate?',
        [
          {text: 'NO', onPress: () => console.log('Item Not Deleated.'), style: 'cancel'},
          {text: 'YES', onPress: () => {
            for(let i=0;i<this.state.barcodesList.length;i++){
                if(this.state.barcodesList[i].data == data.data){
                    this.state.barcodesList.splice(i,1);
                    this.setState({barcodesListShow : this.state.barcodesList});
                    break;
                }
              }
          }},
        ]
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
});

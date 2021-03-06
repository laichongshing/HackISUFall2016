import React, { Component, CameraRoll } from 'react';
import Home from './../component/Home.js';
import ImagePicker from 'react-native-image-picker';
import { StyleSheet, Picker } from 'react-native';
import CaptionContainer from './CaptionContainer';
var Platform = require('react-native').Platform;

export default class HomeContainer extends Component {
  constructor() {
    super();
    this.state = {
    imageSource:'',
      tagText: '',
      captionType: 'dank',
      image: {data: ''},
    };
    this.selectImage = this.selectImage.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.changePicker = this.changePicker.bind(this);
  }

  selectImage(){
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else {

        // Do something with the selected image
        this.setState({imageSource: response.uri, image: response});

      }
    });
  }

  nextPage() {
    this.props.toRoute({
      name: "Here Do Be Meme",
      component: CaptionContainer,
      passProps: {
        image: this.state.image,
        imageSource : this.state.imageSource
      }
    });

  }

  changePicker(caption) {
    this.setState({captionType: caption});
  }

  render() {
    return <Home
      styles={styles}
      selectImage={this.selectImage}
      imageSource={this.state.imageSource}
      tagText={this.state.tagText}
      nextPage={this.nextPage}
      changePicker={this.changePicker}
      selectValue={this.state.captionType}
      />
  }
}

const fontFamily = Platform.OS === 'ios' ? "HelveticaNeue-CondensedBold" : 'impact';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
  },
  image: {
    width: 350,
    height:350,
    marginTop: 10,
    marginBottom: 10
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: fontFamily,
    fontSize: 42
  }
});

const options = {
  title: 'Select an Image',
  storageOptions: {
    skipBackup: true,
  },
  maxWidth: 480
};
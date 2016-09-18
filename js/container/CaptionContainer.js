import React, { Component } from 'react';
import Captioned from './../component/Captioned';
import { StyleSheet, Image, CameraRoll, ToastAndroid } from 'react-native';
import Sound from 'react-native-sound';
var Platform = require('react-native').Platform;
import RNViewShot from "react-native-view-shot";

const FBSDK = require('react-native-fbsdk');
const {
  ShareDialog,
} = FBSDK;

export default class CaptionContainer extends Component {
  constructor(props) {

    super(props);

    this.state = {
      tagText: '',
      sharePhotoContent: {
        contentType: 'photo',
        photos: []
      },
      sharePhoto : {
      imageUrl: '',// <diff_path_for_ios>
      userGenerated: false,
      caption: 'hello'
    }

    };
    this.saveImage = this.saveImage.bind(this);
    this.shareLinkWithShareDialog = this.shareLinkWithShareDialog.bind(this);
  }

  componentDidMount() {
    Clarifai.getTagsByImageBytes(this.props.image.data).then(
      (res) => {
        this.setState({tagText:res.results[0].result.tag.classes.toString()});
        let airhorn = new Sound('airhorn.mp3', Sound.MAIN_BUNDLE, (e) => {
          if (e) {
            console.log('error');
          } else {
            console.log('duration', airhorn.getDuration());
            airhorn.play();
          }
        });
      },
      (error)=>{
        console.log(error);
      });
  }

  saveImage() {
      // console.log(this.refs.home.refs.imageMe);
      RNViewShot.takeSnapshot(this.refs.captioned.refs.memeImage, {
          format: "jpeg",
          quality: 0.8
      })
          .then(
              uri => CameraRoll.saveToCameraRoll(uri, 'photo'),

              error => console.log("Oops, snapshot failed")
          );
    ToastAndroid.show('Photo Saved', ToastAndroid.SHORT);
    }

  shareLinkWithShareDialog() {
    let thingyUri;
    RNViewShot.takeSnapshot(this.refs.captioned.refs.memeImage, {
      format: "jpeg",
      quality: 0.8
    }).then(
      uri => this.setState({sharePhoto : {
        imageUrl: uri,
        userGenerated: false,
        caption: 'Created using Aye Aye Caption'
      }})
    );
    let sendToFaceBook = this.state.sharePhotoContent;
    if (this.state.sharePhoto.imageUrl != undefined) {
      sendToFaceBook.photos = [this.state.sharePhoto];
      var tmp = this;
      ShareDialog.canShow(sendToFaceBook).then(
        function (canShow) {
          if (canShow) {
            return ShareDialog.show(sendToFaceBook);
          }
        }
      ).then(
        function (result) {
          if (result.isCancelled) {
            alert('Share cancelled');
          } else {
            alert('Share success with postId: '
              + result.postId);
          }
        },
        function (error) {
          alert('Share fail with error: ' + error);
        }
      );
    }
  }
  render() {
    // console.log('TAG TEXT: ' + this.state.tagText);
    var captions = getCaptions(this.state.result);
    console.log('image source: ' + this.props.imageSource);
    return <Captioned
      tagText={this.state.tagText}
      captions={captions}
      saveImage={this.saveImage}
      styles={styles}
      imageSource={this.props.imageSource}
      ref="captioned"
      facebookShare={this.shareLinkWithShareDialog}
    />;
  }
}

const fontFamily = Platform.OS === 'ios' ? "HelveticaNeue-CondensedBold" : 'impact';
const styles = StyleSheet.create({
  spinner : {
    width: 33,
    height: 33
  },
  container: {
    flex: 1,
    paddingTop: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#EEEEEE'
  },
  image: {
    width: 400,
    height: 400,
    marginTop: 5,
    alignItems: 'center',
    marginBottom: 50
  },
  backdropViewTop: {
    height: 400,
    width: 400,
    backgroundColor: 'rgba(0,0,0,0)',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  backdropViewBottom: {
    height: 200,
    width: 400,
    backgroundColor: 'black',
  },
  text: {
    fontSize: 54,
    fontFamily: fontFamily,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    color: 'white',
    textShadowOffset: {
      width: 4,
      height: 4
    },
    textShadowRadius: 9,
    textShadowColor: '#000'
  }
});

function getCaptions(result) {
  var body = JSON.stringify({
    result: result
  });
  console.log(body);
  // return [
  //   {
  //     "topText": "Something",
  //     "bottomText": "BottomText"
  //   }
  // ];
  return fetch('https://captionserver.herokuapp.com/api/captions', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: body
  })
}
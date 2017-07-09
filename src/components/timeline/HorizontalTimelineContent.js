import React from 'react';
import PropTypes from 'prop-types';
//import SwipeableViews from 'react-swipeable-views';
import Divider from 'material-ui/Divider';
//import IconButton from 'material-ui/IconButton';
import {lightBlue300} from 'material-ui/styles/colors';
import HorizontalTimeline from 'react-horizontal-timeline';
import {Card, CardActions, CardHeader, CardMedia,CardText} from 'material-ui/Card';
import { Grid, Row, Cell } from 'react-inline-grid';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {ActionThumbUp} from '../../styledcomponents/SvgIcons.js';
import {notify} from 'react-notify-toast';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
//import Dropzone from 'react-dropzone'
// import ImagesUploader from 'react-images-uploader';
// import 'react-images-uploader/styles.css';
// import 'react-images-uploader/font.css';
//import HorizontalTimelineConfigurator from './HorizontalTimelineConfigurator';
// import '../../../node_modules/react-dropzone-component/styles/filepicker.css';
// import '../../../node_modules/dropzone/dist/min/dropzone.min.css';
// import DropzoneComponent from 'react-dropzone-component';



// var djsConfig = {
//             addRemoveLinks: true,
//             acceptedFiles: "image/jpeg,image/png",
//             autoProcessQueue: false
// }
// var eventHandlers = { addedfile: (file) => console.log(file) }



export default class HorizontalTimelineContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      previous: 0,
      showConfigurator: false,
      //Post config
      postlikes: '',
      description: [],
      postUrls: [],
      likeUrls: [],
      commentUrls: [],
      likeCounts: [],
      onclickcolor: '',
      commentText: '',
      Dialogopen: false,
      DialogCommentBox: false,
      likedUsers: [],
      comments:[],
      commentBox:[],
      //Upload config
      file: '',
      filebase64: '',
      imagePreviewUrl: '',
      buttonDisabled: false,
      response: '',
      message:'',
      isDataLoaded: true,

      // timelineConfig
      minEventPadding: 20,
      maxEventPadding: 120,
      linePadding: 100,
      labelWidth: 100,
      fillingMotionStiffness: 150,
      fillingMotionDamping: 20,
      slidingMotionStiffness: 150,
      slidingMotionDamping: 25,
      stylesBackground: '#ffffff',
      stylesForeground: '#7b9d6f',
      stylesOutline: '#dfdfdf',
      isTouchEnabled: true,
      isKeyboardEnabled: true,
      isOpenEnding: true,
      isOpenBeginning: true,
    };
    this.getPosts = this.getPosts.bind(this);
    this.loadTimeline = this.loadTimeline.bind(this);
    this.getLikes = this.addLikes.bind(this);
    this._handleImageChange = this._handleImageChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this.getLikedUsers = this.getLikedUsers.bind(this);
    this.getComments = this.getComments.bind(this);
  }
  // handleFileAdded(file) {
  //       console.log(file);
  //   }
  //
  //   handlePost() {
  //       this.dropzone.processQueue();
  //   }

  static propTypes = {
    content: PropTypes.arrayOf(PropTypes.object).isRequired
  }

  componentWillMount() {
    this.dates = this.props.content.map((entry) => entry.date);
    this.getPosts(0)
  }

  componentWillReceiveProps(nextProps) {
    this.dates = nextProps.content.map((entry) => entry.date);
  }

  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      console.log("inside reader load end")
      this.setState({
        file: file,
        imagePreviewUrl: reader.result,
        filebase64: reader.result.split(',').pop()
      });
    }

    reader.readAsDataURL(file)
  }

  _handleSubmit(e) {
    e.preventDefault();
    // TODO: do something with -> this.state.file
    console.log("filebase64" + this.state.filebase64)
      this.setState({ buttonDisabled: true });
      fetch('http://localhost:8080/users/timeline/upload', {
             method: 'POST',
             headers: {
                   'mode': 'cors',
                   'Content-Type': 'application/json'
               },
           credentials: 'include',
           body: JSON.stringify({
             file : this.state.filebase64,
             description: this.state.message,
          })
         }).then(response => {
           if(response.status === 200)
           {
              return response.text();
           }
           else{
             let myColor = { background: '#0E1717', text: "#FFFFFF",zDepth:'20'};
             notify.show("sorry something went wrong","custom",5000,myColor)
           }
         }).then(response => {
           console.log("response text is" + response)
           this.setState({
             response : response,
             buttonDisabled  : false,
             imagePreviewUrl: '',
             file: '',
             message: '',
           })
           notify.show("file upload successful","success")
           this.componentWillMount()
           console.log(this.state.response)
         })

  }


loadTimeline(buffer){
    buffer = []
    var i=0;
    console.log("inside loadTimeline")
if(this.state.postUrls.length!==0)
{ for (i=0;i<this.state.postUrls.length;i++){
    buffer.push(
        <Cell is="6 tablet-2" key={i}><div>
          <Card >
            <CardHeader
              title="Posted by"
              subtitle={this.state.postUrls[i].split('-')[9]}
            />
            <CardMedia>
              <img alt="loading" src={this.state.postUrls[i]}  style={{width:'100%',height:'380px'}}/>
            </CardMedia>
            <CardText style={{textAlign:'center'}}>
             {this.state.description[i]}
            </CardText>
            <CardActions>
              <div >
              <Grid>
              <Row is="start">
              <Cell is="stretch 7 tablet-2"><div>
              <div style={{marginLeft:'10%'}}>
             <a onClick={this.handleOpen.bind(this,i)}>  {this.state.likeCounts[i]} likes </a>
              </div>
              </div></Cell>
              <Cell is="stretch 5 tablet-2"><div>
              <div style={{marginLeft:'10%'}}>
             <a onClick={this.handleCommentBoxOpen.bind(this,i)}> View Comments</a>
              </div>
              </div></Cell>
              </Row>
              </Grid>
              <Grid>
              <Row is="start">
              <Cell is="stretch 6 tablet-2"><div>
              <FlatButton type="button" label="Like" onClick={this.addLikes.bind(this,i)} fullWidth={true} icon={<ActionThumbUp color={lightBlue300} />}/>
              </div></Cell>
              <Cell is="stretch 6 tablet-2"><div>
              <FlatButton type="submit" label="Comment" fullWidth={true} onClick={this.showCommentBox.bind(this,i)} />
              </div></Cell>
              </Row>
              </Grid>
              </div>
            </CardActions>
             {this.state.commentBox[i]}
          </Card>
       </div></Cell>
     )
   }
 }else{
   buffer.push(
     <div key={i}><p>No posts on this day!!! </p></div>
   )
 }
   return buffer
  }

 handleCommentBoxOpen(i){
   console.log("inside handleOpen");
    this.getComments(i)
 }

  handleOpen = (i) => {
     console.log("inside handleOpen");
      this.getLikedUsers(i)
    };

    handleClose = () => {
      this.setState({Dialogopen: false,
                     DialogCommentBox: false});
    };

showCommentBox(i){
  var commentBox = []
  commentBox[i]= <div style={{display:'flex',marginLeft:'5%'}}>
                          <TextField
                          hintText="Say Something"
                          onChange = {this.handleCommentChange.bind(this)}
                          multiLine={true}
                          rows={1}
                          rowsMax={4}
                          style={{width:'70%'}}
                          />
                          <FlatButton label="comment" type="button" onClick ={this.postComment.bind(this,i)} />
                          </div>

  this.setState({
    commentBox: commentBox,
  })
}
postComment(i){
  console.log("value of I is" + i , "value of commentUrls" + this.state.commentUrls)
  fetch(this.state.commentUrls[i], {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
       credentials: 'include',
       body: JSON.stringify({
         comment: this.state.commentText
      })
     }).then(response => {
       if(response.status === 200)
       {
          notify.show("Comment posted successfully","success")
          this.setState({
            commentBox: []
          })
          this.getPosts(this.state.value)
       }
       else{
         let myColor = { background: '#0E1717', text: "#FFFFFF",zDepth:'20'};
         notify.show("sorry something went wrong","custom",5000,myColor)
       }
     })
}

getComments(i){
  var parsedComments = this.state.response[i].comments
  var parsedMessages = []
  var parsedUsers = []
  var comments = []
  for(let j=0;j<parsedComments.length;j++){
   parsedMessages[j] = parsedComments[j].comment
   parsedUsers[j] =  parsedComments[j].user.firstName
   comments[j] = <div key={j}><p> {parsedUsers[j]}: {parsedMessages[j]}</p> </div>
 }

 this.setState({
 DialogCommentBox: true,
 comments: comments
 })
}

getLikedUsers(i){
  var likeUrl = this.state.likeUrls[i]
  fetch(likeUrl+'/likedusers',{
    credentials: 'include',
    method: 'GET'
  }).then(response => {
    if(response.status===200)
    return response.json()
  }).then(response =>{
     console.log("respose is" + JSON.stringify(response.length) )
     var likedusers = []
     if(response.length)
     {
      // likedusers = response.slice()
       for(var j=0 ; j<response.length ; j++)
       {
         likedusers[j] = <div> {response[j]} <br /> </div>
       }
     }
     else{
       console.log("inside else")
       likedusers[0] = 'No one Liked this post yet'
    }
    console.log("likedUsers" + likedusers)
   this.setState({
   Dialogopen: true,
   likedUsers: likedusers
   })
   })
}

  disLikes(i){
    console.log("inside disLikes" + this.state.likeUrls)
    var likeUrl = this.state.likeUrls[i]
      fetch(likeUrl+'/unlike',{
        credentials: 'include',
        method: 'GET'
      }).then(response => {
        if(response.status===200)
        return response.text()
      }).then(response =>{
         console.log("respose is" + response )
         var postlikes = this.state.likeCounts.slice()
         postlikes[i] = response.split(' ').pop()
         this.setState({
         likeCounts: postlikes
         })
       })
}

  addLikes(i){
   console.log("inside addLikes" + this.state.likeUrls)
   var likeUrl = this.state.likeUrls[i]
     fetch(likeUrl,{
       credentials: 'include',
       method: 'GET'
     }).then(response => {
       if(response.status===200)
       return response.text()
     }).then(response =>{
        console.log("respose is" + response )
        if(response === "already liked")
        this.disLikes(i)
        else{
          var postlikes = this.state.likeCounts.slice()
          postlikes[i] = response.split(' ').pop()
          this.setState({
          likeCounts: postlikes
          })
      }
     })
  }

  getPosts(index){

      console.log("get posts index" + index ,"previous" + this.state.previous)
      console.log('date is' + this.dates[index].toISOString().split('T')[0]);
      fetch('http://localhost:8080/users/timeline/posts?date='+this.dates[index].toISOString().split('T')[0],{
        credentials: 'include',
        method: 'GET'
     }).then(response => {
       console.log("status is" + response.status);
     //  console.log("response without json is" + response.text())
       return response.json()
     }).then(response => {
       //console.log("response is " + response)
       //console.log("response content is" + response.length)
       var newdescription = []
       var newpostUrls = []
       var newlikeUrls = []
       var newcommentUrls = []
       var newlikeCounts = []

       for(let i=0;i<response.length;i++)
        {
          newdescription.push(response[i].description)
          newpostUrls.push(response[i].postUrl)
          newlikeUrls.push(response[i].likeUrl)
          newcommentUrls.push(response[i].commentUrl)
          newlikeCounts.push(response[i].likes)

        }
        this.setState({
          response: response,
          value: index,
          previous: this.state.value,
          description: newdescription,
          postUrls: newpostUrls,
          likeUrls: newlikeUrls,
          commentUrls: newcommentUrls,
          likeCounts: newlikeCounts,

        })
        console.log("responses are" + newcommentUrls  ,"postUrl" + newpostUrls, "likes" +newlikeCounts)

      })

  }

  handleCommentChange = (e) => this.setState({commentText:e.target.value});
  handleChange = (e) => this.setState({message:e.target.value});

  render() {
    const state = this.state;
    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img  src={imagePreviewUrl} alt="loading" style={{width:'15%', height: '80px'}}/>);
    }
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />]
    var buffer=[];

    // const config = this.componentConfig;
    //     const djsConfig = this.djsConfig;
    //
    //     // For a list of all possible events (there are many), see README.md!
    //     const eventHandlers = {
    //         init: dz => this.dropzone = dz,
    //         addedfile: this.handleFileAdded.bind(this)
    //     }
    return (
      <div>
     <div  style={{textAlign:'center'}}>
    {/* <Grid>
     <Row is="center">
     <Cell is="2 tablet-2"><div>
     <DropzoneComponent config={config} eventHandlers={eventHandlers} djsConfig={djsConfig} />
             <br /> <br />
        </div></Cell>
      <Cell is="2 tablet-2"><div>
        <RaisedButton label="Upload"onClick={this.handlePost.bind(this)}></RaisedButton>
      </div></Cell>
        </Row>
        </Grid>*/}
        <br /> <br />
        <TextField
        hintText="I guess you might wanna share something"
        value = {this.state.message}
        onChange = {this.handleChange.bind(this)}
        multiLine={true}
        rows={2}
        rowsMax={4}
        style={{width:'60%'}}
        />
        <Grid>
        <Row is="center">
        <Cell is="6 tablet-6"><div>
        <input type="file" onChange={this._handleImageChange} />
        </div></Cell>
        <Cell is="4 tablet-4"><div>
        <RaisedButton type="submit" label="Post"  disabled={this.state.buttonDisabled} onClick={this._handleSubmit} />
        </div></Cell>

        </Row>
        </Grid>
        <br />
        {$imagePreview}
        <br />
        </div>
<Divider />
        <div style={{ width: '80%', height: '100px', margin: '0 auto' }}>
          <HorizontalTimeline
            fillingMotion={{ stiffness: state.fillingMotionStiffness, damping: state.fillingMotionDamping }}
            index={this.state.value}
            indexClick={this.getPosts.bind(this)}
            labelWidth={state.labelWidth}
            linePadding={state.linePadding}
            maxEventPadding={state.maxEventPadding}
            minEventPadding={state.minEventPadding}
            slidingMotion={{ stiffness: state.slidingMotionStiffness, damping: state.slidingMotionDamping }}
            styles={{
              background: state.stylesBackground,
              foreground: state.stylesForeground,
              outline: state.stylesOutline
            }}
            values={ this.dates }
            isOpenEnding={state.isOpenEnding}
            isOpenBeginning={state.isOpenBeginning}
          />
        </div>
        <Dialog
              title="Liked Users"
              modal={false}
              actions={actions}
              open={this.state.Dialogopen}
              onRequestClose={this.handleClose}
            >
              {this.state.likedUsers}
        </Dialog>

        <Dialog
              title="Comments"
              modal={false}
              actions={actions}
              open={this.state.DialogCommentBox}
              onRequestClose={this.handleClose}
            >
              {this.state.comments}
        </Dialog>

        <div>
            <Grid>
            <Row is="center">
            {this.loadTimeline(buffer)}
            </Row>
            </Grid>
            </div>
        </div>
    );
  }
}

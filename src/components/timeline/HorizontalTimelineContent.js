import React from 'react';
import PropTypes from 'prop-types';
import Divider from 'material-ui/Divider';
import {lightBlue300,redA700} from 'material-ui/styles/colors';
import HorizontalTimeline from 'react-horizontal-timeline';
import {Card, CardActions, CardHeader, CardMedia,CardText} from 'material-ui/Card';
import { Grid, Row, Col } from 'react-flexbox-grid';
import FlatButton from 'material-ui/FlatButton';
import {ActionThumbUp,CommunicationComment,NavigationClose} from '../../styledcomponents/SvgIcons.js';
import {notify} from 'react-notify-toast';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import '../../styles/student-adda.css';
var properties = require('../properties.json');

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
      postOwners: [],
      postOwnerEmails: [],
      postOwnerPics: [],
      likeUrls: [],
      commentUrls: [],
      likeCounts: [],
      fileNames: [],
      onclickcolor: '',
      commentText: '',
      Dialogopen: false,
      DialogCommentBox: false,
      likedUsers: [],
      comments:[],
      commentBox:[],
      isprofilepicchange: [],
      currentIndex: 0,
      //Upload config
      file: '',
      filebase64: '',
      imagePreviewUrl: '',
      buttonDisabled: false,
      DialogconfirmDelete: false,
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
    this.deletePost = this.deletePost.bind(this);
    this.getComments = this.getComments.bind(this);
    this.Enter = this.Enter.bind(this);
  }

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
    var c = document.getElementById('myCanvas');
    var ctx = c.getContext('2d');
    let reader = new FileReader();
    let file = e.target.files[0];
    var canvas = document.getElementById('myCanvas');

    reader.onload = (event) => {
      var img = new Image();
      img.onload = function(){
          c.width = img.width;
          c.height = img.height;
          ctx.drawImage(img,0,0);
          canvas = document.getElementById('myCanvas');
          this.setState({
            file: file,
            imagePreviewUrl: reader.result,
            filebase64:canvas.toDataURL('image/jpeg',0.1).split(',').pop(),
            imageDialog : true,
          });
      }.bind(this)
      img.src = event.target.result;

    }
    if(file)
    {
    reader.readAsDataURL(file)
  }
  }
  Enter(event){
    if(event.key === 'Enter'){
      this._handleSubmit(event);
    }
  }

  _handleSubmit(e) {
    e.preventDefault()
    // TODO: do something with -> this.state.file
     var trimmedmessage = this.state.message.replace(/\s/g,'')
    if(this.state.filebase64 === '' && trimmedmessage === '')
    {
      notify.show("Please type something","error")
    }else{
      this.setState({ buttonDisabled: true });
      fetch('http://'+properties.getHostName+':8080/users/timeline/upload', {
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
           this.setState({
             response : response,
             buttonDisabled  : false,
             imagePreviewUrl: '',
             file: '',
             message: '',
           })
           notify.show("Post uploaded successfully","success")
           this.componentWillMount()
         })

  }
}
deletePostConfirm(i){
  this.setState({
    DialogconfirmDelete: true,
    currentIndex: i,
  })
}
deletePost(){
  fetch('http://'+properties.getHostName+':8080/users/timeline/posts/'+this.state.fileNames[this.state.currentIndex]+'/delete',{
    credentials: 'include',
    method: 'GET'
  }).then(response => {
    if(response.status===200)
    return response.text()
  }).then(response =>{
    if(response === "successfully deleted")
    {
     notify.show(response,"success")
     this.componentWillMount()
   }
   else{
     notify.show("sorry something went wrong please try again","error")
   }
   })
   this.setState({
     DialogconfirmDelete: false
   })
}
loadTimeline(buffer){
    buffer = []
    var i=0;
if(this.state.postUrls.length!==0)
{ for (i=0;i<this.state.postUrls.length;i++){
    var bufferImage = []
    if(this.state.postUrls[i] !== null)
    bufferImage.push(<img alt="loading" src={this.state.postUrls[i]} key={i} style={{width:'100%',height:'380px'}}/>)
    if( this.state.postOwnerEmails[i] === this.props.loggedinuser )
    {
      if(this.state.isprofilepicchange[i] === true){
        buffer.push(
            <Col xs={12} sm={12} md={10} lg={10} key={i}>
              <Card
              onExpandChange={this.deletePostConfirm.bind(this,i)}
              style={{borderRadius:"1.5em"}}
              >
                <CardHeader
                  title={this.state.postOwners[i]}
                  subtitle="Changed his profile picture"
                  avatar={this.state.postOwnerPics[i]}
                  showExpandableButton={true}
                  closeIcon={<NavigationClose color={redA700} viewBox="0 0 30 30" />}
                  openIcon={<NavigationClose color={redA700} viewBox="0 0 30 30"/>}
                />
                <CardMedia>
                   {bufferImage}
                </CardMedia>
                <CardText style={{textAlign:'center'}}>
                 {this.state.description[i]}
                </CardText>
                <CardActions>
                  <div >
                  <Grid fluid>
                  <Row center="xs" between="xs">
                  <Col xs>
                 <a onClick={this.handleOpen.bind(this,i)}>  {this.state.likeCounts[i]} likes </a>
                 </Col>
                  <Col xs>
                 <a onClick={this.handleCommentBoxOpen.bind(this,i)}> View Comments</a>
                 </Col>
                  </Row>
                  </Grid>
                  <Grid fluid>
                  <Row >
                  <Col xs>
                  <FlatButton type="button" label="Like" onClick={this.addLikes.bind(this,i)} fullWidth={true} icon={<ActionThumbUp color={lightBlue300} viewBox="0 0 30 30"/>}/>
                  </Col>
                  <Col xs>
                  <FlatButton type="submit" label="Comment" fullWidth={true}  onClick={this.showCommentBox.bind(this,i)} icon={<CommunicationComment color={lightBlue300} viewBox="0 0 30 30"/>}/>
                  </Col>
                  </Row>
                  </Grid>
                  </div>
                </CardActions>
                 {this.state.commentBox[i]}
              </Card>
              <br />
           </Col>)
      }
    else{
      buffer.push(
        <Col xs={12} sm={12} md={10} lg={10} key={i}>
          <Card
          onExpandChange={this.deletePostConfirm.bind(this,i)}
          style={{borderRadius:"1.5em"}}
          >
            <CardHeader
              title="Posted by"
              subtitle={this.state.postOwners[i]}
              avatar={this.state.postOwnerPics[i]}
              showExpandableButton={true}
              closeIcon={<NavigationClose color={redA700} viewBox="0 0 30 30"/>}
              openIcon={<NavigationClose color={redA700} viewBox="0 0 30 30"/>}
            />
            <CardMedia>
               {bufferImage}
            </CardMedia>
            <CardText style={{textAlign:'center'}}>
             {this.state.description[i]}
            </CardText>
            <CardActions>
              <div >
              <Grid fluid>
              <Row center="xs" between="xs">
              <Col xs>
             <a onClick={this.handleOpen.bind(this,i)}>  {this.state.likeCounts[i]} likes </a>
              </Col>
              <Col xs>
             <a onClick={this.handleCommentBoxOpen.bind(this,i)}> View Comments</a>
              </Col>
              </Row>
              </Grid>
              <Grid fluid>
              <Row >
              <Col xs>
              <FlatButton type="button" label="Like" onClick={this.addLikes.bind(this,i)} fullWidth={true} icon={<ActionThumbUp color={lightBlue300} viewBox="0 0 30 30" />}/>
              </Col>
              <Col xs>
              <FlatButton type="submit" label="Comment" fullWidth={true}  onClick={this.showCommentBox.bind(this,i)} icon={<CommunicationComment color={lightBlue300} viewBox="0 0 30 30" />}/>
              </Col>
              </Row>
              </Grid>
              </div>
            </CardActions>
             {this.state.commentBox[i]}
          </Card>
          <br />
       </Col>
     )
   }}else{
     if(this.state.isprofilepicchange[i] === true){
      buffer.push( <Col xs={12} sm={12} md={10} lg={10} key={i}>
         <Card
         style={{borderRadius:"1.5em"}}
         >
           <CardHeader
             title={this.state.postOwners[i]}
             subtitle="Changed his profile picture"
             avatar={this.state.postOwnerPics[i]}
           />
           <CardMedia>
              {bufferImage}
           </CardMedia>
           <CardText style={{textAlign:'center'}}>
            {this.state.description[i]}
           </CardText>
           <CardActions>
             <div >
             <Grid fluid>
             <Row center="xs" between="xs">
             <Col xs>
            <a onClick={this.handleOpen.bind(this,i)}>  {this.state.likeCounts[i]} likes </a>
            </Col>
            <Col xs>
            <a onClick={this.handleCommentBoxOpen.bind(this,i)}> View Comments</a>
            </Col>
             </Row>
             </Grid>
             <Grid fluid>
             <Row >
             <Col xs>
             <FlatButton type="button" label="Like" onClick={this.addLikes.bind(this,i)} fullWidth={true} icon={<ActionThumbUp color={lightBlue300} viewBox="0 0 30 30" />}/>
             </Col>
             <Col xs>
             <FlatButton type="submit" label="Comment" fullWidth={true}  onClick={this.showCommentBox.bind(this,i)} icon={<CommunicationComment color={lightBlue300} viewBox="0 0 30 30" />}/>
             </Col>
             </Row>
             </Grid>
             </div>
           </CardActions>
            {this.state.commentBox[i]}
         </Card>
         <br />
      </Col>)
    }else{
     buffer.push(
         <Col xs={12} sm={12} md={10} lg={10} key={i}>
           <Card
           style={{borderRadius:"1.5em"}}
           >
             <CardHeader
               title="Posted by"
               subtitle={this.state.postOwners[i]}
               avatar={this.state.postOwnerPics[i]}
             />
             <CardMedia>
                {bufferImage}
             </CardMedia>
             <CardText style={{textAlign:'center'}}>
              {this.state.description[i]}
             </CardText>
             <CardActions>
               <div >
               <Grid fluid>
               <Row center="xs" between="xs" >
               <Col xs>
              <a onClick={this.handleOpen.bind(this,i)}>  {this.state.likeCounts[i]} likes </a>
              </Col>
              <Col xs>
              <a onClick={this.handleCommentBoxOpen.bind(this,i)}> View Comments</a>
              </Col>
               </Row>
               </Grid>
               <Grid fluid>
               <Row >
               <Col xs>
               <FlatButton type="button" label="Like" onClick={this.addLikes.bind(this,i)} fullWidth={true} icon={<ActionThumbUp color={lightBlue300} viewBox="0 0 30 30"/>}/>
               </Col>
               <Col xs>
               <FlatButton type="submit" label="Comment" fullWidth={true}  onClick={this.showCommentBox.bind(this,i)} icon={<CommunicationComment color={lightBlue300} viewBox="0 0 30 30"/>}/>
               </Col>
               </Row>
               </Grid>
               </div>
             </CardActions>
              {this.state.commentBox[i]}
           </Card>
           <br />
        </Col>
      )
   }
 }
   }
 }else{
   buffer.push(
     <div key={i}><p style={{textAlign:"center"}}>No posts on this day!!! </p></div>
   )
 }
   return buffer
  }

 handleCommentBoxOpen(i){
    this.getComments(i)
 }

  handleOpen = (i) => {
      this.getLikedUsers(i)
    };

    handleClose = () => {
      this.setState({Dialogopen: false,
                     DialogCommentBox: false,
                   DialogconfirmDelete: false,});
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
  if(parsedComments.length!==0)
  {
  for(var j=0;j<parsedComments.length;j++){
   parsedMessages[j] = parsedComments[j].comment
   parsedUsers[j] =  parsedComments[j].user.firstName
   comments[j] = <div key={j} className="timeline">
                  <ul>
                 <li> <p> <span className="fontStyle">{parsedUsers[j]}:</span><span className="messageStyle">{parsedMessages[j]}</span></p> </li>
                 </ul>
                 </div>
 }
}else{
   comments[0] = 'No Comments on This post yet'
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
     var likedusers = []
     if(response.length)
     {
       for(var j=0 ; j<response.length ; j++)
       {
         likedusers[j] = <div className="timeline"> <ul><li><p className="fontStyle"> {response[j]} </p></li></ul> <br /></div>
       }
     }
     else{
       likedusers[0] = 'No one Liked this post yet'
    }
   this.setState({
   Dialogopen: true,
   likedUsers: likedusers
   })
   })
}

  disLikes(i){
    var likeUrl = this.state.likeUrls[i]
      fetch(likeUrl+'/unlike',{
        credentials: 'include',
        method: 'GET'
      }).then(response => {
        if(response.status===200)
        return response.text()
      }).then(response =>{
         var postlikes = this.state.likeCounts.slice()
         postlikes[i] = response.split(' ').pop()
         this.setState({
         likeCounts: postlikes
         })
       })
}

  addLikes(i){
   var likeUrl = this.state.likeUrls[i]
     fetch(likeUrl,{
       credentials: 'include',
       method: 'GET'
     }).then(response => {
       if(response.status===200)
       return response.text()
     }).then(response =>{
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

      var month = ('0' + (this.dates[index].getMonth() + 1)).slice(-2);
      var date = ('0' + this.dates[index].getDate()).slice(-2);
      var year = this.dates[index].getFullYear();
      var shortdate = year + "-" + month + "-" + date

      fetch('http://'+properties.getHostName+':8080/users/timeline/posts?date='+shortdate,{
        credentials: 'include',
        method: 'GET'
     }).then(response => {
       return response.json()
     }).then(response => {
       var newdescription = []
       var newpostUrls = []
       var newlikeUrls = []
       var newcommentUrls = []
       var newlikeCounts = []
       var newpostOwners = []
       var newpostOwnerEmails = []
       var newpostOwnerPics =[]
       var newfileNames = []
       var newisprofilepicchange = []

       for(let i=0;i<response.length;i++)
        {
          newfileNames.push(response[i].filename)
          newdescription.push(response[i].description)
          newpostUrls.push(response[i].postUrl)
          newlikeUrls.push(response[i].likeUrl)
          newcommentUrls.push(response[i].commentUrl)
          newlikeCounts.push(response[i].likes)
          newpostOwners.push(response[i].owner)
          newpostOwnerEmails.push(response[i].uploadeduser.email)
          newpostOwnerPics.push(response[i].propicUrl)
          newisprofilepicchange.push(response[i].isprofilepicchange)
        }
        this.setState({
          fileNames:newfileNames,
          response: response,
          value: index,
          previous: this.state.value,
          description: newdescription,
          postUrls: newpostUrls,
          likeUrls: newlikeUrls,
          commentUrls: newcommentUrls,
          likeCounts: newlikeCounts,
          postOwners: newpostOwners,
          postOwnerEmails: newpostOwnerEmails,
          postOwnerPics: newpostOwnerPics,
          isprofilepicchange: newisprofilepicchange,
        })
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

    const actions1 = [
      <FlatButton
        label="Confirm"
        primary={true}
        onTouchTap={this.deletePost}
      />,
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />
    ]
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />]
    var buffer=[];

    return (
      <div>
     <div  style={{textAlign:'center'}} className="timeline">
        <br /> <br />
        <TextField
        hintText="I guess you might wanna share something"
        value = {this.state.message}
        onChange = {this.handleChange.bind(this)}
        onKeyPress={this.Enter}
        multiLine={true}
        rows={2}
        rowsMax={4}
        style={{width:'60%'}}
        />
        <Grid fluid>
        <Row between="xs" middle="xs">
        <Col xs lgOffset={3}>
        <input type="file" onChange={this._handleImageChange} />
       </Col>
        <Col xs>
        <FlatButton  className="PostButton" type="submit" label="Post"  disabled={this.state.buttonDisabled} onClick={this._handleSubmit} />
        </Col>

        </Row>
        </Grid>
        <br />
        {$imagePreview}
        <br />
        </div>
<Divider />
        <div style={{ width: '90%', height: '100px', margin: '0 auto' }}>
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
              autoScrollBodyContent={true}
              titleStyle={{textAlign:"center",color: "rgb(162,35,142)"}}
              onRequestClose={this.handleClose}
            >
              {this.state.likedUsers}
        </Dialog>

        <Dialog
              title="Comments"
              modal={false}
              actions={actions}
              open={this.state.DialogCommentBox}
              autoScrollBodyContent={true}
              titleStyle={{textAlign:"center",color: "rgb(162,35,142)"}}
              onRequestClose={this.handleClose}
            >
              {this.state.comments}
        </Dialog>
        <Dialog
              title="Are you sure you want to delete this post"
              modal={false}
              actions={actions1}
              open={this.state.DialogconfirmDelete}
              autoScrollBodyContent={true}
              titleStyle={{textAlign:"center",color: "rgb(162,35,142)"}}
              onRequestClose={this.handleClose}
            >
        </Dialog>

        <div>
            <Grid fluid>
            <Row around="xs">
            {this.loadTimeline(buffer)}
            </Row>
            </Grid>
            <br /><br />
            </div>
        </div>
    );
  }
}

import React, { Component } from 'react';
import {Body} from './main.js'
import FlatButton from 'material-ui/FlatButton';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import {NavAppBar} from '../styledcomponents/NavAppBar.js'
import {notify} from 'react-notify-toast';
import { withRouter } from 'react-router';
import {lightBlue100,blue500} from 'material-ui/styles/colors';
import '../styles/student-adda.css';
import CircularProgress from 'material-ui/CircularProgress';
import PropTypes from 'prop-types';
import {AddImageIcon} from '../styledcomponents/SvgIcons.js'
import AvatarEditor from 'react-avatar-editor';
import Dialog from 'material-ui/Dialog';
import Slider from 'material-ui/Slider';
import {Link} from 'react-router-dom';
import StudentDashboard from './dashboard/studentdashboard.js'
import TeacherDashboard from './dashboard/teacherdashboard.js'
var properties = require('./properties.json')


class DashboardLaoyout extends Component{

  constructor() {
    super();
    this.state = {
      open : true,
      docked: true,
      width : 250,
      propiclink : '',
      username : '',
      branch:'',
      fullImage: '',
      file: '',
      filebase64: '',
      imagePreviewUrl: '',
      imageDialog: false,
      secondSlider:1,
      userrole: '',
      loggedinuseremail: '',
      batches: [],
      startyear: 0,
      section: '',
      notificationsCount: 0,
      lastName: '',
      sem: 0,
      dob:'',
     }
     this.handleLogout = this.handleLogout.bind(this);
     this.handleDialogclose = this.handleDialogclose.bind(this)
     this._handleImageChange = this._handleImageChange.bind(this)
     this.saveProPictoDB = this.saveProPictoDB.bind(this)
     this.uploadProPic = this.uploadProPic.bind(this)
     this.postTimeline = this.postTimeline.bind(this)
     this.dashboard = this.dashboard.bind(this)
     this.handleToggle = this.handleToggle.bind(this)
     this.getNotificationCount = this.getNotificationCount.bind(this)
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
          fullImage:canvas.toDataURL('image/jpeg',0.4).split(',').pop(),
          imageDialog : true,
        });
    }.bind(this)
    img.src = event.target.result;

  }

  reader.readAsDataURL(file)
}
saveProPictoDB(){
if (this.editor) {
  const canvas = this.editor.getImage()
  var data = canvas.toDataURL('image/jpeg',0.0001).split(',').pop()
  this.setState({
    filebase64: data,
  },function OnstateChange(){
  this.uploadProPic()
  })
}
}

uploadProPic(){
  fetch('http://'+properties.getHostName+':8080/user/update/profilepic', {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
       credentials: 'include',
       body: JSON.stringify({
         file : this.state.filebase64,
      })
     }).then(response => {
       if(response.status === 200)
       {
         notify.show("Avatar Changed successfully","success")
          return response.text();
       }
       else{
         let myColor = { background: '#0E1717', text: "#FFFFFF",zDepth:'20'};
         notify.show("sorry something went wrong","custom",5000,myColor)
       }
     }).then(response => {
       this.setState({
         imagePreviewUrl: '',
         imageDialog: false,
         file: '',
       },function OnstateChange(){
         this.postTimeline()
       })
     })
}
postTimeline(){
  fetch('http://'+properties.getHostName+':8080/users/timeline/upload', {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
       credentials: 'include',
       body: JSON.stringify({
         file : this.state.fullImage,
         description: "   " ,
         isprofilepicchange: true,
      })
     }).then(response => {
       if(response.status === 200)
       {
          notify.show("profilepic updated successfully")
       }
       else{
         let myColor = { background: '#0E1717', text: "#FFFFFF",zDepth:'20'};
         notify.show("sorry something went wrong","custom",5000,myColor)
       }
       //FIX THIS: reloading the whole page is not a good idea
       window.location.reload()
     })
}

handleDialogclose(){
  this.setState({
    imageDialog: false,
  })
}

handleLogout(){
  fetch('http://'+properties.getHostName+':8080/user/logout', {
           credentials: 'include',
           method: 'GET'
        }).then(response => {
           return response.text()
        }).then(response => {
          if(response){
            let myColor = { background: '#0E1717', text: "#FFFFFF" };
            notify.show('Logout Successful!','success',3000,myColor);
            this.setState({
              isLoggedIn : 'false',
              isLoaded : 'true'
            })
            this.context.router.history.push('/');
          }
        })
  }
dashboard(){
  if(this.state.userrole === 'student'){
    return(<StudentDashboard width={this.state.width} handleMobileToggle={this.handleMobileToggle}/>)
  }else if(this.state.userrole === 'teacher'){
    return(<TeacherDashboard width={this.state.width} batches={this.state.batches} handleMobileToggle={this.handleMobileToggle}/>)
  }
}

componentWillMount(){
  let width= window.innerWidth
  if(width<700){
    this.setState({
      open: false,
      docked: false,
    })
  }
  fetch('http://'+properties.getHostName+':8080/user/loggedin', {
           credentials: 'include',
           method: 'GET'
        }).then(response => {
          return response.json()
        }).then(response => {
          this.setState({
              username: response.firstName,
              loggedinuseremail : response.email,
              lastName: response.lastName,
              userrole: response.userrole,
              propiclink: response.normalpicUrl || response.googlepicUrl,
              startyear: response.startYear,
              branch: response.branch,
              dob: response.dob,
              section: response.section,
              batches: response.batches,
          },function(){
            this.getNotificationCount()
          })
        }).catch(response => {
        notify.show("Please login before viewing dashboard","error");
        this.context.router.history.push('/');
       });
}
getNotificationCount(){
  if(this.state.userrole === 'student')
  {
    fetch('http://'+properties.getHostName+':8080/user/notifications/unread',{
          credentials: 'include',
          method: 'GET'
        }).then(response =>{
            return response.text()
        }).then(response =>{
          this.setState({
            notificationsCount: response
          })
        })
  }
}

componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
}
componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
}
updateDimensions = () => {
  let width = window.innerWidth
  if(width<700){
    this.setState({
      open:false
    })
  }else{
    this.setState({
      open:true
    })
  }
}
handleMobileToggle =() => {
  if(!this.state.docked){
    this.setState((prevState,props) =>{
      return {
        open : !prevState.open
      }
    })
  }
}

handleToggle(){
  this.setState((prevState,props) =>{
    return {
      open : !prevState.open
    }
  })
}

handleSecondSlider = (event, value) => {
  this.setState({secondSlider: value});
};

setEditorRef = (editor) => this.editor = editor

render(){
  const actions = [
    <FlatButton
      label="Save"
      primary={true}
      onTouchTap={this.saveProPictoDB}
    />,
    <FlatButton
      label="Cancel"
      primary={true}
      onTouchTap={this.handleDialogclose}
    />]
if(this.state.userrole === ''){
return(<CircularProgress size={80} thickness={7} style={{marginLeft:"48%"}}/> )
}
else
{
  return(
<div>
    <NavAppBar
     toggle = {this.handleToggle}
     width = {this.state.width}
     open = {this.state.open}
     logout = {this.handleLogout}
     userrole = {this.state.userrole}
     notificationsCount = {this.state.notificationsCount}
     />
    <Drawer open={this.state.open} docked={this.state.docked} disableSwipeToOpen={true} width = {this.state.width} onRequestChange={(open) => this.setState({open})}>
    <div className="image-upload UserImageContainer">
    <div></div>
    <label htmlFor="file-input">
      <img src={this.state.propiclink}  alt="loading" className="ProfilePic"/>
    </label>
    <input type="file" id="file-input" onChange={this._handleImageChange}/>
    <canvas id="myCanvas" style={{display:"none"}}></canvas>
   </div>
    <br />
    <br />
    <Link to='/updateprofile'>
    <FlatButton label="Update Profile" onClick={this.handleMobileToggle}hoverColor ={lightBlue100} fullWidth={true} icon={<AddImageIcon  color={blue500}/>}/>
    </Link>
    <br />
<Divider />
   {this.dashboard()}
</Drawer>
<Dialog
      title="Change Your Avatar"
      modal={true}
      actions={actions}
      open={this.state.imageDialog}
      autoScrollBodyContent={true}
      titleStyle={{textAlign:'center'}}
      onRequestClose={this.handleDialogclose}
    >
    <Slider
        min={1}
        max={3}
        step={0.01}
        value={this.state.secondSlider}
        sliderStyle={{marginLeft:'20%',width:'60%'}}
        onChange={this.handleSecondSlider}
      />
    <AvatarEditor
       image={this.state.imagePreviewUrl}
       ref={this.setEditorRef}
       width={450}
       height={370}
       border={[30,30]}
       style={{marginLeft:'13%'}}
       borderRadius={500}
       color={[255, 255, 255, 0.6]} // RGBA
       scale={this.state.secondSlider}
     />
     <br /> <br />

</Dialog>
<Body
toggle = {this.handleToggle}
width = {this.state.width}
open = {this.state.open}
userrole = {this.state.userrole}
loggedinuser = {this.state.loggedinuseremail}
startyear = {this.state.startyear}
section = {this.state.section}
notificationsCount = {this.state.notificationsCount}
lastName = {this.state.lastName}
branch = {this.state.branch}
username = {this.state.username}
dob={this.state.dob}
/>
</div>
   )
}
}
}
DashboardLaoyout.contextTypes = {
    router: PropTypes.object
};

export default withRouter(DashboardLaoyout);
